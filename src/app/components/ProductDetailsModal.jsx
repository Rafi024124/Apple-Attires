"use client";

import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/app/context/CartContext";

export default function ProductDetailsModal({ product, onClose }) {
  if (!product) return null;

  const {
    name,
    price,
    image,
    images = [],
    tag,
    model = [],
    isAvailable,
    isFeatured,
    createdAt,
  } = product;

  const allImages = [image, ...images]; // Main + extra images
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const { addToCart } = useCart();

  // Image navigation handlers
  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  // Quantity controls (min 1)
  const decreaseQuantity = () => {
    setSelectedQuantity((q) => (q > 1 ? q - 1 : 1));
  };

  const increaseQuantity = () => {
    setSelectedQuantity((q) => q + 1);
  };

  // Add to cart handler
  const handleAddToCart = () => {
    addToCart({
      _id: product._id,
      name,
      price,
      image,
      quantity: selectedQuantity, // pass selected quantity here!
    });
    onClose(); // close modal after adding
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-xl font-bold"
          aria-label="Close modal"
        >
          &times;
        </button>

        <div className="flex flex-col md:flex-row gap-6 items-center">
          {/* Image carousel */}
          <div className="relative w-[400px] h-[600px] select-none">
            <Image
              src={allImages[currentIndex]}
              alt={`${name} image ${currentIndex + 1}`}
              width={400}
              height={600}
              className="rounded-md shadow-lg object-cover"
            />
            {/* Left arrow */}
            <button
              onClick={prevImage}
              className="absolute top-1/2 left-2 -translate-y-1/2 bg-black bg-opacity-30 text-white p-2 rounded-full hover:bg-opacity-60 transition"
              aria-label="Previous image"
            >
              ‹
            </button>
            {/* Right arrow */}
            <button
              onClick={nextImage}
              className="absolute top-1/2 right-2 -translate-y-1/2 bg-black bg-opacity-30 text-white p-2 rounded-full hover:bg-opacity-60 transition"
              aria-label="Next image"
            >
              ›
            </button>
          </div>

          {/* Details & actions */}
          <div className="flex-1 space-y-4">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              {name}
            </h1>
            <p className="text-xl text-red-500 font-semibold">৳{price}</p>

            {tag && (
              <span className="inline-block bg-yellow-300 text-black px-3 py-1 rounded-full text-sm font-medium">
                {tag}
              </span>
            )}

            <div className="text-sm text-gray-500 dark:text-gray-300 space-y-1">
              <p>
                <strong>Model Compatibility:</strong> {model.join(", ")}
              </p>
              <p>
                <strong>Status:</strong> {isAvailable ? "Available" : "Out of Stock"}
              </p>
              <p>
                <strong>Featured:</strong> {isFeatured ? "Yes" : "No"}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Quantity selector + Add to Cart */}
            <div className="flex items-center space-x-4 mt-6">
              <div className="flex items-center border rounded">
                <button
                  onClick={decreaseQuantity}
                  className="px-3 py-1 bg-gray-300 rounded-l hover:bg-gray-400"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-5 py-1 border-x">{selectedQuantity}</span>
                <button
                  onClick={increaseQuantity}
                  className="px-3 py-1 bg-gray-300 rounded-r hover:bg-gray-400"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="px-6 py-2 bg-cyan-600 text-white font-semibold rounded hover:bg-cyan-700 transition"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
