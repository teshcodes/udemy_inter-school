"use client";

import React from "react";
import Image from "next/image";

export default function Details() {
    return (
        <div className="w-full flex flex-col lg:flex-row items-center gap-10 px-6 lg:px-40 py-16">

            {/* Text section */}
            <div className="w-full lg:w-1/2 text-start">
                <h2 className="font-semibold text-xl lg:text-2xl">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </h2>

                <p className="font-light mt-4 text-gray-400">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus odio
                    pellentesque pellentesque a. Amet ut lobortis pellentesque a, luctus
                    maecenas.
                </p>

                <p className="font-light mt-3 text-gray-400">
                    Feugiat sed enim vitae viverra cras tristique eu. Pellentesque bibendum
                    volutpat metus, dictum.
                </p>

                <div className="flex gap-5 mt-10">
                    <Image
                        src="/profile.png"
                        alt="Profile logo"
                        width={150}
                        height={150}
                        className="w-10 h-10"
                        priority
                    />

                    <div className="text-start">
                        <h1 className="font-semibold text-[#1E2024] text-2xl">80,000K</h1>
                        <p className=" text-gray-300 text-sm mt-1 w-45">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </div>
                </div>
            </div>

            {/* Image section */}
            <div className="w-full lg:w-1/2 flex justify-center">
                <Image
                    src="/iphone-handler.png"
                    alt="woman holding phone"
                    width={900}
                    height={900}
                    className="w-full max-w-lg lg:max-w-xl h-auto"
                    priority
                />
            </div>

        </div>
    );
}
