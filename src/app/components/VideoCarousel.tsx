
"use client";

import { useEffect, useState } from "react";

const videos = [
  {
    src: "/videos/video1.mp4",
    title: "",
    subtitle: "",
  },
  {
    src: "/videos/video2.mp4",
    title: "",
    subtitle: "",
  },
  {
    src: "/videos/video3.mp4",
    title: "",
    subtitle: "",
  },
];

const backgroundColor = "#f0fdf4";

export default function VideoCarousel() {
  const [current, setCurrent] = useState(0);

  // Automatically change videos every 7 seconds.
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((previous) => (previous + 1) % videos.length);
    }, 7000);

    return () => clearInterval(timer);
  }, []);

  const previousSlide = () => {
    setCurrent(
      (previous) => (previous - 1 + videos.length) % videos.length
    );
  };

  const nextSlide = () => {
    setCurrent((previous) => (previous + 1) % videos.length);
  };

  return (
    <section
      className="relative isolate w-full overflow-hidden"
      style={{ backgroundColor }}
    >
      {/* Promotional video */}
      <video
        key={videos[current].src}
        src={videos[current].src}
        autoPlay
        muted
        loop
        playsInline
        className="block h-[300px] w-full object-cover sm:h-[550px] md:h-[700px]"
      />

      {/* Subtle shading over video */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-black/10" />

      {/* Bottom fade — blends into green-50 */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-28 sm:h-40 md:h-48"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(240,253,244,0.08) 20%, rgba(240,253,244,0.25) 45%, rgba(240,253,244,0.55) 75%, #f0fdf4 100%)",
        }}
      />

      {/* Video title */}
      <div className="pointer-events-none absolute left-6 top-1/2 z-10 max-w-md -translate-y-1/2 text-white sm:left-12">
        {videos[current].title && (
          <>
            <h2 className="text-2xl font-bold drop-shadow-lg sm:text-4xl">
              {videos[current].title}
            </h2>

            <p className="mt-2 text-sm drop-shadow sm:text-lg">
              {videos[current].subtitle}
            </p>
          </>
        )}
      </div>
        {/* More transparent glass navigation controls */}
        <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5 rounded-full border border-white/30 bg-emerald-950/18 px-3 py-2 shadow-[0_4px_20px_rgba(3,71,28,0.10)] backdrop-blur-xl">

        {/* Previous button */}
        <button
            type="button"
            onClick={previousSlide}
            aria-label="Previous video"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-white/5 text-white shadow-inner shadow-white/10 backdrop-blur-lg transition-all duration-300 hover:bg-white/15 active:scale-95"
        >
            <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-4 w-4"
            >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 18l-6-6 6-6"
            />
            </svg>
        </button>

        {/* Slide indicators */}
        <div className="flex items-center gap-2 px-1">
            {videos.map((video, index) => (
            <button
                key={video.src}
                type="button"
                onClick={() => setCurrent(index)}
                aria-label={`Show video ${index + 1}`}
                aria-current={current === index ? "true" : undefined}
                className={`h-2 rounded-full transition-all duration-300 ${
                current === index
                    ? "w-7 bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                    : "w-2 bg-white/45 hover:bg-white/75"
                }`}
            />
            ))}
        </div>

        {/* Next button */}
        <button
            type="button"
            onClick={nextSlide}
            aria-label="Next video"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-white/5 text-white shadow-inner shadow-white/10 backdrop-blur-lg transition-all duration-300 hover:bg-white/15 active:scale-95"
        >
            <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-4 w-4"
            >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 18l6-6-6-6"
            />
            </svg>
        </button>
        </div>
    </section>
  );
}
