
import { getDishes } from "@/lib/dishes";
import FilterShall from "@/components/Filtershell";
import CategoryBar from "@/components/CategoreyBar";

export const revalidate = 3600;

export const metadata = {
  title: "Menu",
  description:
    "Doro Wet, Tibs, Kitfo and Shiro delivered across Addis Ababa",
  alternates: { canonical: "/menu" },
};

export default async function MenuPage({ searchParams }) {
  const dishes = await getDishes();
  const params = await searchParams;
  const selectedCategory = params?.category || "all";

  return (
    <main>
      <section>
        <div className="mb-8 rounded-[1.75rem] border border-[#e9e1d6] bg-white px-6 py-8 sm:px-9 sm:py-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7a263a]">
            Made for the table
          </p>
          <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-[#342a22] sm:text-4xl">
                A menu full of meaning.
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#716b61] sm:text-base">
                Explore Ethiopian classics, comforting favorites, and something
                refreshing on the side.
              </p>
            </div>
            <p className="shrink-0 text-sm font-medium text-[#716b61]">
              Prepared with care in Addis Ababa
            </p>
          </div>
        </div>
        <CategoryBar />
        <FilterShall dishes={dishes} category={selectedCategory} />
      </section>
    </main>
  );
}
