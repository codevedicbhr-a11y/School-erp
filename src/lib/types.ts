export type Role = "admin" | "teacher" | "student";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  classId: string;
  rollNumber: string;
  gender: "male" | "female" | "other";
  dateOfBirth: string;
  address: string;
  parentName: string;
  parentPhone: string;
  admissionDate: string;
  status: "active" | "inactive";
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  department: string;
  joinDate: string;
  status: "active" | "inactive";
}

export interface ClassRoom {
  id: string;
  name: string;
  section: string;
  grade: number;
  classTeacherId: string;
  capacity: number;
  roomNumber: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  status: "present" | "absent" | "late" | "excused";
  markedBy: string;
}

export interface Exam {
  id: string;
  name: string;
  classId: string;
  subject: string;
  date: string;
  maxMarks: number;
  type: "midterm" | "final" | "quiz" | "assignment";
}

export interface Grade {
  id: string;
  examId: string;
  studentId: string;
  marks: number;
  grade: string;
  remarks?: string;
}

export interface Fee {
  id: string;
  studentId: string;
  amount: number;
  type: "tuition" | "transport" | "library" | "lab" | "other";
  dueDate: string;
  paidDate?: string;
  status: "paid" | "pending" | "overdue";
  receiptNumber?: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  pendingFees: number;
  attendanceToday: number;
  upcomingExams: number;
}
