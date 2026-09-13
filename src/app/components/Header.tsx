"use client";

import { useState } from "react";
import { User } from "firebase/auth";
import Link from "next/link";
import Sidebar from "./Sidebar";

export default function Header({ user }: { user: User }) {
  const [open, setOpen] = useState(false);

  const firstLetter = user.email?.charAt(0).toUpperCase();

  return (
    <>
      <header
        className="
          fixed
          top-0
          left-0
          right-0
          z-50
          h-[72px]
          flex
          items-center
          justify-between
          px-6
          bg-white
          shadow-sm
        "
      >
        {/* Left Side */}
        <div className="flex items-center gap-8">

          {/* Home */}
          <Link
            href="/home"
            className="
              text-xl
              font-semibold
              text-[#03471c]
              hover:text-[#046d2b]
              transition
            "
          >
            Home
          </Link>

          {/* Our Services */}
          <div className="group relative">

            <button
              type="button"
              className="
                flex
                items-center
                gap-2
                text-sm
                font-medium
                text-[#03471c]
                hover:text-[#046d2b]
                transition
                focus:outline-none
              "
            >
              Our Services

              <span className="text-xs transition-transform duration-200 group-hover:rotate-180">
                ▼
              </span>
            </button>

            {/* Dropdown */}
            <div
              className="
                invisible
                absolute
                left-0
                top-full
                mt-3
                w-56
                rounded-lg
                bg-white
                shadow-lg
                border
                border-gray-200
                py-2
                z-50
                opacity-0
                transition-all
                duration-200
                group-hover:visible
                group-hover:opacity-100
              "
            >
              <Link
                href="/seller-registration?new=true"
                className="
                  block
                  px-4
                  py-3
                  text-sm
                  text-gray-700
                  hover:bg-green-50
                  hover:text-[#03471c]
                  transition
                "
              >
                Seller Registration
              </Link>

              <Link
                href="/buyer-registration?new=true"
                className="
                  block
                  px-4
                  py-3
                  text-sm
                  text-gray-700
                  hover:bg-green-50
                  hover:text-[#03471c]
                  transition
                "
              >
                Buyer Registration
              </Link>
            </div>

          </div>

          {/* History */}
          <Link
            href="/history"
            className="
              text-sm
              font-medium
              text-[#03471c]
              hover:text-[#046d2b]
              transition
            "
          >
            History
          </Link>
        </div>

        {/* Profile */}
        <div
          onClick={() => setOpen(true)}
          className="
            w-10
            h-10
            bg-[#03471c]
            text-white
            rounded-full
            flex
            items-center
            justify-center
            cursor-pointer
            hover:bg-[#046d2b]
            transition
            shadow-md
          "
        >
          {firstLetter}
        </div>
      </header>

      <Sidebar open={open} setOpen={setOpen} />
    </>
  );
}