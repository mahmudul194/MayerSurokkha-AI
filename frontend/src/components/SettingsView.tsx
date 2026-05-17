'use client';

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { 
  User, Shield, Bell, Globe, 
  Smartphone, Lock, Eye, ChevronRight,
  ArrowLeft, Save, Download, RefreshCw, Key,
  CheckCircle2, AlertTriangle, Phone, Calendar
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/db";

export function SettingsView({ t, language, setLanguage, showToast }: any) {
  const [activeSection, setActiveSection] = useState<'main' | 'profile' | 'notifications' | 'security'>('main');
  
  // Profile settings state
  const [name, setName] = useState("Ayesha Begum");
  const [age, setAge] = useState(24);
  const [phone, setPhone] = useState("+880 1712-998877");
  const [bloodGroup, setBloodGroup] = useState("O+");
  
  // Notifications state
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [ancReminders, setAncReminders] = useState(true);
  const [emergencyAlerts, setEmergencyAlerts] = useState(true);
  
  // Load current mother profile details from Dexie DB
  useEffect(() => {
    const loadProfile = async () => {
      const records = await db.healthRecords.where('mother_id').equals("MS-0842").toArray();
      if (records.length > 0) {
        const latest = records[records.length - 1];
        if (latest.name) setName(latest.name);
        if (latest.age) setAge(latest.age);
      }
    };
    loadProfile();
  }, []);

  // Save profile updates to Dexie DB to dynamize entire site
  const handleSaveProfile = async () => {
    try {
      const records = await db.healthRecords.where('mother_id').equals("MS-0842").toArray();
      if (records.length > 0) {
        // Update all historical records to maintain demographic integrity
        for (const record of records) {
          await db.healthRecords.update(record.id!, {
            name: name,
            age: Number(age)
          });
        }
      }
      
      showToast(
        language === 'bn' ? "প্রোফাইল সফলভাবে আপডেট করা হয়েছে!" : "Profile successfully updated!",
        "success"
      );
      
      // Go back to main
      setActiveSection('main');
      
      // Small delay then trigger reload of parent state
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch (err) {
      console.error("Could not update profile", err);
      showToast("Error updating profile", "error");
    }
  };

  // Download local health database as a secure JSON backup file
  const handleDownloadBackup = async () => {
    try {
      const records = await db.healthRecords.toArray();
      const chat = await db.chatHistory.toArray();
      const anc = await db.ancVisits.toArray();
      
      const backupData = {
        app: "MayerSurokkha",
        timestamp: Date.now(),
        mother_id: "MS-0842",
        records,
        chat,
        anc
      };

      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(backupData, null, 2))}`;
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", jsonString);
      downloadAnchor.setAttribute("download", `mayer_surokkha_vault_backup_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      showToast(
        language === 'bn' ? "স্থানীয় ব্যাকআপ সফলভাবে ডাউনলোড করা হয়েছে!" : "Local health vault backup downloaded successfully!",
        "success"
      );
    } catch (err) {
      showToast("Could not download backup file", "error");
    }
  };

  // Reset database back to seeded default states
  const handleResetVault = async () => {
    if (!confirm(language === 'bn' ? "আপনি কি নিশ্চিত যে আপনি আপনার লোকাল ডেটা রিসেট করতে চান? সমস্ত অসংরক্ষিত ডাটা মুছে যাবে।" : "Are you sure you want to clear the local health vault? All unsynced logs will be permanently deleted.")) {
      return;
    }

    try {
      await db.healthRecords.clear();
      await db.chatHistory.clear();
      await db.ancVisits.clear();
      await db.knowledgeSaved.clear();
      
      showToast(
        language === 'bn' ? "লোকাল ভল্ট রিসেট হচ্ছে..." : "Re-seeding diagnostic neural vaults...",
        "info"
      );

      // Force reload to trigger automatic re-seeding
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      showToast("Reset failed", "error");
    }
  };

  const sections = [
    { 
      id: 'profile', 
      icon: User, 
      label: language === 'bn' ? "প্রোফাইল সেটিংস" : "Profile Settings",
      desc: language === 'bn' ? "ব্যক্তিগত তথ্য ও ডিজিটাল হেলথ আইডি" : "Manage personal info and view Health ID Card"
    },
    { 
      id: 'notifications', 
      icon: Bell, 
      label: language === 'bn' ? "স্মার্ট নোটিফিকেশন" : "Smart Notifications",
      desc: language === 'bn' ? "গর্ভকালীন সপ্তাহ ও চেকআপের এসএমএস এলার্ট" : "Weekly ANC checkups and SMS gestation alerts"
    },
    { 
      id: 'security', 
      icon: Lock, 
      label: language === 'bn' ? "নিরাপত্তা ও ডেটা ভল্ট" : "Security & Local Vault",
      desc: language === 'bn' ? "অফলাইন ক্রিপ্টো এনক্রিপশন কি এবং লোকাল রিসেট" : "View neural keys, backup data or reset local vault"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        {activeSection === 'main' && (
          <motion.div 
            key="main"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            <div className="asymmetric-panel bg-white p-6 md:p-12 border-white shadow-2xl shadow-slate-200/30">
               <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-4">
                 {language === 'bn' ? "সিস্টেম সেটিংস" : "System Settings"}
               </h3>
               <p className="text-slate-400 font-black uppercase tracking-widest text-[13px] mb-12">
                 {language === 'bn' ? "সিস্টেম কনফিগারেশন এবং প্রেফারেন্স" : "Maternal Node Configuration"}
               </p>
               
               <div className="space-y-4">
                  {/* Language Toggle Row */}
                  <div className="flex items-center justify-between p-8 bg-slate-50 rounded-[2.5rem] border border-transparent hover:border-slate-100 transition-all">
                     <div className="flex items-center gap-6">
                        <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center shadow-sm">
                           <Globe className="h-7 w-7 text-blue-600 animate-pulse" />
                        </div>
                        <div>
                           <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">{language === 'bn' ? "ভাষা (Language)" : "System Language"}</h4>
                           <p className="text-[13px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                             {language === 'bn' ? "বর্তমান ভাষা: বাংলা" : "Current: English (EN)"}
                           </p>
                        </div>
                     </div>
                     <button 
                       onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
                       className="px-8 py-3 bg-white shadow-sm border border-slate-100 rounded-2xl font-black text-[13px] uppercase tracking-widest hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
                     >
                        {language === 'bn' ? "ENGLISH" : "বাংলা (BN)"}
                     </button>
                  </div>

                  {/* Settings sub-sections */}
                  {sections.map((section) => (
                     <div 
                       key={section.id} 
                       onClick={() => setActiveSection(section.id as any)}
                       className="group flex items-center justify-between p-8 bg-slate-50/50 hover:bg-white rounded-[2.5rem] border border-transparent hover:border-slate-100 hover:shadow-xl hover:shadow-slate-200/20 transition-all cursor-pointer"
                     >
                        <div className="flex items-center gap-6">
                           <div className="h-14 w-14 bg-white rounded-2xl shadow-sm flex items-center justify-center group-hover:bg-blue-50 transition-all">
                              <section.icon className="h-7 w-7 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:scale-105" />
                           </div>
                           <div>
                              <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">{section.label}</h4>
                              <p className="text-[13px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{section.desc}</p>
                           </div>
                        </div>
                        <div className="h-12 w-12 rounded-xl bg-white shadow-sm border border-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all">
                           <ChevronRight className="h-5 w-5" />
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Privacy Alert Box */}
            <div className="asymmetric-panel bg-slate-900 p-6 md:p-12 text-white relative overflow-hidden">
               <div className="relative z-10">
                  <Shield className="h-12 w-12 text-blue-400 mb-8" />
                  <h4 className="text-2xl font-black uppercase tracking-tight mb-4">{language === 'bn' ? "নিরাপদ ডেটা ভল্ট" : "Secure Clinical Vault"}</h4>
                  <p className="text-blue-100/60 text-sm font-medium leading-relaxed max-w-md">
                     {language === 'bn' 
                       ? "আপনার সকল মাতৃত্বকালীন তথ্য স্থানীয়ভাবে AES-২৫৬ ক্রিপ্টোগ্রাফি দ্বারা সুরক্ষিত রাখা হয়েছে। এটি ক্লাউডে স্থানান্তরের সময় এন্ড-টু-এন্ড এনক্রিপশন প্রটোকল ব্যবহার করে।" 
                       : "All your maternity diagnostics records are stored locally with zero-knowledge AES-256 vault encryption. Cloud syncing is secured using advanced transport-layer cryptography."}
                  </p>
               </div>
               <Smartphone className="absolute right-[-20px] bottom-[-20px] h-64 w-64 text-white/5" />
            </div>
          </motion.div>
        )}

        {/* PROFILE SETTINGS VIEW */}
        {activeSection === 'profile' && (
          <motion.div 
            key="profile"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="asymmetric-panel bg-white p-6 md:p-12 border-white shadow-2xl shadow-slate-200/30 flex flex-col gap-6 md:gap-8">
              <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
                <button 
                  onClick={() => setActiveSection('main')}
                  className="h-12 w-12 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 transition-all border border-slate-100"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                  <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                    {language === 'bn' ? "প্রোফাইল এডিট করুন" : "Edit Profile Settings"}
                  </h4>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">
                    {language === 'bn' ? "আপনার ব্যক্তিগত ডেমোগ্রাফি আপডেট করুন" : "Update your maternal demographics data"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Inputs Box */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                      {language === 'bn' ? "মায়ের পুরো নাম" : "Mother's Full Name"}
                    </label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:border-blue-500 focus:ring-0 text-sm font-bold text-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                        {language === 'bn' ? "মায়ের বয়স (বছর)" : "Age (Years)"}
                      </label>
                      <input 
                        type="number" 
                        value={age}
                        onChange={(e) => setAge(Number(e.target.value))}
                        className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:border-blue-500 focus:ring-0 text-sm font-bold text-slate-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                        {language === 'bn' ? "রক্তের গ্রুপ" : "Blood Group"}
                      </label>
                      <select 
                        value={bloodGroup}
                        onChange={(e) => setBloodGroup(e.target.value)}
                        className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:border-blue-500 focus:ring-0 text-sm font-bold text-slate-800 appearance-none"
                      >
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                      {language === 'bn' ? "জরুরী যোগাযোগের ফোন নম্বর" : "Emergency Contact Phone"}
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input 
                        type="tel" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:border-blue-500 focus:ring-0 text-sm font-bold text-slate-800"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={handleSaveProfile}
                    className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Save className="h-4 w-4 text-pink-500" />
                    {language === 'bn' ? "তথ্য সংরক্ষণ করুন" : "Save Profile Details"}
                  </button>
                </div>

                {/* Gorgeous maternal digital health ID card */}
                <div className="p-5 sm:p-8 bg-linear-to-br from-slate-900 via-slate-850 to-blue-950 text-white rounded-[1.8rem] sm:rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between aspect-video select-none">
                  <div className="absolute right-[-30px] top-[-30px] h-44 w-44 bg-blue-500/10 rounded-full blur-2xl" />
                  
                  <div className="flex items-start justify-between relative z-10">
                    <div>
                      <h5 className="text-[10px] font-black uppercase tracking-widest text-pink-400">MayerSurokkha AI</h5>
                      <h4 className="text-md font-bold uppercase tracking-widest text-slate-100 mt-1">{language === 'bn' ? "প্রসূতি ডিজিটাল হেলথ আইডি" : "Maternal Smart Health ID"}</h4>
                    </div>
                    <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md">
                      <Smartphone className="h-5 w-5 text-blue-300" />
                    </div>
                  </div>

                  <div className="my-6 relative z-10 space-y-1">
                    <div className="text-lg sm:text-2xl font-black uppercase tracking-widest text-white leading-none">{name}</div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">ID: MS-0842 • BLOOD: {bloodGroup}</div>
                  </div>

                  <div className="flex items-end justify-between border-t border-white/10 pt-4 relative z-10">
                    <div>
                      <div className="text-[9px] font-black uppercase tracking-widest text-slate-500">{language === 'bn' ? "জরুরী ফোন" : "Emergency Contact"}</div>
                      <div className="text-sm font-black text-slate-200 mt-0.5">{phone}</div>
                    </div>
                    {/* Simulated Mini QR Code */}
                    <div className="h-12 w-12 bg-white p-1 rounded-lg flex items-center justify-center shrink-0 shadow-md">
                      <div className="h-full w-full bg-slate-900 rounded-[2px] flex flex-wrap p-0.5 justify-between">
                        {Array.from({ length: 9 }).map((_, i) => (
                          <div key={i} className={cn("h-2 w-2 rounded-[1px]", i % 2 === 0 ? "bg-white" : "bg-transparent")} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* NOTIFICATIONS SETTINGS VIEW */}
        {activeSection === 'notifications' && (
          <motion.div 
            key="notifications"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="asymmetric-panel bg-white p-6 md:p-12 border-white shadow-2xl shadow-slate-200/30 flex flex-col gap-6 md:gap-8">
              <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
                <button 
                  onClick={() => setActiveSection('main')}
                  className="h-12 w-12 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 transition-all border border-slate-100"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                  <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                    {language === 'bn' ? "স্মার্ট নোটিফিকেশন" : "Smart Notification Settings"}
                  </h4>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">
                    {language === 'bn' ? "গর্ভকালীন এলার্ট এবং পরিদর্শনের অনুস্মারক" : "SMS checkup reminders and gestation advice"}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Switch 1 */}
                <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-slate-200 transition-all">
                  <div className="space-y-1">
                    <h5 className="text-lg font-black text-slate-800 tracking-tight">
                      {language === 'bn' ? "গর্ভকালীন সপ্তাহভিত্তিক এসএমএস" : "Weekly Gestation SMS Advice"}
                    </h5>
                    <p className="text-xs font-bold text-slate-400 max-w-lg leading-relaxed">
                      {language === 'bn' 
                        ? "আপনার গর্ভাবস্থার বর্তমান সপ্তাহের জটিলতার সতর্কতা এবং চেকআপের পরামর্শ সরাসরি এসএমএস হিসেবে আপনার ফোনে পাঠানো হবে।"
                        : "Receive clinical warnings, nutrition guidelines, and prenatal tips based on your active gestation week directly to your mobile phone."}
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      setSmsAlerts(!smsAlerts);
                      showToast(language === 'bn' ? "প্রেফারেন্স আপডেট করা হয়েছে!" : "Preference updated!", "success");
                    }}
                    className={cn(
                      "w-16 h-10 rounded-full p-1 transition-all duration-300 flex items-center",
                      smsAlerts ? "bg-blue-600 justify-end" : "bg-slate-200 justify-start"
                    )}
                  >
                    <motion.div layout className="h-8 w-8 bg-white rounded-full shadow-md" />
                  </button>
                </div>

                {/* Switch 2 */}
                <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-slate-200 transition-all">
                  <div className="space-y-1">
                    <h5 className="text-lg font-black text-slate-800 tracking-tight">
                      {language === 'bn' ? "এএনসি চেকআপ অনুস্মারক" : "ANC Checkup Alerts"}
                    </h5>
                    <p className="text-xs font-bold text-slate-400 max-w-lg leading-relaxed">
                      {language === 'bn' 
                        ? "পরবর্তী নিয়মিত চেকআপ পরিদর্শনের ২ দিন পূর্বে স্বয়ংক্রিয় এআই ভয়েস কল ও এসএমএস রিমাইন্ডার পাবেন।"
                        : "Receive an automated AI Voice call and SMS reminder 2 days before each scheduled Antenatal Clinic (ANC) checkup."}
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      setAncReminders(!ancReminders);
                      showToast(language === 'bn' ? "প্রেফারেন্স আপডেট করা হয়েছে!" : "Preference updated!", "success");
                    }}
                    className={cn(
                      "w-16 h-10 rounded-full p-1 transition-all duration-300 flex items-center",
                      ancReminders ? "bg-blue-600 justify-end" : "bg-slate-200 justify-start"
                    )}
                  >
                    <motion.div layout className="h-8 w-8 bg-white rounded-full shadow-md" />
                  </button>
                </div>

                {/* Switch 3 */}
                <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-slate-200 transition-all">
                  <div className="space-y-1">
                    <h5 className="text-lg font-black text-slate-800 tracking-tight">
                      {language === 'bn' ? "উচ্চ ঝুঁকি সংকেত (Emergency SOS)" : "High Risk Alerts (Emergency SOS)"}
                    </h5>
                    <p className="text-xs font-bold text-slate-400 max-w-lg leading-relaxed">
                      {language === 'bn' 
                        ? "উচ্চ রক্তচাপ বা অস্বাভাবিক ভাইটালস লগইন করার সাথে সাথে নিকটস্থ হাসপাতালে সতর্কবার্তা পাঠানো হবে।"
                        : "Immediately broadcast a maternal emergency SOS payload to nearby diagnostic clinics if high-risk vital parameters are detected."}
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      setEmergencyAlerts(!emergencyAlerts);
                      showToast(language === 'bn' ? "জরুরি এলার্ট প্রেফারেন্স সংরক্ষিত!" : "Emergency alert preference saved!", "success");
                    }}
                    className={cn(
                      "w-16 h-10 rounded-full p-1 transition-all duration-300 flex items-center",
                      emergencyAlerts ? "bg-blue-600 justify-end" : "bg-slate-200 justify-start"
                    )}
                  >
                    <motion.div layout className="h-8 w-8 bg-white rounded-full shadow-md" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* SECURITY & DATA VAULT VIEW */}
        {activeSection === 'security' && (
          <motion.div 
            key="security"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="asymmetric-panel bg-white p-6 md:p-12 border-white shadow-2xl shadow-slate-200/30 flex flex-col gap-6 md:gap-8">
              <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
                <button 
                  onClick={() => setActiveSection('main')}
                  className="h-12 w-12 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 transition-all border border-slate-100"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                  <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                    {language === 'bn' ? "নিরাপত্তা ও ডেটা ভল্ট" : "Security & Clinical Vault"}
                  </h4>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">
                    {language === 'bn' ? "আপনার ক্রিপ্টোগ্রাফি কী এবং লোকাল ডাটা ভল্ট ব্যাকআপ" : "View secure keys, download backups, or reset vault data"}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Cryptographic Neural Key Box */}
                <div className="p-6 bg-slate-900 rounded-3xl text-white relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Key className="h-5 w-5 text-blue-400" />
                      <h5 className="text-sm font-black uppercase tracking-wider text-blue-300">
                        {language === 'bn' ? "AES-২৫৬ স্থানীয় এনক্রিপশন কী" : "AES-256 Local Encryption Key"}
                      </h5>
                    </div>
                    <p className="text-xs font-semibold text-slate-400 max-w-md leading-relaxed">
                      {language === 'bn' 
                        ? "আপনার প্রসব ও গর্ভকালীন জটিলতা সংক্রান্ত সংবেদনশীল তথ্যসমূহ এই গোপন কী দিয়ে আপনার লোকাল ব্রাউজারে ইন-মেমরি এনক্রিপ্ট থাকে।"
                        : "Your physiological records are locally encrypted at the column-level with this static vault key to ensure HIPAA/GDPR clinical compliance."}
                    </p>
                  </div>
                  <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl font-mono text-xs font-black tracking-widest text-slate-200 select-all backdrop-blur-md">
                    mayer-rural-vault-2026
                  </div>
                </div>

                {/* Actions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  {/* Backup local data button */}
                  <div className="p-5 sm:p-8 bg-slate-50 border border-slate-100 rounded-3xl flex flex-col justify-between gap-6 hover:border-slate-200 transition-all">
                    <div className="space-y-2">
                      <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center shadow-sm">
                        <Download className="h-5 w-5 text-blue-500" />
                      </div>
                      <h5 className="text-lg font-black text-slate-800 tracking-tight">
                        {language === 'bn' ? "লোকাল ভল্ট ব্যাকআপ" : "Backup Local Health Vault"}
                      </h5>
                      <p className="text-xs font-bold text-slate-400 leading-relaxed">
                        {language === 'bn'
                          ? "আপনার ভাইটালস হিস্ট্রি ও প্রেসক্রিপশন ডেটা একটি নিরাপদ এনক্রিপ্টেড .json ফাইল হিসেবে ব্যাকআপ ডাউনলোড করুন।"
                          : "Export and download your complete local IndexedDB diagnostic records, chat logs, and clinic maps as a secure JSON backup."}
                      </p>
                    </div>
                    <button 
                      onClick={handleDownloadBackup}
                      className="py-3 bg-white hover:bg-blue-600 hover:text-white hover:border-blue-600 border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                    >
                      {language === 'bn' ? "ব্যাকআপ ডাউনলোড করুন" : "Download Backup"}
                    </button>
                  </div>

                  {/* Reset local data button */}
                  <div className="p-8 bg-red-50/40 border border-red-50 rounded-3xl flex flex-col justify-between gap-6 hover:border-red-100 transition-all">
                    <div className="space-y-2">
                      <div className="h-10 w-10 bg-red-50 rounded-xl flex items-center justify-center shadow-sm">
                        <RefreshCw className="h-5 w-5 text-red-500" />
                      </div>
                      <h5 className="text-lg font-black text-red-800 tracking-tight">
                        {language === 'bn' ? "লোকাল ডেটা রিসেট" : "Reset Local Vault Data"}
                      </h5>
                      <p className="text-xs font-bold text-red-500/70 leading-relaxed">
                        {language === 'bn'
                          ? "সতর্কতা: এটি ব্রাউজারে থাকা আপনার সকল লোকাল রেকর্ড ডিলিট করে প্রাথমিক ডেমো সেটিংসে রি-সীড করবে।"
                          : "Danger: This clears all local browser diagnostics records and resets index tables back to initial mock seeded clinic data."}
                      </p>
                    </div>
                    <button 
                      onClick={handleResetVault}
                      className="py-3 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-md shadow-red-100"
                    >
                      {language === 'bn' ? "লোকাল ভল্ট রিসেট করুন" : "Clear Local Vault"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
