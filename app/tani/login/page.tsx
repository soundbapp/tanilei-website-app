"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/Nav";

export default function TaniLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Could not sign in.");
        return;
      }
      router.replace("/tani/calendar");
    } catch {
      setError("Could not sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Nav />
      <main>
        <section className="relative overflow-hidden px-5 pb-20 pt-28 text-center md:px-12 md:pt-32">
          <div className="relative z-[1] mx-auto max-w-md">
            <p className="mb-3 text-[1.05rem] text-[var(--text)]">
              Staff
            </p>
            <h1 className="font-serif mb-4 text-[clamp(1.8rem,4.5vw,2.6rem)] font-normal text-[var(--dark)]">
              Tani, sign in
            </h1>
            <div className="section-line mx-auto h-px w-[50px] bg-[var(--rose-gold)]" />
            <p className="mx-auto mt-6 mb-8 max-w-sm text-[1.25rem] leading-[1.9] text-[var(--text-light)]">
              Update your booking calendar — open days, close days, or change
              when you&apos;re booked through.
            </p>
            <form onSubmit={onSubmit} className="space-y-3 text-left">
              {error && (
                <p className="text-[1.15rem] text-red-600" role="alert">
                  {error}
                </p>
              )}
              <label className="block">
                <span className="mb-2 block text-[1.05rem] text-[var(--text)]">
                  Password
                </span>
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full min-h-[48px] border border-[rgba(201,169,154,0.45)] bg-white px-3 py-2 text-[1.2rem] text-[var(--text)] outline-none"
                />
              </label>
              <button
                type="submit"
                disabled={loading}
                className="w-full min-h-[48px] border-0 bg-[var(--dark)] px-4 py-3 text-[1.05rem] font-medium text-white transition-colors hover:bg-[var(--rose-deep)] disabled:opacity-70"
              >
                {loading ? "Signing in…" : "Enter calendar"}
              </button>
            </form>
            <p className="mt-8">
              <Link
                href="/"
                className="text-[1.1rem] text-[var(--text-light)] no-underline hover:text-[var(--rose-deep)]"
              >
                ← Home
              </Link>
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
