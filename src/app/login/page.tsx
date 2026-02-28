"use client";

import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../../lib/firebase";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";

function getLoginErrorMessage(code: string) {
  switch (code) {
    case "auth/user-not-found":
      return "No account found with this email.";
    case "auth/wrong-password":
      return "Incorrect password.";
    case "auth/invalid-email":
      return "Invalid email address.";
    case "auth/too-many-requests":
      return "Too many attempts. Try again later.";
    default:
      return "Login failed. Please try again.";
  }
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Email + Password Login
  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(getLoginErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Logged in with Google");
      router.push("/dashboard");
    } catch {
      toast.error("Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center relative">
      

      <div className="w-96 border p-6 rounded space-y-4">
        <h1 className="text-2xl font-bold">Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="space-y-1">
          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Link
            href="/forgot-password"
            className="text-sm text-blue-500 hover:text-blue-400 text-right block"
          >
            Forgot password?
          </Link>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-black text-white p-2 disabled:opacity-50 cursor-pointer hover:bg-white hover:text-black"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <button
          onClick={handleGoogleLogin}
          className="
            w-full
            border
            p-2
            flex
            items-center
            justify-center
            gap-2
            cursor-pointer
            transition-colors
            duration-200
            hover:bg-white
            hover:text-black
          "
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.07 1.53 7.47 2.81l5.52-5.52C33.24 3.55 28.99 1.5 24 1.5 14.73 1.5 6.99 6.86 3.14 14.69l6.64 5.15C11.48 13.27 17.22 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.5 24c0-1.64-.15-3.21-.43-4.74H24v9h12.7c-.55 2.97-2.18 5.48-4.64 7.18l7.2 5.58C43.77 36.93 46.5 31.03 46.5 24z"
            />
            <path
              fill="#FBBC05"
              d="M9.78 28.84A14.51 14.51 0 0 1 9 24c0-1.68.3-3.31.78-4.84l-6.64-5.15A23.96 23.96 0 0 0 0 24c0 3.89.93 7.56 2.58 10.78l7.2-5.94z"
            />
            <path
              fill="#34A853"
              d="M24 46.5c6.48 0 11.92-2.14 15.9-5.82l-7.2-5.58c-2 1.35-4.57 2.15-8.7 2.15-6.78 0-12.52-3.77-14.56-9.01l-7.2 5.94C6.98 41.64 14.72 46.5 24 46.5z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <p className="text-sm text-center">
          Don’t have an account?{" "}
          <Link href="/signup" className="underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
