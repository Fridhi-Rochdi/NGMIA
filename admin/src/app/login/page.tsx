'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, resendOtp, verifyOtp, type OtpChallenge } from '@/lib/api';
import { ErrorBox } from '@/components/ui';

const inputClass =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  // Set once the backend asks for a second factor; its presence is what
  // switches this form from credentials to code.
  const [challenge, setChallenge] = useState<OtpChallenge | null>(null);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submitCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const outcome = await login(email, password);
      if (outcome.kind === 'otp') {
        setChallenge(outcome.challenge);
        setNotice(
          outcome.challenge.devCode
            ? `Code envoyé à ${outcome.challenge.email} — code de développement : ${outcome.challenge.devCode}`
            : `Code envoyé à ${outcome.challenge.email}.`,
        );
        setBusy(false);
        return;
      }
      router.replace('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connexion impossible');
      setBusy(false);
    }
  };

  const submitCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!challenge) return;
    setError('');
    setBusy(true);
    try {
      await verifyOtp(challenge.challengeId, code.trim());
      router.replace('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Code invalide');
      setBusy(false);
    }
  };

  const resend = async () => {
    if (!challenge) return;
    setError('');
    setNotice('');
    try {
      await resendOtp(challenge.challengeId);
      setNotice('Un nouveau code vous a été envoyé.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Renvoi impossible');
    }
  };

  return (
    <div className="grid min-h-screen place-items-center px-6">
      <form
        onSubmit={challenge ? submitCode : submitCredentials}
        className="w-full max-w-sm space-y-5"
      >
        <div className="text-center">
          <span className="mx-auto grid h-10 w-10 place-items-center bg-[#0A0A0A] text-sm font-bold text-white">
            N
          </span>
          <h1 className="mt-4 text-lg font-semibold">Console admin</h1>
          <p className="mt-1 text-sm text-gray-500">
            {challenge
              ? 'Saisissez le code à usage unique.'
              : 'Réservée aux comptes administrateurs.'}
          </p>
        </div>

        {error && <ErrorBox message={error} />}
        {notice && !error && (
          <p className="rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-600">{notice}</p>
        )}

        {challenge ? (
          <>
            <input
              // Numeric on mobile without the spinner and value clamping a
              // number input would apply to a code that may carry a zero.
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              autoFocus
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Code à 6 chiffres"
              className={`${inputClass} text-center tracking-[0.4em]`}
            />
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-md bg-gray-900 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
            >
              {busy ? 'Vérification…' : 'Valider le code'}
            </button>
            <div className="flex justify-between text-xs text-gray-500">
              <button type="button" onClick={resend} className="underline hover:text-gray-900">
                Renvoyer le code
              </button>
              <button
                type="button"
                onClick={() => {
                  setChallenge(null);
                  setCode('');
                  setNotice('');
                  setError('');
                }}
                className="underline hover:text-gray-900"
              >
                Changer de compte
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-3">
              <input
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className={inputClass}
              />
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
                className={inputClass}
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-md bg-gray-900 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
            >
              {busy ? 'Connexion…' : 'Se connecter'}
            </button>
          </>
        )}
      </form>
    </div>
  );
}
