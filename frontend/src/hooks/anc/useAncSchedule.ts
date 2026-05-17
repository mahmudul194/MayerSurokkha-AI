import { useState, useEffect } from "react";
import { db } from "@/lib/db";

export function useAncSchedule(language: string, showToast: any) {
  const [schedule, setSchedule] = useState<any[]>([]);
  const [lmpDate, setLmpDate] = useState<string>("");
  const [edd, setEdd] = useState<string>("");
  const [currentGestationWeek, setCurrentGestationWeek] = useState<number | null>(null);

  useEffect(() => {
    // Load LMP from localStorage
    const savedLmp = localStorage.getItem("mayer_lmp");
    if (savedLmp) {
      setLmpDate(savedLmp);
      calculateGestation(savedLmp);
    }
    loadSchedule(savedLmp);
  }, []);

  const calculateGestation = (lmp: string) => {
    const lmpDateObj = new Date(lmp);
    if (isNaN(lmpDateObj.getTime())) return;

    // Calculate Expected Delivery Date (EDD): LMP + 280 days
    const eddDate = new Date(lmpDateObj.getTime() + 280 * 24 * 60 * 60 * 1000);
    setEdd(eddDate.toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }));

    // Calculate current gestational week
    const diffMs = Date.now() - lmpDateObj.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const currentWeek = Math.max(1, Math.min(42, Math.floor(diffDays / 7)));
    setCurrentGestationWeek(currentWeek);
  };

  const setLmp = (dateStr: string) => {
    if (!dateStr) return;
    localStorage.setItem("mayer_lmp", dateStr);
    setLmpDate(dateStr);
    calculateGestation(dateStr);
    loadSchedule(dateStr);
    showToast(
      language === 'bn' ? "শেষ মাসিকের তারিখ সফলভাবে সেট করা হয়েছে!" : "LMP successfully updated!",
      "success"
    );
  };

  const loadSchedule = async (lmp: string | null = null) => {
    const saved = await db.ancVisits.toArray();
    const currentLmp = lmp || localStorage.getItem("mayer_lmp");
    const lmpDateObj = currentLmp ? new Date(currentLmp) : null;

    const checklists: Record<number, { en: string[], bn: string[] }> = {
      12: {
        en: ["Hemoglobin test to prevent anemia", "Blood grouping & Rh factor", "Urine sugar & protein", "Daily baseline Folic acid intake"],
        bn: ["রক্তস্বল্পতা রোধে হিমোগ্লোবিন পরীক্ষা", "রক্তের গ্রুপ ও আরএইচ ফ্যাক্টর নির্ণয়", "ইউরিনে সুগার ও প্রোটিন পরীক্ষা", "নিয়মিত দৈনিক ফলিক অ্যাসিড গ্রহণ"]
      },
      20: {
        en: ["Ultrasound anomaly scan for organs", "Fetal heart rate monitoring", "Initiate daily Iron & Calcium supplements"],
        bn: ["অঙ্গ-প্রত্যঙ্গ গঠনে আল্ট্রাসাউন্ড অ্যানোমালি স্ক্যান", "গর্ভস্থ শিশুর হৃদস্পন্দন পরীক্ষা ও রেকর্ড", "নিয়মিত দৈনিক আয়রন ও ক্যালসিয়াম শুরু"]
      },
      28: {
        en: ["Gestational diabetes screening (OGTT)", "Tetanus toxoid 1st vaccine dose", "Consistent maternal blood pressure checking"],
        bn: ["গর্ভকালীন ডায়াবেটিস পরীক্ষা (OGTT)", "টিটি (ধনুষ্টংকার) ১ম ডোজের টিকা গ্রহণ", "নিয়মিত রক্তচাপ পরিমাপ ও পর্যবেক্ষণ"]
      },
      32: {
        en: ["Ultrasonic fetal growth assessment", "Amniotic fluid volume evaluation", "Monitor maternal swelling & edema weekly"],
        bn: ["গর্ভস্থ শিশুর বৃদ্ধির সঠিকতা পরিমাপ (গ্রোথ স্ক্যান)", "গর্ভস্থ পানির তরল পদার্থের পরিমাণ পরীক্ষা", "হাত-পা ফোলা বা পানি আসা পরীক্ষা করা"]
      },
      36: {
        en: ["Fetal presentation assessment (head check)", "Tetanus toxoid 2nd vaccine dose", "Secure 2 designated clinical blood donors"],
        bn: ["গর্ভের বাচ্চার সঠিক অবস্থান (মাথা নিচু) পরীক্ষা", "টিটি (ধনুষ্টংকার) ২য় ডোজের টিকা গ্রহণ", "প্রসবের জন্য ২ জন রক্তদাতা প্রস্তুত রাখা"]
      },
      40: {
        en: ["Fetal biophysical health profile", "Confirm institutional birth facility", "Keep delivery emergency kit fully ready"],
        bn: ["গর্ভস্থ শিশুর চূড়ান্ত স্বাস্থ্য পর্যবেক্ষণ", "প্রসবের নিরাপদ হাসপাতাল বা ক্লিনিক নির্ধারণ", "জরুরী প্রসব কিট এবং ব্যাগ গুছিয়ে রাখা"]
      }
    };

    const defaultSchedule = [
      { week: 12, label: language === 'bn' ? "প্রথম চেকআপ (৩ মাস)" : "1st Checkup", status: 'completed' },
      { week: 20, label: language === 'bn' ? "বাচ্চার গঠন পরীক্ষা (অ্যানোমালি স্ক্যান)" : "Anomaly Scan", status: 'completed' },
      { week: 28, label: language === 'bn' ? "তৃতীয় চেকআপ (৭ মাস)" : "3rd Checkup", status: 'active' },
      { week: 32, label: language === 'bn' ? "বাচ্চার বৃদ্ধি পরীক্ষা (গ্রোথ স্ক্যান)" : "Growth Scan", status: 'pending' },
      { week: 36, label: language === 'bn' ? "চতুর্থ চেকআপ (৯ মাস)" : "4th Checkup", status: 'pending' },
      { week: 40, label: language === 'bn' ? "প্রসবের প্রস্তুতি" : "Delivery Prep", status: 'pending' },
    ];

    const merged = defaultSchedule.map(item => {
      const found = saved.find(s => s.week === item.week);
      
      // Calculate milestone target date if LMP exists
      let targetDateStr = "";
      if (lmpDateObj && !isNaN(lmpDateObj.getTime())) {
        const targetDate = new Date(lmpDateObj.getTime() + (item.week * 7 * 24 * 60 * 60 * 1000));
        targetDateStr = targetDate.toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
      }

      return {
        ...item,
        status: found ? found.status : item.status,
        targetDate: targetDateStr,
        checklist: checklists[item.week] ? (language === 'bn' ? checklists[item.week].bn : checklists[item.week].en) : []
      };
    });

    setSchedule(merged);
  };

  const toggleStatus = async (week: number) => {
    const updated = schedule.map(item => {
      if (item.week === week) {
        const nextStatus = item.status === 'completed' ? 'pending' : 'completed';
        saveStatus(week, nextStatus);
        if (nextStatus === 'completed') {
          showToast(
            language === 'bn' ? `সপ্তাহ ${week} মাইলস্টোন সম্পন্ন হয়েছে!` : `Week ${week} Milestone Completed!`,
            "success"
          );
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

  return { 
    schedule, 
    toggleStatus, 
    lmpDate, 
    setLmp, 
    edd, 
    currentGestationWeek 
  };
}
