'use client';

import { useMotherDashboard } from "@/hooks/mother/useMotherDashboard";
import { useTextToSpeech } from "@/hooks/chat/useTextToSpeech";
import { HeroSection } from "./mother/HeroSection";
import { TimelineSection } from "./mother/TimelineSection";
import { HealthHistory } from "./mother/HealthHistory";
import { QuickActions } from "./mother/QuickActions";

export function MotherView({ prediction, onSOS, onLog, t, language, isAudioPlaying, setIsAudioPlaying, showToast }: any) {
  const { records, latestRecord, currentWeek, risk, currentGrowth, toBN, updateWeek } = useMotherDashboard(language, prediction);
  const { speak, speakingId } = useTextToSpeech(language, showToast || console.error);

  const isActuallyPlaying = speakingId === 999;

  return (
    <div className="flex flex-col gap-8">
      <HeroSection 
        currentWeek={currentWeek} 
        toBN={toBN} 
        language={language} 
        t={t} 
        risk={risk} 
        prediction={prediction} 
        latestRecord={latestRecord} 
        currentGrowth={currentGrowth} 
        isActuallyPlaying={isActuallyPlaying} 
        setIsAudioPlaying={setIsAudioPlaying} 
        speak={speak} 
      />
      
      <TimelineSection 
        currentWeek={currentWeek} 
        toBN={toBN} 
        language={language} 
        t={t} 
        onUpdateWeek={updateWeek}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <HealthHistory 
          currentWeek={currentWeek} 
          toBN={toBN} 
          language={language} 
          t={t} 
          latestRecord={latestRecord} 
          records={records} 
        />
        
        <QuickActions 
          language={language} 
          t={t} 
          onLog={onLog} 
          onSOS={onSOS} 
        />
      </div>
    </div>
  );
}
