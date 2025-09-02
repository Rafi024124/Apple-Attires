"use client";

import React from "react";

export default function ProductDetailsModal({ product, onClose }) {
  if (!product) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 dark:hover:text-white text-xl font-bold"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Product Title */}
        <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">{product.name}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Images Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Images</h3>
            <div className="flex flex-wrap gap-3">
              {product.images?.map(({ url, color }, idx) => (
                <div
                  key={idx}
                  className="relative w-28 h-28 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 shadow-sm"
                >
                  <img src={url} alt={`Image ${idx + 1}`} className="object-cover w-full h-full" />
                  {color && (
                    <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white text-xs px-1 rounded-br">
                      {color}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-3">
            <p className="text-gray-800 dark:text-gray-100">
              <span className="font-semibold">Price:</span> ৳{product.price}
              {product.discount && product.discount !== "0" && (
                <span className="ml-2 text-red-600 font-medium">({product.discount}% OFF)</span>
              )}
            </p>
            <p className="text-gray-800 dark:text-gray-100">
              <span className="font-semibold">Stock Count:</span> {product.stockCount || "N/A"}
            </p>
            <p className="text-gray-800 dark:text-gray-100">
              <span className="font-semibold">Category:</span> {product.mainCategory} / {product.subCategory}
            </p>
            <p className="text-gray-800 dark:text-gray-100">
              <span className="font-semibold">Type:</span> {product.type || "N/A"}
            </p>
            <p className="text-gray-800 dark:text-gray-100">
              <span className="font-semibold">Gender:</span> {product.gender || "N/A"}
            </p>
            <p className="text-gray-800 dark:text-gray-100">
              <span className="font-semibold">Models:</span> {product.models?.join(", ") || "N/A"}
            </p>
            <p className="text-gray-800 dark:text-gray-100">
              <span className="font-semibold">Colors:</span> {product.colors || "N/A"}
            </p>
            <p className="text-gray-800 dark:text-gray-100">
              <span className="font-semibold">Tag:</span> {product.tag || "N/A"}
            </p>
            <p className="text-gray-800 dark:text-gray-100">
              <span className="font-semibold">Featured:</span> {product.isFeatured ? "Yes" : "No"}
            </p>
            <p className="text-gray-800 dark:text-gray-100">
              <span className="font-semibold">Available:</span> {product.isAvailable ? "Yes" : "No"}
            </p>
            <p className="text-gray-800 dark:text-gray-100">
              <span className="font-semibold">Slug:</span> {product.slug}
            </p>

            {/* Description */}
            <div className="mt-2">
              <span className="font-semibold text-gray-700 dark:text-gray-200">Description:</span>
              <p className="mt-1 whitespace-pre-wrap text-gray-800 dark:text-gray-100">{product.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
