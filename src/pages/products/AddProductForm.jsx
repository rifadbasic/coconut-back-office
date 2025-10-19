import React, { useState, useEffect } from "react";

const AddProductForm = ({ onAdd }) => {
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

  // Update actual price whenever price or discount changes
  useEffect(() => {
    const { price, discount } = formData;
    const actual = price - (price * discount) / 100;
    setFormData((prev) => ({ ...prev, actualPrice: actual }));
  }, [formData.price, formData.discount]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "img" && files.length > 0) {
      setFormData({ ...formData, img: URL.createObjectURL(files[0]) });
    } else if (["price", "discount", "stock"].includes(name)) {
      setFormData({ ...formData, [name]: Number(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
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
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow-md flex flex-col gap-4"
    >
      <h2 className="text-xl font-bold mb-2">Add Product</h2>

      {/* Image Preview */}
      {formData.img && (
        <img
          src={formData.img}
          alt="Preview"
          className="w-32 h-32 object-cover mb-4"
        />
      )}

      {/* Form grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="font-semibold">Image</label>
          <input type="file" name="img" onChange={handleChange} />
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
            type="text"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="Stock Available"
            className="border px-3 py-2 rounded"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold">Price ($)</label>
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Real Price"
            className="border px-3 py-2 rounded"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold">Discount (%)</label>
          <input
            type="text"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
            placeholder="Discount Amount"
            className="border px-3 py-2 rounded"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold">Actual Price ($)</label>
          <input
            type="number"
            name="actualPrice"
            value={formData.actualPrice.toFixed(2)}
            readOnly
            className="border px-3 py-2 rounded bg-gray-100"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold">Weight</label>
          <input
            type="text"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            placeholder="Weight"
            className="border px-3 py-2 rounded"
          />
        </div>
      </div>

      <button
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mt-2"
      >
        Add Product
      </button>
    </form>
  );
};

export default AddProductForm;
