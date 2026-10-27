import Image from "next/image";
import Link from "next/link";
import DishList from "@/components/DishList";
import { getDishes } from "@/lib/dishes";

export const metadata = {
  alternates: {
    canonical: "/",
  },
};

const categories = [
  {
    id: "traditional",
    title: "Traditional favorites",
    description: "The rich, familiar flavors we come together for.",
  },
  {
    id: "fasting",
    title: "Plant-based plates",
    description: "Colorful, satisfying dishes made for fasting days.",
  },
  {
    id: "breakfast",
    title: "Breakfast",
    description: "A comforting start, the Ethiopian way.",
  },
  {
    id: "drinks",
    title: "Coffee & drinks",
    description: "Something refreshing to round out your meal.",
  },
];

export default async function HomePage() {
  const dishes = await getDishes();
  const availableDishes = dishes.filter((dish) => dish.enabled !== false);
  const featuredDishes = ["traditional", "fasting", "breakfast"]
    .map((category) =>
      availableDishes.find((dish) => dish.category === category),
    )
    .filter(Boolean);

  const availableCategories = categories
    .map((category) => ({
      ...category,
      dish: availableDishes.find((dish) => dish.category === category.id),
    }))
    .filter((category) => category.dish);

  return (
    <main className="overflow-hidden bg-[#fbf8f2]">
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-14 pt-10 sm:px-8 sm:pb-20 sm:pt-14 lg:grid-cols-[1fr_0.95fr] lg:gap-16 lg:px-10 lg:pb-24 lg:pt-16">
        <div className="relative z-10">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#e7d9c9] bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#7a263a]">
            <span className="h-2 w-2 rounded-full bg-[#66825b]" aria-hidden="true" />
            Ethiopian food, made with heart
          </p>
          <h1 className="max-w-2xl text-5xl font-semibold leading-[1.05] tracking-[-0.045em] text-[#342a22] sm:text-6xl lg:text-[4.5rem]">
            A taste of Ethiopia,
            <span className="mt-2 block font-serif italic text-[#7a263a]">
              brought to your table.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-[#716b61] sm:text-lg sm:leading-8">
            From slow-simmered wot to bright, plant-based favorites, discover
            the flavors that make every meal feel like home.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/menu"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#7a263a] px-7 py-3.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#642032] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7a263a]"
            >
              Explore the menu
              <span className="ml-2" aria-hidden="true">→</span>
            </Link>
            <Link
              href="/menu?category=traditional"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#ded3c5] bg-white/70 px-7 py-3.5 text-sm font-bold text-[#342a22] transition hover:border-[#7a263a] hover:text-[#7a263a]"
            >
              Discover traditional dishes
            </Link>
          </div>
          <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 border-t border-[#e9e1d6] pt-6 text-sm text-[#716b61]">
            <span className="inline-flex items-center gap-2">
              <span className="text-[#66825b]" aria-hidden="true">✓</span>
              Made for sharing
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="text-[#66825b]" aria-hidden="true">✓</span>
              Easy ordering
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="text-[#66825b]" aria-hidden="true">✓</span>
              Track your order
            </span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[620px]">
          <div className="absolute -left-5 -top-5 h-28 w-28 rounded-full bg-[#e8d8c5] sm:-left-7 sm:-top-7 sm:h-36 sm:w-36" />
          <figure className="relative aspect-[1.08] overflow-hidden rounded-[2rem] bg-[#e8d8c5] shadow-[0_24px_70px_rgba(52,42,34,0.16)] sm:rounded-[2.5rem]">
            <Image
              src="/images/hero-food.jpg"
              alt="A generous spread of Ethiopian dishes served on injera"
              fill
              priority
              sizes="(max-width: 1023px) 100vw, 48vw"
              className="object-cover"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#211a16]/80 via-[#211a16]/25 to-transparent px-6 pb-6 pt-20 text-white sm:px-8 sm:pb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/75">
                Gather around
              </p>
              <p className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
                Tradition, served fresh.
              </p>
            </figcaption>
          </figure>
          <div className="absolute -bottom-5 right-3 rounded-2xl border border-[#e9e1d6] bg-white px-4 py-3 shadow-lg sm:-right-5 sm:px-5 sm:py-4">
            <p className="text-xs font-medium text-[#716b61]">A little taste of</p>
            <p className="mt-0.5 font-semibold text-[#342a22]">Addis Ababa</p>
          </div>
        </div>
      </section>

      <section className="border-y border-[#e9e1d6] bg-[#f3ede3]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7a263a]">
                Find your favorite
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#342a22] sm:text-4xl">
                A menu for every craving
              </h2>
            </div>
            <Link
              href="/menu"
              className="text-sm font-bold text-[#7a263a] transition hover:text-[#642032]"
            >
              Browse all dishes <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {availableCategories.map(({ id, title, description, dish }) => (
              <Link
                key={id}
                href={`/menu?category=${id}`}
                className="group relative isolate flex min-h-52 flex-col justify-end overflow-hidden rounded-2xl bg-[#342a22] p-5 text-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <Image
                  src={dish.image}
                  alt=""
                  fill
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
                  className="absolute inset-0 -z-20 object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#211a16]/90 via-[#211a16]/25 to-transparent" />
                <span className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/75">
                  {dish.name}
                </span>
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="mt-1 max-w-xs text-sm leading-5 text-white/80">
                  {description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7a263a]">
              From our kitchen
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#342a22] sm:text-4xl">
              A few favorites to start
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-[#716b61]">
            Explore the full menu for more comforting classics, fresh sides,
            and drinks.
          </p>
        </div>
        {featuredDishes.length > 0 ? (
          <DishList dishes={featuredDishes} />
        ) : (
          <div className="rounded-2xl border border-[#e9e1d6] bg-white p-8 text-center text-[#716b61]">
            Our menu is being refreshed. Please check back soon.
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 sm:pb-20 lg:px-10">
        <div className="flex flex-col items-start justify-between gap-6 rounded-[2rem] bg-[#342a22] px-6 py-9 text-white sm:px-10 sm:py-11 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e2bd82]">
              Make room at the table
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Your next favorite is waiting.
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/70">
              Browse the menu, add something delicious, and we’ll take it from
              there.
            </p>
          </div>
          <Link
            href="/menu"
            className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-[#f3d9b2] px-6 py-3 text-sm font-bold text-[#342a22] transition hover:bg-white"
          >
            Order from the menu <span className="ml-2" aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
