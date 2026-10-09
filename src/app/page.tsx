"use client";

import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import StatCard from "@/components/StatCard";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();
  const { students, teachers, classes, attendance, exams, fees } = useData();

  const today = "2026-10-08";
  const todayAttendance = attendance.filter((a) => a.date === today);
  const presentCount = todayAttendance.filter(
    (a) => a.status === "present" || a.status === "late"
  ).length;
  const attendanceRate =
    todayAttendance.length > 0
      ? Math.round((presentCount / todayAttendance.length) * 100)
      : 0;

  const pendingFees = fees.filter((f) => f.status !== "paid");
  const pendingAmount = pendingFees.reduce((sum, f) => sum + f.amount, 0);

  const upcomingExams = exams.filter(
    (e) => new Date(e.date) >= new Date("2026-10-09")
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Here&apos;s what&apos;s happening at your school today.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Students"
          value={students.length}
          icon="👨‍🎓"
          color="indigo"
          subtitle={`${students.filter((s) => s.status === "active").length} active`}
        />
        <StatCard
          title="Teachers"
          value={teachers.length}
          icon="👩‍🏫"
          color="sky"
          subtitle={`${classes.length} classes`}
        />
        <StatCard
          title="Attendance Today"
          value={`${attendanceRate}%`}
          icon="✅"
          color="emerald"
          subtitle={`${presentCount}/${todayAttendance.length} present`}
        />
        <StatCard
          title="Pending Fees"
          value={formatCurrency(pendingAmount)}
          icon="💰"
          color="amber"
          subtitle={`${pendingFees.length} invoices`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="font-semibold text-slate-900">Upcoming Exams</h2>
            <Link
              href="/exams"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {upcomingExams.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-slate-400">
                No upcoming exams
              </p>
            ) : (
              upcomingExams.slice(0, 4).map((exam) => {
                const cls = classes.find((c) => c.id === exam.classId);
                return (
                  <div
                    key={exam.id}
                    className="flex items-center justify-between px-5 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {exam.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {cls?.name} {cls?.section} · {exam.subject}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-700">
                        {formatDate(exam.date)}
                      </p>
                      <p className="text-xs capitalize text-slate-400">
                        {exam.type}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="font-semibold text-slate-900">
              Today&apos;s Attendance
            </h2>
            <Link
              href="/attendance"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              Manage
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {todayAttendance.slice(0, 5).map((rec) => {
              const student = students.find((s) => s.id === rec.studentId);
              const statusColor =
                rec.status === "present"
                  ? "bg-emerald-100 text-emerald-700"
                  : rec.status === "late"
                    ? "bg-amber-100 text-amber-700"
                    : rec.status === "absent"
                      ? "bg-rose-100 text-rose-700"
                      : "bg-slate-100 text-slate-600";
              return (
                <div
                  key={rec.id}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {student?.name ?? "Unknown"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {student?.rollNumber}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusColor}`}
                  >
                    {rec.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 font-semibold text-slate-900">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {user?.role !== "student" && (
            <>
              <Link
                href="/students"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                + Add Student
              </Link>
              <Link
                href="/attendance"
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Mark Attendance
              </Link>
            </>
          )}
          {(user?.role === "admin" || user?.role === "student") && (
            <Link
              href="/fees"
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              View Fees
            </Link>
          )}
          <Link
            href="/exams"
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Exams & Grades
          </Link>
        </div>
      </div>
    </div>
  );
}
