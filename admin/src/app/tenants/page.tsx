'use client';

import { useCallback, useEffect, useState } from 'react';
import { Shell } from '@/components/shell';
import { Card, ErrorBox, Tag } from '@/components/ui';
import { api } from '@/lib/api';

interface TenantRow {
  id: string;
  name: string;
  slug: string;
  plan: string;
  isActive: boolean;
  createdAt: string;
  businessName: string | null;
  businessType: string | null;
  subscriptionStatus: string | null;
  subscriptionPlan: string | null;
  counts: Record<string, number>;
}

interface PageData {
  total: number;
  page: number;
  pageSize: number;
  items: TenantRow[];
}

export default function TenantsPage() {
  const [data, setData] = useState<PageData | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: '25' });
      if (search.trim()) params.set('search', search.trim());
      setData(await api.get<PageData>(`/admin/tenants?${params.toString()}`));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur');
    }
  }, [page, search]);

  useEffect(() => {
    const timer = setTimeout(() => void load(), 250);
    return () => clearTimeout(timer);
  }, [load]);

  const toggleActive = async (row: TenantRow) => {
    const verb = row.isActive ? 'Desactiver' : 'Reactiver';
    if (!window.confirm(`${verb} le tenant "${row.name}" ?`)) return;
    setBusyId(row.id);
    try {
      await api.patch(`/admin/tenants/${row.id}`, { isActive: !row.isActive });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setBusyId('');
    }
  };

  const pages = data ? Math.ceil(data.total / data.pageSize) : 1;

  return (
    <Shell>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">
          Tenants{data ? ` (${data.total})` : ''}
        </h1>
        <input
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          placeholder="Rechercher un nom ou un slug..."
          className="w-64 rounded-md border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-gray-900"
        />
      </div>

      {error && <ErrorBox message={error} />}

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-2.5 font-medium">Tenant</th>
                <th className="px-4 py-2.5 font-medium">Activite</th>
                <th className="px-4 py-2.5 font-medium">Plan</th>
                <th className="px-4 py-2.5 font-medium">Abonnement</th>
                <th className="px-4 py-2.5 font-medium">Production</th>
                <th className="px-4 py-2.5 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data?.items.map((tenant) => (
                <tr key={tenant.id} className={tenant.isActive ? '' : 'bg-gray-50/60 opacity-70'}>
                  <td className="px-4 py-3">
                    <p className="font-medium">{tenant.name}</p>
                    <p className="font-mono text-xs text-gray-500">{tenant.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {tenant.businessName || '-'}
                    {tenant.businessType && (
                      <span className="ml-1 text-xs text-gray-400">({tenant.businessType})</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Tag>{tenant.plan}</Tag>
                  </td>
                  <td className="px-4 py-3">
                    {tenant.subscriptionStatus ? (
                      <div className="flex items-center gap-2">
                        <Tag>{tenant.subscriptionStatus}</Tag>
                        <span className="text-xs text-gray-500">{tenant.subscriptionPlan}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs tabular-nums text-gray-600">
                    {tenant.counts.websites}w · {tenant.counts.menus}m · {tenant.counts.posters}p ·{' '}
                    {tenant.counts.images}i
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      disabled={busyId === tenant.id}
                      onClick={() => toggleActive(tenant)}
                      className={`text-xs font-medium disabled:opacity-40 ${
                        tenant.isActive
                          ? 'text-red-600 hover:text-red-800'
                          : 'text-green-700 hover:text-green-900'
                      }`}
                    >
                      {tenant.isActive ? 'Desactiver' : 'Reactiver'}
                    </button>
                  </td>
                </tr>
              ))}
              {data && data.items.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-gray-500">
                    Aucun tenant.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {pages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="text-gray-600 disabled:opacity-40"
          >
            Precedent
          </button>
          <span className="text-gray-500">
            Page {page} / {pages}
          </span>
          <button
            disabled={page >= pages}
            onClick={() => setPage((p) => p + 1)}
            className="text-gray-600 disabled:opacity-40"
          >
            Suivant
          </button>
        </div>
      )}
    </Shell>
  );
}
