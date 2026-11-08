
"use client";

import { useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { auth } from "../../lib/firebase";
import Header from "../components/Header";

export default function AboutUsPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        if (!currentUser) {
          router.push("/login");
          return;
        }

        setUser(currentUser);
        setCheckingAuth(false);
      }
    );

    return () => unsubscribe();
  }, [router]);

  if (checkingAuth || !user) {
    return null;
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed bg-no-repeat pt-[72px]"
      style={{
        backgroundImage: "url('images/skyma-dbg.jpg')",
      }}
    >
      {/* FIXED HEADER */}
      <Header user={user} />

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 md:px-8">

        {/* =========================================
            HERO SECTION
        ========================================= */}

        <section className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/35 p-8 shadow-[0_8px_30px_rgba(3,71,28,0.10)] backdrop-blur-2xl md:p-14">

          {/* Decorative background circles */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-emerald-400/15 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-green-500/10 blur-3xl" />

          <div className="relative z-10 max-w-3xl">

            <span className="inline-flex rounded-full border border-emerald-200/70 bg-emerald-50/70 px-4 py-2 text-xs font-bold tracking-[0.2em] text-[#06752e]">
              ABOUT SKYMA
            </span>

            <h1 className="mt-7 text-4xl font-bold leading-tight text-[#03471c] sm:text-5xl md:text-6xl">
              Connecting Buyers.
              <span className="block text-emerald-700">
                Empowering Suppliers.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-gray-700 md:text-lg">
              At Skyma, we aim to make product sourcing and supplier
              connections more accessible, organized, and meaningful.
              We bring buyer requirements and supplier opportunities
              closer through a structured approach to trade.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">

              <Link
                href="/buyer-registration?new=true"
                className="rounded-xl border border-white/30 bg-emerald-800/90 px-7 py-3 font-semibold text-white shadow-[0_4px_14px_rgba(3,71,28,0.16)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-900 hover:shadow-[0_6px_18px_rgba(3,71,28,0.22)]"
              >
                Explore as Buyer →
              </Link>

              <Link
                href="/seller-registration?new=true"
                className="rounded-xl border border-emerald-800/30 bg-white/45 px-7 py-3 font-semibold text-[#03471c] shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/75"
              >
                Join as Seller →
              </Link>

            </div>

          </div>
        </section>


        {/* =========================================
            WHO WE ARE
        ========================================= */}

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2">

          <div className="flex flex-col justify-center rounded-3xl border border-white/70 bg-white/45 p-8 shadow-[0_8px_30px_rgba(3,71,28,0.08)] backdrop-blur-2xl md:p-10">

            <span className="text-xs font-bold tracking-[0.2em] text-emerald-700">
              WHO WE ARE
            </span>

            <h2 className="mt-4 text-3xl font-bold text-[#03471c]">
              Bringing Trade Opportunities Closer
            </h2>

            <p className="mt-5 text-sm leading-8 text-gray-700 md:text-base">
              Skyma is built around a simple idea: connecting people
              who need products with those who can supply them.
            </p>

            <p className="mt-4 text-sm leading-8 text-gray-700 md:text-base">
              We focus on making product requirements easier to
              communicate, from product specifications and quantities
              to pricing expectations and delivery preferences.
            </p>

            <p className="mt-4 text-sm leading-8 text-gray-700 md:text-base">
              Our goal is to provide a structured starting point
              for meaningful buyer and supplier interactions.
            </p>

          </div>

          <div className="relative flex min-h-[320px] flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-[#03471c] via-emerald-800 to-[#06752e] p-8 text-white shadow-[0_8px_30px_rgba(3,71,28,0.15)] md:p-10">

            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full border border-white/10" />

            <div className="absolute -bottom-24 -right-10 h-72 w-72 rounded-full border border-white/10" />

            <div className="relative">
              <span className="text-xs font-bold tracking-[0.2em] text-emerald-200">
                OUR VISION
              </span>

              <h2 className="mt-6 text-3xl font-bold leading-snug md:text-4xl">
                Making Every Connection Count.
              </h2>
            </div>

            <p className="relative mt-10 max-w-md text-sm leading-8 text-white/80">
              We envision a more connected sourcing experience
              where clear requirements, effective communication,
              and meaningful business relationships come together.
            </p>

          </div>

        </section>


        {/* =========================================
            WHAT WE DO
        ========================================= */}

        <section className="rounded-3xl border border-white/70 bg-white/35 p-8 shadow-[0_8px_30px_rgba(3,71,28,0.08)] backdrop-blur-2xl md:p-12">

          <div className="mx-auto max-w-2xl text-center">

            <span className="text-xs font-bold tracking-[0.2em] text-emerald-700">
              WHAT WE DO
            </span>

            <h2 className="mt-4 text-3xl font-bold text-[#03471c] md:text-4xl">
              A Simpler Way to Connect
            </h2>

            <p className="mt-4 text-sm leading-7 text-gray-600">
              We bring together important parts of the sourcing
              process to make buyer and supplier interactions
              more organized.
            </p>

          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {/* BUYERS */}

            <div className="group rounded-2xl border border-white/80 bg-white/45 p-7 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/75 hover:shadow-lg">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100/80 text-2xl">
                <span>🛒</span>
              </div>

              <h3 className="mt-6 text-xl font-bold text-[#03471c]">
                For Buyers
              </h3>

              <p className="mt-3 text-sm leading-7 text-gray-600">
                Share your product requirements, preferred quantities,
                budget expectations, quality specifications,
                and delivery preferences.
              </p>

            </div>


            {/* SELLERS */}

            <div className="group rounded-2xl border border-white/80 bg-white/45 p-7 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/75 hover:shadow-lg">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100/80 text-2xl">
                <span>📦</span>
              </div>

              <h3 className="mt-6 text-xl font-bold text-[#03471c]">
                For Suppliers
              </h3>

              <p className="mt-3 text-sm leading-7 text-gray-600">
                Register your business and present your products
                to connect with potential buyers looking for
                relevant products and supplies.
              </p>

            </div>


            {/* CONNECTIONS */}

            <div className="group rounded-2xl border border-white/80 bg-white/45 p-7 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/75 hover:shadow-lg sm:col-span-2 lg:col-span-1">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100/80 text-2xl">
                <span>🤝</span>
              </div>

              <h3 className="mt-6 text-xl font-bold text-[#03471c]">
                Meaningful Connections
              </h3>

              <p className="mt-3 text-sm leading-7 text-gray-600">
                Encourage better communication between buyers
                and suppliers through structured requirements
                and business information.
              </p>

            </div>

          </div>

        </section>


        {/* =========================================
            OUR APPROACH
        ========================================= */}

        <section className="rounded-3xl border border-white/70 bg-white/45 p-8 shadow-[0_8px_30px_rgba(3,71,28,0.08)] backdrop-blur-2xl md:p-12">

          <div className="text-center">

            <span className="text-xs font-bold tracking-[0.2em] text-emerald-700">
              OUR APPROACH
            </span>

            <h2 className="mt-4 text-3xl font-bold text-[#03471c]">
              What Guides Us
            </h2>

          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">

            <div className="text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50/80 text-2xl">
                🎯
              </div>

              <h3 className="mt-5 text-lg font-bold text-[#03471c]">
                Clarity
              </h3>

              <p className="mt-3 text-sm leading-7 text-gray-600">
                Making product requirements and expectations
                easier to understand and communicate.
              </p>

            </div>

            <div className="text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50/80 text-2xl">
                🔗
              </div>

              <h3 className="mt-5 text-lg font-bold text-[#03471c]">
                Connection
              </h3>

              <p className="mt-3 text-sm leading-7 text-gray-600">
                Bringing buyers and suppliers closer through
                relevant business opportunities.
              </p>

            </div>

            <div className="text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50/80 text-2xl">
                💬
              </div>

              <h3 className="mt-5 text-lg font-bold text-[#03471c]">
                Communication
              </h3>

              <p className="mt-3 text-sm leading-7 text-gray-600">
                Encouraging clear information exchange
                throughout the sourcing journey.
              </p>

            </div>

          </div>

        </section>


        {/* =========================================
            FINAL CALL TO ACTION
        ========================================= */}

        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#03471c] via-emerald-800 to-[#06752e] p-9 text-center shadow-[0_8px_30px_rgba(3,71,28,0.15)] md:p-14">

          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

          <div className="relative">

            <h2 className="text-3xl font-bold text-white md:text-4xl">
              Let's Build Connections Together.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/80 md:text-base">
              Whether you are looking to source products
              or introduce your products to potential buyers,
              take the next step with Skyma.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">

              <Link
                href="/buyer-registration?new=true"
                className="rounded-xl bg-white px-7 py-3 font-semibold text-[#03471c] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-50"
              >
                Register as Buyer
              </Link>

              <Link
                href="/seller-registration?new=true"
                className="rounded-xl border border-white/50 bg-white/10 px-7 py-3 font-semibold text-white backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/20"
              >
                Register as Seller
              </Link>

            </div>

          </div>

        </section>

      </main>
    </div>
  );
}
