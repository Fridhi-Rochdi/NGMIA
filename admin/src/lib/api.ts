/**
 * Admin API client.
 *
 * Holds no credentials of its own: the console authenticates with a normal JWT
 * obtained from /auth/login, and the backend refuses every /admin route unless
 * that token belongs to a super-admin (isSuperAdmin). There is no Stripe key, no service account and
 * no database access on this side.
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const TOKEN_KEY = 'ngmia_admin_token';
const USER_KEY = 'ngmia_admin_user';

export interface AdminUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  /** Platform operator. `role` is only a tenant-level role and grants nothing here. */
  isSuperAdmin: boolean;
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getUser(): AdminUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AdminUser) : null;
  } catch {
    return null;
  }
}

function storeSession(token: string, user: AdminUser) {
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  try {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  } catch {
    /* ignore */
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers || {}),
    },
  });

  if (response.status === 401) {
    clearSession();
    if (typeof window !== 'undefined') window.location.href = '/login';
    throw new ApiError('Session expirée', 401);
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError((Array.isArray(payload?.message) ? payload.message.join(" · ") : payload?.message) || `Erreur HTTP ${response.status}`, response.status);
  }

  // Unwrap the backend's { data, statusCode, timestamp } envelope.
  return (payload && payload.data !== undefined ? payload.data : payload) as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
};

/** Login's first step when the backend asks for a one-time code. */
export interface OtpChallenge {
  otpRequired: true;
  challengeId: string;
  /** Masked by the backend, e.g. "ad******@example.com". */
  email: string;
  expiresAt: string;
  resendAfterSeconds: number;
  /** Only outside production, when OTP_EXPOSE_CODE is on. */
  devCode?: string;
}

export type LoginOutcome = { kind: 'session'; user: AdminUser } | { kind: 'otp'; challenge: OtpChallenge };

/**
 * Only a super-admin may hold a console session.
 *
 * The backend enforces this on every /admin route too; refusing here just
 * avoids handing a normal user an empty console — and, more importantly,
 * avoids storing a session this app can do nothing with.
 */
function acceptSession(data: any): AdminUser {
  const user: AdminUser | undefined = data?.user;
  if (!user || !data?.accessToken) {
    throw new ApiError('Reponse de connexion inattendue du serveur.', 500);
  }
  if (user.isSuperAdmin !== true) {
    throw new ApiError("Ce compte n'a pas les droits d'administration.", 403);
  }
  storeSession(data.accessToken, user);
  return user;
}

async function postAuth(path: string, body: unknown): Promise<any> {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // The backend also sets HttpOnly session cookies; accepting them keeps the
    // console's session alive the same way the main app's does.
    credentials: 'include',
    body: JSON.stringify(body),
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(payload?.message || 'Identifiants invalides', response.status);
  }
  return payload?.data ?? payload;
}

/**
 * Step one. Returns a session when the second factor is off, or the challenge
 * to answer when it is on.
 *
 * The console used to read `data.accessToken` unconditionally. With OTP_ENABLED
 * (the default) the backend answers a challenge instead, so that read produced
 * `undefined` and the console could not be logged into at all.
 */
export async function login(email: string, password: string): Promise<LoginOutcome> {
  const data = await postAuth('/auth/login', { email, password });
  if (data?.otpRequired) {
    return { kind: 'otp', challenge: data as OtpChallenge };
  }
  return { kind: 'session', user: acceptSession(data) };
}

/** Step two: exchange the one-time code for a console session. */
export async function verifyOtp(challengeId: string, code: string): Promise<AdminUser> {
  return acceptSession(await postAuth('/auth/otp/verify', { challengeId, code }));
}

/** Ask for a fresh code on a pending challenge. */
export async function resendOtp(challengeId: string): Promise<void> {
  await postAuth('/auth/otp/resend', { challengeId });
}
