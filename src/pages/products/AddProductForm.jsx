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
    actualPrice: 0,
    weight: "",
  });

  // 🧮 Calculate actual price automatically
  useEffect(() => {
    const { price, discount } = formData;
    const actual = price - (price * discount) / 100;
    setFormData((prev) => ({ ...prev, actualPrice: actual }));
  }, [formData.price, formData.discount]);

  // 📸 Upload image to imgbb
  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    if (!image) return;

    setUploading(true);
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
      
    } finally {
      setUploading(false);
    }
  };

  // 🎯 Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["price", "discount", "stock"].includes(name)) {
      setFormData({ ...formData, [name]: Number(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // 💾 Submit to MongoDB
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.img) {
      Swal.fire({
        icon: "warning",
        title: "Image Missing!",
        text: "Please upload an image first.",
      });
      return;
    }

    try {
      const res = await axiosSecure.post("/products", formData);
      if (res.data?.insertedId || res.data?.result?.insertedId) {
        Swal.fire({
          icon: "success",
          title: "Product Added!",
          text: "Your product has been added successfully.",
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
          actualPrice: 0,
          weight: "",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Something went wrong while saving the product.",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow-md flex flex-col gap-4"
    >
      <h2 className="text-2xl font-bold mb-2 text-center">Add Product</h2>

      {/* Image Preview */}
      {formData.img && (
        <img
          src={formData.img}
          alt="Preview"
          className="w-32 h-32 object-cover mb-4 mx-auto rounded"
        />
      )}

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Upload image */}
        <div className="flex flex-col">
          <label className="font-semibold">Image Upload</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="border px-3 py-2 rounded"
          />
          {uploading && (
            <span className="text-sm text-blue-600 mt-1">Uploading...</span>
          )}
        </div>

        <div className="flex flex-col">
          <label className="font-semibold">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="border px-3 py-2 rounded"
            required
          />
        </div>

        <div className="flex flex-col md:col-span-2">
          <label className="font-semibold">Short Description</label>
          <input
            type="text"
            name="shortDesc"
            value={formData.shortDesc}
            onChange={handleChange}
            placeholder="Short Description"
            className="border px-3 py-2 rounded w-full"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold">Country</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Country"
            className="border px-3 py-2 rounded"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
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
            value={formData.stock || 0}
            onChange={handleChange}
            placeholder="Stock Available"
            className="border px-3 py-2 rounded"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold">Price ($)</label>
          <input
            type="number"
            name="price"
            value={formData.price || 0 }
            onChange={handleChange}
            placeholder="Real Price"
            className="border px-3 py-2 rounded"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold">Discount (%)</label>
          <input
            type="number"
            name="discount"
            value={formData.discount || 0}
            onChange={handleChange}
            placeholder="Discount Amount"
            className="border px-3 py-2 rounded"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold">Actual Price ($)</label>
          <input
            type="text"
            name="actualPrice"
            value={formData.actualPrice.toFixed(2) || 0}
            readOnly
            className="border px-3 py-2 rounded bg-gray-100"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold">Weight</label>
          <input
            type="text"
            name="weight"
            value={formData.weight || 0 }
            onChange={handleChange}
            placeholder="Weight"
            className="border px-3 py-2 rounded"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={uploading}
        className={`${
          uploading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        } text-white px-4 py-2 rounded mt-4`}
      >
        {uploading ? "Uploading..." : "Add Product"}
      </button>
    </form>
  );
};

export default AddProductForm;
