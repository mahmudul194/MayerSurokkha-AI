import Dexie, { type Table } from 'dexie';
import CryptoJS from 'crypto-js';

export interface HealthRecord {
  id?: number;
  mother_id: string;
  name: string;
  age: number;
  week: number;
  bp_sys: number;
  bp_dia: number;
  risk_level: 'Low' | 'Medium' | 'High';
  risk_score: number;
  explanation: string;
  advice_bn?: string;
  timestamp: number;
  synced: boolean;
  encrypted_data: string;
}

export class MayerDB extends Dexie {
  chatHistory!: Table<{ id?: number, role: 'user' | 'bot', content: string, timestamp: number, synced: boolean }>;
  ancVisits!: Table<{ id?: number, week: number, status: 'completed' | 'active' | 'pending', date?: string, synced: boolean }>;
  knowledgeSaved!: Table<{ id?: number, title: string, category: string, timestamp: number, synced: boolean }>;

  constructor() {
    super('MayerSurokkhaDB');
    this.version(1).stores({
      healthRecords: '++id, mother_id, risk_level, synced, timestamp',
      chatHistory: '++id, role, timestamp, synced',
      ancVisits: '++id, week, status, synced',
      knowledgeSaved: '++id, title, category, synced'
    });
  }

  // Secure local encryption for sensitive health data
  private readonly VAULT_KEY = "mayer-rural-vault-2026"; 

  encrypt(data: Record<string, unknown>): string {
    return CryptoJS.AES.encrypt(JSON.stringify(data), this.VAULT_KEY).toString();
  }

  decrypt(cipherText: string): Record<string, unknown> {
    const bytes = CryptoJS.AES.decrypt(cipherText, this.VAULT_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }
}

export const db = new MayerDB();

export async function seedDatabase() {
  const count = await db.healthRecords.count();
  if (count > 0) return;

  const mockData: HealthRecord[] = [
    {
      mother_id: "MS-0842",
      name: "Ayesha Begum",
      age: 24,
      week: 32,
      bp_sys: 165,
      bp_dia: 100,
      risk_level: "High",
      risk_score: 85,
      explanation: "Critical: Severe hypertension detected (165/100). High risk of preeclampsia. Immediate medical intervention required.",
      advice_bn: "আপনার রক্তচাপ খুব বেশি। অনুগ্রহ করে দ্রুত নিকটের হাসপাতালে যান।",
      timestamp: Date.now() - 3600000,
      synced: false,
      encrypted_data: "..."
    },
    {
      mother_id: "MS-0911",
      name: "Fatima Khatun",
      age: 28,
      week: 24,
      bp_sys: 135,
      bp_dia: 85,
      risk_level: "Medium",
      risk_score: 55,
      explanation: "Warning: Blood pressure is slightly elevated. Monitor daily. Ensure adequate hydration and rest.",
      advice_bn: "আপনার রক্তচাপ সামান্য বেশি। প্রতিদিন মাপুন এবং পর্যাপ্ত বিশ্রাম নিন।",
      timestamp: Date.now() - 86400000,
      synced: true,
      encrypted_data: "..."
    },
    {
      mother_id: "MS-1024",
      name: "Nasrin Akter",
      age: 22,
      week: 16,
      bp_sys: 115,
      bp_dia: 75,
      risk_level: "Low",
      risk_score: 15,
      explanation: "Normal: Vitals are within normal ranges. Continue regular prenatal vitamins and diet.",
      advice_bn: "সবকিছু স্বাভাবিক আছে। নিয়মিত চেকআপ চালিয়ে যান।",
      timestamp: Date.now() - 172800000,
      synced: true,
      encrypted_data: "..."
    }
  ];

  await db.healthRecords.bulkAdd(mockData);
}
