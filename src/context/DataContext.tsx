"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type {
  Student,
  Teacher,
  ClassRoom,
  AttendanceRecord,
  Exam,
  Grade,
  Fee,
} from "@/lib/types";
import {
  STUDENTS,
  TEACHERS,
  CLASSES,
  ATTENDANCE,
  EXAMS,
  GRADES,
  FEES,
} from "@/lib/mock-data";

interface DataContextType {
  students: Student[];
  teachers: Teacher[];
  classes: ClassRoom[];
  attendance: AttendanceRecord[];
  exams: Exam[];
  grades: Grade[];
  fees: Fee[];
  addStudent: (s: Omit<Student, "id">) => void;
  updateStudent: (id: string, s: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  addTeacher: (t: Omit<Teacher, "id">) => void;
  updateTeacher: (id: string, t: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;
  markAttendance: (records: Omit<AttendanceRecord, "id">[]) => void;
  addExam: (e: Omit<Exam, "id">) => void;
  addGrade: (g: Omit<Grade, "id">) => void;
  updateFee: (id: string, f: Partial<Fee>) => void;
  addFee: (f: Omit<Fee, "id">) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

function genId(prefix: string) {
  return `${prefix}${Date.now()}${Math.random().toString(36).slice(2, 6)}`;
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [students, setStudents] = useState<Student[]>(STUDENTS);
  const [teachers, setTeachers] = useState<Teacher[]>(TEACHERS);
  const [classes] = useState<ClassRoom[]>(CLASSES);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(ATTENDANCE);
  const [exams, setExams] = useState<Exam[]>(EXAMS);
  const [grades, setGrades] = useState<Grade[]>(GRADES);
  const [fees, setFees] = useState<Fee[]>(FEES);

  const addStudent = useCallback((s: Omit<Student, "id">) => {
    setStudents((prev) => [...prev, { ...s, id: genId("s") }]);
  }, []);

  const updateStudent = useCallback((id: string, data: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...data } : s))
    );
  }, []);

  const deleteStudent = useCallback((id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const addTeacher = useCallback((t: Omit<Teacher, "id">) => {
    setTeachers((prev) => [...prev, { ...t, id: genId("t") }]);
  }, []);

  const updateTeacher = useCallback((id: string, data: Partial<Teacher>) => {
    setTeachers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data } : t))
    );
  }, []);

  const deleteTeacher = useCallback((id: string) => {
    setTeachers((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const markAttendance = useCallback(
    (records: Omit<AttendanceRecord, "id">[]) => {
      setAttendance((prev) => [
        ...prev,
        ...records.map((r) => ({ ...r, id: genId("a") })),
      ]);
    },
    []
  );

  const addExam = useCallback((e: Omit<Exam, "id">) => {
    setExams((prev) => [...prev, { ...e, id: genId("e") }]);
  }, []);

  const addGrade = useCallback((g: Omit<Grade, "id">) => {
    setGrades((prev) => [...prev, { ...g, id: genId("g") }]);
  }, []);

  const updateFee = useCallback((id: string, data: Partial<Fee>) => {
    setFees((prev) => prev.map((f) => (f.id === id ? { ...f, ...data } : f)));
  }, []);

  const addFee = useCallback((f: Omit<Fee, "id">) => {
    setFees((prev) => [...prev, { ...f, id: genId("f") }]);
  }, []);

  return (
    <DataContext.Provider
      value={{
        students,
        teachers,
        classes,
        attendance,
        exams,
        grades,
        fees,
        addStudent,
        updateStudent,
        deleteStudent,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        markAttendance,
        addExam,
        addGrade,
        updateFee,
        addFee,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
