"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MdNotifications } from "react-icons/md";
import {
  FaSearch, FaChevronDown, FaCommentDots, FaChevronUp,
  FaTimes, FaPlusCircle, FaGraduationCap, FaPhone,
  FaEnvelope, FaEye, FaEyeSlash, FaMagic, FaBars,
} from "react-icons/fa";
import { toast } from "react-toastify";
import SideBar from "../../components/SideBar";

/* ── Types ──────────────────────────────────────────────── */
export interface Student {
  id: string;
  studentId: string;
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  classAssigned: string;
  gender: string;
  age: string;
}

const STORAGE_KEY = "students_list";

const emptyForm = (): Omit<Student, "id" | "studentId"> => ({
  fullName: "", email: "", password: "",
  phoneNumber: "", classAssigned: "", gender: "", age: "",
});

const genStudentId = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

/* ── Password helpers ───────────────────────────────────── */
const generateStrongPassword = () => {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const digits = "0123456789";
  const symbols = "!@#$%&*";
  const all = upper + lower + digits + symbols;
  const pwd = [
    upper[Math.floor(Math.random() * upper.length)],
    lower[Math.floor(Math.random() * lower.length)],
    digits[Math.floor(Math.random() * digits.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
  ];
  for (let i = 0; i < 8; i++) pwd.push(all[Math.floor(Math.random() * all.length)]);
  return pwd.sort(() => Math.random() - 0.5).join("");
};

type PasswordStrength = "weak" | "fair" | "strong" | "very-strong";

const getPasswordStrength = (pwd: string): { strength: PasswordStrength; score: number; label: string; color: string } => {
  if (!pwd) return { strength: "weak", score: 0, label: "", color: "" };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  if (score <= 2) return { strength: "weak", score, label: "Weak", color: "bg-red-400" };
  if (score === 3) return { strength: "fair", score, label: "Fair", color: "bg-yellow-400" };
  if (score <= 5) return { strength: "strong", score, label: "Strong", color: "bg-blue-400" };
  return { strength: "very-strong", score, label: "Very strong", color: "bg-green-500" };
};

/* ── Email validator ────────────────────────────────────── */
const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/* ── Avatar ─────────────────────────────────────────────── */
function AvatarInitials({ name, size = "sm" }: { name: string; size?: "sm" | "lg" }) {
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  const colors = [
    "bg-blue-100 text-blue-700", "bg-green-100 text-green-700",
    "bg-purple-100 text-purple-700", "bg-pink-100 text-pink-700",
    "bg-yellow-100 text-yellow-700", "bg-indigo-100 text-indigo-700",
    "bg-teal-100 text-teal-700", "bg-orange-100 text-orange-700",
  ];
  const color = colors[name.charCodeAt(0) % colors.length];
  if (size === "lg") {
    return (
      <div className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-semibold shrink-0 ${color}`}>
        {initials}
      </div>
    );
  }
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${color}`}>
      {initials}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Password field with strength + suggestion
══════════════════════════════════════════════════════════ */
function PasswordField({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [show, setShow] = useState(false);
  const { label, color, score } = getPasswordStrength(value);
  const showMeter = value.length > 0;

  const handleSuggest = () => {
    const pwd = generateStrongPassword();
    onChange(pwd);
    setShow(true);
    toast.info(`Suggested: ${pwd} — save this somewhere safe!`, { autoClose: 6000 });
  };

  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">Password</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter password"
          className="w-full border border-gray-200 rounded-lg px-3 pr-20 py-2.5 text-sm
            text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#2e7dd1]"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {/* Suggest strong password */}
          <button
            type="button"
            onClick={handleSuggest}
            title="Suggest strong password"
            className="text-[#2e7dd1] hover:text-[#1a5fa0] transition p-1"
          >
            <FaMagic size={13} />
          </button>
          {/* Show/hide */}
          <button
            type="button"
            onClick={() => setShow((p) => !p)}
            className="text-gray-400 hover:text-gray-600 transition p-1"
          >
            {show ? <FaEyeSlash size={13} /> : <FaEye size={13} />}
          </button>
        </div>
      </div>

      {/* Strength meter */}
      {showMeter && (
        <div className="mt-1.5 space-y-1">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all duration-300
                  ${i <= score ? color : "bg-gray-100"}`}
              />
            ))}
          </div>
          <div className="flex items-center justify-between">
            <p className={`text-[10px] font-medium
              ${score <= 2 ? "text-red-500" : score === 3 ? "text-yellow-500" : score <= 5 ? "text-blue-500" : "text-green-600"}`}>
              {label}
            </p>
            {score <= 2 && (
              <button
                type="button"
                onClick={handleSuggest}
                className="text-[10px] text-[#2e7dd1] hover:underline"
              >
                Suggest stronger password
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Add Student Modal
══════════════════════════════════════════════════════════ */
function AddStudentModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (students: Student[]) => void;
}) {
  const [activeTab, setActiveTab] = useState<"manually" | "csv">("manually");
  const [forms, setForms] = useState([emptyForm()]);
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const updateField = (index: number, field: keyof ReturnType<typeof emptyForm>, value: string) => {
    setForms((prev) => prev.map((f, i) => (i === index ? { ...f, [field]: value } : f)));
  };

  const validateForms = (): boolean => {
    for (let i = 0; i < forms.length; i++) {
      const f = forms[i];
      const label = forms.length > 1 ? ` (Student ${i + 1})` : "";

      if (!f.fullName.trim()) {
        toast.error(`Name is required${label}.`); return false;
      }
      if (!f.email.trim()) {
        toast.error(`Email is required${label}.`); return false;
      }
      if (!isValidEmail(f.email)) {
        toast.error(`"${f.email}" is not a valid email address${label}.`); return false;
      }
      if (!f.password.trim()) {
        toast.error(`Password is required${label}.`); return false;
      }
      const { score } = getPasswordStrength(f.password);
      if (score <= 2) {
        toast.warning(`Password is too weak${label}. Use the suggest button for a stronger one.`);
        return false;
      }
      if (!f.classAssigned) {
        toast.error(`Please select a class${label}.`); return false;
      }
      if (!f.gender) {
        toast.error(`Please select a gender${label}.`); return false;
      }
    }
    return true;
  };

  const handleSubmit = () => {
    if (activeTab === "manually") {
      if (!validateForms()) return;
      const newStudents: Student[] = forms.map((f) => ({
        ...f,
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        studentId: genStudentId(),
      }));
      onSave(newStudents);
      toast.success(
        `🎉 ${newStudents.length} student${newStudents.length > 1 ? "s" : ""} added successfully!`
      );
      onClose();
    } else {
      if (!csvFile) { toast.error("Please select a CSV file first."); return; }
      toast.success("CSV imported successfully!");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm px-3 sm:px-4">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto">
        <button onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition z-10">
          <FaTimes size={15} />
        </button>

        <div className="px-5 sm:px-8 py-7">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-5">Add Students</h2>

          {/* Tabs */}
          <div className="flex items-center gap-8 mb-6">
            {(["manually", "csv"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`text-sm font-medium pb-1 transition border-b-2
                  ${activeTab === tab ? "border-gray-800 text-gray-900" : "border-transparent text-gray-400 hover:text-gray-600"}`}>
                {tab === "csv" ? "Import CSV" : "Manually"}
              </button>
            ))}
          </div>

          {/* Manually */}
          {activeTab === "manually" && (
            <div className="space-y-6">
              {forms.map((form, index) => (
                <div key={index} className="space-y-4">
                  {forms.length > 1 && (
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-400 font-medium">Student {index + 1}</p>
                      <button onClick={() => setForms((p) => p.filter((_, i) => i !== index))}
                        className="text-xs text-red-400 hover:text-red-600">Remove</button>
                    </div>
                  )}

                  {/* Row 1: Name | Class | Gender */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Name</label>
                      <input type="text" value={form.fullName}
                        onChange={(e) => updateField(index, "fullName", e.target.value)}
                        placeholder="Full name"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#2e7dd1]" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Class</label>
                      <select value={form.classAssigned}
                        onChange={(e) => updateField(index, "classAssigned", e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#2e7dd1] bg-white">
                        <option value="">Class</option>
                        {["JSS1","JSS2","JSS3","SS1","SS2","SS3"].map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Gender</label>
                      <select value={form.gender}
                        onChange={(e) => updateField(index, "gender", e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#2e7dd1] bg-white">
                        <option value="">Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 2: Email | Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Email address</label>
                      <input type="email" value={form.email}
                        onChange={(e) => updateField(index, "email", e.target.value)}
                        placeholder="student@email.com"
                        className={`w-full border rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#2e7dd1]
                          ${form.email && !isValidEmail(form.email) ? "border-red-300 bg-red-50" : "border-gray-200"}`} />
                      {form.email && !isValidEmail(form.email) && (
                        <p className="text-[10px] text-red-500 mt-1">Enter a valid email address</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Phone number</label>
                      <input type="tel" value={form.phoneNumber}
                        onChange={(e) => updateField(index, "phoneNumber", e.target.value)}
                        placeholder="+234..."
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#2e7dd1]" />
                    </div>
                  </div>

                  {/* Row 3: Password — with strength meter */}
                  <div className="w-full sm:w-1/2">
                    <PasswordField
                      value={form.password}
                      onChange={(val) => updateField(index, "password", val)}
                    />
                  </div>

                  {index < forms.length - 1 && <hr className="border-gray-100 mt-2" />}
                </div>
              ))}

              {/* Footer */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button onClick={() => setForms((p) => [...p, emptyForm()])}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition">
                  <FaPlusCircle size={14} className="text-gray-400" />
                  Add another
                </button>
                <button onClick={handleSubmit}
                  className="w-full sm:w-auto bg-gray-800 text-white text-sm px-6 py-2.5 rounded-lg hover:bg-gray-900 transition font-medium">
                  Add student
                </button>
              </div>
            </div>
          )}

          {/* CSV */}
          {activeTab === "csv" && (
            <div className="space-y-5">
              <p className="text-sm text-gray-500">
                Upload a CSV with columns: Name, Email, Password, Phone, Class, Gender.
              </p>
              <label className="flex flex-col items-center justify-center gap-3 border-2
                border-dashed border-gray-200 rounded-xl py-12 cursor-pointer hover:bg-gray-50 transition">
                <input type="file" accept=".csv" className="hidden"
                  onChange={(e) => setCsvFile(e.target.files?.[0] ?? null)} />
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#2e7dd1]"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                  </svg>
                </div>
                {csvFile
                  ? <p className="text-sm text-[#2e7dd1] font-medium">{csvFile.name}</p>
                  : <>
                      <p className="text-sm text-gray-500 text-center">
                        <span className="text-[#2e7dd1] font-medium">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-400">CSV files only</p>
                    </>
                }
              </label>
              <div className="flex justify-end">
                <button onClick={handleSubmit}
                  className="w-full sm:w-auto bg-gray-800 text-white text-sm px-6 py-2.5 rounded-lg hover:bg-gray-900 transition font-medium">
                  Import CSV
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Side panel profile
══════════════════════════════════════════════════════════ */
function StudentSidePanel({
  student,
  allStudents,
  onClose,
}: {
  student: Student;
  allStudents: Student[];
  onClose: () => void;
}) {
  const sameClass = allStudents.filter(
    (s) => s.classAssigned === student.classAssigned && s.id !== student.id
  );
  const visible = sameClass.slice(0, 4);
  const extra = sameClass.length - visible.length;

  return (
    /* On mobile this overlays full screen; on lg+ it's a side panel */
    <div className="fixed inset-0 z-40 bg-white lg:static lg:w-72 lg:shrink-0
      lg:border-l lg:border-gray-100 overflow-y-auto flex flex-col">

      <div className="flex justify-between items-center px-5 pt-5 lg:pt-4 lg:justify-end">
        <p className="text-sm font-semibold text-gray-700 lg:hidden">Student Profile</p>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
          <FaTimes size={15} />
        </button>
      </div>

      <div className="px-5 pb-8 flex flex-col items-center text-center space-y-4 mt-2">
        <p className="text-base font-semibold text-gray-800">{student.studentId}</p>
        <AvatarInitials name={student.fullName} size="lg" />
        <div>
          <p className="text-base font-semibold text-gray-900">{student.fullName}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {student.classAssigned ? `${student.classAssigned} student` : "Student"}
          </p>
        </div>

        {/* Icon buttons */}
        <div className="flex items-center gap-3">
          {[
            { icon: FaGraduationCap, title: "Class" },
            { icon: FaPhone, title: student.phoneNumber || "No phone" },
            { icon: FaEnvelope, title: student.email },
          ].map(({ icon: Icon, title }) => (
            <button key={title} title={title}
              className="w-10 h-10 rounded-lg border border-gray-200 flex items-center
                justify-center text-gray-400 hover:bg-blue-50 hover:text-[#2e7dd1] transition">
              <Icon size={14} />
            </button>
          ))}
        </div>

        {/* About */}
        <div className="w-full text-left">
          <p className="text-sm font-semibold text-gray-800 mb-2">About</p>
          <p className="text-xs text-gray-400 leading-relaxed">
            No bio added yet. Profile details will appear here once the student updates their account.
          </p>
        </div>

        {/* Age + Gender */}
        <div className="w-full grid grid-cols-2 gap-4 text-left">
          <div>
            <p className="text-xs font-medium text-gray-500">Age</p>
            <p className="text-sm text-gray-700 mt-0.5">{student.age || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Gender</p>
            <p className="text-sm text-gray-700 mt-0.5">{student.gender || "—"}</p>
          </div>
        </div>

        {/* Same class */}
        <div className="w-full text-left">
          <p className="text-xs font-medium text-gray-700 mb-2">People from the same class</p>
          {sameClass.length > 0 ? (
            <div className="flex items-center flex-wrap gap-1">
              {visible.map((s) => (
                <div key={s.id} title={s.fullName}
                  className="w-8 h-8 rounded-full border-2 border-white -ml-1 first:ml-0">
                  <AvatarInitials name={s.fullName} />
                </div>
              ))}
              {extra > 0 && (
                <span className="ml-1 text-xs text-[#2e7dd1] font-medium">+{extra} more</span>
              )}
            </div>
          ) : (
            <p className="text-xs text-gray-400">No other students in this class yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Students page
══════════════════════════════════════════════════════════ */
export default function StudentsPage() {
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [students, setStudents] = useState<Student[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showSupport, setShowSupport] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  }, [students]);

  const handleSave = (newStudents: Student[]) => {
    setStudents((prev) => [...prev, ...newStudents]);
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return students;
    return students.filter(
      (s) =>
        s.fullName.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.studentId.includes(q)
    );
  }, [students, search]);

  const handleLogout = () => {
    localStorage.removeItem("schoolName");
    router.push("/");
  };

  const handleExportCSV = () => {
    if (!students.length) { toast.info("No students to export yet."); return; }
    const headers = ["Full Name","Student ID","Email","Class","Gender","Age","Phone"];
    const rows = students.map((s) => [
      s.fullName, s.studentId, s.email, s.classAssigned, s.gender, s.age, s.phoneNumber,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "students.csv"; a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported successfully!");
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

      {/* Sidebar — z-40 so it sits above the overlay */}
      <div className={`fixed inset-y-0 left-0 z-40 lg:static lg:z-auto lg:block ${mobileSidebarOpen ? "block" : "hidden"}`}>
        <SideBar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3 flex items-center justify-between shrink-0 gap-3">
          {/* Left: hamburger (mobile) + actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile hamburger */}
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
              Add Student
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

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">

          {/* Table area */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 min-w-0">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Students</h1>

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
                  placeholder="Search by name, email or ID"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setSelectedStudent(null); }}
                  className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-gray-200 rounded-lg
                    bg-white focus:outline-none focus:ring-1 focus:ring-[#2e7dd1]
                    placeholder:text-gray-400 text-gray-700"
                />
              </div>
            </div>

            {/* Table */}
            {filtered.length > 0 ? (
              <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
                <table className="w-full text-sm min-w-[500px]">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {["Name","Student ID","Email address","Class","Gender"].map((h) => (
                        <th key={h} className="text-left px-4 sm:px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((student, index) => {
                      const isSelected = selectedStudent?.id === student.id;
                      const colors = ["bg-blue-100 text-blue-700","bg-green-100 text-green-700","bg-purple-100 text-purple-700","bg-pink-100 text-pink-700","bg-yellow-100 text-yellow-700","bg-indigo-100 text-indigo-700","bg-teal-100 text-teal-700","bg-orange-100 text-orange-700"];
                      const avatarColor = colors[student.fullName.charCodeAt(0) % colors.length];
                      return (
                        <tr
                          key={student.id}
                          onClick={() => setSelectedStudent(isSelected ? null : student)}
                          className={`border-b border-gray-50 cursor-pointer transition-colors
                            ${isSelected ? "bg-[#2e7dd1]" : index % 2 === 1 ? "bg-[#f8fbff] hover:bg-[#f0f7ff]" : "bg-white hover:bg-[#f0f7ff]"}`}
                        >
                          <td className="px-4 sm:px-5 py-3.5">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0
                                ${isSelected ? "bg-white/20 text-white" : avatarColor}`}>
                                {student.fullName.split(" ").map((n) => n[0]).slice(0,2).join("").toUpperCase()}
                              </div>
                              <span className={`text-xs sm:text-sm font-medium truncate max-w-[100px] sm:max-w-none ${isSelected ? "text-white" : "text-gray-800"}`}>
                                {student.fullName}
                              </span>
                            </div>
                          </td>
                          <td className={`px-4 sm:px-5 py-3.5 text-xs sm:text-sm ${isSelected ? "text-white" : "text-gray-600"}`}>
                            {student.studentId}
                          </td>
                          <td className={`px-4 sm:px-5 py-3.5 text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none ${isSelected ? "text-white" : "text-gray-600"}`}>
                            {student.email}
                          </td>
                          <td className={`px-4 sm:px-5 py-3.5 text-xs sm:text-sm ${isSelected ? "text-white" : "text-gray-600"}`}>
                            {student.classAssigned || "—"}
                          </td>
                          <td className={`px-4 sm:px-5 py-3.5 text-xs sm:text-sm ${isSelected ? "text-white" : "text-gray-600"}`}>
                            {student.gender || "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-100 flex flex-col
                items-center justify-center py-16 px-6 text-center">
                <Image
                  src="/no-notification.png"
                  alt="No students"
                  width={140}
                  height={140}
                  className="mb-5 opacity-90"
                />
                <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                  {search ? "No students match your search" : "No students at this time"}
                </h2>
                <p className="text-xs sm:text-sm text-gray-400">
                  {search ? "Try a different name or email." : "Students will appear here after they enroll."}
                </p>
              </div>
            )}
          </div>

          {/* Side panel — lg+ inline, mobile fullscreen overlay */}
          {selectedStudent && (
            <StudentSidePanel
              student={selectedStudent}
              allStudents={students}
              onClose={() => setSelectedStudent(null)}
            />
          )}
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <AddStudentModal onClose={() => setShowAddModal(false)} onSave={handleSave} />
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
