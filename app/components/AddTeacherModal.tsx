"use client";

import { useState } from "react";
import { FaTimes, FaPlusCircle } from "react-icons/fa";
import { toast } from "react-toastify";

/* ── Types ──────────────────────────────────────────────── */
export interface Teacher {
  id: string;
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  designation: string;
  classAssigned: string;
  gender: string;
  subject: string;
  avatar?: string;
}

const emptyForm = (): Omit<Teacher, "id" | "avatar"> => ({
  fullName: "",
  email: "",
  password: "",
  phoneNumber: "",
  designation: "",
  classAssigned: "",
  gender: "",
  subject: "",
});

interface AddTeacherModalProps {
  onClose: () => void;
  onSave: (teachers: Teacher[]) => void;
}

/* ══════════════════════════════════════════════════════════
   Modal
══════════════════════════════════════════════════════════ */
export default function AddTeacherModal({ onClose, onSave }: AddTeacherModalProps) {
  const [activeTab, setActiveTab] = useState<"manually" | "csv">("manually");
  const [forms, setForms] = useState([emptyForm()]);
  const [designation, setDesignation] = useState("");
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const updateField = (index: number, field: keyof ReturnType<typeof emptyForm>, value: string) => {
    setForms((prev) => prev.map((f, i) => (i === index ? { ...f, [field]: value } : f)));
  };

  const addAnother = () => setForms((prev) => [...prev, emptyForm()]);

  const removeForm = (index: number) => {
    if (forms.length === 1) return;
    setForms((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (activeTab === "manually") {
      const hasEmpty = forms.some((f) => !f.fullName.trim() || !f.email.trim());
      if (hasEmpty) { toast.error("Full Name and Email are required."); return; }

      const newTeachers: Teacher[] = forms.map((f) => ({
        ...f,
        designation,
        id: Date.now().toString() + Math.random().toString(36).slice(2),
      }));

      onSave(newTeachers);
      toast.success(`${newTeachers.length} teacher${newTeachers.length > 1 ? "s" : ""} added!`);
      onClose();
    } else {
      if (!csvFile) { toast.error("Please select a CSV file."); return; }
      toast.success("CSV imported!");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition z-10">
          <FaTimes size={16} />
        </button>

        <div className="px-8 py-7">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Add Teachers</h2>
            <div className="ml-8 flex-1 max-w-xs">
              <label className="block text-xs text-gray-500 mb-1">Designation</label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm
                  text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#2e7dd1]"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-8 mb-6 border-b border-gray-100">
            {["manually", "csv"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as "manually" | "csv")}
                className={`pb-2.5 text-sm font-medium transition border-b-2 -mb-px capitalize
                  ${activeTab === tab
                    ? "border-gray-800 text-gray-900"
                    : "border-transparent text-gray-400 hover:text-gray-600"}`}
              >
                {tab === "csv" ? "Import CSV" : "Manually"}
              </button>
            ))}
          </div>

          {/* Manually tab */}
          {activeTab === "manually" && (
            <div className="space-y-6">
              {forms.map((form, index) => (
                <div key={index} className="space-y-4">
                  {forms.length > 1 && (
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-400 font-medium">Teacher {index + 1}</p>
                      <button onClick={() => removeForm(index)} className="text-xs text-red-400 hover:text-red-600">Remove</button>
                    </div>
                  )}

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Full Name</label>
                    <input type="text" value={form.fullName}
                      onChange={(e) => updateField(index, "fullName", e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#2e7dd1]" />
                  </div>

                  {/* Email | Class + Gender */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Email address</label>
                      <input type="email" value={form.email}
                        onChange={(e) => updateField(index, "email", e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#2e7dd1]" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1 invisible">Class</label>
                        <select value={form.classAssigned}
                          onChange={(e) => updateField(index, "classAssigned", e.target.value)}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#2e7dd1] bg-white">
                          <option value="">Class</option>
                          {["JSS1","JSS2","JSS3","SS1","SS2","SS3"].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1 invisible">Gender</label>
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
                  </div>

                  {/* Password | Phone */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Password</label>
                      <input type="password" value={form.password}
                        onChange={(e) => updateField(index, "password", e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#2e7dd1]" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Phone number</label>
                      <input type="tel" value={form.phoneNumber}
                        onChange={(e) => updateField(index, "phoneNumber", e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#2e7dd1]" />
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="w-1/2 pr-2">
                    <label className="block text-xs text-gray-500 mb-1">Subject</label>
                    <select value={form.subject}
                      onChange={(e) => updateField(index, "subject", e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#2e7dd1] bg-white">
                      <option value="">Subject</option>
                      {["Mathematics","English","Science","Physics","Chemistry","Biology",
                        "History","Geography","French","Accounting","Social studies",
                        "Home economics","Psychology","C.R.S","Maths"].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {index < forms.length - 1 && <hr className="border-gray-100 mt-2" />}
                </div>
              ))}

              <div className="flex items-center justify-between pt-2">
                <button onClick={addAnother} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition">
                  <FaPlusCircle size={15} className="text-gray-400" />
                  Add another
                </button>
                <button onClick={handleSubmit}
                  className="bg-[#1e2d4d] text-white text-sm px-6 py-2.5 rounded-lg hover:bg-[#162340] transition font-medium">
                  Add Teacher
                </button>
              </div>
            </div>
          )}

          {/* CSV tab */}
          {activeTab === "csv" && (
            <div className="space-y-5">
              <p className="text-sm text-gray-500">
                Upload a CSV with columns: Full Name, Email, Password, Phone, Class, Gender, Subject.
              </p>
              <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed
                border-gray-200 rounded-xl py-12 cursor-pointer hover:bg-gray-50 transition">
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
                      <p className="text-sm text-gray-500"><span className="text-[#2e7dd1] font-medium">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-gray-400">CSV files only</p>
                    </>
                }
              </label>
              <div className="flex justify-end pt-2">
                <button onClick={handleSubmit}
                  className="bg-[#1e2d4d] text-white text-sm px-6 py-2.5 rounded-lg hover:bg-[#162340] transition font-medium">
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
