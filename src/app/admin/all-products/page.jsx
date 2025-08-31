"use client";

import React, { useEffect, useState } from "react";
import ProductDetailsModal from "./ProductDetailsModal";
import EditProductModal from "./EditProductModal";
import Swal from "sweetalert2";
import ProtectedRoute from "@/app/components/protectedRoute/page";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const [viewingProduct, setViewingProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/covers?page=${page}&limit=${limit}`);
      const data = await res.json();
      setProducts(data.covers || []);
      setTotalCount(data.totalCount || 0);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load products",
        background: "#000",
        color: "#FFB74D",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, limit]);

  const totalPages = Math.ceil(totalCount / limit);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FFB74D",
      cancelButtonColor: "#888",
      confirmButtonText: "Yes, delete it!",
      background: "#000",
      color: "#FFB74D",
    });

    const handleCreateConsignment = async (order) => {
      try {
        const res = await fetch("/api/create-consignment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            invoice: `INV-${order._id}`,
            recipient_name: order.name,
            recipient_phone: order.phone,
            recipient_address: order.address,
            cod_amount: order.totalPrice,
            note: `Order placed on ${new Date(order.orderDate).toLocaleDateString()}`,
            delivery_area: order.insideDhaka ? "Inside Dhaka" : "Outside Dhaka",
            delivery_charge: order.deliveryCharge,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create consignment");

        Swal.fire({
          icon: "success",
          title: "Consignment Created!",
          text: `Tracking: ${data.tracking_code || "Check dashboard"}`,
          background: "#000",
          color: "#FFB74D",
        });
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.message,
          background: "#000",
          color: "#FFB74D",
        });
      }
    };

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/covers/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete product");
      }

      // Remove deleted product immediately from UI
      setProducts((prev) => prev.filter((p) => p._id !== id));

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Product was deleted successfully.",
        timer: 2000,
        showConfirmButton: false,
        background: "#000",
        color: "#FFB74D",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Failed to delete product.",
        background: "#000",
        color: "#FFB74D",
      });
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto p-6 min-h-screen">
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Admin - All Products
      </h1>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <div className="flex items-center">
          <label htmlFor="limit" className="mr-2 font-semibold text-gray-700">
            Items per page:
          </label>
          <select
            id="limit"
            className="border border-gray-300 rounded px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
          >
            {[5, 10, 20, 50].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg shadow hover:bg-orange-600 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-gray-700 font-medium">
            Page {page} of {totalPages || 1}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages || totalPages === 0}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg shadow hover:bg-orange-600 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Image
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Price
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Overall Stock
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-500">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((prod) => {
                const firstImage = prod.images?.[0]?.url || null;
                return (
                  <tr
                    key={prod._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      {firstImage ? (
                        <img
                          src={firstImage}
                          alt={prod.name}
                          className="w-16 h-16 object-cover rounded-md shadow"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded-md text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">
                      {prod.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      ৳{prod.price}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {prod.stock}
                    </td>
                    <td className="px-4 py-3 text-center space-x-3">
                      <button
                        onClick={() => setViewingProduct(prod)}
                        className="text-blue-600 hover:text-blue-800"
                        title="View Details"
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => setEditingProduct(prod)}
                        className="text-green-600 hover:text-green-800"
                        title="Update Product"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(prod._id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete Product"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {viewingProduct && (
        <ProductDetailsModal
          product={viewingProduct}
          onClose={() => setViewingProduct(null)}
        />
      )}

      {editingProduct && (
        <EditProductModal
          open={!!editingProduct}
          product={editingProduct}
          onClose={() => {
            setEditingProduct(null);
            // refresh list after update
          }}
          onUpdated={() => {
            fetchProducts(); // re-fetch all products from DB
          }}
        />
      )}
    </div>
    </ProtectedRoute>
  );
}
