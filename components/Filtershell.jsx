
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DishList from "./DishList";
import {
  DISHES_UPDATED_EVENT,
  readBrowserDishes,
} from "@/lib/dish-storage";

const PAGE_SIZE = 6;

function FilterShall({ dishes: initialDishes, category = "all" }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const requestedPage = Number(searchParams.get("page"));
  const pageFromUrl =
    Number.isInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  const [allDishes, setAllDishes] = useState(initialDishes);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(pageFromUrl);
  const [storageReady, setStorageReady] = useState(false);

  // Load saved Admin changes and keep this menu synchronized.
  useEffect(() => {
    function refreshDishes() {
      setAllDishes(readBrowserDishes(initialDishes));
      setStorageReady(true);
    }

    refreshDishes();

    window.addEventListener("storage", refreshDishes);
    window.addEventListener(DISHES_UPDATED_EVENT, refreshDishes);

    return () => {
      window.removeEventListener("storage", refreshDishes);
      window.removeEventListener(DISHES_UPDATED_EVENT, refreshDishes);
    };
  }, [initialDishes]);

  // Keep page state synchronized with the URL.
  useEffect(() => {
    setPage(pageFromUrl);
  }, [pageFromUrl]);

  // Debounce the search input.
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim().toLowerCase());
      setPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Only enabled dishes should appear on the customer menu.
  const categoryDishes = useMemo(
    () =>
      allDishes.filter(
        (dish) =>
          dish.enabled !== false &&
          (category === "all" || dish.category === category),
      ),
    [allDishes, category],
  );

  const filteredDishes = useMemo(
    () =>
      categoryDishes.filter((dish) =>
        dish.name.toLowerCase().includes(debouncedSearch),
      ),
    [categoryDishes, debouncedSearch],
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredDishes.length / PAGE_SIZE),
  );
  const currentPage = Math.min(page, totalPages);

  const displayedDishes = filteredDishes.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  // Keep the URL valid when deletions reduce the number of pages.
  useEffect(() => {
    if (page <= totalPages) return;

    setPage(totalPages);

    const params = new URLSearchParams(searchParams.toString());

    if (totalPages > 1) {
      params.set("page", String(totalPages));
    } else {
      params.delete("page");
    }

    const query = params.toString();
    router.replace(query ? `/menu?${query}` : "/menu", {
      scroll: false,
    });
  }, [page, totalPages, router, searchParams]);

  function handleSearchChange(event) {
    setSearchTerm(event.target.value);
    setPage(1);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");

    const query = params.toString();
    router.replace(query ? `/menu?${query}` : "/menu", {
      scroll: false,
    });
  }

  function handlePageChange(nextPage) {
    if (nextPage < 1 || nextPage > totalPages) return;

    setPage(nextPage);

    const params = new URLSearchParams(searchParams.toString());

    if (nextPage > 1) {
      params.set("page", String(nextPage));
    } else {
      params.delete("page");
    }

    const query = params.toString();
    router.push(query ? `/menu?${query}` : "/menu", {
      scroll: false,
    });
  }

  return (
    <section>
      {/* Category heading and live dish count */}
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold capitalize tracking-tight text-[#342a22] sm:text-3xl">
            {category === "all"
              ? "All Dishes"
              : category.replace("-", " ")}
          </h2>
        </div>

        <span className="rounded-full bg-[#f1e8db] px-3 py-1.5 text-xs font-semibold text-[#55483d]">
          {categoryDishes.length} dishes
        </span>
      </div>

      {/* Search */}
      <div className="mb-7 rounded-2xl border border-[#e9e1d6] bg-white p-4 sm:p-5">
        <label
          htmlFor="dish-search"
          className="mb-2 block text-sm font-semibold text-[#342a22]"
        >
          Search Our Menu
        </label>

        <input
          id="dish-search"
          type="search"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search dishes by name..."
          className="w-full rounded-xl border border-[#ded3c5] bg-[#fbf8f2] px-4 py-3 text-[#342a22] outline-none transition placeholder:text-[#8a8176] focus:border-[#7a263a] focus:ring-2 focus:ring-[#7a263a]/15"
        />

        {searchTerm && (
          <p className="mt-3 text-sm text-[#716b61]" aria-live="polite">
            {searchTerm.trim().toLowerCase() !== debouncedSearch
              ? "Searching..."
              : `${filteredDishes.length} ${
                  filteredDishes.length === 1 ? "dish" : "dishes"
                } found for "${searchTerm}"`}
          </p>
        )}
      </div>

      {/* Dish loading state */}
      {!storageReady && (
        <p className="mb-6 text-center text-sm text-[#716b61]" role="status">
          Loading menu...
        </p>
      )}

      {/* Loaded and empty states */}
      {displayedDishes.length > 0 ? (
        <DishList dishes={displayedDishes} />
      ) : (
        <div className="rounded-2xl border border-[#e9e1d6] bg-white px-6 py-14 text-center">
          <div className="mb-4 text-5xl" aria-hidden="true">
            🍽️
          </div>

          <h3 className="mb-2 text-2xl font-semibold text-[#342a22]">
            {debouncedSearch ? "No dishes found" : "No dishes available"}
          </h3>

          <p className="text-[#716b61]">
            {debouncedSearch
              ? "Try another dish name."
              : "Please check back later for available dishes."}
          </p>
        </div>
      )}

      {/* URL-based pagination */}
      {filteredDishes.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 py-8">
          <button
            type="button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="rounded-full bg-[#7a263a] px-5 py-3 font-semibold text-white transition hover:bg-[#642032] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          <span className="text-sm font-semibold text-[#55483d]">
            Page {currentPage} of {totalPages}
          </span>

          <button
            type="button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="rounded-full bg-[#7a263a] px-5 py-3 font-semibold text-white transition hover:bg-[#642032] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}

export default FilterShall;
