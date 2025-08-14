"use client";
import React, { useEffect, useState } from "react";

export default function AccountBalance() {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/get-balance")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch balance");
        return res.json();
      })
      .then((data) => {
      
        
        setBalance(data.current_balance); // make sure this matches backend JSON
      })
      .catch((err) => {
        console.error("Error fetching balance:", err);
        setBalance(null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading balance...</p>;
  if (balance === null) return <p>Error fetching balance</p>;

  return <p>Current Balance: ৳{balance}</p>;
}
