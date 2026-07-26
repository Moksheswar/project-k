"use client";

import { useState } from "react";
import {
  updatePassword,
  signOut,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);

  const hasMinLength = password.length >= 8;
  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const passwordsMatch =
    password === confirmPassword && confirmPassword !== "";

  const isPasswordValid =
    hasMinLength && hasLetter && hasNumber && hasSpecial && passwordsMatch;

  const handleChangePassword = async () => {
    if (passwordUpdated) {
      router.push("/login");
      return;
    }

    if (!auth.currentUser) return;

    if (!isPasswordValid) {
      setError("Please satisfy all password requirements.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const currentPassword = prompt("Enter your current password");

      if (!currentPassword) {
        setError("Current password required.");
        setLoading(false);
        return;
      }

      const credential = EmailAuthProvider.credential(
        auth.currentUser.email!,
        currentPassword
      );

      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, password);
      await signOut(auth);

      setMessage("Password updated successfully. Please login again.");
      setPasswordUpdated(true);
    } catch (error: any) {
      setError("Current password is incorrect or session expired.");
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
      {/* Change Password Card */}
      <div className="w-full max-w-[460px] bg-white/60 backdrop-blur-[2px] rounded-[32px] px-8 md:px-10 py-8 relative -left-16">

        {/* Title */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-[#004d32]">
            Change Password
          </h1>
          <p className="text-gray-700 mt-2 text-base">
            Update your account password
          </p>
        </div>

        {!passwordUpdated && (
          <>
            {/* New Password */}
            <div className="mb-4">
              <input
                type="password"
                placeholder="New Password"
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

            {/* Confirm Password */}
            <div className="mb-4">
              <input
                type="password"
                placeholder="Confirm New Password"
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
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {/* Password Rules */}
            <div className="text-sm space-y-1 mb-5 px-1">
              <p
                className={
                  hasMinLength
                    ? "text-[#007a45] font-medium"
                    : "text-gray-500"
                }
              >
                • At least 8 characters
              </p>

              <p
                className={
                  hasLetter
                    ? "text-[#007a45] font-medium"
                    : "text-gray-500"
                }
              >
                • At least 1 letter
              </p>

              <p
                className={
                  hasNumber
                    ? "text-[#007a45] font-medium"
                    : "text-gray-500"
                }
              >
                • At least 1 number
              </p>

              <p
                className={
                  hasSpecial
                    ? "text-[#007a45] font-medium"
                    : "text-gray-500"
                }
              >
                • At least 1 special character
              </p>

              <p
                className={
                  passwordsMatch
                    ? "text-[#007a45] font-medium"
                    : "text-gray-500"
                }
              >
                • Passwords must match
              </p>
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-500 text-sm text-center mb-4">
                {error}
              </p>
            )}
          </>
        )}

        {/* Success Message */}
        {message && (
          <p className="text-sm text-center text-[#007a45] font-medium mb-5">
            {message}
          </p>
        )}

        {/* Button */}
        <button
          onClick={handleChangePassword}
          disabled={!passwordUpdated && (!isPasswordValid || loading)}
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
          {passwordUpdated
            ? "Login"
            : loading
            ? "Updating..."
            : "Update Password"}
        </button>

      </div>
    </div>
  );
}

  // return (
  //   <div className="flex min-h-screen items-center justify-center bg-[#1f1f1f]">
  //     <div className="w-96 bg-white rounded-xl shadow-lg p-8 space-y-5">

  //       {/* Title */}
  //       <h1 className="text-3xl font-semibold text-[#03471c] text-center">
  //         Change Password
  //       </h1>

  //       {!passwordUpdated && (
  //         <>
  //           {/* Password Rules */}
  //           <div className="text-sm space-y-1">
  //             <p className={hasMinLength ? "text-[#03471c]" : "text-gray-500"}>
  //               • At least 8 characters
  //             </p>
  //             <p className={hasLetter ? "text-[#03471c]" : "text-gray-500"}>
  //               • At least 1 letter
  //             </p>
  //             <p className={hasNumber ? "text-[#03471c]" : "text-gray-500"}>
  //               • At least 1 number
  //             </p>
  //             <p className={hasSpecial ? "text-[#03471c]" : "text-gray-500"}>
  //               • At least 1 special character
  //             </p>
  //             <p className={passwordsMatch ? "text-[#03471c]" : "text-gray-500"}>
  //               • Passwords must match
  //             </p>
  //           </div>

  //           {error && (
  //             <p className="text-red-500 text-sm text-center">{error}</p>
  //           )}

  //           {/* New Password */}
  //           <input
  //             type="password"
  //             placeholder="New Password"
  //             className="
  //               w-full
  //               bg-gray-100
  //               border
  //               border-gray-300
  //               rounded-md
  //               p-2
  //               focus:outline-none
  //               focus:ring-2
  //               focus:ring-[#03471c]
  //             "
  //             onChange={(e) => setPassword(e.target.value)}
  //           />

  //           {/* Confirm Password */}
  //           <input
  //             type="password"
  //             placeholder="Confirm New Password"
  //             className="
  //               w-full
  //               bg-gray-100
  //               border
  //               border-gray-300
  //               rounded-md
  //               p-2
  //               focus:outline-none
  //               focus:ring-2
  //               focus:ring-[#03471c]
  //             "
  //             onChange={(e) => setConfirmPassword(e.target.value)}
  //           />
  //         </>
  //       )}

  //       {message && (
  //         <p className="text-sm text-center text-[#03471c]">
  //           {message}
  //         </p>
  //       )}

  //       {/* Button */}
  //       <button
  //         onClick={handleChangePassword}
  //         disabled={!passwordUpdated && (!isPasswordValid || loading)}
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
  //         {passwordUpdated
  //           ? "Login"
  //           : loading
  //           ? "Updating..."
  //           : "Update Password"}
  //       </button>
  //     </div>
  //   </div>
  // );


// "use client";

// import { useState } from "react";
// import { updatePassword, signOut, EmailAuthProvider, reauthenticateWithCredential} from "firebase/auth";
// import { auth } from "../../lib/firebase";
// import { useRouter } from "next/navigation";

// export default function ChangePasswordPage() {
//   const router = useRouter();

//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [passwordUpdated, setPasswordUpdated] = useState(false);

//   const hasMinLength = password.length >= 8;
//   const hasLetter = /[A-Za-z]/.test(password);
//   const hasNumber = /\d/.test(password);
//   const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
//   const passwordsMatch = password === confirmPassword && confirmPassword !== "";

//   const isPasswordValid =
//     hasMinLength && hasLetter && hasNumber && hasSpecial && passwordsMatch;

//   const handleChangePassword = async () => {
//     if (passwordUpdated) {
//         router.push("/login");
//         return;
//     }
//     if (!auth.currentUser) return;

//     if (!isPasswordValid) {
//         setError("Please satisfy all password requirements.");
//         return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//         const currentPassword = prompt("Enter your current password");

//         if (!currentPassword) {
//             setError("Current password required.");
//             setLoading(false);
//             return;
//         }

//         const credential = EmailAuthProvider.credential(
//             auth.currentUser.email!,
//             currentPassword
//         );

//         await reauthenticateWithCredential(auth.currentUser, credential);

//         await updatePassword(auth.currentUser, password);

//         await signOut(auth);

//         setMessage("Password updated successfully. Please login again.");
//         setPasswordUpdated(true);

//         } catch (error: any) {
//             setError("Current password is incorrect or session expired.");
//         } finally {
//             setLoading(false);
//         }
//     };

//   return (
//     <div className="flex min-h-screen items-center justify-center">
//       <div className="w-96 border p-6 rounded space-y-4">
//         <h1 className="text-xl font-bold">Change Password</h1>

//         {!passwordUpdated && (
//           <>
//             <div className="text-sm space-y-1">
//               <p className={hasMinLength ? "text-green-600" : "text-gray-500"}>
//                 • At least 8 characters
//               </p>
//               <p className={hasLetter ? "text-green-600" : "text-gray-500"}>
//                 • At least 1 letter
//               </p>
//               <p className={hasNumber ? "text-green-600" : "text-gray-500"}>
//                 • At least 1 number
//               </p>
//               <p className={hasSpecial ? "text-green-600" : "text-gray-500"}>
//                 • At least 1 special character
//               </p>
//             </div>

//             {error && <p className="text-red-500 text-sm">{error}</p>}

//             <input
//               type="password"
//               placeholder="New Password"
//               className="w-full border p-2"
//               onChange={(e) => setPassword(e.target.value)}
//             />

//             <input
//               type="password"
//               placeholder="Confirm New Password"
//               className="w-full border p-2"
//               onChange={(e) => setConfirmPassword(e.target.value)}
//             />
//           </>
//         )}

//         {message && <p className="text-sm">{message}</p>}

//         <button
//           onClick={handleChangePassword}
//           disabled={!passwordUpdated && (!isPasswordValid || loading)}
//           className="w-full bg-black text-white p-2 cursor-pointer hover:bg-gray-800 disabled:opacity-50"
//         >
//           {passwordUpdated
//             ? "Login"
//             : loading
//             ? "Updating..."
//             : "Update Password"}
//         </button>
//       </div>
//     </div>
//   );
// }