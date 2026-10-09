"use client";

import { useState } from "react";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { formatDate, calculateGrade } from "@/lib/utils";

export default function ExamsPage() {
  const { exams, classes, students, grades, addExam, addGrade } = useData();
  const { user } = useAuth();
  const [showExamForm, setShowExamForm] = useState(false);
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [marksInput, setMarksInput] = useState<Record<string, number>>({});
  const [examForm, setExamForm] = useState({
    name: "",
    classId: classes[0]?.id ?? "",
    subject: "",
    date: "",
    maxMarks: 100,
    type: "midterm" as const,
  });

  const handleAddExam = (e: React.FormEvent) => {
    e.preventDefault();
    addExam(examForm);
    setShowExamForm(false);
    setExamForm({
      name: "",
      classId: classes[0]?.id ?? "",
      subject: "",
      date: "",
      maxMarks: 100,
      type: "midterm",
    });
  };

  const handleSaveGrades = () => {
    if (!selectedExam) return;
    const exam = exams.find((e) => e.id === selectedExam);
    if (!exam) return;
    Object.entries(marksInput).forEach(([studentId, marks]) => {
      addGrade({
        examId: selectedExam,
        studentId,
        marks,
        grade: calculateGrade(marks, exam.maxMarks),
      });
    });
    setMarksInput({});
    setSelectedExam(null);
  };

  const examStudents = selectedExam
    ? students.filter(
        (s) => s.classId === exams.find((e) => e.id === selectedExam)?.classId
      )
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Exams & Grades</h1>
          <p className="text-sm text-slate-500">
            Schedule exams and record student marks
          </p>
        </div>
        {user?.role !== "student" && (
          <button
            onClick={() => setShowExamForm(true)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            + Schedule Exam
          </button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {exams.map((exam) => {
          const cls = classes.find((c) => c.id === exam.classId);
          const examGrades = grades.filter((g) => g.examId === exam.id);
          return (
            <div
              key={exam.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">{exam.name}</h3>
                  <p className="text-sm text-slate-500">
                    {cls?.name} {cls?.section} · {exam.subject}
                  </p>
                </div>
                <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-medium capitalize text-violet-700">
                  {exam.type}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-slate-500">
                  {formatDate(exam.date)} · Max {exam.maxMarks}
                </span>
                <span className="text-slate-600">
                  {examGrades.length} graded
                </span>
              </div>
              {user?.role !== "student" && (
                <button
                  onClick={() => setSelectedExam(exam.id)}
                  className="mt-3 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                  Enter Grades →
                </button>
              )}
              {user?.role === "student" && examGrades.length > 0 && (
                <div className="mt-3 space-y-1">
                  {examGrades
                    .filter((g) => g.studentId === "s1" || true)
                    .slice(0, 2)
                    .map((g) => {
                      const st = students.find((s) => s.id === g.studentId);
                      return (
                        <div
                          key={g.id}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-slate-600">{st?.name}</span>
                          <span className="font-medium">
                            {g.marks}/{exam.maxMarks} ({g.grade})
                          </span>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Grade entry modal */}
      {selectedExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold">
              Enter Grades – {exams.find((e) => e.id === selectedExam)?.name}
            </h2>
            <div className="mt-4 space-y-3">
              {examStudents.map((s) => {
                const existing = grades.find(
                  (g) => g.examId === selectedExam && g.studentId === s.id
                );
                return (
                  <div
                    key={s.id}
                    className="flex items-center justify-between gap-3"
                  >
                    <span className="text-sm font-medium text-slate-800">
                      {s.name}
                    </span>
                    {existing ? (
                      <span className="text-sm text-slate-500">
                        {existing.marks} ({existing.grade})
                      </span>
                    ) : (
                      <input
                        type="number"
                        min={0}
                        max={
                          exams.find((e) => e.id === selectedExam)?.maxMarks ??
                          100
                        }
                        placeholder="Marks"
                        value={marksInput[s.id] ?? ""}
                        onChange={(e) =>
                          setMarksInput({
                            ...marksInput,
                            [s.id]: Number(e.target.value),
                          })
                        }
                        className="w-24 rounded-lg border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-indigo-400"
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setSelectedExam(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveGrades}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
              >
                Save Grades
              </button>
            </div>
          </div>
        </div>
      )}

      {showExamForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold">Schedule New Exam</h2>
            <form onSubmit={handleAddExam} className="mt-4 space-y-3">
              <input
                required
                placeholder="Exam Name"
                value={examForm.name}
                onChange={(e) =>
                  setExamForm({ ...examForm, name: e.target.value })
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
              />
              <select
                value={examForm.classId}
                onChange={(e) =>
                  setExamForm({ ...examForm, classId: e.target.value })
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.section}
                  </option>
                ))}
              </select>
              <input
                required
                placeholder="Subject"
                value={examForm.subject}
                onChange={(e) =>
                  setExamForm({ ...examForm, subject: e.target.value })
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
              />
              <input
                required
                type="date"
                value={examForm.date}
                onChange={(e) =>
                  setExamForm({ ...examForm, date: e.target.value })
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
              />
              <input
                required
                type="number"
                placeholder="Max Marks"
                value={examForm.maxMarks}
                onChange={(e) =>
                  setExamForm({
                    ...examForm,
                    maxMarks: Number(e.target.value),
                  })
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
              />
              <select
                value={examForm.type}
                onChange={(e) =>
                  setExamForm({
                    ...examForm,
                    type: e.target.value as typeof examForm.type,
                  })
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
              >
                <option value="midterm">Midterm</option>
                <option value="final">Final</option>
                <option value="quiz">Quiz</option>
                <option value="assignment">Assignment</option>
              </select>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowExamForm(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
                >
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
