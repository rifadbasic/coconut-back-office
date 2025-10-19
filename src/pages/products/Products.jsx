import React, { useState } from "react";
import Swal from "sweetalert2";
import AddProductForm from "./AddProductForm";
import ViewProductModal from "./ViewProductModal";
import EditProductModal from "./EditProductModal";

const Products = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Coconut Oil",
      shortDesc: "Organic coconut oil",
      country: "Bangladesh",
      category: "Oil",
      stock: 50,
      discount: 5,
      price: 15,
      weight: "500ml",
      img: "https://via.placeholder.com/80",
    },
    {
      id: 2,
      name: "Coconut Milk",
      shortDesc: "Fresh coconut milk",
      country: "India",
      category: "Food",
      stock: 30,
      discount: 0,
      price: 10,
      weight: "1L",
      img: "https://via.placeholder.com/80",
    },
  ]);

  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Add new product
  const handleAddProduct = (newProduct) => {
    setProducts([...products, { ...newProduct, id: Date.now() }]);
  };

  // Delete product
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setProducts(products.filter((p) => p.id !== id));
        Swal.fire("Deleted!", "Product has been deleted.", "success");
      }
    });
  };

  // Save edited product
  const handleEditSave = (updatedProduct) => {
    setProducts(
      products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    setEditModalOpen(false);
  };

  // Filter products by search
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-green-900">Products</h1>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search product by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 border px-3 py-2 rounded"
        />
      </div>

      {/* Add Product Form */}
      <AddProductForm onAdd={handleAddProduct} />

      {/* Products Table */}
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-green-900 text-white">
            <tr>
              <th className="py-3 px-4">Image</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Discount</th>
              <th className="py-3 px-4">Actual Price</th>
              <th className="py-3 px-4">Stock</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => {
              const actualPrice =
                product.price - (product.price * product.discount) / 100;
              return (
                <tr key={product.id} className="border-b hover:bg-green-50">
                  <td className="py-3 px-4">
                    <img
                      src={product.img}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="py-3 px-4">{product.name}</td>
                  <td className="py-3 px-4">${product.price}</td>
                  <td className="py-3 px-4">{product.discount}%</td>
                  <td className="py-3 px-4">${actualPrice.toFixed(2)}</td>
                  <td className="py-3 px-4">{product.stock}</td>
                  <td className="py-3 px-4 flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setViewModalOpen(true);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setEditModalOpen(true);
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {viewModalOpen && selectedProduct && (
        <ViewProductModal
          product={selectedProduct}
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
        />
      )}

      {editModalOpen && selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSave={handleEditSave}
        />
      )}
    </div>
  );
};

export default Products;
