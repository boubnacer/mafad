/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Sparkles, 
  RotateCcw, 
  Play, 
  Pause, 
  ExternalLink,
  Smartphone,
  Volume2,
  VolumeX,
  Compass,
  SkipBack,
  SkipForward,
  Layers,
  Maximize2
} from 'lucide-react';
import { STORYBOARD_SCENES, StoryScene } from './utils/storyboard';
import { soundEffects } from './utils/audioSynth';
import { PhoneSimulation } from './components/PhoneSimulation';
import { DirectorControls } from './components/DirectorControls';

export default function App() {
  // Cinematic Timeline State
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [interactiveMode, setInteractiveMode] = useState(false);
  const [showPhoneFrame, setShowPhoneFrame] = useState(true);
  const [viewMode, setViewMode] = useState<'reel' | 'studio'>('reel');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentScene: StoryScene = STORYBOARD_SCENES[currentSceneIndex] || STORYBOARD_SCENES[0];
  const totalScenes = STORYBOARD_SCENES.length;

  // Clear running timer
  const clearCurrentTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Jump to specific scene index
  const goToSceneIndex = useCallback((index: number) => {
    clearCurrentTimer();
    const safeIndex = Math.max(0, Math.min(totalScenes - 1, index));
    setCurrentSceneIndex(safeIndex);
  }, [clearCurrentTimer, totalScenes]);

  // Jump to specific step number (1 to 11)
  const handleSelectSceneStep = useCallback((stepNumber: number) => {
    const targetIdx = STORYBOARD_SCENES.findIndex((s) => s.stepNumber === stepNumber);
    if (targetIdx !== -1) {
      goToSceneIndex(targetIdx);
      soundEffects.playTap();
    }
  }, [goToSceneIndex]);

  // Next / Previous Scene
  const handleNextScene = useCallback(() => {
    if (currentSceneIndex < totalScenes - 1) {
      goToSceneIndex(currentSceneIndex + 1);
      soundEffects.playTap();
    }
  }, [currentSceneIndex, totalScenes, goToSceneIndex]);

  const handlePrevScene = useCallback(() => {
    if (currentSceneIndex > 0) {
      goToSceneIndex(currentSceneIndex - 1);
      soundEffects.playTap();
    }
  }, [currentSceneIndex, goToSceneIndex]);

  // Restart Walkthrough
  const handleRestart = useCallback(() => {
    goToSceneIndex(0);
    setIsPlaying(true);
    soundEffects.playTap();
  }, [goToSceneIndex]);

  // Play / Pause Toggle
  const handleTogglePlay = useCallback(() => {
    setIsPlaying((prev) => {
      const next = !prev;
      if (next && currentSceneIndex === totalScenes - 1) {
        goToSceneIndex(0);
      }
      return next;
    });
    soundEffects.playTap();
  }, [currentSceneIndex, totalScenes, goToSceneIndex]);

  // Audio Mute Toggle
  const handleToggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      soundEffects.setMuted(next);
      return next;
    });
  }, []);

  // Speed Selector
  const handleSetSpeed = useCallback((speed: number) => {
    setPlaybackSpeed(speed);
    soundEffects.playTap();
  }, []);

  // Auto-play timeline loop
  useEffect(() => {
    if (!isPlaying || interactiveMode) {
      clearCurrentTimer();
      return;
    }

    const sceneDuration = currentScene.durationMs / playbackSpeed;

    timerRef.current = setTimeout(() => {
      if (currentSceneIndex < totalScenes - 1) {
        setCurrentSceneIndex((prev) => prev + 1);
      } else {
        // Walkthrough complete
        setIsPlaying(false);
      }
    }, sceneDuration);

    return () => clearCurrentTimer();
  }, [currentSceneIndex, isPlaying, playbackSpeed, interactiveMode, totalScenes, currentScene.durationMs, clearCurrentTimer]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNextScene();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrevScene();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleRestart();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        handleToggleMute();
      } else if (e.key === 'v' || e.key === 'V') {
        e.preventDefault();
        setViewMode((prev) => (prev === 'reel' ? 'studio' : 'reel'));
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        setShowPhoneFrame((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleTogglePlay, handleNextScene, handlePrevScene, handleRestart, handleToggleMute]);

  return (
    <div
      dir="rtl"
      className="h-screen h-[100dvh] w-full bg-[#070A12] text-slate-100 flex flex-col justify-between p-2 sm:p-3 select-none relative overflow-hidden"
      style={{ fontFamily: "'Cairo', 'Plus Jakarta Sans', system-ui, sans-serif" }}
    >
      {/* Background Cinematic Gradients & Tech Grid */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-10 left-1/3 w-[600px] h-[500px] bg-amber-600/10 rounded-full blur-[150px]" />
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      {/* TOP HEADER BAR */}
      <header className="w-full max-w-7xl mx-auto flex items-center justify-between gap-2 z-30 shrink-0 pb-1 border-b border-slate-800/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-base shadow-md shadow-blue-500/25">
            🔍
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-white text-sm sm:text-base tracking-tight">مفقودات المغرب</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/30 hidden xs:inline-block">
                💎 عرض المجوهرات ومراكش
              </span>
            </div>
          </div>
        </div>

        {/* View Mode Toggle & Scene Shortcuts */}
        <div className="flex items-center gap-2">
          {/* Quick Jump Buttons */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => handleSelectSceneStep(1)}
              className="text-[10px] font-bold text-slate-300 hover:text-white px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              🌐 النطاق
            </button>
            <button
              type="button"
              onClick={() => handleSelectSceneStep(2)}
              className="text-[10px] font-bold text-slate-300 hover:text-white px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              🔍 الزران
            </button>
            <button
              type="button"
              onClick={() => handleSelectSceneStep(3)}
              className="text-[10px] font-bold text-amber-300 hover:text-amber-200 px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              💎 مجوهرات
            </button>
            <button
              type="button"
              onClick={() => handleSelectSceneStep(5)}
              className="text-[10px] font-bold text-blue-300 hover:text-blue-200 px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              📍 مراكش
            </button>
            <button
              type="button"
              onClick={() => handleSelectSceneStep(11)}
              className="text-[10px] font-bold text-emerald-300 hover:text-emerald-200 px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              🎉 تم النشر
            </button>
          </div>

          {/* View Mode Switcher: Reel Mode vs Studio Mode */}
          <div className="flex items-center bg-slate-900/90 p-0.5 rounded-xl border border-slate-700/80 shadow-inner">
            <button
              type="button"
              onClick={() => setViewMode('reel')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'reel'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="نمط الريلز والشورتس التفاعلي (Reel/Shorts View)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>عرض ريلز 📱</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('studio')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'studio'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="لوحة المخرج التفاعلية (Studio View)"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>الاستوديو 🎬</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN VIEWPORT STAGE */}
      {viewMode === 'reel' ? (
        /* =========================================================================
           REEL / SHORTS VIEW:
           Mobile phone fits 100% in clear view with auto-scaling, social media
           floating action rail, and docked story caption scrubber.
           ========================================================================= */
        <main className="flex-1 min-h-0 w-full max-w-7xl mx-auto relative flex items-center justify-center overflow-hidden my-1">
          {/* Centered Phone Simulation with dynamic scaling */}
          <div className="w-full h-full flex items-center justify-center min-h-0 min-w-0">
            <PhoneSimulation
              currentScene={currentScene}
              interactiveMode={interactiveMode}
              showPhoneFrame={showPhoneFrame}
            />
          </div>

          {/* Social Media Floating Action Rail (Instagram Reels / TikTok / YouTube Shorts style) */}
          <div className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-2 bg-slate-900/85 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700/80 shadow-2xl">
            {/* Play / Pause Toggle */}
            <button
              type="button"
              onClick={handleTogglePlay}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                isPlaying
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                  : 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
              }`}
              title={isPlaying ? 'إيقاف مؤقت (Space)' : 'تشغيل العرض السينمائي (Space)'}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            </button>

            {/* Vertical Next / Prev Scenes (Swipe simulation) */}
            <div className="flex flex-col items-center gap-0.5 py-1">
              <button
                type="button"
                onClick={handlePrevScene}
                disabled={currentSceneIndex === 0}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 flex items-center justify-center transition-colors cursor-pointer"
                title="المشهد السابق (ArrowLeft)"
              >
                <SkipBack className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono font-bold text-slate-400 py-0.5">
                {currentScene.stepNumber}/11
              </span>
              <button
                type="button"
                onClick={handleNextScene}
                disabled={currentSceneIndex === totalScenes - 1}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 flex items-center justify-center transition-colors cursor-pointer"
                title="المشهد التالي (ArrowRight)"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="w-5 h-px bg-slate-800" />

            {/* Sound Mute Toggle */}
            <button
              type="button"
              onClick={handleToggleMute}
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                isMuted ? 'text-slate-500 bg-slate-800/40' : 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30'
              }`}
              title={isMuted ? 'تشغيل المؤثرات الصوتية (M)' : 'كتم الصوت (M)'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            {/* Playback Speed Switcher */}
            <button
              type="button"
              onClick={() => {
                const nextSpeed = playbackSpeed === 1 ? 1.5 : playbackSpeed === 1.5 ? 2 : playbackSpeed === 2 ? 0.75 : 1;
                handleSetSpeed(nextSpeed);
              }}
              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-400 font-bold text-[10px] font-mono flex items-center justify-center border border-slate-700/60 transition-all cursor-pointer"
              title="تغيير سرعة التشغيل"
            >
              {playbackSpeed}x
            </button>

            {/* Phone Frame Chassis Toggle */}
            <button
              type="button"
              onClick={() => setShowPhoneFrame((prev) => !prev)}
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                showPhoneFrame ? 'text-blue-400 bg-blue-500/10 border border-blue-500/30' : 'text-slate-400 bg-slate-800/50'
              }`}
              title="تبديل هيكل الهاتف (F)"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>

            {/* Interactive Manual Mode */}
            <button
              type="button"
              onClick={() => setInteractiveMode((prev) => !prev)}
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                interactiveMode ? 'text-emerald-300 bg-emerald-500/20 border border-emerald-500/40' : 'text-slate-400 bg-slate-800/50'
              }`}
              title={interactiveMode ? 'الوضع التفاعلي اليدوي' : 'الوضع السينمائي التلقائي'}
            >
              <Compass className="w-3.5 h-3.5" />
            </button>

            {/* Restart */}
            <button
              type="button"
              onClick={handleRestart}
              className="w-8 h-8 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              title="إعادة بدء الإعلان (R)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </main>
      ) : (
        /* =========================================================================
           STUDIO VIEW:
           Side-by-side desktop layout with responsive auto-scaled Phone on one side
           and full Director Controls Storyboard HUD on the other side.
           ========================================================================= */
        <main className="flex-1 min-h-0 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4 overflow-hidden my-1">
          {/* Phone Simulation Column */}
          <div className="flex-1 min-h-0 min-w-0 w-full h-full flex items-center justify-center">
            <PhoneSimulation
              currentScene={currentScene}
              interactiveMode={interactiveMode}
              showPhoneFrame={showPhoneFrame}
            />
          </div>

          {/* Director Controls Sidebar Column */}
          <div className="w-full lg:w-[410px] xl:w-[450px] h-full shrink-0 flex items-center justify-center py-1 overflow-hidden">
            <DirectorControls
              variant="sidebar"
              currentScene={currentScene}
              currentIndex={currentSceneIndex}
              totalScenes={totalScenes}
              isPlaying={isPlaying}
              playbackSpeed={playbackSpeed}
              isMuted={isMuted}
              interactiveMode={interactiveMode}
              showPhoneFrame={showPhoneFrame}
              onTogglePlay={handleTogglePlay}
              onPrevScene={handlePrevScene}
              onNextScene={handleNextScene}
              onRestart={handleRestart}
              onSetSpeed={handleSetSpeed}
              onToggleMute={handleToggleMute}
              onToggleInteractive={() => setInteractiveMode((prev) => !prev)}
              onTogglePhoneFrame={() => setShowPhoneFrame((prev) => !prev)}
              onSelectSceneStep={handleSelectSceneStep}
            />
          </div>
        </main>
      )}

      {/* FOOTER: Social Media Reels Story Caption & Scrubber (in Reel Mode) */}
      {viewMode === 'reel' && (
        <footer className="w-full max-w-2xl mx-auto z-30 shrink-0 px-2 pb-0.5">
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-2.5 shadow-xl space-y-1.5">
            {/* Scrubber Progress Line */}
            <div className="relative w-full h-1 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-emerald-400 to-amber-400 transition-all duration-300 rounded-full"
                style={{ width: `${((currentSceneIndex + 1) / totalScenes) * 100}%` }}
              />
            </div>

            {/* Reel Caption Row */}
            <div className="flex items-center justify-between gap-2.5 text-right">
              <div className="min-w-0 flex-1 space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-white truncate">
                    {currentScene.titleAr}
                  </span>
                  <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded border border-blue-500/30 shrink-0 font-bold">
                    المشهد {currentScene.stepNumber}/11
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 truncate">
                  {currentScene.descAr}
                </p>
              </div>

              {/* Step Milestone Dots for Quick Tap Jump */}
              <div className="flex items-center gap-1 shrink-0">
                {STORYBOARD_SCENES.map((sc, i) => (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => goToSceneIndex(i)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      i === currentSceneIndex
                        ? 'w-5 bg-blue-500 shadow-sm shadow-blue-500'
                        : i < currentSceneIndex
                        ? 'w-2 bg-emerald-500/70 hover:bg-emerald-400'
                        : 'w-2 bg-slate-700 hover:bg-slate-600'
                    }`}
                    title={`المشهد ${sc.stepNumber}: ${sc.titleAr}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

