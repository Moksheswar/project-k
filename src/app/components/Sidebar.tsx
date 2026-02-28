"use client";

import { signOut } from "firebase/auth";
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

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col h-full justify-between p-6">
          {/* Top Section */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Account</h3>

            <button
              onClick={() => {
                router.push("/change-password");
                setOpen(false);
              }}
              className="w-full text-left p-2 hover:bg-gray-100 cursor-pointer"
            >
              Change Password
            </button>
          </div>

          {/* Bottom Section */}
          <button
            onClick={handleLogout}
            className="w-full bg-black text-white p-2 cursor-pointer hover:bg-gray-800"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}