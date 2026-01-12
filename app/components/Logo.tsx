"use client";

import React from "react";
import Image from "next/image";

export default function Logo() {
  return (
    <div className="relative flex items-center justify-center">
      <div
        className=" mt-10 
          absolute 
          -top-20 
          -left-20
          rotate-15
        "
      >
        <Image
          src="/ellipse-1.png"
          alt="Glow"
          width={170}
          height={140}
          className="object-contain opacity-90"
        />
      </div>

      {/* Logo */}
      <div className="relative z-10">
        <Image
          src="/statisda-logo.png"
          alt="Statisda Logo"
          width={80}
          height={100}
          className="object-contain"
        />
      </div>
    </div>
  );
}
