"use client";

import React, { useState } from "react";
import MenuItem from "./MenuItem";
import Logo from "./Logo";
import { useRouter } from "next/navigation";
import { FaBars, FaTimes } from "react-icons/fa";

export default function TopMenu() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Pricing", path: "/pricing" },
    { label: "Use cases", path: "/use-cases" },
    { label: "Location", path: "/location" },
    { label: "FAQ", path: "/faq" },
    { label: "Company", path: "/company" },
  ];

  return (
    <header className="w-full bg-[#100F57] shadow-md px-15 py-10 flex items-center justify-between relative">
      <Logo />

      <nav className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 space-x-6">
        {menuItems.map((item) => (
          <MenuItem
            key={item.label}
            label={item.label}
            onClick={() => router.push(item.path)}
          />
        ))}
      </nav>

      <div className="hidden lg:block ml-auto">
        <button
          onClick={() => router.push("/login")}
          className="bg-blue-400 text-gray-100 text-sm py-2 px-8 rounded-full hover:bg-blue-700 transition cursor-pointer"
        >
          Login
        </button>
      </div>

      {/* Mobile Hamburger Menu */}
      <div className="lg:hidden flex items-center ml-auto">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-700 focus:outline-none"
        >
          {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md flex flex-col items-center lg:hidden animate-slideDown z-10 py-3">
          {menuItems.map((item) => (
            <MenuItem
              key={item.label}
              label={item.label}
              onClick={() => {
                router.push(item.path);
                setIsMobileMenuOpen(false);
              }}
            />
          ))}

          <button
            onClick={() => router.push("/login")}
            className="mt-4 bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </div>
      )}
    </header>
  );
}
