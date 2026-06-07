"use client";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Link from "next/link";

export default function SettingsPage() {
  return (
    <>
      <DashboardHeader title="Paramètres" />

      <main className="p-6 md:p-10 max-w-3xl mx-auto w-full space-y-10 pb-32">
        
        {/* Account */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold tracking-tight">Compte</h3>
          <div className="card p-6 space-y-4">
            <div className="space-y-2">
              <label className="label">Email</label>
              <input type="email" disabled defaultValue="jean.dupont@example.com" className="input opacity-50 cursor-not-allowed" />
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold tracking-tight">Notifications</h3>
          <div className="card divide-y divide-border overflow-hidden">
            <ToggleRow title="Nouvelles réservations" desc="Email et SMS pour chaque demande." active />
            <ToggleRow title="Rappels de course" desc="Alerte 1h avant le départ." active />
          </div>
        </section>

        {/* Aide & Tutoriel */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold tracking-tight">Aide & Tutoriel</h3>
          <div className="card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-[14px] font-bold">Revoir le tutoriel de bienvenue</p>
              <p className="text-[13px] text-muted mt-1">Repassez par les étapes clés pour apprendre à utiliser la plateforme et à partager votre QR code.</p>
            </div>
            <Link 
              href="/welcome"
              className="bg-white border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 rounded-full transition-all font-bold px-5 py-2.5 text-[13px] text-black text-center w-full sm:w-auto shrink-0"
            >
              Revoir le tutoriel
            </Link>
          </div>
        </section>

        {/* Danger */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-error tracking-tight">Zone de danger</h3>
          <div className="card p-6 border-error/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[13px] text-muted">Supprimer définitivement votre compte et toutes vos données.</p>
            <button className="btn-secondary !py-2 !px-4 !text-[12px] !text-error !border-error/20 hover:!bg-error/5 w-full sm:w-auto shrink-0">Supprimer</button>
          </div>
        </section>

        {/* Abonnement */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold tracking-tight">Abonnement</h3>
          <div className="card p-6 border-surface-alt flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-[14px] font-bold">Gérer mon abonnement</p>
              <p className="text-[13px] text-muted mt-1">Modifiez votre carte de crédit, téléchargez vos factures ou gérez votre forfait.</p>
            </div>
            <button 
              onClick={async () => {
                try {
                  const res = await fetch('/api/portal', { method: 'POST' });
                  const data = await res.json();
                  if (data.url) window.location.href = data.url;
                  else alert("Erreur lors de l'accès au portail.");
                } catch(e) {
                  console.error(e);
                  alert("Erreur");
                }
              }}
              className="btn-primary !py-2 !px-4 !text-[12px] w-full sm:w-auto shrink-0"
            >
              Portail Client
            </button>
          </div>
        </section>
      </main>
    </>
  );
}

function ToggleRow({ title, desc, active }: any) {
  return (
    <div className="p-5 flex items-center justify-between">
      <div>
        <div className="text-[14px] font-bold mb-0.5">{title}</div>
        <div className="text-[12px] text-muted">{desc}</div>
      </div>
      <div className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" defaultChecked={active} />
        <div className="w-10 h-6 bg-surface-alt border border-border rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-muted after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-success peer-checked:after:bg-white peer-checked:border-success"></div>
      </div>
    </div>
  );
}
