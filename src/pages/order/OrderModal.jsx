import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root"); // required

const OrderModal = ({ order, isOpen, onClose }) => {
  const totalPrice =
    order.products.reduce((sum, p) => sum + p.price * p.qty, 0) +
    order.deliveryCost;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white p-6 rounded-lg max-w-xl mx-auto mt-20 shadow-lg outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50"
    >
      <h2 className="text-2xl font-bold mb-4">{order.customerName} Order</h2>
      <p>Email: {order.email}</p>
      <p>Phone: {order.phone}</p>
      <p>Address: {order.address}</p>
      <p>Invoice: {order.invoice}</p>

      <h3 className="mt-4 font-semibold">Products:</h3>
      <ul className="list-disc list-inside">
        {order.products.map((p, i) => (
          <li key={i}>
            {p.name} x {p.qty} = ${p.price * p.qty}
          </li>
        ))}
      </ul>
      <p className="mt-2 font-semibold">Delivery: ${order.deliveryCost}</p>
      <p className="font-bold text-lg">Total: ${totalPrice}</p>

      <div className="mt-6 flex justify-end gap-3">
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
