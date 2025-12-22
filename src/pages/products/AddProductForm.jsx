import React, { useState } from "react";
import Swal from "sweetalert2";
import useAxios from "../../hook/useAxios";
import axios from "axios";

const AddProductForm = () => {
  const axiosSecure = useAxios();
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    img: "",
    name: "",
    shortDesc: "",
    brand: "",
    country: "",
    category: "Food",
    stock: 0,
    price: 0,
    discount: 0,
    status: "In Stock",
    description: [""],
  });

  // 🔢 Final Price (Derived – No Risk)
  const finalPrice = Math.max(
    formData.price - (formData.price * formData.discount) / 100,
    0
  ).toFixed(2);

  // 📸 Image Upload
  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    if (!image) return;

    setUploading(true);
    const fd = new FormData();
    fd.append("image", image);

    try {
      const url = `https://api.imgbb.com/1/upload?key=${
        import.meta.env.VITE_image_uplode_key
      }`;
      const res = await axios.post(url, fd);
      setFormData((prev) => ({ ...prev, img: res.data.data.url }));
    } catch {
      Swal.fire("Error", "Image upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  // ✏️ Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["price", "discount", "stock"].includes(name)) {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // 🧾 Description List
  const handleDescChange = (index, value) => {
    const updated = [...formData.description];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, description: updated }));
  };

  const addDescField = () => {
    setFormData((prev) => ({
      ...prev,
      description: [...prev.description, ""],
    }));
  };

  // 💾 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.img) {
      return Swal.fire("Warning", "Please upload product image", "warning");
    }

    const payload = {
      ...formData,
      finalPrice: Number(finalPrice),
      description: formData.description.filter(Boolean),
    };

    try {
      const res = await axiosSecure.post("/products", payload);

      if (res.data?.insertedId) {
        Swal.fire("Success", "Product added successfully!", "success");

        setFormData({
          img: "",
          name: "",
          shortDesc: "",
          brand: "",
          country: "",
          category: "Food",
          stock: 0,
          price: 0,
          discount: 0,
          status: "In Stock",
          description: [""],
        });
      }
    } catch {
      Swal.fire("Error", "Failed to add product", "error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow-md flex flex-col gap-4"
    >
      {formData.img && (
        <img
          src={formData.img}
          alt="preview"
          className="w-32 h-32 rounded object-cover mx-auto"
        />
      )}

      {/* stylist IMAGE */}
      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-green-400 rounded-lg cursor-pointer bg-green-50 hover:bg-green-100 transition">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg
            className="w-8 h-8 mb-3 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16V4a1 1 0 011-1h8a1 1 0 011 1v12m-5 4v-4m0 0l-2 2m2-2l2 2"
            />
          </svg>

          <p className="mb-1 text-sm text-green-700">
            <span className="font-semibold">Click to upload</span> or drag &
            drop
          </p>
          <p className="text-xs text-gray-500">PNG, JPG, JPEG (Max 5MB)</p>
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </label>
      
      {/* BASIC INFO */}
      <input
        name="name"
        placeholder="Product Name"
        value={formData.name}
        onChange={handleChange}
        required
        className="border p-2 rounded"
      />

      <textarea
        name="shortDesc"
        placeholder="Short description (1–2 lines)"
        value={formData.shortDesc}
        onChange={handleChange}
        className="border p-2 rounded resize-none"
        rows={2}
      />

      <input
        name="brand"
        placeholder="Brand"
        value={formData.brand}
        onChange={handleChange}
        className="border p-2 rounded"
      />

      <input
        name="country"
        placeholder="Country"
        value={formData.country}
        onChange={handleChange}
        className="border p-2 rounded"
      />

      {/* CATEGORY */}
      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        className="border p-2 rounded"
      >
        <option>Body Care</option>
        <option>Hair Care</option>
        <option>Face Care</option>
        <option>Skin Care</option>
        <option>Eyes Care</option>
        <option>Oral Care</option>
        <option>Accessories</option>
        <option>Cosmetics</option>
        <option>Wearables</option>
      </select>

      {/* STATUS */}
      <select
        name="status"
        placeholder="Status"
        value={formData.status}
        onChange={handleChange}
        className="border p-2 rounded"
      >
        <option>In Stock</option>
        <option>Out of Stock</option>
        <option>Limited</option>
      </select>

      {/* stock */}
      <label className="font-semibold">Stock Quantity: </label>
      <input
        name="stock"
        type="number"
        placeholder="Stock"
        value={formData.stock}
        onChange={handleChange}
        className="border p-2 rounded"
      />

      {/* PRICING */}
      <div className="grid grid-rows-1 md:grid-cols-2 gap-4">
        <div className="col-span-1">
          <label className="font-semibold">Pricing: </label>
          <input
            name="price"
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>
        <div className="col-span-1">
          <label className="font-semibold">Discount (%): </label>
          <input
            name="discount"
            type="number"
            placeholder="Discount %"
            value={formData.discount}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>
      </div>

      <input
        value={`Final Price: ${finalPrice} Tk.`}
        readOnly
        className="border p-2 rounded bg-gray-100"
      />

      {/* DESCRIPTION LIST */}
      <div>
        <label className="font-semibold">Product Details</label>
        {formData.description.map((desc, i) => (
          <input
            key={i}
            value={desc}
            onChange={(e) => handleDescChange(i, e.target.value)}
            placeholder={`• Point ${i + 1}`}
            className="border p-2 rounded mt-2 w-full"
          />
        ))}
        <button
          type="button"
          onClick={addDescField}
          className="text-sm text-green-600 mt-2"
        >
          + Add more
        </button>
      </div>

      <button
        disabled={uploading}
        className="bg-green-600 hover:bg-green-700 text-white py-2 rounded"
      >
        {uploading ? "Uploading..." : "Add Product"}
      </button>
    </form>
  );
};

export default AddProductForm;
