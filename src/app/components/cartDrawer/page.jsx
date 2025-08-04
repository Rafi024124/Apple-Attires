'use client';

import Image from 'next/image';
import { useCart } from '@/app/context/CartContext';

export default function CartDrawer({ open, onClose }) {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    updateModel,
  } = useCart();

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 shadow-lg transition-transform duration-300 z-50 ${
        open ? 'translate-x-0' : 'translate-x-full'
      }`}
      aria-hidden={!open}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-bold">Your Cart</h2>
        <button onClick={onClose} aria-label="Close cart drawer" className="text-xl">
          &times;
        </button>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-8rem)]">
        {cartItems.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          cartItems.map((item) => (
            <div key={item.cartItemId} className="flex items-center gap-3">
              <div className="relative w-16 h-16 flex-shrink-0 rounded overflow-hidden">
                <Image
                  src={item.image || '/fallback.jpg'}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                  unoptimized
                />
              </div>

              <div className="flex-grow">
                <h4 className="font-semibold">{item.name}</h4>
                <p className="text-sm text-gray-600">Price: ৳{item.price}</p>
                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                <p className="text-sm text-gray-600">Model: {item.model || 'N/A'}</p>

                {/* Optional: Quantity controls */}
                {/* 
                <div className="flex items-center mt-1 space-x-2">
                  <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}>+</button>
                </div> 
                */}

                {/* Remove button */}
                <button
                  onClick={() => removeFromCart(item.cartItemId)}
                  className="text-sm text-red-600 hover:underline mt-1"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t flex flex-col gap-2">
        <button
          onClick={() => {
            // Navigate to cart page and close drawer
            window.location.href = '/cart'; // or use next/router push if inside a component with router
            onClose();
          }}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
        >
          View Cart
        </button>
        <button
          onClick={onClose}
          className="w-full border border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 px-4 py-2 rounded"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
