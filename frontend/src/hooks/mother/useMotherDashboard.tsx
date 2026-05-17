import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { Sun, Droplets, Zap, Baby, Activity, Heart } from "lucide-react";

export function useMotherDashboard(language: string, prediction: any) {
  const { data: session } = useSession();
  
  const records = useLiveQuery(() => 
    db.healthRecords.where('mother_id').equals("MS-0842").toArray()
  );
  
  const latestRecord = records?.[records.length - 1];
  const currentWeek = latestRecord?.week || 16;
  const risk = prediction?.risk_level || latestRecord?.risk_level || "Low";

  // Force database reset for default seed user MS-0842 to the first week (16) on launch
  useEffect(() => {
    const forceReset = async () => {
      const dbRecords = await db.healthRecords.where('mother_id').equals("MS-0842").toArray();
      if (dbRecords.length > 0) {
        for (const record of dbRecords) {
          if (record.week !== 16) {
            await db.healthRecords.update(record.id!, { week: 16 });
          }
        }
      }
    };
    forceReset();
  }, []);

  const growthStages: any = {
    16: { name: language === 'bn' ? "আভাকাডো" : "Avocado", icon: <Droplets className="h-6 w-6" /> },
    20: { name: language === 'bn' ? "কলা" : "Banana", icon: <Sun className="h-6 w-6" /> },
    24: { name: language === 'bn' ? "ভুট্টা" : "Corn", icon: <Zap className="h-6 w-6" /> },
    28: { name: language === 'bn' ? "বেগুন" : "Eggplant", icon: <Baby className="h-6 w-6" /> },
    32: { name: language === 'bn' ? "কুমড়া" : "Squash", icon: <Activity className="h-6 w-6" /> },
    36: { name: language === 'bn' ? "পেঁপে" : "Papaya", icon: <Heart className="h-6 w-6" /> },
  };

  const currentGrowth = growthStages[currentWeek] || growthStages[16];
  
  const toBN = (num: number | string) => {
    if (language !== 'bn') return num;
    const digits: any = { '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯' };
    return num.toString().split('').map(d => digits[d] || d).join('');
  };

  const updateWeek = async (newWeek: number) => {
    if (latestRecord) {
      await db.healthRecords.update(latestRecord.id!, { week: newWeek });
    } else {
      await db.healthRecords.add({
        mother_id: "MS-0842",
        name: "Ayesha Begum",
        age: 24,
        week: newWeek,
        bp_sys: 120,
        bp_dia: 80,
        temp: 98.4,
        risk_level: "Low",
        risk_score: 15,
        explanation: "Initial baseline vitals.",
        advice_bn: "সবকিছু স্বাভাবিক আছে।",
        timestamp: Date.now(),
        synced: false,
        encrypted_data: ""
      });
    }
  };

  return {
    session,
    records,
    latestRecord,
    currentWeek,
    risk,
    currentGrowth,
    toBN,
    updateWeek
  };
}
