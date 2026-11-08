
"use client";

import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import Link from "next/link";
import Image from "next/image";
import Sidebar from "./Sidebar";

const ADMIN_EMAILS = [
  "plesam692@gmail.com",
  "admin2@gmail.com",
  "admin3@gmail.com",
].map((email) => email.toLowerCase().trim());

export default function Header({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const firstLetter = user.email?.charAt(0).toUpperCase();

  const isAdmin =
    !!user.email &&
    ADMIN_EMAILS.includes(user.email.toLowerCase().trim());

  useEffect(() => {
    const productsSection = document.getElementById("products");

    if (!productsSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActiveSection("products");
        } else if (entry.boundingClientRect.top > 72) {
          setActiveSection("home");
        }
      },
      {
        rootMargin: "-20% 0px -65% 0px",
        threshold: 0,
      }
    );

    observer.observe(productsSection);

    return () => observer.disconnect();
  }, []);

  
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");

    if (hash !== "products" && hash !== "contact") return;

    const timeoutId = window.setTimeout(() => {
      const section = document.getElementById(hash);

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        setActiveSection(hash);
      }
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, []);


  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    setActiveSection(sectionId);
  };

  const navLinkClass = (isActive: boolean) =>
    `group relative inline-flex items-center py-2 text-[15px] font-semibold tracking-wide transition-all duration-300 ${
      isActive
        ? "text-[#03471c]"
        : "text-[#345b43] hover:text-[#03471c]"
    }`;

  const glowClass =
    "after:absolute after:inset-x-0 after:-bottom-0.5 after:mx-auto after:h-[2px] after:w-0 after:rounded-full after:bg-emerald-600 after:shadow-[0_0_10px_rgba(5,150,105,0.65)] after:transition-all after:duration-300 hover:after:w-full";

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 h-[72px]">
        {/* Glass background */}
        <div className="absolute inset-0 border-b border-white/60 bg-green-50/85 shadow-[0_4px_20px_rgba(3,71,28,0.04)] backdrop-blur-2xl" />

        {/* Soft bottom fade */}
        <div
          className="pointer-events-none absolute inset-x-0 -bottom-6 h-6"
          style={{
            background:
              "linear-gradient(to bottom, rgba(240,253,244,0.85), rgba(240,253,244,0))",
          }}
        />

        {/* Header content */}
        <div className="relative z-10 flex h-full items-center justify-between px-4 sm:px-6 lg:px-10">
          {/* Logo and navigation */}
          <div className="flex min-w-0 items-center gap-5 sm:gap-8">
            
            <Link
              href="/home"
              onClick={(event) => {
                if (window.location.pathname === "/home") {
                  event.preventDefault();

                  // Remove the #products hash
                  window.history.replaceState(null, "", "/home");

                  // Scroll back to the top
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });

                  setActiveSection("home");
                }
              }}
              aria-label="Go to home"
              className="flex shrink-0 items-center"
            >
              <Image
                src="/images/Skyma_Logo-nobg.png"
                alt="Skyma Logo"
                width={150}
                height={50}
                priority
                className="h-20 w-auto object-contain transition-transform duration-300 hover:scale-[1.03]"
              />
            </Link>
            
            {/* Home */}
            <Link
              href="/home"
              onClick={(event) => {
                if (window.location.pathname === "/home") {
                  event.preventDefault();
                  window.history.replaceState(null, "", "/home");
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                  setActiveSection("home");
                }
              }}
              className={`${navLinkClass(activeSection === "home")} ${glowClass}`}
            >
              Home
            </Link>
            
            {/* Products */}
            <Link
              href="/home#products"
              onClick={(event) => {
                if (window.location.pathname === "/home") {
                  event.preventDefault();
                  window.history.replaceState(null, "", "/home#products");
                  scrollToSection("products");
                }
              }}
              className={`${navLinkClass(activeSection === "products")} ${glowClass} ${
                activeSection === "products"
                  ? "drop-shadow-[0_0_8px_rgba(5,150,105,0.25)]"
                  : ""
              }`}
            >
              Products
            </Link>

            {/* Contact Us */}
            <Link
              href="/home#contact"
              onClick={(event) => {
                if (window.location.pathname === "/home") {
                  event.preventDefault();

                  window.history.replaceState(null, "", "/home#contact");
                  scrollToSection("contact");
                }
              }}
              className={`${navLinkClass(activeSection === "contact")} ${glowClass}`}
            >
              Contact Us
            </Link>

            {/* About Us */}
            <Link
              href="/about-us"
              className={`${navLinkClass(false)} ${glowClass}`}
            >
              About Us
            </Link>

            {/* Our Services — regular users only */}
            {!isAdmin && (
              <div className="group relative">
                <button
                  type="button"
                  className={`${navLinkClass(false)} ${glowClass} gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40`}
                >
                  Our Services

                  <span className="text-[10px] transition-transform duration-300 group-hover:rotate-180">
                    ▼
                  </span>
                </button>

                {/* Glass dropdown */}
                <div
                  className="
                    invisible absolute left-0 top-full z-50 mt-3 w-56
                    translate-y-2 overflow-hidden rounded-2xl
                    border border-white/70 bg-green-50/85 py-2
                    opacity-0 shadow-[0_8px_28px_rgba(3,71,28,0.10)]
                    backdrop-blur-2xl
                    transition-all duration-300
                    group-hover:visible group-hover:translate-y-0
                    group-hover:opacity-100
                  "
                >
                  <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-white" />

                  <Link
                    href="/seller-registration?new=true"
                    className="block px-5 py-3 text-sm font-medium text-[#345b43] transition-all duration-200 hover:bg-white/60 hover:pl-6 hover:text-[#03471c] hover:drop-shadow-[0_0_5px_rgba(5,150,105,0.18)]"
                  >
                    Seller Registration
                  </Link>

                  <Link
                    href="/buyer-registration?new=true"
                    className="block px-5 py-3 text-sm font-medium text-[#345b43] transition-all duration-200 hover:bg-white/60 hover:pl-6 hover:text-[#03471c] hover:drop-shadow-[0_0_5px_rgba(5,150,105,0.18)]"
                  >
                    Buyer Registration
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Profile button */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open profile menu"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/50 bg-[#03471c] text-sm font-bold text-white shadow-[0_3px_12px_rgba(3,71,28,0.18)] transition-all duration-300 hover:scale-105 hover:bg-[#046d2b] hover:shadow-[0_0_18px_rgba(5,150,105,0.35)] active:scale-95"
          >
            {firstLetter}
          </button>
        </div>
      </header>

      <Sidebar open={open} setOpen={setOpen} />
    </>
  );
}
