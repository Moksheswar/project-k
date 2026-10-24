
"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import VideoCarousel from "../components/VideoCarousel";
import CategoryCarousel from "../components/CategoryCarousel";
import ProductCarousel from "../components/ProductCarousel";

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
    <div
      id="home"
      className="min-h-screen bg-green-50 pt-[72px]"
    >
      <Header user={user} />

      <VideoCarousel />

      <CategoryCarousel />

      <ProductCarousel />
    </div>
  );
}
