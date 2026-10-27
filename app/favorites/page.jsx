
"use client";

import Link from "next/link";
import { useCart } from "@/components/Providers";
import DishList from "@/components/DishList";

export default function FavoritesPage() {
  const { favorites } = useCart();

  return (
    <main className="min-h-screen bg-[#fbf8f2] px-5 py-10 text-[#342a22] transition-colors sm:px-8 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7a263a]">
          Saved for later
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Your favorites
        </h1>
        <p className="mb-8 mt-2 text-[#716b61]">
          Your favorite Ethiopian dishes, all in one place.
        </p>

        {favorites.length === 0 ? (
          <div className="rounded-2xl border border-[#e9e1d6] bg-white px-6 py-12 text-center">
            <p className="mb-2 text-lg font-semibold">Nothing saved just yet</p>
            <p className="mb-6 text-sm text-[#716b61]">
              Save a dish you love and it will be waiting here.
            </p>
            <Link
              href="/menu"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#7a263a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#642032]"
            >
              Explore the Menu
            </Link>
          </div>
        ) : (
          <DishList dishes={favorites} />
        )}
      </div>
    </main>
  );
}
