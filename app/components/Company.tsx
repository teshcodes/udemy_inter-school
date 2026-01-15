"use client"

import React from "react";
import Image from "next/image";

export default function Company() {
    return (
        <div className="text-center justify-center items-center mt-5">
            <h1 className="font-semibold md:text-3xl text-xl">Trusted by company like</h1>

            <div className="flex justify-center px-10 gap-15 mt-8 flex-wrap md:flex-nowrap">

                <Image
                    src="/company-logo1.png"
                    alt="Trusted Company Logos"
                    width={600}
                    height={100}
                    className="w-7 h-7"
                    priority
                />

                <Image
                    src="/company-logo2.png"
                    alt="Trusted Company Logos"
                    width={600}
                    height={100}
                    className="w-7 h-7"
                    priority
                />

                <Image
                    src="/company-logo3.png"
                    alt="Trusted Company Logos"
                    width={700}
                    height={100}
                    className="w-7 h-7"
                    priority
                />
                <Image
                    src="/company-logo1.png"
                    alt="Trusted Company Logos"
                    width={600}
                    height={100}
                    className="w-7 h-7"
                    priority
                />

                <Image
                    src="/company-logo2.png"
                    alt="Trusted Company Logos"
                    width={600}
                    height={100}
                    className="w-7 h-7"
                    priority
                />

                <Image
                    src="/company-logo3.png"
                    alt="Trusted Company Logos"
                    width={700}
                    height={100}
                    className="w-7 h-7"
                    priority
                />


            </div>
        </div>
    );
}