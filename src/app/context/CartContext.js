"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid"; // install uuid package with: npm install uuid

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
      // Find item with same _id and model
      const existingItem = prevItems.find(
        (item) =>
          item._id === product._id &&
          item.model === product.model
      );
      if (existingItem) {
        return prevItems.map((item) =>
          item._id === product._id &&
          item.model === product.model
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        );
      }
      // New item: add a unique cartItemId
      return [
        ...prevItems,
        { ...product, quantity: product.quantity || 1, cartItemId: uuidv4() },
      ];
    });
  };

  // UPDATED: remove by cartItemId
  const removeFromCart = (cartItemId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.cartItemId !== cartItemId)
    );
  };

  // UPDATED: update quantity by cartItemId
  const updateQuantity = (cartItemId, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.cartItemId === cartItemId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  };

  // UPDATED: update model by cartItemId
  const updateModel = (cartItemId, newModel) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.cartItemId === cartItemId ? { ...item, model: newModel } : item
      )
    );
  };

  const totalQuantity =
    cartItems?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;

  if (!hydrated) {
    return null; // Avoid hydration mismatch on server
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateModel,
        totalQuantity,
        hydrated,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
