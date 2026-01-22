// components/dashboard/PipelineBar.tsx
import React from "react";

type PipelineItem = {
  status: string;
  count: number;
  total_expected_amount: number;
};

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
  IDEA: "bg-slate-50 border-slate-200",
  PLANNING: "bg-slate-50 border-slate-200",
  WRITING: "bg-blue-50 border-blue-200",
  INTERNAL_REVIEW: "bg-purple-50 border-purple-200",
  SUBMITTED: "bg-indigo-50 border-indigo-200",
  RESULT_PENDING: "bg-amber-50 border-amber-200",
  WON: "bg-green-50 border-green-200",
  LOST: "bg-red-50 border-red-200",
};

function formatKRW(amount: number) {
  if (!amount) return "0원";
  return new Intl.NumberFormat("ko-KR").format(amount) + "원";
}

export default function PipelineBar({ pipeline }: { pipeline: PipelineItem[] }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {pipeline.map((item, idx) => {
        const label = STATUS_LABELS[item.status] ?? item.status;
        const colorClasses = STATUS_COLORS[item.status] ?? "bg-slate-50 border-slate-200";

        return (
          <div key={item.status} className="flex items-center gap-3">
            <div
              className={`min-w-[170px] px-4 py-3 rounded-2xl border shadow-sm ${colorClasses}`}
            >
              <p className="text-xs text-gray-500 mb-1">{label}</p>
              <p className="text-lg font-bold leading-tight mb-1">
                {item.count}건
              </p>
              <p className="text-xs text-gray-500">
                예상 금액 {formatKRW(item.total_expected_amount)}
              </p>
            </div>

            {/* 마지막 아니면 화살표 표시 */}
            {idx < pipeline.length - 1 && (
              <div className="text-gray-300 text-lg shrink-0">➜</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
