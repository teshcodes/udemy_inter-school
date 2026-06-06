"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MdLogout, MdNotifications } from "react-icons/md";
import { FaUserPlus, FaBook, FaUserCheck, FaCommentDots, FaChevronUp, FaBars } from "react-icons/fa";
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

/* ── Dashboard page ── */
export default function DashboardPage() {
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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

      {/* Overlay — tap outside to close, sits ABOVE sidebar */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar — fixed on mobile, static on desktop */}
      {/* added shrink-0 so it never gets squished by main content on desktop */}
      <div
        className={`
          fixed inset-y-0 left-0 z-40
          lg:static lg:z-auto lg:shrink-0
          ${mobileSidebarOpen ? "block" : "hidden lg:block"}
        `}
      >
        <SideBar />
      </div>

      {/* ── Main content area ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Top bar */}
        {/* removed pl-20 — that was pushing header content right even on mobile
            now it's px-4 on mobile and px-8 on desktop */}
        <header className="bg-white border-b border-gray-100 px-4 lg:px-8 py-4 flex items-center justify-between shrink-0 gap-3">

          {/* Left — hamburger on mobile */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-800 transition p-1"
            >
              <FaBars size={18} />
            </button>
          </div>

          {/* Center — announcement text, hidden on very small screens */}
          <div className="hidden sm:block text-center">
            <p className="text-sm font-medium text-gray-800">
              Learn how to launch faster
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Watch our webinar for tips from our experts and get a limited time offer.
            </p>
          </div>

          {/* Right — bell + logout */}
          <div className="flex items-center gap-3 shrink-0">
            <button className="relative text-gray-500 hover:text-gray-800 transition">
              <MdNotifications size={22} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
            </button>

            {/* logout — icon only on mobile, icon + text on desktop */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-[#1e2d4d] text-white text-sm px-3 sm:px-5 py-2
                rounded-lg hover:bg-[#162340] transition font-medium"
            >
              <MdLogout size={16} />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </header>

        {/* Page body */}
        {/* removed pl-20 and pr-8 fixed padding — now responsive px */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 lg:px-10 py-8">

          {/* Welcome heading */}
          {/* removed ml-15 — that was pushing text off screen on mobile */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
              Welcome to your dashboard,{" "}
              <span className="text-gray-900">{schoolName}</span>
            </h1>
            <p className="text-gray-900 text-base sm:text-lg font-semibold mt-4">
              Uyo/school/@teachable.com
            </p>
          </div>

          {/* Action cards */}
          {/* removed ml-15 — was cutting off cards on mobile */}
          <div className="space-y-6 max-w-2xl">
            {actionCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.title} className="flex items-start gap-4">
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
      {/* moved up from bottom-25 to bottom-6 — bottom-25 is non-standard and
          can sit off screen on some mobile heights */}
      <div className="fixed bottom-6 right-4 sm:right-6 z-50">
        {showSupport && (
          <div className="mb-3 w-56 sm:w-64 bg-white rounded-xl shadow-xl border border-gray-100 p-4">
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
          className="flex items-center gap-2 bg-[#1e2d4d] text-white px-4 sm:px-6 py-3 sm:py-4
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
