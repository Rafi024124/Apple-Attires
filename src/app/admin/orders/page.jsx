"use client";

import React, { useEffect, useState, useMemo } from "react";
import Swal from "sweetalert2";
import { FaTruck, FaEye, FaFileCsv } from "react-icons/fa";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrders, setSelectedOrders] = useState([]); // batch selection

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);



 

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (Array.isArray(data)) setOrders(data);
      else if (data?.orders && Array.isArray(data.orders)) setOrders(data.orders);
      else setOrders([]);
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

  // Delete single order
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

  // Batch delete
  const handleBatchDelete = async () => {
    if (selectedOrders.length === 0) return;
    const confirm = await Swal.fire({
      icon: "warning",
      title: `Delete ${selectedOrders.length} orders?`,
      text: "This action cannot be undone.",
      showCancelButton: true,
      confirmButtonText: "Yes, delete all!",
    });
    if (!confirm.isConfirmed) return;

    try {
      await Promise.all(
        selectedOrders.map((id) => fetch(`/api/orders/${id}`, { method: "DELETE" }))
      );
      Swal.fire("Deleted!", "Selected orders have been deleted.", "success");
      setSelectedOrders([]);
      fetchOrders();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  // Status update
  const handleStatusChange = async (id, newStatus) => {
    try {
      if (!["Pending", "Delivered", "Hold"].includes(newStatus)) return;
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  // Batch status update
  const handleBatchStatusChange = async (newStatus) => {
    if (selectedOrders.length === 0) return;
    try {
      await Promise.all(
        selectedOrders.map((id) =>
          fetch(`/api/orders/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
          })
        )
      );
      Swal.fire("Updated!", "Selected orders status updated.", "success");
      setSelectedOrders([]);
      fetchOrders();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  // Batch print
  const handleBatchPrint = (ids = selectedOrders) => {
    if (ids.length === 0) return;
    const ordersToPrint = orders.filter((o) => ids.includes(o._id));
    const invoiceWindow = window.open("", "PRINT", "width=800,height=600");
    invoiceWindow.document.write(`<html><head><title>Invoices</title></head><body>`);
    ordersToPrint.forEach((order) => {
      invoiceWindow.document.write(`
        <h1>Invoice - ${order._id}</h1>
        <p><b>Customer:</b> ${order.name}</p>
        <p><b>Phone:</b> ${order.phone}</p>
        <p><b>Address:</b> ${order.address}</p>
        <p><b>Date:</b> ${new Date(order.createdAt).toLocaleString()}</p>
        <hr/>
        <ul>
          ${order.cartItems
            .map(
              (item) =>
                `<li>${item.name} - ${item.model || ""} (${item.color || ""}) x ${item.quantity} — ৳${item.price}</li>`
            )
            .join("")}
        </ul>
        <p><b>Delivery Charge:</b> ৳${order.deliveryCharge}</p>
        <p><b>Total:</b> ৳${order.totalPrice}</p>
        <hr/><br/>
      `);
    });
    invoiceWindow.document.write(`</body></html>`);
    invoiceWindow.document.close();
    invoiceWindow.focus();
    invoiceWindow.print();
  };

  // CSV export
  const handleExportCSV = () => {
    if (selectedOrders.length === 0) return;
    const ordersToExport = orders.filter((o) => selectedOrders.includes(o._id));
    const headers = ["Order ID", "Customer", "Phone", "Address", "Status", "Total", "Date"];
    const csvRows = [
      headers.join(","),
      ...ordersToExport.map(
        (o) =>
          `"${o._id}","${o.name}","${o.phone}","${o.address}","${o.status}","${o.totalPrice}","${new Date(
            o.createdAt
          ).toLocaleString()}"`
      ),
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Search & filter
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

  // Counts
  const statusCounts = useMemo(() => {
    const counts = { Pending: 0, Delivered: 0, Hold: 0 };
    orders.forEach((o) => {
      const s = o.status || "Pending";
      if (counts[s] !== undefined) counts[s]++;
    });
    return counts;
  }, [orders]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const changePage = (pageNum) => {
    if (pageNum < 1 || pageNum > totalPages) return;
    setCurrentPage(pageNum);
  };
  useEffect(() => setCurrentPage(1), [searchQuery, statusFilter, itemsPerPage]);

  if (loading) return <p className="text-center p-10">Loading orders...</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">All Orders</h1>

      {/* Batch Actions */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => handleBatchStatusChange("Pending")}
          className="px-3 py-1 bg-yellow-400 text-black rounded"
        >
          Set Pending
        </button>
        <button
          onClick={() => handleBatchStatusChange("Delivered")}
          className="px-3 py-1 bg-green-400 text-black rounded"
        >
          Set Delivered
        </button>
        <button
          onClick={() => handleBatchStatusChange("Hold")}
          className="px-3 py-1 bg-blue-400 text-black rounded"
        >
          Set Hold
        </button>
        <button
          onClick={handleBatchDelete}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          Delete Selected
        </button>
        <button
          onClick={handleBatchPrint}
          className="px-3 py-1 bg-yellow-500 text-white rounded flex items-center gap-1"
        >
          <FaFileCsv /> Print Selected
        </button>
        <button
          onClick={handleExportCSV}
          className="px-3 py-1 bg-cyan-600 text-white rounded flex items-center gap-1"
        >
          <FaFileCsv /> Export CSV
        </button>
      </div>

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
          <option value="All">All ({orders.length})</option>
          <option value="Pending">Pending ({statusCounts.Pending})</option>
          <option value="Delivered">Delivered ({statusCounts.Delivered})</option>
          <option value="Hold">Hold ({statusCounts.Hold})</option>
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

      {/* Orders Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3">
                <input
                  type="checkbox"
                  checked={selectedOrders.length === paginatedOrders.length}
                  onChange={(e) => {
                    if (e.target.checked)
                      setSelectedOrders(paginatedOrders.map((o) => o._id));
                    else setSelectedOrders([]);
                  }}
                />
              </th>
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
                <OrderRow
                  key={order._id}
                  order={order}
                  handleStatusChange={handleStatusChange}
                  handlePrintInvoice={() => handleBatchPrint([order._id])}
                  handleDelete={handleDelete}
                  setSelectedOrder={setSelectedOrder}
                  setShowModal={setShowModal}
                  selectedOrders={selectedOrders}
                  setSelectedOrders={setSelectedOrders}
                />
              ))
            ) : (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center items-center gap-3 flex-wrap">
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
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
          ))}
          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

     {showModal && selectedOrder && (
  <OrderDetailsModal
    order={selectedOrder}
    setShowModal={setShowModal}
    allOrders={orders} // ✅ pass the orders here
  />
)}
    </div>
  );
}

// -------------------------
// OrderRow component
function OrderRow({
  order,
  handleStatusChange,
  handlePrintInvoice,
  handleDelete,
  setSelectedOrder,
  setShowModal,
  selectedOrders,
  setSelectedOrders,
}) {
  const [consignmentStatus, setConsignmentStatus] = useState(null);
 
 
  useEffect(() => {
    const loadStatus = async () => {
      if (!order.consignmentId) return;
      try {
        const res = await fetch(`/api/order-status?orderId=${order._id}`);
        if (!res.ok) {
          setConsignmentStatus({ status: "Error" });
          return;
        }
        const data = await res.json();
        setConsignmentStatus(data);
      } catch (err) {
        setConsignmentStatus({ status: "Error" });
      }
    };
    loadStatus();
  }, [order]);

  return (
    <tr className="border-b">
      <td className="p-3">
        <input
          type="checkbox"
          checked={selectedOrders.includes(order._id)}
          onChange={(e) => {
            if (e.target.checked)
              setSelectedOrders((prev) => [...prev, order._id]);
            else
              setSelectedOrders((prev) =>
                prev.filter((id) => id !== order._id)
              );
          }}
        />
      </td>
      <td className="p-3">{order._id}</td>
      <td className="p-3">{order.name}</td>
      <td className="p-3 flex items-center gap-2">{order.phone}</td>
      <td className="p-3">৳{order.totalPrice}</td>
      <td className="p-3">
        <select
          value={order.status || "Pending"}
          onChange={(e) => handleStatusChange(order._id, e.target.value)}
          className={`border rounded px-2 py-1 ${
            order.status === "Pending"
              ? "bg-yellow-200"
              : order.status === "Delivered"
              ? "bg-green-200"
              : "bg-blue-200"
          }`}
        >
          <option value="Pending">Pending</option>
          <option value="Delivered">Delivered</option>
          <option value="Hold">Hold</option>
        </select>
      </td>
      <td className="p-3">{new Date(order.createdAt).toLocaleString()}</td>
      <td className="p-3 flex flex-wrap gap-2">
        <button
          onClick={() => {
            setSelectedOrder({ ...order, consignmentStatus });
            setShowModal(true);
          }}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex items-center gap-1"
        >
          <FaEye />
        </button>

       <button
  className={`px-3 py-1 rounded flex items-center gap-1 ${
    order.consignmentId
      ? "bg-gray-400 text-gray-700 cursor-not-allowed"
      : "text-orange-600 hover:underline hover:text-orange-800"
  }`}
  title="Add Consignment"
  disabled={!!order.consignmentId}
  onClick={async () => {
    if (order.consignmentId) return;

    try {
      const res = await fetch("/api/steadfast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to create consignment");
      }

      Swal.fire(
        "Success",
        `Consignment created! ID: ${data.consignment?.consignment_id}`,
        "success"
      );

      // Optionally, update the order locally to show the consignmentId without refetching
      order.consignmentId = data.consignment?.consignment_id || null;
    } catch (err) {
      Swal.fire(
        "Error",
        err.message || "Failed to create consignment",
        "error"
      );
    }
  }}
>
  <FaTruck />
</button>


        <button
          onClick={() => handlePrintInvoice(order._id)}
          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-colors"
        >
          Print
        </button>

        <button
          onClick={() => handleDelete(order._id)}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

// -------------------------
// OrderDetailsModal component
// -------------------------
// OrderDetailsModal component

// -------------------------
// OrderDetailsModal component
// -------------------------
function OrderDetailsModal({ order, setShowModal }) {
  const [fraudInfo, setFraudInfo] = useState({});
  const [loadingFraud, setLoadingFraud] = useState(false);
  const [fraudError, setFraudError] = useState(null); // track error

  useEffect(() => {
    const fetchFraudInfo = async () => {
      if (!order.phone) return;

      setLoadingFraud(true);
      setFraudError(null);

      try {
        const res = await fetch("/api/fraud-check-bulk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone_numbers: [order.phone] }),
        });

        const data = await res.json();

        if (!data?.status) {
          setFraudError(data?.message || "Failed to fetch courier info");
          setFraudInfo({});
          return;
        }

        const summaries = data.result?.[order.phone] || {};
        setFraudInfo(summaries);
      } catch (err) {
        setFraudError(err?.message || "Failed to fetch courier info");
        setFraudInfo({});
      } finally {
        setLoadingFraud(false);
      }
    };

    fetchFraudInfo();
  }, [order.phone]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full relative overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-bold mb-4">Order Details</h2>

        <p><b>Customer:</b> {order.name}</p>
        <p><b>Phone:</b> {order.phone}</p>
        <p><b>Address:</b> {order.address}</p>
        <p><b>Date:</b> {new Date(order.createdAt).toLocaleString()}</p>

        {order.consignmentId && (
          <>
            <hr className="my-3" />
            <h3 className="font-semibold mb-2">Consignment Info:</h3>
            <p><b>ID:</b> {order.consignmentId}</p>
            <p><b>Status:</b> {order.consignmentStatus?.delivery_status || "Loading..."}</p>
          </>
        )}

        <hr className="my-3" />
        <h3 className="font-semibold mb-2">Courier Info:</h3>

        {loadingFraud ? (
          <p>Loading courier info...</p>
        ) : fraudError ? (
          <p className="text-red-600">{fraudError}</p>
        ) : Object.keys(fraudInfo).length ? (
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Courier</th>
                <th className="p-2">Total</th>
                <th className="p-2">Success</th>
                <th className="p-2">Cancel</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(fraudInfo).map(([courier, info]) => (
                <tr key={courier} className="border-t">
                  <td className="p-2">{courier}</td>
                  <td className="p-2">{info?.total ?? "-"}</td>
                  <td className="p-2">{info?.success ?? "-"}</td>
                  <td className="p-2">{info?.cancel ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No courier info found for this order.</p>
        )}

        <hr className="my-3" />
        <h3 className="font-semibold mb-2">Items:</h3>
        <ul className="list-disc pl-5">
          {order.cartItems.map((item) => (
            <li key={item.cartItemId}>
              {item.name} - {item.model || ""} ({item.color || ""}) x {item.quantity} — ৳{item.price}
            </li>
          ))}
        </ul>

        <hr className="my-3" />
        <p><b>Delivery Charge:</b> ৳{order.deliveryCharge}</p>
        <p><b>Total:</b> ৳{order.totalPrice}</p>

        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setShowModal(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

