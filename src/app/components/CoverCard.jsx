'use client';

import Image from 'next/image';

export default function CoverCard({ item, onViewDetails }) {
  const { name, image, price } = item;

  return (
    <div
      className="col-span-12 md:col-span-6 lg:col-span-4 p-4 bg-white rounded shadow hover:scale-105 transition-transform cursor-pointer"
      onClick={onViewDetails}
    >
      <Image
        src={image}
        alt={name}
        width={314}
        height={200}
        className="rounded object-contain"
      />
      <h3 className="font-semibold mt-2 text-lg">{name}</h3>
      <p className="text-red-500 font-semibold">৳{price}</p>
      <p className="text-orange-500 font-semibold mt-2">View Details →</p>
    </div>
  );
}
