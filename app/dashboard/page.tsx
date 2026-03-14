"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MdLogout, MdNotifications } from "react-icons/md";
import { FaUserPlus, FaBook, FaUserCheck, FaCommentDots, FaChevronUp } from "react-icons/fa";
import SideBar from "../components/SideBar";

/* ── Action cards ──────────────────────────────────────── */
const actionCards = [
  {
    icon: FaUserPlus,
    title: "Add other admins",
    description:
      "Create rich course content and coaching products for your students. When you give them a pricing plan, they'll appear on your site!",
  },
  {
    icon: FaBook,
    title: "Add classes",
    description:
      "Create rich course content and coaching products for your students. When you give them a pricing plan, they'll appear on your site!",
  },
  {
    icon: FaUserCheck,
    title: "Add students",
    description:
      "Create rich course content and coaching products for your students. When you give them a pricing plan, they'll appear on your site!",
  },
];

 
  //  Dashboard page =============================
 
export default function DashboardPage() {
  const router = useRouter();

  const [schoolName] = useState<string>(() => {
    if (typeof window === "undefined") return "Udemy school";
    return localStorage.getItem("schoolName") ?? "Udemy school";
  });

  const [showSupport, setShowSupport] = useState(false);

 
  useEffect(() => {
    if (!localStorage.getItem("schoolName")) {
      router.push("/");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("schoolName");
    router.push("/");
  };

  return (
    <div className="flex h-screen bg-[#f4f6f8] overflow-hidden">

      {/* Sidebar =========== */}
      <SideBar />

      {/* ── Main content area ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 pl-20 pr-8 py-6 flex items-center justify-between shrink-0">
          <div>
            <p className="text-sm font-medium text-gray-800">
              Learn how to launch faster
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              watch our webinar for tips from our experts and get a limited time offer.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification bell */}
            <button className="relative text-gray-500 hover:text-gray-800 transition">
              <MdNotifications size={22} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-[#1e2d4d] text-white text-sm px-5 py-2
                rounded-lg hover:bg-[#162340] transition font-medium"
            >
              <MdLogout size={16} />
              Log out
            </button>
          </div>
        </header>

        {/* Page body */}
        <main className="flex-1 overflow-y-auto pl-20 pr-8 py-10">

          {/* Welcome heading */}
          <div className="mb-10">
            <h1 className="text-3xl font-semibold text-gray-800">
              Welcome to your dashboard,{" "}
              <span className="text-gray-900">{schoolName}</span>
            </h1>
            <p className="text-gray-900 text-lg font-semibold mt-5 ml-15">
              Uyo/school/@teachable.com
            </p>
          </div>

          {/* Action cards */}
          <div className="space-y-8 max-w-2xl ml-15">
            {actionCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.title} className="flex items-start gap-5">
                  {/* Icon circle */}
                  <div className="w-10 h-10 rounded-full bg-[#eaf2fb] flex items-center justify-center shrink-0 mt-0.5">
                    <Icon size={17} className="text-[#2e7dd1]" />
                  </div>
                  {/* Text */}
                  <div>
                    <h3 className="text-base font-semibold text-gray-800 mb-1">
                      {card.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* ── Support button — fixed bottom right ── */}
      <div className="fixed bottom-25 right-6 z-50">
        {showSupport && (
          <div className="mb-3 w-64 bg-white rounded-xl shadow-xl border border-gray-100 p-4">
            <p className="text-sm font-semibold text-gray-800 mb-1">Need help?</p>
            <p className="text-xs text-gray-500 mb-3">
              Our support team is ready to assist you.
            </p>
            <button className="w-full bg-[#2e7dd1] text-white text-xs py-2 rounded-lg hover:bg-[#2568b5] transition">
              Start a conversation
            </button>
          </div>
        )}

        <button
          onClick={() => setShowSupport((p) => !p)}
          className="flex items-center gap-2 bg-[#1e2d4d] text-white px-6 py-4
            rounded-full shadow-lg hover:bg-[#162340] transition font-medium text-sm"
        >
          <FaCommentDots size={15} />
          Support
          <FaChevronUp
            size={12}
            className={`transition-transform duration-200 ${showSupport ? "" : "rotate-180"}`}
          />
        </button>
      </div>
    </div>
  );
}
