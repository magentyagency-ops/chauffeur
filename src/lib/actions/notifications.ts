"use server";

import { createClient } from "@/lib/supabase/server";
import webpush from "web-push";

// Configurer web-push avec les clés VAPID
if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    'mailto:contact@privechauffeur.fr',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

export async function savePushSubscription(subscription: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Non authentifié" };

  // Vérifier si l'abonnement existe déjà pour éviter les doublons
  const { data: existing } = await supabase
    .from("push_subscriptions")
    .select("id")
    .eq("driver_id", user.id)
    .eq("subscription_json->>endpoint", subscription.endpoint)
    .single();

  if (existing) return { success: true };

  const { error } = await supabase.from("push_subscriptions").insert({
    driver_id: user.id,
    subscription_json: subscription
  });

  if (error) {
    console.error("Error saving push subscription:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function sendPushNotification(driverId: string, payload: { title: string; body: string; url?: string }) {
  const supabase = await createClient();
  
  const { data: subscriptions } = await supabase
    .from("push_subscriptions")
    .select("subscription_json")
    .eq("driver_id", driverId);

  if (!subscriptions || subscriptions.length === 0) return;

  const results = await Promise.all(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          sub.subscription_json as any,
          JSON.stringify(payload)
        );
        return { success: true };
      } catch (error: any) {
        if (error.statusCode === 410 || error.statusCode === 404) {
          // L'abonnement a expiré ou est invalide, on pourrait le supprimer ici
          console.log("Subscription expired, removing...");
        }
        return { success: false, error };
      }
    })
  );

  return results;
}
