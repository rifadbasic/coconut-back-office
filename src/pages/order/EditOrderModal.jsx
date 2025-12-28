import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import useAxios from "../../hook/useAxios";
import Swal from "sweetalert2";

Modal.setAppElement("#root");

const EditOrderModal = ({ order, isOpen, onClose, onSave }) => {
  const axiosSecure = useAxios();
  const [data, setData] = useState(null);
  const [originalItems, setOriginalItems] = useState([]);

  useEffect(() => {
    if (order) {
      const cloned = JSON.parse(JSON.stringify(order));

      setData({
        _id: cloned._id,
        customer: cloned.customer,
        cartItems: cloned.cartItems,
        pricing: cloned.pricing,
        status: cloned.status,
      });

      setOriginalItems(
        cloned.cartItems.map((i) => ({
          _id: i.productId || i._id,
          quantity: i.quantity,
        }))
      );
    }
  }, [order]);

  if (!data) return null;

  // 🔁 RECALCULATE TOTALS
  const recalc = (items, extraPricing = {}) => {
    const subtotal = items.reduce((sum, p) => sum + p.price * p.quantity, 0);

    const discountPercentage = Number(
      extraPricing.discountPercentage ?? data.pricing.discountPercentage ?? 0
    );
    const discountAmount = Math.round((subtotal * discountPercentage) / 100);

    const deliveryCharge = Number(
      extraPricing.deliveryCharge ?? data.pricing.deliveryCharge ?? 0
    );

    const finalTotal = subtotal - discountAmount + deliveryCharge;

    setData((prev) => ({
      ...prev,
      cartItems: items,
      pricing: {
        ...prev.pricing,
        subtotal,
        discountPercentage,
        discountAmount,
        deliveryCharge,
        finalTotal,
      },
    }));
  };

  // 🔢 Quantity update
  const updateQty = (id, type) => {
    const updated = data.cartItems.map((p) =>
      p.productId === id || p._id === id
        ? {
            ...p,
            quantity:
              type === "inc" ? p.quantity + 1 : Math.max(1, p.quantity - 1),
          }
        : p
    );
    recalc(updated);
  };

  // ❌ Remove item
  const removeItem = (id) => {
    const updated = data.cartItems.filter((p) => (p.productId || p._id) !== id);
    recalc(updated);
  };

  // ✏️ Discount % & Delivery change
  const handlePricingChange = (e) => {
    const { name, value } = e.target;
    recalc(data.cartItems, { [name]: Number(value) });
  };

  // ✏️ Customer address & phone change
  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      customer: {
        ...prev.customer,
        [name]: value,
      },
    }));
  };

  // 💾 SAVE
  const handleSave = async () => {
    const payload = {
      customer: data.customer,
      cartItems: data.cartItems,
      pricing: data.pricing,
      status: data.status,
      originalItems,
    };

    const res = await axiosSecure.put(`/orders/${data._id}`, payload);
    if (res.data.success) {
      Swal.fire("Updated!", "Order updated successfully.", "success");
      onSave({ ...order, ...data });
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white p-6 rounded-xl max-w-4xl mx-auto mt-10"
      overlayClassName="fixed inset-0 bg-black/50 flex justify-center items-start z-50"
    >
      <h2 className="text-2xl font-bold mb-4">Edit Order</h2>

      {/* 🌟 SCROLLABLE CONTENT */}
      <div className="max-h-[70vh] overflow-y-auto pr-2">
        {/* CUSTOMER INFO */}
        <div className="grid md:grid-cols-2 gap-3">
          {["name", "email"].map((f) => (
            <div key={f}>
              <label className="block text-sm font-semibold mb-1 capitalize">
                Customer {f}
              </label>
              <input
                value={data.customer?.[f] || ""}
                readOnly
                className="border px-3 py-2 rounded w-full bg-gray-100"
              />
            </div>
          ))}

          {["phone", "address"].map((f) => (
            <div key={f}>
              <label className="block text-sm font-semibold mb-1 capitalize">
                Customer {f}
              </label>
              <input
                name={f}
                value={data.customer?.[f] || ""}
                onChange={handleCustomerChange}
                className="border px-3 py-2 rounded w-full"
              />
            </div>
          ))}
        </div>

        {/* PRODUCTS */}
        <h3 className="mt-6 font-semibold">Products</h3>
        {data.cartItems.map((item) => (
          <div
            key={item.productId || item._id}
            className="flex justify-between items-center border p-3 rounded mt-2"
          >
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-500">
                {item.price} × {item.quantity}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQty(item.productId || item._id, "dec")}
              >
                −
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => updateQty(item.productId || item._id, "inc")}
              >
                +
              </button>
              <button
                onClick={() => removeItem(item.productId || item._id)}
                className="text-red-600 ml-3"
              >
                ✕
              </button>
            </div>
          </div>
        ))}

        {/* DISCOUNT & DELIVERY */}
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <div>
            <label className="block font-semibold">
              Discount Percentage (%)
            </label>
            <input
              type="number"
              name="discountPercentage"
              value={data.pricing.discountPercentage || 0}
              onChange={handlePricingChange}
              className="border px-3 py-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block font-semibold">Discount Amount (TK)</label>
            <input
              value={data.pricing.discountAmount || 0}
              readOnly
              className="border px-3 py-2 rounded w-full bg-gray-100"
            />
          </div>

          <div>
            <label className="block font-semibold">Delivery Charge</label>
            <input
              type="number"
              name="deliveryCharge"
              value={data.pricing.deliveryCharge || 0}
              onChange={handlePricingChange}
              className="border px-3 py-2 rounded w-full"
            />
          </div>
        </div>

        <div className="text-right mt-6 font-bold text-xl">
          Final Total: {data.pricing.finalTotal} Tk
        </div>
      </div>

      {/* FOOTER BUTTONS */}
      <div className="flex justify-end gap-3 mt-6">
        <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
      </div>
    </Modal>
  );
};

export default EditOrderModal;
