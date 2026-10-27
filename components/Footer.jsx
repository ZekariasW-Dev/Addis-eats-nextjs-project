import Link from "next/link";
import Image from "next/image";

function Footer() {
  return (
    <footer className="border-t border-[#e9e1d6] bg-[#f3ede3] text-[#342a22]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.4fr_0.8fr_1fr]">
        <div>
          <Link href="/" className="mb-4 inline-flex items-center gap-3">
            <Image
              src="/logo.png"
              alt=""
              width={44}
              height={44}
              className="h-11 w-11 object-contain"
            />
            <span className="text-xl font-bold tracking-tight">
              Addis <span className="text-[#7a263a]">Eats</span>
            </span>
          </Link>
          <p className="max-w-md leading-7 text-[#716b61]">
            የኢትዮጵያን ጣዕም እስከ ቤትዎ እናመጣለን።
          </p>
          <p className="mt-2 max-w-md leading-7 text-[#716b61]">
            Discover delicious Ethiopian food and enjoy the taste of home.
          </p>
        </div>
        <div>
          <h3 className="mb-4 font-bold">Explore</h3>
          <div className="flex flex-col items-start gap-3 text-sm text-[#716b61]">
            <Link href="/menu" className="transition hover:text-[#7a263a]">Our menu</Link>
            <Link href="/favorites" className="transition hover:text-[#7a263a]">Favorites</Link>
            <Link href="/orders" className="transition hover:text-[#7a263a]">My orders</Link>
            <Link href="/cart" className="transition hover:text-[#7a263a]">Shopping cart</Link>
          </div>
        </div>
        <div>
          <h3 className="mb-4 font-bold">Contact</h3>
          <div className="space-y-2 text-sm leading-6 text-[#716b61]">
            <p>Addis Ababa, Ethiopia</p>
            <p>+251 900 000 000</p>
            <a href="mailto:hello@addiseats.com" className="inline-block transition hover:text-[#7a263a]">
              hello@addiseats.com
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-[#ded5c9] px-5 py-4 text-center sm:px-8">
        <p className="text-xs text-[#716b61]">
          © 2026 Addis Eats. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
