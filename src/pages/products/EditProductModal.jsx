import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";

Modal.setAppElement("#root");

const EditProductModal = ({ product, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({});
  const [preview, setPreview] = useState("");
  const [finalPrice, setFinalPrice] = useState(0);

  // Update local state when product changes
  useEffect(() => {
    setFormData(product || {});
    setPreview(product?.img || "");
  }, [product]);

  // Calculate final price whenever price or discount changes
  useEffect(() => {
    const price = Number(formData.price) || 0;
    const discount = Number(formData.discount) || 0;
    const discountedPrice = price - (price * discount) / 100;
    setFinalPrice(discountedPrice);
  }, [formData.price, formData.discount]);

  const imgHandleChange = async (e) => {
    e.preventDefault();
    const image = e.target.files[0];
    if (!image) return;

    setPreview(URL.createObjectURL(image));
    const imgForm = new FormData();
    imgForm.append("image", image);

    try {
      const uploadUrl = `https://api.imgbb.com/1/upload?key=${
        import.meta.env.VITE_image_uplode_key
      }`;
      
      const res = await axios.post(uploadUrl, imgForm);
      const imageUrl = res.data.data.url;

      setFormData((prev) => ({ ...prev, img: imageUrl }));
    } catch (error) {
      console.error("Image upload failed:", error);
    } 
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    onSave({ ...formData, finalPrice });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white p-6 rounded-lg max-w-3xl mx-auto mt-10 shadow-lg outline-none max-h-[90vh] overflow-y-auto"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Edit Product</h2>

      {/* Image Preview */}
      {preview && (
        <img
          src={preview}
          alt="preview"
          className="w-40 h-40 object-cover mb-4 mx-auto rounded"
        />
      )}

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label>
          Image:
          <input
            type="file"
            name="img"
            accept="image/*"
            onChange={imgHandleChange}
            className="w-full mt-1"
          />
        </label>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mt-1"
          />
        </label>
        <label>
          Short Description:
          <input
            type="text"
            name="shortDesc"
            value={formData.shortDesc || ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mt-1"
          />
        </label>
        <label>
          Country:
          <input
            type="text"
            name="country"
            value={formData.country || ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mt-1"
          />
        </label>
        <label>
          Category:
          <select
            name="category"
            value={formData.category || ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mt-1"
          >
            <option value="oil">Oil</option>
            <option value="showpic">Showpic</option>
            <option value="food">Food</option>
            <option value="goods">Goods</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label>
          Stock:
          <input
            type="number"
            name="stock"
            value={formData.stock || ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mt-1"
          />
        </label>
        <label>
          Discount (%):
          <input
            type="number"
            name="discount"
            value={formData.discount || ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mt-1"
          />
        </label>
        <label>
          Price ($):
          <input
            type="number"
            name="price"
            value={formData.price || ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mt-1"
          />
          <p className="text-sm text-gray-600">
            Final Price:{" "}
            <span className="font-bold">${finalPrice.toFixed(2)}</span>
          </p>
        </label>
        <label>
          Weight:
          <input
            type="text"
            name="weight"
            value={formData.weight || ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mt-1"
          />
        </label>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 mt-6">
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

export default EditProductModal;
