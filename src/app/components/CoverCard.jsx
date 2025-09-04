'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { FaSearch, FaShoppingCart, FaTimes, FaPlus, FaMinus } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';

export default function CoverCard({ item, onViewDetails, onAddToCart }) {
  const router = useRouter();
  const { _id, name, images = [], price, discount = 0, models = [], stock  } = item;
  const { addToCart, cartItems } = useCart();

  const [hoverIndex, setHoverIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);

  const isDiscountActive = useMemo(() => {
    if (!item.discountEnd || discount <= 0) return false;
    const now = new Date();
    const discountEndDate = new Date(item.discountEnd);
    return now < discountEndDate;
  }, [item.discountEnd, discount]);

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

  // Hover images
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

  const discountedPrice = price - price * (discount / 100);
  const displayedPrice = isDiscountActive ? discountedPrice : price;

  // Stock logic
  const cartQuantityForItem = useMemo(
    () => cartItems.filter((ci) => ci._id === _id).reduce((sum, ci) => sum + ci.quantity, 0),
    [cartItems, _id]
  );
  const availablestock = useMemo(() => Math.max((stock || 0) - cartQuantityForItem, 0), [stock, cartQuantityForItem]);
  const isOutOfstock = availablestock <= 0;
  const isQuantityTooHigh = quantity > availablestock;

  useEffect(() => {
    if (quantity > availablestock) setQuantity(availablestock > 0 ? 1 : 0);
  }, [availablestock, quantity]);

  const handleAdd = () => {
    if (models.length > 0 && !selectedModel) {
      setShowModelSelector(true);
      return;
    }
    if (isOutOfstock) return;
    if (isQuantityTooHigh) {
      alert(`Only ${availablestock} item(s) available.`);
      setQuantity(availablestock);
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
    <div className="relative group w-full p-2 bg-white shadow-sm hover:shadow-lg transition duration-300 ease-in-out cursor-pointer flex flex-col">
      
      {/* Discount Badge */}
      {isDiscountActive && (
        <div className="absolute top-3 left-3 z-1 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg 
                        bg-gradient-to-r from-red-500 to-red-600 animate-pulse transform -rotate-3">
          {discount}% OFF
        </div>
      )}

      {/* Model Selector Overlay */}
      {showModelSelector && (
        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center p-6 rounded-2xl bg-white/80 backdrop-blur-lg shadow-xl animate-fadeIn">
          <button
            className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition"
            onClick={() => setShowModelSelector(false)}
          >
            <FaTimes size={20} />
          </button>
          <h4 className="mb-4 text-lg font-bold text-gray-700 tracking-wide">
            Select Your Model
          </h4>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="mb-5 px-4 py-3 border border-gray-300 rounded-lg w-full text-sm font-medium text-gray-700 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
          >
            <option value="">-- Choose Model --</option>
            {models.map((model, index) => (
              <option key={index} value={model}>{model}</option>
            ))}
          </select>
          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-md hover:bg-orange-600 transition"><FaMinus /></button>
            <span className="font-semibold text-lg text-gray-800 min-w-[30px] text-center">{quantity}</span>
            <button onClick={() => setQuantity((q) => Math.min(availablestock, q + 1))} className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-md hover:bg-orange-600 transition"><FaPlus /></button>
          </div>
          <button
            onClick={confirmModel}
            disabled={!selectedModel || isOutOfstock}
            className={`w-full py-3 rounded-xl text-white font-semibold text-sm transition shadow-lg ${
              !selectedModel || isOutOfstock
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600'
            }`}
          >
            {isOutOfstock ? 'Out of stock' : 'Confirm'}
          </button>
        </div>
      )}

      {/* Main clickable content */}
      <div
        className={`flex flex-col flex-grow transition-all duration-300 ${showModelSelector ? 'pointer-events-none opacity-30 scale-95' : 'opacity-100'}`}
        onClick={() => !showModelSelector && router.push(`/covers/${_id}`)}
      >

        {/* Image */}
        <div className="relative w-full pb-[125%] md:pb-[100%] rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
          {currentImage && (
            <Image
              src={isHovering && hoverImages.length > 0 ? hoverImages[hoverIndex].url : currentImage}
              alt={name}
              fill
              className="object-contain w-full h-full transition-transform duration-300 ease-in-out hover:scale-105"
              unoptimized
              onError={() => setImageError(true)}
            />
          )}
          {/* Overlay Buttons */}
          <div className="hidden md:flex absolute inset-0 items-end w-[85%] mx-auto justify-between p-3">
            <button
              onClick={(e) => { e.stopPropagation(); handleAdd(); }}
              disabled={isOutOfstock || isQuantityTooHigh}
              className={`flex justify-center items-center text-white text-sm font-medium px-3 py-2 rounded-xl shadow-lg transition-transform duration-300 ease-in-out ${!isOutOfstock && !isQuantityTooHigh ? 'bg-orange-500 hover:scale-105 hover:bg-orange-600' : 'bg-gray-400 cursor-not-allowed'}`}
            >
              <FaShoppingCart className="mr-2" />
              {isOutOfstock ? 'Out of stock' : isQuantityTooHigh ? `Only ${availablestock} left` : 'Add To Cart'}
            </button>
            <button className="text-orange-500 rounded-lg p-2 flex items-center gap-1 hover:scale-110 transition-transform duration-300 text-lg font-medium bg-white/10 backdrop-blur-sm">
              <FaSearch className="text-white" />
            </button>
          </div>
        </div>

        {/* Color Options */}
        {colorOptions.length > 0 && (
          <div className="flex justify-center items-center gap-2 mt-3">
            {colorOptions.map((color) => {
              const isSelected = selectedColor === (color === 'default' ? null : color);
              const bgColor = color === 'default' ? '#999999' : color;
              return (
                <button
                  key={color}
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${isSelected ? 'border-orange-500 shadow-md scale-110' : 'border-gray-300 hover:scale-105 hover:shadow-sm'}`}
                  style={{ backgroundColor: bgColor }}
                  onClick={(e) => { e.stopPropagation(); setSelectedColor(color === 'default' ? null : color); setImageError(false); }}
                  aria-label={`Select color ${color === 'default' ? 'Default' : color}`}
                  title={color === 'default' ? 'Default' : color}
                />
              );
            })}
          </div>
        )}

        {/* Name */}
        <h3 className="mt-4 text-sm text-center lg:text-base px-3 text-gray-800 leading-tight tracking-wide overflow-hidden text-ellipsis whitespace-nowrap font-semibold" title={name}>{name}</h3>

        {/* Price */}
        <p className="text-center mt-1 px-3">
          {isDiscountActive ? (
            <span className="flex justify-center items-center gap-2">
              <span className="text-gray-400 line-through text-sm">৳{price}</span>
              <span className="text-orange-600 font-bold text-lg">৳{displayedPrice.toFixed(0)}</span>
            </span>
          ) : (
            <span className="text-orange-600 font-bold text-lg">৳{price}</span>
          )}
        </p>

      </div>

      {/* Mobile Buttons */}
      <div className="flex md:hidden justify-between gap-1 py-2 mt-auto">
        <button
          onClick={(e) => { e.stopPropagation(); handleAdd(); }}
          disabled={isOutOfstock || isQuantityTooHigh}
          className={`flex-1 py-2 text-xs font-medium rounded-lg shadow-md transition ${!isOutOfstock && !isQuantityTooHigh ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-400 cursor-not-allowed'} text-white`}
        >
          {isOutOfstock ? 'Out of Stock' : isQuantityTooHigh ? `Only ${availablestock} available` : 'Add to Cart'}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); router.push(`/covers/${_id}`); }}
          className="flex-1 py-2 text-sm font-medium rounded-lg shadow-md bg-gray-800 hover:bg-gray-700 text-white transition"
        >
          Order Now
        </button>
      </div>
    </div>
  );
}
