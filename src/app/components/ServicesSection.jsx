'use client';

import React, { useState, useEffect, useRef } from 'react';
import CoverCard from './CoverCard';
import ProductDetailsModal from './ProductDetailsModal';
import SkeletonCoverCard from './SkeletonCoverCard';
import CartDrawer from './cartDrawer/page';

export default function ServicesSection({ initialCovers = [], initialTotalCount = 0 }) {
  const [covers, setCovers] = useState(initialCovers);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCoverType, setSelectedCoverType] = useState('');
  const [coverTypes, setCoverTypes] = useState([]);
  const [sortOption, setSortOption] = useState('default');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [mainCategory, setMainCategory] = useState('');

  const [layoutView, setLayoutView] = useState('grid-4');

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [debouncedCoverType, setDebouncedCoverType] = useState('');
  const [debouncedSortOption, setDebouncedSortOption] = useState('default');
  const [debouncedMainCategory, setDebouncedMainCategory] = useState('');
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
const [cartItem, setCartItem] = useState(null);
const handleAddToCart = async (item) => {
  try {
    // 1️⃣ Fetch the updated item from the server
    const res = await fetch(`/api/covers/${item._id}`);
    if (!res.ok) throw new Error('Failed to fetch updated cover');
    const updatedItem = await res.json();

    // 2️⃣ Update your covers array in the grid
    setCovers((prev) =>
      prev.map((c) => (c._id === updatedItem._id ? updatedItem : c))
    );

    // 3️⃣ Then open the cart with the updated item
    setCartItem(updatedItem);
    setCartDrawerOpen(true);
  } catch (err) {
    console.error(err);
    alert('Failed to add to cart');
  }
};



  const abortControllerRef = useRef(null);
  const initialRender = useRef(true);

useEffect(() => {
  async function fetchCovers() {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearchTerm) params.append('search', debouncedSearchTerm);
      if (debouncedCoverType) params.append('type', debouncedCoverType);
      if (debouncedSortOption && debouncedSortOption !== 'default') {
        params.append('sort', debouncedSortOption);
      }
      if (debouncedMainCategory) params.append('mainCategory', debouncedMainCategory);
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const res = await fetch(`/api/covers?${params.toString()}`, {
        signal: controller.signal,
      });

      if (!res.ok) throw new Error('Failed to fetch covers');
      const data = await res.json();
      setCovers(data.covers);
      setTotalCount(data.totalCount);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error(error);
        alert('Failed to load covers');
      }
    } finally {
      setLoading(false);
    }
  }

  fetchCovers();

  return () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };
}, [
  debouncedSearchTerm,
  debouncedCoverType,
  debouncedSortOption,
  debouncedMainCategory,
  page,
  limit,
]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCoverType(selectedCoverType);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [selectedCoverType]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSortOption(sortOption);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [sortOption]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedMainCategory(mainCategory);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [mainCategory]);

  useEffect(() => {
    setSelectedCoverType('');
  }, [mainCategory]);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    async function fetchCovers() {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (debouncedSearchTerm) params.append('search', debouncedSearchTerm);
        if (debouncedCoverType) params.append('type', debouncedCoverType);
        if (debouncedSortOption && debouncedSortOption !== 'default') {
          params.append('sort', debouncedSortOption);
        }
        if (debouncedMainCategory) params.append('mainCategory', debouncedMainCategory);
        params.append('page', page.toString());
        params.append('limit', limit.toString());

        const res = await fetch(`/api/covers?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!res.ok) throw new Error('Failed to fetch covers');
        const data = await res.json();
        setCovers(data.covers);
        setTotalCount(data.totalCount);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error(error);
          alert('Failed to load covers');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchCovers();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [
    debouncedSearchTerm,
    debouncedCoverType,
    debouncedSortOption,
    debouncedMainCategory,
    page,
    limit,
  ]);

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
    console.log("selected product", selectedProduct);
    
  }

  const totalPages = Math.ceil(totalCount / limit);

  const goPrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const goNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const activeButtonClasses = 'scale-110 bg-orange-500 text-white shadow-lg';
  const inactiveButtonClasses = 'bg-gray-100 text-gray-700 hover:bg-orange-100';

  const handleTypeChange = (e) => {
    setSelectedCoverType(e.target.value);
    setSearchTerm('');
  };

  const handleStockUpdate = async (id) => {
  try {
    const res = await fetch(`/api/covers/${id}`);
    if (!res.ok) throw new Error('Failed to fetch cover');
    const updatedCover = await res.json();
    setCovers((prev) => prev.map((c) => (c._id === id ? updatedCover : c)));
  } catch (err) {
    console.error(err);
  }
};
  const handleCategoryClick = (category) => {
    setMainCategory(category);
    setSearchTerm('');
    setSelectedCoverType('');
    setPage(1);
  };

  return (
    <>
    {/* Category Buttons */}
<div className="max-w-7xl mx-auto px-4 flex flex-wrap gap-2 mb-4">
 <CartDrawer
  open={cartDrawerOpen}
  item={cartItem}
  onClose={() => setCartDrawerOpen(false)}
/>


  {['All Products', 'covers', 'protectors', 'accessories'].map((category) => (
    <button
      key={category}
      onClick={() => handleCategoryClick(category === 'All Products' ? '' : category)}
      className={`px-3 py-2 rounded border text-sm font-semibold
        ${mainCategory === category || (category === 'All Products' && mainCategory === '')
          ? 'bg-orange-500 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-orange-100'
        }`}
    >
      {category}
    </button>
  ))}
</div>
      {/* Top Controls */}
      <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center gap-3 justify-between mb-4">
        {/* Left group: Search + filter + sort */}
        <div className="flex flex-wrap gap-2 items-center flex-grow min-w-[240px]">
          <input
            type="text"
            placeholder="Search covers by name, etc."
            className="px-3 py-2 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 flex-grow min-w-[120px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {mainCategory === 'Covers' && (
            <select
              value={selectedCoverType}
              onChange={handleTypeChange}
              className="px-3 py-2 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">All Cover Types</option>
              {coverTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          )}

          <label htmlFor="sortBy" className="text-sm font-semibold ml-2 hidden sm:inline">
            Sort By:
          </label>
          <select
            id="sortBy"
            value={sortOption}
            onChange={(e) => {
              setSortOption(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="default">Default</option>
            <option value="name_asc">Name (A-Z)</option>
            <option value="name_desc">Name (Z-A)</option>
            <option value="price_asc">Price (Low → High)</option>
            <option value="price_desc">Price (High → Low)</option>
            <option value="model_asc">Model (A-Z)</option>
            <option value="model_desc">Model (Z-A)</option>
          </select>
        </div>

        {/* Right group: Layout buttons + limit dropdown */}
        <div className="flex items-center gap-3 mt-2 sm:mt-0">
          {/* Desktop Layout Buttons */}
          <div className="hidden sm:flex items-center gap-1 border border-gray-300 rounded overflow-hidden select-none">
            {['grid-2', 'grid-3', 'grid-4', 'list'].map((layout, idx) => (
              <button
                key={layout}
                onClick={() => setLayoutView(layout)}
                className={`px-3 py-1 text-sm ${
                  layoutView === layout ? activeButtonClasses : inactiveButtonClasses
                }`}
                title={layout}
              >
                {layout === 'list' ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  layout.split('-')[1]
                )}
              </button>
            ))}
          </div>

          {/* Mobile Layout Buttons */}
          <div className="flex sm:hidden items-center gap-1 border border-gray-300 rounded overflow-hidden select-none">
            {['grid-1', 'grid-2', 'list'].map((layout) => (
              <button
                key={layout}
                onClick={() => setLayoutView(layout)}
                className={`px-3 py-1 text-sm ${
                  layoutView === layout ? activeButtonClasses : inactiveButtonClasses
                }`}
                title={layout}
              >
                {layout === 'list' ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  layout.split('-')[1]
                )}
              </button>
            ))}
          </div>

          {/* Show Limit Dropdown */}
          <div className="flex items-center gap-1">
            <label htmlFor="limitSelect" className="text-sm font-semibold mr-1 hidden sm:inline">
              Show:
            </label>
            <select
              id="limitSelect"
              value={limit}
              onChange={(e) => {
                setLimit(parseInt(e.target.value, 10));
                setPage(1);
              }}
              className="px-2 py-1 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {[10, 20, 25, 50, 100].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid/List view */}
      <div
        className={`grid gap-4 px-4 max-w-7xl mx-auto ${
          layoutView.includes('grid')
            ? layoutView === 'grid-1'
              ? 'grid-cols-1'
              : layoutView === 'grid-2'
              ? 'grid-cols-2'
              : layoutView === 'grid-3'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
            : 'flex flex-col'
        }`}
      >
        {loading
          ? Array.from({ length: limit }).map((_, i) => <SkeletonCoverCard key={i} />)
          : covers.map((item) => (
              <CoverCard key={item._id} 
              onAddToCart={() => handleAddToCart(item)}
              item={item} onViewDetails={handleViewDetails} layout={layoutView} />
            ))}
        {!loading && covers.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            No covers found!
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-3 mt-6">
        <button
          onClick={goPrev}
          disabled={page === 1}
          className="px-4 py-2 bg-orange-500 text-white rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-sm font-semibold text-gray-700">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={goNext}
          disabled={page === totalPages}
          className="px-4 py-2 bg-orange-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          loading={loadingDetails}
        />
      )}
    </>
  );
}
