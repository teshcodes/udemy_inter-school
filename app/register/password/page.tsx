"use client";

import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";

export default function CreatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const handleNext = () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
        setError("password must be at least 8 characters");
        return;
    }

    setError("");
    console.log("Passwords match, continue...");

    toast.success("Password created successfully");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full flex flex-col items-center">
        <h1 className="text-3xl font-semibold text-center text-black mb-8 md:mb-16">
          Udemy school, Choose your password
        </h1>

        <div className="w-full max-w-md">
          <div className="bg-white px-5 py-6 md:px-27 md:py-17 rounded-2xl shadow-lg">
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <p className="text-m text-gray-400 text-start mb-3">
                Choose a password
              </p>

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  className="w-full px-4 pr-12 py-2 border rounded-lg
                  text-gray-700
                  placeholder-gray-400 placeholder:text-xl placeholder:font-semibold placeholder:tracking-widest
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                >
                  {showPassword ? <FaEye size={18} /> : <FaEyeSlash size={18} />}
                </span>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError("");
                  }}
                  className="w-full px-4 pr-12 py-2 border rounded-lg
                  text-gray-700
                  placeholder-gray-400 placeholder:text-xl placeholder:font-semibold placeholder:tracking-widest
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <span
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <FaEye size={18} />
                  ) : (
                    <FaEyeSlash size={18} />
                  )}
                </span>
              </div>

              {/* Error message */}
              {error && (
                <p className="text-red-500 text-sm text-left ml-1">
                  {error}
                </p>
              )}

              <p className="text-gray-500 text-sm ml-1">
                Must be at least 8 characters
              </p>

              <button
                type="button"
                onClick={handleNext}
                disabled={!password || !confirmPassword}
                className="w-full bg-blue-500 text-white py-2 rounded-lg
                hover:bg-blue-700 transition cursor-pointer
                disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
