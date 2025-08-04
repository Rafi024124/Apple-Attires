'use client';

import React from 'react';

export default function SkeletonCoverCard() {
  // Create an array of 6 placeholders
  const placeholders = Array(6).fill(0);

  return (
    <div className="grid grid-cols-12 max-w-6xl mx-auto gap-4 p-4">
      {placeholders.map((_, index) => (
        <div
          key={index}
          className="relative col-span-12 md:col-span-6 lg:col-span-4 p-3 bg-white rounded-xl shadow-md animate-pulse flex flex-col"
        >
          {/* Image Skeleton */}
          <div className="w-full h-44 md:h-48 rounded-lg bg-gray-200 mb-4" />

          {/* Title */}
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />

          {/* Price */}
          <div className="h-4 bg-red-200 rounded w-1/3 mb-3" />

          {/* Gender + Type tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="h-5 w-16 bg-gray-200 rounded" />
            <div className="h-5 w-20 bg-gray-200 rounded" />
          </div>

          {/* Buttons Row */}
          <div className="mt-auto flex justify-between items-center">
            <div className="h-8 w-24 bg-gray-300 rounded" />
            <div className="h-8 w-10 bg-gray-300 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
