"use client";

import { useData } from "@/context/DataContext";
import { getInitials } from "@/lib/utils";

export default function ClassesPage() {
  const { classes, teachers, students } = useData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Classes</h1>
        <p className="text-sm text-slate-500">
          Overview of all classes and sections
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {classes.map((cls) => {
          const teacher = teachers.find((t) => t.id === cls.classTeacherId);
          const enrolled = students.filter((s) => s.classId === cls.id);
          const occupancy = Math.round((enrolled.length / cls.capacity) * 100);

          return (
            <div
              key={cls.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {cls.name} – {cls.section}
                  </h3>
                  <p className="text-sm text-slate-500">
                    Grade {cls.grade} · Room {cls.roomNumber}
                  </p>
                </div>
                <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
                  {enrolled.length}/{cls.capacity}
                </span>
              </div>

              <div className="mt-4">
                <div className="mb-1 flex justify-between text-xs text-slate-500">
                  <span>Occupancy</span>
                  <span>{occupancy}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-indigo-500 transition-all"
                    style={{ width: `${Math.min(occupancy, 100)}%` }}
                  />
                </div>
              </div>

              {teacher && (
                <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-xs font-semibold text-sky-700">
                    {getInitials(teacher.name)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {teacher.name}
                    </p>
                    <p className="text-xs text-slate-400">Class Teacher</p>
                  </div>
                </div>
              )}

              <div className="mt-3 flex flex-wrap gap-1">
                {enrolled.slice(0, 6).map((s) => (
                  <span
                    key={s.id}
                    title={s.name}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-[10px] font-medium text-slate-600"
                  >
                    {getInitials(s.name)}
                  </span>
                ))}
                {enrolled.length > 6 && (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-[10px] font-medium text-slate-600">
                    +{enrolled.length - 6}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
