"use client";

import React from "react";
import { useCart } from "@/app/context/CartContext";
import { FaShoppingCart } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function StickyCartButton() {
  const { totalQuantity } = useCart();
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/cart")}
      className={`
        fixed right-4 bottom-1/60 transform -translate-y-1/2 z-1
        flex items-center justify-center w-14 h-14 rounded-full 
        bg-orange-500 text-white shadow-lg transition-opacity duration-300
        ${totalQuantity > 0 ? "opacity-100" : "opacity-50 pointer-events-none"}
        hover:scale-110
      `}
    >
      <FaShoppingCart className="w-6 h-6" />
      {totalQuantity > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white w-5 h-5 text-xs font-bold rounded-full flex items-center justify-center">
          {totalQuantity}
        </span>
      )}
    </button>
  );
}
