'use client';

import React, { useState, useEffect } from 'react';
import CoverCard from './CoverCard';
import ProductDetailsModal from './ProductDetailsModal';

export default function ServicesSection() {
  const [covers, setCovers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    async function fetchCovers() {
      try {
        const res = await fetch('/api/covers');
        if (!res.ok) throw new Error('Failed to fetch covers');
        const data = await res.json();
        setCovers(data);
      } catch (error) {
        console.error(error);
        alert('Failed to load covers');
      }
      setLoading(false);
    }
    fetchCovers();
  }, []);

  async function handleViewDetails(id) {
    setLoadingDetails(true);
    try {
      const res = await fetch(`/api/covers/${id}`);
      if (!res.ok) throw new Error('Failed to fetch details');
      const data = await res.json();
      setSelectedProduct(data);
    } catch (error) {
      console.error(error);
      alert('Failed to load details');
    }
    setLoadingDetails(false);
  }

  if (loading) return <p className="text-center p-10">Loading covers...</p>;

  return (
    <>
      <div className="grid grid-cols-12 max-w-6xl mx-auto gap-4 p-4">
        {covers.map(item => (
          <CoverCard
            key={item._id}
            item={item}
            onViewDetails={() => handleViewDetails(item._id)}
          />
        ))}
      </div>

      {loadingDetails && <p className="text-center p-4">Loading details...</p>}

      {selectedProduct && !loadingDetails && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
}
