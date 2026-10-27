"use client";

import { useRouter, useSearchParams } from "next/navigation";

const categories = [
  { id: "all", label: "All dishes" },
  { id: "traditional", label: "Traditional" },
  { id: "fasting", label: "Plant-based" },
  { id: "breakfast", label: "Breakfast" },
  { id: "snacks", label: "Snacks" },
  { id: "fast-food", label: "Fast food" },
  { id: "drinks", label: "Drinks" },
];

function CategoryBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedCategory =
    searchParams.get("category") || "all";

  function handleCategory(category) {
    if (category === "all") {
      router.push("/menu", { scroll: false });
      return;
    }

    router.push(`/menu?category=${encodeURIComponent(category)}`, {
      scroll: false,
    });
  }

  return (
    <nav
      aria-label="Food categories"
      className="mb-8 flex gap-2 overflow-x-auto pb-2"
    >
      {categories.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => handleCategory(id)}
          aria-pressed={selectedCategory === id}
          className={`min-h-10 shrink-0 rounded-full border px-4 py-2 text-sm font-semibold capitalize transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7a263a] ${
            selectedCategory === id
              ? "border-[#7a263a] bg-[#7a263a] text-white"
              : "border-[#ded3c5] bg-white text-[#55483d] hover:border-[#7a263a] hover:text-[#7a263a]"
          }`}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}

export default CategoryBar;