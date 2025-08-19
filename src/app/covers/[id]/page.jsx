"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { FaArrowLeft, FaArrowRight, FaExpand } from "react-icons/fa";
import { useCart } from "@/app/context/CartContext";
import CartDrawer from "@/app/components/cartDrawer/page";
import CoverDetailsSkeleton from "./CoverDetailsSkeleton";
import CoverCard from "@/app/components/CoverCard";

export default function CoverDetails() {
  const params = useParams();
  const { id } = params;
  const router = useRouter();

  const [cover, setCover] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainIndex, setMainIndex] = useState(0);
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const mainImageRef = useRef(null);
  const zoomLensRef = useRef(null);
  const { addToCart, cartItems } = useCart();

  const images = cover?.images || [];

  // Extract unique colors
  const uniqueColors = React.useMemo(() => {
    const colorsSet = new Set();
    let hasDefault = false;
    images.forEach(({ color }) => {
      if (color) colorsSet.add(color);
      else hasDefault = true;
    });
    const colorsArray = [...colorsSet];
    if (hasDefault) colorsArray.unshift("default");
    return colorsArray;
  }, [images]);

  // Fetch product details
  useEffect(() => {
    async function fetchCover() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/covers/${id}`);
        if (!res.ok) throw new Error("Failed to fetch cover details");

        const data = await res.json();
        setCover(data);
        setRelated(data.related || []);
        setSelectedModel(data.models?.[0] || "");
        setSelectedColor(data.images?.[0]?.color || (data.images?.[0] ? null : null));
        setMainIndex(0);
        setQuantity(1);
      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchCover();
  }, [id]);

  // Update zoom lens whenever main image changes
  useEffect(() => {
    if (zoomLensRef.current) {
      zoomLensRef.current.style.backgroundImage = `url(${images[mainIndex]?.url || "/fallback.jpg"})`;
      zoomLensRef.current.style.backgroundPosition = `50% 50%`;
    }
  }, [mainIndex, images]);

  const prevImage = () => {
    if (!images.length) return;
    const len = images.length;
    const newIndex = mainIndex === 0 ? len - 1 : mainIndex - 1;
    setMainIndex(newIndex);
    setSelectedColor(images[newIndex]?.color || null);
  };

  const nextImage = () => {
    if (!images.length) return;
    const len = images.length;
    const newIndex = mainIndex === len - 1 ? 0 : mainIndex + 1;
    setMainIndex(newIndex);
    setSelectedColor(images[newIndex]?.color || null);
  };

  const decreaseQuantity = () => setQuantity((q) => (q > 1 ? q - 1 : 1));
  const increaseQuantity = () => setQuantity((q) => q + 1);

  const handleAddToCart = () => {
    if (!selectedModel) return alert("Please select a model.");

    const stock = cover.stock || 0; // ✅ overall stock

    const cartQuantity = cartItems
      .filter(item => item._id === cover._id)
      .reduce((sum, item) => sum + item.quantity, 0);

    const availableStock = stock - cartQuantity;

    if (availableStock <= 0) return alert("This product is out of stock.");
    if (quantity > availableStock) return alert(`Only ${availableStock} item(s) available.`);

    addToCart({
      _id: cover._id,
      name: cover.name,
      price: cover.price,
      image: images[mainIndex]?.url || "/fallback.jpg",
      quantity,
      model: selectedModel,
      color: selectedColor,
    });

    setQuantity(1);
    setShowCartDrawer(true);
  };

  function handleMouseMove(e) {
    if (!mainImageRef.current || !zoomLensRef.current) return;
    const rect = mainImageRef.current.getBoundingClientRect();
    const lens = zoomLensRef.current;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const lensX = Math.max(0, Math.min(x - 100, rect.width - 200));
    const lensY = Math.max(0, Math.min(y - 100, rect.height - 200));
    const bgX = (x / rect.width) * 100;
    const bgY = (y / rect.height) * 100;
    lens.style.left = `${lensX}px`;
    lens.style.top = `${lensY}px`;
    lens.style.backgroundPosition = `${bgX}% ${bgY}%`;
  }

  function handleMouseEnter() {
    if (zoomLensRef.current) zoomLensRef.current.style.display = "block";
  }

  function handleMouseLeave() {
    if (zoomLensRef.current) zoomLensRef.current.style.display = "none";
  }

  if (loading) return <CoverDetailsSkeleton />;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!cover) return <p className="text-center">No cover found.</p>;

  const { name, price, tag, models = [], isAvailable, isFeatured, createdAt, type, gender, stock } = cover;

  const cartQuantity = cartItems
    .filter(item => item._id === cover._id)
    .reduce((sum, item) => sum + item.quantity, 0);
  const availableStock = (stock || 0) - cartQuantity;
  const isOutOfStock = availableStock <= 0;
  const isQuantityTooHigh = quantity > availableStock;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <CartDrawer open={showCartDrawer} onClose={() => setShowCartDrawer(false)} />

      {showPreview && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex justify-center items-center"
          onClick={() => setShowPreview(false)}
        >
          <Image
            src={images[mainIndex]?.url || "/fallback.jpg"}
            alt="Preview"
            width={800}
            height={1000}
            className="rounded-lg object-contain max-h-[90vh]"
          />
        </div>
      )}

      <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800 md:text-left">{name}</h1>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Image Section */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <div
            ref={mainImageRef}
            className="relative w-full aspect-[3.9/4] max-w-md border rounded overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Image
              src={images[mainIndex]?.url || "/fallback.jpg"}
              alt="Main"
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-contain"
              unoptimized
            />
            <div
              ref={zoomLensRef}
              className="absolute border border-gray-400 rounded-md shadow-lg"
              style={{
                display: "none",
                width: "200px",
                height: "200px",
                backgroundRepeat: "no-repeat",
                backgroundSize: "500% 500%",
                zIndex: 10,
              }}
            />
          </div>

          {/* Controls */}
          <div className="w-full max-w-md mt-4 flex items-center justify-between gap-2">
            <button onClick={prevImage} className="bg-black text-white p-2 rounded-full hover:bg-opacity-70 transition">
              <FaArrowLeft />
            </button>
            <button
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border rounded hover:scale-105 transition"
            >
              <FaExpand className="text-black" />
              <span className="text-sm font-medium">Preview</span>
            </button>
            <button onClick={nextImage} className="bg-black text-white p-2 rounded-full hover:bg-opacity-70 transition">
              <FaArrowRight />
            </button>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 mt-4 overflow-x-auto w-full max-w-md">
            {images.map(({ url, color }, i) => (
              <button
                key={i}
                onClick={() => {
                  setMainIndex(i);
                  setSelectedColor(color || null);
                }}
                className={`w-20 h-28 rounded overflow-hidden border-2 ${mainIndex === i ? "border-cyan-500" : "border-transparent"}`}
              >
                <Image src={url} alt={`Thumbnail ${i + 1}`} width={80} height={112} className="object-cover" unoptimized />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 space-y-4">
          <p className="text-xl font-semibold text-red-600">৳{price}</p>
          {tag && <p className="bg-yellow-200 px-2 py-1 inline-block rounded">{tag}</p>}

          <div>
            <strong>Model:</strong>{" "}
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="border rounded px-2 py-1 ml-2"
            >
              {models.map((m, i) => <option key={i} value={m}>{m}</option>)}
            </select>
          </div>

          <div>
            <strong>Quantity:</strong>{" "}
            <div className="inline-flex items-center gap-2 ml-2">
              <button onClick={decreaseQuantity} className="px-2 py-1 bg-gray-200 rounded">-</button>
              <span>{quantity}</span>
              <button onClick={increaseQuantity} className="px-2 py-1 bg-gray-200 rounded">+</button>
            </div>
          </div>

          <div>
            <strong>Color:</strong>
            <div className="flex flex-wrap gap-2 mt-2">
              {uniqueColors.map((color) => {
                const idx = images.findIndex(img => color === "default" ? !img.color : img.color === color);
                return (
                  <button
                    key={color}
                    onClick={() => {
                      setSelectedColor(color === "default" ? null : color);
                      if (idx >= 0) setMainIndex(idx);
                    }}
                    className={`px-4 py-1 rounded-full border-2 font-semibold ${
                      (selectedColor === color) || (color === "default" && selectedColor === null)
                        ? "border-orange-500 bg-orange-100 dark:bg-orange-700 text-orange-800 dark:text-white"
                        : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    style={{ textTransform: "capitalize" }}
                  >
                    {color === "default" ? "Default" : color}
                  </button>
                );
              })}
            </div>
          </div>

          {cover.description && (
            <div className="mt-4">
              <strong>Description:</strong>
              <p className="mt-1 text-gray-700">{cover.description}</p>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isQuantityTooHigh}
            className={`mt-4 px-6 py-2 rounded ${
              isOutOfStock || isQuantityTooHigh
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600 text-white"
            }`}
          >
            {isOutOfStock
              ? "Out of Stock"
              : isQuantityTooHigh
              ? `Only ${availableStock} available`
              : "Add to Cart"}
          </button>

          <hr className="my-4" />
          <div><strong>Type:</strong> {type || "N/A"}</div>
          <div><strong>Gender:</strong> {gender || "N/A"}</div>
          <div><strong>Status:</strong> {isAvailable ? "Available" : "Out of Stock"}</div>
          <div><strong>Featured:</strong> {isFeatured ? "Yes" : "No"}</div>
          <div><strong>Created At:</strong> {new Date(createdAt).toLocaleDateString()}</div>
          <div><strong>Stock:</strong> {stock || 0}</div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {related.map((item) => (
              <CoverCard
                key={item._id}
                item={item}
                onViewDetails={(id) => router.push(`/covers/${id}`)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}