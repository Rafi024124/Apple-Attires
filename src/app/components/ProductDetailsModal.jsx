'use client';

import React, { useState } from 'react';
import { useCart } from '@/app/context/CartContext';

export default function ProductDetailsModal({ product, onClose, loading }) {
  const { addToCart } = useCart();

  const [selectedModel, setSelectedModel] = useState(product.models?.[0] || '');
  const [selectedColor, setSelectedColor] = useState(product.images?.[0]?.color || '');
  const [quantity, setQuantity] = useState(1);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
        <div className="bg-white p-4 rounded">Loading...</div>
      </div>
    );
  }

  if (!product) return null;

  const images = product.images || [];

  const findImageByColor = (color) => {
    const imgObj = images.find((img) => img.color === color);
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
      color: selectedColor,
    });
    alert('Added to cart!');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-70 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-lg w-full p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-700 hover:text-gray-900"
          aria-label="Close modal"
        >
          ×
        </button>
        <h2 className="text-xl font-semibold mb-4">{product.name}</h2>

        <img
          src={findImageByColor(selectedColor)}
          alt={product.name}
          className="w-full h-64 object-cover rounded mb-4"
        />

        <p className="mb-4 font-semibold text-lg">Price: ৳{product.price}</p>

        <div className="mb-4">
          <label className="block font-semibold mb-1" htmlFor="model-select">
            Model:
          </label>
          <select
            id="model-select"
            className="w-full border rounded px-3 py-2"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            {product.models?.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Color:</label>
          <div className="flex flex-wrap gap-2">
            {images.map(({ color }) => (
              <button
                key={color}
                className={`px-3 py-1 rounded border ${
                  selectedColor === color
                    ? 'border-orange-500 bg-orange-100'
                    : 'border-gray-300 hover:bg-gray-100'
                }`}
                onClick={() => setSelectedColor(color)}
              >
                {color || 'Default'}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-1">Quantity:</label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
              className="px-3 py-1 border rounded"
            >
              -
            </button>
            <span>{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="px-3 py-1 border rounded"
            >
              +
            </button>
          </div>
        </div>

        <button
          onClick={handleAddToCartClick}
          className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
