'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function CoverCard({ item, onViewDetails }) {
  const { name, images = [], price, gender, type } = item;

  const [hovering, setHovering] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (hovering && images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 500);
    } else {
      clearInterval(intervalRef.current);
      setCurrentIndex(0);
    }
    return () => clearInterval(intervalRef.current);
  }, [hovering, images.length]);

  const genderColor =
    gender === 'Ladies'
      ? 'bg-pink-200 text-pink-800'
      : gender === 'Unisex'
      ? 'bg-blue-100 text-blue-800'
      : 'bg-gray-200 text-gray-800';

  const typeColor =
    type === 'Silicon'
      ? 'bg-green-100 text-green-700'
      : type === 'AG'
      ? 'bg-yellow-100 text-yellow-700'
      : type === 'Transparent'
      ? 'bg-purple-100 text-purple-700'
      : 'bg-gray-100 text-gray-700';

  return (
    <div
      className="col-span-12 md:col-span-6 lg:col-span-4 p-4 bg-white rounded shadow cursor-pointer flex flex-col"
      onClick={onViewDetails}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="relative w-full h-48">
        <Image
          src={images[currentIndex] || images[0] || '/fallback.jpg'}
          alt={name}
          fill
          className="rounded object-contain"
          unoptimized
          sizes="(max-width: 768px) 100vw, 314px"
        />
      </div>

      <h3 className="font-semibold mt-4 text-lg">{name}</h3>
      <p className="text-red-500 font-semibold">৳{price}</p>

      <div className="flex flex-wrap gap-2 mt-2">
        <span className={`px-2 py-1 rounded text-xs font-medium ${genderColor}`}>
          {gender}
        </span>
        <span className={`px-2 py-1 rounded text-xs font-medium ${typeColor}`}>
          {type}
        </span>
      </div>

      <p className="text-orange-500 font-semibold mt-2">View Details →</p>
    </div>
  );
}
