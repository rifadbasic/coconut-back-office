import React from "react";
import AddProductForm from "./AddProductForm";

const AddProduct = () => {
  return (
    <div className="p-6 bg-green-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-green-900 text-center">
        Add New Product
      </h1>

      <div className="max-w-3xl mx-auto">
        <AddProductForm />
      </div>
    </div>
  );
};

export default AddProduct;
