// =============================================
// 🚧 Placeholder Pages — ลิงก์ไประบบเดิมได้
// =============================================

import { ArrowRight } from 'lucide-react';

export function StatsPage() {
  return <PlaceholderPage icon="📊" title="สถิติ" desc="กำลังย้ายมา React — Phase 3" hash="#stats" />;
}

export function PendingPage() {
  return <PlaceholderPage icon="🔔" title="รออนุมัติ" desc="กำลังย้ายมา React — Phase 4" hash="#pending" />;
}

export function HistoryPage() {
  return <PlaceholderPage icon="📜" title="ประวัติ" desc="กำลังย้ายมา React — Phase 4" hash="#history" />;
}

export function KpiPage() {
  return <PlaceholderPage icon="⚡" title="KPI" desc="กำลังย้ายมา React — Phase 4" hash="#kpi" />;
}

export function WalletPage() {
  return <PlaceholderPage icon="💰" title="กระเป๋า" desc="กำลังย้ายมา React — Phase 4" hash="#wallet" />;
}

export function SettingsPage() {
  return <PlaceholderPage icon="⚙️" title="ตั้งค่า" desc="กำลังย้ายมา React — Phase 5" hash="#settings" />;
}

function PlaceholderPage({ icon, title, desc, hash }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="text-6xl mb-4 animate-bounce">{icon}</div>
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-slate-400 text-sm mb-8">{desc}</p>
      <a
        href="/legacy"
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-2xl font-semibold text-sm hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/25 active:scale-95"
      >
        ใช้ระบบเดิม <ArrowRight className="w-4 h-4" />
      </a>
      <p className="text-xs text-slate-400 mt-4">
        หน้านี้กำลังพัฒนาเป็น React เร็วๆ นี้
      </p>
    </div>
  );
}
