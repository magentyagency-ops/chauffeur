"use client";

import { useState, useEffect } from "react";
import { savePushSubscription } from "@/lib/actions/notifications";

export default function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      checkSubscription();
    }
  }, []);

  async function checkSubscription() {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    setIsSubscribed(!!subscription);
  }

  async function subscribeToPush() {
    setLoading(true);
    try {
      // Enregistrer le Service Worker si ce n'est pas déjà fait
      const registration = await navigator.serviceWorker.register('/sw.js');
      
      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!publicKey) throw new Error("VAPID public key missing");

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: publicKey
      });

      const result = await savePushSubscription(JSON.parse(JSON.stringify(subscription)));
      if (result.success) {
        setIsSubscribed(true);
        alert("Notifications activées !");
      } else {
        alert("Erreur lors de l'activation : " + result.error);
      }
    } catch (error) {
      console.error("Failed to subscribe to push:", error);
      alert("Impossible d'activer les notifications sur cet appareil.");
    } finally {
      setLoading(false);
    }
  }

  if (!isSupported) return null;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 flex items-center justify-between">
      <div>
        <h3 className="font-bold text-white">Notifications Mobile</h3>
        <p className="text-xs text-gray-400">Recevez une alerte sonore à chaque nouvelle course.</p>
      </div>
      <button
        onClick={subscribeToPush}
        disabled={isSubscribed || loading}
        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
          isSubscribed 
            ? "bg-green-500/10 text-green-500 border border-green-500/20 cursor-default" 
            : "bg-white text-black hover:scale-105"
        }`}
      >
        {loading ? "Chargement..." : isSubscribed ? "Notifications Activées" : "Activer"}
      </button>
    </div>
  );
}
