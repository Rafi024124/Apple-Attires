'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FaSearch, FaShoppingCart } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';
import CartDrawer from './cartDrawer/page';

export default function CoverCard({ item, onViewDetails }) {
  const router = useRouter();
  const { _id, name, images = [], price, gender, type, models = [] } = item;
  const { addToCart } = useCart();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [selectedModel, setSelectedModel] = useState('');
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [imageError, setImageError] = useState(false);

  const safeImages = images.filter((img) => typeof img === 'string' && img.trim() !== '');
  const clampedIndex = Math.min(Math.max(currentIndex, 0), safeImages.length - 1);
  const currentImage = !imageError && safeImages.length > 0 ? safeImages[clampedIndex] : '/fallback.jpg';

  const onAddToCart = () => setShowCartDrawer(true);

  const handleMouseMove = (e) => {
    if (safeImages.length <= 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const index = Math.floor((x / rect.width) * safeImages.length);
    setCurrentIndex(Math.min(Math.max(index, 0), safeImages.length - 1));
  };

  const handleMouseLeave = () => setCurrentIndex(0);

  const goToDetailsPage = () => {
    if (!showModelSelector) router.push(`/covers/${_id}`);
  };

  const handleAddToCart = () => {
    if (models.length > 0) {
      setShowModelSelector(true);
    } else {
      addToCart({ ...item, selectedModel: '', quantity: 1, image: currentImage });
      onAddToCart();
    }
  };

  const confirmModel = () => {
    if (selectedModel) {
      addToCart({ ...item, selectedModel, quantity: 1, image: currentImage });
      setShowModelSelector(false);
      setSelectedModel('');
      onAddToCart();
    }
  };

  return (
    <div className="relative group col-span-1  bg-white shadow-sm hover:shadow-lg transition duration-300 ease-in-out cursor-pointer flex flex-col h-[290px]">
      <CartDrawer open={showCartDrawer} onClose={() => setShowCartDrawer(false)} />

      {showModelSelector && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-md z-20 flex flex-col justify-center items-center p-4 rounded-xl">
          <h4 className="mb-2 text-sm font-semibold text-gray-700">Select Your Model</h4>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="mb-3 px-3 py-2 border border-gray-300 rounded w-full text-sm"
          >
            <option value="">-- Choose Model --</option>
            {models.map((model, index) => (
              <option key={index} value={model}>
                {model}
              </option>
            ))}
          </select>
          <button
            onClick={confirmModel}
            disabled={!selectedModel}
            className={`px-4 py-2 rounded text-white text-sm font-medium ${
              selectedModel ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Confirm
          </button>
        </div>
      )}

      <div
        className={`${showModelSelector ? 'pointer-events-none opacity-30' : ''} flex flex-col flex-grow`}
        onClick={goToDetailsPage}
      >
        <div
          className="relative w-full h-44 md:h-48 rounded-lg overflow-hidden"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <Image
            src={currentImage}
            alt={name}
            fill
            className="object-contain"
            unoptimized
            sizes="(max-width: 768px) 100vw, 314px"
            onError={() => setImageError(true)}
          />

          <div className="absolute  inset-0 flex items-end justify-between p-3 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-white/90 via-white/20 to-transparent transition duration-300 ease-in-out">
            {/* UPDATED BUTTON */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
              className="relative group/button items-center justify-center flex bg-orange-500 hover:scale-110 transition-transform duration-300 ease-in-out text-white text-sm font-medium px-3 py-1.5 rounded shadow min-w-[100px] overflow-hidden"
              aria-label="Add to Cart"
            >
              {/* Text */}
              <span className="absolute left-0 right-0 flex justify-center items-center transition-opacity duration-200 ease-in-out group-hover/button:opacity-0">
                Add To Cart
              </span>
              {/* Icon */}
              <FaShoppingCart className="opacity-0 transition-opacity duration-200 ease-in-out group-hover/button:opacity-100 mx-auto" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails();
              }}
              className="text-orange-500 hover:scale-130 transition-transform duration-300 text-xl"
              title="View Details"
              aria-label="View Details"
            >
              <FaSearch />
            </button>
          </div>
        </div>

        <h3
          className=" mt-4 text-sm lg:text-base px-3 text-gray-800 leading-tight tracking-wide"
          style={{
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
          title={name}
        >
          {name}
        </h3>

        <p className="text-orange-600 font-semibold text-lg mt-1 px-3">৳{price}</p>
      </div>
    </div>
  );
}
