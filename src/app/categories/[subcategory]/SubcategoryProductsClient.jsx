'use client';

import { useEffect, useState } from 'react';
import CoverCard from '@/app/components/CoverCard';
import ProductDetailsModal from '@/app/components/ProductDetailsModal';
import SkeletonCoverCard from '@/app/components/SkeletonCoverCard';

export default function SubcategoryProductsClient({ subcategory }) {
  const [products, setProducts] = useState([]);
  const [protectors, setProtectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingProtectors, setLoadingProtectors] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (subcategory) {
      setLoading(true);
      fetch(`/api/covers?mainCategory=covers&subCategory=${subcategory}`)
        .then((res) => res.json())
        .then((data) => {
          setProducts(data.covers || []);
        })
        .catch((err) => console.error('Error fetching covers:', err))
        .finally(() => setLoading(false));
    }
  }, [subcategory]);
 console.log(subcategory);
 
  useEffect(() => {
    if (subcategory) {
      setLoadingProtectors(true);
      const query = new URLSearchParams({
        mainCategory: 'protectors',
        subCategory: subcategory,
      });
      fetch(`/api/covers?${query.toString()}`)
        .then((res) => res.json())
        .then((data) => {
          setProtectors(data.covers || []);
        })
        .catch((err) => console.error('Error fetching protectors:', err))
        .finally(() => setLoadingProtectors(false));
    } else {
      setLoadingProtectors(false);
    }
  }, [subcategory]);

  return (
    <div className="min-h-screen py-12 bg-gradient-to-tr  max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      

      {/* PRODUCTS GRID */}
      <section aria-labelledby="covers-heading" className="mb-20">
        <h2 id="covers-heading" className="text-3xl font-semibold text-black mb-6 border-b-2 border-orange-500 inline-block pb-2 tracking-wide drop-shadow-md">
          Phone Covers
        </h2>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <SkeletonCoverCard key={i} />
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <p className="text-center text-orange-400 text-lg font-semibold py-10">
            No phone covers found for this category.
          </p>
        )}

        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-8 bg-gray-100 p-3">
            {products.map((item) => (
              <CoverCard
                key={item._id}
                item={item}
                onViewDetails={() => setSelectedProduct(item)}
                className="transform transition-transform duration-300 hover:scale-[1.05] hover:shadow-lg"
              />
            ))}
          </div>
        )}
      </section>

      {/* PROTECTORS GRID */}
      <section aria-labelledby="protectors-heading" className="mb-20">
        {loadingProtectors && (
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-8">
            {[...Array(6)].map((_, i) => (
              <SkeletonCoverCard key={i} />
            ))}
          </div>
        )}

        {!loadingProtectors && protectors.length > 0 && (
          <>
            <h2
              id="protectors-heading"
              className="text-3xl font-semibold mb-6 border-b-2 border-yellow-400 inline-block pb-2 tracking-wide drop-shadow-md"
            >
              Screen Protectors
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-8 bg-gray-100 p-3">
              {protectors.map((item) => (
                <CoverCard
                  key={item._id}
                  item={item}
                  onViewDetails={() => setSelectedProduct(item)}
                  className="transform transition-transform duration-300 hover:scale-[1.05] hover:shadow-lg"
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* PRODUCT DETAILS MODAL */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          className="backdrop-blur-sm bg-black/70"
        />
      )}
    </div>
  );
}
