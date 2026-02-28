"use client";

import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset link sent to your email");
    } catch (err: any) {
      switch (err.code) {
        case "auth/user-not-found":
          toast.error("No account found with this email");
          break;
        case "auth/invalid-email":
          toast.error("Invalid email address");
          break;
        default:
          toast.error("Failed to send reset email");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-96 border p-6 rounded space-y-4">
        <h1 className="text-2xl font-bold">Forgot Password</h1>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleReset}
          disabled={loading}
          className="w-full bg-black text-white p-2 disabled:opacity-50 cursor-pointer hover:bg-white hover:text-black"
        >
          {loading ? "Sending..." : "Send reset link"}
        </button>

        <p className="text-sm text-center">
          <Link href="/login" className="underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
