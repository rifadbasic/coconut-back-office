import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-green-900 text-white text-center py-4 border-t border-green-700 shadow-inner">
      <div className="text-sm tracking-wide">
        © {year} — Crafted with 💚 by{" "}
        <span className="font-semibold text-green-300 hover:text-green-400 transition">
          RifadBasic
        </span>
      </div>
    </footer>
  );
}
export default Footer;
