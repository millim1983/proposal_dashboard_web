// app/proposals/[id]/page.tsx
// @ts-nocheck (제거 권장: 타입 체크를 살리는 것이 좋습니다)

import React from "react";
import { notFound } from "next/navigation"; // 1. notFound 함수 임포트
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { getProposal } from "@/lib/api";

function formatDate(value?: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("ko-KR");
}

function formatAmount(value?: number | null) {
  if (!value) return "-";
  return new Intl.NumberFormat("ko-KR").format(value) + "원";
}

export default async function ProposalDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // 2. ID를 숫자로 변환
  const id = Number(params.id);

  // 3. [방어 로직] 숫자가 아니면(NaN) 즉시 404 페이지로 보냄
  // 예: /proposals/id, /proposals/new 등의 주소로 잘못 접근했을 때 API 호출을 막아줌
  if (isNaN(id)) {
    notFound();
  }

  // 4. 숫자가 확실할 때만 API 호출
  // try-catch로 감싸서 API 에러(없는 ID 등) 발생 시에도 에러 페이지 대신 404 처리가 가능하도록 함
  let proposal;
  try {
    proposal = await getProposal(id);
  } catch (error) {
    // 백엔드에서 404를 주거나 에러가 나면 여기서 처리
    console.error("Failed to fetch proposal:", error);
    notFound();
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* 상단 제목 + 상태 */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">
              제안 ID #{proposal.id}
            </p>
            <h1 className="text-2xl font-bold text-gray-900">
              {proposal.title}
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              고객사: {proposal.client_name} · 담당자:{" "}
              {proposal.owner_name || "-"}
            </p>
          </div>
          <StatusBadge status={proposal.status} />
        </div>

        {/* ... 나머지 카드 컴포넌트들 ... */}
        <Card title="기본 정보">
           {/* (기존 코드 유지) */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
             <div>
               <p className="text-gray-500">고객사</p>
               <p className="font-medium text-gray-900">{proposal.client_name}</p>
             </div>
             {/* ... */}
           </div>
        </Card>
        
        {/* ... (나머지 부분 기존과 동일) ... */}
        
      </div>
    </DashboardLayout>
  );
}