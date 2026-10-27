
"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { logout } from "@/app/actions";
import { useCart } from "./Providers";
import CartDrawer from "./CartDrawer";

function Header({ customer }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [hasMounted, setHasMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const {
    cartCount,
    cartOpen,
    closeCartDrawer,
    favorites,
    openCartDrawer,
  } = useCart();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  function handleLogout() {
    closeMenu();
    startTransition(async () => {
      await logout();
      router.refresh();
    });
  }

  const linkClass =
    "inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold text-[#55483d] transition hover:bg-[#f1e8db] hover:text-[#7a263a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7a263a]";

  const actionClass =
    "inline-flex min-h-11 items-center justify-center whitespace-nowrap px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7a263a]";

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#e9e1d6] bg-[#fbf8f2]/95 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href="/"
            aria-label="Addis Eats home"
            onClick={closeMenu}
            className="inline-flex min-h-11 shrink-0 items-center gap-2.5 rounded-lg"
          >
            <Image
              src="/logo.png"
              alt=""
              width={42}
              height={42}
              priority
              className="h-10 w-10 rounded-full object-contain"
            />

            <span className="whitespace-nowrap text-lg font-bold tracking-tight text-[#342a22] sm:text-xl">
              Addis <span className="text-[#7a263a]">Eats</span>
            </span>
          </Link>

          <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
            <Link href="/menu" className={linkClass}>Menu</Link>
            <Link href="/favorites" className={linkClass}>
              Favorites{hasMounted && favorites.length > 0 ? ` (${favorites.length})` : ""}
            </Link>
            <Link href="/orders" className={linkClass}>My orders</Link>
            <Link href="/kitchen" className={linkClass}>Kitchen</Link>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openCartDrawer}
              aria-label={hasMounted ? `Open cart, ${cartCount} items` : "Open cart"}
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-full text-[#342a22] transition hover:bg-[#f1e8db] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7a263a]"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h8.5a2 2 0 0 0 2-1.6L21 8H6" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="10" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
              </svg>
              {hasMounted && cartCount > 0 && (
                <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#7a263a] px-1 text-[11px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>

            <div className="hidden items-center gap-2 lg:flex">
              {customer ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isPending}
                  className={`${actionClass} rounded-full bg-[#7a263a] text-white hover:bg-[#642032] disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  {isPending ? "Signing out…" : "Sign out"}
                </button>
              ) : (
                <Link
                  href="/login"
                  className={`${actionClass} gap-2 rounded-md bg-[#c9272c] text-white hover:bg-[#ae2025]`}
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z" />
                  </svg>
                  Log in
                  <svg aria-hidden="true" viewBox="0 0 12 12" fill="currentColor" className="h-3 w-3">
                    <path d="m2 4 4 4 4-4H2Z" />
                  </svg>
                </Link>
              )}
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-[#342a22] transition hover:bg-[#f1e8db] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7a263a] lg:hidden"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
                {menuOpen ? <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" /> : <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />}
              </svg>
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="border-t border-[#e9e1d6] bg-[#fbf8f2] px-4 py-3 lg:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col">
              <Link href="/menu" onClick={closeMenu} className={linkClass}>Menu</Link>
              <Link href="/favorites" onClick={closeMenu} className={linkClass}>
                Favorites{hasMounted && favorites.length > 0 ? ` (${favorites.length})` : ""}
              </Link>
              <Link href="/orders" onClick={closeMenu} className={linkClass}>My orders</Link>
              <Link href="/kitchen" onClick={closeMenu} className={linkClass}>Kitchen</Link>
              {customer ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isPending}
                  className={`${linkClass} justify-start disabled:opacity-60`}
                >
                  {isPending ? "Signing out…" : "Sign out"}
                </button>
              ) : (
                <Link href="/login" onClick={closeMenu} className={linkClass}>Log in</Link>
              )}
            </div>
          </nav>
        )}
      </header>

      <CartDrawer
        isOpen={cartOpen}
        onClose={closeCartDrawer}
      />
    </>
  );
}

export default Header;
