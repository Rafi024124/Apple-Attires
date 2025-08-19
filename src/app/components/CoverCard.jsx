'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaSearch, FaShoppingCart, FaTimes, FaPlus, FaMinus } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';

export default function CoverCard({ item, onViewDetails, onAddToCart }) {
  const router = useRouter();
  const { _id, name, images = [], price, discount = 0, models = [], stock = 0 } = item;
  const { addToCart, cartItems } = useCart();

  const [hoverIndex, setHoverIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);

  // Extract colors
  const uniqueColorsSet = new Set(
    images.map((img) => (img.color ? img.color.toLowerCase() : null)).filter((c) => c)
  );
  const hasDefaultColor = images.some((img) => !img.color || img.color.trim() === '');
  const colorOptions = hasDefaultColor ? ['default', ...uniqueColorsSet] : [...uniqueColorsSet];
  const initialColor =
    colorOptions.length > 0 ? (colorOptions[0] === 'default' ? null : colorOptions[0]) : null;
  useEffect(() => setSelectedColor(initialColor), [initialColor]);

  const selectedImageObj =
    selectedColor === null
      ? images.find((img) => !img.color || img.color.trim() === '') || images[0] || {}
      : images.find((img) => img.color?.toLowerCase() === selectedColor) || images[0] || {};
  const currentImage = selectedImageObj.url;

  // Hover images for carousel effect
  const hoverImages = images
    .filter((img) => (selectedColor === null ? !img.color || img.color.trim() === '' : img.color?.toLowerCase() === selectedColor))
    .filter((img) => img.url && img.url !== currentImage);

  useEffect(() => {
    let interval;
    if (hoverImages.length > 1 && isHovering) {
      interval = setInterval(() => setHoverIndex((prev) => (prev + 1) % hoverImages.length), 800);
    } else {
      setHoverIndex(0);
    }
    return () => clearInterval(interval);
  }, [hoverImages, isHovering]);

  const discountedPrice = discount > 0 ? price - price * (discount / 100) : price;

  // ✅ Overall stock logic
  const cartQuantityForItem = cartItems
    .filter((ci) => ci._id === _id)
    .reduce((sum, ci) => sum + ci.quantity, 0);

  const availableStock = Math.max((stock || 0) - cartQuantityForItem, 0);
  const isOutOfStock = availableStock <= 0;
  const isQuantityTooHigh = quantity > availableStock;

  const handleAdd = () => {
    if (models.length > 0 && !selectedModel) {
      setShowModelSelector(true);
      return;
    }
    if (isOutOfStock) return;
    if (isQuantityTooHigh) {
      alert(`Only ${availableStock} item(s) available.`);
      setQuantity(availableStock);
      return;
    }

    addToCart({
      ...item,
      color: selectedColor || 'default',
      model: selectedModel || '',
      quantity,
      image: currentImage,
    });

    setQuantity(1);
    if (onAddToCart) onAddToCart(item);
  };

  const confirmModel = () => {
    if (!selectedModel) return;
    handleAdd();
    setShowModelSelector(false);
    setSelectedModel('');
  };

  return (
    <div className="relative group col-span-1 bg-white shadow-sm hover:shadow-lg transition duration-300 ease-in-out cursor-pointer flex flex-col h-[330px]">
      {showModelSelector && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-md z-20 flex flex-col justify-center items-center p-4 rounded-xl">
          <button
            className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
            onClick={() => setShowModelSelector(false)}
          >
            <FaTimes size={18} />
          </button>

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

          <div className="flex items-center gap-3 mb-3">
            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-2 py-1 border rounded">
              <FaMinus />
            </button>
            <span className="font-medium text-sm">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => Math.min(availableStock, q + 1))}
              className="px-2 py-1 border rounded"
            >
              <FaPlus />
            </button>
          </div>

          <button
            onClick={confirmModel}
            disabled={!selectedModel || isOutOfStock}
            className={`px-5 py-2 rounded text-white text-sm font-medium w-full ${
              !selectedModel || isOutOfStock ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'
            }`}
          >
            {isOutOfStock ? 'Out of Stock' : 'Confirm'}
          </button>
        </div>
      )}

      <div
        className={`flex flex-col flex-grow ${showModelSelector ? 'pointer-events-none opacity-30' : ''}`}
        onClick={() => !showModelSelector && router.push(`/covers/${_id}`)}
      >
        <div
          className="relative w-full h-44 md:h-48 rounded-lg overflow-hidden"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {currentImage && (
            <Image
              src={isHovering && hoverImages.length > 0 ? hoverImages[hoverIndex].url : currentImage}
              alt={name}
              fill
              className="object-contain"
              unoptimized
              sizes="(max-width: 768px) 100vw, 314px"
              onError={() => setImageError(true)}
            />
          )}

          {stock <= 0 && (
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-3 py-1 rounded">
              Out of Stock
            </span>
          )}

          <div className="hidden md:flex absolute inset-0 items-end w-[85%] mx-auto justify-between p-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAdd();
              }}
              disabled={isOutOfStock || isQuantityTooHigh}
              className={`flex justify-center items-center text-white text-sm font-medium px-2 py-1 rounded shadow min-w-[120px] transition-transform duration-300 ease-in-out ${
                !isOutOfStock && !isQuantityTooHigh
                  ? 'bg-orange-500 hover:scale-105 hover:bg-orange-600'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              <FaShoppingCart className="mr-2" />
              {isOutOfStock ? 'Out of Stock' : isQuantityTooHigh ? `Only ${availableStock} available` : 'Add To Cart'}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onViewDetails) onViewDetails(_id);
              }}
              className="
              text-orange-500 rounded-sm p-1 px-2
              flex items-center gap-1 hover:scale-110 transition-transform duration-300 text-lg font-medium"
            >
              <FaSearch />
              
            </button>
          </div>
        </div>

        {colorOptions.length > 0 && (
          <div className="flex justify-center items-center gap-2 mt-3">
            {colorOptions.map((color) => {
              const isSelected = selectedColor === (color === 'default' ? null : color);
              const bgColor = color === 'default' ? '#999999' : color;
              return (
                <button
                  key={color}
                  className={`w-6 h-6 rounded-full border-2 ${isSelected ? 'border-orange-500' : 'border-gray-300'}`}
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

        <h3 className="mt-4 text-sm text-center lg:text-base px-3 text-gray-800 leading-tight tracking-wide" title={name}>
          {name}
        </h3>

        <p className="text-center mt-1 px-3">
          {discount > 0 ? (
            <span className="flex justify-center items-center gap-2">
              <span className="text-gray-400 line-through text-sm">৳{price}</span>
              <span className="text-orange-600 font-semibold text-lg">৳{discountedPrice.toFixed(0)}</span>
            </span>
          ) : (
            <span className="text-orange-600 font-semibold text-lg">৳{price}</span>
          )}
        </p>
      </div>

      <div className="flex md:hidden justify-between px-3 py-2 mt-auto gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAdd();
          }}
          disabled={isOutOfStock || isQuantityTooHigh}
          className={`flex-1 text-white text-sm py-2 rounded shadow ${
            !isOutOfStock && !isQuantityTooHigh ? 'bg-orange-500' : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {isOutOfStock ? 'Out of Stock' : isQuantityTooHigh ? `Only ${availableStock} available` : 'Add to Cart'}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/covers/${_id}`);
          }}
          className="flex-1 bg-gray-800 text-white text-sm py-2 rounded shadow"
        >
          Order Now
        </button>
      </div>
    </div>
  );
}
