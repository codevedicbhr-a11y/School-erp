"use client";

import { useState } from "react";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { formatDate, getInitials } from "@/lib/utils";
import type { AttendanceRecord } from "@/lib/types";

export default function AttendancePage() {
  const { students, classes, attendance, markAttendance } = useData();
  const { user } = useAuth();
  const [selectedClass, setSelectedClass] = useState(classes[0]?.id ?? "");
  const [date, setDate] = useState("2026-10-09");
  const [statusMap, setStatusMap] = useState<
    Record<string, AttendanceRecord["status"]>
  >({});
  const [saved, setSaved] = useState(false);

  const classStudents = students.filter((s) => s.classId === selectedClass);

  const existingForDate = attendance.filter(
    (a) => a.classId === selectedClass && a.date === date
  );

  const handleMark = (studentId: string, status: AttendanceRecord["status"]) => {
    setStatusMap((prev) => ({ ...prev, [studentId]: status }));
    setSaved(false);
  };

  const handleSave = () => {
    const records = classStudents
      .filter((s) => statusMap[s.id])
      .map((s) => ({
        studentId: s.id,
        classId: selectedClass,
        date,
        status: statusMap[s.id],
        markedBy: user?.id ?? "system",
      }));
    if (records.length > 0) {
      markAttendance(records);
      setSaved(true);
      setStatusMap({});
    }
  };

  const getStatus = (studentId: string) => {
    if (statusMap[studentId]) return statusMap[studentId];
    const existing = existingForDate.find((a) => a.studentId === studentId);
    return existing?.status;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Attendance</h1>
        <p className="text-sm text-slate-500">
          Mark and review student attendance
        </p>
      </div>

      <div className="flex flex-wrap gap-4">
        <select
          value={selectedClass}
          onChange={(e) => {
            setSelectedClass(e.target.value);
            setStatusMap({});
            setSaved(false);
          }}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-indigo-400"
        >
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} {c.section}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setStatusMap({});
            setSaved(false);
          }}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-indigo-400"
        />
        <button
          onClick={handleSave}
          disabled={Object.keys(statusMap).length === 0}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          Save Attendance
        </button>
        {saved && (
          <span className="flex items-center text-sm font-medium text-emerald-600">
            ✓ Saved successfully
          </span>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-5 py-3 font-medium">Student</th>
              <th className="px-5 py-3 font-medium">Roll No</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Mark</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {classStudents.map((s) => {
              const status = getStatus(s.id);
              return (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                        {getInitials(s.name)}
                      </div>
                      <span className="font-medium text-slate-900">
                        {s.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-mono text-slate-600">
                    {s.rollNumber}
                  </td>
                  <td className="px-5 py-3">
                    {status ? (
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                          status === "present"
                            ? "bg-emerald-100 text-emerald-700"
                            : status === "late"
                              ? "bg-amber-100 text-amber-700"
                              : status === "absent"
                                ? "bg-rose-100 text-rose-700"
                                : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {status}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">Not marked</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-1">
                      {(
                        ["present", "absent", "late", "excused"] as const
                      ).map((st) => (
                        <button
                          key={st}
                          onClick={() => handleMark(s.id, st)}
                          className={`rounded px-2 py-1 text-xs font-medium capitalize transition ${
                            statusMap[s.id] === st
                              ? "bg-indigo-600 text-white"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {st[0].toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {classStudents.length === 0 && (
          <p className="py-12 text-center text-sm text-slate-400">
            No students in this class
          </p>
        )}
      </div>
    </div>
  );
}
