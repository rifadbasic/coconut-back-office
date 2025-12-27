import { Link } from "react-router";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      {/* Main 404 Number */}
      <h1 className="text-[8rem] font-extrabold text-gray-800 mb-6 sm:text-[6rem] xs:text-[4rem]">
        404
      </h1>

      {/* Message */}
      <p className="text-2xl text-gray-700 mb-4 sm:text-xl xs:text-lg text-center">
        Oops! The page you are looking for does not exist.
      </p>
      <p className="text-gray-500 mb-8 text-center">
        It might have been moved or deleted, or you may have typed the wrong URL.
      </p>

      {/* Go Home Button */}
      <Link
        to="/"
        className="px-6 py-3 bg-[var(--secondary-color)] hover:bg-[var(--primary-color)] text-white font-semibold rounded-lg shadow-lg transition duration-300"
      >
        Go to Home
      </Link>

      
    </div>
  );
};

export default NotFound;
