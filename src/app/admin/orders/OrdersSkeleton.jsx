"use client";

import React from "react";

export default function OrdersSkeleton({ rows = 10 }) {
  return (
    <div className="max-w-7xl mx-auto p-6 animate-pulse">
      {/* Header */}
      <div className="h-8 bg-gray-300 rounded w-40 mb-6"></div>

      {/* Batch actions skeleton */}
      <div className="flex gap-2 mb-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-8 w-28 bg-gray-300 rounded"></div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <div className="h-9 w-64 bg-gray-300 rounded"></div>
        <div className="h-9 w-40 bg-gray-300 rounded"></div>
        <div className="h-9 w-32 bg-gray-300 rounded"></div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3"></th>
              {["Order ID", "Customer", "Phone", "Total", "Status", "Date", "Actions"].map((head) => (
                <th key={head} className="p-3 text-left">
                  <div className="h-4 bg-gray-300 rounded w-16"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(rows)].map((_, i) => (
              <tr key={i} className="border-b">
                <td className="p-3">
                  <div className="h-4 w-4 bg-gray-300 rounded"></div>
                </td>
                <td className="p-3">
                  <div className="h-4 bg-gray-300 rounded w-24"></div>
                </td>
                <td className="p-3">
                  <div className="h-4 bg-gray-300 rounded w-28"></div>
                </td>
                <td className="p-3">
                  <div className="h-4 bg-gray-300 rounded w-24"></div>
                </td>
                <td className="p-3">
                  <div className="h-6 bg-gray-300 rounded w-24"></div>
                </td>
                <td className="p-3">
                  <div className="h-4 bg-gray-300 rounded w-28"></div>
                </td>
                <td className="p-3 flex gap-2">
                  <div className="h-8 w-12 bg-gray-300 rounded"></div>
                  <div className="h-8 w-12 bg-gray-300 rounded"></div>
                  <div className="h-8 w-12 bg-gray-300 rounded"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination skeleton */}
      <div className="mt-4 flex justify-center items-center gap-3 flex-wrap">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-8 w-10 bg-gray-300 rounded"></div>
        ))}
      </div>
    </div>
  );
}
