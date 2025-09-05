"use client";

import React from "react";
import Image from "next/image";
import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    totalQuantity,
    hydrated,
  } = useCart();

  if (!hydrated) {
    return (
      <div className="flex justify-center items-center p-10">
        {/* Simple spinner */}
        <div className="w-10 h-10 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * (item.quantity || 1),
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center min-h-screen text-black">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty.</h2>
        <p>Add some items to get started!</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 transition"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  const handleRemove = (cartItemId) => {
   
      removeFromCart(cartItemId);
    
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-black min-h-screen">
      <h1 className="text-3xl font-bold mb-8">
        Your Cart ({totalQuantity} {totalQuantity === 1 ? "item" : "items"})
      </h1>

      <div className="space-y-6">
        {cartItems.map((item) => (
          <div
            key={item.cartItemId}
            className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-4 border rounded-md"
          >
            <div className="w-full sm:w-auto flex justify-center">
              <Image
                src={item.image || "/fallback.jpg"}
                alt={item.name}
                width={100}
                height={120}
                className="rounded object-contain"
                unoptimized
              />
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-semibold">{item.name}</h3>
              <p className="text-orange-600 hover:scale-105 font-semibold">
                ৳{Number(item.price).toFixed(2)}
              </p>

              {/* Subtotal per item */}
              <p className="text-gray-600 text-sm mt-1">
                Subtotal: ৳{(Number(item.price) * item.quantity).toFixed(2)}
              </p>

              {item.model && (
                <p className="mt-2 text-gray-700">
                  <strong>Model:</strong> {item.model}
                </p>
              )}

              {item.color && (
                <p className="text-gray-700">
                  <strong>Color:</strong> {item.color}
                </p>
              )}

              <div className="flex flex-wrap items-center mt-3 gap-2">
                <button
                  onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
                  aria-label={`Decrease quantity of ${item.name}`}
                >
                  -
                </button>

                <span className="px-3" aria-live="polite">
                  {item.quantity}
                </span>

                <button
                  onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                  className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                  aria-label={`Increase quantity of ${item.name}`}
                >
                  +
                </button>

                <button
                  onClick={() => handleRemove(item.cartItemId)}
                  className="ml-0 sm:ml-6 px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600"
                  aria-label={`Remove ${item.name} from cart`}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl font-semibold">Total: ৳{totalPrice.toFixed(2)}</h2>
        <button
  onClick={() => router.push("/checkout")}
  disabled={cartItems.length === 0}
  className={`px-6 py-2 rounded text-white ${
    cartItems.length === 0
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-cyan-600 hover:bg-cyan-700"
  }`}
  aria-disabled={cartItems.length === 0}
>
  Proceed to Checkout
</button>

      </div>
    </div>
  );
}
