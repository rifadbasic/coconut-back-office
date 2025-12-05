import React, { useState, useEffect } from "react";
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
    country: "",
    category: "Food",
    stock: 0,
    discount: 0,
    price: 0,
    finalPrice: 0,
    weight: "",
  });

  // 🔥 Auto-calc final price
  useEffect(() => {
    const { price, discount } = formData;
    const final = price - (price * discount) / 100;
    setFormData((prev) => ({ ...prev, finalPrice: final }));
  }, [formData.price, formData.discount]);

  // 📸 Image upload
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
      const imageUrl = res.data.data.url;

      setFormData((prev) => ({ ...prev, img: imageUrl }));
    } catch (error) {
      console.log("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  // 🎯 Input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["price", "discount", "stock"].includes(name)) {
      setFormData({ ...formData, [name]: Number(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // 💾 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.img) {
      return Swal.fire({
        icon: "warning",
        title: "Image Missing!",
        text: "Please upload an image first.",
      });
    }

    try {
      const res = await axiosSecure.post("/products", formData);

      if (res.data?.insertedId) {
        Swal.fire({
          icon: "success",
          title: "Product Added!",
          timer: 2000,
          showConfirmButton: false,
        });

        // Reset form
        setFormData({
          img: "",
          name: "",
          shortDesc: "",
          country: "",
          category: "Food",
          stock: 0,
          discount: 0,
          price: 0,
          finalPrice: 0,
          weight: "",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Something went wrong.",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow-md flex flex-col gap-4"
    >
      <h2 className="text-2xl font-bold text-center">Add Product</h2>

      {formData.img && (
        <img
          src={formData.img}
          className="w-32 h-32 rounded object-cover mx-auto"
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Image Upload */}
        <div className="flex flex-col">
          <label className="font-semibold">Image Upload</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="border px-3 py-2 rounded"
          />
          {uploading && (
            <span className="text-blue-600 text-sm">Uploading…</span>
          )}
        </div>

        <div className="flex flex-col">
          <label className="font-semibold">Name</label>
          <input
            type="text"
            name="name"
            className="border px-3 py-2 rounded"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col md:col-span-2">
          <label className="font-semibold">Short Description</label>
          <input
            type="text"
            name="shortDesc"
            className="border px-3 py-2 rounded"
            value={formData.shortDesc}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold">Country</label>
          <input
            type="text"
            name="country"
            className="border px-3 py-2 rounded"
            value={formData.country}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold">Category</label>
          <select
            name="category"
            className="border px-3 py-2 rounded"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="Oil">Oil</option>
            <option value="Food">Food</option>
            <option value="Goods">Goods</option>
            <option value="Showpic">Showpic</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="font-semibold">Stock</label>
          <input
            type="number"
            name="stock"
            className="border px-3 py-2 rounded"
            value={formData.stock}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold">Price ($)</label>
          <input
            type="number"
            name="price"
            className="border px-3 py-2 rounded"
            value={formData.price}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold">Discount (%)</label>
          <input
            type="number"
            name="discount"
            className="border px-3 py-2 rounded"
            value={formData.discount}
            onChange={handleChange}
          />
        </div>

        {/* Final Price */}
        <div className="flex flex-col">
          <label className="font-semibold">Final Price</label>
          <input
            type="text"
            className="border px-3 py-2 rounded bg-gray-100"
            value={formData.finalPrice.toFixed(2)}
            readOnly
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold">Weight</label>
          <input
            type="text"
            name="weight"
            className="border px-3 py-2 rounded"
            value={formData.weight}
            onChange={handleChange}
          />
        </div>
      </div>

      <button
        disabled={uploading}
        className={`${
          uploading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
        } text-white px-4 py-2 rounded`}
      >
        {uploading ? "Uploading..." : "Add Product"}
      </button>
    </form>
  );
};

export default AddProductForm;
