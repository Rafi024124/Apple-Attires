"use client";

import React from "react";

export default function ProductDetailsModal({ product, onClose }) {
  if (!product) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 dark:hover:text-white"
          aria-label="Close modal"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4">{product.name}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Images */}
          <div className="space-y-2">
            <h3 className="font-semibold">Images</h3>
            <div className="flex flex-wrap gap-2">
              {product.images?.map(({ url, color }, idx) => (
                <div key={idx} className="relative w-24 h-24 rounded overflow-hidden border border-gray-300">
                  <img
                    src={url}
                    alt={`Image ${idx + 1}`}
                    className="object-cover w-full h-full"
                  />
                  {color && (
                    <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white text-xs px-1 rounded-br">
                      {color}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Price:</span> ${product.price}
              {product.discount && product.discount !== "0" && (
                <span className="ml-2 text-red-600">({product.discount}% off)</span>
              )}
            </p>
            <p><span className="font-semibold">Stock Count:</span> {product.stockCount}</p>
            <p><span className="font-semibold">Category:</span> {product.mainCategory} / {product.subCategory}</p>
            <p><span className="font-semibold">Type:</span> {product.type}</p>
            <p><span className="font-semibold">Gender:</span> {product.gender}</p>
            <p><span className="font-semibold">Models:</span> {product.models?.join(", ")}</p>
            <p><span className="font-semibold">Colors:</span> {product.colors || "N/A"}</p>
            <p><span className="font-semibold">Tag:</span> {product.tag || "N/A"}</p>
            <p><span className="font-semibold">Featured:</span> {product.isFeatured ? "Yes" : "No"}</p>
            <p><span className="font-semibold">Available:</span> {product.isAvailable ? "Yes" : "No"}</p>
            <p><span className="font-semibold">Slug:</span> {product.slug}</p>
            <p><span className="font-semibold">Description:</span></p>
            <p className="whitespace-pre-wrap">{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
