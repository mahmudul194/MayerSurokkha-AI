import { cn } from "@/lib/utils";

export function RoleBadge({ role, t, language }: { role: string, t: any, language: string }) {
  const colors = {
    MOTHER: "text-blue-600 bg-blue-50 border-blue-100 shadow-blue-50",
    DOCTOR: "text-pink-600 bg-pink-50 border-pink-100 shadow-pink-50",
    WORKER: "text-emerald-600 bg-emerald-50 border-emerald-100 shadow-emerald-50",
    ADMIN: "text-slate-600 bg-slate-50 border-slate-100 shadow-slate-50"
  };
  const roleLabels: any = { MOTHER: t.mother, DOCTOR: t.doctor, WORKER: t.worker, ADMIN: t.admin };
  return (
    <div className={cn(
      "px-5 py-2 rounded-full border font-black tracking-widest uppercase shadow-xs", 
      colors[role as keyof typeof colors] || colors.ADMIN,
      language === 'bn' ? "text-[13px]" : "text-[11px]"
    )}>
       {roleLabels[role] || role} Perspective
    </div>
  );
}
