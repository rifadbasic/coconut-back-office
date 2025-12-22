import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import ViewProductModal from "./ViewProductModal";
import EditProductModal from "./EditProductModal";
import useAxios from "../../hook/useAxios";
import { Link } from "react-router";
import { PlusCircle } from "lucide-react";

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
      Swal.fire("Error", "Failed to load products", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, search]);

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
      } catch {
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
      }
    } catch {
      Swal.fire("Error", "Failed to update product", "error");
    }
  };

  return (
    <div className="p-4 md:p-6 bg-green-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-[var(--secondary-color)]">Products</h1>

        <Link
          to="/add-product"
          className="bg-[var(--secondary-color)] hover:bg-[var(--primary-color)] flex justify-center items-center gap-2 text-white px-4 py-2 rounded w-full md:w-auto text-center"
        >
          <PlusCircle size={20} /> Add Product
        </Link>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search product..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        className="w-full md:w-1/3 border px-3 py-2 rounded mb-6"
      />

      {/* Table */}
      <div className="overflow-x-auto">
        {products.length ? (
          <>
            <table className="min-w-full bg-white shadow rounded">
              <thead className="bg-[var(--secondary-color)] text-white">
                <tr>
                  <th className="p-2">Image</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Discount</th>
                  <th className="p-2">Final</th>
                  <th className="p-2">Stock</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((p) => (
                  <tr
                    key={p._id}
                    className="border-b hover:bg-green-50 text-center"
                  >
                    <td className="p-2">
                      <img
                        src={p.img}
                        alt={p.name}
                        className="w-12 h-12 mx-auto rounded object-cover"
                      />
                    </td>
                    <td className="p-2">{p.name}</td>
                    <td className="p-2">{p.price}</td>
                    <td className="p-2">{p.discount}%</td>
                    <td className="p-2">
                      {(p.price - (p.price * p.discount) / 100).toFixed(2)}
                    </td>
                    <td className="p-2">{p.stock}</td>
                    <td className="p-2 flex flex-wrap justify-center gap-2">
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

            {/* 🔹 Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-wrap justify-center items-center gap-3 mt-6">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-green-600 text-white rounded disabled:bg-gray-400"
                >
                  Previous
                </button>

                <span className="font-medium">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, totalPages)
                    )
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-green-600 text-white rounded disabled:bg-gray-400"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-gray-500 mt-10">
            No products found.
          </p>
        )}
      </div>

      {/* Modals */}
      {viewModalOpen && selectedProduct && (
        <ViewProductModal
          product={selectedProduct}
          isOpen
          onClose={() => setViewModalOpen(false)}
        />
      )}

      {editModalOpen && selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          isOpen
          onClose={() => setEditModalOpen(false)}
          onSave={handleEditSave}
        />
      )}
    </div>
  );
};

export default Products;
