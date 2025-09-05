"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react"; 
import { FaArrowLeft, FaArrowRight, FaExpand } from "react-icons/fa";
import { useCart } from "@/app/context/CartContext";
import CartDrawer from "@/app/components/cartDrawer/page";
import CoverDetailsSkeleton from "./CoverDetailsSkeleton";
import CoverCard from "@/app/components/CoverCard";

export default function CoverDetails() {

  const { slug } = useParams();
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
  const [timeLeft, setTimeLeft] = useState(null);
  const mainImageRef = useRef(null);
  const zoomLensRef = useRef(null);
  const { addToCart, cartItems } = useCart();

  // Fetch product details
useEffect(() => {
  async function fetchCover() {
    if (!slug) {
    
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/covers/${slug}`);
      //console.log("Fetch response:", res);

      if (!res.ok) throw new Error("Failed to fetch cover details");

      const data = await res.json();
      //console.log("Fetched data:", data);

      setCover(data);
      setRelated(data.related || []);
      setSelectedModel(data.models?.[0] || "");
      setSelectedColor(data.images?.[0]?.color || (data.images?.[0] ? null : null));
      setMainIndex(0);
      setQuantity(1);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  fetchCover();
}, [slug]);



  // Fetch related products
  useEffect(() => {
    async function fetchRelated() {
      if (!cover?.mainCategory || !cover?.subCategory) return;
      try {
        const res = await fetch(
          `/api/covers?mainCategory=${cover.mainCategory}&subCategory=${cover.subCategory}&limit=8`
        );
        if (!res.ok) throw new Error("Failed to fetch related covers");

        const data = await res.json();
        const relatedCovers = data.covers.filter((c) => c._id !== cover._id); // exclude self
        setRelated(relatedCovers);
      } catch (err) {
        console.error("Error fetching related:", err);
      }
    }
    fetchRelated();
  }, [cover]);

  // Extract images safely
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


  const handleOrderNow = () => {
  if (!selectedModel) return alert("Please select a model.");
  if (!cover) return;

  const stock = cover.stock || 0;

  const cartQuantity = cartItems
    .filter(item => item._id === cover._id)
    .reduce((sum, item) => sum + item.quantity, 0);

  const availableStock = stock - cartQuantity;

  if (availableStock <= 0) return alert("This product is out of stock.");
  if (quantity > availableStock) return alert(`Only ${availableStock} item(s) available.`);

  // Add to cart
  addToCart({
    _id: cover._id,
    name: cover.name,
    price: discountedPrice, // use discounted price if active
    image: images[mainIndex]?.url || "/fallback.jpg",
    quantity,
    model: selectedModel,
    color: selectedColor,
  });

  // Reset selection quantity
  setQuantity(1);

  // Navigate to checkout
  router.push("/checkout");
};

  const handleAddToCart = () => {
    if (!selectedModel) return alert("Please select a model.");
    if (!cover) return;

    const stock = cover.stock || 0;

    const cartQuantity = cartItems
      .filter(item => item._id === cover._id)
      .reduce((sum, item) => sum + item.quantity, 0);

    const availableStock = stock - cartQuantity;

    if (availableStock <= 0) return alert("This product is out of stock.");
    if (quantity > availableStock) return alert(`Only ${availableStock} item(s) available.`);

    addToCart({
      _id: cover._id,
      name: cover.name,
      price: discountedPrice,
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

  // ⚡ Safely destructure only if cover exists
  const {
    name = "",
    price = 0,
    tag = "",
    models = [],
    isAvailable = false,
    isFeatured = false,
    createdAt = "",
    type = "",
    gender = "",
    stock = 0,
    discount = 0,
    discountEnd,
   
  } = cover || {};

  const discountEndDate = discountEnd ? new Date(discountEnd) : null;

  const isDiscountActive =
    discount > 0 && discountEndDate && new Date() < discountEndDate;

  const discountedPrice = isDiscountActive
  ? Math.round(price - price * (discount / 100)) // rounds to nearest integer
  : price;


  const savings = isDiscountActive ? price - discountedPrice : 0;

  // Discount countdown timer
  useEffect(() => {
    if (!isDiscountActive || !discountEndDate) return;

    const interval = setInterval(() => {
      const now = new Date();
      const diff = discountEndDate - now;

      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft(null);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isDiscountActive, discountEndDate]);

  if (loading) return <CoverDetailsSkeleton />;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!cover) return <p className="text-center">No cover found.</p>;

  const cartQuantity = cartItems
    .filter(item => item._id === cover._id)
    .reduce((sum, item) => sum + item.quantity, 0);

  const availableStock = stock - cartQuantity;
  const isOutOfStock = availableStock <= 0;
  const isQuantityTooHigh = quantity > availableStock;

  return (
    <div className="max-w-6xl mx-auto py-6 px-1 text-black">
      <CartDrawer open={showCartDrawer} onClose={() => setShowCartDrawer(false)} />

      {showPreview && (
  <AnimatePresence>
    <motion.div
      key="preview"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex justify-center items-center p-4"
    >
      {/* Close Button */}
      <button
        onClick={() => setShowPreview(false)}
        className="absolute top-6 right-6 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Image with animation */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-4xl max-h-[90vh] w-full flex justify-center"
      >
        <Image
          src={images[mainIndex]?.url || "/fallback.jpg"}
          alt="Preview"
          width={800}
          height={1000}
          className="rounded-xl object-contain shadow-2xl"
        />
      </motion.div>
    </motion.div>
  </AnimatePresence>
)}

      <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800 md:text-left">{name}</h1>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Image Section */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
  {/* Main Image */}
  <div
    ref={mainImageRef}
    className="relative w-full aspect-[3.9/4] max-w-md border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-lg bg-white/5"
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

    {/* Zoom Lens */}
    <div
      ref={zoomLensRef}
      className="absolute rounded-lg shadow-lg border border-white/30 backdrop-blur-sm"
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
  <div className="w-full max-w-md mt-4 flex items-center justify-between gap-3">
    <button
      onClick={prevImage}
      className="p-3 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-md hover:scale-110 transition"
    >
      <FaArrowLeft />
    </button>

    <button
      onClick={() => setShowPreview(true)}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium shadow-md hover:scale-105 transition"
    >
      <FaExpand />
      <span className="text-sm">Preview</span>
    </button>

    <button
      onClick={nextImage}
      className="p-3 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-md hover:scale-110 transition"
    >
      <FaArrowRight />
    </button>
  </div>

  {/* Thumbnails */}
  <div className="flex gap-3 mt-4 overflow-x-auto w-full max-w-md p-2 justify-center">
    {images.map(({ url, color }, i) => (
      <button
        key={i}
        onClick={() => {
          setMainIndex(i);
          setSelectedColor(color || null);
        }}
        className={`relative w-20 h-28 rounded-lg overflow-hidden border-2 transition-transform duration-200 ${
          mainIndex === i
            ? "border-cyan-500 scale-105 shadow-md"
            : "border-transparent hover:scale-105 hover:shadow-sm"
        }`}
      >
        <Image
          src={url}
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
         <div className="space-y-2">
  {isDiscountActive ? (
    <>
      <div className="flex items-center gap-3">
        <span className="text-gray-400 line-through text-lg">
          ৳{price}
        </span>
        <span className="text-orange-600 font-bold text-2xl">
          ৳{discountedPrice.toFixed(0)}
        </span>
      </div>
      <p className="text-green-600 font-medium">
        Save ৳{savings.toFixed(0)} ({discount}%)
      </p>

      {timeLeft && (
        <div className="bg-red-50 border border-red-200 px-3 py-2 rounded-lg inline-block">
          <p className="text-red-600 font-semibold text-sm">
            Hurry up! Offer ends in:
          </p>
          <p className="font-bold text-red-700 text-lg">
            {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
          </p>
        </div>
      )}
    </>
  ) : (
    <p className="text-orange-600 font-bold text-2xl">৳{price}</p>
  )}
</div>
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
            <div className="flex flex-wrap gap-2 mt-2 ">
              {uniqueColors.map((color) => {
                const idx = images.findIndex(img => color === "default" ? !img.color : img.color === color);
                return (
                  <button
                    key={color}
                    onClick={() => {
                      setSelectedColor(color === "default" ? null : color);
                      if (idx >= 0) setMainIndex(idx);
                    }}
                    className={`px-4 py-1  rounded-full border-2 font-semibold text-black ${
                      (selectedColor === color) || (color === "default" && selectedColor === null)
                        ? "border-orange-500 bg-orange-100 dark:bg-orange-700 text-orange-800 dark:text-white"
                        : "border-gray-300 dark:border-gray-600 text-black hover:bg-gray-100 dark:hover:bg-gray-700"
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
            <div className="mt-4 text-black">
              <strong>Description:</strong>
              <p className="mt-1 text-gray-700">{cover.description}</p>
            </div>
          )}

        <div className="flex gap-2 mt-4">
  <button
  onClick={handleAddToCart}
  disabled={isOutOfStock || isQuantityTooHigh}
  className={`
    relative mt-4 px-6 py-2 rounded transition 
    ${isOutOfStock || isQuantityTooHigh
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-orange-500 hover:bg-orange-600 text-white active:scale-95 active:bg-orange-700"
    }
  `}
>
  {isOutOfStock
    ? "Out of Stock"
    : isQuantityTooHigh
    ? `Only ${availableStock} available`
    : "Add to Cart"}
</button>
 <button
    onClick={handleOrderNow}
    disabled={isOutOfStock || isQuantityTooHigh}
    className={` relative mt-4 px-6 py-2 rounded transition text-white ${
      isOutOfStock || isQuantityTooHigh
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-green-600 hover:bg-green-700"
    }`}
  >
    Order Now
  </button>
        </div>


          <hr className="my-4" />
          
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-12">
          
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
            {related.map((item) => (
              <CoverCard
                key={item._id}
                item={item}
                
                onViewDetails={(id) => router.push(`/covers/${id}`)}
                  onAddToCart={() => setShowCartDrawer(true)}
              />
            ))}
          </div>
        </div>
      )}

      


    </div>
  );
}