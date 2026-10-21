import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Lock, 
  RotateCw, 
  MapPin, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowLeft,
  X,
  UploadCloud,
  Eye,
  Radio,
} from 'lucide-react';
import { StoryScene } from '../utils/storyboard';
import { soundEffects } from '../utils/audioSynth';
import { SHOWCASE_JEWELRY_DATA } from '../data/jewelryAssets';
import { Confetti } from './Confetti';

// 8 Categories with Jewelry explicitly available
export const SHOWCASE_CATEGORIES = [
  { id: 'phones', name: 'هواتف', icon: '📱' },
  { id: 'jewelry', name: 'مجوهرات وحلي', icon: '💎' },
  { id: 'wallets', name: 'محافظ', icon: '👛' },
  { id: 'keys', name: 'مفاتيح', icon: '🔑' },
  { id: 'docs', name: 'وثائق وبطاقات', icon: '🪪' },
  { id: 'bags', name: 'حقائب', icon: '🎒' },
  { id: 'pets', name: 'حيوانات أليفة', icon: '🐾' },
  { id: 'other', name: 'أخرى', icon: '📦' },
];

export const MARRAKECH_QUICK_TAGS = [
  'جامع الفنا',
  'سوق السمارين',
  'جيليز',
  'المدينة العتيقة',
  'المنارة',
];

interface PhoneSimulationProps {
  currentScene: StoryScene;
  interactiveMode: boolean;
  showPhoneFrame: boolean;
  onSceneActionTrigger?: (action: string) => void;
}

export const PhoneSimulation: React.FC<PhoneSimulationProps> = ({
  currentScene,
  interactiveMode,
  showPhoneFrame,
}) => {
  // Phone internal viewport dimensions: 390 x 844 (standard iPhone 16 Pro)
  const phoneViewportRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  // Form State
  const [domainText, setDomainText] = useState('mafqoudat.ma');
  const [isUrlLoading, setIsUrlLoading] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [postType, setPostType] = useState<'LOST' | 'FOUND'>('LOST');
  const [category, setCategory] = useState('jewelry');
  const [title, setTitle] = useState('');
  const [city, setCity] = useState('');
  const [exactLocation, setExactLocation] = useState('');
  const [date, setDate] = useState('2026-10-18');
  const [description, setDescription] = useState('');
  const [hasImage, setHasImage] = useState(false);
  const [facePrivacy, setFacePrivacy] = useState(true);
  const [isPublished, setIsPublished] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Animated Pointer Cursor (for simulated touch actions inside stage coordinates)
  const [pointer, setPointer] = useState<{ x: number; y: number; visible: boolean; pressing: boolean }>({
    x: 195,
    y: 60,
    visible: false,
    pressing: false,
  });

  // Smooth Camera State (Centered Zoom on filling field & Smooth Zoom Out)
  const [camera, setCamera] = useState<{ x: number; y: number; zoom: number }>({
    x: 0,
    y: 0,
    zoom: 1.0,
  });
  const prevZoomRef = useRef(1.0);

  // Typing effect cursor blinker
  const [typingCursorField, setTypingCursorField] = useState<string | null>(null);

  // Container ref and dynamic scale to fit available viewport height without clipping
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [phoneScale, setPhoneScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const parent = containerRef.current.parentElement;
      if (!parent) return;
      // Dimensions of the phone chassis: ~416px width x 870px height
      const availH = parent.clientHeight - 24;
      const availW = parent.clientWidth - 24;
      if (availH > 0 && availW > 0) {
        const scaleH = availH / 870;
        const scaleW = availW / 416;
        const fit = Math.min(1, Math.min(scaleH, scaleW));
        setPhoneScale(Math.max(0.4, fit));
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  // Calibrated field coordinates inside 390x844 stage space
  const fieldCoordinates: Record<string, { x: number; y: number }> = {
    'field-browser-url': { x: 195, y: 60 },
    'field-hero-buttons': { x: 195, y: 535 },
    'field-lost-button': { x: 195, y: 535 },
    'field-cat-jewelry': { x: 235, y: 350 },
    'field-title-input': { x: 300, y: 460 },
    'field-city-input': { x: 300, y: 280 },
    'field-exact-location': { x: 300, y: 380 },
    'field-date-input': { x: 195, y: 460 },
    'field-desc-input': { x: 300, y: 550 },
    'field-photo-upload': { x: 195, y: 320 },
    'field-publish-btn': { x: 195, y: 785 },
    'field-next-btn': { x: 195, y: 785 },
  };

  // Helper to dynamically measure exact untransformed position of target field relative to stage
  const getFieldCoordinates = useCallback((targetId?: string): { x: number; y: number } | null => {
    if (!targetId || !stageRef.current) return null;
    const stage = stageRef.current;
    const container = stage.querySelector(`#${targetId}`) as HTMLElement | null;
    if (!container) return null;

    // Prefer interactive inputs, textareas, or buttons within the container
    const activeEl = (container.querySelector('input:not([type="hidden"]), textarea, button') as HTMLElement | null) || container;

    let top = 0;
    let left = 0;
    let curr: HTMLElement | null = activeEl;
    while (curr && curr !== stage) {
      top += curr.offsetTop;
      left += curr.offsetLeft;
      if (curr.parentElement && curr.parentElement !== stage) {
        top -= curr.parentElement.scrollTop;
        left -= curr.parentElement.scrollLeft;
      }
      curr = curr.offsetParent as HTMLElement | null;
    }

    const isInput = activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA';
    const isLtr = activeEl.closest('.direction-ltr') !== null || targetId === 'field-browser-url';

    let x = left + activeEl.offsetWidth / 2;
    if (isInput) {
      // In RTL Arabic text input, position cursor near the right edge to simulate clicking the text entry area
      x = isLtr ? left + 45 : left + activeEl.offsetWidth - 35;
    }

    const y = top + activeEl.offsetHeight / 2;
    return { x, y };
  }, []);

  // React to current storyboard scene updates
  useEffect(() => {
    if (interactiveMode) return; // Allow manual exploration if in interactive mode

    const scene = currentScene;

    // Apply any form state patches specified by scene
    if (scene.formStatePatch) {
      if (scene.formStatePatch.domainText !== undefined) setDomainText(scene.formStatePatch.domainText as string);
      if (scene.formStatePatch.isSheetOpen !== undefined) setIsSheetOpen(scene.formStatePatch.isSheetOpen as boolean);
      if (scene.formStatePatch.activeStep !== undefined) setActiveStep(scene.formStatePatch.activeStep as number);
      if (scene.formStatePatch.postType !== undefined) setPostType(scene.formStatePatch.postType as 'LOST' | 'FOUND');
      if (scene.formStatePatch.category !== undefined) setCategory(scene.formStatePatch.category as string);
      if (scene.formStatePatch.title !== undefined) setTitle(scene.formStatePatch.title as string);
      if (scene.formStatePatch.city !== undefined) setCity(scene.formStatePatch.city as string);
      if (scene.formStatePatch.exactLocation !== undefined) setExactLocation(scene.formStatePatch.exactLocation as string);
      if (scene.formStatePatch.date !== undefined) setDate(scene.formStatePatch.date as string);
      if (scene.formStatePatch.description !== undefined) setDescription(scene.formStatePatch.description as string);
      if (scene.formStatePatch.hasImage !== undefined) setHasImage(scene.formStatePatch.hasImage as boolean);
      if (scene.formStatePatch.isPublished !== undefined) setIsPublished(scene.formStatePatch.isPublished as boolean);
    }

    // Camera zoom sound effect
    const nextZoom = scene.zoom || 1.0;
    if (Math.abs(nextZoom - prevZoomRef.current) > 0.03) {
      soundEffects.playZoom();
      prevZoomRef.current = nextZoom;
    }

    // Apply cursor & camera positioning
    const updatePositionAndCamera = () => {
      const resolved = scene.targetFieldId ? getFieldCoordinates(scene.targetFieldId) : null;
      const fallback = scene.targetFieldId ? fieldCoordinates[scene.targetFieldId] : null;
      const targetX = resolved ? resolved.x : (scene.pointerPos?.x ?? fallback?.x ?? scene.targetFallback?.x ?? 195);
      const targetY = resolved ? resolved.y : (scene.pointerPos?.y ?? fallback?.y ?? scene.targetFallback?.y ?? 422);

      // Camera Framing: Smooth zoom centering on the field being filled
      if (nextZoom <= 1.01) {
        setCamera({ x: 0, y: 0, zoom: 1.0 });
      } else {
        const viewX = 195;
        // Keep vertical focal point comfortably in the upper-middle frame
        const viewY = Math.min(460, Math.max(340, targetY));
        const rawTx = viewX - targetX * nextZoom;
        const rawTy = viewY - targetY * nextZoom;
        // Clamp bounds so stage content never detaches from phone edges
        const minTx = 390 * (1 - nextZoom);
        const minTy = 844 * (1 - nextZoom);
        const tx = Math.min(0, Math.max(minTx, rawTx));
        const ty = Math.min(0, Math.max(minTy, rawTy));
        setCamera({ x: tx, y: ty, zoom: nextZoom });
      }

      // Pointer positioning & action animation
      if (scene.pointerPos) {
        setPointer({
          x: targetX,
          y: targetY,
          visible: true,
          pressing: !!scene.pointerPos.pressing,
        });

        if (scene.pointerPos.pressing) {
          soundEffects.playTap();
        }
      } else {
        setPointer((prev) => ({ ...prev, visible: false, pressing: false }));
      }
    };

    updatePositionAndCamera();
    // Re-verify after paint in case newly mounted step changed DOM positions
    const rafId = requestAnimationFrame(updatePositionAndCamera);

    // Specific Action triggers (typing simulation, sound effects, celebration)
    let photoTimer: NodeJS.Timeout | null = null;
    if (scene.actionType === 'type_domain') {
      setTypingCursorField('domain');
      simulateTyping('mafqoudat.ma', (val) => setDomainText(val), () => {
        soundEffects.playKeyClick();
        setIsUrlLoading(true);
        setTimeout(() => setIsUrlLoading(false), 500);
      });
    } else if (scene.actionType === 'type_necklace') {
      setTypingCursorField('title');
      simulateTyping(SHOWCASE_JEWELRY_DATA.title, (val) => setTitle(val));
    } else if (scene.actionType === 'type_marrakech') {
      setTypingCursorField('city');
      simulateTyping(SHOWCASE_JEWELRY_DATA.city, (val) => setCity(val));
    } else if (scene.actionType === 'type_exact_location') {
      setTypingCursorField('exactLocation');
      simulateTyping(SHOWCASE_JEWELRY_DATA.exactLocation, (val) => setExactLocation(val));
    } else if (scene.actionType === 'type_description') {
      setTypingCursorField('description');
      simulateTyping(SHOWCASE_JEWELRY_DATA.description, (val) => setDescription(val));
    } else if (scene.actionType === 'press_lost_button') {
      soundEffects.playTap();
    } else if (scene.actionType === 'select_jewelry') {
      soundEffects.playTap();
      setCategory('jewelry');
    } else if (scene.actionType === 'upload_photo') {
      soundEffects.playTap();
      setHasImage(false);
      photoTimer = setTimeout(() => {
        setHasImage(true);
        soundEffects.playKeyClick();
      }, 350);
    } else if (scene.actionType === 'click_publish' || scene.actionType === 'success_celebration') {
      soundEffects.playSuccess();
      setIsPublished(true);
    }

    return () => {
      cancelAnimationFrame(rafId);
      if (photoTimer) clearTimeout(photoTimer);
    };
  }, [currentScene, interactiveMode, getFieldCoordinates]);

  // Helper to type text character-by-character with realistic cadence and audio
  const simulateTyping = (targetText: string, onUpdate: (text: string) => void, onComplete?: () => void) => {
    let currentLen = 0;
    const interval = setInterval(() => {
      currentLen++;
      if (currentLen <= targetText.length) {
        onUpdate(targetText.slice(0, currentLen));
        if (currentLen % 2 === 0) {
          soundEffects.playKeyClick();
        }
      } else {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, 40);

    return () => clearInterval(interval);
  };

  const selectedCategoryObj = SHOWCASE_CATEGORIES.find((c) => c.id === category) || SHOWCASE_CATEGORIES[1];
  const finalImage = imageError ? SHOWCASE_JEWELRY_DATA.fallbackImage : SHOWCASE_JEWELRY_DATA.image;

  // Published posts feed history inside the phone
  const publishedFeed = [
    ...(isPublished ? [{
      id: 'marrakech-lost-jewelry-live',
      type: 'LOST' as const,
      title: title || SHOWCASE_JEWELRY_DATA.title,
      city: city || SHOWCASE_JEWELRY_DATA.city,
      category: 'مجوهرات',
      date: 'الآن (مباشر)',
      image: finalImage,
      isLiveUserItem: true,
    }] : []),
    {
      id: 'p-seed-kech-1',
      type: 'LOST' as const,
      title: 'محفظة جلدية مع بطاقة تعريف وطنية',
      city: 'مراكش (جيليز)',
      category: 'محافظ',
      date: 'منذ ساعتين',
      image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'p-seed-kech-2',
      type: 'FOUND' as const,
      title: 'مفاتيح سيارة مع ميدالية فضية',
      city: 'مراكش (المنارة)',
      category: 'مفاتيح',
      date: 'اليوم',
      image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=300&auto=format&fit=crop&q=80',
    }
  ];

  return (
    <div 
      ref={containerRef}
      className="relative flex items-center justify-center p-1 sm:p-2 select-none"
      style={{
        transform: `scale(${phoneScale})`,
        transformOrigin: 'center center',
      }}
    >
      {/* Ambient Radial Spotlight Glow behind Smartphone */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="w-[500px] h-[750px] bg-blue-600/15 rounded-full blur-[130px]" />
        <div className="w-[400px] h-[550px] bg-amber-500/10 rounded-full blur-[140px]" />
      </div>

      {/* HARDWARE PHONE CHASSIS (Apple iPhone 16 Pro Dimensions: 390px x 844px) */}
      <div 
        className={`relative transition-all duration-300 shrink-0 ${
          showPhoneFrame 
            ? 'p-3 bg-[#1e2330] rounded-[56px] shadow-[0_30px_90px_-20px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.1),0_0_0_3px_#334155,0_0_0_5px_#0f172a]'
            : 'rounded-[46px] shadow-2xl'
        }`}
      >
        {/* Hardware Exterior Buttons */}
        {showPhoneFrame && (
          <>
            <div className="hidden sm:block absolute -left-[5px] top-28 w-[3.5px] h-9 bg-slate-600 rounded-l-sm" />
            <div className="hidden sm:block absolute -left-[5px] top-42 w-[3.5px] h-12 bg-slate-600 rounded-l-sm" />
            <div className="hidden sm:block absolute -left-[5px] top-58 w-[3.5px] h-12 bg-slate-600 rounded-l-sm" />
            <div className="hidden sm:block absolute -right-[5px] top-38 w-[3.5px] h-16 bg-slate-600 rounded-r-sm" />
          </>
        )}

        {/* SCREEN VIEWPORT CONTAINER: Exact 390 x 844 viewport bounding box */}
        <div
          ref={phoneViewportRef}
          className="w-[390px] h-[844px] shrink-0 bg-white rounded-[44px] relative overflow-hidden flex flex-col text-slate-900 border border-slate-300/60 shadow-inner"
          dir="rtl"
          style={{ fontFamily: "'Cairo', 'Plus Jakarta Sans', system-ui, sans-serif" }}
        >
          {/* Confetti Explosion Layer on Success Payoff */}
          <Confetti active={isPublished && (currentScene.actionType === 'success_celebration' || currentScene.id.includes('SUCCESS'))} />

          {/* DYNAMIC ISLAND NOTCH (Hardware Pill on Screen) */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-[116px] h-[29px] bg-black rounded-[22px] z-[1200] flex items-center justify-between px-3 shadow-md pointer-events-none">
            {/* Camera lens highlight */}
            <div className="w-2.5 h-2.5 rounded-full bg-[#111] border border-slate-800 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-blue-900/70" />
            </div>
            {/* Microphone sensor dot & Live indicator */}
            <div className="flex items-center gap-1.5">
              {isPublished && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              )}
              <div className="w-2 h-2 rounded-full bg-[#181818]" />
            </div>
          </div>

          {/* iOS TOP STATUS BAR */}
          <div className="h-10 px-7 pt-2 flex items-center justify-between text-[11px] font-bold text-slate-800 z-[1150] shrink-0 direction-ltr select-none">
            <span className="font-bold tracking-tight">9:41</span>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-700">
              <span className="text-[11px] font-mono">5G</span>
              <span>📶</span>
              <span>🔋 100%</span>
            </div>
          </div>

          {/* =========================================================================
              PHONE SCREEN STAGE: 390px x 844px display container holding all UI layers
             ========================================================================= */}
          <div
            ref={stageRef}
            className="w-[390px] h-[844px] absolute top-0 left-0 flex flex-col camera-stage"
            style={{
              transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.zoom})`,
              transformOrigin: '0 0',
              transition: 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            {/* VIRTUAL POINTER CURSOR (Rendered inside stage so it moves smoothly with elements) */}
            {pointer.visible && (
              <div
                className="absolute z-[1600] pointer-events-none transition-all duration-300 ease-out"
                style={{
                  left: `${pointer.x}px`,
                  top: `${pointer.y}px`,
                  transform: `translate(-50%, -50%) scale(${pointer.pressing ? 0.82 : 1})`,
                }}
              >
                {/* Outer Ripple on press */}
                {pointer.pressing && (
                  <div className="absolute -inset-3 rounded-full bg-blue-500/40 animate-ping pointer-events-none" />
                )}
                {/* Center Finger Contact Touch Point */}
                <div className="w-7 h-7 rounded-full bg-blue-600/75 border-2 border-white backdrop-blur-xs shadow-lg flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white shadow-xs" />
                </div>
              </div>
            )}

            {/* BROWSER ADDRESS BAR (Scene 1: mafqoudat.ma)
                Engineered with max-w-[325px] so when magnified by 1.15x, the entire bar,
                lock icon, full domain text, and reload button are completely visible in frame.
            */}
            <div 
              id="field-browser-url"
              className="mt-9 px-4 py-2 bg-slate-100/90 border-b border-slate-200 flex items-center justify-center z-[1000] shrink-0 direction-ltr transition-all duration-500"
            >
              <div 
                className={`w-full max-w-[325px] bg-white border rounded-full py-1.5 px-3 flex items-center justify-between shadow-2xs transition-all relative overflow-hidden ${
                  currentScene.id.includes('DOMAIN') 
                    ? 'border-blue-500 ring-2 ring-blue-400/50 shadow-md shadow-blue-500/15' 
                    : 'border-slate-300'
                }`}
              >
                {/* Domain Text and Lock icon */}
                <div className="flex items-center gap-1.5 min-w-0">
                  <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="tracking-tight font-mono text-[13px] font-bold text-slate-900">
                    {domainText}
                  </span>
                  {typingCursorField === 'domain' && (
                    <span className="w-0.5 h-4 bg-blue-600 animate-pulse inline-block" />
                  )}
                </div>

                {/* Country TLD badge and reload icon */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[10px] font-bold text-slate-500 font-mono bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                    🇲🇦 .MA
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsSheetOpen((prev) => !prev)}
                    className="text-slate-400 hover:text-slate-800 transition-colors cursor-pointer w-5 h-5 flex items-center justify-center rounded-full hover:bg-slate-100"
                    title="تحديث الصفحة"
                  >
                    <RotateCw className="w-3 h-3" />
                  </button>
                </div>

                {/* Loading shimmer progress bar */}
                {isUrlLoading && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 animate-[pulse_0.4s_ease-in-out_infinite]" />
                )}
              </div>
            </div>

            {/* WEBSITE HOME PAGE CONTAINER (Behind bottom sheet) */}
            <div className="flex-1 bg-gradient-to-b from-blue-50/60 via-white to-slate-50 relative overflow-hidden flex flex-col justify-between">
              <div>
                {/* Website Navigation Header */}
                <div className="px-4 py-2.5 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl">🔍</span>
                    <span className="font-black text-blue-600 text-lg tracking-tight">مفقودات</span>
                    <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded-md">المغرب</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-lg flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5 text-amber-600" />
                      <span>مراكش (Marrakech)</span>
                    </span>
                  </div>
                </div>

                {/* Hero Title & National Banner */}
                <div className="px-4 pt-3 pb-1 text-center space-y-1.5">
                  <div className="inline-flex items-center gap-1 text-[10px] font-extrabold text-blue-700 bg-blue-100/80 px-2.5 py-0.5 rounded-full">
                    <span>⚡ المنصة الوطنية الموحدة للإبلاغ عن المفقودات بالمغرب</span>
                  </div>

                  <h1 className="text-lg font-black text-slate-900 leading-snug">
                    هل أضعت شيئاً في <span className="text-blue-600 underline decoration-amber-400 decoration-2">مراكش</span>؟
                  </h1>

                  <p className="text-[11px] text-slate-500 leading-relaxed max-w-xs mx-auto">
                    شبكة موثوقة للربط الذكي بين المفقودات وأصحابها في ساحة جامع الفنا، جيليز، وأرجاء مراكش.
                  </p>
                </div>

                {/* Active Marrakech Feed Cards */}
                <div className="px-4 py-2 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold px-1">
                    <div className="flex items-center gap-1 text-emerald-700">
                      <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
                      <span>رادار مراكش المباشر</span>
                    </div>
                    <span className="text-blue-600 font-semibold">{publishedFeed.length} إعلانات نشطة</span>
                  </div>

                  <div className="space-y-1.5 max-h-[175px] overflow-hidden pr-0.5">
                    {publishedFeed.map((item) => (
                      <div
                        key={item.id}
                        className={`border rounded-xl p-2 flex items-center justify-between gap-2 shadow-2xs text-right transition-all ${
                          item.id === 'marrakech-lost-jewelry-live'
                            ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-200 animate-in fade-in duration-300'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                            <img 
                              src={item.image} 
                              alt={item.title} 
                              onError={() => setImageError(true)}
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 truncate flex items-center gap-1">
                              {item.id === 'marrakech-lost-jewelry-live' && (
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              )}
                              <span>{item.title}</span>
                            </div>
                            <div className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                              <MapPin className="w-2.5 h-2.5 text-slate-400" />
                              <span>{item.city}</span>
                            </div>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
                            item.type === 'LOST'
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {item.type === 'LOST' ? 'مفقود' : 'موجود'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* =========================================================================
                  SCENE 2: The Two Hero Action Buttons ("Lost something?" / "Found something?")
                  Both buttons stay 100% visible with comfortable padding.
                 ========================================================================= */}
              <div 
                id="field-hero-buttons"
                className={`p-4 bg-gradient-to-t from-white via-white to-transparent pt-3 pb-6 transition-all duration-500 ${
                  currentScene.id.includes('HERO') 
                    ? 'rounded-2xl ring-2 ring-rose-400/30 bg-rose-50/20' 
                    : ''
                }`}
              >
                <div className="max-w-[325px] mx-auto space-y-2.5 w-full">
                  {/* Button 1: هل فقدتَ شيئاً؟ / Lost something? */}
                  <button
                    id="field-lost-button"
                    type="button"
                    onClick={() => {
                      setPostType('LOST');
                      setIsSheetOpen(true);
                      setActiveStep(0);
                      soundEffects.playTap();
                    }}
                    className={`w-full p-3 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold text-right flex items-center justify-between shadow-md shadow-rose-500/25 transition-all cursor-pointer ${
                      pointer.pressing && currentScene.id.includes('PRESS_LOST')
                        ? 'scale-95 ring-4 ring-rose-300'
                        : 'hover:scale-[1.01]'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-extrabold tracking-tight flex items-center gap-1.5">
                        <span>هل فقدتَ شيئاً؟</span>
                        <span className="text-[11px] font-normal opacity-90">(Lost something?)</span>
                      </div>
                      <div className="text-[11px] text-rose-100 font-medium mt-0.5">
                        بلّغ الآن واطلب مساعدة أهالي وزوار مراكش
                      </div>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-lg shrink-0">
                      🔍
                    </div>
                  </button>

                  {/* Button 2: هل وجدتَ شيئاً؟ / Found something? */}
                  <button
                    type="button"
                    onClick={() => {
                      setPostType('FOUND');
                      setIsSheetOpen(true);
                      setActiveStep(0);
                      soundEffects.playTap();
                    }}
                    className="w-full p-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold text-right flex items-center justify-between shadow-md shadow-emerald-500/20 hover:scale-[1.01] transition-all cursor-pointer"
                  >
                    <div>
                      <div className="text-sm font-extrabold tracking-tight flex items-center gap-1.5">
                        <span>هل وجدتَ شيئاً؟</span>
                        <span className="text-[11px] font-normal opacity-90">(Found something?)</span>
                      </div>
                      <div className="text-[11px] text-emerald-100 font-medium mt-0.5">
                        ساعد صاحبه في العثور عليه واكسب الأجر
                      </div>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-lg shrink-0">
                      🎁
                    </div>
                  </button>
                </div>
              </div>

              {/* =========================================================================
                  MULTI-STEP REPORT MODAL / BOTTOM SHEET
                  All inputs & controls have max-w-[325px] so that when zoomed to 1.16x,
                  every field, label, and typed character is 100% visible without clipping.
                 ========================================================================= */}
              {isSheetOpen && (
                <div
                  className="absolute inset-0 bg-slate-950/65 backdrop-blur-[3px] z-[1100] flex flex-col justify-end animate-in fade-in duration-200"
                  onClick={(e) => {
                    if (e.target === e.currentTarget && interactiveMode) setIsSheetOpen(false);
                  }}
                >
                  <div
                    className="w-full h-[680px] bg-white rounded-t-[28px] shadow-2xl flex flex-col overflow-hidden border-t border-slate-200 animate-in slide-in-from-bottom-8 duration-300"
                  >
                    {/* Sheet Handle */}
                    <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto my-2 shrink-0" />

                    {/* Sheet Header */}
                    <div className="px-4 py-2 flex items-center justify-between border-b border-slate-100 shrink-0">
                      <div>
                        <h3 className="text-sm sm:text-base font-black text-slate-900 leading-tight flex items-center gap-1.5">
                          {isPublished ? (
                            <>
                              <span>تم النشر بنجاح</span>
                              <span>🎉</span>
                            </>
                          ) : (
                            <>
                              <span>إضافة إعلان مفقودات جديد</span>
                            </>
                          )}
                        </h3>
                        <div className="text-[11px] text-slate-500">
                          {!isPublished ? (
                            <span>
                              الخطوة {activeStep + 1} من 4:{' '}
                              <strong className="text-blue-600">
                                {activeStep === 0
                                  ? 'نوع الغرض والقسم'
                                  : activeStep === 1
                                  ? 'المكان والتاريخ'
                                  : activeStep === 2
                                  ? 'الصورة الموثقة'
                                  : 'المراجعة النهائية'}
                              </strong>
                            </span>
                          ) : (
                            'إعلانك منشور ومتاح الآن في رادار مراكش'
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                          {postType === 'LOST' ? '🔍 مفقود' : '🎁 موجود'}
                        </span>
                        {interactiveMode && (
                          <button
                            type="button"
                            onClick={() => setIsSheetOpen(false)}
                            className="w-6 h-6 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 text-sm transition-colors cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* 4-Step Progress Bars */}
                    {!isPublished && (
                      <div className="px-4 pt-2 pb-1 shrink-0 bg-slate-50/70 border-b border-slate-100">
                        <div className="grid grid-cols-4 gap-1.5 max-w-[325px] mx-auto">
                          {[
                            { idx: 0, title: '1. الغرض' },
                            { idx: 1, title: '2. المكان' },
                            { idx: 2, title: '3. الصورة' },
                            { idx: 3, title: '4. النشر' },
                          ].map((st) => {
                            const isPassed = st.idx <= activeStep;
                            const isCurrent = st.idx === activeStep;
                            return (
                              <div key={st.idx} className="space-y-1">
                                <div
                                  className={`h-1.5 rounded-full transition-all duration-300 ${
                                    isPassed
                                      ? isCurrent
                                        ? 'bg-blue-600 ring-2 ring-blue-300 shadow-xs'
                                        : 'bg-emerald-500'
                                      : 'bg-slate-200'
                                  }`}
                                />
                                <div className="text-[9px] text-center text-slate-500 font-bold truncate">
                                  {st.title}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Sheet Content Body with max-w-[325px] wrapper for professional motion graphic framing */}
                    <div className="px-4 py-3 overflow-y-auto overflow-x-hidden flex-1 space-y-3.5">
                      <div className="max-w-[325px] mx-auto w-full space-y-3.5">
                        {isPublished ? (
                          /* SUCCESS PAYOFF CARD (Scene 11) */
                          <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
                            {/* Green Success Banner */}
                            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-300 text-emerald-800 p-2.5 rounded-xl text-xs font-bold shadow-xs">
                              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px] shrink-0">
                                ✓
                              </span>
                              <div>
                                <div>تم نشر إعلانك بنجاح في مراكش!</div>
                                <div className="text-[10px] text-emerald-700 font-normal mt-0.5">
                                  تم إرسال تنبيه فوري لمستخدمي رادار جامع الفنا وجيليز.
                                </div>
                              </div>
                            </div>

                            {/* Published Item Card Preview */}
                            <div className="border border-slate-200 bg-white rounded-2xl p-3 shadow-sm space-y-2.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
                                  <span>● غرض مفقود (Lost)</span>
                                </span>
                                <span className="text-[10px] text-slate-400 font-medium">الآن · 20 أكتوبر 2026</span>
                              </div>

                              <div>
                                <h4 className="text-sm font-black text-slate-900 leading-snug">
                                  {title || SHOWCASE_JEWELRY_DATA.title}
                                </h4>
                                <div className="text-[11px] text-blue-700 font-bold mt-0.5 flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-blue-600" />
                                  <span>{city || SHOWCASE_JEWELRY_DATA.city}</span>
                                  {exactLocation && (
                                    <span className="text-slate-500 font-normal"> · {exactLocation}</span>
                                  )}
                                </div>
                              </div>

                              {/* Item Photo Display */}
                              <div className="w-full h-36 rounded-xl overflow-hidden border border-slate-200 bg-slate-900 relative shadow-inner">
                                <img
                                  src={finalImage}
                                  alt={title}
                                  onError={() => setImageError(true)}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-2 right-2 bg-slate-950/80 backdrop-blur-xs text-amber-300 text-[10px] px-2 py-0.5 rounded-md font-bold flex items-center gap-1 border border-amber-400/30">
                                  <span>💎</span>
                                  <span>مجوهرات وحلي</span>
                                </div>
                                <div className="absolute top-2 left-2 bg-emerald-600/90 backdrop-blur-xs text-white text-[9px] px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                                  <ShieldCheck className="w-3 h-3" />
                                  <span>خصوصية محمية</span>
                                </div>
                              </div>

                              <p className="text-[11px] text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                {description || SHOWCASE_JEWELRY_DATA.description}
                              </p>

                              <div className="flex items-center justify-between pt-1.5 text-[10px] text-slate-500 border-t border-slate-100 font-semibold">
                                <span className="flex items-center gap-1">
                                  <Eye className="w-3 h-3 text-slate-400" />
                                  <span>مشاهدة فورية</span>
                                </span>
                                <span className="text-blue-600 font-bold flex items-center gap-1">
                                  <Radio className="w-3 h-3 animate-pulse text-emerald-500" />
                                  <span>نشط في رادار مراكش</span>
                                </span>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-2 gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setIsPublished(false);
                                  setActiveStep(0);
                                  soundEffects.playTap();
                                }}
                                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                              >
                                ➕ إعلان مفقود آخر
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setIsSheetOpen(false);
                                  soundEffects.playTap();
                                }}
                                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
                              >
                                عرض على الخريطة ✓
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            {/* =========================================================================
                                STEP 1: نوع الغرض والقسم (Scenes 3, 4, 5)
                               ========================================================================= */}
                            {activeStep === 0 && (
                              <div className="space-y-3.5">
                                {/* Type Toggle: فقدتُ / وجدتُ */}
                                <div>
                                  <label className="block text-xs font-bold text-slate-800 mb-1">
                                    هل فقدتَ شيئاً أم وجدته؟ *
                                  </label>
                                  <div className="grid grid-cols-2 gap-2">
                                    <button
                                      type="button"
                                      onClick={() => setPostType('LOST')}
                                      className={`p-2 rounded-xl border text-right flex items-center gap-2 transition-all cursor-pointer ${
                                        postType === 'LOST'
                                          ? 'bg-rose-50 border-rose-400 text-rose-700 ring-2 ring-rose-200 shadow-2xs font-bold'
                                          : 'bg-slate-50 border-slate-200 text-slate-700'
                                      }`}
                                    >
                                      <span className="text-lg">🔍</span>
                                      <div>
                                        <div className="text-xs font-bold">فقدتُ غرضاً</div>
                                        <div className="text-[10px] opacity-75">أبحث عن غرض ضائع</div>
                                      </div>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => setPostType('FOUND')}
                                      className={`p-2 rounded-xl border text-right flex items-center gap-2 transition-all cursor-pointer ${
                                        postType === 'FOUND'
                                          ? 'bg-emerald-50 border-emerald-400 text-emerald-700 ring-2 ring-emerald-200 shadow-2xs font-bold'
                                          : 'bg-slate-50 border-slate-200 text-slate-700'
                                      }`}
                                    >
                                      <span className="text-lg">🎁</span>
                                      <div>
                                        <div className="text-xs font-bold">وجدتُ غرضاً</div>
                                        <div className="text-[10px] opacity-75">عثرت على غرض لشخص</div>
                                      </div>
                                    </button>
                                  </div>
                                </div>

                                {/* SCENE 3 TARGET: Category Grid with Jewelry (💎 مجوهرات وحلي)
                                    Padded so all 8 categories and the Jewelry button fit inside the phone with margins.
                                */}
                                <div 
                                  id="section-cat-grid" 
                                  className={`space-y-1.5 transition-all duration-500 p-2 rounded-2xl ${
                                    currentScene.id.includes('JEWELRY')
                                      ? 'bg-amber-50/70 ring-2 ring-amber-400/80 shadow-lg shadow-amber-500/15'
                                      : ''
                                  }`}
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <label className="block text-xs font-bold text-slate-800">
                                      اختر القسم * <span className="text-slate-400 font-normal">(Category)</span>
                                    </label>
                                    <span className="text-[10px] text-amber-700 font-bold bg-amber-100/80 px-2 py-0.5 rounded border border-amber-300">
                                      {selectedCategoryObj.name} {selectedCategoryObj.icon}
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-4 gap-1.5">
                                    {SHOWCASE_CATEGORIES.map((cat) => {
                                      const isSelected = category === cat.id;
                                      return (
                                        <button
                                          type="button"
                                          key={cat.id}
                                          id={cat.id === 'jewelry' ? 'field-cat-jewelry' : `field-cat-${cat.id}`}
                                          onClick={() => {
                                            setCategory(cat.id);
                                            soundEffects.playTap();
                                          }}
                                          className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                                            isSelected
                                              ? 'border-amber-400 bg-amber-50 text-amber-900 ring-2 ring-amber-300 font-bold shadow-xs scale-[1.02]'
                                              : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:border-slate-300 font-medium'
                                          }`}
                                        >
                                          <span className="text-lg leading-tight">{cat.icon}</span>
                                          <span className="text-[10px] truncate w-full text-center">
                                            {cat.name}
                                          </span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* SCENE 4 TARGET: Item Name / Title ("عقد ذهبي مرصع / Necklace")
                                    Framed completely with borders, label, and full written text in frame.
                                */}
                                <div 
                                  id="field-title-input" 
                                  className={`transition-all duration-500 p-2 rounded-2xl ${
                                    currentScene.id.includes('TITLE')
                                      ? 'bg-blue-50/70 ring-2 ring-blue-500/70 shadow-lg shadow-blue-500/15'
                                      : ''
                                  }`}
                                >
                                  <label className="block text-xs font-bold text-slate-800 mb-1">
                                    اسم الغرض ومواصفاته * <span className="text-slate-400 font-normal">(Item Name: Necklace)</span>
                                  </label>
                                  <div className="relative">
                                    <input
                                      type="text"
                                      value={title}
                                      onChange={(e) => setTitle(e.target.value)}
                                      placeholder="مثال: عقد ذهبي مرصع (Golden Necklace)"
                                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 shadow-2xs focus:outline-none"
                                    />
                                    {typingCursorField === 'title' && (
                                      <span className="absolute left-3 top-2.5 w-0.5 h-3.5 bg-blue-600 animate-pulse" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* =========================================================================
                                STEP 2: المكان والتاريخ (Scenes 5, 6, 7, 8)
                               ========================================================================= */}
                            {activeStep === 1 && (
                              <div className="space-y-3.5">
                                {/* SCENE 5 TARGET: City Selection (Marrakech) */}
                                <div 
                                  id="field-city-input" 
                                  className={`transition-all duration-500 p-2 rounded-2xl ${
                                    currentScene.id.includes('CITY')
                                      ? 'bg-blue-50/70 ring-2 ring-blue-500/70 shadow-lg shadow-blue-500/15'
                                      : ''
                                  }`}
                                >
                                  <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
                                    <span>المدينة * <span className="text-slate-400 font-normal">(City: Marrakech)</span></span>
                                    <span className="text-[10px] text-blue-600 font-bold">🇲🇦 مراكش الحمراء</span>
                                  </label>
                                  <div className="relative">
                                    <input
                                      type="text"
                                      value={city}
                                      onChange={(e) => setCity(e.target.value)}
                                      placeholder="مثال: مراكش (Marrakech)"
                                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 shadow-2xs focus:outline-none"
                                    />
                                    {typingCursorField === 'city' && (
                                      <span className="absolute left-3 top-2.5 w-0.5 h-3.5 bg-blue-600 animate-pulse" />
                                    )}
                                  </div>

                                  {/* Quick Marrakech District Tags */}
                                  <div className="flex flex-wrap gap-1 mt-1.5">
                                    {MARRAKECH_QUICK_TAGS.map((tag) => (
                                      <button
                                        key={tag}
                                        type="button"
                                        onClick={() => {
                                          setCity(`مراكش (${tag})`);
                                          soundEffects.playTap();
                                        }}
                                        className={`text-[9px] px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                                          city.includes(tag)
                                            ? 'bg-blue-600 text-white border-blue-600 font-bold'
                                            : 'bg-slate-100 hover:bg-blue-50 text-slate-600 border-slate-200'
                                        }`}
                                      >
                                        📍 {tag}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {/* SCENE 6 TARGET: Exact Landmark (سوق السمارين) */}
                                <div 
                                  id="field-exact-location" 
                                  className={`transition-all duration-500 p-2 rounded-2xl ${
                                    currentScene.id.includes('LOC')
                                      ? 'bg-blue-50/70 ring-2 ring-blue-500/70 shadow-lg shadow-blue-500/15'
                                      : ''
                                  }`}
                                >
                                  <label className="block text-xs font-bold text-slate-800 mb-1">
                                    المكان المحدد بدقة <span className="text-slate-400 font-normal">(Exact Landmark)</span>
                                  </label>
                                  <div className="relative">
                                    <input
                                      type="text"
                                      value={exactLocation}
                                      onChange={(e) => setExactLocation(e.target.value)}
                                      placeholder="مثال: سوق السمارين، قرب ساحة جامع الفنا"
                                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 shadow-2xs focus:outline-none"
                                    />
                                    {typingCursorField === 'exactLocation' && (
                                      <span className="absolute left-3 top-2.5 w-0.5 h-3.5 bg-blue-600 animate-pulse" />
                                    )}
                                  </div>
                                </div>

                                {/* SCENE 7 TARGET: Date of Loss (تاريخ الفقدان) */}
                                <div 
                                  id="field-date-input" 
                                  className={`transition-all duration-500 p-2 rounded-2xl ${
                                    currentScene.id.includes('DATE')
                                      ? 'bg-blue-50/70 ring-2 ring-blue-500/70 shadow-lg shadow-blue-500/15'
                                      : ''
                                  }`}
                                >
                                  <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
                                    <span>تاريخ الفقدان * <span className="text-slate-400 font-normal">(Date of Loss)</span></span>
                                    <span className="text-[10px] text-slate-500">18 أكتوبر 2026</span>
                                  </label>
                                  <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none shadow-2xs"
                                  />
                                </div>

                                {/* SCENE 8 TARGET: Description & Details (الوصف والتفاصيل) */}
                                <div 
                                  id="field-desc-input" 
                                  className={`transition-all duration-500 p-2 rounded-2xl ${
                                    currentScene.id.includes('DESC')
                                      ? 'bg-blue-50/70 ring-2 ring-blue-500/70 shadow-lg shadow-blue-500/15'
                                      : ''
                                  }`}
                                >
                                  <label className="block text-xs font-bold text-slate-800 mb-1">
                                    الوصف ومواصفات العقد والمكافأة <span className="text-slate-400 font-normal">(Description)</span>
                                  </label>
                                  <div className="relative">
                                    <textarea
                                      rows={2}
                                      value={description}
                                      onChange={(e) => setDescription(e.target.value)}
                                      placeholder="أدخل مواصفات العقد الذهبي والحجر الفيروزي والمكافأة..."
                                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none shadow-2xs resize-none"
                                    />
                                    {typingCursorField === 'description' && (
                                      <span className="absolute left-3 top-2.5 w-0.5 h-3.5 bg-blue-600 animate-pulse" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* =========================================================================
                                STEP 3: صورة الغرض (Scene 9: Photo Upload)
                               ========================================================================= */}
                            {activeStep === 2 && (
                              <div className="space-y-3.5">
                                {/* SCENE 9 TARGET: Photo Upload Dropzone */}
                                <div 
                                  id="field-photo-upload" 
                                  className={`transition-all duration-500 p-2 rounded-2xl ${
                                    currentScene.id.includes('PHOTO')
                                      ? 'bg-blue-50/70 ring-2 ring-blue-500/70 shadow-lg shadow-blue-500/15'
                                      : ''
                                  }`}
                                >
                                  <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
                                    <span>صورة الغرض * <span className="text-slate-400 font-normal">(Jewelry Photo)</span></span>
                                    <span className="text-[10px] text-emerald-600 font-bold">صورة موثقة</span>
                                  </label>

                                  <div
                                    onClick={() => {
                                      setHasImage(true);
                                      soundEffects.playTap();
                                    }}
                                    className={`border-2 border-dashed rounded-2xl p-3 text-center cursor-pointer transition-all ${
                                      hasImage
                                        ? 'border-emerald-400 bg-emerald-50/50'
                                        : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
                                    }`}
                                  >
                                    {hasImage ? (
                                      <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-2.5">
                                          <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shrink-0 shadow-xs">
                                            <img
                                              src={finalImage}
                                              alt="Necklace Preview"
                                              onError={() => setImageError(true)}
                                              className="w-full h-full object-cover"
                                            />
                                          </div>
                                          <div className="text-right">
                                            <div className="text-xs font-bold text-slate-900">
                                              {SHOWCASE_JEWELRY_DATA.fileName}
                                            </div>
                                            <div className="text-[10px] text-emerald-600 font-bold mt-0.5 flex items-center gap-1">
                                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                              <span>تم تجهيز الصورة بنجاح (1.4 MB)</span>
                                            </div>
                                            <div className="text-[9px] text-blue-600">
                                              💎 عقد ذهبي مرصع - مراكش
                                            </div>
                                          </div>
                                        </div>

                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setHasImage(false);
                                          }}
                                          className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-1 rounded-md hover:bg-rose-100 transition-colors cursor-pointer"
                                        >
                                          إزالة
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="py-3 space-y-1">
                                        <UploadCloud className="w-8 h-8 text-blue-500 mx-auto" />
                                        <div className="text-xs font-bold text-slate-800">
                                          اضغط لرفع صورة العقد الذهبي
                                        </div>
                                        <div className="text-[10px] text-slate-500">
                                          يدعم صور الكاميرا وملفات JPG و PNG
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Face & Serial Privacy Protection */}
                                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                                  <div>
                                    <div className="font-bold text-slate-900 flex items-center gap-1">
                                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                      <span>تعتيم الوجوه وحماية الخصوصية</span>
                                    </div>
                                    <div className="text-[10px] text-slate-500">
                                      حماية تلقائية لخصوصية الأشخاص في خلفية الصورة
                                    </div>
                                  </div>
                                  <input
                                    type="checkbox"
                                    checked={facePrivacy}
                                    onChange={(e) => setFacePrivacy(e.target.checked)}
                                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                                  />
                                </div>
                              </div>
                            )}

                            {/* =========================================================================
                                STEP 4: مراجعة الإعلان قبل النشر (Scene 10)
                               ========================================================================= */}
                            {activeStep === 3 && (
                              <div className="space-y-3">
                                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-3 space-y-2 text-xs">
                                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/60">
                                    <span className="text-slate-500">نوع الإعلان:</span>
                                    <strong className="text-rose-600 font-bold">
                                      🔍 فقدتُ غرضاً (مفقود)
                                    </strong>
                                  </div>

                                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/60">
                                    <span className="text-slate-500">القسم والغرض:</span>
                                    <strong className="text-slate-900 font-bold flex items-center gap-1">
                                      <span>💎 مجوهرات:</span>
                                      <span>{title || SHOWCASE_JEWELRY_DATA.title}</span>
                                    </strong>
                                  </div>

                                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/60">
                                    <span className="text-slate-500">المدينة والموقع:</span>
                                    <span className="text-blue-700 font-bold">
                                      {city || SHOWCASE_JEWELRY_DATA.city} · {exactLocation || SHOWCASE_JEWELRY_DATA.exactLocation}
                                    </span>
                                  </div>

                                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/60">
                                    <span className="text-slate-500">التاريخ:</span>
                                    <span className="text-slate-800 font-medium">{date}</span>
                                  </div>

                                  {hasImage && (
                                    <div className="flex items-center justify-between pt-1">
                                      <span className="text-slate-500">معاينة الصورة المرفقة:</span>
                                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-300">
                                        <img
                                          src={finalImage}
                                          alt="Necklace thumbnail"
                                          onError={() => setImageError(true)}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>

                                <div className="text-[10px] text-slate-500 text-center leading-relaxed">
                                  بالنقر على نشر الإعلان، سيتم إتاحته فوراً على منصة مفقودات وتنبيه المجتمع المحلي في مراكش.
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Sheet Footer Navigation & Submit Controls */}
                    {!isPublished && (
                      <div className="px-4 py-2.5 border-t border-slate-100 bg-white flex items-center justify-center shrink-0">
                        <div className="max-w-[325px] w-full flex items-center gap-2">
                          {activeStep > 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveStep((prev) => prev - 1);
                                soundEffects.playTap();
                              }}
                              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                            >
                              السابق
                            </button>
                          )}

                          {activeStep < 3 ? (
                            <button
                              id="field-next-btn"
                              type="button"
                              onClick={() => {
                                setActiveStep((prev) => prev + 1);
                                soundEffects.playTap();
                              }}
                              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-500/20 cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                            >
                              <span>متابعة الخطوة التالية</span>
                              <ArrowLeft className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            /* SCENE 10 TARGET: Publish Button ("نشر الإعلان الآن 🚀") */
                            <button
                              id="field-publish-btn"
                              type="button"
                              onClick={() => {
                                setIsPublished(true);
                                soundEffects.playSuccess();
                              }}
                              className={`flex-1 py-2.5 text-white text-xs font-extrabold rounded-xl transition-all shadow-lg cursor-pointer flex items-center justify-center gap-1.5 ${
                                currentScene.id.includes('PUBLISH')
                                  ? 'bg-gradient-to-r from-emerald-500 to-green-600 ring-4 ring-emerald-300 shadow-emerald-500/40 scale-[1.02]'
                                  : 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 shadow-emerald-500/25 active:scale-95'
                              }`}
                            >
                              <span>نشر الإعلان الآن 🚀</span>
                              <span className="text-[10px] font-normal opacity-90">(Publish to Marrakech)</span>
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* iOS Bottom Navigation & Home Gesture Bar */}
            <div className="h-6 bg-white flex items-center justify-center shrink-0 border-t border-slate-100">
              <div className="w-32 h-1 bg-slate-900/80 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
