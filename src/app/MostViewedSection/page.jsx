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
    <section className="my-10 max-w-7xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Most Viewed Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((item) => (
          <CoverCard key={item._id} item={item} />
        ))}
      </div>
    </section>
  );
}
