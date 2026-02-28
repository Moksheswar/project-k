"use client";

import { useState } from "react";
import { User } from "firebase/auth";
import Sidebar from "./Sidebar";

export default function Header({ user }: { user: User }) {
  const [open, setOpen] = useState(false);

  const firstLetter = user.email?.charAt(0).toUpperCase();

  return (
    <>
      <header className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-semibold">Home</h2>

        <div
          onClick={() => setOpen(true)}
          className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center cursor-pointer"
        >
          {firstLetter}
        </div>
      </header>

      <Sidebar open={open} setOpen={setOpen} />
    </>
  );
}