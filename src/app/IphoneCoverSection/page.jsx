'use client';

import { useEffect, useState } from 'react';
import CoverCard from '../components/CoverCard';
import SkeletonCoverCard from '../components/SkeletonCoverCard';



export default function IphoneCoversSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/covers?mainCategory=covers&subCategory=iphone`)
      .then(res => res.json())
      .then(data => setProducts(data.covers || []))
      .catch(err => console.error('Error fetching iPhone covers:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="my-10 py-12 max-w-7xl mx-auto px-2 sm:px-6 lg:px-2 bg-gray-50">
       <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-6">
           <h2 className="text-3xl font-semibold text-black mb-6 border-b-2 border-orange-500 inline-block pb-2 tracking-wide drop-shadow-md">
        Iphone Cases
      </h2>
          
        </div>
        </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => <SkeletonCoverCard key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-orange-400 text-lg font-semibold py-10">
          No iPhone covers found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-8 p-4">
          {products.map(item => (
            <CoverCard
              key={item._id}
              item={item}
              className="transform transition-transform duration-300 hover:scale-[1.05] hover:shadow-lg"
            />
          ))}
        </div>
      )}
    </section>
  );
}
