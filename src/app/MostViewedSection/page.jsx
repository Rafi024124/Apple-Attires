"use client";

import React, { useEffect, useState } from "react";
import CoverCard from "../components/CoverCard";


export default function MostViewedSection() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/most-viewed")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <section className="my-10 py-8 max-w-7xl mx-auto bg-gray-50">
      <div className="container mx-auto px-1">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-6">
           <h2 className="text-3xl font-semibold text-black mb-6 border-b-2 border-orange-500 inline-block pb-2 tracking-wide drop-shadow-md">
        Most Viewed Products
      </h2>
          
        </div>
        </div>
    <div className="grid grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-1  py-4">
        {products.map((item) => (
          <CoverCard key={item._id} item={item} />
        ))}
      </div>
    </section>
  );
}
