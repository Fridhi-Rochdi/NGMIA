'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearSession, getToken, getUser, type AdminUser } from '@/lib/api';

const NAV = [
  { href: '/', label: 'Vue d’ensemble' },
  { href: '/tenants', label: 'Tenants' },
  { href: '/users', label: 'Utilisateurs' },
  { href: '/subscriptions', label: 'Abonnements' },
];

/**
 * Client-side gate. It is a convenience, not a security boundary: every
 * /admin API route re-checks the ADMIN role server-side.
 */
export function Shell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
      return;
    }
    setUser(getUser());
    setChecked(true);
  }, [router]);

  if (!checked) {
    return <div className="grid min-h-screen place-items-center text-sm text-gray-500">Chargement…</div>;
  }

  const logout = () => {
    clearSession();
    router.replace('/login');
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <span className="flex items-center gap-2 text-sm font-semibold tracking-tight">
              <span className="grid h-6 w-6 place-items-center bg-[#0A0A0A] text-[10px] font-bold text-white">
                N
              </span>
              Console admin
            </span>
            <nav className="flex items-center gap-1">
              {NAV.map((item) => {
                const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                      active ? 'bg-gray-100 font-medium text-gray-900' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-500">{user?.email}</span>
            <button onClick={logout} className="text-gray-600 hover:text-gray-900">
              Déconnexion
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
