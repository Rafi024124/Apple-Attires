'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useCart } from '@/app/context/CartContext';
import { useParams } from 'next/navigation';

export default function CoversDetailsPage() {
  const params = useParams();
  const id = params.id;
  const [data, setData] = useState(null);
  const { cartItems, addToCart, removeFromCart, updateQuantity } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/cover/${id}`);
      const result = await res.json();
      setData(result);
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (!data) {
    return (
      <div className="text-center text-red-500 p-10">
        <h1>Loading...</h1>
      </div>
    );
  }

  // Find if the item is in cart and get current quantity
  const cartItem = cartItems.find(item => item._id === data._id);
  const quantity = cartItem ? cartItem.quantity : 0;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10">
      {/* Main Content */}
      <div className="flex flex-col md:flex-row items-center gap-6">
        <Image
          src={data.image}
          alt={data.name}
          width={400}
          height={600}
          className="rounded-md shadow-lg object-cover"
        />

        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{data.name}</h1>
          <p className="text-xl text-red-500 font-semibold">৳{data.price}</p>

          {data.tag && (
            <span className="inline-block bg-yellow-300 text-black px-3 py-1 rounded-full text-sm font-medium">
              {data.tag}
            </span>
          )}

          <div className="text-sm text-gray-500 dark:text-gray-300">
            <p><strong>Model Compatibility:</strong> {data.model.join(', ')}</p>
            <p><strong>Status:</strong> {data.isAvailable ? 'Available' : 'Out of Stock'}</p>
            <p><strong>Featured:</strong> {data.isFeatured ? 'Yes' : 'No'}</p>
            <p><strong>Created At:</strong> {new Date(data.createdAt).toLocaleDateString()}</p>
          </div>

          {/* Add to Cart or Quantity Controls */}
          {quantity === 0 ? (
            <button
              onClick={() =>
                addToCart({
                  _id: data._id,
                  name: data.name,
                  price: data.price,
                  image: data.image,
                })
              }
              className="mt-4 px-5 py-2 bg-cyan-600 text-white font-semibold rounded hover:bg-cyan-700"
            >
              Add to Cart
            </button>
          ) : (
            <div className="mt-4 flex items-center space-x-4">
              <button
                onClick={() => {
                  if (quantity === 1) removeFromCart(data._id);
                  else updateQuantity(data._id, quantity - 1);
                }}
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
              >
                -
              </button>

              <span className="text-lg font-semibold">{quantity}</span>

              <button
                onClick={() => updateQuantity(data._id, quantity + 1)}
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Extra Images Section */}
      {Array.isArray(data.images) && data.images.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">More Images</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {data.images.map((img, index) => (
              <Image
                key={index}
                src={img}
                alt={`Extra view ${index + 1}`}
                width={300}
                height={400}
                className="rounded-md shadow object-cover"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
