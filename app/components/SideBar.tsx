"use client";

import { usePathname } from "next/navigation";
import {
  MdDashboard,
  MdPeople,
  MdCreditCard,
  MdSettings,
  MdDescription,
  MdBolt,
} from "react-icons/md";
import { FaChalkboardTeacher } from "react-icons/fa";

/* ── Nav items ─────────────────────────────────────────── */
const navItems = [
  { label: "Dashboard",            icon: MdDashboard,        href: "/dashboard"  },
  { label: "Teachers",             icon: FaChalkboardTeacher, href: "/dashboard/teachers"  },
  { label: "Students/ classes",    icon: MdPeople,           href: "/dashboard/students"   },
  { label: "Billing",              icon: MdCreditCard,       href: "/dashboard/billing"    },
  { label: "Settings and profile", icon: MdSettings,         href: "/dashboard/settings"   },
  { label: "Exams",                icon: MdDescription,      href: "/dashboard/exams"      },
];

/* ── Logo ──────────────────────────────────────────────── */
function Logo() {
  return (
    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md">
      <svg viewBox="0 0 40 40" width="28" height="28">
        <path d="M8 20 Q8 8 20 8 Q20 20 8 20Z"      fill="#e74c3c" />
        <path d="M20 8 Q32 8 32 20 Q20 20 20 8Z"     fill="#3498db" />
        <path d="M8 20 Q8 32 20 32 Q20 20 8 20Z"     fill="#2ecc71" />
        <path d="M20 20 Q32 20 32 32 Q20 32 20 20Z"  fill="#e74c3c" opacity="0.8" />
      </svg>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Sidebar
══════════════════════════════════════════════════════════ */
export default function SideBar() {
  const pathname = usePathname();

  return (
    <aside className="w-[230px] min-w-[230px] bg-[#1e2d4d] flex flex-col h-full">

      {/* Logo + school name */}
      <div className="flex flex-col items-center pt-6 pb-5 px-4 border-b border-white/10">
        <Logo />
        <p className="text-white text-xs font-medium mt-3 text-center leading-tight">
          Udemy Inter. school
        </p>
      </div>

      {/* Nav links */}
      <nav className="flex-1 py-4 px-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <a
              key={item.href}
              href={item.href}
              className={`w-full flex items-center gap-3 px-5 py-2.5 rounded-lg text-sm transition-all
                ${isActive
                  ? "bg-[#2e7dd1] text-white font-medium"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
            >
              <Icon size={17} className="shrink-0" />
              <span className="leading-tight">{item.label}</span>
            </a>
          );
        })}
      </nav>

      {/* Features at bottom */}
      <div className="px-2 pb-5 border-t border-white/10 pt-3">
        <a
          href="/features"
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all
            ${pathname === "/features"
              ? "bg-[#2e7dd1] text-white font-medium"
              : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
        >
          <MdBolt size={17} className="shrink-0" />
          <span>Features</span>
          <span className="ml-auto text-[9px] bg-[#2e7dd1] text-white px-1.5 py-0.5 rounded font-bold tracking-wide">
            NEW
          </span>
        </a>
      </div>
    </aside>
  );
}
