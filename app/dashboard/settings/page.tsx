"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { MdNotifications } from "react-icons/md";
import {
  FaBars, FaCamera, FaUser, FaSchool, FaShieldAlt,
  FaBell, FaPalette, FaEye, FaEyeSlash, FaCheck,
  FaCommentDots, FaChevronUp, FaSignOutAlt, FaSave,
} from "react-icons/fa";
import { toast } from "react-toastify";
import SideBar from "../../components/SideBar";

/* ── Tab definition ─────────────────────────────────────── */
const TABS = [
  { id: "profile",       label: "Profile",       icon: FaUser      },
  { id: "school",        label: "School",        icon: FaSchool    },
  { id: "security",      label: "Security",      icon: FaShieldAlt },
  { id: "notifications", label: "Notifications", icon: FaBell      },
  { id: "appearance",    label: "Appearance",    icon: FaPalette   },
] as const;

type TabId = typeof TABS[number]["id"];

/* ── Stats from localStorage ────────────────────────────── */
function useStats() {
  return useState(() => {
    if (typeof window === "undefined") return { teachers: 0, students: 0 };
    try {
      const t = JSON.parse(localStorage.getItem("teachers_list") || "[]");
      const s = JSON.parse(localStorage.getItem("students_list") || "[]");
      return { teachers: t.length, students: s.length };
    } catch {
      return { teachers: 0, students: 0 };
    }
  })[0];
}

/* ── Avatar display ─────────────────────────────────────── */
function ProfileAvatar({
  name,
  photo,
  size = "lg",
}: {
  name: string;
  photo: string | null;
  size?: "sm" | "lg";
}) {
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() || "SC";
  const dim = size === "lg" ? "w-24 h-24 text-3xl" : "w-10 h-10 text-sm";

  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        className={`${dim} rounded-full object-cover border-4 border-white shadow-md`}
      />
    );
  }
  return (
    <div className={`${dim} rounded-full bg-[#1e2d4d] text-white flex items-center justify-center font-semibold border-4 border-white shadow-md`}>
      {initials}
    </div>
  );
}

/* ── Toggle switch ── */
function Toggle({
  value, onChange, label, description,
}: {
  value: boolean; onChange: (v: boolean) => void;
  label: string; description?: string;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <div className="flex-1 pr-4">
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0
          ${value ? "bg-[#2e7dd1]" : "bg-gray-200"}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow
          transition-transform duration-200 ${value ? "translate-x-5" : "translate-x-0"}`} />
      </button>
    </div>
  );
}

/* ── Password input ── */
function PasswordInput({
  label, value, onChange, show, onToggle, placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void;
  show: boolean; onToggle: () => void; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "••••••••"}
          className="w-full border border-gray-200 rounded-lg px-3 pr-10 py-2.5 text-sm
            text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#2e7dd1]"
        />
        <button type="button" onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          {show ? <FaEyeSlash size={13} /> : <FaEye size={13} />}
        </button>
      </div>
    </div>
  );
}

/* ── Section card ── */
function SectionCard({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 sm:p-6 space-y-4">
      {title && <h3 className="text-sm font-semibold text-gray-700 mb-1">{title}</h3>}
      {children}
    </div>
  );
}

/* ── Input field ── */
function Field({
  label, value, onChange, type = "text", placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm
          text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#2e7dd1]
          placeholder:text-gray-300"
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Settings page
══════════════════════════════════════════════════════════ */
export default function SettingsPage() {
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const [showSupport, setShowSupport] = useState(false);
  const stats = useStats();

  /* ── Profile state ── */
  const [profilePhoto, setProfilePhoto] = useState<string | null>(() => { if (typeof window === "undefined") return null; try { const d = JSON.parse(localStorage.getItem("settings_profile") || "{}"); return d.profilePhoto ?? null; } catch { return null; } });
  const [adminName, setAdminName] = useState(() => { if (typeof window === "undefined") return "School Admin"; try { const d = JSON.parse(localStorage.getItem("settings_profile") || "{}"); return d.adminName || "School Admin"; } catch { return "School Admin"; } });
  const [adminEmail, setAdminEmail] = useState(() => { if (typeof window === "undefined") return "admin@school.com"; try { const d = JSON.parse(localStorage.getItem("settings_profile") || "{}"); return d.adminEmail || "admin@school.com"; } catch { return "admin@school.com"; } });
  const [adminPhone, setAdminPhone] = useState(() => { if (typeof window === "undefined") return ""; try { const d = JSON.parse(localStorage.getItem("settings_profile") || "{}"); return d.adminPhone || ""; } catch { return ""; } });
  const [adminRole, setAdminRole] = useState(() => { if (typeof window === "undefined") return "Administrator"; try { const d = JSON.parse(localStorage.getItem("settings_profile") || "{}"); return d.adminRole || "Administrator"; } catch { return "Administrator"; } });
  const [adminBio, setAdminBio] = useState(() => { if (typeof window === "undefined") return ""; try { const d = JSON.parse(localStorage.getItem("settings_profile") || "{}"); return d.adminBio || ""; } catch { return ""; } });
  const photoInputRef = useRef<HTMLInputElement | null>(null);

  /* ── School state ── */
  const [schoolName, setSchoolName] = useState(() => { if (typeof window === "undefined") return "Udemy Inter. School"; try { const d = JSON.parse(localStorage.getItem("settings_profile") || "{}"); return d.schoolName || localStorage.getItem("schoolName") || "Udemy Inter. School"; } catch { return "Udemy Inter. School"; } });
  const [schoolAddress, setSchoolAddress] = useState(() => { if (typeof window === "undefined") return ""; try { const d = JSON.parse(localStorage.getItem("settings_profile") || "{}"); return d.schoolAddress || ""; } catch { return ""; } });
  const [schoolEmail, setSchoolEmail] = useState(() => { if (typeof window === "undefined") return ""; try { const d = JSON.parse(localStorage.getItem("settings_profile") || "{}"); return d.schoolEmail || ""; } catch { return ""; } });
  const [schoolPhone, setSchoolPhone] = useState(() => { if (typeof window === "undefined") return ""; try { const d = JSON.parse(localStorage.getItem("settings_profile") || "{}"); return d.schoolPhone || ""; } catch { return ""; } });
  const [schoolWebsite, setSchoolWebsite] = useState(() => { if (typeof window === "undefined") return ""; try { const d = JSON.parse(localStorage.getItem("settings_profile") || "{}"); return d.schoolWebsite || ""; } catch { return ""; } });
  const [schoolMotto, setSchoolMotto] = useState(() => { if (typeof window === "undefined") return ""; try { const d = JSON.parse(localStorage.getItem("settings_profile") || "{}"); return d.schoolMotto || ""; } catch { return ""; } });

  /* ── Security state ── */
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [twoFactor, setTwoFactor] = useState(() => { if (typeof window === "undefined") return false; try { const d = JSON.parse(localStorage.getItem("settings_profile") || "{}"); return d.twoFactor !== undefined ? d.twoFactor : false; } catch { return false; } });

  /* ── Notifications state ── */
  const [notifNewStudent, setNotifNewStudent] = useState(() => { if (typeof window === "undefined") return true; try { const d = JSON.parse(localStorage.getItem("settings_profile") || "{}"); return d.notifNewStudent !== undefined ? d.notifNewStudent : true; } catch { return true; } });
  const [notifNewTeacher, setNotifNewTeacher] = useState(() => { if (typeof window === "undefined") return true; try { const d = JSON.parse(localStorage.getItem("settings_profile") || "{}"); return d.notifNewTeacher !== undefined ? d.notifNewTeacher : true; } catch { return true; } });
  const [notifExamResult, setNotifExamResult] = useState(() => { if (typeof window === "undefined") return false; try { const d = JSON.parse(localStorage.getItem("settings_profile") || "{}"); return d.notifExamResult !== undefined ? d.notifExamResult : false; } catch { return false; } });
  const [notifBilling, setNotifBilling] = useState(() => { if (typeof window === "undefined") return true; try { const d = JSON.parse(localStorage.getItem("settings_profile") || "{}"); return d.notifBilling !== undefined ? d.notifBilling : true; } catch { return true; } });
  const [notifEmail, setNotifEmail] = useState(() => { if (typeof window === "undefined") return true; try { const d = JSON.parse(localStorage.getItem("settings_profile") || "{}"); return d.notifEmail !== undefined ? d.notifEmail : true; } catch { return true; } });
  const [notifSms, setNotifSms] = useState(() => { if (typeof window === "undefined") return false; try { const d = JSON.parse(localStorage.getItem("settings_profile") || "{}"); return d.notifSms !== undefined ? d.notifSms : false; } catch { return false; } });

  /* ── Appearance state ── */
  const [accentColor, setAccentColor] = useState(() => { if (typeof window === "undefined") return "#2e7dd1"; try { const d = JSON.parse(localStorage.getItem("settings_profile") || "{}"); return d.accentColor || "#2e7dd1"; } catch { return "#2e7dd1"; } });
  const [language, setLanguage] = useState(() => { if (typeof window === "undefined") return "en"; try { const d = JSON.parse(localStorage.getItem("settings_profile") || "{}"); return d.language || "en"; } catch { return "en"; } });
  const [dateFormat, setDateFormat] = useState(() => { if (typeof window === "undefined") return "MM/DD/YYYY"; try { const d = JSON.parse(localStorage.getItem("settings_profile") || "{}"); return d.dateFormat || "MM/DD/YYYY"; } catch { return "MM/DD/YYYY"; } });
  const [timezone, setTimezone] = useState(() => { if (typeof window === "undefined") return "Africa/Lagos"; try { const d = JSON.parse(localStorage.getItem("settings_profile") || "{}"); return d.timezone || "Africa/Lagos"; } catch { return "Africa/Lagos"; } });

   

  /* ── Photo upload ── */
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Photo must be under 2MB."); return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setProfilePhoto(reader.result as string);
      toast.success("Profile photo updated!");
    };
    reader.readAsDataURL(file);
  };

  /* ── Save helpers ── */
  const saveAll = (extra?: Record<string, unknown>) => {
    const data = {
      adminName, adminEmail, adminPhone, adminRole, adminBio, profilePhoto,
      schoolName, schoolAddress, schoolEmail, schoolPhone, schoolWebsite, schoolMotto,
      accentColor, language, dateFormat, timezone,
      notifNewStudent, notifNewTeacher, notifExamResult, notifBilling, notifEmail, notifSms,
      twoFactor,
      ...extra,
    };
    localStorage.setItem("settings_profile", JSON.stringify(data));
  };

  const handleSaveProfile = () => {
    if (!adminName.trim()) { toast.error("Name is required."); return; }
    if (!adminEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminEmail)) {
      toast.error("Enter a valid email address."); return;
    }
    saveAll();
    toast.success("Profile saved successfully!");
  };

  const handleSaveSchool = () => {
    if (!schoolName.trim()) { toast.error("School name is required."); return; }
    saveAll();
    localStorage.setItem("schoolName", schoolName);
    toast.success("School settings saved!");
  };

  const handleSaveSecurity = () => {
    if (!currentPassword) { toast.error("Enter your current password."); return; }
    if (!newPassword) { toast.error("Enter a new password."); return; }
    if (newPassword.length < 8) { toast.error("New password must be at least 8 characters."); return; }
    if (newPassword !== confirmPassword) { toast.error("Passwords do not match."); return; }
    setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    toast.success("Password changed successfully!");
  };

  const handleSaveNotifications = () => {
    saveAll();
    toast.success("Notification preferences saved!");
  };

  const handleSaveAppearance = () => {
    saveAll();
    toast.success("Appearance settings saved!");
  };

  const handleLogout = () => {
    localStorage.removeItem("schoolName");
    router.push("/");
  };

 

  /* ── RENDER ── */
  return (
    <div className="flex h-screen bg-[#f4f6f8] overflow-hidden">

      {/* Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 lg:static lg:z-auto lg:block
        ${mobileSidebarOpen ? "block" : "hidden"}`}>
        <SideBar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3
          flex items-center justify-between shrink-0 gap-3">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-800 p-1">
              <FaBars size={18} />
            </button>
            <h1 className="text-base sm:text-lg font-semibold text-gray-800">Settings & Profile</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative text-gray-500 hover:text-gray-800 transition">
              <MdNotifications size={22} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
            </button>
            <button onClick={handleLogout}
              className="text-xs sm:text-sm text-gray-700 hover:text-gray-900 font-medium transition">
              Log out
            </button>
          </div>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5">

          {/* ── Profile hero card ── */}
          <div className="bg-[#1e2d4d] rounded-xl p-5 sm:p-6 mb-5 relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/5 rounded-full" />
            <div className="absolute -bottom-10 -left-6 w-32 h-32 bg-white/5 rounded-full" />

            <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Photo */}
              <div className="relative shrink-0">
                <ProfileAvatar name={adminName} photo={profilePhoto} size="lg" />
                <button
                  onClick={() => photoInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-7 h-7 bg-[#2e7dd1] rounded-full
                    flex items-center justify-center border-2 border-white
                    hover:bg-[#2568b5] transition shadow"
                  title="Change photo"
                >
                  <FaCamera size={10} className="text-white" />
                </button>
                <input ref={photoInputRef} type="file" accept="image/*"
                  className="hidden" onChange={handlePhotoChange} />
              </div>

              {/* Info */}
              <div className="flex-1">
                <h2 className="text-lg sm:text-xl font-semibold text-white">{adminName}</h2>
                <p className="text-blue-200 text-xs sm:text-sm mt-0.5">{adminRole} · {adminEmail}</p>
                <p className="text-white/50 text-xs mt-1">{schoolName}</p>
              </div>

              {/* Stats */}
              <div className="flex gap-4 sm:gap-6 shrink-0">
                <div className="text-center">
                  <p className="text-xl sm:text-2xl font-bold text-white">{stats.teachers}</p>
                  <p className="text-white/50 text-xs mt-0.5">Teachers</p>
                </div>
                <div className="w-px bg-white/10" />
                <div className="text-center">
                  <p className="text-xl sm:text-2xl font-bold text-white">{stats.students}</p>
                  <p className="text-white/50 text-xs mt-0.5">Students</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Tabs ── */}
          <div className="flex gap-1 bg-white rounded-xl border border-gray-100 p-1 mb-5 overflow-x-auto">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm
                    font-medium transition whitespace-nowrap flex-1 justify-center
                    ${isActive
                      ? "bg-[#1e2d4d] text-white shadow-sm"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                    }`}
                >
                  <Icon size={13} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* ══════════════════════════
              PROFILE TAB
          ══════════════════════════ */}
          {activeTab === "profile" && (
            <div className="space-y-4">
              <SectionCard title="Personal Information">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Full Name" value={adminName} onChange={setAdminName} placeholder="Your full name" />
                  <Field label="Email Address" value={adminEmail} onChange={setAdminEmail} type="email" placeholder="admin@school.com" />
                  <Field label="Phone Number" value={adminPhone} onChange={setAdminPhone} type="tel" placeholder="+234 800 000 0000" />
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Role</label>
                    <select value={adminRole} onChange={(e) => setAdminRole(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700
                        focus:outline-none focus:ring-1 focus:ring-[#2e7dd1] bg-white">
                      <option value="Administrator">Administrator</option>
                      <option value="Principal">Principal</option>
                      <option value="Vice Principal">Vice Principal</option>
                      <option value="Head Teacher">Head Teacher</option>
                      <option value="Bursar">Bursar</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Bio</label>
                  <textarea
                    value={adminBio}
                    onChange={(e) => setAdminBio(e.target.value)}
                    placeholder="Write a short bio about yourself..."
                    rows={3}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm
                      text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#2e7dd1]
                      placeholder:text-gray-300 resize-none"
                  />
                </div>
              </SectionCard>

              <SectionCard title="Profile Photo">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <ProfileAvatar name={adminName} photo={profilePhoto} size="lg" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 font-medium mb-1">
                      {profilePhoto ? "Photo uploaded" : "No photo uploaded yet"}
                    </p>
                    <p className="text-xs text-gray-400 mb-3">
                      JPG, PNG or GIF · Max 2MB · Recommended 400×400px
                    </p>
                    <div className="flex gap-2">
                      <button onClick={() => photoInputRef.current?.click()}
                        className="flex items-center gap-2 bg-[#1e2d4d] text-white text-xs px-4 py-2
                          rounded-lg hover:bg-[#162340] transition font-medium">
                        <FaCamera size={11} /> Upload Photo
                      </button>
                      {profilePhoto && (
                        <button onClick={() => { setProfilePhoto(null); toast.info("Photo removed."); }}
                          className="text-xs px-4 py-2 rounded-lg border border-gray-200 text-gray-600
                            hover:bg-gray-50 transition">
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </SectionCard>

              <div className="flex justify-end">
                <button onClick={handleSaveProfile}
                  className="flex items-center gap-2 bg-[#2e7dd1] text-white text-sm px-6 py-2.5
                    rounded-lg hover:bg-[#2568b5] transition font-medium">
                  <FaSave size={13} /> Save Profile
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════
              SCHOOL TAB
          ══════════════════════════ */}
          {activeTab === "school" && (
            <div className="space-y-4">
              <SectionCard title="School Information">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="School Name" value={schoolName} onChange={setSchoolName} placeholder="e.g. Udemy Inter. School" />
                  <Field label="School Email" value={schoolEmail} onChange={setSchoolEmail} type="email" placeholder="info@school.edu.ng" />
                  <Field label="Phone Number" value={schoolPhone} onChange={setSchoolPhone} type="tel" placeholder="+234 800 000 0000" />
                  <Field label="Website" value={schoolWebsite} onChange={setSchoolWebsite} placeholder="https://school.edu.ng" />
                </div>
                <Field label="Address" value={schoolAddress} onChange={setSchoolAddress} placeholder="Street, City, State" />
                <Field label="School Motto" value={schoolMotto} onChange={setSchoolMotto} placeholder="e.g. Excellence in Learning" />
              </SectionCard>

              <SectionCard title="School Stats">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: "Total Teachers", value: stats.teachers, color: "bg-blue-50 text-blue-700" },
                    { label: "Total Students", value: stats.students, color: "bg-green-50 text-green-700" },
                    { label: "Classes", value: 6, color: "bg-purple-50 text-purple-700" },
                    { label: "Active Users", value: stats.teachers + stats.students, color: "bg-orange-50 text-orange-700" },
                  ].map(({ label, value, color }) => (
                    <div key={label} className={`${color} rounded-xl p-4 text-center`}>
                      <p className="text-2xl font-bold">{value}</p>
                      <p className="text-xs font-medium mt-1 opacity-80">{label}</p>
                    </div>
                  ))}
                </div>
              </SectionCard>

              <div className="flex justify-end">
                <button onClick={handleSaveSchool}
                  className="flex items-center gap-2 bg-[#2e7dd1] text-white text-sm px-6 py-2.5
                    rounded-lg hover:bg-[#2568b5] transition font-medium">
                  <FaSave size={13} /> Save School Settings
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════
              SECURITY TAB
          ══════════════════════════ */}
          {activeTab === "security" && (
            <div className="space-y-4">
              <SectionCard title="Change Password">
                <div className="space-y-4 max-w-md">
                  <PasswordInput label="Current Password" value={currentPassword}
                    onChange={setCurrentPassword} show={showCurrent} onToggle={() => setShowCurrent(p => !p)} />
                  <PasswordInput label="New Password" value={newPassword}
                    onChange={setNewPassword} show={showNew} onToggle={() => setShowNew(p => !p)}
                    placeholder="Min. 8 characters" />
                  <PasswordInput label="Confirm New Password" value={confirmPassword}
                    onChange={setConfirmPassword} show={showConfirm} onToggle={() => setShowConfirm(p => !p)} />

                  {/* Password match indicator */}
                  {newPassword && confirmPassword && (
                    <div className={`flex items-center gap-2 text-xs font-medium
                      ${newPassword === confirmPassword ? "text-green-600" : "text-red-500"}`}>
                      <FaCheck size={10} />
                      {newPassword === confirmPassword ? "Passwords match" : "Passwords do not match"}
                    </div>
                  )}

                  <button onClick={handleSaveSecurity}
                    className="flex items-center gap-2 bg-[#1e2d4d] text-white text-sm px-5 py-2.5
                      rounded-lg hover:bg-[#162340] transition font-medium">
                    <FaShieldAlt size={13} /> Update Password
                  </button>
                </div>
              </SectionCard>

              <SectionCard title="Security Options">
                <Toggle
                  value={twoFactor}
                  onChange={(v) => { setTwoFactor(v); saveAll({ twoFactor: v }); }}
                  label="Two-Factor Authentication"
                  description="Add an extra layer of security to your account"
                />
                <div className="pt-3">
                  <p className="text-xs font-medium text-gray-500 mb-2">Active Sessions</p>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-xs font-medium text-gray-700">Current session</p>
                      <p className="text-xs text-gray-400 mt-0.5">Chrome · {new Date().toLocaleDateString()}</p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                      Active
                    </span>
                  </div>
                </div>
              </SectionCard>

              <SectionCard>
                <div className="flex items-start gap-4 p-1">
                  <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                    <FaSignOutAlt size={14} className="text-red-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">Delete Account</p>
                    <p className="text-xs text-gray-400 mt-0.5 mb-3">
                      Permanently delete your account and all associated data. This cannot be undone.
                    </p>
                    <button className="text-xs text-red-500 border border-red-200 px-4 py-2 rounded-lg
                      hover:bg-red-50 transition font-medium">
                      Delete Account
                    </button>
                  </div>
                </div>
              </SectionCard>
            </div>
          )}

          {/* ══════════════════════════
              NOTIFICATIONS TAB
          ══════════════════════════ */}
          {activeTab === "notifications" && (
            <div className="space-y-4">
              <SectionCard title="In-App Notifications">
                <Toggle value={notifNewStudent} onChange={setNotifNewStudent}
                  label="New Student Enrolled"
                  description="Get notified when a new student is added to the system" />
                <Toggle value={notifNewTeacher} onChange={setNotifNewTeacher}
                  label="New Teacher Added"
                  description="Get notified when a new teacher joins" />
                <Toggle value={notifExamResult} onChange={setNotifExamResult}
                  label="Exam Results Published"
                  description="Get notified when exam results are available" />
                <Toggle value={notifBilling} onChange={setNotifBilling}
                  label="Billing & Payments"
                  description="Get notified about payment confirmations and invoices" />
              </SectionCard>

              <SectionCard title="Notification Channels">
                <Toggle value={notifEmail} onChange={setNotifEmail}
                  label="Email Notifications"
                  description={`Send notifications to ${adminEmail}`} />
                <Toggle value={notifSms} onChange={setNotifSms}
                  label="SMS Notifications"
                  description={adminPhone ? `Send SMS to ${adminPhone}` : "Add a phone number in Profile to enable"} />
              </SectionCard>

              <div className="flex justify-end">
                <button onClick={handleSaveNotifications}
                  className="flex items-center gap-2 bg-[#2e7dd1] text-white text-sm px-6 py-2.5
                    rounded-lg hover:bg-[#2568b5] transition font-medium">
                  <FaSave size={13} /> Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════
              APPEARANCE TAB
          ══════════════════════════ */}
          {activeTab === "appearance" && (
            <div className="space-y-4">
              <SectionCard title="Accent Color">
                <p className="text-xs text-gray-400 mb-3">Choose the primary colour used across the dashboard</p>
                <div className="flex flex-wrap gap-3">
                  {[
                    { color: "#2e7dd1", label: "Ocean Blue" },
                    { color: "#1e2d4d", label: "Navy" },
                    { color: "#0f9b6e", label: "Emerald" },
                    { color: "#7c3aed", label: "Violet" },
                    { color: "#dc2626", label: "Ruby" },
                    { color: "#d97706", label: "Amber" },
                    { color: "#db2777", label: "Pink" },
                    { color: "#0891b2", label: "Teal" },
                  ].map(({ color, label }) => (
                    <button
                      key={color}
                      onClick={() => setAccentColor(color)}
                      title={label}
                      className={`w-9 h-9 rounded-full border-4 transition-transform hover:scale-110
                        ${accentColor === color ? "border-gray-400 scale-110" : "border-transparent"}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">Selected: <span className="font-medium text-gray-700">{accentColor}</span></p>
              </SectionCard>

              <SectionCard title="Regional Settings">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Language</label>
                    <select value={language} onChange={(e) => setLanguage(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700
                        focus:outline-none focus:ring-1 focus:ring-[#2e7dd1] bg-white">
                      <option value="en">English</option>
                      <option value="fr">French</option>
                      <option value="yo">Yorùbá</option>
                      <option value="ha">Hausa</option>
                      <option value="ig">Igbo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Date Format</label>
                    <select value={dateFormat} onChange={(e) => setDateFormat(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700
                        focus:outline-none focus:ring-1 focus:ring-[#2e7dd1] bg-white">
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Timezone</label>
                    <select value={timezone} onChange={(e) => setTimezone(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700
                        focus:outline-none focus:ring-1 focus:ring-[#2e7dd1] bg-white">
                      <option value="Africa/Lagos">Africa/Lagos (WAT)</option>
                      <option value="Africa/Accra">Africa/Accra (GMT)</option>
                      <option value="Europe/London">Europe/London (GMT)</option>
                      <option value="America/New_York">America/New_York (EST)</option>
                    </select>
                  </div>
                </div>
              </SectionCard>

              <div className="flex justify-end">
                <button onClick={handleSaveAppearance}
                  className="flex items-center gap-2 bg-[#2e7dd1] text-white text-sm px-6 py-2.5
                    rounded-lg hover:bg-[#2568b5] transition font-medium">
                  <FaSave size={13} /> Save Appearance
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

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
