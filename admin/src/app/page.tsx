'use client';

import { useEffect, useState } from 'react';
import { Shell } from '@/components/shell';
import { Card, ErrorBox, Stat, Tag } from '@/components/ui';
import { api } from '@/lib/api';

interface Stats {
  tenants: { total: number; active: number; thisMonth: number; change: number };
  users: { total: number };
  subscriptions: { active: number; pastDue: number };
  revenue: { total: number; thisMonth: number; currency: string };
  production: Record<string, number>;
  planBreakdown: Array<{ plan: string; count: number }>;
  signupTimeline: Array<{ month: string; count: number }>;
}

const PRODUCTION_LABELS: Record<string, string> = {
  websites: 'Sites web',
  publishedWebsites: 'Sites publiés',
  menus: 'Menus',
  posters: 'Affiches',
  images: 'Images',
  contents: 'Contenus',
};

export default function OverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get<Stats>('/admin/stats')
      .then(setStats)
      .catch((e) => setError(e.message));
  }, []);

  const money = (v: number, c: string) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: c }).format(v);

  const peak = stats ? Math.max(1, ...stats.signupTimeline.map((m) => m.count)) : 1;

  return (
    <Shell>
      <h1 className="mb-6 text-xl font-semibold">Vue d’ensemble</h1>
      {error && <ErrorBox message={error} />}
      {!stats && !error && <p className="text-sm text-gray-500">Chargement…</p>}

      {stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Stat
              label="Tenants"
              value={stats.tenants.total}
              hint={`${stats.tenants.active} actifs · ${stats.tenants.change >= 0 ? '+' : ''}${stats.tenants.change} ce mois`}
            />
            <Stat label="Utilisateurs" value={stats.users.total} />
            <Stat
              label="Abonnements actifs"
              value={stats.subscriptions.active}
              hint={stats.subscriptions.pastDue ? `${stats.subscriptions.pastDue} en impayé` : undefined}
            />
            <Stat
              label="Revenus encaissés"
              value={money(stats.revenue.total, stats.revenue.currency)}
              hint={`${money(stats.revenue.thisMonth, stats.revenue.currency)} ce mois`}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card className="p-5">
              <h2 className="mb-4 text-sm font-semibold">Inscriptions (6 mois)</h2>
              <div className="flex h-36 items-end gap-3">
                {stats.signupTimeline.map((m) => (
                  <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
                    <span className="text-xs tabular-nums text-gray-500">{m.count}</span>
                    <div
                      className="w-full rounded-t bg-gray-900"
                      style={{ height: `${Math.max(4, (m.count / peak) * 100)}%` }}
                    />
                    <span className="text-[11px] text-gray-500">{m.month}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <h2 className="mb-4 text-sm font-semibold">Répartition par plan</h2>
              <ul className="space-y-2">
                {stats.planBreakdown.map((p) => (
                  <li key={p.plan} className="flex items-center justify-between text-sm">
                    <Tag>{p.plan}</Tag>
                    <span className="tabular-nums text-gray-600">{p.count}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <Card className="p-5">
            <h2 className="mb-4 text-sm font-semibold">Production cumulée</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {Object.entries(stats.production).map(([key, value]) => (
                <div key={key}>
                  <p className="text-xl font-semibold tabular-nums">{value}</p>
                  <p className="text-xs text-gray-500">{PRODUCTION_LABELS[key] || key}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </Shell>
  );
}
