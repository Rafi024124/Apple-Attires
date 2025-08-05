'use client';

import React from 'react';

export default function SkeletonCoverCard() {
  return (
    <div className="relative col-span-1 p-3 bg-white rounded-xl shadow-md animate-pulse flex flex-col">
      {/* Image Skeleton */}
      <div className="w-full h-44 md:h-48 rounded-lg bg-gray-200 mb-4" />

      {/* Title */}
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />

      {/* Price */}
      <div className="h-4 bg-red-200 rounded w-1/3 mb-3" />

      {/* Buttons Row */}
      <div className="mt-auto flex justify-between items-center">
        <div className="h-8 w-24 bg-gray-300 rounded" />
        <div className="h-8 w-10 bg-gray-300 rounded" />
      </div>
    </div>
  );
}
