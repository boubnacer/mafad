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
  Laptop,
  CheckCircle,
  Film
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
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleTogglePlay, handleNextScene, handlePrevScene, handleRestart, handleToggleMute]);

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#070A12] text-slate-100 flex flex-col justify-between p-3 sm:p-5 select-none relative overflow-x-hidden"
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
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between gap-3 z-30 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-lg shadow-lg shadow-blue-500/25">
            🔍
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-white text-base tracking-tight">مفقودات المغرب</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                💎 عرض المجوهرات ومراكش
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              محاكاة الهاتف الذكي التفاعلية · تقريب وتوسيط الكاميرا على كل حقل
            </p>
          </div>
        </div>

        {/* Quick Jump Buttons */}
        <div className="hidden md:flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => handleSelectSceneStep(1)}
            className="text-[11px] font-bold text-slate-300 hover:text-white px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            🌐 النطاق
          </button>
          <button
            type="button"
            onClick={() => handleSelectSceneStep(2)}
            className="text-[11px] font-bold text-slate-300 hover:text-white px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            🔍 الزران
          </button>
          <button
            type="button"
            onClick={() => handleSelectSceneStep(3)}
            className="text-[11px] font-bold text-amber-300 hover:text-amber-200 px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            💎 مجوهرات
          </button>
          <button
            type="button"
            onClick={() => handleSelectSceneStep(5)}
            className="text-[11px] font-bold text-blue-300 hover:text-blue-200 px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            📍 مراكش
          </button>
          <button
            type="button"
            onClick={() => handleSelectSceneStep(11)}
            className="text-[11px] font-bold text-emerald-300 hover:text-emerald-200 px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            🎉 تم النشر
          </button>
        </div>
      </header>

      {/* MAIN CENTER: THE SMARTPHONE STAGE WITH REALISTIC CENTERING CAMERA */}
      <main className="flex-1 flex items-center justify-center relative z-20 my-1">
        <PhoneSimulation
          currentScene={currentScene}
          interactiveMode={interactiveMode}
          showPhoneFrame={showPhoneFrame}
        />
      </main>

      {/* BOTTOM CONTROLLER: DIRECTOR HUD & NARRATION BAR */}
      <footer className="w-full max-w-4xl mx-auto z-30 mt-2">
        <DirectorControls
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
      </footer>
    </div>
  );
}
