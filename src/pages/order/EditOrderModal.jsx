import React, { useState, useEffect } from "react";
import Modal from "react-modal";
// import { FaBangladeshiTakaSign } from "react-icons/fa6";
import useAxios from "../../hook/useAxios";

Modal.setAppElement("#root"); // required

const EditOrderModal = ({ order, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState(order);

  const axiosSecure = useAxios();

  console.log(formData)

  useEffect(() => {
    setFormData(order);
  }, [order]);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const res = await axiosSecure.put(`/orders/${formData._id}`, formData);

    if (res.data.success) onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white p-6 rounded-lg max-w-xl mx-auto mt-20 shadow-lg outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50"
    >
      <h2 className="text-2xl font-bold mb-4">Edit Order</h2>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Customer Name"
        className="w-full border px-3 py-2 rounded mb-2"
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        className="w-full border px-3 py-2 rounded mb-2"
      />
      <input
        type="text"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Phone"
        className="w-full border px-3 py-2 rounded mb-2"
      />
      <input
        type="text"
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="Address"
        className="w-full border px-3 py-2 rounded mb-2"
      />
      <input
        type="text"
        name="invoiceNumber"
        value={formData.invoiceNumber}
        onChange={handleChange}
        placeholder="Invoice"
        className="w-full border px-3 py-2 rounded mb-2"
      />
      <input
        type="number"
        name="deliveryCharge"
        value={formData.deliveryCharge}
        onChange={handleChange}
        placeholder="Delivery Cost"
        className="w-full border px-3 py-2 rounded mb-4"
      />

      <input 
        type="number"
        name="finalTotal"
        value={(Math.round(formData.finalTotal))}
        onChange={handleChange}
        placeholder="Total Price"
        className="w-full border px-3 py-2 rounded mb-4"
        >
      </input>

      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Save
        </button>
      </div>
    </Modal>
  );
};

export default EditOrderModal;
