"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { MdNotifications } from "react-icons/md";
import {
  FaSearch, FaChevronDown, FaCommentDots, FaChevronUp,
  FaGraduationCap, FaPhone, FaEnvelope, FaArrowLeft,
} from "react-icons/fa";
import SideBar from "../../components/SideBar";
import AddTeacherModal, { type Teacher } from "../../components/AddTeacherModal";

const STORAGE_KEY = "teachers_list";

/* ── Avatar initials ────────────────────────────────────── */
function AvatarInitials({
  name,
  size = "sm",
}: {
  name: string;
  size?: "sm" | "lg";
}) {
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  const colors = [
    "bg-blue-100 text-blue-700",
    "bg-green-100 text-green-700",
    "bg-purple-100 text-purple-700",
    "bg-pink-100 text-pink-700",
    "bg-yellow-100 text-yellow-700",
    "bg-indigo-100 text-indigo-700",
    "bg-teal-100 text-teal-700",
    "bg-orange-100 text-orange-700",
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

/* ── Profile view ───────────────────────────────────────── */
function TeacherProfile({
  teacher,
  allTeachers,
  onBack,
}: {
  teacher: Teacher;
  allTeachers: Teacher[];
  onBack: () => void;
}) {
  // Teachers from the same class
  const sameClass = allTeachers.filter(
    (t) => t.classAssigned === teacher.classAssigned && t.id !== teacher.id
  );
  const visibleClassmates = sameClass.slice(0, 4);
  const extraCount = sameClass.length - visibleClassmates.length;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-10">
      <div className="flex flex-col md:flex-row gap-12">

        {/* ── Left column ── */}
        <div className="flex flex-col items-center gap-5 min-w-[200px]">
          {/* Avatar circle */}
          <div className="w-44 h-44 rounded-full overflow-hidden border-4 border-gray-100 shadow-sm">
            <AvatarInitials name={teacher.fullName} size="lg" />
          </div>

          {/* Name + designation */}
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900">{teacher.fullName}</p>
            <p className="text-sm text-gray-400 mt-0.5">
              {teacher.subject ? `${teacher.subject} teacher` : teacher.designation || "Teacher"}
            </p>
          </div>

          {/* Icon action buttons */}
          <div className="flex items-center gap-3 mt-1">
            <button className="w-12 h-12 rounded-lg border border-gray-200 flex items-center
              justify-center text-gray-400 hover:bg-blue-50 hover:text-[#2e7dd1] transition"
              title="Class">
              <FaGraduationCap size={17} />
            </button>
            <button className="w-12 h-12 rounded-lg border border-gray-200 flex items-center
              justify-center text-gray-400 hover:bg-blue-50 hover:text-[#2e7dd1] transition"
              title={teacher.phoneNumber || "No phone"}>
              <FaPhone size={15} />
            </button>
            <button className="w-12 h-12 rounded-lg border border-gray-200 flex items-center
              justify-center text-gray-400 hover:bg-blue-50 hover:text-[#2e7dd1] transition"
              title={teacher.email}>
              <FaEnvelope size={15} />
            </button>
          </div>
        </div>

        {/* ── Right column ── */}
        <div className="flex-1 space-y-7">

          {/* About */}
          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-2">About</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              {teacher.designation
                ? `${teacher.designation}. `
                : ""}
              No biography added yet. This teacher can update their profile once the
              account settings are available. Their expertise and contributions will
              be displayed here.
            </p>
          </div>

          {/* Age + Gender row */}
          <div className="flex gap-16">
            <div>
              <p className="text-sm font-medium text-gray-500">Age</p>
              <p className="text-sm text-gray-700 mt-1">—</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Gender</p>
              <p className="text-sm text-gray-700 mt-1">{teacher.gender || "—"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Class</p>
              <p className="text-sm text-gray-700 mt-1">{teacher.classAssigned || "—"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Subject</p>
              <p className="text-sm text-gray-700 mt-1">{teacher.subject || "—"}</p>
            </div>
          </div>

          {/* Teachers from the same class */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">
              Teachers from the same class
            </p>
            {sameClass.length > 0 ? (
              <div className="flex items-center gap-1.5">
                {visibleClassmates.map((t) => (
                  <div
                    key={t.id}
                    className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm -ml-1 first:ml-0"
                    title={t.fullName}
                  >
                    <AvatarInitials name={t.fullName} size="sm" />
                  </div>
                ))}
                {extraCount > 0 && (
                  <span className="ml-2 text-sm text-[#2e7dd1] font-medium whitespace-nowrap">
                    +{extraCount} more
                  </span>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-400">
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
  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [search, setSearch] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [showSupport, setShowSupport] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  /* Save to localStorage on every change */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(teachers));
  }, [teachers]);

  /* ── Add teachers from modal ── */
  const handleSave = (newTeachers: Teacher[]) => {
    setTeachers((prev) => [...prev, ...newTeachers]);
  };

  /* ── Search filter ── */
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return teachers;
    return teachers.filter(
      (t) =>
        t.fullName.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q)
    );
  }, [teachers, search]);

  // Derived — no setState in useEffect, no cascading renders
  const autoSelected = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return null;
    const exact = teachers.find((t) => t.fullName.toLowerCase() === q);
    if (exact) return exact;
    if (filtered.length === 1) return filtered[0];
    return null;
  }, [search, teachers, filtered]);

  // Manual click takes priority over auto-match
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

      <SideBar />

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={handleExportCSV}
              className="text-sm text-[#2e7dd1] font-medium hover:underline transition">
              Export CSV
            </button>
            <button onClick={() => setShowAddModal(true)}
              className="text-sm bg-[#2e7dd1] text-white px-5 py-2 rounded-lg hover:bg-[#2568b5] transition font-medium">
              Add Teachers
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-gray-500 hover:text-gray-800 transition">
              <MdNotifications size={24} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
            </button>
            <button onClick={handleLogout}
              className="text-sm text-gray-700 hover:text-gray-900 font-medium transition">
              Log out
            </button>
          </div>
        </header>

        {/* Page body */}
        <main className="flex-1 overflow-y-auto px-8 py-6">

          {/* Filter + Search */}
          <div className="flex items-center gap-3 mb-6">
            <button className="flex items-center gap-1.5 border border-gray-200 rounded-lg
              px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 transition bg-white">
              Add filter <FaChevronDown size={11} className="text-gray-400" />
            </button>
            <div className="flex-1 relative">
              <FaSearch size={13} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for a teachers by name or email"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedTeacher(null);
                }}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg
                  bg-white focus:outline-none focus:ring-1 focus:ring-[#2e7dd1]
                  placeholder:text-gray-400 text-gray-700"
              />
            </div>
          </div>

          {/* Profile view */}
          {resolvedTeacher ? (
            <div>
              {/* Back button */}
              <button
                onClick={() => { setSelectedTeacher(null); setSearch(""); }}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800
                  transition mb-5"
              >
                <FaArrowLeft size={12} /> Back to all teachers
              </button>

              <TeacherProfile
                teacher={resolvedTeacher}
                allTeachers={teachers}
                onBack={() => { setSelectedTeacher(null); setSearch(""); }}
              />
            </div>

          ) : (
            /* ── Table view ── */
            <>
              {/* Search dropdown suggestions */}
              {search && filtered.length > 0 && filtered.length < teachers.length && (
                <div className="bg-white rounded-xl border border-gray-100 mb-4 overflow-hidden shadow-sm">
                  {filtered.slice(0, 5).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => { setSearch(t.fullName); setSelectedTeacher(t); }}
                      className="w-full flex items-center gap-3 px-5 py-3 hover:bg-[#f0f7ff]
                        transition text-left border-b border-gray-50 last:border-0"
                    >
                      <AvatarInitials name={t.fullName} />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{t.fullName}</p>
                        <p className="text-xs text-gray-400">{t.email}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {filtered.length > 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        {["Name","Subject","Class","Email address","Gender"].map((h) => (
                          <th key={h} className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((teacher, index) => (
                        <tr
                          key={teacher.id}
                          onClick={() => setSelectedTeacher(teacher)}
                          className={`border-b border-gray-50 cursor-pointer hover:bg-[#f0f7ff] transition-colors
                            ${index % 2 === 1 ? "bg-[#f8fbff]" : "bg-white"}`}
                        >
                          <td className="px-6 py-3.5">
                            <div className="flex items-center gap-3">
                              <AvatarInitials name={teacher.fullName} />
                              <span className="font-medium text-gray-800">{teacher.fullName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-3.5 text-gray-600">{teacher.subject || "—"}</td>
                          <td className="px-6 py-3.5 text-gray-600">{teacher.classAssigned || "—"}</td>
                          <td className="px-6 py-3.5 text-gray-600">{teacher.email}</td>
                          <td className="px-6 py-3.5 text-gray-600">{teacher.gender || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-100 flex flex-col
                  items-center justify-center py-32 px-6 text-center">
                  <h2 className="text-xl font-semibold text-gray-700 mb-2">
                    {search ? "No teachers match your search" : "No Teachers at this time"}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {search ? "Try a different name or email." : "Teachers will appear here after they enroll in your school."}
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
      <div className="fixed bottom-6 right-6 z-50">
        {showSupport && (
          <div className="mb-3 w-64 bg-white rounded-xl shadow-xl border border-gray-100 p-4">
            <p className="text-sm font-semibold text-gray-800 mb-1">Need help?</p>
            <p className="text-xs text-gray-500 mb-3">Our support team is ready to assist you.</p>
            <button className="w-full bg-[#2e7dd1] text-white text-xs py-2 rounded-lg hover:bg-[#2568b5] transition">
              Start a conversation
            </button>
          </div>
        )}
        <button
          onClick={() => setShowSupport((p) => !p)}
          className="flex items-center gap-2 bg-[#1e2d4d] text-white px-5 py-3
            rounded-full shadow-lg hover:bg-[#162340] transition font-medium text-sm"
        >
          <FaCommentDots size={15} />
          Support
          <FaChevronUp size={12} className={`transition-transform duration-200 ${showSupport ? "" : "rotate-180"}`} />
        </button>
      </div>
    </div>
  );
}
