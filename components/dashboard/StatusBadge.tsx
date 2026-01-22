// components/dashboard/StatusBadge.tsx
import React from "react";

const STATUS_LABELS: Record<string, string> = {
  IDEA: "아이디어",
  PLANNING: "기획",
  WRITING: "작성 중",
  INTERNAL_REVIEW: "내부 검토",
  SUBMITTED: "제출 완료",
  RESULT_PENDING: "결과 대기",
  WON: "수주",
  LOST: "미수주",
};

const STATUS_COLORS: Record<string, string> = {
  IDEA: "bg-slate-100 text-slate-700",
  PLANNING: "bg-slate-100 text-slate-700",
  WRITING: "bg-blue-100 text-blue-700",
  INTERNAL_REVIEW: "bg-purple-100 text-purple-700",
  SUBMITTED: "bg-indigo-100 text-indigo-700",
  RESULT_PENDING: "bg-amber-100 text-amber-700",
  WON: "bg-green-100 text-green-700",
  LOST: "bg-red-100 text-red-700",
};

export default function StatusBadge({ status }: { status: string }) {
  const label = STATUS_LABELS[status] ?? status;
  const color = STATUS_COLORS[status] ?? "bg-slate-100 text-slate-700";

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${color}`}
    >
      {label}
    </span>
  );
}
