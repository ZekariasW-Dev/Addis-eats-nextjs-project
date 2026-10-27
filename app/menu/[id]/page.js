import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getDish, getDishes } from "@/lib/dishes";
import { createDishSlug } from "@/lib/dish-slug";
import AddToCart from "@/components/AddToCart";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const dish = await getDish(id);

  if (!dish) {
    return {
      title: "Dish not found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const siteUrl = "https://addis-eats-nextjs-o13s.vercel.app";
  const slug = createDishSlug(dish.name);

  const rawDescription = `${dish.name} - ${dish.price} ETB. ${dish.description}`;

  const description =
    rawDescription.length > 155
      ? `${rawDescription.slice(0, 152).trimEnd()}...`
      : rawDescription;

  const url = new URL(`/menu/${slug}`, siteUrl).toString();
  const imageUrl = new URL(dish.image, siteUrl).toString();

  return {
    title: `${dish.name} | Ethiopian Food`,
    description,

    alternates: {
      canonical: url,
    },

    openGraph: {
      title: `${dish.name} | Addis Eats`,
      description,
      url,
      type: "website",
      images: [
        {
          url: imageUrl,
          alt: `${dish.name} from Addis Eats`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: `${dish.name} | Addis Eats`,
      description,
      images: [imageUrl],
    },
  };
}

export async function generateStaticParams() {
  const dishes = await getDishes();

  return dishes.map((dish) => ({
    id: createDishSlug(dish.name),
  }));
}

async function DishPage({ params }) {
  const { id } = await params;
  const dish = await getDish(id);

  if (!dish) {
    notFound();
  }

  const jsonLD = {
    "@context": "https://schema.org",
    "@type": "MenuItem",
    name: dish.name,
    description: dish.description,
    image: new URL(
      dish.image,
      "https://addis-eats-nextjs-o13s.vercel.app",
    ).toString(),
    offers: {
      "@type": "Offer",
      price: dish.price,
      priceCurrency: "ETB",
    },
  };

  return (
    <main className="min-h-screen bg-[#fbf8f2] px-5 py-10 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLD),
        }}
      />

      <article className="mx-auto max-w-6xl">
        <Link
          href="/menu"
          className="mb-7 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#7a263a] transition hover:text-[#642032]"
        >
          <span aria-hidden="true">←</span> Back to menu
        </Link>

        <div className="overflow-hidden rounded-[1.75rem] border border-[#e9e1d6] bg-white shadow-[0_16px_50px_rgba(52,42,34,0.08)]">
          <div className="grid md:grid-cols-2">
            <div className="relative min-h-[350px] overflow-hidden bg-[#f1e8db] md:min-h-[600px]">
              <Image
                src={dish.image}
                alt={dish.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />

              <div className="absolute left-5 top-5">
                <span className="rounded-full bg-white/95 px-4 py-2 text-xs font-semibold capitalize text-[#55483d] shadow-sm">
                  {dish.category.replace("-", " ")}
                </span>
              </div>
            </div>

            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#7a263a]">
                From Addis Eats
              </p>

              <h1 className="mb-5 text-4xl font-semibold tracking-tight text-[#342a22] sm:text-5xl">
                {dish.name}
              </h1>

              <p className="mb-7 text-base leading-8 text-[#716b61] sm:text-lg">
                {dish.description}
              </p>

              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#716b61]">
                  Price
                </p>

                <p className="mt-1 text-3xl font-bold text-[#7a263a]">
                  {Number(dish.price).toLocaleString()} ETB
                </p>
              </div>

              <div className="mb-8 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-[#fbf8f2] p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#716b61]">
                    Category
                  </p>

                  <p className="mt-1 font-semibold capitalize text-[#342a22]">
                    {dish.category.replace("-", " ")}
                  </p>
                </div>

                <div className="rounded-xl bg-[#fbf8f2] p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#716b61]">
                    Spice Level
                  </p>

                  <p className="mt-1 font-semibold text-[#342a22]">
                    {dish.spicy ? "Spicy" : "Mild"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <AddToCart dish={dish} />

                <Link
                  href="/menu"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#ded3c5] px-6 py-3 text-center text-sm font-semibold text-[#55483d] transition hover:border-[#7a263a] hover:text-[#7a263a]"
                >
                  Continue browsing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}

export default DishPage;
