import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import AddProductForm from "./AddProductForm";
import ViewProductModal from "./ViewProductModal";
import EditProductModal from "./EditProductModal";
import useAxios from "../../hook/useAxios";

const Products = () => {
  const axiosSecure = useAxios();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 🔹 Fetch Products
  const fetchProducts = async () => {
    try {
      const res = await axiosSecure.get("/products", {
        params: { search, page: currentPage, limit: 10 },
      });

      if (res.data.success) {
        setProducts(res.data.products || []);
        setTotalPages(res.data.totalPages || 1);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      Swal.fire("Error", "Failed to load products", "error");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, search]);

  // 🔹 Add Product
  const handleAddProduct = (newProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  // 🔹 Delete Product
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You can't undo this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });
    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/products/${id}`);
        if (res.data.success) {
          Swal.fire("Deleted!", "Product deleted.", "success");
          fetchProducts();
        }
      } catch (error) {
        Swal.fire("Error", "Failed to delete product", "error");
      }
    }
  };

  // 🔹 Save Edited Product
  const handleEditSave = async (updatedProduct) => {
    try {
      const res = await axiosSecure.put(
        `/products/${updatedProduct._id}`,
        updatedProduct
      );

      if (res.data.success) {
        Swal.fire("Updated!", "Product updated successfully.", "success");
        setEditModalOpen(false);
        fetchProducts();
      } else {
        Swal.fire("Error", "No changes were made.", "warning");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to update product", "error");
    }
  };

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-green-900">Products</h1>

      <input
        type="text"
        placeholder="Search product..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        className="w-full md:w-1/3 border px-3 py-2 rounded mb-4"
      />

      <AddProductForm onAdd={handleAddProduct} />

      <div className="overflow-x-auto mt-6">
        {products.length ? (
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-green-900 text-white">
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Final Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b  hover:bg-green-50">
                  <td>
                    <img
                      src={p.img}
                      alt={p.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td>{p.name}</td>
                  <td>${p.price}</td>
                  <td>{p.discount}%</td>
                  <td>
                    ${(p.price - (p.price * p.discount) / 100).toFixed(2)}
                  </td>
                  <td>{p.stock}</td>
                  <td className="flex mt-2 gap-2">
                    <button
                      onClick={() => {
                        setSelectedProduct(p);
                        setViewModalOpen(true);
                      }}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        setSelectedProduct(p);
                        setEditModalOpen(true);
                      }}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-600 mt-10">No products found.</p>
        )}
      </div>

      <div className="flex justify-center mt-6 gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-3 py-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

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
