"use client";

import React from "react";

export default function CoverDetailsSkeleton() {
  return (
    <div className="max-w-5xl mx-auto p-6 animate-pulse">
      <div className="h-8 bg-gray-300 rounded w-1/3 mb-6" />

      <div className="flex flex-col md:flex-row gap-10">
        {/* Image Section */}
        <div className="w-full md:w-1/2 space-y-4">
          <div className="relative w-[400px] h-[400px] bg-gray-300 rounded-md" />

          <div className="flex gap-3 mt-4 overflow-x-auto">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="w-20 h-28 rounded bg-gray-300"
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 space-y-4">
          <div className="h-6 w-24 bg-gray-300 rounded" />

          <div className="h-4 w-20 bg-gray-300 rounded" />

          <div className="flex items-center gap-2">
            <div className="h-4 w-12 bg-gray-300 rounded" />
            <div className="h-8 w-32 bg-gray-300 rounded" />
          </div>

          <div className="flex items-center gap-2">
            <div className="h-4 w-16 bg-gray-300 rounded" />
            <div className="flex gap-2">
              <div className="h-8 w-8 bg-gray-300 rounded" />
              <div className="h-6 w-6 bg-gray-300 rounded" />
              <div className="h-8 w-8 bg-gray-300 rounded" />
            </div>
          </div>

          <div className="h-10 w-40 bg-gray-300 rounded" />

          <hr />

          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-4 w-48 bg-gray-300 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}
