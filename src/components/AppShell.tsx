"use client";

import { useAuth } from "@/context/AuthContext";
import Sidebar from "./Sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === "/login";

  useEffect(() => {
    if (!isAuthenticated && !isLoginPage) {
      router.replace("/login");
    }
    if (isAuthenticated && isLoginPage) {
      router.replace("/");
    }
  }, [isAuthenticated, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        <div className="px-6 py-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
