// @ts-nocheck
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import KpiCard from "@/components/dashboard/KpiCard";
import { MdCreate, MdLoop, MdCheckCircle, MdPaid } from "react-icons/md";
import PipelineBar from "@/components/dashboard/PipelineBar"; 
import RecentProposalsTable from "@/components/dashboard/RecentProposalsTable";
import FilterSearch from "@/components/dashboard/FilterSearch";

import {
  getStatsSummary,
  getStatsPipeline,
  getRecentInProgress,
  getFilterOptions,
} from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [summary, pipeline, recent, filters] = await Promise.all([
    getStatsSummary(),
    getStatsPipeline(),
    getRecentInProgress(10),
    getFilterOptions(),
  ]);

  return (
    
    <DashboardLayout> 
      {/* 🔍 상단 필터 + 검색 결과 */}
      <FilterSearch filters={filters} />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <KpiCard
        title="이번 달 신규 제안"
        value={summary.new_proposals_this_month}
        icon={MdCreate}
        color="blue"
        />

        <KpiCard
        title="진행 중 제안"
        value={summary.in_progress_count}
        icon={MdLoop}
        color="purple"
        />

        <KpiCard
        title="올해 수주 건수"
        value={summary.won_count_this_year}
        icon={MdCheckCircle}
        color="green"
        />

        <KpiCard
        title="올해 수주 금액"
        value={summary.won_amount_this_year.toLocaleString() + "원"}
        icon={MdPaid}
        color="orange"
        />

      </div>
      {/* 제안 진행 현황 파이프라인 */}
      <div className="mt-4">
        <Card title="제안 진행 현황">
          <PipelineBar pipeline={pipeline.pipeline} />
        </Card>
      </div>

      {/* 최근 진행 중 제안 테이블 */}
      <div className="mt-6">
        <Card title="최근 진행 중 제안">
          <RecentProposalsTable proposals={recent} />
        </Card>
      </div>

    </DashboardLayout>
  );
}
