'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

export default function CoverDetails() {
  const params = useParams();
  const { id } = params;

  const [cover, setCover] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // For image gallery
  const [mainIndex, setMainIndex] = useState(0);
  const mainImageRef = useRef(null);
  const zoomLensRef = useRef(null);

  useEffect(() => {
    if (!id) return;

    async function fetchCover() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/covers/${id}`);
        if (!res.ok) throw new Error('Failed to fetch cover details');
        const data = await res.json();
        setCover(data);
      } catch (err) {
        setError(err.message || 'Unknown error');
      }
      setLoading(false);
      setMainIndex(0);
    }

    fetchCover();
  }, [id]);

  // Zoom effect handlers
  function handleMouseMove(e) {
    if (!mainImageRef.current || !zoomLensRef.current) return;

    const rect = mainImageRef.current.getBoundingClientRect();
    const lens = zoomLensRef.current;
    const zoomFactor = 50; // zoom scale

    // Calculate cursor position relative to image
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    // Clamp to image bounds
    if (x < 0) x = 0;
    if (y < 0) y = 0;
    if (x > rect.width) x = rect.width;
    if (y > rect.height) y = rect.height;

    // Move lens background to simulate zoom sliding
    const bgX = (x / rect.width) * 100;
    const bgY = (y / rect.height) * 100;

    // Position zoom lens centered on cursor (lens size is 100x100)
    const lensSize = 150;
    let lensX = x - lensSize / 2;
    let lensY = y - lensSize / 2;

    // Clamp lens inside image
    if (lensX < 0) lensX = 0;
    if (lensY < 0) lensY = 0;
    if (lensX + lensSize > rect.width) lensX = rect.width - lensSize;
    if (lensY + lensSize > rect.height) lensY = rect.height - lensSize;

    lens.style.left = lensX + 'px';
    lens.style.top = lensY + 'px';
    lens.style.backgroundPosition = `${bgX}% ${bgY}%`;
  }

  function handleMouseEnter() {
    if (zoomLensRef.current) zoomLensRef.current.style.display = 'block';
  }
  function handleMouseLeave() {
    if (zoomLensRef.current) zoomLensRef.current.style.display = 'none';
  }

  if (loading) return <p className="p-4 text-center">Loading cover details...</p>;
  if (error) return <p className="p-4 text-center text-red-500">Error: {error}</p>;
  if (!cover) return <p className="p-4 text-center">No cover found.</p>;

  const {
    name,
    price,
    images = [],
    tag,
    models = [],
    isAvailable,
    isFeatured,
    createdAt,
    type,
    gender,
  } = cover;

  // If no images, fallback to placeholder
  const imgs = images.length ? images : ['/fallback.jpg'];

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{name}</h1>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Left: Images */}
        <div className="flex flex-col items-center md:items-start w-full md:w-1/2">
          {/* Main Image container */}
          <div
            className="relative w-[400px] h-[400px] overflow-hidden border rounded-md cursor-zoom-in"
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            ref={mainImageRef}
            style={{ position: 'relative' }}
          >
            <Image
              src={imgs[mainIndex]}
              alt={`${name} main image`}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, 400px"
              unoptimized
            />
            {/* Zoom lens */}
            <div
              ref={zoomLensRef}
              className="absolute border border-gray-400 rounded-md shadow-lg"
              style={{
                display: 'none',
                width: '200px',
                height: '200px',
                position: 'absolute',
                pointerEvents: 'none',
                backgroundImage: `url(${imgs[mainIndex]})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: '500% 500%',
                zIndex: 50,
              }}
            />
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 mt-4 overflow-x-auto">
            {imgs.map((src, i) => (
              <button
                key={i}
                onClick={() => setMainIndex(i)}
                className={`w-20 h-28 rounded-md overflow-hidden border-2 ${
                  i === mainIndex ? 'border-cyan-500' : 'border-transparent'
                }`}
                aria-label={`Select image ${i + 1}`}
              >
                <Image
                  src={src}
                  alt={`${name} thumbnail ${i + 1}`}
                  width={80}
                  height={112}
                  style={{ objectFit: 'cover' }}
                  unoptimized
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Details */}
        <div className="flex-1 space-y-4">
          <p className="text-xl font-semibold text-red-600">৳{price}</p>

          {tag && (
            <p className="inline-block bg-yellow-300 text-black px-3 py-1 rounded-full text-sm font-medium">
              {tag}
            </p>
          )}

          <div>
            <strong>Type:</strong> {type || 'N/A'}
          </div>

          <div>
            <strong>Gender:</strong> {gender || 'N/A'}
          </div>

          <div>
            <strong>Model Compatibility:</strong> {models.length ? models.join(', ') : 'N/A'}
          </div>

          <div>
            <strong>Status:</strong> {isAvailable ? 'Available' : 'Out of Stock'}
          </div>

          <div>
            <strong>Featured:</strong> {isFeatured ? 'Yes' : 'No'}
          </div>

          <div>
            <strong>Created At:</strong> {new Date(createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}
