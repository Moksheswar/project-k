
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden border-t border-white/60 bg-gradient-to-r from-[#03471c] via-[#0b6034] to-[#03471c] text-[#03471c] shadow-[0_-4px_20px_rgba(3,71,28,0.12)]">

      {/* Main glass-style background */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-50/95 via-green-50/90 to-emerald-100/95">

        {/* Soft reflections */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-emerald-100/30" />

        {/* Decorative background glow */}
        <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-green-200/40 blur-3xl" />

        {/* Footer content */}
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 py-12 md:grid-cols-3 md:gap-6 lg:px-10">

          {/* LEFT: Contact and Social Media */}
          <div className="flex flex-col items-center gap-6 md:items-start">

            <div>
              <h3 className="mb-5 text-xl font-bold text-[#03471c]">
                Contact Us
              </h3>

              {/* Phone */}
              <a
                href="tel:+910000000000"
                className="mb-3 flex items-center gap-3 text-base text-[#345b43] transition hover:text-[#03471c]"
              >
                <svg
                  className="h-5 w-5 shrink-0"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.56 3.58.56a1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.19 2.46.56 3.58a1 1 0 01-.25 1.01l-2.19 2.2z" />
                </svg>
                +91 XXXXX XXXXX
              </a>

              {/* Email */}
              <a
                href="mailto:skyma.info@gmail.com"
                className="flex items-center gap-3 text-base text-[#345b43] transition hover:text-[#03471c]"
              >
                <svg
                  className="h-5 w-5 shrink-0"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20 4H4a2 2 0 00-2 2v1l10 6 10-6V6a2 2 0 00-2-2zm2 5.3l-9.49 5.7a1 1 0 01-1.02 0L2 9.3V18a2 2 0 002 2h16a2 2 0 002-2V9.3z" />
                </svg>
                skyma.info@gmail.com
              </a>
            </div>

            {/* Social media */}
            <div>
              <h3 className="mb-4 text-lg font-bold text-[#03471c]">
                Follow for latest updates
              </h3>

              <div className="flex items-center gap-3">

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/skyma.co.in/"
                  aria-label="Instagram"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-white/75 text-[#03471c] shadow-sm transition hover:-translate-y-1 hover:bg-white"
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="18" cy="6" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="#"
                  aria-label="LinkedIn"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-white/75 text-[#03471c] shadow-sm transition hover:-translate-y-1 hover:bg-white"
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                    <path d="M5.2 3a2.2 2.2 0 110 4.4 2.2 2.2 0 010-4.4zM3.4 9h3.6v12H3.4zm5.8 0h3.4v1.6h.05A3.7 3.7 0 0116 8.7c3.7 0 4.4 2.4 4.4 5.5V21h-3.6v-6c0-1.4 0-3.2-2-3.2s-2.3 1.5-2.3 3.1V21H9.2z" />
                  </svg>
                </a>

                {/* X */}
                <a
                  href="#"
                  aria-label="X"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-white/75 text-[#03471c] shadow-sm transition hover:-translate-y-1 hover:bg-white"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                    <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-5-8.1L4.8 22H1.7l7.3-8.4L1.2 2h6.4l4.5 7.5L18.9 2zm-1.1 18h1.7L6.7 3.9H4.9z" />
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="#"
                  aria-label="YouTube"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-white/75 text-[#03471c] shadow-sm transition hover:-translate-y-1 hover:bg-white"
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                    <path d="M23 7.2a3 3 0 00-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 001 7.2 31 31 0 00.5 12 31 31 0 001 16.8a3 3 0 002.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 002.1-2.1 31 31 0 00.5-4.8 31 31 0 00-.5-4.8zM9.7 15.5v-7l6 3.5z" />
                  </svg>
                </a>

              </div>
            </div>
          </div>

          {/* CENTER: Logo and caption */}
          <div className="flex flex-col items-center justify-center text-center">

            <Link href="/home" aria-label="Skyma Home">
              <Image
                src="/images/Skyma_Logo-nobg.png"
                alt="Skyma Logo"
                width={220}
                height={160}
                className="h-36 w-auto object-contain transition-transform duration-300 hover:scale-105"
              />
            </Link>

            <p className="mt-3 text-base font-medium text-[#345b43] sm:text-lg">
              Connecting Buyers &amp; Sellers Globally.
            </p>

            <p className="mt-7 text-sm font-medium text-[#568f80]">
              © {new Date().getFullYear()} All Rights Reserved.
            </p>

          </div>

          {/* RIGHT: Services */}
          <div className="flex flex-col items-center md:items-end">

            <div>
              <h3 className="mb-5 text-xl font-bold text-[#03471c]">
                Our Services
              </h3>

              <div className="flex flex-col gap-4">

                {/* Import */}
                <Link
                  href="/buyer-registration?new=true"
                  className="group flex items-center gap-3 text-base text-[#345b43] transition hover:translate-x-1 hover:text-[#03471c]"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-white/75 shadow-sm transition group-hover:bg-white">
                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 3v12m-5-5l5 5 5-5" />
                      <path d="M4 16v4h16v-4" />
                    </svg>
                  </span>
                  <span className="text-lg font-medium">Buyer Registration</span>
                </Link>

                {/* Export */}
                <Link
                  href="/seller-registration?new=true"
                  className="group flex items-center gap-3 text-base text-[#345b43] transition hover:translate-x-1 hover:text-[#03471c]"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-white/75 shadow-sm transition group-hover:bg-white">
                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 15V3m-5 5l5-5 5 5" />
                      <path d="M4 16v4h16v-4" />
                    </svg>
                  </span>
                  <span className="text-lg font-medium">Seller registration</span>
                </Link>

              </div>
            </div>
          </div>

        </div>

        {/* Bottom green highlight */}
        <div className="pointer-events-none relative h-[4px] bg-gradient-to-r from-emerald-200 via-emerald-500/70 to-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.45)]" />

      </div>
    </footer>
  );
}
