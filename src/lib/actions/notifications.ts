"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
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

  console.log("Saving push sub for user:", user.id);

  // Chercher le profil du chauffeur pour avoir le bon ID
  const { data: profile, error: profileError } = await supabase
    .from("driver_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (profileError) {
    console.error("Profile error:", profileError);
    return { success: false, error: "Profil chauffeur non trouvé: " + profileError.message };
  }

  const driverId = profile?.id;
  if (!driverId) return { success: false, error: "Profil chauffeur non trouvé (data vide)" };

  // Forcer l'insertion simple
  const { error: insertError } = await supabase.from("push_subscriptions").insert({
    driver_id: driverId,
    subscription_json: subscription
  });

  if (insertError) {
    console.error("Insert error:", insertError);
    return { success: false, error: "Erreur d'écriture : " + insertError.message };
  }

  // Envoyer une notification de test immédiate
  setTimeout(() => {
    sendPushNotification(driverId, {
      title: "Notifications Activées ! ✅",
      body: "Vous recevrez désormais vos alertes ici.",
      url: "/dashboard"
    }).catch(console.error);
  }, 1000);

  return { success: true, driverId };
}

export async function sendPushNotification(driverId: string, payload: { title: string; body: string; url?: string }) {
  const supabase = createAdminClient();
  
  console.log("Attempting push to driver (Admin):", driverId);

  const { data: subscriptions, error: subError } = await supabase
    .from("push_subscriptions")
    .select("subscription_json")
    .eq("driver_id", driverId);

  if (subError) {
    console.error("Error fetching subscriptions:", subError);
    return;
  }

  if (!subscriptions || subscriptions.length === 0) {
    console.log("No subscriptions found for driver:", driverId);
    return;
  }

  console.log(`Found ${subscriptions.length} subscriptions for driver.`);

  const results = await Promise.all(
    subscriptions.map(async (sub, idx) => {
      try {
        console.log(`Sending notification to subscription ${idx}...`);
        const result = await webpush.sendNotification(
          sub.subscription_json as any,
          JSON.stringify(payload)
        );
        console.log(`Notification ${idx} sent successfully.`);
        return { success: true, result };
      } catch (error: any) {
        console.error(`Error sending notification ${idx}:`, error);
        return { success: false, error };
      }
    })
  );

  return results;
}
