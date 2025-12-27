import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import useAxios from "../../hook/useAxios";

Modal.setAppElement("#root");

const EditOrderModal = ({ order, isOpen, onClose, onSave }) => {
  const axiosSecure = useAxios();
  const [data, setData] = useState(order || { cartItems: [] });

  useEffect(() => {
    if (order) setData(order);
  }, [order]);

  // 🔄 Recalculate totals
  const recalc = (cartItems, extra = {}) => {
    const subtotal = cartItems.reduce((sum, p) => {
      const finalPrice = Math.round(p.price );
      return sum + finalPrice * p.quantity;
    }, 0);

    const discount =
      (subtotal * Number(extra.orderDiscount ?? data.orderDiscount ?? 0)) / 100;

    setData((prev) => ({
      ...prev,
      cartItems,
      ...extra,
      finalTotal: Math.round(
        subtotal -
          discount +
          Number(extra.deliveryCharge ?? prev.deliveryCharge ?? 0)
      ),
    }));
  };

  // 🔢 Quantity
  const updateQty = (id, type) => {
    const items = data.cartItems.map((p) =>
      p._id === id
        ? {
            ...p,
            quantity:
              type === "inc" ? p.quantity + 1 : Math.max(1, p.quantity - 1),
          }
        : p
    );

    recalc(items);
  };

  // ❌ Remove item
  const removeItem = (id) => {
    const items = data.cartItems.filter((p) => p._id !== id);
    recalc(items);
  };

  // ✏️ Input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    recalc(data.cartItems, { [name]: value });
  };

  // 💾 Save
  const handleSave = async () => {
    const res = await axiosSecure.put(`/orders/${data._id}`, data);
    if (res.data.success) {
      onSave(data);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white p-6 rounded-xl max-w-4xl mx-auto mt-10 shadow-lg"
      overlayClassName="fixed inset-0 bg-black/50 flex justify-center items-start z-50"
    >
      <h2 className="text-2xl font-bold mb-4">Edit Order</h2>

      {/* CUSTOMER INFO */}
      <div className="grid md:grid-cols-2 gap-3">
        {["name", "email", "phone", "address"].map((f) => (
          <input
            key={f}
            name={f}
            value={data[f] || ""}
            onChange={handleChange}
            placeholder={f}
            className="border px-3 py-2 rounded"
          />
        ))}
      </div>

      {/* PRODUCTS */}
      <h3 className="mt-6 font-semibold">Products</h3>

      {data.cartItems?.map((item) => (
        <div
          key={item._id}
          className="flex justify-between items-center border p-3 rounded mt-2"
        >
          <div>
            <p className="font-semibold">{item.name}</p>
            <p className="text-sm text-gray-500">
              {item.price} Tk × {item.quantity}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => updateQty(item._id, "dec")}>−</button>
            <span>{item.quantity}</span>
            <button onClick={() => updateQty(item._id, "inc")}>+</button>
            <button
              onClick={() => removeItem(item._id)}
              className="text-red-600 ml-3"
            >
              ✕
            </button>
          </div>
        </div>
      ))}

      {/* DISCOUNT & DELIVERY */}
      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div>
          <label className="font-semibold block mb-1">Order Discount (%)</label>
          <input
            type="number"
            name="orderDiscount"
            value={data.orderDiscount || 0}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
          />
        </div>

        <div>
          <label className="font-semibold block mb-1">Delivery Charge</label>
          <input
            type="number"
            name="deliveryCharge"
            value={data.deliveryCharge || 0}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
          />
        </div>
      </div>

      {/* TOTAL */}
      <div className="text-right mt-6">
        <p className="text-xl font-bold">
          Final Total: {data.finalTotal || 0} Tk
        </p>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 mt-6">
        <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Save Changes
        </button>
      </div>
    </Modal>
  );
};

export default EditOrderModal;
