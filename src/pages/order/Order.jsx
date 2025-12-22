import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import OrderModal from "./OrderModal";
import EditOrderModal from "./EditOrderModal";
import useAxios from "../../hook/useAxios";

const Order = () => {
  const axiosSecure = useAxios();

  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Load orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosSecure.get("/orders", {
          params: { search, page: currentPage, limit: 10 },
        });

        if (response?.data?.success) {
          setOrders(response.data.orders || []);
          setTotalPages(response.data.totalPages || 1);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      }
    };

    fetchOrders();
  }, [search, currentPage]);

  // View order
  const handleView = (order) => {
    if (!order) return;
    setSelectedOrder(order);
    setViewModalOpen(true);
  };

  // Edit order
  const handleEdit = (order) => {
    if (!order) return;
    setSelectedOrder(order);
    setEditModalOpen(true);
  };

  // Confirm order
  const handleConfirm = async (order) => {
    if (!order?._id) return;
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, confirm!",
    })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            const res = await axiosSecure.patch(
              `/orders/confirm/${order._id}`,
              {
                status: "confirmed",
              }
            );

            if (res.data?.success) {
              setOrders(
                orders.map((o) =>
                  o._id === order._id ? { ...o, status: "confirmed" } : o
                )
              );
            } else {
              return Swal.fire("Error", "Could not confirm order", "error");
            }

            const products = order.cartItems || [];
            const delivery = order.deliveryCharge || 0;
            const discount = order.discount || 0;

            const subtotal = products.reduce(
              (sum, p) =>
                sum +
                (Math.round(p.price - (p.price * p.discount) / 100) || 0) *
                  p.quantity,
              0
            );

            // const totalPrice = subtotal + delivery - discount;

            const formattedDate = order.createdAt
              ? new Date(order.createdAt).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,
                })
              : "-";

            const win = window.open("", "_blank");
            win.document.write(`
<html>
<head>
  <title>${order.name} - ${order.invoiceNumber}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      display: flex;
      justify-content: center;
      background: #f5f5f5;
      padding: 20px;
    }

    .invoice-wrapper {
      width: 350px;
      min-height: 650px;
      background: white;
      padding: 20px;
      border-radius: 10px;
      overflow-y: auto;
      border: 1px solid #ddd;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }

    h1, h2, h3, p {
      margin: 0;
      padding: 0;
    }

    .header {
      text-align: center;
      margin-bottom: 15px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
      font-size: 14px;
    }

    table th, table td {
      border: 1px solid #ddd;
      padding: 6px;
      text-align: left;
    }

    .totals {
      margin-top: 20px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .totals div {
      display: flex;
      justify-content: space-between;
      font-weight: bold;
    }

    .footer {
      margin-top: 20px;
      font-size: 12px;
      color: #444;
      line-height: 1.5;
    }

    /* Print Button */
    .print-btn {
      position: fixed;
      right: 20px;
      top: 20px;
      padding: 10px 15px;
      background: black;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      z-index: 9999;
    }

  </style>
</head>

<body>

<button class="print-btn" onclick="window.print()">Print</button>

<div class="invoice-wrapper">
  
  <div class="header">
    <h1>Beauty & Care</h1>
    <p style="font-size:12px;">Customer Support: 01765574008</p>
    <hr style="margin:10px 0;">
    <h2>INVOICE</h2>
  </div>

  <p><strong>Date:</strong> ${formattedDate}</p>
  <p><strong>Invoice:</strong> ${order.invoiceNumber}</p>
  <p><strong>Name:</strong> ${order.name}</p>
  <p><strong>Email:</strong> ${order.email}</p>
  <p><strong>Phone:</strong> ${order.phone}</p>
  <p><strong>Address:</strong> ${order.address}</p>

  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Product</th>
        <th>Qty</th>
        <th>Discount Price</th>
        <th>Total</th>
      </tr>
    </thead>

    <tbody>
      ${products
        .map(
          (p, i) => `
          <tr>
            <td>${i + 1}</td>
            <td>${p.name}</td>
            <td>${p.quantity}</td>
            <td>${Math.round(p.price - (p.price * p.discount) / 100)}</td>
            <td>${
              Math.round(p.price - (p.price * p.discount) / 100) * p.quantity
            }</td>
          </tr>
      `
        )
        .join("")}
    </tbody>
  </table>

  <!-- TOTAL SECTION -->
  <div class="totals">
    <div><span>Subtotal:</span> <span>${subtotal} TK</span></div>

    ${
      discount > 0
        ? `<div><span>Discount:</span> <span>-${Math.round(discount)} TK</span></div>`
        : ""
    }

    <div><span>Delivery Charge:</span> <span>${delivery} TK</span></div>

    <div style="font-size:18px; color:#0a7a0a;">
      <span>Grand Total:</span> 
      <span>${Math.round(order.finalTotal)} TK</span>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <hr style="margin:15px 0;">
    <p><strong>Thank you for shopping with Beauty & Care ✓</strong></p>
    <p>
      ✓ You can return it within seven  <strong>7 days</strong> if you find any problems.<br>
      ✓ Must have an unboxing video.<br>
      ✓ Delivery charge non-refundable except company fault.
    </p>

    <p style="text-align:center; margin-top:10px; font-size:11px; color:#555;">
      — Your Trust, Our Responsibility —
    </p>
  </div>

</div>

</body>
</html>
`);
            win.document.close();
          } catch (error) {
            console.error(error);
            Swal.fire("Error", "Something went wrong", "error");
          }
        }
      })
      .catch((error) => {
        console.error("Error confirming order:", error);
        Swal.fire("Error", "Failed to confirm order", "error").then(() => {});
      });
  };

  // Delete order
  const handleDelete = async (orderId) => {
    if (!orderId) return;
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await axiosSecure.delete(`/orders/${orderId}`);
        if (!res.data?.success) {
          Swal.fire("Error", "Failed to delete order", "error");
          return;
        }
        setOrders(orders.filter((o) => o._id !== orderId));
        Swal.fire("Deleted!", "Order deleted successfully!", "success");
      }
    });
  };

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-[var(--secondary-color)]">Orders</h1>

      {/* Search */}
      <div className="mt-4">
        <input
          type="text"
          placeholder="Search by name, invoice, phone..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full md:w-1/3 border px-3 py-2 rounded mb-4"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-[var(--secondary-color)] text-white">
            <tr>
              <th className="py-3 px-4 text-left">Customer</th>
              <th className="py-3 px-4 text-left">Phone</th>
              <th className="py-3 px-4 text-left">Price</th>
              <th className="py-3 px-4 text-left">Actions</th>
              <th className="py-3 px-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-[var(--bg-color)]">
                  <td className="py-3 px-4">{order?.name || "-"}</td>
                  <td className="py-3 px-4">{order?.phone || "-"}</td>
                  <td className="py-3 px-4">
                    {Math.round(order?.finalTotal || 0)}
                  </td>
                  <td className="py-3 px-4 flex gap-2">
                    <button
                      onClick={() => handleView(order)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(order)}
                      className={
                        order?.status === "confirmed"
                          ? "hidden"
                          : "bg-yellow-400 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                      }
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleConfirm(order)}
                      className={
                        order?.status === "confirmed"
                          ? "hidden"
                          : "bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                      }
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => handleDelete(order._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                  <td className="py-3 px-4">{order?.status || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-3 py-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Modals */}
      {viewModalOpen && selectedOrder && (
        <OrderModal
          order={selectedOrder}
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
        />
      )}

      {editModalOpen && selectedOrder && (
        <EditOrderModal
          order={selectedOrder}
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSave={(updatedOrder) => {
            setOrders(
              orders.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
            );
            setEditModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Order;
