'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FaSearch } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';

export default function CoverCard({ item, onViewDetails }) {
  const router = useRouter();
  const { _id, name, images = [], price, gender, type, models = [] } = item;
  const { addToCart } = useCart();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [selectedModel, setSelectedModel] = useState('');

  // Filter out invalid image URLs
  const safeImages = images.filter(img => typeof img === 'string' && img.trim() !== '');
  // Clamp currentIndex within valid range
  const clampedIndex = Math.min(Math.max(currentIndex, 0), safeImages.length - 1);
  // Use fallback if no valid images
  const currentImage = safeImages.length > 0 ? safeImages[clampedIndex] : '/fallback.jpg';

  const handleMouseMove = (e) => {
    if (safeImages.length <= 1) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;

    // Calculate index based on mouse X position
    let index = Math.floor((x / width) * safeImages.length);

    // Clamp index to valid range
    if (index < 0) index = 0;
    if (index >= safeImages.length) index = safeImages.length - 1;

    setCurrentIndex(index);
  };

  const handleMouseLeave = () => {
    setCurrentIndex(0);
  };

  const goToDetailsPage = () => {
    if (!showModelSelector) router.push(`/covers/${_id}`);
  };

  const genderColor =
    gender === 'Ladies'
      ? 'bg-pink-200 text-pink-800'
      : gender === 'Unisex'
      ? 'bg-blue-100 text-blue-800'
      : 'bg-gray-200 text-gray-800';

  const typeColor =
    type === 'Silicon'
      ? 'bg-green-100 text-green-700'
      : type === 'AG'
      ? 'bg-yellow-100 text-yellow-700'
      : type === 'Transparent'
      ? 'bg-purple-100 text-purple-700'
      : 'bg-gray-100 text-gray-700';

  const handleAddToCart = () => {
    if (models.length > 0) {
      setShowModelSelector(true);
    } else {
      // Add directly with empty model and fallback image if needed
      addToCart({ ...item, selectedModel: '', quantity: 1, image: currentImage });
    }
  };

  const confirmModel = () => {
    if (selectedModel) {
      addToCart({ ...item, model: selectedModel, quantity: 1, image: currentImage });
      setShowModelSelector(false);
      setSelectedModel('');
    }
  };

  return (
    <div className="relative col-span-12 md:col-span-6 lg:col-span-4 p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 ease-in-out cursor-pointer flex flex-col">
      {/* Blur overlay for model selection */}
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

      {/* Main content, blurred and disabled if overlay shown */}
      <div className={`${showModelSelector ? 'pointer-events-none opacity-30' : ''}`} onClick={goToDetailsPage}>
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
            onError={(e) => {
              e.currentTarget.src = '/fallback.jpg'; // fallback if image broken
            }}
          />
        </div>

        <h3 className="font-semibold mt-4 text-base md:text-lg text-gray-800">{name}</h3>
      </div>

      <p className="text-red-500 font-semibold text-md">৳{price}</p>

      <div className="flex flex-wrap gap-2 mt-2">
        <span className={`px-2 py-1 rounded text-xs font-medium ${genderColor}`}>{gender}</span>
        <span className={`px-2 py-1 rounded text-xs font-medium ${typeColor}`}>{type}</span>
      </div>

      {/* CTA Row */}
      <div className="mt-4 flex justify-between items-center z-0">
        <button
          onClick={handleAddToCart}
          className="bg-orange-500 hover:bg-orange-600 hover:scale-105 cursor-pointer text-white text-sm font-medium px-4 py-2 rounded transition"
        >
          Add To Cart
        </button>
        <button
          onClick={onViewDetails}
          className="
          
          hover:scale-120
          text-orange-500 hover:text-orange-600 text-2xl cursor-pointer"
          title="View Details"
        >
          <FaSearch />
        </button>
      </div>
    </div>
  );
}
