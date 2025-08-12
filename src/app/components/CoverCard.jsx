'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaSearch, FaShoppingCart } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';
import CartDrawer from './cartDrawer/page';

export default function CoverCard({ item, onViewDetails }) {
  const router = useRouter();
  const { _id, name, images = [], price, gender, type, models = [] } = item;
  const { addToCart } = useCart();

  // Extract unique colors from images (filter out null/undefined/empty)
  const uniqueColorsSet = new Set(
    images
      .map((img) => (img.color ? img.color.toLowerCase() : null))
      .filter((c) => c)
  );

  // Check if any image has no color (default)
  const hasDefaultColor = images.some((img) => !img.color || img.color.trim() === '');

  // Compose the color options list with "default" at start if needed
  const colorOptions = hasDefaultColor ? ['default', ...uniqueColorsSet] : [...uniqueColorsSet];

  // Initial selected color (first color option or null)
  // Use null for default color internally
  const initialColor =
    colorOptions.length > 0
      ? colorOptions[0] === 'default'
        ? null
        : colorOptions[0]
      : null;

  const [selectedColor, setSelectedColor] = useState(initialColor);

  // Find image URL for the selected color, fallback to first image if not found
  // For 'default' (null), find first image without color
  const selectedImageObj =
    selectedColor === null
      ? images.find((img) => !img.color || img.color.trim() === '') || images[0] || {}
      : images.find((img) => img.color?.toLowerCase() === selectedColor) || images[0] || {};

  const currentImage = selectedImageObj.url;

  const [showModelSelector, setShowModelSelector] = useState(false);
  const [selectedModel, setSelectedModel] = useState('');
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [imageError, setImageError] = useState(false);

  const onAddToCart = () => setShowCartDrawer(true);

  const handleSearchClick = (e) => {
    e.stopPropagation();

    if (onViewDetails) onViewDetails(_id);
  };

  const goToDetailsPage = () => {
    if (!showModelSelector) router.push(`/covers/${_id}`);
  };

  const handleAddToCart = () => {
    if (models.length > 0) {
      setShowModelSelector(true);
    } else {
      addToCart({
        ...item,
        color: selectedColor || 'default',
        model: '',
        quantity: 1,
        image: currentImage,
      });
      onAddToCart();
    }
  };

  const confirmModel = () => {
    if (selectedModel) {
      addToCart({
        ...item,
        color: selectedColor || 'default',
        model: selectedModel,
        quantity: 1,
        image: currentImage,
      });
      setShowModelSelector(false);
      setSelectedModel('');
      onAddToCart();
    }
  };

  return (
    <div className="relative group col-span-1 bg-white shadow-sm hover:shadow-lg transition duration-300 ease-in-out cursor-pointer flex flex-col h-[310px]">
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
        className={`flex flex-col flex-grow ${showModelSelector ? 'pointer-events-none opacity-30' : ''}`}
        onClick={goToDetailsPage}
      >
        <div className="relative w-full h-44 md:h-48 rounded-lg overflow-hidden">
          {currentImage && (
            <Image
              src={currentImage}
              alt={name}
              fill
              className="object-contain"
              unoptimized
              sizes="(max-width: 768px) 100vw, 314px"
              onError={() => setImageError(true)}
            />
          )}

          {/* Desktop Hover Action Buttons */}
          <div className="hidden md:flex absolute inset-0 items-end w-[80%] mx-auto justify-between p-3 opacity-100 bg-transparent transition duration-300 ease-in-out">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
              className="relative group/button flex bg-orange-500 hover:scale-110 transition-transform duration-300 ease-in-out text-white text-sm font-medium px-3 py-1.5 rounded shadow min-w-[100px]"
              aria-label="Add to Cart"
            >
              <span className="absolute left-0 right-0 flex justify-center items-center transition-opacity duration-200 ease-in-out group-hover/button:opacity-0">
                Add To Cart
              </span>
              <FaShoppingCart className="opacity-0 transition-opacity duration-200 ease-in-out group-hover/button:opacity-100 mx-auto" />
            </button>

            <button
              onClick={handleSearchClick}
              className="text-orange-500 hover:scale-130 transition-transform duration-300 text-xl"
              title="View Details"
              aria-label="Order Now"
            >
              <FaSearch />
            </button>
          </div>
        </div>

        {/* Color palette */}
        {colorOptions.length > 0 && (
          <div className="flex justify-center items-center gap-2 mt-3">
            {colorOptions.map((color) => {
              const isSelected = selectedColor === (color === 'default' ? null : color);
              // For 'default', show a gray circle or special style:
              const bgColor = color === 'default' ? '#999999' : color;

              return (
                <button
                  key={color}
                  className={`w-6 h-6 rounded-full border-2 ${
                    isSelected ? 'border-orange-500' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: bgColor }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedColor(color === 'default' ? null : color);
                    setImageError(false);
                  }}
                  aria-label={`Select color ${color === 'default' ? 'Default' : color}`}
                  title={color === 'default' ? 'Default' : color}
                />
              );
            })}
          </div>
        )}

        <h3
          className="mt-4 text-sm text-center lg:text-base px-3 text-gray-800 leading-tight tracking-wide"
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

        <p className="text-orange-600 font-semibold text-lg mt-1 px-3 text-center">৳{price}</p>
      </div>

      {/* Mobile Buttons */}
      <div className="flex md:hidden justify-between px-3 py-2 mt-auto gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart();
          }}
          className="flex-1 bg-orange-500 text-white text-sm py-2 rounded shadow"
        >
          Add to Cart
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToDetailsPage();
          }}
          className="flex-1 bg-gray-800 text-white text-sm py-2 rounded shadow"
        >
          Order Now
        </button>
      </div>
    </div>
  );
}
