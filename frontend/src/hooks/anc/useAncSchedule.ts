import { useState, useEffect } from "react";
import { db } from "@/lib/db";

export function useAncSchedule(language: string, showToast: any) {
  const [schedule, setSchedule] = useState<any[]>([]);

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    const saved = await db.ancVisits.toArray();
    const defaultSchedule = [
      { week: 12, label: language === 'bn' ? "প্রথম চেকআপ (৩ মাস)" : "1st Checkup", status: 'completed' },
      { week: 20, label: language === 'bn' ? "বাচ্চার গঠন পরীক্ষা (অ্যানোমালি স্ক্যান)" : "Anomaly Scan", status: 'completed' },
      { week: 28, label: language === 'bn' ? "তৃতীয় চেকআপ (৭ মাস)" : "3rd Checkup", status: 'active' },
      { week: 32, label: language === 'bn' ? "বাচ্চার বৃদ্ধি পরীক্ষা (গ্রোথ স্ক্যান)" : "Growth Scan", status: 'pending' },
      { week: 36, label: language === 'bn' ? "চতুর্থ চেকআপ (৯ মাস)" : "4th Checkup", status: 'pending' },
      { week: 40, label: language === 'bn' ? "প্রসবের প্রস্তুতি" : "Delivery Prep", status: 'pending' },
    ];

    if (saved.length > 0) {
      const merged = defaultSchedule.map(item => {
        const found = saved.find(s => s.week === item.week);
        return found ? { ...item, status: found.status } : item;
      });
      setSchedule(merged);
    } else {
      setSchedule(defaultSchedule);
    }
  };

  const toggleStatus = async (week: number) => {
    const updated = schedule.map(item => {
      if (item.week === week) {
        const nextStatus = item.status === 'completed' ? 'pending' : 'completed';
        saveStatus(week, nextStatus);
        if (nextStatus === 'completed') {
          showToast(language === 'bn' ? `সপ্তাহ ${week} মাইলস্টোন সম্পন্ন হয়েছে!` : `Week ${week} Milestone Completed!`, "success");
        }
        return { ...item, status: nextStatus };
      }
      return item;
    });
    setSchedule(updated);
  };

  const saveStatus = async (week: number, status: string) => {
    const existing = await db.ancVisits.where('week').equals(week).first();
    if (existing) {
      await db.ancVisits.update(existing.id!, { status: status as any, synced: false });
    } else {
      await db.ancVisits.add({ week, status: status as any, synced: false });
    }
  };

  return { schedule, toggleStatus };
}
