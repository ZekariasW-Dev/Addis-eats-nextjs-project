"use client";

import { useCart } from "@/components/Providers";

export default function AddToCart({ dish }) {
  const { addToCart } = useCart();

  return (
    <button
      type="button"
      onClick={() => addToCart(dish)}
      className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#7a263a] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#642032] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7a263a]"
    >
      Add to cart
    </button>
  );
}