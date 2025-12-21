
import { Package, ClipboardList } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-green-50">
      

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl md:text-5xl font-bold text-[var(--secondary-color)] mb-4">
           Welcome to Beauty & Care Back Office
        </h1>
        <p className="text-[var(--text-color)] max-w-lg mb-10">
          Manage your beauty and care products and orders efficiently from this back office dashboard.
        </p>

        <div className="flex flex-wrap justify-center gap-6">
          <a
            href="/orders"
            className="bg-[var(--secondary-color)] hover:bg-[var(--primary-color)] text-white px-6 py-3 rounded-xl flex items-center gap-3 shadow-md transition"
          >
            <ClipboardList size={22} /> View Orders
          </a>

          <a
            href="/products"
            className="bg-[var(--secondary-color)] hover:bg-[var(--primary-color)] text-white px-6 py-3 rounded-xl flex items-center gap-3 shadow-md transition"
          >
            <Package size={22} /> Add New Product
          </a>
        </div>
      </main>

    </div>
  );
}
export default Home;
