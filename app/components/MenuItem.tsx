"use client";

import React from "react";

interface MenuItemProps {
  label: string;
  onClick?: () => void;
}

export default function MenuItem({ label, onClick }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className="text-gray-400 hover:text-white px-4 py-2 font-medium transition"
    >
      {label}
    </button>
  );
}
