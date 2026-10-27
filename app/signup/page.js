"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { register } from "@/app/actions";
import Image from "next/image";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);

    if (formData.get("password") !== formData.get("confirmPassword")) {
      setError("Passwords do not match.");
      return;
    }

    setPending(true);

    try {
      const result = await register(formData);

      if (!result.success) {
        setError(result.error || "Unable to create account.");
        return;
      }

      router.replace("/orders");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#fbf8f2] px-5 py-12 sm:px-6">
      <div className="mx-auto max-w-md">
        <div className="rounded-2xl border border-[#e9e1d6] bg-white p-7 shadow-[0_12px_36px_rgba(52,42,34,0.06)] sm:p-9">
          <div className="mb-8 text-center">
            <p className="text-xs font-bold tracking-[0.18em] text-[#7a263a]">
              <Image
                src="/logo.png"
                alt="Addis Eats logo"
                width={38}
                height={38}
                priority
                className="mr-1 inline-block align-middle"
              />
              ADDIS EATS
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#342a22] sm:text-4xl">
              Create Account
            </h1>

            <p className="mt-3 text-sm text-[#716b61]">
              Join Addis Eats to manage your orders.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-[#342a22]"
              >
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="w-full rounded-xl border border-[#ded3c5] bg-[#fbf8f2] px-4 py-3 text-[#342a22] outline-none transition focus:border-[#7a263a] focus:ring-2 focus:ring-[#7a263a]/15"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-[#342a22]"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full rounded-xl border border-[#ded3c5] bg-[#fbf8f2] px-4 py-3 text-[#342a22] outline-none transition focus:border-[#7a263a] focus:ring-2 focus:ring-[#7a263a]/15"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-[#342a22]"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                className="w-full rounded-xl border border-[#ded3c5] bg-[#fbf8f2] px-4 py-3 text-[#342a22] outline-none transition focus:border-[#7a263a] focus:ring-2 focus:ring-[#7a263a]/15"
                placeholder="At least 8 characters"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-semibold text-[#342a22]"
              >
                Confirm password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                className="w-full rounded-xl border border-[#ded3c5] bg-[#fbf8f2] px-4 py-3 text-[#342a22] outline-none transition focus:border-[#7a263a] focus:ring-2 focus:ring-[#7a263a]/15"
                placeholder="Enter your password again"
              />
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-xl bg-[#f8e9e5] px-4 py-3 text-sm font-medium text-[#7a263a]"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-full bg-[#7a263a] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#642032] disabled:opacity-60"
            >
              {pending ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#716b61]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#7a263a] hover:text-[#642032]"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
