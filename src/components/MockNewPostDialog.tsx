import React, { useState, useRef, useEffect } from 'react';

/**
 * MAFQOUDAT MOBILE BOTTOM SHEET DIALOG (ARABIC RTL)
 * 
 * 4-Step Wizard:
 * Step 1: نوع الغرض (Dual toggle "فقدتُ" / "وجدتُ" + 8 category tiles + Title)
 * Step 2: المكان والتاريخ (City/district + Landmark + Date + Description)
 * Step 3: الصورة (Upload box + Preview thumbnail + Face privacy)
 * Step 4: المراجعة (Summary review card + "نشر الإعلان الآن 🚀")
 * Payoff: تم النشر بنجاح (Published item card preview)
 */

export interface CategoryOptionAr {
  id: string;
  name: string;
  icon: string;
}

export const CATEGORIES_AR: CategoryOptionAr[] = [
  { id: 'phones', name: 'هواتف', icon: '📱' },
  { id: 'wallets', name: 'محافظ', icon: '👛' },
  { id: 'keys', name: 'مفاتيح', icon: '🔑' },
  { id: 'docs', name: 'وثائق', icon: '🪪' },
  { id: 'bags', name: 'حقائب', icon: '🎒' },
  { id: 'pets', name: 'حيوانات', icon: '🐾' },
  { id: 'jewelry', name: 'ساعات', icon: '⌚' },
  { id: 'other', name: 'أخرى', icon: '📦' },
];

export const MOROCCAN_CITIES_AR = [
  'الدار البيضاء (موروكو مول)',
  'الدار البيضاء (المعاريف)',
  'الرباط (أكدال)',
  'مراكش (جيليز)',
  'طنجة (مالاباطا)',
  'أكادير (مارينا)',
  'فاس (المدينة الجديدة)',
];

// Clean vector fallback for the Navy Blue iPhone 13 Pro Max
export const DEFAULT_PHONE_IMAGE_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="none"><rect width="600" height="400" fill="%230F172A"/><rect x="220" y="40" width="160" height="320" rx="32" fill="%231E293B" stroke="%2338BDF8" stroke-width="3"/><rect x="232" y="55" width="60" height="60" rx="16" fill="%230F172A"/><circle cx="248" cy="70" r="10" fill="%231E293B" stroke="%2338BDF8" stroke-width="2"/><circle cx="276" cy="70" r="10" fill="%231E293B" stroke="%2338BDF8" stroke-width="2"/><circle cx="248" cy="98" r="10" fill="%231E293B" stroke="%2338BDF8" stroke-width="2"/><circle cx="276" cy="98" r="4" fill="%2364748B"/><path d="M255 180C255 170 262 165 270 165C275 165 280 168 283 170C286 168 291 165 296 165C305 165 311 172 311 182C311 195 298 212 283 220C268 212 255 195 255 180Z" fill="%2338BDF8" opacity="0.3"/><text x="300" y="340" text-anchor="middle" fill="%2394A3B8" font-family="sans-serif" font-size="13" font-weight="bold">iPhone 13 Pro Max (Sierra Blue)</text></svg>`;

export const mockSampleDataAr = {
  type: 'LOST' as const,
  category: 'phones',
  title: 'آيفون 13 برو ماكس (أزرق)',
  city: 'الدار البيضاء (موروكو مول)',
  exactLocation: 'الطابق الأرضي، قرب مقهى ستاربكس',
  date: '2026-10-20',
  description: 'فُقد حوالي الساعة 4:30 مساءً، عليه غطاء حماية أزرق مع خدش بسيط قرب الكاميرا.',
  image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&auto=format&fit=crop&q=80',
};

export interface MockNewPostDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
  initialType?: 'LOST' | 'FOUND';
  prefill?: boolean;
}

export default function MockNewPostDialog({
  isOpen,
  onClose,
  onSubmit,
  initialType = 'LOST',
  prefill = true,
}: MockNewPostDialogProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    type: initialType || 'LOST',
    category: prefill ? mockSampleDataAr.category : 'phones',
    title: prefill ? mockSampleDataAr.title : '',
    city: prefill ? mockSampleDataAr.city : 'الدار البيضاء (موروكو مول)',
    exactLocation: prefill ? mockSampleDataAr.exactLocation : '',
    date: prefill ? mockSampleDataAr.date : '2026-10-20',
    description: prefill ? mockSampleDataAr.description : '',
    hasImage: prefill,
    image: mockSampleDataAr.image,
    facePrivacy: true,
  });

  const [isPublished, setIsPublished] = useState(false);
  const [imageLoadFailed, setImageLoadFailed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync initial type if changed
  useEffect(() => {
    if (initialType) {
      setFormData(prev => ({ ...prev, type: initialType }));
    }
  }, [initialType]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleFillDemo = () => {
    setFormData({
      type: formData.type || 'LOST',
      category: 'phones',
      title: mockSampleDataAr.title,
      city: mockSampleDataAr.city,
      exactLocation: mockSampleDataAr.exactLocation,
      date: mockSampleDataAr.date,
      description: mockSampleDataAr.description,
      hasImage: true,
      image: mockSampleDataAr.image,
      facePrivacy: true,
    });
    setImageLoadFailed(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFormData(prev => ({
          ...prev,
          image: ev.target?.result as string,
          hasImage: true,
        }));
        setImageLoadFailed(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const currentCategory = CATEGORIES_AR.find(c => c.id === formData.category) || CATEGORIES_AR[0];

  const handlePublish = () => {
    setIsPublished(true);
    if (onSubmit) {
      onSubmit({
        ...formData,
        categoryName: currentCategory.name,
      });
    }
  };

  const handleFinish = () => {
    setIsPublished(false);
    setActiveStep(0);
    onClose();
  };

  const imageSrc = imageLoadFailed ? DEFAULT_PHONE_IMAGE_SVG : (formData.image || DEFAULT_PHONE_IMAGE_SVG);

  return (
    <div 
      className="absolute inset-0 bg-slate-950/65 backdrop-blur-[3px] z-[1100] flex flex-col justify-end animate-in fade-in duration-200"
      dir="rtl"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="w-full max-h-[90%] bg-white rounded-t-[26px] shadow-2xl flex flex-col overflow-hidden border-t border-slate-200/80 animate-in slide-in-from-bottom-8 duration-300"
        style={{ fontFamily: "'Cairo', 'Plus Jakarta Sans', sans-serif" }}
      >
        {/* Sheet Grab Handle */}
        <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto my-2.5 shrink-0" />

        {/* Sheet Header */}
        <div className="px-5 py-2.5 flex items-center justify-between border-b border-slate-100 shrink-0">
          <div>
            <h3 className="text-base font-bold text-slate-900 leading-tight">
              {isPublished ? 'تم النشر بنجاح 🎉' : 'إضافة إعلان جديد'}
            </h3>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {!isPublished ? `الخطوة ${activeStep + 1} من 4: ${
                activeStep === 0 ? 'نوع الغرض والقسم' :
                activeStep === 1 ? 'المكان والتاريخ' :
                activeStep === 2 ? 'صورة الغرض' : 'المراجعة والنشر'
              }` : 'إعلانك معروض الآن على رادار مفقودات'}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isPublished && (
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-[11px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 transition-colors"
                title="تعبئة بيانات تجريبية سريعة"
              >
                ⚡ تعبئة
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 text-sm transition-colors"
              aria-label="إغلاق النافذة"
            >
              ✕
            </button>
          </div>
        </div>

        {/* 4-Step Horizontal Progress Indicator */}
        {!isPublished && (
          <div className="px-5 pt-3 pb-1 shrink-0">
            <div className="flex items-center gap-1.5">
              {[0, 1, 2, 3].map((stepIdx) => {
                const isPassed = stepIdx <= activeStep;
                const isCurrent = stepIdx === activeStep;
                return (
                  <div key={stepIdx} className="flex-1 flex flex-col gap-1">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        isPassed 
                          ? isCurrent ? 'bg-blue-600 ring-2 ring-blue-200' : 'bg-emerald-500'
                          : 'bg-slate-200'
                      }`}
                    />
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium px-0.5">
                      <span className={isPassed ? 'text-blue-700 font-bold' : ''}>
                        {stepIdx === 0 ? 'الغرض' : stepIdx === 1 ? 'المكان' : stepIdx === 2 ? 'الصورة' : 'النشر'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Scrollable Body (Zero horizontal overflow) */}
        <div className="px-5 py-3 overflow-y-auto overflow-x-hidden flex-1 space-y-3.5">
          {/* FINAL RESULT VIEW */}
          {isPublished ? (
            <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
              {/* Green Success Banner */}
              <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-bold shadow-xs">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shrink-0">
                  ✓
                </span>
                <span>تم نشر إعلانك بنجاح وهو الآن متاح للجميع في مدينتك!</span>
              </div>

              {/* Published Item Card Preview */}
              <div className="border border-slate-200 bg-white rounded-xl p-3.5 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold ${
                    formData.type === 'LOST' 
                      ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                      : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  }`}>
                    {formData.type === 'LOST' ? '● مفقود' : '● تم العثور عليه'}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">اليوم · 20 أكتوبر 2026</span>
                </div>

                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 leading-snug">
                    {formData.title || mockSampleDataAr.title}
                  </h4>
                  <div className="text-[12px] text-slate-600 flex items-center gap-1 mt-1 font-semibold">
                    <span>📍</span>
                    <span>{formData.city}</span>
                    {formData.exactLocation && (
                      <span className="text-slate-400 font-normal">· {formData.exactLocation}</span>
                    )}
                  </div>
                </div>

                <p className="text-[12px] text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {formData.description || mockSampleDataAr.description}
                </p>

                {/* Photo Preview Container with Resilient Fallback */}
                <div className="w-full h-36 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 relative">
                  <img
                    src={imageSrc}
                    alt={formData.title}
                    onError={() => setImageLoadFailed(true)}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-md font-medium">
                    {currentCategory.icon} {currentCategory.name}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 border-t border-slate-100">
                  <span>👁️ 1 مشاهدة نشطة</span>
                  <span className="text-blue-600 font-semibold">⚡ جارٍ البحث في رادار الدار البيضاء</span>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* STEP 1: نوع الغرض والقسم */}
              {activeStep === 0 && (
                <div className="space-y-3.5">
                  {/* Dual Toggle */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      هل فقدتَ شيئاً أم وجدته؟ *
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, type: 'LOST' })}
                        className={`p-2.5 rounded-xl border text-right flex items-center gap-2.5 transition-all ${
                          formData.type === 'LOST'
                            ? 'bg-rose-50 border-rose-400 text-rose-700 ring-2 ring-rose-200/80 shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span className="text-xl">🔍</span>
                        <div>
                          <div className="font-extrabold text-xs">فقدتُ</div>
                          <div className="text-[10px] opacity-75">أبحث عن غرضي الضائع</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, type: 'FOUND' })}
                        className={`p-2.5 rounded-xl border text-right flex items-center gap-2.5 transition-all ${
                          formData.type === 'FOUND'
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-700 ring-2 ring-emerald-200/80 shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span className="text-xl">🎁</span>
                        <div>
                          <div className="font-extrabold text-xs">وجدتُ</div>
                          <div className="text-[10px] opacity-75">عثرت على شيء لشخص</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* 8 Category Tiles Grid (4 columns, zero horizontal overflow) */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-800">
                        اختر القسم *
                      </label>
                      <span className="text-[10px] text-blue-600 font-semibold">
                        المحدد: {currentCategory.name}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-1.5">
                      {CATEGORIES_AR.map((cat) => {
                        const isSelected = formData.category === cat.id;
                        return (
                          <button
                            type="button"
                            key={cat.id}
                            onClick={() => setFormData({ ...formData, category: cat.id })}
                            className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                              isSelected
                                ? 'border-blue-500 bg-blue-50/80 text-blue-700 ring-1 ring-blue-300 font-bold shadow-2xs'
                                : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:border-slate-300 font-medium'
                            }`}
                          >
                            <span className="text-lg leading-none">{cat.icon}</span>
                            <span className="text-[11px] truncate w-full text-center">{cat.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Title Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      اسم الغرض أو مواصفاته *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="مثال: آيفون 13 برو ماكس (أزرق)"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: المكان والتاريخ */}
              {activeStep === 1 && (
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      المدينة والمكان *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="مثال: الدار البيضاء (موروكو مول)"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    {/* Quick City suggestions */}
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {['موروكو مول', 'المعاريف', 'الرباط أكدال', 'مراكش جيليز'].map((quick) => (
                        <button
                          key={quick}
                          type="button"
                          onClick={() => setFormData({ ...formData, city: `الدار البيضاء (${quick})` })}
                          className="text-[10px] bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200 transition-colors"
                        >
                          📍 {quick}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      المكان المحدد بدقة
                    </label>
                    <input
                      type="text"
                      value={formData.exactLocation}
                      onChange={(e) => setFormData({ ...formData, exactLocation: e.target.value })}
                      placeholder="مثال: الطابق الأرضي، قرب مقهى ستاربكس"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      تاريخ الفقدان أو العثور *
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      الوصف وتفاصيل إضافية
                    </label>
                    <textarea
                      rows={2}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="أدخل أي علامات فارقة أو ألوان أو خدوش تميز الغرض..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: الصورة */}
              {activeStep === 2 && (
                <div className="space-y-3.5">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      صورة الغرض *
                    </label>

                    <div
                      onClick={() => {
                        if (!formData.hasImage) {
                          setFormData({ ...formData, hasImage: true, image: mockSampleDataAr.image });
                          setImageLoadFailed(false);
                        } else {
                          fileInputRef.current?.click();
                        }
                      }}
                      className="border-2 border-dashed border-slate-300 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/20 rounded-2xl p-3.5 text-center cursor-pointer transition-colors"
                    >
                      {formData.hasImage ? (
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-lg overflow-hidden border border-slate-200 bg-white shrink-0">
                              <img
                                src={imageSrc}
                                alt="Item thumbnail"
                                onError={() => setImageLoadFailed(true)}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="text-right">
                              <div className="text-xs font-bold text-slate-900">iphone_photo_casablanca.jpg</div>
                              <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                                ✓ تم تجهيز الصورة بنجاح
                              </div>
                              <div className="text-[10px] text-blue-600 mt-0.5">
                                اضغط لتغيير الصورة من الملفات
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFormData({ ...formData, hasImage: false });
                            }}
                            className="text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg hover:bg-rose-100 transition-colors"
                          >
                            إزالة
                          </button>
                        </div>
                      ) : (
                        <div className="py-2 space-y-1">
                          <div className="text-2xl">📷</div>
                          <div className="text-xs font-bold text-slate-800">
                            اضغط لرفع صورة من هاتفك أو إرفاق صورة تجريبية
                          </div>
                          <div className="text-[10px] text-slate-500">
                            يدعم PNG و JPG أو WebP (يساعد في التعرف السريع بنسبة 85%)
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Face Privacy Redaction */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div>
                      <div className="font-bold text-slate-900">🛡️ تعتيم الوجوه تلقائياً</div>
                      <div className="text-[10px] text-slate-500">حماية الخصوصية في حال احتوت الصورة على أشخاص</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.facePrivacy}
                      onChange={(e) => setFormData({ ...formData, facePrivacy: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* STEP 4: المراجعة */}
              {activeStep === 3 && (
                <div className="space-y-3.5">
                  <div className="bg-slate-50 rounded-xl border border-slate-200 p-3.5 space-y-2 text-xs">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-200/60">
                      <span className="text-slate-500">نوع الإعلان:</span>
                      <strong className={formData.type === 'LOST' ? 'text-rose-600' : 'text-emerald-600'}>
                        {formData.type === 'LOST' ? '🔍 فقدتُ غرضاً' : '🎁 وجدتُ غرضاً'}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between pb-1 border-b border-slate-200/60">
                      <span className="text-slate-500">الغرض والقسم:</span>
                      <strong className="text-slate-900">{formData.title} ({currentCategory.name})</strong>
                    </div>

                    <div className="flex items-center justify-between pb-1 border-b border-slate-200/60">
                      <span className="text-slate-500">الموقع:</span>
                      <span className="text-slate-800 font-medium">{formData.city}</span>
                    </div>

                    <div className="flex items-center justify-between pb-1 border-b border-slate-200/60">
                      <span className="text-slate-500">التاريخ:</span>
                      <span className="text-slate-800 font-medium">{formData.date}</span>
                    </div>

                    {formData.hasImage && (
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-slate-500">الصورة المرفقة:</span>
                        <div className="w-9 h-9 rounded-md overflow-hidden border border-slate-300">
                          <img 
                            src={imageSrc} 
                            alt="preview thumb" 
                            onError={() => setImageLoadFailed(true)}
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-500 text-center leading-relaxed">
                    بالنقر على نشر الإعلان، سيتم إتاحته فوراً على منصة مفقودات وتنبيه أعضاء المجتمع في محيطك الجغرافي.
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Sheet Footer Controls */}
        <div className="px-5 py-3 border-t border-slate-100 bg-white flex items-center gap-2.5 shrink-0">
          {isPublished ? (
            <button
              type="button"
              onClick={handleFinish}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
            >
              إتمام وعرض في المنصة ✓
            </button>
          ) : (
            <>
              {activeStep > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveStep(activeStep - 1)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                >
                  السابق
                </button>
              )}

              {activeStep < 3 ? (
                <button
                  type="button"
                  onClick={() => setActiveStep(activeStep + 1)}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                >
                  التالي ←
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePublish}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                >
                  نشر الإعلان الآن 🚀
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
