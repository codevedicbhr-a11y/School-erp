"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { cn, getInitials } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: "📊", roles: ["admin", "teacher", "student"] },
  { href: "/students", label: "Students", icon: "👨‍🎓", roles: ["admin", "teacher"] },
  { href: "/teachers", label: "Teachers", icon: "👩‍🏫", roles: ["admin"] },
  { href: "/classes", label: "Classes", icon: "🏫", roles: ["admin", "teacher"] },
  { href: "/attendance", label: "Attendance", icon: "✅", roles: ["admin", "teacher"] },
  { href: "/exams", label: "Exams & Grades", icon: "📝", roles: ["admin", "teacher", "student"] },
  { href: "/fees", label: "Fees", icon: "💰", roles: ["admin", "student"] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (!user) return null;

  const filtered = navItems.filter((item) => item.roles.includes(user.role));

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-200 bg-white shadow-sm">
      <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-lg font-bold text-white">
          SE
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">SchoolERP</p>
          <p className="text-xs text-slate-500">Demo Edition</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {filtered.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
            {getInitials(user.name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-900">
              {user.name}
            </p>
            <p className="truncate text-xs capitalize text-slate-500">
              {user.role}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
