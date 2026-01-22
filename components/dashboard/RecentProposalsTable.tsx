// components/dashboard/RecentProposalsTable.tsx
"use client";

import React from "react";
import Link from "next/link";
import StatusBadge from "./StatusBadge";

type ProposalRow = {
  id: number;
  title: string;
  client_name: string;
  owner_name?: string | null;
  status: string;
  submit_due_date?: string | null;
  expected_amount?: number | null;
  updated_at: string;
};

function formatDate(value?: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("ko-KR");
}

function formatAmount(value?: number | null) {
  if (!value) return "-";
  return new Intl.NumberFormat("ko-KR").format(value) + "원";
}

export default function RecentProposalsTable({
  proposals,
}: {
  proposals: ProposalRow[];
}) {
  if (!proposals || proposals.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        현재 진행 중인 제안이 없습니다.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b bg-gray-50">
            <th className="py-2 pr-4 text-xs font-medium">상태</th>
            <th className="py-2 pr-4 text-xs font-medium">제안 제목</th>
            <th className="py-2 pr-4 text-xs font-medium">고객사</th>
            <th className="py-2 pr-4 text-xs font-medium">담당자</th>
            <th className="py-2 pr-4 text-xs font-medium">제출 마감일</th>
            <th className="py-2 pr-4 text-xs font-medium text-right">
              예상 금액
            </th>
            <th className="py-2 pr-2 text-xs font-medium">
              마지막 업데이트
            </th>
          </tr>
        </thead>

        <tbody>
          {proposals.map((proposal) => (
            <tr
              key={proposal.id}
              className="border-b last:border-0 hover:bg-gray-50 transition-colors align-top"
            >
              <td className="py-3 pr-4">
                <StatusBadge status={proposal.status} />
              </td>

              {/* 제목 클릭 → 상세 페이지 이동 */}
              <td className="py-3 pr-4 whitespace-normal break-words">
                <Link
                  href={`/proposals/${proposal.id}`}
                  className="font-medium text-gray-900 hover:underline"
                >
                  {proposal.title}
                </Link>
              </td>

              <td className="py-3 pr-4 whitespace-normal break-words text-gray-700">
                {proposal.client_name}
              </td>

              <td className="py-3 pr-4 whitespace-normal break-words text-gray-700">
                {proposal.owner_name || "-"}
              </td>

              <td className="py-3 pr-4 text-gray-700">
                {formatDate(proposal.submit_due_date)}
              </td>

              <td className="py-3 pr-4 text-right text-gray-900 whitespace-nowrap">
                {formatAmount(proposal.expected_amount ?? undefined)}
              </td>

              <td className="py-3 pr-2 text-gray-500 whitespace-nowrap">
                {formatDate(proposal.updated_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
