'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

const categories = [
  { name: 'iphone', image: '/iphone1.png' },
  { name: 'samsung', image: '/samsung.png'},
  { name: 'airpods', image: '/airpods.png' },
  { name: 'macbook', image: '/mac.png'},
  { name: 'apple-watch', image: '/watch.png' },
  { name: 'ipad', image: '/ipad.png' },
];

export default function CategoryPage() {
  const router = useRouter();

 const handleClick = (name) => {
  const subCategory = name.toLowerCase();
  router.push(`/categories/${subCategory}`);
};


  return (
    <div className=" px-4 py-8 max-w-6xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-8 text-orange-500">Pick Your Device</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6 justify-center mb-10">
        {categories.map(({ name, image}) => (
          <div
            key={name}
            onClick={() => handleClick(name)}
            className="flex justify-center items-center relative group rounded-3xl p-2 bg-gradient-to-tr from-gray-100 via-gray-50 to-gray-100 backdrop-blur-md
"

          >
             <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-orange-600 transition-all duration-500 pointer-events-none"></div> 
           <div className='flex flex-col gap-2'>
             <Image src={image} alt={name} width={80} height={80} className="mb-2" 
             style={{ aspectRatio: '1 / 1' }} 
            />
            <p className="font-semibold text-gray-700">{name}</p>
           </div>
          </div>
        ))}
      </div>
    </div>
  );
}
