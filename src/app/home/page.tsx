"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import Header from "../components/Header";

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#1f1f1f]">
      <Header user={user} />

      <div className="p-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-semibold text-[#03471c]">
            Welcome, {user.email}
          </h1>

          <p className="mt-3 text-gray-600">
            You are successfully logged in.
          </p>
        </div>
      </div>
    </div>
  );
}


// "use client";

// import { useEffect, useState } from "react";
// import { onAuthStateChanged, User } from "firebase/auth";
// import { auth } from "../../lib/firebase";
// import { useRouter } from "next/navigation";
// import Header from "../components/Header";

// export default function HomePage() {
//   const [user, setUser] = useState<User | null>(null);
//   const router = useRouter();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       if (!currentUser) {
//         router.push("/login");
//       } else {
//         setUser(currentUser);
//       }
//     });

//     return () => unsubscribe();
//   }, [router]);

//   if (!user) return null;

//   return (
//     <div>
//       <Header user={user} />
//       <div className="p-6">
//         <h1 className="text-2xl font-bold">Welcome, {user.email}</h1>
//       </div>
//     </div>
//   );
// }