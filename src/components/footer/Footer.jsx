import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[var(--bg-color)] text-white text-center py-4 border-t border-[var(--primary-color)] shadow-inner">
      <div className="text-sm text-[var(--text-color)] tracking-wide">
        © {year} — Crafted with ❤ by{" "}
        <a href="https://my-portfolio-app-sepia.vercel.app/" target="_blank" className="font-semibold text-[var(--secondary-color)] hover:text-[var(--primary-color)] transition">
          RifadBasic
        </a>
      </div>
    </footer>
  );
}
export default Footer;
