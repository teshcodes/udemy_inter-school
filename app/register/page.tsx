"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function SignupPage() {
    const router = useRouter();

    const [adminName, setAdminName] = useState("");
    const [schoolName, setSchoolName] = useState("");
    const [schoolEmail, setSchoolEmail] = useState("");

    const isFormValid = adminName && schoolName && schoolEmail;

    const handleNext = () => {
        toast.success("Signup details saved successfully");

        setTimeout(() => {
            router.push("/register/password");
        }, 800);
    };

    return (
        <div className="h-dvh md:min-h-screen flex items-center justify-center bg-gray-100 px-4 overflow-y-auto md:overflow-visible">
            <div className="w-full flex flex-col items-center">
                {/* Heading */}
                <h1 className="text-3xl font-semibold text-center text-black mb-8 md:mb-16">
                    Welcome, create your school account
                </h1>

                <div className="w-full max-w-md">
                    <div className="bg-white px-5 py-6 md:px-30 md:py-17 rounded-2xl shadow-lg">
                        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                            <p className="text-sm text-gray-400 text-center mb-5">
                                It’s our great pleasure to have you on board!
                            </p>

                            <input
                                type="text"
                                placeholder="Enter the name of admin"
                                value={adminName}
                                onChange={(e) => setAdminName(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg
                text-gray-700 placeholder-gray-400 placeholder:text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <input
                                type="text"
                                placeholder="Enter the name of school"
                                value={schoolName}
                                onChange={(e) => setSchoolName(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg
                text-gray-700 placeholder-gray-400 placeholder:text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <input
                                type="email"
                                placeholder="Enter the school email"
                                value={schoolEmail}
                                onChange={(e) => setSchoolEmail(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg
                text-gray-700 placeholder-gray-400 placeholder:text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <button
                                type="button"
                                onClick={handleNext}
                                disabled={!isFormValid}
                                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-700 transition
                           disabled:bg-blue-300 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </form>

                        <p className="text-gray-400 text-xs mt-4 text-center">
                            Already have an account?{" "}
                            <span
                                onClick={() => router.push("/login")}
                                className="text-blue-600 hover:underline cursor-pointer font-bold"
                            >
                                Log in
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
