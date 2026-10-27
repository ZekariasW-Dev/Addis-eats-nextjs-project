"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { login, signInWithGoogle } from "@/app/actions";
import Image from "next/image";

function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");

  // Show the Admin login design only when login was requested for /kitchen.
  const isAdminLogin =
    next === "/kitchen" || Boolean(next?.startsWith("/kitchen/"));
  const panelClass = isAdminLogin
    ? "rounded-lg border border-[#e9e1d6] bg-white p-6 shadow-[0_8px_24px_rgba(52,42,34,0.08)] sm:p-8"
    : "rounded-2xl border border-[#e9e1d6] bg-white p-7 shadow-[0_12px_36px_rgba(52,42,34,0.06)] sm:p-9";
  const fieldClass = isAdminLogin
    ? "w-full rounded-md border border-[#ded3c5] bg-white px-4 py-3 text-[#342a22] outline-none transition focus:border-[#c9272c] focus:ring-2 focus:ring-[#c9272c]/15"
    : "w-full rounded-xl border border-[#ded3c5] bg-[#fbf8f2] px-4 py-3 text-[#342a22] outline-none transition focus:border-[#7a263a] focus:ring-2 focus:ring-[#7a263a]/15";

  const [state, formAction, isPending] = useActionState(login, null);
  const [googleError, setGoogleError] = useState("");
  const [googlePending, setGooglePending] = useState(false);

  function getSafeNext() {
    return next &&
      next.startsWith("/") &&
      !next.startsWith("//") &&
      next !== "/kitchen" &&
      !next.startsWith("/kitchen/")
      ? next
      : "/";
  }

  useEffect(() => {
    if (!state?.success) return;

    const destination =
      state.role === "staff" ? "/kitchen" : getSafeNext();

    router.replace(destination);
    router.refresh();
  }, [state, router]);

  function handleGoogleScriptLoad() {
    if (!window.google?.accounts?.id) {
      setGoogleError("Google sign-in could not load. Please try again.");
      return;
    }

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!clientId) {
      setGoogleError("Google sign-in is not configured.");
      return;
    }

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response) => {
        setGoogleError("");
        setGooglePending(true);

        try {
          const result = await signInWithGoogle(response.credential);

          if (!result.success) {
            setGoogleError(result.error || "Google sign-in failed.");
            return;
          }

          if (result.role === "staff") {
            router.replace("/kitchen");
            router.refresh();
            return;
          }

          router.replace(getSafeNext());
          router.refresh();
        } catch {
          setGoogleError("Google sign-in failed. Please try again.");
        } finally {
          setGooglePending(false);
        }
      },
    });

    const button = document.getElementById("google-signin-button");

    if (button) {
      button.replaceChildren();

      window.google.accounts.id.renderButton(button, {
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "rectangular",
        width: 300,
      });
    }
  }

  return (
    <main className="min-h-screen bg-[#fbf8f2] px-5 py-12 sm:px-6">
      <div className="mx-auto max-w-md">
        <div className={panelClass}>
          <div className={`mb-8 ${isAdminLogin ? "text-left" : "text-center"}`}>
            <div className="text-xs font-bold tracking-[0.18em] text-[#7a263a]">
              <Image
                src="/logo.png"
                alt="Addis Eats logo"
                width={38}
                height={38}
                priority
                className="mr-1 inline-block align-middle"
              />
              ADDIS EATS
            </div>

            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-[#342a22] sm:text-3xl">
              {isAdminLogin ? "Log in to your account" : "Customer Log in"}
            </h1>

            <p className="mt-3 text-sm text-[#716b61]">
              {isAdminLogin
                ? "Log in to manage the Addis Eats dashboard."
                : "Log in to order your favorite Ethiopian dishes."}
            </p>
          </div>

          {/* Public portfolio demo credentials */}
          <div
            className={`mb-6 rounded-lg border p-4 ${
              isAdminLogin
                ? "border-[#f0d7d7] bg-[#fff7f7]"
                : "border-[#e9e1d6] bg-[#fbf8f2]"
            }`}
          >
            <h2 className="font-semibold text-[#7a263a]">
              {isAdminLogin
                ? "Demo Admin Account"
                : "Demo Customer Account"}
            </h2>

            <p className="mt-2 text-sm text-[#342a22]">
              <span className="font-semibold">Username:</span>{" "}
              {isAdminLogin ? "kitchen" : "Zekarias"}
            </p>

            <p className="mt-1 text-sm text-[#342a22]">
              <span className="font-semibold">Password:</span>{" "}
              {isAdminLogin ? "Kitchen12!" : "Addis123!"}
            </p>

            <p className="mt-3 text-xs text-[#716b61]">
              Use these demo credentials to explore the Addis Eats.
            </p>
          </div>

          <form action={formAction} className="space-y-5">
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-semibold text-[#342a22]"
              >
                Username or email
              </label>

              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                placeholder="Enter your username or email"
                className={fieldClass}
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
                autoComplete="current-password"
                required
                placeholder="Enter your password"
                className={fieldClass}
              />
            </div>

            {state?.error && (
              <div
                role="alert"
                className="rounded-xl bg-[#f8e9e5] px-4 py-3 text-sm font-medium text-[#7a263a]"
              >
                {state.error}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className={`w-full px-5 py-3.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${isAdminLogin ? "rounded-md bg-[#c9272c] hover:bg-[#ae2025]" : "rounded-full bg-[#7a263a] hover:bg-[#642032]"}`}
            >
              {isPending ? "Logging in..." : "Log in"}
            </button>
          </form>

          {!isAdminLogin && (
            <>
              <div className="mt-6 border-t border-[#E8DDD8] pt-6">
                <p className="mb-4 text-center text-sm text-[#666666]">
                  Or continue with
                </p>

                <Script
                  src="https://accounts.google.com/gsi/client"
                  strategy="afterInteractive"
                  onReady={handleGoogleScriptLoad}
                  onError={() =>
                    setGoogleError(
                      "Could not load Google's sign-in service."
                    )
                  }
                />

                <div className="flex justify-center">
                  <div id="google-signin-button" />
                </div>

                {googlePending && (
                  <p className="mt-3 text-center text-sm text-[#666666]">
                    Signing in with Google...
                  </p>
                )}

                {googleError && (
                  <p
                    role="alert"
                    className="mt-3 rounded-xl bg-[#F1E2E5] px-4 py-3 text-sm text-[#7A263A]"
                  >
                    {googleError}
                  </p>
                )}
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-[#666666]">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/signup"
                    className="font-bold text-[#7A263A] hover:text-[#A64B5D]"
                  >
                    Create account
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default LoginPage;