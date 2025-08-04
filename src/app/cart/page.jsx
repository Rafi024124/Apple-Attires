"use client";

import React from "react";
import Image from "next/image";
import { useCart } from "@/app/context/CartContext";

export default function CartPage() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    totalQuantity,
    hydrated,
  } = useCart();

  if (!hydrated) {
    return <p className="text-center p-10">Loading cart...</p>;
  }

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty.</h2>
        <p>Add some items to get started!</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">
        Your Cart ({totalQuantity} items)
      </h1>

      <div className="space-y-6">
        {cartItems.map((item) => (
          <div
            key={item.cartItemId}
            className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-4 border rounded-md"
          >
            <div className="w-full sm:w-auto flex justify-center">
              <Image
                src={item.image}
                alt={item.name}
                width={100}
                height={120}
                className="rounded"
              />
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-semibold">{item.name}</h3>
              <p className="text-orange-600 hover:scale-105 font-semibold">
                ৳{item.price}
              </p>

              {item.model && (
                <p className="mt-2 text-gray-700">
                  <strong>Model:</strong> {item.model}
                </p>
              )}

              <div className="flex flex-wrap items-center mt-3 gap-2">
                <button
                  onClick={() =>
                    updateQuantity(item.cartItemId, item.quantity - 1)
                  }
                  disabled={item.quantity <= 1}
                  className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
                >
                  -
                </button>

                <span className="px-3">{item.quantity}</span>

                <button
                  onClick={() =>
                    updateQuantity(item.cartItemId, item.quantity + 1)
                  }
                  className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                >
                  +
                </button>

                <button
                  onClick={() => removeFromCart(item.cartItemId)}
                  className="ml-0 sm:ml-6 px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600"
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
          onClick={() => alert("Proceed to checkout (implement later)")}
          className="bg-cyan-600 text-white px-6 py-2 rounded hover:bg-cyan-700"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
