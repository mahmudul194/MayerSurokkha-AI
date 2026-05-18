'use client';

import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { 
  Heart, LayoutDashboard, MessageCircle, BookOpen, 
  MapPin, Settings, LogOut, ChevronLeft, Globe, 
  Search, Shield, Activity, Calendar, Mic
} from "lucide-react";
import { RoleBadge } from "./RoleBadge";

export function Sidebar({ 
  collapsed, setCollapsed, activeTab, setActiveTab, 
  language, setLanguage, role, t
}: any) {
  const getMenuItems = (currentRole: string) => {
    const motherItems = [
      { id: 'dashboard', icon: LayoutDashboard, label: t.dashboard || "Dashboard" },
      { id: 'chat', icon: MessageCircle, label: t.ai_assistant || "AI Assistant" },
      { id: 'voice', icon: Mic, label: language === 'bn' ? "ভয়েস অ্যাসিস্ট্যান্ট" : "Voice Assistant" },
      { id: 'knowledge', icon: BookOpen, label: t.knowledge_base || "Knowledge Base" },
      { id: 'anc', icon: Calendar, label: t.anc_schedule || "ANC Schedule" },
      { id: 'nearby', icon: MapPin, label: t.nearby_centers || "Nearby Centers" },
      { id: 'settings', icon: Settings, label: t.settings || "Settings" },
    ];

    const doctorItems = [
      { id: 'dashboard', icon: LayoutDashboard, label: language === 'bn' ? "রোগী ডিরেক্টরি" : "Patient Directory" },
      { id: 'chat', icon: MessageCircle, label: language === 'bn' ? "মেডিকেল এআই" : "Medical AI" },
      { id: 'nearby', icon: MapPin, label: language === 'bn' ? "রেফারেল নেটওয়ার্ক" : "Referral Network" },
      { id: 'settings', icon: Settings, label: t.settings || "Settings" },
    ];

    const workerItems = [
      { id: 'dashboard', icon: LayoutDashboard, label: language === 'bn' ? "ফিল্ড নোড" : "Field Node" },
      { id: 'nearby', icon: MapPin, label: language === 'bn' ? "স্বাস্থ্যকেন্দ্র ডিরেক্টরি" : "Center Directory" },
      { id: 'settings', icon: Settings, label: t.settings || "Settings" },
    ];

    const adminItems = [
      { id: 'dashboard', icon: LayoutDashboard, label: language === 'bn' ? "কমান্ড সেন্টার" : "Command Center" },
      { id: 'settings', icon: Settings, label: t.settings || "Settings" },
    ];

    switch (currentRole) {
      case 'DOCTOR': return doctorItems;
      case 'WORKER': return workerItems;
      case 'ADMIN': return adminItems;
      default: return motherItems; // MOTHER
    }
  };

  const menuItems = getMenuItems(role);

  return (
    <div className={cn(
      "fixed top-0 h-screen bg-white border-r border-slate-100 transition-all duration-500 z-50 flex flex-col shadow-2xl lg:shadow-none",
      collapsed ? "w-[320px] left-[-320px] lg:left-0 lg:w-24" : "w-[320px] left-0"
    )}>
      <div className="p-8 flex items-center justify-between border-b border-slate-50">
        {!collapsed && (
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                <Heart className="h-6 w-6 text-white fill-white" />
             </div>
             <span className="text-xl font-black tracking-tighter text-slate-900 italic uppercase">Mayer Surokkha</span>
          </div>
        )}
        {collapsed && (
           <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 mx-auto">
              <Heart className="h-6 w-6 text-white fill-white" />
           </div>
        )}
      </div>

      <div className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
        {!collapsed && (
          <div className="px-4 mb-8">
            <RoleBadge role={role} t={t} language={language} />
          </div>
        )}
        {menuItems.map((item: any) => (
          <button
            key={item.id}
            onClick={() => {
              if (item.action) {
                item.action();
              } else {
                setActiveTab(item.id);
              }
            }}
            className={cn(
              "w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-black uppercase tracking-widest",
              activeTab === item.id 
                ? "bg-blue-600 text-white shadow-xl shadow-blue-100" 
                : "text-slate-400 hover:bg-slate-50 hover:text-slate-600",
              collapsed && "justify-center px-0"
            )}
          >
            <item.icon className="h-5 w-5" />
            {!collapsed && <span className={language === 'bn' ? "text-[15px]" : "text-[13px]"}>{item.label}</span>}
          </button>
        ))}
      </div>

      <div className="p-6 border-t border-slate-50 space-y-4">
        <button 
           onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
           className={cn("w-full flex items-center gap-4 px-6 py-4 rounded-2xl bg-slate-50 text-slate-600 font-black uppercase tracking-widest transition-all hover:bg-slate-100",
             collapsed && "justify-center px-0"
           )}
        >
           <Globe className="h-5 w-5" />
           {!collapsed && <span className="text-[13px]">{language === 'bn' ? "ENGLISH" : "বাংলা (BN)"}</span>}
        </button>
        <button 
           onClick={() => signOut({ callbackUrl: '/login' })}
           className={cn("w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-400 font-black uppercase tracking-widest transition-all hover:bg-red-50",
             collapsed && "justify-center px-0"
           )}
        >
           <LogOut className="h-5 w-5" />
           {!collapsed && <span className="text-[13px]">{t.logout}</span>}
        </button>
      </div>

      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-4 top-10 h-8 w-8 bg-white border border-slate-100 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all z-[60]"
      >
        <ChevronLeft className={cn("h-4 w-4 text-slate-400 transition-transform duration-500", collapsed && "rotate-180")} />
      </button>
    </div>
  );
}
