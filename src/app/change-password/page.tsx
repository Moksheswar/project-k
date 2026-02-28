"use client";

import { useState } from "react";
import { updatePassword, signOut, EmailAuthProvider, reauthenticateWithCredential} from "firebase/auth";
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
  const passwordsMatch = password === confirmPassword && confirmPassword !== "";

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
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-96 border p-6 rounded space-y-4">
        <h1 className="text-xl font-bold">Change Password</h1>

        {!passwordUpdated && (
          <>
            <div className="text-sm space-y-1">
              <p className={hasMinLength ? "text-green-600" : "text-gray-500"}>
                • At least 8 characters
              </p>
              <p className={hasLetter ? "text-green-600" : "text-gray-500"}>
                • At least 1 letter
              </p>
              <p className={hasNumber ? "text-green-600" : "text-gray-500"}>
                • At least 1 number
              </p>
              <p className={hasSpecial ? "text-green-600" : "text-gray-500"}>
                • At least 1 special character
              </p>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <input
              type="password"
              placeholder="New Password"
              className="w-full border p-2"
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirm New Password"
              className="w-full border p-2"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </>
        )}

        {message && <p className="text-sm">{message}</p>}

        <button
          onClick={handleChangePassword}
          disabled={!passwordUpdated && (!isPasswordValid || loading)}
          className="w-full bg-black text-white p-2 cursor-pointer hover:bg-gray-800 disabled:opacity-50"
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