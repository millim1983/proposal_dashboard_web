// lib/api.ts
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

async function fetchJSON<T>(path: string, init?: RequestInit): Promise<T> {
const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
});

if (!res.ok) {
    const text = await res.text();  // ★ 에러 상세 읽기
    console.error("API error body:", text); // 서버 콘솔에 찍힘
    throw new Error(`API error: ${res.status} ${res.statusText} - ${text}`);
}

return res.json();
}

// 대시보드에서 쓸 API들 래핑

export async function getStatsSummary() {
  return fetchJSON<{
    new_proposals_this_month: number;
    in_progress_count: number;
    won_count_this_year: number;
    won_amount_this_year: number;
    currency: string;
  }>("/stats/summary");
}

export async function getStatsPipeline() {
  return fetchJSON<{
    pipeline: {
      status: string;
      count: number;
      total_expected_amount: number;
    }[];
  }>("/stats/pipeline");
}

export async function getRecentInProgress(limit = 10) {
  const params = new URLSearchParams({ limit: String(limit) });
  return fetchJSON<
    {
      id: number;
      title: string;
      client_name: string;
      owner_name?: string;
      status: string;
      submit_due_date?: string;
      expected_amount?: number;
      updated_at: string;
    }[]
  >(`/proposals/recent-in-progress?${params.toString()}`);
}

export async function getFilterOptions() {
  return fetchJSON<{
    clients: string[];
    owners: string[];
  }>("/proposals/filters/options");
}


// lib/api.ts 맨 아래 쪽에 추가
// API 헬퍼: /proposals/ 검색용 함수 추가
// getProposals({ ... }) 호출하면 필터 조건에 맞는 제안 목록을 백엔드에서 받아옴
export async function getProposals(params: {
    status?: string;
    client_name?: string;
    owner_name?: string;
    q?: string;
  }) {
    const searchParams = new URLSearchParams();
  
    if (params.status && params.status !== "ALL") {
      // FastAPI 쪽은 status를 List로 받지만, 한 개만 보내도 자동으로 리스트로 처리됨
      searchParams.append("status", params.status);
    }
    if (params.client_name && params.client_name !== "ALL") {
      searchParams.append("client_name", params.client_name);
    }
    if (params.owner_name && params.owner_name !== "ALL") {
      searchParams.append("owner_name", params.owner_name);
    }
    if (params.q && params.q.trim() !== "") {
      searchParams.append("q", params.q.trim());
    }
  
    const qs = searchParams.toString();
    const path = qs ? `/proposals/?${qs}` : "/proposals/";
  
    return fetchJSON<any[]>(path);
  }
  
  // 단일 제안 조회 
  export async function getProposal(id: number) {

    return fetchJSON(`/proposals/${id}`);

  }

 