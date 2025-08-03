'use client';

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";

export default function ProductDetailsModal({ product, onClose }) {
  if (!product) return null;

  const router = useRouter();

  const {
    _id,
    name,
    price,
    images = [],
    tag,
    models = [],
    isAvailable,
    isFeatured,
    createdAt,
    type,
    gender,
  } = product;

  const allImages = images.length ? images : ["/fallback.jpg"];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedModel, setSelectedModel] = useState(models[0] || "");

  const { addToCart } = useCart();

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const decreaseQuantity = () => {
    setSelectedQuantity((q) => (q > 1 ? q - 1 : 1));
  };

  const increaseQuantity = () => {
    setSelectedQuantity((q) => q + 1);
  };

  const handleAddToCart = () => {
    addToCart({
      _id,
      name,
      price,
      image: allImages[currentIndex],
      quantity: selectedQuantity,
      model: selectedModel,  // Pass selected model to cart/backend later
    });
    onClose();
  };

  const goToDetailsPage = () => {
    onClose();
    router.push(`/covers/${_id}`);
  };

  const genderColor =
    gender === "Ladies"
      ? "bg-pink-200 text-pink-800"
      : gender === "Unisex"
      ? "bg-blue-100 text-blue-800"
      : "bg-gray-200 text-gray-800";

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-xl max-w-5xl w-full max-h-[90vh] overflow-auto shadow-xl p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-3xl font-bold leading-none"
          aria-label="Close modal"
        >
          &times;
        </button>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Image carousel */}
          <div className="relative w-full md:w-[420px] h-[620px] rounded-lg overflow-hidden select-none group shadow-lg">
            <Image
              src={allImages[currentIndex]}
              alt={`${name} image ${currentIndex + 1}`}
              width={420}
              height={620}
              className="object-cover rounded-lg"
              unoptimized
            />

            {allImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute top-1/2 left-3 -translate-y-1/2 bg-black bg-opacity-40 text-white p-3 rounded-full hover:bg-opacity-70 transition"
                  aria-label="Previous image"
                >
                  ‹
                </button>
                <button
                  onClick={nextImage}
                  className="absolute top-1/2 right-3 -translate-y-1/2 bg-black bg-opacity-40 text-white p-3 rounded-full hover:bg-opacity-70 transition"
                  aria-label="Next image"
                >
                  ›
                </button>
              </>
            )}

            <button
              onClick={goToDetailsPage}
              className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-6 left-1/2 -translate-x-1/2 bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2 rounded-lg shadow-lg font-semibold"
            >
              View Details
            </button>
          </div>

          {/* Details and controls */}
          <div className="flex-1 flex flex-col space-y-6">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">{name}</h1>
            <p className="text-2xl text-red-600 font-semibold">৳{price}</p>

            {tag && (
              <span className="inline-block bg-yellow-400 text-black px-4 py-1 rounded-full text-base font-semibold tracking-wide">
                {tag}
              </span>
            )}

            <div className="flex flex-wrap gap-3 mt-1">
              {gender && (
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${genderColor} border border-transparent`}
                >
                  {gender}
                </span>
              )}
              {type && (
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-800 border border-gray-300">
                  {type}
                </span>
              )}
            </div>

            <div className="text-gray-700 dark:text-gray-300 space-y-2 leading-relaxed">
              <p>
                <strong>Model Compatibility:</strong>
              </p>
              {models.length > 0 ? (
                <select
                  className="mt-1 w-48 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                >
                  {models.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                
              ) : (
                <p className="italic text-sm text-gray-500 dark:text-gray-400">No models available</p>
              )}
            </div>

            <div className="text-gray-600 dark:text-gray-400 space-y-1 text-sm">
              <p>
                <strong>Status:</strong> {isAvailable ? "Available" : "Out of Stock"}
              </p>
              <p>
                <strong>Featured:</strong> {isFeatured ? "Yes" : "No"}
              </p>
              <p>
                <strong>Created At:</strong> {new Date(createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Quantity selector and add to cart */}
            <div className="flex items-center space-x-5 mt-6">
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden select-none">
                <button
                  onClick={decreaseQuantity}
                  className="px-5 py-2 bg-gray-200 dark:bg-gray-700 text-lg font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-8 py-2 border-x border-gray-300 dark:border-gray-600 font-semibold text-lg select-text">
                  {selectedQuantity}
                </span>
                <button
                  onClick={increaseQuantity}
                  className="px-5 py-2 bg-gray-200 dark:bg-gray-700 text-lg font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg py-3 shadow-md transition"
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
