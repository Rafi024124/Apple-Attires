"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [hydrated, setHydrated] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHydrated(true);
      const storedCart = localStorage.getItem("cart");
      setCartItems(storedCart ? JSON.parse(storedCart) : []);
    }
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems, hydrated]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) =>
          item._id === product._id &&
          item.model === product.model &&
          item.color === product.color
      );

      if (existingItem) {
        return prevItems.map((item) =>
          item._id === product._id &&
          item.model === product.model &&
          item.color === product.color
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        );
      }

      return [
        ...prevItems,
        {
          ...product,
          quantity: product.quantity || 1,
          cartItemId: uuidv4(),
        },
      ];
    });
  };

  const removeFromCart = (cartItemId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.cartItemId !== cartItemId)
    );
  };

  const updateQuantity = (cartItemId, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.cartItemId === cartItemId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  };

  const updateModel = (cartItemId, newModel) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.cartItemId === cartItemId ? { ...item, model: newModel } : item
      )
    );
  };

  const updateColor = (cartItemId, newColor) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.cartItemId === cartItemId ? { ...item, color: newColor } : item
      )
    );
  };

  // NEW clearCart function to empty the whole cart
  const clearCart = () => {
    setCartItems([]);
  };

  const totalQuantity =
    cartItems?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;

  if (!hydrated) {
    return null;
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateModel,
        updateColor,
        clearCart, // <-- added here
        totalQuantity,
        hydrated,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
