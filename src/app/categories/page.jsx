'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

const categories = [
  { name: 'iPhone', image: '/iphone.png' },
  { name: 'Galaxy', image: '/samsung.png' },
  { name: 'AirPods', image: '/airpods.png' },
  { name: 'Macbook', image: '/mac.png' },
  { name: 'Apple Watch', image: '/watch.png' },
  { name: 'iPad', image: '/ipad.png' },
];

export default function CategoryPage() {
  const router = useRouter();

  const handleClick = (name) => {
    const subCategory = name.toLowerCase();
    router.push(`/categories/${subCategory}`);
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-100 text-center">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Pick Your Device</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6 justify-center mb-10">
        {categories.map(({ name, image }) => (
          <div
            key={name}
            onClick={() => handleClick(name)}
            className="cursor-pointer flex flex-col items-center transition-transform hover:scale-105"
          >
            <Image src={image} alt={name} width={80} height={80} className="mb-2" />
            <p className="font-semibold text-gray-700">{name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
