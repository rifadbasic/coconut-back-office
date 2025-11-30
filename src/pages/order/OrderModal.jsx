import React from "react";
import Modal from "react-modal";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

Modal.setAppElement("#root");

const OrderModal = ({ order, isOpen, onClose }) => {
  if (!order) return null;

  // console.log(order);

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
      (sum, p) => sum + Math.round(p.finalPrice) * p.quantity,
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

    win.document.write(`
    <html>
  <head>
    <title>${order.name} - ${order.invoiceNumber}</title>
    <style>
      body { font-family: Arial; padding: 30px; }
      .card { max-width: 700px; margin: auto; padding: 25px; border: 1px solid #ccc; border-radius: 10px; }
      .header { text-align: center; margin-bottom: 20px; }
      h1 { margin: 0; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      table, th, td { border: 1px solid #ddd; }
      th, td { padding: 10px; text-align: left; }
      .text-right { text-align: right; }
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
      }
      .footer {
        margin-top: 40px;
        font-size: 14px;
        color: #444;
        line-height: 1.6;
      }
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
      <p><strong>Invoice:</strong> ${order.invoiceNumber}</p>
      <p><strong>Customer:</strong> ${order.name}</p>
      <p><strong>Email:</strong> ${order.email}</p>
      <p><strong>Phone:</strong> ${order.phone}</p>
      <p><strong>Address:</strong> ${order.address}</p>

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
          ${products
            .map(
              (p, i) => `
            <tr>
              <td>${i + 1}</td>
              <td>${p.name}</td>
              <td>${p.quantity}</td>
              <td>${Math.round(p.finalPrice)}</td>
              <td>${Math.round(p.finalPrice) * p.quantity}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>

      <h3 class="text-right" style="margin-top: 20px;">
        Subtotal: ${subtotal} TK
      </h3>

      ${
        discount > 0
          ? `<h3 class="text-right">Discount: -${discount} TK</h3>`
          : ""
      }

      <h3 class="text-right">Delivery Charge: ${delivery} TK</h3>

      <h2 class="text-right">Grand Total: ${total} TK</h2>

      <!-- Footer Section -->
      <div class="footer">
        <hr style="margin: 20px 0;" />

        <p><strong>Thank You for Shopping with Coconut BD ✓</strong></p>

        <p>
          ✓ Returns accepted within <strong>48 hours</strong> of delivery.<br/>
          ✓ Product must be unused & in original packaging.<br/>
          ✓ Incorrect/damaged items require an unboxing video.<br/>
          ✓ Delivery charge is non-refundable (except our mistake).
        </p>

        <p style="text-align:center; margin-top:10px; font-size:13px; color:#666;">
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
            {p.name} × {p.quantity} = {Math.round(p.finalPrice) * p.quantity} TK
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
