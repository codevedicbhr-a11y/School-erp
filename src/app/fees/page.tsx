"use client";

import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { formatCurrency, formatDate, getInitials } from "@/lib/utils";

export default function FeesPage() {
  const { fees, students, updateFee } = useData();
  const { user } = useAuth();

  const displayFees =
    user?.role === "student"
      ? fees.filter((f) => f.studentId === "s1") // demo student
      : fees;

  const handleMarkPaid = (id: string) => {
    updateFee(id, {
      status: "paid",
      paidDate: new Date().toISOString().slice(0, 10),
      receiptNumber: `RCP-${Date.now().toString().slice(-6)}`,
    });
  };

  const totalPending = displayFees
    .filter((f) => f.status !== "paid")
    .reduce((s, f) => s + f.amount, 0);
  const totalPaid = displayFees
    .filter((f) => f.status === "paid")
    .reduce((s, f) => s + f.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Fees</h1>
        <p className="text-sm text-slate-500">
          Track fee payments and outstanding dues
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Collected</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">
            {formatCurrency(totalPaid)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Pending Amount</p>
          <p className="mt-1 text-2xl font-bold text-amber-600">
            {formatCurrency(totalPending)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Invoices</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {displayFees.length}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-5 py-3 font-medium">Student</th>
              <th className="px-5 py-3 font-medium">Type</th>
              <th className="px-5 py-3 font-medium">Amount</th>
              <th className="px-5 py-3 font-medium">Due Date</th>
              <th className="px-5 py-3 font-medium">Status</th>
              {user?.role === "admin" && (
                <th className="px-5 py-3 font-medium">Action</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayFees.map((fee) => {
              const student = students.find((s) => s.id === fee.studentId);
              return (
                <tr key={fee.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                        {getInitials(student?.name ?? "?")}
                      </div>
                      <span className="font-medium text-slate-900">
                        {student?.name ?? "Unknown"}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 capitalize text-slate-600">
                    {fee.type}
                  </td>
                  <td className="px-5 py-3 font-medium text-slate-900">
                    {formatCurrency(fee.amount)}
                  </td>
                  <td className="px-5 py-3 text-slate-600">
                    {formatDate(fee.dueDate)}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                        fee.status === "paid"
                          ? "bg-emerald-100 text-emerald-700"
                          : fee.status === "overdue"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {fee.status}
                    </span>
                    {fee.receiptNumber && (
                      <p className="mt-0.5 text-xs text-slate-400">
                        {fee.receiptNumber}
                      </p>
                    )}
                  </td>
                  {user?.role === "admin" && (
                    <td className="px-5 py-3">
                      {fee.status !== "paid" && (
                        <button
                          onClick={() => handleMarkPaid(fee.id)}
                          className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                        >
                          Mark Paid
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
        {displayFees.length === 0 && (
          <p className="py-12 text-center text-sm text-slate-400">
            No fee records
          </p>
        )}
      </div>
    </div>
  );
}
