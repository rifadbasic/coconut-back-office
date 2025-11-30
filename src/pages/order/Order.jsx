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
              (sum, p) => sum + (Math.round(p.finalPrice) || 0) * p.quantity,
              0
            );

            const totalPrice = subtotal + delivery - discount;

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
            <title>${order.name || "Customer"} - ${
              order.invoiceNumber || ""
            }</title>
            <style>
              body { font-family: Arial; padding: 30px; }
              .card { max-width: 700px; margin: auto; padding: 25px; border: 1px solid #ccc; border-radius: 10px; }
              .header { text-align: center; margin-bottom: 20px; }
              h1 { margin: 0; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              table, th, td { border: 1px solid #ddd; }
              th, td { padding: 10px; text-align: left; }
              .text-right { text-align: right; }
              .print-btn { position: fixed; right: 20px; top: 20px; padding: 10px 15px; background: black; color: white; border: none; border-radius: 6px; cursor: pointer; }
              .footer { margin-top: 40px; font-size: 14px; color: #444; line-height: 1.6; }
            </style>
          </head>
          <body>
            <button class="print-btn" onclick="window.print()">Print</button>
            <div class="card">
              <div class="header">
                <h1>Coconut BD</h1>
                <p>Customer Support: 01836598753</p>
                <hr/>
                <h2>INVOICE</h2>
              </div>
              <p><strong>Date:</strong> ${formattedDate}</p>
              <p><strong>Invoice:</strong> ${order.invoiceNumber || "-"}</p>
              <p><strong>Customer:</strong> ${order.name || "-"}</p>
              <p><strong>Email:</strong> ${order.email || "-"}</p>
              <p><strong>Phone:</strong> ${order.phone || "-"}</p>
              <p><strong>Address:</strong> ${order.address || "-"}</p>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${
                    products.length > 0
                      ? products
                          .map(
                            (p, i) => `
                            <tr>
                              <td>${i + 1}</td>
                              <td>${p.name || "-"}</td>
                              <td>${p.quantity || 0}</td>
                              <td>${Math.round(p.finalPrice) || 0}</td>
                              <td>${
                                (Math.round(p.finalPrice) || 0) *
                                (p.quantity || 0)
                              }</td>
                            </tr>
                          `
                          )
                          .join("")
                      : `<tr><td colspan="5" style="text-align:center;">No products</td></tr>`
                  }
                </tbody>
              </table>
              <h3 class="text-right" style="margin-top: 20px;">Subtotal: ${subtotal} TK</h3>
              ${
                discount > 0
                  ? `<h3 class="text-right">Discount: -${discount} TK</h3>`
                  : ""
              }
              <h3 class="text-right">Delivery Charge: ${delivery} TK</h3>
              <h2 class="text-right">Grand Total: ${totalPrice} TK</h2>

              <div class="footer">
                <hr style="margin: 20px 0;" />
                <p><strong>Thank You for Shopping with Coconut BD ✓</strong></p>
                <p>
                  ✓ Returns accepted within <strong>48 hours</strong> of delivery.<br/>
                  ✓ Product must be unused & in original packaging.<br/>
                  ✓ Incorrect/damaged items require an unboxing video.<br/>
                  ✓ Delivery charge is non-refundable (except our mistake).
                </p>
                <p style="text-align:center; margin-top:10px; font-size:13px; color:#666;">— Your Trust, Our Responsibility —</p>
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
      <h1 className="text-3xl font-bold mb-6 text-green-900">Orders</h1>

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
          <thead className="bg-green-900 text-white">
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
                <tr key={order._id} className="border-b hover:bg-green-50">
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
