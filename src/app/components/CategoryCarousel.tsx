
"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    id: 1,
    name: "Fruits",
    image: "/images/images-carousel/fruits.jpg",
    description:
      "Explore Category X products, discover available options, and connect with sellers on the Skyma marketplace.",
  },
  {
    id: 2,
    name: "Category Y",
    image: "/images/images-carousel/category-y.jpg",
    description:
      "Discover Category Y products and find suitable options for your business or personal needs.",
  },
  {
    id: 3,
    name: "Category Z",
    image: "/images/images-carousel/category-z.jpg",
    description:
      "Browse Category Z products and explore opportunities to buy or sell through Skyam.",
  },
  {
    id: 4,
    name: "Category A",
    image: "/images/images-carousel/category-a.jpg",
    description:
      "Explore our Category A collection and connect with buyers and sellers in the marketplace.",
  },
  {
    id: 5,
    name: "Category B",
    image: "/images/images-carousel/category-b.jpg",
    description:
      "Explore our Category B collection and connect with buyers and sellers in the marketplace.",
  },
  {
    id: 6,
    name: "Category C",
    image: "/images/images-carousel/category-c.jpg",
    description:
      "Explore our Category C collection and connect with buyers and sellers in the marketplace.",
  },
  {
    id: 7,
    name: "Category D",
    image: "/images/images-carousel/category-d.jpg",
    description:
      "Explore our Category D collection and connect with buyers and sellers in the marketplace.",
  },
  {
    id: 8,
    name: "Category E",
    image: "/images/images-carousel/category-e.jpg",
    description:
      "Explore our Category E collection and connect with buyers and sellers in the marketplace.",
  },
  {
    id: 9,
    name: "Category F",
    image: "/images/images-carousel/category-f.jpg",
    description:
      "Explore our Category F collection and connect with buyers and sellers in the marketplace.",
  },
];

export default function CategoryCarousel() {
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [failedImages, setFailedImages] = useState<number[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);

  const toggleFlip = (id: number) => {
    setFlippedCards((previous) =>
      previous.includes(id)
        ? previous.filter((cardId) => cardId !== id)
        : [...previous, id]
    );
  };

  const handleImageError = (id: number) => {
    setFailedImages((previous) =>
      previous.includes(id) ? previous : [...previous, id]
    );
  };

  const scrollCarousel = (direction: "left" | "right") => {
    carouselRef.current?.scrollBy({
      left: direction === "right" ? 330 : -330,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full bg-green-50 px-4 pt-8 pb-2 sm:px-6 lg:px-8 md:pt-8 md:pb-2">

      {/* Heading */}
      <div className="mb-6 w-full">
        <h2 className="text-2xl font-bold text-[#03471c] sm:text-3xl">
          Explore Trading Categories
        </h2>
      </div>

      {/* Horizontal carousel */}
      <div
        ref={carouselRef}
        className="flex w-full snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {categories.map((category) => {
          const isFlipped = flippedCards.includes(category.id);
          const imageFailed = failedImages.includes(category.id);

          return (
            <div
              key={category.id}
              className="h-[400px] w-[250px] flex-none snap-start [perspective:1200px] sm:w-[310px]"
            >
              {/* Flip wrapper */}
              <div
                className={`relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] ${
                  isFlipped ? "[transform:rotateY(180deg)]" : ""
                }`}
              >

                {/* FRONT CARD */}
                <div
                  className="
                    absolute inset-0 flex flex-col
                    overflow-hidden rounded-2xl
                    border border-white/70
                    bg-[#f0fdf4]
                    shadow-[0_4px_18px_rgba(3,71,28,0.07)]
                    transition-shadow duration-300
                    hover:shadow-[0_6px_22px_rgba(3,71,28,0.12)]
                    [backface-visibility:hidden]
                    [-webkit-backface-visibility:hidden]
                  "
                >

                  {/* Image */}
                  <div className="relative h-[270px] flex-none overflow-hidden bg-emerald-100">
                    {imageFailed ? (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-emerald-100 via-green-50 to-emerald-200 text-[#03471c]">
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
                          {category.name}
                        </span>
                      </div>
                    ) : (
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        sizes="(max-width: 640px) 250px, 310px"
                        onError={() => handleImageError(category.id)}
                        className="object-cover transition-transform duration-500 hover:scale-105"
                      />
                    )}

                    {/* Soft image overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-[#03471c]/10" />

                    {/* Info button */}
                    <button
                      type="button"
                      onClick={() => toggleFlip(category.id)}
                      aria-label={`View ${category.name} description`}
                      className="
                        absolute right-3 top-3 z-10
                        flex h-9 w-9 items-center justify-center
                        rounded-full border border-white/70
                        bg-white/90 text-lg font-bold text-[#03471c]
                        shadow-[0_2px_8px_rgba(0,0,0,0.08)]
                        transition-all duration-300
                        hover:scale-105 hover:bg-white
                        active:scale-95
                      "
                    >
                      i
                    </button>
                  </div>

                  {/* Lower card section */}
                  <div className="relative flex flex-1 flex-col justify-center border-t border-white/70 bg-white/85 px-4 py-4">

                    {/* Glass-style reflection */}
                    <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

                    <h3 className="text-center text-lg font-semibold text-[#102b1d]">
                      {category.name}
                    </h3>

                    {/* Seller and Buyer buttons */}
                    <div className="mt-5 flex gap-3">
                      <Link
                        href="/seller-registration?new=true"
                        className="
                          flex-1 rounded-full
                          border border-white/50
                          bg-[#568f80] px-3 py-2.5
                          text-center text-sm font-semibold text-white
                          shadow-[0_2px_8px_rgba(3,71,28,0.10)]
                          transition-all duration-300
                          hover:-translate-y-0.5
                          hover:bg-[#477d6e] hover:shadow-md
                          active:translate-y-0
                        "
                      >
                        Seller
                      </Link>

                      <Link
                        href="/buyer-registration?new=true"
                        className="
                          flex-1 rounded-full
                          border border-white/80
                          bg-white/90 px-3 py-2
                          text-center text-sm font-semibold text-[#03471c]
                          shadow-[0_2px_8px_rgba(3,71,28,0.05)]
                          transition-all duration-300
                          hover:-translate-y-0.5
                          hover:bg-white hover:shadow-sm
                          active:translate-y-0
                        "
                      >
                        Buyer
                      </Link>
                    </div>
                  </div>
                </div>

                {/* BACK CARD */}
                <div
                  className="
                    absolute inset-0 flex flex-col
                    items-center justify-center
                    overflow-hidden rounded-2xl
                    border border-white/70
                    bg-[#f0fdf4] p-6 text-center
                    shadow-[0_4px_18px_rgba(3,71,28,0.07)]
                    [backface-visibility:hidden]
                    [-webkit-backface-visibility:hidden]
                    [transform:rotateY(180deg)]
                  "
                >

                  {/* Decorative glow */}
                  <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/60 blur-3xl" />

                  <div className="pointer-events-none absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-emerald-200/50 blur-3xl" />

                  {/* Back button */}
                  <button
                    type="button"
                    onClick={() => toggleFlip(category.id)}
                    aria-label="Return to front of card"
                    className="
                      absolute right-3 top-3
                      flex h-9 w-9 items-center justify-center
                      rounded-full border border-white/80
                      bg-white/90 text-lg leading-none text-[#03471c]
                      shadow-sm transition hover:bg-white
                    "
                  >
                    <span className="block -translate-y-px">
                      &#8592;
                    </span>
                  </button>

                  <h3 className="relative text-2xl font-bold text-[#03471c]">
                    {category.name}
                  </h3>

                  <p className="relative mt-5 text-base leading-7 text-gray-700">
                    {category.description}
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
