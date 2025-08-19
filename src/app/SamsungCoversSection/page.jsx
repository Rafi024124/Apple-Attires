'use client';

import { useEffect, useState } from 'react';
import SkeletonCoverCard from '../components/SkeletonCoverCard';
import CoverCard from '../components/CoverCard';


export default function SamsungCoversSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/covers?mainCategory=covers&subCategory=samsung`)
      .then(res => res.json())
      .then(data => setProducts(data.covers || []))
      .catch(err => console.error('Error fetching Samsung covers:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="min-h-screen py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-2">
      <h2 className="text-3xl font-semibold mb-6 border-b-2 border-blue-500 inline-block pb-2 tracking-wide drop-shadow-md">
        Samsung Covers
      </h2>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => <SkeletonCoverCard key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-blue-400 text-lg font-semibold py-10">
          No Samsung covers found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-8">
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
