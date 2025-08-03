"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/app/context/CartContext";

export default function CoverDetails() {
  const params = useParams();
  const { id } = params;

  const [cover, setCover] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [mainIndex, setMainIndex] = useState(0);
  const [selectedModel, setSelectedModel] = useState("");
  const [quantity, setQuantity] = useState(1);

  const mainImageRef = useRef(null);
  const zoomLensRef = useRef(null);

  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchCover() {
      setLoading(true);
      try {
        const res = await fetch(`/api/covers/${id}`);
        if (!res.ok) throw new Error("Failed to fetch cover details");
        const data = await res.json();
        setCover(data);
        setSelectedModel(data.models?.[0] || ""); // default model
      } catch (err) {
        setError(err.message || "Unknown error");
      }
      setLoading(false);
    }
    if (id) fetchCover();
  }, [id]);

  function handleMouseMove(e) {
    if (!mainImageRef.current || !zoomLensRef.current) return;
    const rect = mainImageRef.current.getBoundingClientRect();
    const lens = zoomLensRef.current;
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
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

  if (loading) return <p className="text-center p-4">Loading cover details...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!cover) return <p className="text-center">No cover found.</p>;

  const {
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
    _id,
  } = cover;

  const imgs = images.length ? images : ["/fallback.jpg"];

  const handleAddToCart = () => {
    if (!selectedModel) return alert("Please select a model.");
    addToCart({
      _id,
      name,
      image: imgs[0],
      price,
      model: selectedModel,
      quantity,
    });
   
  setQuantity(1);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{name}</h1>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Image Section */}
        <div className="w-full md:w-1/2">
          <div
            ref={mainImageRef}
            className="relative w-[400px] h-[400px] border rounded-md overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Image
              src={imgs[mainIndex]}
              alt="Main"
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover"
              unoptimized
            />
            <div
              ref={zoomLensRef}
              className="absolute border border-gray-400 rounded-md shadow-lg"
              style={{
                display: "none",
                width: "200px",
                height: "200px",
                backgroundImage: `url(${imgs[mainIndex]})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "500% 500%",
                zIndex: 10,
              }}
            />
          </div>

          <div className="flex gap-3 mt-4 overflow-x-auto">
            {imgs.map((src, i) => (
              <button
                key={i}
                onClick={() => setMainIndex(i)}
                className={`w-20 h-28 rounded overflow-hidden border-2 ${
                  mainIndex === i ? "border-cyan-500" : "border-transparent"
                }`}
              >
                <Image
                  src={src}
                  alt={`Thumbnail ${i + 1}`}
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
          <p className="text-xl font-semibold text-red-600">৳{price}</p>

          {tag && <p className="bg-yellow-200 px-2 py-1 inline-block rounded">{tag}</p>}

          <div>
            <strong>Model:</strong>{" "}
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="border rounded px-2 py-1 ml-2"
            >
              {models.map((m, i) => (
                <option key={i} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <strong>Quantity:</strong>{" "}
            <div className="inline-flex items-center gap-2 ml-2">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-2 py-1 bg-gray-200 rounded"
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-2 py-1 bg-gray-200 rounded"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="mt-4 bg-cyan-600 text-white px-6 py-2 rounded hover:bg-cyan-700"
          >
            Add to Cart
          </button>

          <hr />

          <div><strong>Type:</strong> {type || "N/A"}</div>
          <div><strong>Gender:</strong> {gender || "N/A"}</div>
          <div><strong>Status:</strong> {isAvailable ? "Available" : "Out of Stock"}</div>
          <div><strong>Featured:</strong> {isFeatured ? "Yes" : "No"}</div>
          <div><strong>Created At:</strong> {new Date(createdAt).toLocaleDateString()}</div>
        </div>
      </div>
    </div>
  );
}
