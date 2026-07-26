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
    <div
      className="h-screen w-screen bg-no-repeat flex items-center justify-end pr-[8%] overflow-hidden"
      style={{
        backgroundImage: "url('/images/login-background.jpg')",
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
      }}
    >
      {/* Forgot Password Card */}
      <div className="w-full max-w-[460px] bg-white/60 backdrop-blur-[2px] rounded-[32px] px-8 md:px-10 py-8 relative -left-16">

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#004d32]">
            Forgot Password
          </h1>
          <p className="text-gray-700 mt-2 text-base">
            Enter your email to reset your password
          </p>
        </div>

        {/* Email Input */}
        <div className="mb-6">
          <input
            type="email"
            placeholder="Enter your email"
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

        {/* Reset Button */}
        <button
          onClick={handleReset}
          disabled={loading}
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
          {loading ? "Sending..." : "Send reset link"}
        </button>

        {/* Back to Login */}
        <p className="text-sm text-center text-gray-700 mt-7">
          Remember your password?{" "}
          <Link
            href="/login"
            className="text-[#006b3c] font-semibold hover:underline"
          >
            Back to login
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
  //         Forgot Password
  //       </h1>

  //       {/* Email Input */}
  //       <input
  //         type="email"
  //         placeholder="Enter your email"
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
  //         value={email}
  //         onChange={(e) => setEmail(e.target.value)}
  //       />

  //       {/* Reset Button */}
  //       <button
  //         onClick={handleReset}
  //         disabled={loading}
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
  //         {loading ? "Sending..." : "Send reset link"}
  //       </button>

  //       {/* Back to Login */}
  //       <p className="text-sm text-center text-gray-600">
  //         <Link
  //           href="/login"
  //           className="text-[#03471c] hover:underline"
  //         >
  //           Back to login
  //         </Link>
  //       </p>

  //     </div>
  //   </div>
  // );


// "use client";

// import { sendPasswordResetEmail } from "firebase/auth";
// import { auth } from "../../lib/firebase";
// import { useState } from "react";
// import Link from "next/link";
// import { toast } from "react-hot-toast";

// export default function ForgotPasswordPage() {
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleReset = async () => {
//     if (!email) {
//       toast.error("Please enter your email");
//       return;
//     }

//     setLoading(true);
//     try {
//       await sendPasswordResetEmail(auth, email);
//       toast.success("Password reset link sent to your email");
//     } catch (err: any) {
//       switch (err.code) {
//         case "auth/user-not-found":
//           toast.error("No account found with this email");
//           break;
//         case "auth/invalid-email":
//           toast.error("Invalid email address");
//           break;
//         default:
//           toast.error("Failed to send reset email");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex h-screen items-center justify-center">
//       <div className="w-96 border p-6 rounded space-y-4">
//         <h1 className="text-2xl font-bold">Forgot Password</h1>

//         <input
//           type="email"
//           placeholder="Enter your email"
//           className="w-full border p-2"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <button
//           onClick={handleReset}
//           disabled={loading}
//           className="w-full bg-black text-white p-2 disabled:opacity-50 cursor-pointer hover:bg-white hover:text-black"
//         >
//           {loading ? "Sending..." : "Send reset link"}
//         </button>

//         <p className="text-sm text-center">
//           <Link href="/login" className="underline">
//             Back to login
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }
