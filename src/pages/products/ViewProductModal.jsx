import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const ViewProductModal = ({ product, isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white p-6 rounded-lg max-w-xl mx-auto mt-20 shadow-lg outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50"
    >
      <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
      <img
        src={product.img}
        alt={product.name}
        className="w-40 h-40 object-cover rounded mb-4"
      />
      <p><strong>Short Desc:</strong> {product.shortDesc}</p>
      <p><strong>Country:</strong> {product.country}</p>
      <p><strong>Category:</strong> {product.category}</p>
      <p><strong>Stock:</strong> {product.stock}</p>
      <p><strong>Price:</strong> ${product.price}</p>
      <p><strong>Discount:</strong> ${product.discount}</p>
      <p><strong>Weight:</strong> {product.weight}</p>

      <div className="mt-6 flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default ViewProductModal;
