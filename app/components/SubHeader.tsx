"use client";

import React from "react";
import Image from "next/image";
import HeroImage from "./HeroImage";
import Company from "./Company";
import Slack from "./Slack";
import Details from "./Details";
import Pricing from "./Pricing";
import UseCases from "../use-cases/page";


interface SubHeaderProps {
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
}

export default function SubHeader({
    title,
    subtitle,
    action,
}: SubHeaderProps) {
    return (
        <div>
            <div className="w-full bg-[#100F57] px-6 py-10 relative">
                {/* Top CTA */}
                <div className="flex justify-center mb-6">
                    <button className="border border-white text-[#D89925] text-xs px-4 py-2 rounded-full">
                        Get Your Free Consultation Now
                    </button>
                </div>

                {/* Title block */}
                <div className="relative flex justify-center items-center mb-4">
                    <h2 className="text-xl md:max-w-md md:text-5xl font-semibold text-white text-center leading-snug md:leading-tight">
                        {title}
                    </h2>

                    {/* Title icon  */}
                    <Image
                        src="/moon-icon-1.png"
                        alt="Moon Icon"
                        width={80}
                        height={80}
                        className="absolute -top-4 right-50 hidden xl:block"
                    />
                </div>

                {/* Subtitle block */}
                {subtitle && (
                    <div className="relative flex justify-center items-center mt-6">
                        {/* Subtitle icon  */}
                        <Image
                            src="/moon-icon-2.png"
                            alt="Moon Icon"
                            width={50}
                            height={50}
                            className="absolute left-60 translate-x-[120%] hidden xl:block"
                        />

                        <p className="text-sm md:text-base text-white text-center max-w-md">
                            {subtitle}
                        </p>
                    </div>
                )}

                {/* Action button */}
                {action && (
                    <div className="flex justify-center mt-6 lg:mb-100">
                        {action}
                    </div>
                )}
            </div>

            <div className="relative lg:-mt-80 md:mt-0 mt-0">
                <HeroImage />
            </div>

            <div>
                <Company />
            </div>

            <div>
                <Slack />
            </div>

            <div>
                <Details />
            </div>

            <div>
                <Pricing />
            </div>

            <div>
                <UseCases />
            </div>
        </div>

    );
}
