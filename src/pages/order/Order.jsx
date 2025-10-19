import React, { useState } from "react";
import Swal from "sweetalert2";
import "jspdf-autotable";
import OrderModal from "./OrderModal";
import EditOrderModal from "./EditOrderModal";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Order = () => {
  // sample orders data
  const [orders, setOrders] = useState([
    {
      id: 1,
      customerName: "John Doe",
      email: "john@example.com",
      phone: "0123456789",
      address: "123 Coconut Street",
      invoice: "INV-1001",
      products: [
        { name: "Coconut Water", qty: 2, price: 5 },
        { name: "Coconut Oil", qty: 1, price: 10 },
      ],
      deliveryCost: 3,
    },
    {
      id: 2,
      customerName: "Jane Smith",
      email: "jane@example.com",
      phone: "0987654321",
      address: "456 Palm Avenue",
      invoice: "INV-1002",
      products: [{ name: "Coconut Milk", qty: 3, price: 7 }],
      deliveryCost: 2,
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // View order
  const handleView = (order) => {
    setSelectedOrder(order);
    setViewModalOpen(true);
  };

  // Edit order
  const handleEdit = (order) => {
    setSelectedOrder(order);
    setEditModalOpen(true);
  };

  // Confirm order (generate PDF)
  const handleConfirm = (order) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Order Invoice", 14, 20);
    doc.setFontSize(12);
    doc.text(`Invoice: ${order.invoice}`, 14, 30);
    doc.text(`Customer: ${order.customerName}`, 14, 36);
    doc.text(`Email: ${order.email}`, 14, 42);
    doc.text(`Phone: ${order.phone}`, 14, 48);
    doc.text(`Address: ${order.address}`, 14, 54);

    const productData = order.products.map((p, i) => [
      i + 1,
      p.name,
      p.qty,
      `$${p.price}`,
      `$${p.price * p.qty}`,
    ]);

    autoTable(doc, {
      head: [["#", "Product", "Qty", "Price", "Total"]],
      body: productData,
      startY: 60,
    });

    const totalPrice =
      order.products.reduce((sum, p) => sum + p.price * p.qty, 0) +
      order.deliveryCost;

    doc.text(
      `Delivery: $${order.deliveryCost}`,
      14,
      doc.lastAutoTable.finalY + 10
    );
    doc.text(`Total: $${totalPrice}`, 14, doc.lastAutoTable.finalY + 16);

    // Open PDF in new tab
    doc.output("dataurlnewwindow");
  };

  // Delete order
  const handleDelete = (orderId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setOrders(orders.filter((o) => o.id !== orderId));
        Swal.fire("Deleted!", "Order has been deleted.", "success");
      }
    });
  };

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-green-900">Orders</h1>

      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-green-900 text-white">
          <tr>
            <th className="py-3 px-4 text-left">Customer</th>
            <th className="py-3 px-4 text-left">Phone</th>
            <th className="py-3 px-4 text-left">Price</th>
            <th className="py-3 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const totalPrice =
              order.products.reduce((sum, p) => sum + p.price * p.qty, 0) +
              order.deliveryCost;

            return (
              <tr key={order.id} className="border-b hover:bg-green-50">
                <td className="py-3 px-4">{order.customerName}</td>
                <td className="py-3 px-4">{order.phone}</td>
                <td className="py-3 px-4">${totalPrice}</td>
                <td className="py-3 px-4 flex gap-2">
                  <button
                    onClick={() => handleView(order)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(order)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleConfirm(order)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => handleDelete(order.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

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
              orders.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
            );
            setEditModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Order;
