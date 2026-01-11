import React from "react";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full flex flex-col items-center">
        <h1 className="text-3xl font-semibold text-center text-black mb-16">
          Welcome, create your school account
        </h1>

        {/* Card wrapper */}
        <div className="w-full max-w-md">
          <div className="bg-white px-30 py-17 rounded-2xl shadow-lg">
            <form className="space-y-4">
              <p className="text-sm text-gray-400 text-center mb-5">
                It’s our great pleasure to have you on board!
              </p>

              <input
                type="text"
                placeholder="Enter the name of admin"
                className="w-full px-4 py-2 border rounded-lg
                text-gray-700 placeholder-gray-400 placeholder:text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="text"
                placeholder="Enter the name of school"
                className="w-full px-4 py-2 border rounded-lg
                text-gray-700 placeholder-gray-400 placeholder:text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="email"
                placeholder="Enter the school email"
                className="w-full px-4 py-2 border rounded-lg
                text-gray-700 placeholder-gray-400 placeholder:text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="button"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Next
              </button>
            </form>

            <p className="text-gray-400 text-xs mt-4 text-center">
              Already have an account?{" "}
              <a href="/login" className="text-blue-600 hover:underline font-bold">
                sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
