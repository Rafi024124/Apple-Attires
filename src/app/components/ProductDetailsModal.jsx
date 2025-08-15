'use client';

import React, { useState } from 'react';
import { useCart } from '@/app/context/CartContext';
import { FaTimes } from "react-icons/fa";

export default function ProductDetailsModal({ product, onClose, loading }) {
  const { addToCart } = useCart();

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
        <div className="bg-white p-4 rounded shadow-lg">Loading...</div>
      </div>
    );
  }

  if (!product) return null;

  const images = product.images || [];
  const uniqueColorsSet = new Set(
    images
      .map((img) => (img.color ? img.color.toLowerCase() : null))
      .filter(Boolean)
  );
  const hasDefaultColor = images.some((img) => !img.color || img.color.trim() === '');
  const colorOptions = hasDefaultColor ? ['default', ...uniqueColorsSet] : [...uniqueColorsSet];

  const [selectedColor, setSelectedColor] = useState(() => {
    if (colorOptions.length === 0) return '';
    return colorOptions[0] === 'default' ? null : colorOptions[0];
  });
  const [selectedModel, setSelectedModel] = useState(product.models?.[0] || '');
  const [quantity, setQuantity] = useState(1);

  const findImageByColor = (color) => {
    if (color === null) {
      const imgObj = images.find((img) => !img.color || img.color.trim() === '');
      return imgObj ? imgObj.url : images[0]?.url || '/fallback.jpg';
    }
    const imgObj = images.find((img) => img.color?.toLowerCase() === color);
    return imgObj ? imgObj.url : images[0]?.url || '/fallback.jpg';
  };

  const handleAddToCartClick = () => {
    if (!selectedModel) {
      alert('Please select a model.');
      return;
    }
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: findImageByColor(selectedColor),
      quantity,
      model: selectedModel,
      color: selectedColor === null ? 'default' : selectedColor,
    });
    alert('Added to cart!');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-70 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden relative flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full p-2 shadow-md transition"
          aria-label="Close modal"
        >
          <FaTimes></FaTimes>
        </button>

        {/* Left Side - Image */}
        <div className="md:w-1/2 bg-gray-50 flex items-center justify-center p-4">
          <img
            src={findImageByColor(selectedColor)}
            alt={product.name}
            className="max-h-[400px] object-contain rounded-lg"
          />
        </div>

        {/* Right Side - Details */}
        <div className="md:w-1/2 p-6 flex flex-col">
          <h2 className="text-2xl font-bold mb-3">{product.name}</h2>
          <p className="text-xl font-semibold text-orange-600 mb-4">৳{product.price}</p>

          {/* Model Selector */}
          <label className="block font-semibold mb-1">Model</label>
          <select
            className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            {product.models?.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>

          {/* Color Selector */}
          <label className="block font-semibold mb-1">Color</label>
          <div className="flex flex-wrap gap-2 mb-4">
            {colorOptions.map((color) => {
              const isSelected = selectedColor === (color === 'default' ? null : color);
              return (
                <button
                  key={color}
                  className={`w-10 h-10 rounded-full border-2 transition ${
                    isSelected ? 'border-orange-500 ring-2 ring-orange-300' : 'border-gray-300 hover:border-orange-400'
                  }`}
                  style={{
                    background:
                      color === 'default' ? '#f5f5f5' : color,
                  }}
                  onClick={() => setSelectedColor(color === 'default' ? null : color)}
                  title={color === 'default' ? 'Default' : color}
                />
              );
            })}
          </div>

          {/* Quantity Selector */}
          <label className="block font-semibold mb-1">Quantity</label>
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
              className="px-3 py-1 border rounded-lg hover:bg-gray-100"
            >
              −
            </button>
            <span className="text-lg">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="px-3 py-1 border rounded-lg hover:bg-gray-100"
            >
              +
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCartClick}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
