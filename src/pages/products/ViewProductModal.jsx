import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const ViewProductModal = ({ product, isOpen, onClose }) => {
  if (!product) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white p-6 rounded-lg max-w-xl mx-auto mt-20 shadow-lg outline-none max-h-[90vh] overflow-y-auto"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50"
    >
      {/* Product Name */}
      <h2 className="text-2xl font-bold mb-6 text-center">{product.name}</h2>

      {/* Product Image */}
      <div className="flex justify-center mb-6">
        <img
          src={product.img}
          alt={product.name}
          className="w-48 h-48 object-cover rounded"
        />
      </div>

      {/* Product Info */}
      <div className="space-y-2 text-sm">
        <p>
          <strong>Short Description:</strong> {product.shortDesc}
        </p>

        <p>
          <strong>Brand:</strong> {product.brand}
        </p>

        <p>
          <strong>Country:</strong> {product.country}
        </p>

        <p>
          <strong>Category:</strong> {product.category}
        </p>

        <p>
          <strong>Status:</strong> {product.status}
        </p>

        <p>
          <strong>Stock:</strong> {product.stock}
        </p>

        <p>
          <strong>Price:</strong> ৳ {product.price}
        </p>

        <p>
          <strong>Discount:</strong> {product.discount}%
        </p>

        <p>
          <strong>Final Price:</strong> ৳ {product.finalPrice}
        </p>
      </div>

      {/* Description Array */}
      <div className="mt-6">
        <h3 className="font-bold mb-2">Product Details</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          {product.description?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div className="mt-8 flex justify-end">
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
