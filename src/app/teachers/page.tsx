"use client";

import { useState } from "react";
import { useData } from "@/context/DataContext";
import { formatDate, getInitials } from "@/lib/utils";

export default function TeachersPage() {
  const { teachers, addTeacher, deleteTeacher } = useData();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    department: "",
  });

  const filtered = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTeacher({
      ...form,
      joinDate: new Date().toISOString().slice(0, 10),
      status: "active",
    });
    setShowForm(false);
    setForm({ name: "", email: "", phone: "", subject: "", department: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Teachers</h1>
          <p className="text-sm text-slate-500">
            Manage teaching staff and departments
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          + Add Teacher
        </button>
      </div>

      <input
        type="search"
        placeholder="Search by name, subject, email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((t) => (
          <div
            key={t.id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-100 text-sm font-semibold text-sky-700">
                  {getInitials(t.name)}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.email}</p>
                </div>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                  t.status === "active"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {t.status}
              </span>
            </div>
            <div className="mt-4 space-y-1 text-sm">
              <p>
                <span className="text-slate-400">Subject:</span>{" "}
                <span className="font-medium text-slate-700">{t.subject}</span>
              </p>
              <p>
                <span className="text-slate-400">Department:</span>{" "}
                <span className="text-slate-700">{t.department}</span>
              </p>
              <p>
                <span className="text-slate-400">Joined:</span>{" "}
                <span className="text-slate-700">{formatDate(t.joinDate)}</span>
              </p>
              <p>
                <span className="text-slate-400">Phone:</span>{" "}
                <span className="text-slate-700">{t.phone}</span>
              </p>
            </div>
            <button
              onClick={() => {
                if (confirm(`Remove ${t.name}?`)) deleteTeacher(t.id);
              }}
              className="mt-4 text-xs font-medium text-rose-600 hover:text-rose-700"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold">Add New Teacher</h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <input
                required
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
              />
              <input
                required
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
              />
              <input
                required
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
              />
              <input
                required
                placeholder="Subject"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
              />
              <input
                required
                placeholder="Department"
                value={form.department}
                onChange={(e) =>
                  setForm({ ...form, department: e.target.value })
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
              />
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
                >
                  Add Teacher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
