import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Smartphone, 
  Maximize2,
  Sparkles,
  SlidersHorizontal,
  Compass
} from 'lucide-react';
import { StoryScene } from '../utils/storyboard';

interface DirectorControlsProps {
  currentScene: StoryScene;
  currentIndex: number;
  totalScenes: number;
  isPlaying: boolean;
  playbackSpeed: number;
  isMuted: boolean;
  interactiveMode: boolean;
  showPhoneFrame: boolean;
  onTogglePlay: () => void;
  onPrevScene: () => void;
  onNextScene: () => void;
  onRestart: () => void;
  onSetSpeed: (speed: number) => void;
  onToggleMute: () => void;
  onToggleInteractive: () => void;
  onTogglePhoneFrame: () => void;
  onSelectSceneStep: (stepNumber: number) => void;
}

export const DirectorControls: React.FC<DirectorControlsProps> = ({
  currentScene,
  currentIndex,
  totalScenes,
  isPlaying,
  playbackSpeed,
  isMuted,
  interactiveMode,
  showPhoneFrame,
  onTogglePlay,
  onPrevScene,
  onNextScene,
  onRestart,
  onSetSpeed,
  onToggleMute,
  onToggleInteractive,
  onTogglePhoneFrame,
  onSelectSceneStep,
}) => {
  const speeds = [0.75, 1, 1.5, 2];

  // 11 distinct milestone steps
  const steps = [
    { num: 1, labelEn: 'Domain', labelAr: 'النطاق', icon: '🌐' },
    { num: 2, labelEn: 'Lost Item', labelAr: 'فقدت شيئاً', icon: '🔍' },
    { num: 3, labelEn: 'Jewelry', labelAr: 'مجوهرات', icon: '💎' },
    { num: 4, labelEn: 'Necklace', labelAr: 'عقد ذهبي', icon: '✍️' },
    { num: 5, labelEn: 'Marrakech', labelAr: 'مراكش', icon: '📍' },
    { num: 6, labelEn: 'Souk', labelAr: 'السوق', icon: '📌' },
    { num: 7, labelEn: 'Date', labelAr: 'التاريخ', icon: '📅' },
    { num: 8, labelEn: 'Details', labelAr: 'الوصف', icon: '📝' },
    { num: 9, labelEn: 'Photo', labelAr: 'الصورة', icon: '📸' },
    { num: 10, labelEn: 'Publish', labelAr: 'نشر', icon: '🚀' },
    { num: 11, labelEn: 'Success', labelAr: 'تم النشر', icon: '🎉' },
  ];

  const progressPercent = ((currentIndex + 1) / totalScenes) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3 z-30 select-none">
      {/* Top Narration & Camera Subtitles Display */}
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-3.5 shadow-2xl transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          {/* Active Scene Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold px-2.5 py-1 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span>المشهد {currentScene.stepNumber} من {currentScene.totalSteps}</span>
              <span className="text-blue-300/70">· Scene {currentScene.stepNumber}/11</span>
            </span>

            {currentScene.zoom > 1 ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-md">
                <Sparkles className="w-3 h-3" />
                <span>تقريب سينمائي ({currentScene.zoom}x Zoom Centered)</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-md">
                <Maximize2 className="w-3 h-3 text-slate-400" />
                <span>منظور كامل (1.0x Full View)</span>
              </span>
            )}

            {interactiveMode && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                <SlidersHorizontal className="w-3 h-3" />
                <span>وضع التفاعل اليدوي مفعل</span>
              </span>
            )}
          </div>

          {/* Quick Step Indicator Pills */}
          <div className="flex items-center gap-1 overflow-x-auto py-1 max-w-full">
            {steps.map((st) => {
              const isCurrent = currentScene.stepNumber === st.num;
              const isPassed = currentScene.stepNumber > st.num;
              return (
                <button
                  key={st.num}
                  type="button"
                  onClick={() => onSelectSceneStep(st.num)}
                  className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg transition-all shrink-0 cursor-pointer ${
                    isCurrent
                      ? 'bg-blue-600 text-white ring-2 ring-blue-400/50 shadow-md shadow-blue-500/30 scale-105'
                      : isPassed
                      ? 'bg-slate-800/90 text-emerald-400 hover:bg-slate-700 border border-slate-700/60'
                      : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/60 border border-slate-800'
                  }`}
                  title={`${st.labelAr} · ${st.labelEn}`}
                >
                  <span>{st.icon}</span>
                  <span className="hidden sm:inline">{st.labelAr}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cinematic Narration Title & Subtitle in Arabic and English */}
        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-start justify-between gap-3 text-right">
          <div className="space-y-0.5 flex-1">
            <h2 className="text-sm sm:text-base font-extrabold text-white tracking-wide">
              {currentScene.titleAr} <span className="text-xs font-semibold text-slate-400">({currentScene.titleEn})</span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentScene.descAr}
            </p>
            <p className="text-[11px] text-slate-400 italic">
              {currentScene.descEn}
            </p>
          </div>

          <div className="text-left shrink-0 font-mono text-xs text-slate-400">
            {currentIndex + 1} / {totalScenes}
          </div>
        </div>

        {/* Smooth Scrubber Bar */}
        <div className="mt-3 relative w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 via-emerald-400 to-amber-400 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Director Transport Controls Bar */}
      <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-2.5 px-4 shadow-xl flex flex-wrap items-center justify-between gap-3">
        {/* Left: Playback Navigation buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Restart */}
          <button
            type="button"
            onClick={onRestart}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            title="إعادة بدء العرض (Restart)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Previous Scene */}
          <button
            type="button"
            onClick={onPrevScene}
            disabled={currentIndex === 0}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent rounded-xl transition-colors cursor-pointer"
            title="المشهد السابق (Previous)"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Master Play / Pause */}
          <button
            type="button"
            onClick={onTogglePlay}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs shadow-lg transition-all cursor-pointer ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/20'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/25 ring-2 ring-blue-400/40'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>إيقاف مؤقت (Pause)</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>تشغيل العرض السينمائي (Play)</span>
              </>
            )}
          </button>

          {/* Next Scene */}
          <button
            type="button"
            onClick={onNextScene}
            disabled={currentIndex === totalScenes - 1}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent rounded-xl transition-colors cursor-pointer"
            title="المشهد التالي (Next)"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Playback Speed Selector */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
          <span className="text-[10px] font-bold text-slate-400 px-1.5">السرعة:</span>
          {speeds.map((spd) => (
            <button
              key={spd}
              type="button"
              onClick={() => onSetSpeed(spd)}
              className={`text-[11px] font-bold px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                playbackSpeed === spd
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>

        {/* Right: Audio, Frame & Interactive toggles */}
        <div className="flex items-center gap-1.5">
          {/* Sound Mute Toggle */}
          <button
            type="button"
            onClick={onToggleMute}
            className={`p-2 rounded-xl transition-colors cursor-pointer border ${
              isMuted
                ? 'bg-slate-800/50 text-slate-500 border-slate-700'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
            }`}
            title={isMuted ? 'تشغيل المؤثرات الصوتية (Unmute Sound)' : 'كتم الصوت (Mute)'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Phone Frame Toggle */}
          <button
            type="button"
            onClick={onTogglePhoneFrame}
            className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
              showPhoneFrame
                ? 'bg-slate-800 text-blue-400 border-blue-500/40'
                : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title="تبديل هيكل الهاتف (Toggle iPhone chassis frame)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{showPhoneFrame ? 'إطار الهاتف' : 'شاشة كاملة'}</span>
          </button>

          {/* Interactive Manual Mode Toggle */}
          <button
            type="button"
            onClick={onToggleInteractive}
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
              interactiveMode
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-500/20'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="التحكم اليدوي / العرض التلقائي"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{interactiveMode ? 'تفاعل حر ✍️' : 'عرض سينمائي 🎬'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
