"use client";

import React, { useEffect, useState, useMemo } from "react";
import Swal from "sweetalert2";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch orders safely
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/orders");
      const data = await res.json();

      if (Array.isArray(data)) {
        setOrders(data);
      } else if (data?.orders && Array.isArray(data.orders)) {
        setOrders(data.orders);
      } else {
        setOrders([]);
        console.warn("Unexpected API response shape:", data);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Delete order
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "This order will be permanently deleted.",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete order");

      Swal.fire("Deleted!", "Order has been deleted.", "success");
      fetchOrders();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const handleCreateConsignment = async (order) => {
    try {
      const res = await fetch("/api/steadfast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });

      const data = await res.json();

      if (!res.ok)
        throw new Error(data.error || "Failed to create consignment");

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

  // Update status
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      fetchOrders();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  console.log(orders);

  // Print invoice
  const handlePrintInvoice = (order) => {
    const invoiceWindow = window.open("", "PRINT", "width=800,height=600");
    invoiceWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${order._id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1, h3 { margin-bottom: 0.5em; }
            hr { margin: 1em 0; }
            ul { padding-left: 1.2em; }
          </style>
        </head>
        <body>
          <h1>Invoice</h1>
          <p><b>Customer:</b> ${order.name}</p>
          <p><b>Phone:</b> ${order.phone}</p>
          <p><b>Address:</b> ${order.address}</p>
          <p><b>Date:</b> ${new Date(order.createdAt).toLocaleString()}</p>
          <hr/>
          <h3>Items:</h3>
          <ul>
            ${order.cartItems
              .map(
                (item) =>
                  `<li>${item.name} - ${item.model || ""} (${
                    item.color || ""
                  }) x ${item.quantity} — ৳${item.price}</li>`
              )
              .join("")}
          </ul>
          <hr/>
          <p><b>Delivery Charge:</b> ৳${order.deliveryCharge}</p>
          <p><b>Total:</b> ৳${order.totalPrice}</p>
        </body>
      </html>
    `);
    invoiceWindow.document.close();
    invoiceWindow.focus();
    invoiceWindow.print();
    invoiceWindow.close();
  };

  // Filter orders by searchQuery and statusFilter
  const filteredOrders = useMemo(() => {
    const q = searchQuery.toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        order._id.toLowerCase().includes(q) ||
        order.phone.toLowerCase().includes(q) ||
        (order.status && order.status.toLowerCase().includes(q));

      const matchesStatus =
        statusFilter === "All" || (order.status || "Pending") === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Change page handler
  const changePage = (pageNum) => {
    if (pageNum < 1 || pageNum > totalPages) return;
    setCurrentPage(pageNum);
  };

  // Reset page on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, itemsPerPage]);

  if (loading) {
    return <p className="text-center p-10">Loading orders...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">All Orders</h1>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-2 items-center">
        <input
          type="text"
          placeholder="Search by Order ID, Phone or Status..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded flex-grow min-w-[200px]"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <select
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
          className="border p-2 rounded"
        >
          {[5, 10, 20, 50].map((num) => (
            <option key={num} value={num}>
              Show {num}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.length > 0 ? (
              paginatedOrders.map((order) => (
                <tr key={order._id} className="border-b">
                  <td className="p-3">{order._id}</td>
                  <td className="p-3">{order.name}</td>
                  <td className="p-3 flex items-center gap-2">
                    {order.phone}
                    {/* Badge for previous orders count */}
                    {order.previousOrdersCount > 0 && (
                      <span
                        title={`${order.previousOrdersCount} previous order${
                          order.previousOrdersCount > 1 ? "s" : ""
                        }`}
                        className="ml-2 inline-block bg-blue-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full"
                      >
                        {order.previousOrdersCount}
                      </span>
                    )}
                  </td>
                  <td className="p-3">৳{order.totalPrice}</td>
                  <td className="p-3">
                    <select
                      value={order.status || "Pending"}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="border rounded px-2 py-1"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-3">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td className="p-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowModal(true);
                      }}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      View
                    </button>
                    <a
                      href={`tel:${order.phone}`}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Call
                    </a>
                    <a
                      href={`https://wa.me/880${order.phone.slice(1)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      WhatsApp
                    </a>
                    <button
                      onClick={() => handlePrintInvoice(order)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Print
                    </button>
                    <button
                      onClick={() => handleDelete(order._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleCreateConsignment(order)}
                      className="text-orange-600 hover:underline"
                      title="Create Consignment"
                    >
                      📦
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center items-center gap-3 flex-wrap">
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            Prev
          </button>

          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNum) => (
              <button
                key={pageNum}
                onClick={() => changePage(pageNum)}
                className={`px-3 py-1 rounded border ${
                  pageNum === currentPage
                    ? "bg-cyan-600 text-white border-cyan-600"
                    : "hover:bg-gray-100"
                }`}
              >
                {pageNum}
              </button>
            )
          )}

          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full relative">
            <h2 className="text-xl font-bold mb-4">Order Details</h2>

            <p className="flex items-center gap-2">
              <b>Customer:</b> {selectedOrder.name}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedOrder.name);
                  alert("Name copied!");
                }}
                className="ml-2 px-2 py-1 bg-cyan-600 text-white rounded hover:bg-cyan-700 text-sm"
                type="button"
                aria-label="Copy name"
              >
                Copy
              </button>
            </p>

            <p className="flex items-center gap-2">
              <b>Phone:</b> {selectedOrder.phone}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedOrder.phone);
                  alert("Phone number copied!");
                }}
                className="ml-2 px-2 py-1 bg-cyan-600 text-white rounded hover:bg-cyan-700 text-sm"
                type="button"
                aria-label="Copy phone number"
              >
                Copy
              </button>
            </p>

            <p className="flex items-center gap-2">
              <b>Address:</b> {selectedOrder.address}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedOrder.address);
                  alert("Address copied!");
                }}
                className="ml-2 px-2 py-1 bg-cyan-600 text-white rounded hover:bg-cyan-700 text-sm"
                type="button"
                aria-label="Copy address"
              >
                Copy
              </button>
            </p>

            <p>
              <b>Date:</b> {new Date(selectedOrder.createdAt).toLocaleString()}
            </p>

            <hr className="my-3" />

            <h3 className="font-semibold mb-2">Items:</h3>
            <ul className="space-y-2">
              {selectedOrder.cartItems.map((item) => (
                <li key={item.cartItemId} className="flex gap-3 items-center">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded border"
                    />
                  )}
                  <div>
                    <p>
                      {item.name} - {item.model || ""} ({item.color || ""})
                    </p>
                    <p>
                      Qty: {item.quantity} — ৳{item.price}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <hr className="my-3" />

            <p>
              <b>Delivery Charge:</b> ৳{selectedOrder.deliveryCharge}
            </p>
            <p>
              <b>Total:</b> ৳{selectedOrder.totalPrice}
            </p>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
