'use client';

import React, { useState, useEffect } from 'react';
import CoverCard from './CoverCard';
import ProductDetailsModal from './ProductDetailsModal';

export default function ServicesSection() {
  const [covers, setCovers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCoverType, setSelectedCoverType] = useState('');
  const [coverTypes, setCoverTypes] = useState([]);

  const [page, setPage] = useState(1);
  const limit = 6; // items per page
  const [totalCount, setTotalCount] = useState(0);

  // Fetch distinct cover types on mount
useEffect(() => {
  async function fetchCoverTypes() {
    try {
      const res = await fetch('/api/covers/types');
      if (!res.ok) throw new Error('Failed to fetch cover types');
      const data = await res.json();
      setCoverTypes(data.types || []);
    } catch (error) {
      console.error(error);
    }
  }
  fetchCoverTypes();
}, []);


  // Fetch covers when searchTerm, selectedCoverType or page changes
  useEffect(() => {
    async function fetchCovers() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (selectedCoverType) params.append('type', selectedCoverType);
        params.append('page', page.toString());
        params.append('limit', limit.toString());

        const url = `/api/covers?${params.toString()}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch covers');
        const data = await res.json();

        setCovers(data.covers);
        setTotalCount(data.totalCount);
      } catch (error) {
        console.error(error);
        alert('Failed to load covers');
      }
      setLoading(false);
    }
    fetchCovers();
  }, [searchTerm, selectedCoverType, page]);

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

  // Pagination helpers
  const totalPages = Math.ceil(totalCount / limit);
  const goPrev = () => {
    if (page > 1) setPage(page - 1);
  };
  const goNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <>
      <div className="max-w-6xl mx-auto p-4 flex flex-col md:flex-row gap-4 items-center">
        {/* Search input */}
        <input
          type="text"
          placeholder="Search covers by name, etc."
          className="flex-grow p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
        />

        {/* Cover Type Dropdown */}
        <div className="relative inline-block text-left">
          <label htmlFor="coverType" className="sr-only">Cover Type</label>
          <select
            id="coverType"
            value={selectedCoverType}
            onChange={(e) => {
              setSelectedCoverType(e.target.value);
              setPage(1);
            }}
            className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <option value="">All Cover Types</option>
            {coverTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-center p-10">Loading covers...</p>
      ) : (
        <>
          <div className="grid grid-cols-12 max-w-6xl mx-auto gap-4 p-4">
            {covers.length === 0 ? (
              <p className="col-span-12 text-center text-gray-500">No covers found.</p>
            ) : (
              covers.map((item) => (
                <CoverCard
                  key={item._id}
                  item={item}
                  onViewDetails={() => handleViewDetails(item._id)}
                />
              ))
            )}
          </div>

          {/* Pagination controls */}
          <div className="max-w-6xl mx-auto flex justify-center gap-4 mt-6">
            <button
              onClick={goPrev}
              disabled={page === 1}
              className="px-4 py-2 rounded bg-cyan-600 text-white hover:bg-cyan-700 disabled:opacity-50"
            >
              Prev
            </button>
            <span className="flex items-center px-2">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={goNext}
              disabled={page === totalPages}
              className="px-4 py-2 rounded bg-cyan-600 text-white hover:bg-cyan-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}

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
