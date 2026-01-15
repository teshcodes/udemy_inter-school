"use client";

import React from "react";
import Image from "next/image";

export default function UseCasesPage() {
  return (
    <div className="bg-gray-100 px-6 md:px-40 py-16">
      {/* Top text section */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:gap-50 mb-10">
        <h1 className="text-xl md:text-3xl font-semibold max-w-70 text-start">
          Interesting option from customer
        </h1>

        <p className="text-sm text-gray-400 max-w-70 mt-3 lg:mt-0 text-start">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus odio
          pellentesque pellentesque a. Amet
        </p>
      </div>

      {/* Card section */}
      <div className="bg-[#0B0641] rounded-2xl px-6 md:px-12 py-10 flex flex-col lg:flex-row items-center lg:items-start gap-30">
        {/* Image */}
        <Image
          src="/my-image1.png"
          alt="use cases image"
          width={1200}
          height={600}
          className="w-1/2 lg:w-1/3 h-auto rounded-xl object-cover"
          priority
        />

        {/* Content */}
        <div className="w-full lg:max-w-sm text-start">
          <span className="inline-block bg-white text-blue-400 text-sm px-3 py-1 rounded-md">
            Standard
          </span>

          <p className="text-sm text-gray-200 mt-5 w-70">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus odio
            pellentesque pellentesque a. Amet
          </p>

          <div className="flex items-end gap-2 mt-8">
            <h3 className="text-4xl font-bold text-white">$15</h3>
            <span className="text-gray-400 text-sm">/Month</span>
          </div>

          <button className="w-full bg-blue-600 text-white py-2 rounded-lg mt-10 lg:mt-58 hover:bg-blue-700 transition">
            Choose
          </button>
        </div>
      </div>
    </div>
  );
}
