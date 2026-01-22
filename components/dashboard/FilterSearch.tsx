// components/dashboard/FilterSearch.tsx
"use client";

import React, { useState } from "react";
import RecentProposalsTable from "./RecentProposalsTable";
import { getProposals } from "@/lib/api";

type FilterOptions = {
  clients: string[];
  owners: string[];
};

const STATUS_OPTIONS = [
  { value: "ALL", label: "전체" },
  { value: "IDEA", label: "아이디어" },
  { value: "PLANNING", label: "기획" },
  { value: "WRITING", label: "작성 중" },
  { value: "INTERNAL_REVIEW", label: "내부 검토" },
  { value: "SUBMITTED", label: "제출 완료" },
  { value: "RESULT_PENDING", label: "결과 대기" },
  { value: "WON", label: "수주" },
  { value: "LOST", label: "미수주" },
];

export default function FilterSearch({
  filters,
}: {
  filters: FilterOptions;
}) {
  const [status, setStatus] = useState<string>("ALL");
  const [client, setClient] = useState<string>("ALL");
  const [owner, setOwner] = useState<string>("ALL");
  const [keyword, setKeyword] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getProposals({
        status,
        client_name: client,
        owner_name: owner,
        q: keyword,
      });
      setResults(data);
    } catch (e: any) {
      console.error(e);
      setError(e.message ?? "검색 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6 space-y-4">
      {/* 필터 폼 */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex flex-wrap items-end gap-4">
        {/* 상태 */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">상태</label>
          <select
            className="border rounded-lg px-3 py-2 text-sm min-w-[140px]"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* 고객사 */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">고객사</label>
          <select
            className="border rounded-lg px-3 py-2 text-sm min-w-[160px]"
            value={client}
            onChange={(e) => setClient(e.target.value)}
          >
            <option value="ALL">전체</option>
            {filters.clients.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* 담당자 */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">담당자</label>
          <select
            className="border rounded-lg px-3 py-2 text-sm min-w-[140px]"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
          >
            <option value="ALL">전체</option>
            {filters.owners.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>

        {/* 키워드 */}
        <div className="flex flex-col gap-1 flex-1 min-w-[180px]">
          <label className="text-xs text-gray-500">키워드 검색</label>
          <input
            className="border rounded-lg px-3 py-2 text-sm w-full"
            placeholder="제목/고객사/태그 검색"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        {/* 버튼 */}
        <button
          className="ml-auto px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300"
          onClick={handleSearch}
          disabled={loading}
          type="button"
        >
          {loading ? "검색 중..." : "검색"}
        </button>
      </div>

      {/* 검색 결과 */}
      {error && (
        <p className="text-sm text-red-500">검색 오류: {error}</p>
      )}

      {results && (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-sm font-semibold mb-3">
            검색 결과 ({results.length}건)
          </h2>
          <RecentProposalsTable proposals={results} />
        </div>
      )}
    </div>
  );
}
