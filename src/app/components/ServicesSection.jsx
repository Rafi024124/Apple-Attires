"use client";

import React, { useState, useEffect, useRef } from "react";
import CoverCard from "./CoverCard";
import ProductDetailsModal from "./ProductDetailsModal";
import Loading from "../categories/[subcategory]/loading";
import Image from "next/image";
import SkeletonCoverCard from "./SkeletonCoverCard";

export default function ServicesSection({ initialCovers = [], initialTotalCount = 0 }) {
  const [covers, setCovers] = useState(initialCovers);
  const [loading, setLoading] = useState(false); // false because we have initial data
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCoverType, setSelectedCoverType] = useState("");
  const [coverTypes, setCoverTypes] = useState([]);
  const [sortOption, setSortOption] = useState("default");
  const [page, setPage] = useState(1);
  const limit = 8;
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [mainCategory, setMainCategory] = useState("");

  // Debounced versions of filters to reduce fetch frequency
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [debouncedCoverType, setDebouncedCoverType] = useState("");
  const [debouncedSortOption, setDebouncedSortOption] = useState("default");
  const [debouncedMainCategory, setDebouncedMainCategory] = useState("");

  const abortControllerRef = useRef(null);
  const initialRender = useRef(true);

  // Fetch cover types once on mount
  useEffect(() => {
    async function fetchCoverTypes() {
      try {
        const res = await fetch("/api/covers/types");
        if (!res.ok) throw new Error("Failed to fetch cover types");
        const data = await res.json();
        setCoverTypes(data.types || []);
      } catch (error) {
        console.error(error);
      }
    }
    fetchCoverTypes();
  }, []);

  // Debounce handlers (unchanged)
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
    setSelectedCoverType("");
  }, [mainCategory]);

  // Fetch covers (unchanged)
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
        if (debouncedSearchTerm) params.append("search", debouncedSearchTerm);
        if (debouncedCoverType) params.append("type", debouncedCoverType);
        if (debouncedSortOption && debouncedSortOption !== "default")
          params.append("sort", debouncedSortOption);
        if (debouncedMainCategory) params.append("mainCategory", debouncedMainCategory);
        params.append("page", page.toString());
        params.append("limit", limit.toString());

        const res = await fetch(`/api/covers?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!res.ok) throw new Error("Failed to fetch covers");
        const data = await res.json();

        setCovers(data.covers);
        setTotalCount(data.totalCount);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error(error);
          alert("Failed to load covers");
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
  }, [debouncedSearchTerm, debouncedCoverType, debouncedSortOption, debouncedMainCategory, page]);

  async function handleViewDetails(id) {
    setLoadingDetails(true);
    try {
      const res = await fetch(`/api/covers/${id}`);
      if (!res.ok) throw new Error("Failed to fetch details");
      const data = await res.json();
      setSelectedProduct(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load details");
    }
    setLoadingDetails(false);
  }

  const totalPages = Math.ceil(totalCount / limit);

  const goPrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const goNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  // Button style helper
  const activeButtonClasses = "scale-110 ";
  const inactiveButtonClasses = " text-black";

  const handleTypeChange = (e) => {
    setSelectedCoverType(e.target.value);
    setSearchTerm("");
  };

  const handleCategoryClick = (category) => {
    setMainCategory(category);
    setSearchTerm("");
    setSelectedCoverType("");
    setPage(1);
  };

  return (
    <>
      {/* Buttons for mainCategory filter */}
      <div className="max-w-6xl text-xs mx-auto p-4 flex flex-wrap justify-center gap-6 mb-6">
        <div
          className={`cursor-pointer px-6 py-2 rounded  transition ${
            mainCategory === "Covers" ? activeButtonClasses : inactiveButtonClasses
          } hover:scale-105 hover:text-white`}
          onClick={() => handleCategoryClick("Covers")}
        >
          <Image
            src="/cases1.jpg"
            alt="Phone Cases"
            width={90}
            height={80}
            className="mb-2"
            style={{ aspectRatio: "1 / 1" }}
          />
          <p className="text-center">Phone Cases</p>
        </div>
        <div
          className={`cursor-pointer px-6 py-2 rounded  transition ${
            mainCategory === "Protectors" ? activeButtonClasses : inactiveButtonClasses
          } hover:scale-105 hover:text-white`}
          onClick={() => handleCategoryClick("Protectors")}
        >
          <Image
            src="/protector.png"
            alt="Glass Protectors"
            width={90}
            height={80}
            className="mb-2"
            style={{ aspectRatio: "1 / 1" }}
          />
          <p className="text-center">Glass Protectors</p>
        </div>
        <div
          className={`cursor-pointer px-6 py-2 rounded  transition ${
            mainCategory === "lense" ? activeButtonClasses : inactiveButtonClasses
          } hover:scale-105 hover:text-white`}
          onClick={() => handleCategoryClick("lense")}
        >
          <Image
            src="/lenss.jpg"
            alt="Lens Protectors"
            width={90}
            height={80}
            className="mb-2"
            style={{ aspectRatio: "1 / 1" }}
          />
          <p className="text-center">Lens Protectors</p>
        </div>
        <button
          className={`px-6 py-2 rounded font-semibold transition ${
            mainCategory === "" ? activeButtonClasses : inactiveButtonClasses
          }  hover:text-white`}
          onClick={() => handleCategoryClick("")}
        >
          All Products
        </button>
      </div>

      {/* Search, Filter, Sort */}
      <div className="max-w-6xl mx-auto p-4 flex flex-col gap-4 md:flex-row md:items-center md:gap-4">
        <input
          type="text"
          placeholder="Search covers by name, etc."
          className="w-full md:flex-grow p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#834F29]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {mainCategory === "Covers" && (
          <select
            value={selectedCoverType}
            onChange={(e) => {
              handleTypeChange(e);
              setPage(1);
            }}
            className="w-full md:w-auto p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#834F29]"
          >
            <option value="">All Cover Types</option>
            {coverTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        )}

        <select
          value={sortOption}
          onChange={(e) => {
            setSortOption(e.target.value);
            setPage(1);
          }}
          className="w-full md:w-auto p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#834F29]"
        >
          <option value="default">Sort By (Default)</option>
          <option value="name_asc">Name (A-Z)</option>
          <option value="name_desc">Name (Z-A)</option>
          <option value="price_asc">Price (Low → High)</option>
          <option value="price_desc">Price (High → Low)</option>
          <option value="model_asc">Model (A-Z)</option>
          <option value="model_desc">Model (Z-A)</option>
        </select>
      </div>

      {/* Products Grid */}
      {loading ? (
        <SkeletonCoverCard />
      ) : (
        <>
          <div className="grid grid-cols-2 bg-gray-100 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-6xl mx-auto gap-4 p-4">
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

          {/* Pagination */}
          <div className="max-w-6xl mx-auto flex justify-center gap-4 mt-6">
            <button
              onClick={goPrev}
              disabled={page === 1}
              className="px-4 py-2 rounded bg-orange-500 text-white  hover:bg-orange-600 disabled:opacity-50"
            >
              Prev
            </button>
            <span className="flex items-center px-2">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={goNext}
              disabled={page === totalPages}
              className="px-4 py-2 rounded bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Loading details */}
      {loadingDetails && <Loading />}

      {/* Modal */}
      {selectedProduct && !loadingDetails && (
        <ProductDetailsModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </>
  );
}
