
"use client";

type Country = {
  name: string;
  image: string;
};

const countries: Country[] = [
  { name: "Argentina", image: "/images/flags/argentina.png" },
  { name: "Australia", image: "/images/flags/australia.png" },
  { name: "Belgium", image: "/images/flags/belgium.png" },
  { name: "Canada", image: "/images/flags/canada.png" },
  { name: "China", image: "/images/flags/china.png" },
  { name: "England", image: "/images/flags/england.png" },
  { name: "France", image: "/images/flags/france.png" },
  { name: "Germany", image: "/images/flags/germany.png" },
  { name: "India", image: "/images/flags/india.png" },
  { name: "Japan", image: "/images/flags/japan.png" },
  { name: "Russia", image: "/images/flags/russia.png" },
  { name: "Singapore", image: "/images/flags/singapore.png" },
  { name: "South Korea", image: "/images/flags/south-korea.png" },
  { name: "Spain", image: "/images/flags/spain.png" },
  { name: "Sri Lanka", image: "/images/flags/sri-lanka.png" },
  { name: "Switzerland", image: "/images/flags/switzerland.png" },
  { name: "Turkey", image: "/images/flags/turkey.png" },
  { name: "UAE", image: "/images/flags/uae.png" },
  { name: "UK", image: "/images/flags/united-kingdom.png" },
  { name: "USA", image: "/images/flags/united-states.png" },
  { name: "Vietnam", image: "/images/flags/vietnam.png" },
];

export default function CountriesMarquee() {
  // Duplicate countries for seamless infinite scrolling
  const marqueeCountries = [...countries, ...countries];

  return (
    <section className="w-full px-5 py-6 sm:px-8 md:py-6">

      {/* GLASS BACKGROUND - SAME AS FOOTER */}

      <div
        className="
          relative overflow-hidden
          rounded-3xl
          border border-white/60
          shadow-[0_8px_30px_rgba(3,71,28,0.10)]
          backdrop-blur-2xl
        "
      >

        {/* MAIN GLASS BACKGROUND */}

        <div className="
          relative overflow-hidden
          bg-gradient-to-br
          from-green-50/95
          via-green-50/90
          to-emerald-100/95
        ">

          {/* SOFT REFLECTIONS - SAME AS FOOTER */}

          <div className="
            pointer-events-none absolute inset-0
            bg-gradient-to-b
            from-white/50
            via-transparent
            to-emerald-100/30
          " />

          {/* DECORATIVE BACKGROUND GLOW - SAME AS FOOTER */}

          <div className="
            pointer-events-none absolute
            -left-20 top-0
            h-72 w-72
            rounded-full
            bg-emerald-200/30
            blur-3xl
          " />

          <div className="
            pointer-events-none absolute
            -right-20 bottom-0
            h-72 w-72
            rounded-full
            bg-green-200/40
            blur-3xl
          " />


          {/* SECTION HEADER */}

          <div className="
            relative z-10
            mb-5
            px-6 pt-8
            md:px-10 md:pt-10
          ">

            <h2 className="
              mt-2
              text-2xl font-bold
              text-[#03471c]
              md:text-3xl
            ">
              Countries We Connect With
            </h2>

          </div>


          {/* COUNTRY MARQUEE */}

          <div className="
            relative z-10
            overflow-hidden
            py-5 md:py-7
          ">

            {/* LEFT FADE */}

            <div
              className="
                pointer-events-none
                absolute inset-y-0 left-0 z-20
                w-12 md:w-20
              "
              style={{
                background:
                  "linear-gradient(to right, rgba(240,253,244,0.95), transparent)",
              }}
            />

            {/* RIGHT FADE */}

            <div
              className="
                pointer-events-none
                absolute inset-y-0 right-0 z-20
                w-12 md:w-20
              "
              style={{
                background:
                  "linear-gradient(to left, rgba(236,253,245,0.95), transparent)",
              }}
            />


            {/* INFINITE SCROLL TRACK */}

            <div className="countries-marquee-track flex w-max">

              {marqueeCountries.map((country, index) => (

                <div
                  key={`${country.name}-${index}`}
                  className="
                    flex w-[125px] shrink-0
                    flex-col items-center
                    justify-center
                    gap-3 px-4
                    sm:w-[155px]
                    md:w-[175px]
                  "
                >

                  {/* FLAG IMAGE */}

                  <div className="
                    h-[76px] w-[76px]
                    overflow-hidden
                    rounded-full
                    border-[3px] border-white/90
                    bg-white/60
                    shadow-[0_4px_15px_rgba(3,71,28,0.13)]
                    transition-all duration-300 ease-out
                    hover:scale-105
                    hover:shadow-[0_6px_20px_rgba(3,71,28,0.22)]
                    sm:h-[90px] sm:w-[90px]
                    md:h-[100px] md:w-[100px]
                  ">

                    <img
                      src={country.image}
                      alt={`${country.name} flag`}
                      loading="lazy"
                      className="
                        h-full w-full
                        object-cover
                      "
                    />

                  </div>


                  {/* COUNTRY NAME */}

                  <p className="
                    text-center
                    text-sm font-semibold
                    text-[#03471c]
                    sm:text-base
                  ">
                    {country.name}
                  </p>

                </div>

              ))}

            </div>

          </div>

        </div>

      </div>


      {/* MARQUEE ANIMATION */}

      <style jsx>{`
        .countries-marquee-track {
          animation: countries-scroll 20s linear infinite;
        }

        .countries-marquee-track:hover {
          animation-play-state: paused;
        }

        @keyframes countries-scroll {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .countries-marquee-track {
            animation: none;
          }
        }
      `}</style>

    </section>
  );
}
