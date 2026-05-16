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
  const currentWeek = latestRecord?.week || 28;
  const risk = prediction?.risk_level || latestRecord?.risk_level || "Low";

  const growthStages: any = {
    16: { name: language === 'bn' ? "আভাকাডো" : "Avocado", icon: <Droplets className="h-6 w-6" /> },
    20: { name: language === 'bn' ? "কলা" : "Banana", icon: <Sun className="h-6 w-6" /> },
    24: { name: language === 'bn' ? "ভুট্টা" : "Corn", icon: <Zap className="h-6 w-6" /> },
    28: { name: language === 'bn' ? "বেগুন" : "Eggplant", icon: <Baby className="h-6 w-6" /> },
    32: { name: language === 'bn' ? "কুমড়া" : "Squash", icon: <Activity className="h-6 w-6" /> },
    36: { name: language === 'bn' ? "পেঁপে" : "Papaya", icon: <Heart className="h-6 w-6" /> },
  };

  const currentGrowth = growthStages[currentWeek] || growthStages[28];
  
  const toBN = (num: number | string) => {
    if (language !== 'bn') return num;
    const digits: any = { '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯' };
    return num.toString().split('').map(d => digits[d] || d).join('');
  };

  return {
    session,
    records,
    latestRecord,
    currentWeek,
    risk,
    currentGrowth,
    toBN
  };
}
