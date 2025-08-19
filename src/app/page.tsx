"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BookCover from "@/components/book/BookCover";

export default function HomePage() {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleOpenBook = () => {
    console.log("Open Book button clicked!");
    setIsTransitioning(true);
    // Add a small delay for the transition effect
    setTimeout(() => {
      router.push("/testimonies");
    }, 500);
  };

  return (
    <main className="min-h-screen">
      <BookCover onOpenBook={handleOpenBook} />

      {/* Transition Overlay */}
      {isTransitioning && (
        <div className="fixed inset-0 bg-amber-900 z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-200 mx-auto mb-4"></div>
            <p className="text-amber-200 font-serif text-lg">
              Opening the book...
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
