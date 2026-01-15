"use client";

import React from "react";
import PricingCard from "./PricingCard";

export default function Pricing() {
    return (
        <section id="pricing" className="py-20 px-6 bg-white">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-semibold text-center text-[#1777F7] mb-4">
                    Pick up the best plan
                </h2>

                <p className="text-center text-gray-500 mb-12 max-w-sm mx-auto">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus odio pellentesque pellentesque a. Amet
                    ut lobortis pellentesque a, luctus maecenas.
                </p>

                {/* Cards container */}
                <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
                    <PricingCard
                        title="Standard"
                        price="15"
                        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus odio pellentesque pellentesque a. Amet"
                        features={[
                            "For 1–10 people in a team",
                            "For 1–10 people in a team",
                            "For 1–10 people in a team",
                        ]}
                    />

                    <PricingCard
                        title="Premium"
                        price="29"
                        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus odio pellentesque pellentesque a. Amet"
                        features={[
                            "Unlimited team members",
                            "Advanced analytics",
                            "Priority support",
                        ]}
                    />

                    <PricingCard
                        title="Enterprise"
                        price="49"
                        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus odio pellentesque pellentesque a. Amet"
                        features={[
                            "Custom integrations",
                            "Dedicated manager",
                            "24/7 support",
                        ]}
                    />
                </div>
            </div>
        </section>
    );
}
