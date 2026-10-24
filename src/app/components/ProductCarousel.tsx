
"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const products = [
  {
    id: 1,
    name: "Fruits",
    image: "/images/images-carousel/fruits.jpg",
    description:
      "Explore our fresh fruit products, discover available options, and connect with sellers on the Skyma marketplace.",
  },
  {
    id: 2,
    name: "Product Y",
    image: "/images/images-carousel/category-y.jpg",
    description:
      "Discover Product Y and find suitable options for your business or personal needs.",
  },
  {
    id: 3,
    name: "Product Z",
    image: "/images/images-carousel/category-z.jpg",
    description:
      "Browse Product Z and explore opportunities to buy or sell through Skyma.",
  },
  {
    id: 4,
    name: "Product A",
    image: "/images/images-carousel/category-a.jpg",
    description:
      "Explore our Product A collection and connect with buyers and sellers in the marketplace.",
  },
  {
    id: 5,
    name: "Product B",
    image: "/images/images-carousel/category-b.jpg",
    description:
      "Explore our Product B collection and connect with buyers and sellers in the marketplace.",
  },
  {
    id: 6,
    name: "Product C",
    image: "/images/images-carousel/category-c.jpg",
    description:
      "Explore our Product C collection and connect with buyers and sellers in the marketplace.",
  },
  {
    id: 7,
    name: "Product D",
    image: "/images/images-carousel/category-d.jpg",
    description:
      "Explore our Product D collection and connect with buyers and sellers in the marketplace.",
  },
  {
    id: 8,
    name: "Product E",
    image: "/images/images-carousel/category-e.jpg",
    description:
      "Explore our Product E collection and connect with buyers and sellers in the marketplace.",
  },
  {
    id: 9,
    name: "Product F",
    image: "/images/images-carousel/category-f.jpg",
    description:
      "Explore our Product F collection and connect with buyers and sellers in the marketplace.",
  },
];

export default function ProductCarousel() {
  const [flippedProducts, setFlippedProducts] = useState<number[]>([]);
  const [failedImages, setFailedImages] = useState<number[]>([]);
  const productCarouselRef = useRef<HTMLDivElement>(null);

  const toggleProductFlip = (id: number) => {
    setFlippedProducts((previous) =>
      previous.includes(id)
        ? previous.filter((productId) => productId !== id)
        : [...previous, id]
    );
  };

  const handleImageError = (id: number) => {
    setFailedImages((previous) =>
      previous.includes(id) ? previous : [...previous, id]
    );
  };

  const scrollProducts = (direction: "left" | "right") => {
    productCarouselRef.current?.scrollBy({
      left: direction === "right" ? 330 : -330,
      behavior: "smooth",
    });
  };

  return (
    <section
        id="products"
        className="w-full scroll-mt-[80px] bg-green-50 px-4 pt-2 pb-4 sm:px-6 lg:px-8 md:pt-2 md:pb-4"
        >
      {/* Heading */}
      <div className="mb-6 w-full">
        <h2 className="text-2xl font-bold text-[#03471c] sm:text-3xl">
          Top Trading Products
        </h2>
      </div>

      {/* Horizontal product carousel */}
      <div
        ref={productCarouselRef}
        className="flex w-full snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product) => {
          const isFlipped = flippedProducts.includes(product.id);
          const imageFailed = failedImages.includes(product.id);

          return (
            <div
              key={product.id}
              className="h-[400px] w-[250px] flex-none snap-start [perspective:1200px] sm:w-[310px]"
            >
              <div
                className={`relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] ${
                  isFlipped ? "[transform:rotateY(180deg)]" : ""
                }`}
              >
                {/* FRONT CARD — frosted glass */}
                <div className="absolute inset-0 flex flex-col overflow-hidden rounded-2xl border border-white/60 bg-white/15 shadow-[0_4px_18px_rgba(3,71,28,0.07)] backdrop-blur-2xl transition-shadow duration-300 hover:shadow-[0_6px_22px_rgba(3,71,28,0.10)] [backface-visibility:hidden]">
                  {/* Product image */}
                  <div className="relative h-[270px] flex-none overflow-hidden bg-emerald-100/40">
                    {imageFailed ? (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-emerald-100/80 via-green-50/60 to-emerald-200/60 text-[#03471c]">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.3"
                          className="h-10 w-10 opacity-60"
                        >
                          <rect
                            x="3"
                            y="3"
                            width="18"
                            height="18"
                            rx="3"
                          />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <path d="m21 15-5-5L5 21" />
                        </svg>

                        <span className="text-sm font-medium opacity-70">
                          {product.name}
                        </span>
                      </div>
                    ) : (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 250px, 310px"
                        onError={() => handleImageError(product.id)}
                        className="object-cover transition-transform duration-500 hover:scale-105"
                      />
                    )}

                    {/* Soft image overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-[#03471c]/10" />

                    {/* Glass info button */}
                    <button
                      type="button"
                      onClick={() => toggleProductFlip(product.id)}
                      aria-label={`View ${product.name} details`}
                      className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/50 bg-white/35 text-lg font-bold text-[#03471c] shadow-[0_2px_8px_rgba(0,0,0,0.06)] backdrop-blur-2xl transition-all duration-300 hover:scale-105 hover:bg-white/60 active:scale-95"
                    >
                      i
                    </button>
                  </div>

                  {/* Lower glass section */}
                  <div className="relative flex flex-1 flex-col justify-center border-t border-white/50 bg-white/20 px-4 py-4 backdrop-blur-2xl">
                    {/* Glass reflection */}
                    <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent" />

                    <h3 className="text-center text-lg font-semibold text-[#102b1d]">
                      {product.name}
                    </h3>

                    {/* Seller and Buyer buttons */}
                    <div className="mt-5 flex gap-3">
                      <Link
                        href="/seller-registration?new=true"
                        className="flex-1 rounded-full border border-white/40 bg-emerald-900/65 px-3 py-2.5 text-center text-sm font-semibold text-white shadow-[0_2px_8px_rgba(3,71,28,0.08)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-900/80 hover:shadow-md active:translate-y-0"
                      >
                        Seller
                      </Link>

                      <Link
                        href="/buyer-registration?new=true"
                        className="flex-1 rounded-full border border-white/70 bg-white/25 px-3 py-2 text-center text-sm font-semibold text-[#03471c] shadow-[0_2px_8px_rgba(3,71,28,0.04)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/45 hover:shadow-sm active:translate-y-0"
                      >
                        Buyer
                      </Link>
                    </div>
                  </div>
                </div>

                {/* BACK CARD — frosted glass */}
                <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/70 bg-green-50/45 p-6 text-center shadow-[0_4px_18px_rgba(3,71,28,0.07)] backdrop-blur-2xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  {/* Decorative glass glow */}
                  <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/40 blur-3xl" />
                  <div className="pointer-events-none absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-emerald-200/30 blur-3xl" />

                  <button
                    type="button"
                    onClick={() => toggleProductFlip(product.id)}
                    aria-label="Return to product"
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/35 text-lg leading-none text-[#03471c] shadow-sm backdrop-blur-xl transition hover:bg-white/65"
                  >
                    <span className="-translate-y-px">&#8592;</span>
                  </button>

                  <h3 className="relative text-2xl font-bold text-[#03471c]">
                    {product.name}
                  </h3>

                  <p className="relative mt-5 text-base leading-7 text-gray-700">
                    {product.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
