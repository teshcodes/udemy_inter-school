"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();

  const [schoolName, setSchoolName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const correctCredentials = {
    schoolName: "My School",
    password: "password123",
  };

  const isFormValid = schoolName && password;

  const handleLogin = () => {
    if (!isFormValid) {
      toast.error("Please fill all fields");
      return;
    }

    if (
      schoolName === correctCredentials.schoolName &&
      password === correctCredentials.password
    ) {
      toast.success("Login successful");
      // Store school name so dashboard can display it
      localStorage.setItem("schoolName", schoolName);
      // Redirect to dashboard
      router.push("/dashboard");
    } else {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="h-dvh md:min-h-screen flex items-center justify-center bg-gray-100 px-4 overflow-y-auto md:overflow-visible">
      <div className="w-full flex flex-col items-center">
        <h1 className="text-3xl font-semibold text-center text-black mb-8 md:mb-16">
          Welcome, Log into your account
        </h1>

        <div className="w-full max-w-md">
          <div className="bg-white px-5 py-6 md:px-10 md:py-10 rounded-2xl shadow-lg">
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <p className="text-sm text-gray-400 text-center mb-5">
                Its our great pleasure to have you on board!
              </p>

              <input
                type="text"
                placeholder="Enter the name of school"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg text-gray-700
                  placeholder-gray-400 placeholder:text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 pr-12 py-2 border rounded-lg text-gray-700
                    placeholder-gray-400 placeholder:text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                >
                  {showPassword ? <FaEye size={18} /> : <FaEyeSlash size={18} />}
                </span>
              </div>

              <button
                type="button"
                onClick={handleLogin}
                disabled={!isFormValid}
                className="w-full bg-blue-500 text-white py-2 rounded-lg
                  hover:bg-blue-700 transition
                  disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                Login
              </button>
            </form>

            <p className="text-gray-400 text-xs mt-3 text-center">
              Dont have an account?{" "}
              <span
                onClick={() => router.push("/register")}
                className="text-blue-600 hover:underline cursor-pointer font-bold"
              >
                Sign up
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
