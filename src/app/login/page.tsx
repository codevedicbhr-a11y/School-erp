"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");

  const handleDemoLogin = (role: "admin" | "teacher" | "student") => {
    const emails = {
      admin: "admin@school.edu",
      teacher: "sarah.j@school.edu",
      student: "alex.k@student.school.edu",
    };
    const ok = login(emails[role], role);
    if (ok) {
      router.push("/");
    } else {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left branding panel */}
      <div className="hidden w-1/2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-xl font-bold text-white backdrop-blur">
              SE
            </div>
            <span className="text-2xl font-bold text-white">SchoolERP</span>
          </div>
          <h1 className="mt-16 text-4xl font-bold leading-tight text-white">
            Complete School
            <br />
            Management System
          </h1>
          <p className="mt-4 max-w-md text-lg text-indigo-100">
            Manage students, teachers, attendance, exams, and fees — all in one
            modern platform.
          </p>
        </div>
        <div className="space-y-3 text-sm text-indigo-200">
          <p>✓ Student & Teacher Management</p>
          <p>✓ Real-time Attendance Tracking</p>
          <p>✓ Exam & Grade Management</p>
          <p>✓ Fee Collection & Reports</p>
        </div>
      </div>

      {/* Right login panel */}
      <div className="flex w-full flex-col items-center justify-center px-6 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:text-left">
            <div className="mb-4 flex justify-center lg:hidden">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-xl font-bold text-white">
                SE
              </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Welcome to SchoolERP
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Choose a demo role to explore the system
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => handleDemoLogin("admin")}
              className="flex w-full items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 text-2xl">
                🛡️
              </div>
              <div>
                <p className="font-semibold text-slate-900">Login as Admin</p>
                <p className="text-sm text-slate-500">
                  Full access to all modules
                </p>
              </div>
            </button>

            <button
              onClick={() => handleDemoLogin("teacher")}
              className="flex w-full items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-sky-300 hover:bg-sky-50 hover:shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-sky-100 text-2xl">
                👩‍🏫
              </div>
              <div>
                <p className="font-semibold text-slate-900">Login as Teacher</p>
                <p className="text-sm text-slate-500">
                  Manage classes, attendance & grades
                </p>
              </div>
            </button>

            <button
              onClick={() => handleDemoLogin("student")}
              className="flex w-full items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-2xl">
                👨‍🎓
              </div>
              <div>
                <p className="font-semibold text-slate-900">Login as Student</p>
                <p className="text-sm text-slate-500">
                  View grades, attendance & fees
                </p>
              </div>
            </button>
          </div>

          <p className="mt-8 text-center text-xs text-slate-400">
            This is a demo application. No real authentication required.
            <br />
            Data resets on page refresh (in-memory).
          </p>
        </div>
      </div>
    </div>
  );
}
