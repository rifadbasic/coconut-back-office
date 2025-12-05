import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";

Modal.setAppElement("#root");

const EditProductModal = ({ product, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({});
  const [preview, setPreview] = useState("");
  const [finalPrice, setFinalPrice] = useState(0);

  // Load product into state
  useEffect(() => {
    setFormData(product || {});
    setPreview(product?.img || "");
  }, [product]);

  // Auto calculate final price
  useEffect(() => {
    const price = Number(formData.price) || 0;
    const discount = Number(formData.discount) || 0;
    setFinalPrice(price - (price * discount) / 100);
  }, [formData.price, formData.discount]);

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));

    const fd = new FormData();
    fd.append("image", file);

    try {
      const url = `https://api.imgbb.com/1/upload?key=${
        import.meta.env.VITE_image_uplode_key
      }`;
      const res = await axios.post(url, fd);
      setFormData((p) => ({ ...p, img: res.data.data.url }));
    } catch (err) {
      console.log("Upload error", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    onSave({ ...formData }); // finalPrice NOT sent
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white p-6 rounded-lg max-w-3xl mx-auto mt-10 shadow-lg outline-none max-h-[90vh] overflow-y-auto"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Edit Product</h2>

      {preview && (
        <img
          src={preview}
          className="w-40 h-40 object-cover mx-auto rounded mb-4"
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label>
          Image:
          <input type="file" onChange={handleImage} className="w-full mt-1" />
        </label>

        <label>
          Name:
          <input
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            className="border w-full px-3 py-2 rounded mt-1"
          />
        </label>

        <label>
          Short Desc:
          <input
            name="shortDesc"
            value={formData.shortDesc || ""}
            onChange={handleChange}
            className="border w-full px-3 py-2 rounded mt-1"
          />
        </label>

        <label>
          Country:
          <input
            name="country"
            value={formData.country || ""}
            onChange={handleChange}
            className="border w-full px-3 py-2 rounded mt-1"
          />
        </label>

        <label>
          Category:
          <select
            name="category"
            value={formData.category || ""}
            onChange={handleChange}
            className="border w-full px-3 py-2 rounded mt-1"
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
            className="border w-full px-3 py-2 rounded mt-1"
          />
        </label>

        <label>
          Discount (%):
          <input
            type="number"
            name="discount"
            value={formData.discount || ""}
            onChange={handleChange}
            className="border w-full px-3 py-2 rounded mt-1"
          />
        </label>

        <label>
          Price:
          <input
            type="number"
            name="price"
            value={formData.price || ""}
            onChange={handleChange}
            className="border w-full px-3 py-2 rounded mt-1"
          />
          <p className="text-sm mt-1">
            Final Price: <b>${finalPrice.toFixed(2)}</b>
          </p>
        </label>

        <label>
          Weight:
          <input
            name="weight"
            value={formData.weight || ""}
            onChange={handleChange}
            className="border w-full px-3 py-2 rounded mt-1"
          />
        </label>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button onClick={onClose} className="bg-gray-400 px-4 py-2 rounded">
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </div>
    </Modal>
  );
};

export default EditProductModal;
