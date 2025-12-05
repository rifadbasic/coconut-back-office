import React from "react";
import Modal from "react-modal";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

Modal.setAppElement("#root");

const OrderModal = ({ order, isOpen, onClose }) => {
  if (!order) return null;

  console.log(order);

  const formattedDate = new Date(order.createdAt).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  // handle print
  const handlePrint = (order) => {
    const win = window.open("", "_blank");

    const products = order.cartItems || [];
    const delivery = order.deliveryCharge || 0;
    const discount = order.discount || 0;

    const subtotal = products.reduce(
      (sum, p) =>
        sum + Math.round(p.price - (p.price * p.discount) / 100) * p.quantity,
      0
    );

    const total = subtotal + delivery - discount;

    // Format date
    const formattedDate = new Date(order.createdAt).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    // console.log(order)
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
      max-height: 650px;
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
    <h1>Coconut BD</h1>
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
        ? `<div><span>Discount:</span> <span>-${discount} TK</span></div>`
        : ""
    }

    <div><span>Delivery Charge:</span> <span>${delivery} TK</span></div>

    <div style="font-size:18px; color:#0a7a0a;">
      <span>Grand Total:</span> 
      <span>${total} TK</span>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <hr style="margin:15px 0;">
    <p><strong>Thank you for shopping with Coconut BD ✓</strong></p>
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
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white p-6 rounded-lg max-w-xl mx-auto mt-20 shadow-lg outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50"
    >
      <p>Coconut-BD-support-01836598753</p>
      <h2 className="text-2xl font-bold mb-4">{order.name} - Order</h2>
      <p>Invoice: {order.invoiceNumber}</p>
      <p>Date: {formattedDate}</p>
      <p>Customer: {order.name}</p>
      <p>Email: {order.email}</p>
      <p>Phone: {order.phone}</p>
      <p>Address: {order.address}</p>

      <h3 className="mt-4 font-semibold">Products:</h3>
      <ul className="list-disc list-inside">
        {order.cartItems?.map((p, i) => (
          <li key={i}>
            {p.name} × {p.quantity} ={" "}
            {Math.round(p.price - (p.price * p.discount) / 100) * p.quantity} TK
          </li>
        ))}
      </ul>

      {/* have any discount */}
      {order.discount > 0 && (
        <p className="mt-2 font-semibold">Discount: {order.discount} TK</p>
      )}

      <p className="mt-2 font-semibold">Delivery: {order.deliveryCharge} TK</p>
      <p className="font-bold text-lg">
        Total: {Math.round(order.finalTotal)} TK
      </p>

      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={() => handlePrint(order)}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          Print Invoice
        </button>

        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default OrderModal;
