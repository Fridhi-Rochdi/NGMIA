'use client';

import { useEffect, useState } from 'react';
import { Shell } from '@/components/shell';
import { Card, ErrorBox, Tag } from '@/components/ui';
import { api } from '@/lib/api';

interface SubscriptionRow {
  id: string;
  tenant: { id: string; name: string; slug: string };
  planName: string;
  price: number;
  currency: string;
  status: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  invoiceCount: number;
}

const money = (value: number, currency: string) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(value);

export default function SubscriptionsPage() {
  const [rows, setRows] = useState<SubscriptionRow[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get<SubscriptionRow[]>('/admin/subscriptions')
      .then(setRows)
      .catch((e) => setError(e instanceof Error ? e.message : 'Erreur'));
  }, []);

  // Monthly recurring revenue counts only subscriptions that are actually billing.
  const mrr = (rows || [])
    .filter((row) => row.status === 'ACTIVE' || row.status === 'TRIALING')
    .reduce((sum, row) => sum + row.price, 0);

  return (
    <Shell>
      <div className="mb-6 flex items-baseline justify-between">
        <h1 className="text-xl font-semibold">
          Abonnements{rows ? ` (${rows.length})` : ''}
        </h1>
        {rows && (
          <p className="text-sm text-gray-500">
            MRR actif :{' '}
            <span className="font-semibold tabular-nums text-gray-900">
              {money(mrr, rows[0]?.currency || 'EUR')}
            </span>
          </p>
        )}
      </div>

      {error && <ErrorBox message={error} />}

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-2.5 font-medium">Tenant</th>
                <th className="px-4 py-2.5 font-medium">Offre</th>
                <th className="px-4 py-2.5 font-medium">Statut</th>
                <th className="px-4 py-2.5 font-medium">Echeance</th>
                <th className="px-4 py-2.5 text-right font-medium">Factures</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows?.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium">{row.tenant.name}</p>
                    <p className="font-mono text-xs text-gray-500">{row.tenant.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    {row.planName}
                    <span className="ml-2 text-xs text-gray-500">
                      {money(row.price, row.currency)}/mois
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Tag>{row.status}</Tag>
                      {row.cancelAtPeriodEnd && (
                        <span className="text-xs text-amber-700">annulation programmee</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(
                      new Date(row.currentPeriodEnd),
                    )}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-gray-600">
                    {row.invoiceCount}
                  </td>
                </tr>
              ))}
              {rows && rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-gray-500">
                    Aucun abonnement.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </Shell>
  );
}
