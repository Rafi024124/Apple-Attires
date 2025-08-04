'use client';

import { useEffect, useState } from 'react';
import CoverCard from '@/app/components/CoverCard';
import ProductDetailsModal from '@/app/components/ProductDetailsModal';
import Loading from './loading';

export default function SubcategoryProductsClient({ subcategory }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (subcategory) {
      fetch(`/api/covers?subCategory=${subcategory}`)
        .then((res) => res.json())
        .then((data) => {
          setProducts(data.covers || []);
        })
        .catch((err) => console.error('Error fetching covers:', err))
        .finally(() => setLoading(false));
    }
  }, [subcategory]);

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 capitalize">
        Products for {subcategory}
      </h1>

      {loading && <Loading />}

      {!loading && products.length === 0 && (
        <p className="text-red-500">No products found for this category.</p>
      )}

      {!loading && products.length > 0 && (
        <div className="grid grid-cols-12 max-w-6xl mx-auto gap-4 p-4">
          {products.map((item) => (
            <CoverCard key={item._id} item={item} onViewDetails={() => setSelectedProduct(item)} />
          ))}
        </div>
      )}

      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
