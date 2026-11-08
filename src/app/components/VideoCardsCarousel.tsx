
"use client";

type VideoItem = {
  id: number;
  src: string;
  poster?: string;
  title: string;
};

const videos: VideoItem[] = [
  {
    id: 1,
    src: "/videos/video1.mp4",
    title: "Realme",
  },
  {
    id: 2,
    src: "/videos/video2.mp4",
    title: "Samsung",
  },
  {
    id: 3,
    src: "/videos/video3.mp4",
    title: "Xiaomi",
  },
  {
    id: 4,
    src: "/videos/video1.mp4",
    title: "Featured Video",
  },
];

export default function VideoCardsCarousel() {
  return (
    <section className="w-full overflow-hidden py-6 md:py-8">

      {/* SECTION HEADER */}

      <div className="mb-6 px-5 sm:px-8">

        <h2 className="text-2xl font-bold text-[#03471c] md:text-3xl">
          Featured Videos
        </h2>

      </div>


      {/* AUTO-PLAYING VIDEO CARDS */}

      <div
        className="
          flex gap-5 overflow-x-auto
          px-5 pb-3 sm:px-8
          [scrollbar-width:none]
          [-ms-overflow-style:none]
          [&::-webkit-scrollbar]:hidden
        "
      >

        {videos.map((video) => (

          <div
            key={video.id}
            className="
              group relative
              aspect-video w-[85vw]
              shrink-0 overflow-hidden
              rounded-xl border border-white/70
              bg-gray-300
              shadow-[0_5px_20px_rgba(3,71,28,0.10)]
              sm:w-[480px]
              lg:w-[600px]
            "
          >

            {/* LOCAL AUTO-PLAY VIDEO */}

            <video
              src={video.src}
              poster={video.poster}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              disablePictureInPicture
              controls={false}
              tabIndex={-1}
              aria-label={video.title}
              className="
                pointer-events-none
                absolute inset-0
                h-full w-full
                object-cover
              "
            />

          </div>

        ))}

      </div>

    </section>
  );
}
