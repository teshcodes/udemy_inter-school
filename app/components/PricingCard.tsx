"use client";

import React from "react";
import { FaCheckCircle } from "react-icons/fa";

interface PricingCardProps {
    title: string;
    price: string;
    description: string;
    features: string[];
}

export default function PricingCard({
    title,
    price,
    description,
    features,
}: PricingCardProps) {
    return (
        <div
            className="
               border-gray-200 rounded-2xl p-6 w-full sm:max-w-sm lg:max-w-xs bg-white shadow-sm
               transition-all duration-300 ease-out hover:scale-[1.07] hover:bg-[#0B0641]
               hover:shadow-2xl hover:-translate-y-2 cursor-pointer hover:text-white
            "
        >
            {/* Plan name */}
            <span className="inline-block bg-blue-100 text-blue-600 text-sm font-medium px-3 py-1 rounded-md mb-4
               hover:bg-white hover:text-[#0B0641]">
                {title}
            </span>

            {/* Description */}
            <p className="text-gray-500 text-sm mb-6 group-hover:text-gray-200">
                {description}
            </p>

            {/* Price */}
            <div className="group flex items-end gap-2 mb-6">
                <h3 className="text-4xl font-bold">${price}</h3>
                <span className="text-gray-500 group-hover:text-gray-300 text-sm">/Month</span>
            </div>

            <hr className="border-dashed mb-6" />

            {/* Features */}
            <ul className="space-y-3 mb-6">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-600 group-hover:text-gray-200">
                        <FaCheckCircle className="text-blue-500" />
                        {feature}
                    </li>
                ))}
            </ul>

            {/* Button */}
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                Choose
            </button>
        </div>
    );
}
