'use client';

import { useCallback, useEffect, useState } from 'react';
import { Shell } from '@/components/shell';
import { Card, ErrorBox, Tag } from '@/components/ui';
import { api } from '@/lib/api';

interface UserRow {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
  tenant: { id: string; name: string; slug: string; plan: string };
}

interface PageData {
  total: number;
  page: number;
  pageSize: number;
  items: UserRow[];
}

export default function UsersPage() {
  const [data, setData] = useState<PageData | null>(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      const params = new URLSearchParams({ pageSize: '50' });
      if (search.trim()) params.set('search', search.trim());
      setData(await api.get<PageData>(`/admin/users?${params.toString()}`));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur');
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => void load(), 250);
    return () => clearTimeout(timer);
  }, [load]);

  return (
    <Shell>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">
          Utilisateurs{data ? ` (${data.total})` : ''}
        </h1>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un email..."
          className="w-64 rounded-md border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-gray-900"
        />
      </div>

      {error && <ErrorBox message={error} />}

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-2.5 font-medium">Utilisateur</th>
                <th className="px-4 py-2.5 font-medium">Tenant</th>
                <th className="px-4 py-2.5 font-medium">Role</th>
                <th className="px-4 py-2.5 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data?.items.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium">
                      {[user.firstName, user.lastName].filter(Boolean).join(' ') || '-'}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-gray-700">{user.tenant.name}</p>
                    <p className="font-mono text-xs text-gray-500">{user.tenant.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Tag>{user.role}</Tag>
                  </td>
                  <td className="px-4 py-3">
                    <span className={user.isActive ? 'text-green-700' : 'text-gray-400'}>
                      {user.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                </tr>
              ))}
              {data && data.items.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-gray-500">
                    Aucun utilisateur.
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
