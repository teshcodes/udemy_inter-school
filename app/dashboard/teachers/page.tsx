"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { MdNotifications } from "react-icons/md";
import {
  FaSearch, FaChevronDown, FaCommentDots, FaChevronUp,
  FaGraduationCap, FaPhone, FaEnvelope, FaArrowLeft, FaBars,
} from "react-icons/fa";
import SideBar from "../../components/SideBar";
import AddTeacherModal, { type Teacher } from "../../components/AddTeacherModal";

const STORAGE_KEY = "teachers_list";

/* ── Avatar initials ────────────────────────────────────── */
function AvatarInitials({ name, size = "sm" }: { name: string; size?: "sm" | "lg" }) {
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  const colors = [
    "bg-blue-100 text-blue-700", "bg-green-100 text-green-700",
    "bg-purple-100 text-purple-700", "bg-pink-100 text-pink-700",
    "bg-yellow-100 text-yellow-700", "bg-indigo-100 text-indigo-700",
    "bg-teal-100 text-teal-700", "bg-orange-100 text-orange-700",
  ];
  const color = colors[name.charCodeAt(0) % colors.length];
  const sizeClass = size === "lg"
    ? "w-44 h-44 text-5xl rounded-full"
    : "w-8 h-8 text-xs rounded-full";
  return (
    <div className={`flex items-center justify-center font-semibold shrink-0 ${sizeClass} ${color}`}>
      {initials}
    </div>
  );
}

/* ── Teacher profile ────────────────────────────────────── */
function TeacherProfile({
  teacher,
  allTeachers,
}: {
  teacher: Teacher;
  allTeachers: Teacher[];
  onBack: () => void;
}) {
  const sameClass = allTeachers.filter(
    (t) => t.classAssigned === teacher.classAssigned && t.id !== teacher.id
  );
  const visibleClassmates = sameClass.slice(0, 4);
  const extraCount = sameClass.length - visibleClassmates.length;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 sm:p-8 md:p-10">
      <div className="flex flex-col md:flex-row gap-8 md:gap-12">

        {/* Left column */}
        <div className="flex flex-col items-center gap-4 md:min-w-[200px]">
          <div className="w-32 h-32 sm:w-44 sm:h-44 rounded-full overflow-hidden border-4 border-gray-100 shadow-sm">
            <AvatarInitials name={teacher.fullName} size="lg" />
          </div>
          <div className="text-center">
            <p className="text-base sm:text-lg font-semibold text-gray-900">{teacher.fullName}</p>
            <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
              {teacher.subject ? `${teacher.subject} teacher` : teacher.designation || "Teacher"}
            </p>
          </div>
          <div className="flex items-center gap-3 mt-1">
            {[
              { icon: FaGraduationCap, size: 17, title: "Class" },
              { icon: FaPhone, size: 15, title: teacher.phoneNumber || "No phone" },
              { icon: FaEnvelope, size: 15, title: teacher.email },
            ].map(({ icon: Icon, size, title }) => (
              <button key={title} title={title}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border border-gray-200 flex items-center
                  justify-center text-gray-400 hover:bg-blue-50 hover:text-[#2e7dd1] transition">
                <Icon size={size} />
              </button>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="flex-1 space-y-6 sm:space-y-7">
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-2">About</h3>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              {teacher.designation ? `${teacher.designation}. ` : ""}
              No biography added yet. This teacher can update their profile once the
              account settings are available.
            </p>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 sm:flex sm:gap-16 gap-4">
            {[
              { label: "Age", value: "—" },
              { label: "Gender", value: teacher.gender || "—" },
              { label: "Class", value: teacher.classAssigned || "—" },
              { label: "Subject", value: teacher.subject || "—" },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs sm:text-sm font-medium text-gray-500">{label}</p>
                <p className="text-xs sm:text-sm text-gray-700 mt-1">{value}</p>
              </div>
            ))}
          </div>

          {/* Same class */}
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-700 mb-3">
              Teachers from the same class
            </p>
            {sameClass.length > 0 ? (
              <div className="flex items-center flex-wrap gap-1">
                {visibleClassmates.map((t) => (
                  <div key={t.id} title={t.fullName}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-white shadow-sm -ml-1 first:ml-0">
                    <AvatarInitials name={t.fullName} size="sm" />
                  </div>
                ))}
                {extraCount > 0 && (
                  <span className="ml-2 text-xs sm:text-sm text-[#2e7dd1] font-medium whitespace-nowrap">
                    +{extraCount} more
                  </span>
                )}
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-gray-400">
                No other teachers in {teacher.classAssigned || "this class"} yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Teachers page
══════════════════════════════════════════════════════════ */
export default function TeachersPage() {
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  const [search, setSearch] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [showSupport, setShowSupport] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(teachers));
  }, [teachers]);

  const handleSave = (newTeachers: Teacher[]) => {
    setTeachers((prev) => [...prev, ...newTeachers]);
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return teachers;
    return teachers.filter(
      (t) => t.fullName.toLowerCase().includes(q) || t.email.toLowerCase().includes(q)
    );
  }, [teachers, search]);

  const autoSelected = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return null;
    const exact = teachers.find((t) => t.fullName.toLowerCase() === q);
    if (exact) return exact;
    if (filtered.length === 1) return filtered[0];
    return null;
  }, [search, teachers, filtered]);

  const resolvedTeacher = selectedTeacher ?? autoSelected;

  const handleLogout = () => {
    localStorage.removeItem("schoolName");
    router.push("/");
  };

  const handleExportCSV = () => {
    if (!teachers.length) return;
    const headers = ["Full Name","Subject","Class","Email","Gender","Phone","Designation"];
    const rows = teachers.map((t) => [
      t.fullName, t.subject, t.classAssigned, t.email, t.gender, t.phoneNumber, t.designation,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "teachers.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen bg-[#f4f6f8] overflow-hidden">

      
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar — z-40 so it sits above the overlay */}
      <div className={`fixed inset-y-0 left-0 z-40 lg:static lg:z-auto lg:block ${mobileSidebarOpen ? "block" : "hidden"}`}>
        <SideBar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3 flex items-center justify-between shrink-0 gap-3">
          {/* Left: hamburger + actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-800 transition p-1"
            >
              <FaBars size={18} />
            </button>
            <button onClick={handleExportCSV}
              className="text-xs sm:text-sm text-[#2e7dd1] font-medium hover:underline transition whitespace-nowrap">
              Export CSV
            </button>
            <button onClick={() => setShowAddModal(true)}
              className="text-xs sm:text-sm bg-[#2e7dd1] text-white px-3 sm:px-5 py-2 rounded-lg
                hover:bg-[#2568b5] transition font-medium whitespace-nowrap">
              Add Teachers
            </button>
          </div>

          {/* Right: bell + logout */}
          <div className="flex items-center gap-3">
            <button className="relative text-gray-500 hover:text-gray-800 transition">
              <MdNotifications size={22} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
            </button>
            <button onClick={handleLogout}
              className="text-xs sm:text-sm text-gray-700 hover:text-gray-900 font-medium transition whitespace-nowrap">
              Log out
            </button>
          </div>
        </header>

        {/* Page body */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-5">

          {/* Page title */}
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Teachers</h1>

          {/* Filter + Search */}
          <div className="flex items-center gap-2 sm:gap-3 mb-5">
            <button className="flex items-center gap-1 border border-gray-200 rounded-lg
              px-3 py-2 text-xs sm:text-sm text-gray-500 hover:bg-gray-50 transition bg-white shrink-0">
              Add filter <FaChevronDown size={10} className="text-gray-400" />
            </button>
            <div className="flex-1 relative">
              <FaSearch size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setSelectedTeacher(null); }}
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-gray-200 rounded-lg
                  bg-white focus:outline-none focus:ring-1 focus:ring-[#2e7dd1]
                  placeholder:text-gray-400 text-gray-700"
              />
            </div>
          </div>

          {/* Profile view */}
          {resolvedTeacher ? (
            <div>
              <button
                onClick={() => { setSelectedTeacher(null); setSearch(""); }}
                className="flex items-center gap-2 text-xs sm:text-sm text-gray-500
                  hover:text-gray-800 transition mb-4"
              >
                <FaArrowLeft size={11} /> Back to all teachers
              </button>
              <TeacherProfile
                teacher={resolvedTeacher}
                allTeachers={teachers}
                onBack={() => { setSelectedTeacher(null); setSearch(""); }}
              />
            </div>
          ) : (
            <>
              {/* Search suggestions dropdown */}
              {search && filtered.length > 0 && filtered.length < teachers.length && (
                <div className="bg-white rounded-xl border border-gray-100 mb-4 overflow-hidden shadow-sm">
                  {filtered.slice(0, 5).map((t) => (
                    <button key={t.id}
                      onClick={() => { setSearch(t.fullName); setSelectedTeacher(t); }}
                      className="w-full flex items-center gap-3 px-4 sm:px-5 py-3 hover:bg-[#f0f7ff]
                        transition text-left border-b border-gray-50 last:border-0">
                      <AvatarInitials name={t.fullName} />
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-800">{t.fullName}</p>
                        <p className="text-xs text-gray-400">{t.email}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Table or empty state */}
              {filtered.length > 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
                  <table className="w-full text-sm min-w-[500px]">
                    <thead>
                      <tr className="border-b border-gray-100">
                        {["Name","Subject","Class","Email address","Gender"].map((h) => (
                          <th key={h}
                            className="text-left px-4 sm:px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((teacher, index) => (
                        <tr key={teacher.id}
                          onClick={() => setSelectedTeacher(teacher)}
                          className={`border-b border-gray-50 cursor-pointer hover:bg-[#f0f7ff] transition-colors
                            ${index % 2 === 1 ? "bg-[#f8fbff]" : "bg-white"}`}>
                          <td className="px-4 sm:px-6 py-3.5">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <AvatarInitials name={teacher.fullName} />
                              <span className="text-xs sm:text-sm font-medium text-gray-800 truncate max-w-[100px] sm:max-w-none">
                                {teacher.fullName}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-3.5 text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                            {teacher.subject || "—"}
                          </td>
                          <td className="px-4 sm:px-6 py-3.5 text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                            {teacher.classAssigned || "—"}
                          </td>
                          <td className="px-4 sm:px-6 py-3.5 text-xs sm:text-sm text-gray-600 truncate max-w-[140px] sm:max-w-none">
                            {teacher.email}
                          </td>
                          <td className="px-4 sm:px-6 py-3.5 text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                            {teacher.gender || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-100 flex flex-col
                  items-center justify-center py-20 sm:py-32 px-6 text-center">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                    {search ? "No teachers match your search" : "No Teachers at this time"}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-400">
                    {search
                      ? "Try a different name or email."
                      : "Teachers will appear here after they enroll in your school."}
                  </p>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Add Teacher Modal */}
      {showAddModal && (
        <AddTeacherModal
          onClose={() => setShowAddModal(false)}
          onSave={handleSave}
        />
      )}

      {/* Support button */}
      <div className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-50">
        {showSupport && (
          <div className="mb-3 w-60 sm:w-64 bg-white rounded-xl shadow-xl border border-gray-100 p-4">
            <p className="text-sm font-semibold text-gray-800 mb-1">Need help?</p>
            <p className="text-xs text-gray-500 mb-3">Our support team is ready to assist you.</p>
            <button className="w-full bg-[#2e7dd1] text-white text-xs py-2 rounded-lg hover:bg-[#2568b5] transition">
              Start a conversation
            </button>
          </div>
        )}
        <button onClick={() => setShowSupport((p) => !p)}
          className="flex items-center gap-2 bg-[#1e2d4d] text-white px-4 sm:px-5 py-2.5 sm:py-3
            rounded-full shadow-lg hover:bg-[#162340] transition font-medium text-xs sm:text-sm">
          <FaCommentDots size={14} />
          Support
          <FaChevronUp size={11} className={`transition-transform duration-200 ${showSupport ? "" : "rotate-180"}`} />
        </button>
      </div>
    </div>
  );
}
