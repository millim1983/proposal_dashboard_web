// app/proposals/[id]/page.tsx
// @ts-nocheck

import React from "react";
import { notFound } from "next/navigation";
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

// 1. Next.js 15 버전 대응: params를 Promise로 정의
type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProposalDetailPage({ params }: Props) {
  // 2. await로 params 껍질 벗기기 (필수!)
  const resolvedParams = await params;
  
  // 3. ID를 숫자로 변환
  const id = Number(resolvedParams.id);

  // 4. [방어막] 숫자가 아니면(NaN) API 요청을 보내지 않고 바로 404 처리
  // 이 코드가 있어야 백엔드에 'GET /proposals/id' 요청이 안 날아갑니다.
  if (isNaN(id)) {
    console.log(`잘못된 접근 차단: id=${resolvedParams.id}`);
    notFound(); 
  }

  // 5. 실제 데이터 조회
  let proposal;
  try {
    proposal = await getProposal(id);
  } catch (error) {
    // 6. 데이터가 없거나(404) DB 에러가 나면 404 페이지 보여주기
    console.error(`제안서 조회 실패 (ID: ${id}):`, error);
    notFound();
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
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

        <Card title="기본 정보">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">고객사</p>
              <p className="font-medium text-gray-900">
                {proposal.client_name}
              </p>
            </div>
            <div>
              <p className="text-gray-500">사업 도메인</p>
              <p className="font-medium text-gray-900">
                {proposal.business_domain || "-"}
              </p>
            </div>
            <div>
              <p className="text-gray-500">담당자</p>
              <p className="font-medium text-gray-900">
                {proposal.owner_name || "-"}
              </p>
            </div>
            <div>
              <p className="text-gray-500">팀</p>
              <p className="font-medium text-gray-900">
                {proposal.team_name || "-"}
              </p>
            </div>
          </div>
        </Card>

        <Card title="일정">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500">아이디어 등록일</p>
              <p className="font-medium text-gray-900">
                {formatDate(proposal.idea_date)}
              </p>
            </div>
            <div>
              <p className="text-gray-500">기획 시작일</p>
              <p className="font-medium text-gray-900">
                {formatDate(proposal.planning_start_date)}
              </p>
            </div>
            <div>
              <p className="text-gray-500">제출 마감일</p>
              <p className="font-medium text-gray-900">
                {formatDate(proposal.submit_due_date)}
              </p>
            </div>
            <div>
              <p className="text-gray-500">결과 수신일</p>
              <p className="font-medium text-gray-900">
                {formatDate(proposal.result_date)}
              </p>
            </div>
          </div>
        </Card>

        <Card title="금액 및 우선순위">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500">예상 금액</p>
              <p className="font-medium text-gray-900">
                {formatAmount(proposal.expected_amount)}
              </p>
            </div>
            <div>
              <p className="text-gray-500">통화</p>
              <p className="font-medium text-gray-900">
                {proposal.currency || "KRW"}
              </p>
            </div>
            <div>
              <p className="text-gray-500">우선순위</p>
              <p className="font-medium text-gray-900">
                {proposal.priority || "-"}
              </p>
            </div>
          </div>
        </Card>

        <Card title="비고">
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-500 mb-1">단계 메모</p>
              <p className="whitespace-pre-wrap text-gray-900">
                {proposal.stage_note || "-"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">키워드</p>
              <p className="text-gray-900">
                {proposal.keywords || "-"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">RFP 번호</p>
              <p className="text-gray-900">
                {proposal.rfp_no || "-"}
              </p>
            </div>
          </div>
        </Card>

        <p className="text-xs text-gray-400">
          생성일: {formatDate(proposal.created_at)} · 마지막 업데이트:{" "}
          {formatDate(proposal.updated_at)}
        </p>
      </div>
    </DashboardLayout>
  );
}