'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import CoverCard from '@/app/components/CoverCard';
import ProductDetailsModal from '@/app/components/ProductDetailsModal';
import Loading from './loading';
import SkeletonCoverCard from '@/app/components/SkeletonCoverCard';

export default function SubcategoryProductsClient({ subcategory }) {
  

 
  const [products, setProducts] = useState([]);
  const [protectors, setProtectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingProtectors, setLoadingProtectors] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

 useEffect(() => {
  if (subcategory) {
    fetch(`/api/covers?mainCategory=Covers&subCategory=${subcategory}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.covers || []);
      })
      .catch((err) => console.error('Error fetching covers:', err))
      .finally(() => setLoading(false));
  }
}, [subcategory]);


useEffect(() => {
  if (subcategory) {
    const query = new URLSearchParams({
      mainCategory: 'Protectors',
      subCategory: subcategory, // <-- Capital 'C' is important
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
    <div className="min-h-screen  py-8 bg-gray-50 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 capitalize">
  Covers for {subcategory?.toUpperCase()}
</h1>


      {loading && <SkeletonCoverCard></SkeletonCoverCard>}

      {!loading && products.length === 0 && (
        <p className="text-red-500">No products found for this category.</p>
      )}

      {!loading && products.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-6xl mx-auto gap-4 p-4">
          {products.map((item) => (
            <CoverCard
              key={item._id}
              item={item}
              onViewDetails={() => setSelectedProduct(item)}
            />
          ))}
        </div>
      )}

      {/* ========== NEW SECTION FOR BRAND PROTECTORS ========== */}
      

      {loadingProtectors && <SkeletonCoverCard></SkeletonCoverCard>}

      {!loadingProtectors && protectors.length === 0 && (
        <></>
      )}

      {!loadingProtectors && protectors.length > 0 && (
       
       <>
        <h2 className="text-2xl font-bold mt-16 mb-6 text-gray-800">
        Protectors for {subcategory?.toUpperCase()}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-6xl mx-auto gap-4 p-4">
         
          {protectors.map((item) => (
            <CoverCard
              key={item._id}
              item={item}
              onViewDetails={() => setSelectedProduct(item)}
            />
          ))}
        </div>
       </>
       
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
