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

  const LIMIT = 10;

  // 🔹 Fetch Products
  const fetchProducts = async () => {
    try {
      const res = await axiosSecure.get("/items", {
        params: {
          search,
          page: currentPage,
          limit: LIMIT,
        },
      });

      if (res.data?.success) {
        setProducts(res.data.products || []);

        // ✅ SAFETY: calculate totalPages if backend sends totalCount
        if (res.data.totalPages) {
          setTotalPages(res.data.totalPages);
        } else if (res.data.totalCount) {
          setTotalPages(Math.ceil(res.data.totalCount / LIMIT));
        } else {
          setTotalPages(1);
        }
      } else {
        setProducts([]);
        setTotalPages(1);
      }
    } catch (error) {
      Swal.fire("Error", "Failed to load products", "error");
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

  // 🔹 Status Color
  const statusColorMap = {
    disabled: "text-red-600",
    new: "text-green-600",
    combo: "text-yellow-600",
    regular: "text-gray-600",
  };

  return (
    <div className="p-4 md:p-6 bg-green-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-[var(--secondary-color)]">
          Products
        </h1>

        <Link
          to="/add-product"
          className="bg-[var(--secondary-color)] hover:bg-[var(--primary-color)] flex justify-center items-center gap-2 text-white px-4 py-2 rounded w-full md:w-auto"
        >
          <PlusCircle size={20} /> Add Product
        </Link>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search product by name, category, status..."
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
          <table className="min-w-full bg-white shadow rounded">
            <thead className="bg-[var(--secondary-color)] text-white">
              <tr>
                <th className="p-2">Image</th>
                <th className="p-2">Name</th>
                <th className="p-2">Final Price</th>
                <th className="p-2">Discount</th>
                <th className="p-2">Status</th>
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
                  <td
                    className={`p-2 font-medium ${
                      statusColorMap[p.status?.toLowerCase()] || "text-gray-800"
                    }`}
                  >
                    {p.name}
                  </td>

                  <td className="p-2">
                    {(p.price - (p.price * p.discount) / 100).toFixed(2)}
                  </td>
                  <td className="p-2">{p.discount}%</td>
                  <td className="p-2 capitalize">{p.status}</td>
                  {/* if stock is 0, show "Out of stock" */}
                  <td className="p-2">
                    {p.stock > 0 ? p.stock : <span className="text-red-600">Out of stock</span>}
                  </td>
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
        ) : (
          <p className="text-center text-gray-500 mt-10">No products found.</p>
        )}
      </div>

      {/* ✅ Pagination (ALWAYS OUTSIDE table condition) */}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center items-center gap-3 mt-8">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-green-600 text-white rounded disabled:bg-gray-400"
          >
            Previous
          </button>

          <span className="font-semibold">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-green-600 text-white rounded disabled:bg-gray-400"
          >
            Next
          </button>
        </div>
      )}

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
