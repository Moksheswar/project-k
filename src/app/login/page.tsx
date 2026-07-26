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

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful");
      router.push("/home");
    } catch (err: any) {
      toast.error(getLoginErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Logged in with Google");
      router.push("/home");
    } catch {
      toast.error("Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-screen w-screen bg-no-repeat flex items-center justify-end pr-[8%] overflow-hidden"
      style={{
        backgroundImage: "url('/images/login-background.jpg')",
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
      }}
    >
      {/* Login Card */}
      <div className="w-full max-w-[460px] bg-white/60 backdrop-blur-[2px] rounded-[32px] px-8 md:px-10 py-8 relative -left-16">

        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#004d32]">
            Welcome Back
          </h1>
          <p className="text-gray-700 mt-2 text-base">
            Login to access your account
          </p>
        </div>

        {/* Email */}
        <div className="mb-5">
          <input
            type="email"
            placeholder="Email / Username"
            className="
              w-full
              h-14
              px-5
              bg-white
              border
              border-gray-300
              rounded-xl
              text-gray-700
              placeholder:text-gray-500
              focus:outline-none
              focus:border-[#007a45]
              focus:ring-1
              focus:ring-[#007a45]
            "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="mb-3">
          <input
            type="password"
            placeholder="Password"
            className="
              w-full
              h-14
              px-5
              bg-white
              border
              border-gray-300
              rounded-xl
              text-gray-700
              placeholder:text-gray-500
              focus:outline-none
              focus:border-[#007a45]
              focus:ring-1
              focus:ring-[#007a45]
            "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Forgot Password */}
        <div className="flex justify-end mb-6">
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-[#006b3c] hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Login */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="
            w-full
            h-14
            bg-[#007a45]
            hover:bg-[#006238]
            disabled:opacity-60
            text-white
            text-lg
            font-medium
            rounded-xl
            transition
          "
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* OR */}
        <div className="flex items-center gap-4 my-6">
          <div className="h-px flex-1 bg-gray-300" />
          <span className="text-gray-500 text-sm">or</span>
          <div className="h-px flex-1 bg-gray-300" />
        </div>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="
            w-full
            h-14
            border
            border-[#007a45]
            text-[#006b3c]
            rounded-xl
            flex
            items-center
            justify-center
            gap-3
            font-medium
            transition
            hover:bg-[#f0f8f4]
            disabled:opacity-60
          "
        >
          <svg width="20" height="20" viewBox="0 0 48 48">
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

        {/* Signup */}
        <p className="text-sm text-center text-gray-700 mt-7">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-[#006b3c] font-semibold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

  // return (
  //   <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
  //     <div className="w-96 bg-[var(--card-bg)] rounded-xl shadow-lg p-8 space-y-5">

  //       <h1 className="text-3xl font-semibold text-[var(--color-primary)] text-center">
  //         Login
  //       </h1>

  //       {/* Email Input */}
  //       <input
  //         type="email"
  //         placeholder="Email"
  //         className="
  //           w-full
  //           bg-gray-100
  //           border
  //           border-gray-300
  //           rounded-md
  //           p-2
  //           focus:outline-none
  //           focus:ring-2
  //           focus:ring-[var(--color-focus-ring)]
  //         "
  //         value={email}
  //         onChange={(e) => setEmail(e.target.value)}
  //       />

  //       {/* Password Input */}
  //       <div className="space-y-1">
  //         <input
  //           type="password"
  //           placeholder="Password"
  //           className="
  //             w-full
  //             bg-gray-100
  //             border
  //             border-gray-300
  //             rounded-md
  //             p-2
  //             focus:outline-none
  //             focus:ring-2
  //             focus:ring-[var(--color-focus-ring)]
  //           "
  //           value={password}
  //           onChange={(e) => setPassword(e.target.value)}
  //         />

  //         <Link
  //           href="/forgot-password"
  //           className="
  //             text-sm
  //             text-[var(--color-primary)]
  //             hover:text-[var(--color-primary-hover)]
  //             text-right
  //             block
  //             transition
  //           "
  //         >
  //           Forgot password?
  //         </Link>
  //       </div>

  //       {/* Login Button */}
  //       <button
  //         onClick={handleLogin}
  //         disabled={loading}
  //         className="
  //           w-full
  //           bg-[var(--color-primary)]
  //           hover:bg-[var(--color-primary-hover)]
  //           text-white
  //           rounded-md
  //           p-2
  //           transition
  //         "
  //       >
  //         {loading ? "Logging in..." : "Login"}
  //       </button>

  //       {/* Google Login */}
  //       <button
  //         onClick={handleGoogleLogin}
  //         disabled={loading}
  //         className="
  //           w-full
  //           border
  //           border-[var(--color-primary)]
  //           text-[var(--color-primary)]
  //           rounded-md
  //           p-2
  //           flex
  //           items-center
  //           justify-center
  //           gap-2
  //           transition
  //           hover:bg-[var(--color-primary)]
  //           hover:text-white
  //         "
  //       >
  //         <svg width="18" height="18" viewBox="0 0 48 48">
  //           <path fill="#EA4335" d="M24 9.5c3.54 0 6.07 1.53 7.47 2.81l5.52-5.52C33.24 3.55 28.99 1.5 24 1.5 14.73 1.5 6.99 6.86 3.14 14.69l6.64 5.15C11.48 13.27 17.22 9.5 24 9.5z"/>
  //           <path fill="#4285F4" d="M46.5 24c0-1.64-.15-3.21-.43-4.74H24v9h12.7c-.55 2.97-2.18 5.48-4.64 7.18l7.2 5.58C43.77 36.93 46.5 31.03 46.5 24z"/>
  //           <path fill="#FBBC05" d="M9.78 28.84A14.51 14.51 0 0 1 9 24c0-1.68.3-3.31.78-4.84l-6.64-5.15A23.96 23.96 0 0 0 0 24c0 3.89.93 7.56 2.58 10.78l7.2-5.94z"/>
  //           <path fill="#34A853" d="M24 46.5c6.48 0 11.92-2.14 15.9-5.82l-7.2-5.58c-2 1.35-4.57 2.15-8.7 2.15-6.78 0-12.52-3.77-14.56-9.01l-7.2 5.94C6.98 41.64 14.72 46.5 24 46.5z"/>
  //         </svg>
  //         <span>Continue with Google</span>
  //       </button>

  //       <p className="text-sm text-center text-[var(--color-text-secondary)]">
  //         Don’t have an account?{" "}
  //         <Link
  //           href="/signup"
  //           className="text-[var(--color-primary)] hover:underline"
  //         >
  //           Sign up
  //         </Link>
  //       </p>
  //     </div>
  //   </div>
  // );


//   return (
//     <div className="flex h-screen items-center justify-center relative">
      

//       <div className="w-96 border p-6 rounded space-y-4">
//         <h1 className="text-2xl font-bold">Login</h1>

//         <input
//           type="email"
//           placeholder="Email"
//           className="w-full border p-2"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <div className="space-y-1">
//           <input
//             type="password"
//             placeholder="Password"
//             className="w-full border p-2"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />

//           <Link
//             href="/forgot-password"
//             className="text-sm text-blue-500 hover:text-blue-400 text-right block"
//           >
//             Forgot password?
//           </Link>
//         </div>

//         <button
//           onClick={handleLogin}
//           disabled={loading}
//           className="w-full bg-black text-white p-2 disabled:opacity-50 cursor-pointer hover:bg-white hover:text-black"
//         >
//           {loading ? "Logging in..." : "Login"}
//         </button>
//         <button
//           onClick={handleGoogleLogin}
//           className="
//             w-full
//             border
//             p-2
//             flex
//             items-center
//             justify-center
//             gap-2
//             cursor-pointer
//             transition-colors
//             duration-200
//             hover:bg-white
//             hover:text-black
//           "
//         >
//           <svg
//             width="18"
//             height="18"
//             viewBox="0 0 48 48"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               fill="#EA4335"
//               d="M24 9.5c3.54 0 6.07 1.53 7.47 2.81l5.52-5.52C33.24 3.55 28.99 1.5 24 1.5 14.73 1.5 6.99 6.86 3.14 14.69l6.64 5.15C11.48 13.27 17.22 9.5 24 9.5z"
//             />
//             <path
//               fill="#4285F4"
//               d="M46.5 24c0-1.64-.15-3.21-.43-4.74H24v9h12.7c-.55 2.97-2.18 5.48-4.64 7.18l7.2 5.58C43.77 36.93 46.5 31.03 46.5 24z"
//             />
//             <path
//               fill="#FBBC05"
//               d="M9.78 28.84A14.51 14.51 0 0 1 9 24c0-1.68.3-3.31.78-4.84l-6.64-5.15A23.96 23.96 0 0 0 0 24c0 3.89.93 7.56 2.58 10.78l7.2-5.94z"
//             />
//             <path
//               fill="#34A853"
//               d="M24 46.5c6.48 0 11.92-2.14 15.9-5.82l-7.2-5.58c-2 1.35-4.57 2.15-8.7 2.15-6.78 0-12.52-3.77-14.56-9.01l-7.2 5.94C6.98 41.64 14.72 46.5 24 46.5z"
//             />
//           </svg>
//           <span>Continue with Google</span>
//         </button>

//         <p className="text-sm text-center">
//           Don’t have an account?{" "}
//           <Link href="/signup" className="underline">
//             Sign up
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }
