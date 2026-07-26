"use client";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function getSignupErrorMessage(code: string) {
  switch (code) {
    case "auth/email-already-in-use":
      return "This email is already registered. Please login.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password must be at least 6 characters long.";
    case "auth/operation-not-allowed":
      return "Signup is currently disabled.";
    case "auth/network-request-failed":
      return "Network error. Check your connection.";
    default:
      return "Signup failed. Please try again.";
  }
}

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔐 Password rules
  const hasMinLength = password.length >= 8;
  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const isPasswordValid =
    hasMinLength && hasLetter && hasNumber && hasSpecial;

  const handleSignup = async () => {
    if (!isPasswordValid) {
      setError("Please satisfy all password requirements.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/login");
    } catch (err: any) {
      setError(getSignupErrorMessage(err.code));
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
      {/* Signup Card */}
      <div className="w-full max-w-[460px] bg-white/60 backdrop-blur-[2px] rounded-[32px] px-8 md:px-10 py-8 relative -left-16">

        {/* Welcome */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-[#004d32]">
            Create Account
          </h1>
          <p className="text-gray-700 mt-2 text-base">
            Sign up to create your account
          </p>
        </div>

        {/* Email */}
        <div className="mb-5">
          <input
            type="email"
            placeholder="Email"
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
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <input
            type="password"
            placeholder="Enter Password"
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
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Password Requirements */}
        <div className="text-sm space-y-1 mb-5 px-1">
          <p className={hasMinLength ? "text-[#007a45] font-medium" : "text-gray-500"}>
            • At least 8 characters
          </p>

          <p className={hasLetter ? "text-[#007a45] font-medium" : "text-gray-500"}>
            • At least 1 letter
          </p>

          <p className={hasNumber ? "text-[#007a45] font-medium" : "text-gray-500"}>
            • At least 1 number
          </p>

          <p className={hasSpecial ? "text-[#007a45] font-medium" : "text-gray-500"}>
            • At least 1 special character
          </p>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm text-center mb-4">
            {error}
          </p>
        )}

        {/* Signup Button */}
        <button
          onClick={handleSignup}
          disabled={!isPasswordValid || loading}
          className="
            w-full
            h-14
            bg-[#007a45]
            hover:bg-[#006238]
            text-white
            text-lg
            font-medium
            rounded-xl
            transition
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

        {/* Login Link */}
        <p className="text-sm text-center text-gray-700 mt-7">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[#006b3c] font-semibold hover:underline"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

  // return (
  //   <div className="flex min-h-screen items-center justify-center bg-[#1f1f1f]">
  //     <div className="w-96 bg-white rounded-xl shadow-lg p-8 space-y-5">

  //       {/* Title */}
  //       <h1 className="text-3xl font-semibold text-[#03471c] text-center">
  //         Sign Up
  //       </h1>

  //       {/* Email */}
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
  //           focus:ring-[#03471c]
  //         "
  //         onChange={(e) => setEmail(e.target.value)}
  //       />

  //       {/* Password */}
  //       <input
  //         type="password"
  //         placeholder="Enter Password"
  //         className="
  //           w-full
  //           bg-gray-100
  //           border
  //           border-gray-300
  //           rounded-md
  //           p-2
  //           focus:outline-none
  //           focus:ring-2
  //           focus:ring-[#03471c]
  //         "
  //         onChange={(e) => setPassword(e.target.value)}
  //       />

  //       {/* Password Requirements */}
  //       <div className="text-sm space-y-1">
  //         <p className={hasMinLength ? "text-[#03471c]" : "text-gray-500"}>
  //           • At least 8 characters
  //         </p>
  //         <p className={hasLetter ? "text-[#03471c]" : "text-gray-500"}>
  //           • At least 1 letter
  //         </p>
  //         <p className={hasNumber ? "text-[#03471c]" : "text-gray-500"}>
  //           • At least 1 number
  //         </p>
  //         <p className={hasSpecial ? "text-[#03471c]" : "text-gray-500"}>
  //           • At least 1 special character
  //         </p>
  //       </div>

  //       {error && (
  //         <p className="text-red-500 text-sm text-center">{error}</p>
  //       )}

  //       {/* Signup Button */}
  //       <button
  //         onClick={handleSignup}
  //         disabled={!isPasswordValid || loading}
  //         className="
  //           w-full
  //           bg-[#03471c]
  //           hover:bg-[#046d2b]
  //           text-white
  //           rounded-md
  //           p-2
  //           transition
  //           disabled:opacity-50
  //           disabled:cursor-not-allowed
  //         "
  //       >
  //         {loading ? "Creating account..." : "Create Account"}
  //       </button>

  //       {/* Login Link */}
  //       <p className="text-sm text-center text-gray-600">
  //         Already have an account?{" "}
  //         <Link
  //           href="/login"
  //           className="text-[#03471c] hover:underline"
  //         >
  //           Login
  //         </Link>
  //       </p>
  //     </div>
  //   </div>
  // );


// "use client";

// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { auth } from "../../lib/firebase";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";

// function getSignupErrorMessage(code: string) {
//   switch (code) {
//     case "auth/email-already-in-use":
//       return "This email is already registered. Please login.";
//     case "auth/invalid-email":
//       return "Please enter a valid email address.";
//     case "auth/weak-password":
//       return "Password must be at least 6 characters long.";
//     case "auth/operation-not-allowed":
//       return "Signup is currently disabled.";
//     case "auth/network-request-failed":
//       return "Network error. Check your connection.";
//     default:
//       return "Signup failed. Please try again.";
//   }
// }

// export default function SignupPage() {
//   const router = useRouter();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   // 🔐 Password rules
//   const hasMinLength = password.length >= 8;
//   const hasLetter = /[A-Za-z]/.test(password);
//   const hasNumber = /\d/.test(password);
//   const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

//   const isPasswordValid = hasMinLength && hasLetter && hasNumber && hasSpecial;

//   const handleSignup = async () => {
//     if (!isPasswordValid) {
//       setError("Please satisfy all password requirements.");
//       return;
//     }

//     setError("");
//     setLoading(true);

//     try {
//       await createUserWithEmailAndPassword(auth, email, password);
//       router.push("/login");
//     } catch (err: any) {
//       setError(getSignupErrorMessage(err.code));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex h-screen items-center justify-center">
//       <div className="w-96 space-y-4 border p-6 rounded">
//         <h1 className="text-2xl font-bold">Sign Up</h1>

//         <input
//           type="email"
//           placeholder="Email"
//           className="w-full border p-2"
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <input
//           type="password"
//           placeholder="Enter Password"
//           className="w-full border p-2"
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         {/* 🔎 Password Requirements */}
//         <div className="text-sm space-y-1">
//           <p className={hasMinLength ? "text-green-600" : "text-gray-500"}>
//             • At least 8 characters
//           </p>
//           <p className={hasLetter ? "text-green-600" : "text-gray-500"}>
//             • At least 1 letter
//           </p>
//           <p className={hasNumber ? "text-green-600" : "text-gray-500"}>
//             • At least 1 number
//           </p>
//           <p className={hasSpecial ? "text-green-600" : "text-gray-500"}>
//             • At least 1 special character
//           </p>
//         </div>

//         {error && <p className="text-red-500 text-sm">{error}</p>}

//         <button
//           onClick={handleSignup}
//           disabled={!isPasswordValid || loading}
//           className="
//             w-full 
//             bg-black 
//             text-white 
//             p-2 
//             cursor-pointer
//             transition
//             hover:bg-white 
//             hover:text-black
//             disabled:opacity-50 
//             disabled:cursor-not-allowed
//           "
//         >
//           {loading ? "Creating account..." : "Create Account"}
//         </button>

//         <p className="text-sm text-center">
//           Already have an account?{" "}
//           <Link href="/login" className="underline cursor-pointer">
//             Login
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }