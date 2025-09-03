"use client";

import React, { useState } from "react";
import { useCart } from "@/app/context/CartContext";
import Swal from "sweetalert2";

export default function CheckoutPage() {
  const {
    cartItems,
    totalQuantity,
    hydrated,
    clearCart,
  } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isInsideDhaka, setIsInsideDhaka] = useState(true);
  const [loading, setLoading] = useState(false);

  if (!hydrated) {
    return <p className="text-center p-10">Loading cart...</p>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center min-h-screen">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty.</h2>
        <p>Add some items to get started!</p>
      </div>
    );
  }

  // Calculate subtotal of cart
  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * (item.quantity || 1),
    0
  );

  const deliveryCharge = isInsideDhaka ? 70 : 110;
  const totalPrice = subtotal + deliveryCharge;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!name.trim() || !phone.trim() || !address.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Please fill in all the fields",
      });
      return;
    }

    if (phone.trim().length < 10) {
      Swal.fire({
        icon: "warning",
        title: "Please enter a valid phone number",
      });
      return;
    }

  
    const orderData = {
      name,
      phone,
      address,
      deliveryCharge,
      totalPrice,
      cartItems,
      orderDate: new Date().toISOString(),
      insideDhaka: isInsideDhaka,
    };
  console.log(cartItems);
  
    try {
      setLoading(true);
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to place order");
      }

      Swal.fire({
        icon: "success",
        title: "Order placed successfully!",
      });

      clearCart();

      // Reset form
      setName("");
      setPhone("");
      setAddress("");
      setIsInsideDhaka(true);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {/* Cart Summary */}
      <div className="mb-8 border rounded p-4 bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <ul className="divide-y divide-gray-300 max-h-60 overflow-y-auto mb-4">
  {cartItems.map((item) => (
    <li
      key={item.cartItemId}
      className="py-2 flex items-center justify-between gap-4"
    >
      <div className="flex items-center gap-3">
        {/* Show product image */}
        {item.image && (
          <img
            src={item.image}
            alt={item.name}
            className="w-14 h-14 object-cover rounded border"
          />
        )}
        <span className="text-sm">
          {item.name} {item.model && `- ${item.model}`}{" "}
          {item.color && `(${item.color})`} x {item.quantity}
        </span>
      </div>
      <span className="font-semibold">
        ৳{(Number(item.price) * item.quantity).toFixed(2)}
      </span>
    </li>
  ))}
</ul>

        <div className="flex justify-between font-semibold">
          <span>Subtotal:</span>
          <span>৳{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Delivery Charge:</span>
          <span>৳{deliveryCharge}</span>
        </div>
        <div className="flex justify-between text-lg font-bold mt-2 border-t pt-2">
          <span>Total:</span>
          <span>৳{totalPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Checkout Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block font-semibold mb-1">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="block font-semibold mb-1">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
            pattern="[0-9]{10,}"
            placeholder="e.g., 01XXXXXXXXX"
          />
        </div>

        <div>
          <label htmlFor="address" className="block font-semibold mb-1">
            Address
          </label>
          <textarea
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            rows={3}
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Delivery Location</label>
          <div className="flex gap-4 items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="delivery"
                value="inside"
                checked={isInsideDhaka}
                onChange={() => setIsInsideDhaka(true)}
              />
              Inside Dhaka (৳70)
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="delivery"
                value="outside"
                checked={!isInsideDhaka}
                onChange={() => setIsInsideDhaka(false)}
              />
              Outside Dhaka (৳110)
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 rounded disabled:opacity-50"
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}
