export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border border-gray-200 bg-white ${className}`}>{children}</div>
  );
}

export function Stat({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <Card className="p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p>
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </Card>
  );
}

const TONE: Record<string, string> = {
  ACTIVE: 'bg-green-50 text-green-700 ring-green-600/20',
  TRIALING: 'bg-green-50 text-green-700 ring-green-600/20',
  PAST_DUE: 'bg-red-50 text-red-700 ring-red-600/20',
  UNPAID: 'bg-red-50 text-red-700 ring-red-600/20',
  CANCELLED: 'bg-gray-50 text-gray-600 ring-gray-500/20',
  PAID: 'bg-green-50 text-green-700 ring-green-600/20',
  FREE: 'bg-gray-50 text-gray-600 ring-gray-500/20',
  STARTER: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  PRO: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
  ENTERPRISE: 'bg-purple-50 text-purple-700 ring-purple-600/20',
};

export function Tag({ children }: { children: string }) {
  const tone = TONE[children] || 'bg-gray-50 text-gray-600 ring-gray-500/20';
  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${tone}`}>
      {children}
    </span>
  );
}

export function ErrorBox({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
      {message}
    </div>
  );
}
