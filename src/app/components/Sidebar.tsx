
"use client";

import { signOut, onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";

export default function Sidebar({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  const ADMIN_EMAILS = [
    "plesam692@gmail.com",
    "admin2@gmail.com",
    "admin3@gmail.com",
  ].map((email) => email.toLowerCase().trim());

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const isAdmin =
    !!user?.email &&
    ADMIN_EMAILS.includes(user.email.toLowerCase().trim());

  const handleLogout = async () => {
    await signOut(auth);
    setOpen(false);
    router.push("/login");
  };

  const navigateTo = (path: string) => {
    router.push(path);
    setOpen(false);
  };

  return (
    <>
      {/* Soft blurred overlay */}
      <div
        className={`fixed inset-0 z-[100] bg-[#03471c]/15 backdrop-blur-[3px] transition-all duration-300 ${
          open
            ? "visible opacity-100"
            : "invisible opacity-0"
        }`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar drawer */}
      <aside
        aria-label="Account sidebar"
        aria-hidden={!open}
        className={`fixed right-0 top-[80px] z-[101] h-[calc(100dvh-96px)] w-72 max-w-[calc(100vw-24px)] overflow-hidden rounded-l-3xl border border-r-0 border-green-100 bg-green-50/95 shadow-[-12px_0_40px_rgba(3,71,28,0.12)] backdrop-blur-xl transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Soft edge highlights */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-5 bg-gradient-to-r from-white/70 to-transparent" />

        <div className="relative flex h-full flex-col justify-between p-6">
          {/* Top section */}
          <div>
            <div className="mb-7 border-b border-green-200/70 pb-4">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-green-700/70">
                Your profile
              </p>

              <h3 className="mt-1 text-xl font-semibold text-[#03471c]">
                Account
              </h3>
            </div>

            {/* Change password */}
            <button
              type="button"
              onClick={() => navigateTo("/change-password")}
              tabIndex={open ? 0 : -1}
              className="mb-2 w-full rounded-xl border border-transparent px-4 py-3 text-left text-sm font-medium text-[#03471c] transition-all duration-200 hover:border-green-200 hover:bg-white/80 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600/30"
            >
              <span className="flex items-center gap-3">
                Change Password
              </span>
            </button>

            {/* Admin history or user history */}
            <button
              type="button"
              onClick={() =>
                navigateTo(isAdmin ? "/admin-history" : "/history")
              }
              tabIndex={open ? 0 : -1}
              className="mb-2 w-full rounded-xl border border-transparent px-4 py-3 text-left text-sm font-medium text-[#03471c] transition-all duration-200 hover:border-green-200 hover:bg-white/80 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600/30"
            >
              <span className="flex items-center gap-3">
                {isAdmin ? "Admin History" : "History"}
              </span>
            </button>
          </div>

          {/* Bottom section */}
          <div className="border-t border-green-200/70 pt-5">
            <button
              type="button"
              onClick={handleLogout}
              tabIndex={open ? 0 : -1}
              className="w-full rounded-xl border border-[#03471c]/10 bg-[#03471c] px-4 py-3 text-sm font-semibold text-white shadow-md shadow-green-900/10 transition-all duration-200 hover:bg-[#046d2b] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-600/40"
            >
              <span className="flex items-center justify-center gap-2">
                <span>↪</span>
                Logout
              </span>
            </button>

            <p className="mt-4 text-center text-xs text-green-800/50">
              SKYMA · Your business, connected
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
