
"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "./Providers";
import { createDishSlug } from "@/lib/dish-slug";

function DishList({ dishes }) {
  const { addToCart, favorites, toggleFavorite } = useCart();

  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {dishes.map((dish) => {
        const isFavorite = favorites.some(
          (favorite) => favorite.id === dish.id
        );

        return (
          <li
            key={dish.id}
            className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#e9e1d6] bg-white shadow-[0_8px_24px_rgba(52,42,34,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(52,42,34,0.11)]"
          >
            <div className="relative aspect-[1.42] overflow-hidden bg-[#f1e8db]">
              <Image
                src={dish.image}
                alt={dish.name}
                fill
                sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 365px"
                className="object-cover transition duration-500 group-hover:scale-105"
              />

              <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold capitalize text-[#55483d] shadow-sm">
                {dish.category.replace("-", " ")}
              </span>

              <button
                type="button"
                onClick={() => toggleFavorite(dish)}
                aria-label={
                  isFavorite
                    ? `Remove ${dish.name} from favorites`
                    : `Add ${dish.name} to favorites`
                }
                aria-pressed={isFavorite}
                className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-2xl shadow-sm transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7a263a]"
              >
                <span className={isFavorite ? "text-[#7a263a]" : "text-[#716b61]"}>
                  {isFavorite ? "♥" : "♡"}
                </span>
              </button>
            </div>

            <div className="flex flex-1 flex-col p-5 sm:p-6">
              <h3
                className="mb-2 text-xl font-semibold tracking-tight text-[#342a22]"
              >
                {dish.name}
              </h3>

              <p className="mb-4 min-h-[48px] text-sm leading-6 text-[#716b61]">
                {dish.description}
              </p>

              <div className="mb-5 flex items-center justify-between gap-3">
                <p className="text-lg font-bold text-[#7a263a]">
                  {Number(dish.price).toLocaleString()} <span className="text-sm font-semibold">ETB</span>
                </p>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    dish.spicy
                      ? "bg-[#f8e9e5] text-[#8b3c2f]"
                      : "bg-[#edf2e8] text-[#526b48]"
                  }`}
                >
                  {dish.spicy ? "Spicy" : "Mild"}
                </span>
              </div>

              <div className="mt-auto grid grid-cols-2 gap-2.5">
                <Link
                  href={`/menu/${createDishSlug(dish.name)}`}
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#ded3c5] px-3 py-2.5 text-center text-sm font-semibold text-[#55483d] transition hover:border-[#7a263a] hover:text-[#7a263a]"
                >
                  View Details
                </Link>

                <button
                  type="button"
                  onClick={() => addToCart(dish)}
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#7a263a] px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-[#642032]"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default DishList;
