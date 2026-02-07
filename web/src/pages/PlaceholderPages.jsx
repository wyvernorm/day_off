// =============================================
// 🚧 Placeholder Pages — จะย้ายมาจากระบบเดิมใน Phase ถัดไป
// =============================================

export function StatsPage() {
  return <PlaceholderPage icon="📊" title="สถิติ" desc="กำลังย้ายมาจากระบบเดิม — Phase 3" />;
}

export function PendingPage() {
  return <PlaceholderPage icon="🔔" title="รออนุมัติ" desc="กำลังย้ายมาจากระบบเดิม — Phase 4" />;
}

export function HistoryPage() {
  return <PlaceholderPage icon="📜" title="ประวัติ" desc="กำลังย้ายมาจากระบบเดิม — Phase 4" />;
}

export function KpiPage() {
  return <PlaceholderPage icon="⚡" title="KPI" desc="กำลังย้ายมาจากระบบเดิม — Phase 4" />;
}

export function WalletPage() {
  return <PlaceholderPage icon="💰" title="กระเป๋า" desc="กำลังย้ายมาจากระบบเดิม — Phase 4" />;
}

export function SettingsPage() {
  return <PlaceholderPage icon="⚙️" title="ตั้งค่า" desc="กำลังย้ายมาจากระบบเดิม — Phase 5" />;
}

function PlaceholderPage({ icon, title, desc }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="text-6xl mb-4">{icon}</div>
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-slate-500 text-sm mb-6">{desc}</p>
      <a
        href="https://shift-manager.iplusview.workers.dev"
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary"
      >
        ใช้ระบบเดิม →
      </a>
    </div>
  );
}
