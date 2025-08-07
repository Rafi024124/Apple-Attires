"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import CartDrawer from "@/app/components/cartDrawer/page";
import CoverDetailsSkeleton from "../covers/[id]/CoverDetailsSkeleton";


export default function CoverDetails() {
  const params = useParams();
  const { id } = params;

  // Hooks always at the top, unconditional
  const [cover, setCover] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showCartDrawer, setShowCartDrawer] = useState(false);

  const { addToCart } = useCart();
  const cartDrawerRef = useRef(null);

  // Fetch cover data on mount or when id changes
  useEffect(() => {
    async function fetchCover() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/covers/${id}`);
        if (!res.ok) throw new Error("Failed to fetch cover details");
        const data = await res.json();
        setCover(data);
        setSelectedModel(data.models?.[0] || "");
        setSelectedColor(data.images?.[0]?.color || null);
        setCurrentIndex(0);
      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchCover();
  }, [id]);

  // Helper: get image URL by selectedColor
  const findImageByColor = (color) => {
    if (!cover || !cover.images) return "/fallback.jpg";
    const imgObj = cover.images.find((img) => img.color === color);
    return imgObj ? imgObj.url : cover.images[0]?.url || "/fallback.jpg";
  };

  // Prev / Next image buttons update currentIndex and selectedColor
  const prevImage = () => {
    if (!cover?.images?.length) return;
    const len = cover.images.length;
    const newIndex = currentIndex === 0 ? len - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    setSelectedColor(cover.images[newIndex]?.color || null);
  };

  const nextImage = () => {
    if (!cover?.images?.length) return;
    const len = cover.images.length;
    const newIndex = currentIndex === len - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    setSelectedColor(cover.images[newIndex]?.color || null);
  };

  const decreaseQuantity = () => setQuantity((q) => (q > 1 ? q - 1 : 1));
  const increaseQuantity = () => setQuantity((q) => q + 1);

  const onAddToCart = () => setShowCartDrawer(true);

  const handleAddToCart = () => {
    if (!selectedModel) return alert("Please select a model.");
    addToCart({
      _id: cover._id,
      name: cover.name,
      price: cover.price,
      image: findImageByColor(selectedColor),
      quantity,
      model: selectedModel,
      color: selectedColor,
    });
    setQuantity(1);
    onAddToCart();
  };

  const handleOverlayClick = (e) => {
    if (cartDrawerRef.current && cartDrawerRef.current.contains(e.target)) return;
    // No overlay to close on detail page, so no action here
  };

  if(loading) <CoverDetailsSkeleton></CoverDetailsSkeleton>

  return (
    <div className="max-w-6xl mx-auto p-6" onClick={handleOverlayClick}>
      <CartDrawer open={showCartDrawer} onClose={() => setShowCartDrawer(false)} ref={cartDrawerRef} />

      {loading && <CoverDetailsSkeleton />}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {!loading && !error && cover && (
        <>
          <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800 md:text-left">{cover.name}</h1>

          <div className="flex flex-col md:flex-row gap-10">
            {/* Image Section */}
            <div className="w-full md:w-1/2 flex flex-col items-center">
              <div className="relative w-full aspect-[3/4] max-w-md border rounded overflow-hidden select-none shadow-lg">
                <Image
                  src={findImageByColor(selectedColor)}
                  alt={cover.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Controls BELOW image */}
              <div className="w-full max-w-md mt-4 flex items-center justify-between gap-2">
                <button
                  onClick={prevImage}
                  className="bg-black text-white p-2 rounded-full hover:bg-opacity-70 transition"
                  aria-label="Previous image"
                >
                  ‹
                </button>
                <button
                  onClick={nextImage}
                  className="bg-black text-white p-2 rounded-full hover:bg-opacity-70 transition"
                  aria-label="Next image"
                >
                  ›
                </button>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3 mt-4 overflow-x-auto w-full max-w-md">
                {cover.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setCurrentIndex(i);
                      setSelectedColor(img.color);
                    }}
                    className={`w-20 h-28 rounded overflow-hidden border-2 ${
                      currentIndex === i ? "border-cyan-500" : "border-transparent"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={`${cover.name} thumbnail ${i + 1}`}
                      width={80}
                      height={112}
                      className="object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="flex-1 space-y-4">
              <p className="text-xl font-semibold text-red-600">৳{cover.price}</p>

              {cover.tag && <p className="bg-yellow-200 px-2 py-1 inline-block rounded">{cover.tag}</p>}

              <div>
                <strong>Model:</strong>{" "}
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="border rounded px-2 py-1 ml-2"
                >
                  {cover.models.map((m, i) => (
                    <option key={i} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <strong>Quantity:</strong>{" "}
                <div className="inline-flex items-center gap-2 ml-2">
                  <button onClick={decreaseQuantity} className="px-2 py-1 bg-gray-200 rounded">
                    -
                  </button>
                  <span>{quantity}</span>
                  <button onClick={increaseQuantity} className="px-2 py-1 bg-gray-200 rounded">
                    +
                  </button>
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <strong>Color:</strong>
                <div className="flex flex-wrap gap-2 mt-2">
                  {cover.images.map(({ color }) => (
                    <button
                      key={color || "default"}
                      onClick={() => {
                        setSelectedColor(color);
                        const idx = cover.images.findIndex((img) => img.color === color);
                        if (idx >= 0) setCurrentIndex(idx);
                      }}
                      className={`px-4 py-1 rounded-full border-2 font-semibold ${
                        selectedColor === color
                          ? "border-orange-500 bg-orange-100 dark:bg-orange-700 text-orange-800 dark:text-white"
                          : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      style={{ textTransform: "capitalize" }}
                    >
                      {color || "Default"}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="mt-4 bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition"
              >
                Add to Cart
              </button>

              <hr className="my-4" />

              <div><strong>Type:</strong> {cover.type || "N/A"}</div>
              <div><strong>Gender:</strong> {cover.gender || "N/A"}</div>
              <div><strong>Status:</strong> {cover.isAvailable ? "Available" : "Out of Stock"}</div>
              <div><strong>Featured:</strong> {cover.isFeatured ? "Yes" : "No"}</div>
              <div><strong>Created At:</strong> {new Date(cover.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
