import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";

Modal.setAppElement("#root");

const categories = [
  "body care",
  "hair care",
  "face care",
  "skin care",
  "eyes care",
  "oral care",
  "accessories",
  "cosmetics",
  "wearables",
];

const statuses = ["regular", "new", "combo", "disabled"];

const EditProductModal = ({ product, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    description: [],
  });
  const [preview, setPreview] = useState("");
  const [finalPrice, setFinalPrice] = useState(0);

  useEffect(() => {
    if (!product) return;

    setFormData({
      ...product,
      stock: Number(product.stock),
      price: Number(product.price),
      discount: Number(product.discount),
      description: product.description || [],
    });

    setPreview(product.img || "");
  }, [product]);

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

    const url = `https://api.imgbb.com/1/upload?key=${
      import.meta.env.VITE_image_uplode_key
    }`;

    const res = await axios.post(url, fd);
    setFormData((p) => ({ ...p, img: res.data.data.url }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleDescChange = (index, value) => {
    const updated = [...formData.description];
    updated[index] = value;
    setFormData((p) => ({ ...p, description: updated }));
  };

  const addDescField = () => {
    setFormData((p) => ({
      ...p,
      description: [...p.description, ""],
    }));
  };

  const handleSave = () => {
    onSave({
      ...formData,
      stock: Number(formData.stock),
      price: Number(formData.price),
      discount: Number(formData.discount),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white p-6 rounded-lg max-w-4xl mx-auto mt-10 shadow-lg outline-none max-h-[90vh] overflow-y-auto"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Edit Product</h2>

      {preview && (
        <img src={preview} className="w-40 h-40 mx-auto rounded mb-6" />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="font-bold block mb-1">Product Image</label>
          <input type="file" onChange={handleImage} />
        </div>

        <div>
          <label className="font-bold block mb-1">Product Name</label>
          <input
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="font-bold block mb-1">Short Description</label>
          <textarea
            name="shortDesc"
            value={formData.shortDesc || ""}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="font-bold block mb-1">Brand</label>
          <input
            name="brand"
            value={formData.brand || ""}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="font-bold block mb-1">Country</label>
          <input
            name="country"
            value={formData.country || ""}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="font-bold block mb-1">Category</label>
          <select
            name="category"
            value={formData.category || ""}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-bold block mb-1">Stock Status</label>
          <select
            name="status"
            value={formData.status || ""}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            {statuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-bold block mb-1">Stock Quantity</label>
          <input
            type="number"
            name="stock"
            value={formData.stock || 0}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="font-bold block mb-1">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price || 0}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="font-bold block mb-1">Discount (%)</label>
          <input
            type="number"
            name="discount"
            value={formData.discount || 0}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <div className="col-span-2 text-sm mt-2">
          <span className="font-bold">Final Price:</span> ৳ {finalPrice}
        </div>
      </div>

      <div className="mt-6">
        <label className="font-bold block mb-2">Product Details</label>

        {formData.description.map((desc, i) => (
          <input
            key={i}
            value={desc}
            onChange={(e) => handleDescChange(i, e.target.value)}
            placeholder={`• Point ${i + 1}`}
            className="border p-2 rounded mt-2 w-full"
          />
        ))}

        <button onClick={addDescField} className="text-sm text-green-600 mt-2">
          + Add more
        </button>
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
