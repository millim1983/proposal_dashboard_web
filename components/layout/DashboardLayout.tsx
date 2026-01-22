// components/layout/DashboardLayout.tsx
import React from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="w-full bg-white shadow-sm p-4">
        <h1 className="text-xl font-bold">📊 Proposal Dashboard</h1>
      </header>

      {/* Main */}
      <main className="flex-1 p-6 max-w-7xl mx-auto">{children}</main>
    </div>
  );
}
