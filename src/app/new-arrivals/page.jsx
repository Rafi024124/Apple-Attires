'use client';

import React, { useEffect, useState } from 'react';

import Link from 'next/link';
import CoverCard from '../components/CoverCard';

export default function NewArrivalsSection() {
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch new arrivals
  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const res = await fetch('/api/new-arrivals');
        if (!res.ok) throw new Error('Failed to fetch new arrivals');
        const data = await res.json();
        setNewArrivals(data.newArrivals || []);
      } catch (error) {
        console.error('Error fetching new arrivals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            New Arrivals
          </h2>
          <Link
            href="/covers?sort=createdAt_desc"
            className="text-orange-500 hover:underline text-sm"
          >
            View All
          </Link>
        </div>

        {/* Loading State */}
        {loading ? (
          <p className="text-gray-500 text-center">Loading new arrivals...</p>
        ) : newArrivals.length === 0 ? (
          <p className="text-gray-500 text-center">No new arrivals yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-4 gap-4">
            {newArrivals.map((item) => (
              <CoverCard
                key={item._id}
                item={item}
                onViewDetails={(id) => {
                  window.location.href = `/covers/${id}`;
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
