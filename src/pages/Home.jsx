
import { Package, ClipboardList } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-green-50">
      

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl md:text-5xl font-bold text-green-900 mb-4">
          🥥 Welcome to Coconut Back Office
        </h1>
        <p className="text-green-800 max-w-lg mb-10">
          Manage your coconut shop efficiently — track orders, add products, and keep
          everything fresh and organized. 🌴
        </p>

        <div className="flex flex-wrap justify-center gap-6">
          <a
            href="/orders"
            className="bg-green-800 hover:bg-green-900 text-white px-6 py-3 rounded-xl flex items-center gap-3 shadow-md transition"
          >
            <ClipboardList size={22} /> View Orders
          </a>

          <a
            href="/products"
            className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl flex items-center gap-3 shadow-md transition"
          >
            <Package size={22} /> Add New Product
          </a>
        </div>
      </main>

    </div>
  );
}
export default Home;
