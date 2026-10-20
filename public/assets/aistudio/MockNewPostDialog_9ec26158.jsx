import React, { useState } from 'react';

/**
 * MAFQOUDAT MOBILE AD SCENE & NEW POST FORM (ARABIC RTL)
 * 
 * Includes:
 * 1. Mobile Phone Mockup Frame (iPhone style with dynamic island and URL bar `mafqoudat.com`)
 * 2. Website Home Screen Background with the 2 prominent action buttons:
 *    - "هل فقدتَ شيئاً؟" (Lost something?)
 *    - "هل وجدتَ شيئاً؟" (Found something?)
 * 3. Mobile New Post Form Bottom Sheet (RTL Arabic, 4-step wizard, zero overflow)
 * 4. Post Published Card pay-off view.
 */

const CATEGORIES_AR = [
  { id: 'phones', name: 'هواتف', icon: '📱' },
  { id: 'wallets', name: 'محافظ', icon: '👛' },
  { id: 'keys', name: 'مفاتيح', icon: '🔑' },
  { id: 'docs', name: 'وثائق', icon: '🪪' },
  { id: 'bags', name: 'حقائب', icon: '🎒' },
  { id: 'pets', name: 'حيوانات', icon: '🐾' },
  { id: 'jewelry', name: 'ساعات', icon: '⌚' },
  { id: 'other', name: 'أخرى', icon: '📦' },
];

export const mockSampleDataAr = {
  type: 'LOST',
  category: 'phones',
  title: 'آيفون 13 برو ماكس (أزرق)',
  city: 'الدار البيضاء (موروكو مول)',
  exactLocation: 'الطابق الأرضي، قرب مقهى ستاربكس',
  date: '2026-10-20',
  description: 'فُقد حوالي الساعة 4:30 مساءً، عليه غطاء حماية أزرق مع خدش بسيط قرب الكاميرا.',
  image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&auto=format&fit=crop&q=80',
};

export default function MockMobileAdApp() {
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    type: 'LOST',
    category: 'phones',
    title: mockSampleDataAr.title,
    city: mockSampleDataAr.city,
    exactLocation: mockSampleDataAr.exactLocation,
    date: mockSampleDataAr.date,
    description: mockSampleDataAr.description,
    hasImage: true,
  });
  const [isPublished, setIsPublished] = useState(false);

  return (
    <div style={styles.outerCanvas} dir="rtl">
      {/* SMARTPHONE DEVICE CONTAINER */}
      <div style={styles.phoneFrame}>
        {/* Dynamic Island */}
        <div style={styles.dynamicIsland} />

        {/* Mobile Browser Top Bar */}
        <div style={styles.browserBar}>
          <div style={styles.urlPill}>
            <span>🔒</span>
            <span style={{ direction: 'ltr' }}>mafqoudat.com</span>
          </div>
        </div>

        {/* WEBSITE HOME PAGE IN THE BACKGROUND */}
        <div style={styles.homeBackground}>
          {/* Mobile Nav */}
          <div style={styles.homeNav}>
            <div style={styles.brandLogo}>
              <span>🔍</span>
              <span>مفقودات</span>
            </div>
            <span style={styles.langBadge}>العربية</span>
          </div>

          {/* Hero Pitch */}
          <div style={styles.homeHero}>
            <h1 style={styles.heroHeading}>هل أضعت شيئاً في مدينتك؟</h1>
            <p style={styles.heroSub}>المنصة الأولى الموثوقة للإبلاغ عن المفقودات والموجودات بسهولة وسرعة.</p>
          </div>

          {/* The 2 Main Action Buttons Mentioned in the Ad */}
          <div style={styles.actionButtonsArea}>
            <button
              type="button"
              onClick={() => { setFormData({ ...formData, type: 'LOST' }); setIsDialogOpen(true); setIsPublished(false); }}
              style={{ ...styles.bigActionBtn, ...styles.lostGradient }}
            >
              <div>
                <div style={styles.actionBtnTitle}>هل فقدتَ شيئاً؟</div>
                <div style={styles.actionBtnSub}>انشر مواصفات غرضك الآن</div>
              </div>
              <span style={{ fontSize: '26px' }}>🔍</span>
            </button>

            <button
              type="button"
              onClick={() => { setFormData({ ...formData, type: 'FOUND' }); setIsDialogOpen(true); setIsPublished(false); }}
              style={{ ...styles.bigActionBtn, ...styles.foundGradient }}
            >
              <div>
                <div style={styles.actionBtnTitle}>هل وجدتَ شيئاً؟</div>
                <div style={styles.actionBtnSub}>ساعد صاحبه في العثور عليه</div>
              </div>
              <span style={{ fontSize: '26px' }}>🎁</span>
            </button>
          </div>
        </div>

        {/* DIALOG OVERLAY (BOTTOM SHEET / MODAL) */}
        {isDialogOpen && (
          <div style={styles.dialogOverlay}>
            <div style={styles.bottomSheet}>
              {/* Sheet Grabber */}
              <div style={styles.sheetHandle} />

              {/* Sheet Header */}
              <div style={styles.sheetHeader}>
                <div>
                  <h3 style={styles.sheetTitle}>
                    {isPublished ? 'تم النشر بنجاح' : 'إضافة إعلان جديد'}
                  </h3>
                  <div style={styles.stepSubtitle}>
                    {!isPublished && `الخطوة ${activeStep + 1} من 4`}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  style={styles.closeBtn}
                >
                  ✕
                </button>
              </div>

              {/* Progress Steps Indicator */}
              {!isPublished && (
                <div style={styles.stepIndicatorRow}>
                  {[0, 1, 2, 3].map((stepIdx) => (
                    <div
                      key={stepIdx}
                      style={{
                        ...styles.stepBar,
                        backgroundColor: stepIdx <= activeStep ? '#1A73E8' : '#E2E8F0',
                      }}
                    />
                  ))}
                </div>
              )}

              {/* SHEET BODY */}
              <div style={styles.sheetBody}>
                {/* 1. FINAL RESULT VIEW */}
                {isPublished ? (
                  <div style={styles.successWrapper}>
                    <div style={styles.successBanner}>
                      <span style={{ fontSize: '20px' }}>✓</span>
                      <span>تم نشر إعلانك وهو الآن متاح للجميع!</span>
                    </div>

                    <div style={styles.publishedCard}>
                      <span style={{
                        ...styles.typeTag,
                        backgroundColor: formData.type === 'LOST' ? '#FEE2E2' : '#ECFDF5',
                        color: formData.type === 'LOST' ? '#DC2626' : '#059669',
                      }}>
                        {formData.type === 'LOST' ? '● مفقود' : '● تم العثور عليه'}
                      </span>
                      <h4 style={{ margin: '6px 0', fontSize: '16px', color: '#0F172A' }}>{formData.title}</h4>
                      <div style={{ fontSize: '12px', color: '#64748B' }}>📍 {formData.city}</div>
                      <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.4, margin: '6px 0' }}>{formData.description}</p>
                      <img src={mockSampleDataAr.image} alt="Preview" style={styles.cardImage} />
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsDialogOpen(false)}
                      style={styles.primaryMobileBtn}
                    >
                      إتمام
                    </button>
                  </div>
                ) : (
                  <>
                    {/* STEP 1: Type & Category */}
                    {activeStep === 0 && (
                      <div style={styles.stepContent}>
                        {/* Type toggle */}
                        <div>
                          <label style={styles.fieldLabel}>هل فقدتَ شيئاً أم وجدته؟ *</label>
                          <div style={styles.dualToggle}>
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, type: 'LOST' })}
                              style={{
                                ...styles.toggleCard,
                                ...(formData.type === 'LOST' ? styles.toggleCardLost : {})
                              }}
                            >
                              <span style={{ fontSize: '18px' }}>🔍</span>
                              <div>
                                <div style={{ fontWeight: 700, fontSize: '13px' }}>فقدتُ</div>
                                <div style={{ fontSize: '10px', color: '#64748B' }}>أبحث عن غرض</div>
                              </div>
                            </button>

                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, type: 'FOUND' })}
                              style={{
                                ...styles.toggleCard,
                                ...(formData.type === 'FOUND' ? styles.toggleCardFound : {})
                              }}
                            >
                              <span style={{ fontSize: '18px' }}>🎁</span>
                              <div>
                                <div style={{ fontWeight: 700, fontSize: '13px' }}>وجدتُ</div>
                                <div style={{ fontSize: '10px', color: '#64748B' }}>عثرت على شيء</div>
                              </div>
                            </button>
                          </div>
                        </div>

                        {/* Category Grid */}
                        <div>
                          <label style={styles.fieldLabel}>اختر القسم *</label>
                          <div style={styles.categoryGridMobile}>
                            {CATEGORIES_AR.map((cat) => {
                              const isSelected = formData.category === cat.id;
                              return (
                                <button
                                  type="button"
                                  key={cat.id}
                                  onClick={() => setFormData({ ...formData, category: cat.id })}
                                  style={{
                                    ...styles.categoryTile,
                                    borderColor: isSelected ? '#1A73E8' : '#E2E8F0',
                                    backgroundColor: isSelected ? 'rgba(26, 115, 232, 0.08)' : '#FAFAFA',
                                    color: isSelected ? '#1A73E8' : '#334155',
                                  }}
                                >
                                  <span style={{ fontSize: '18px' }}>{cat.icon}</span>
                                  <span style={{ fontSize: '11px', fontWeight: isSelected ? 700 : 500 }}>
                                    {cat.name}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Title input */}
                        <div>
                          <label style={styles.fieldLabel}>اسم الغرض أو مواصفاته *</label>
                          <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="مثال: هاتف آيفون 13 برو ماكس"
                            style={styles.mobileInput}
                          />
                        </div>
                      </div>
                    )}

                    {/* STEP 2: Location & Date */}
                    {activeStep === 1 && (
                      <div style={styles.stepContent}>
                        <div>
                          <label style={styles.fieldLabel}>المدينة والمكان *</label>
                          <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            placeholder="مثال: الدار البيضاء (موروكو مول)"
                            style={styles.mobileInput}
                          />
                        </div>

                        <div>
                          <label style={styles.fieldLabel}>المكان المحدد بدقة</label>
                          <input
                            type="text"
                            value={formData.exactLocation}
                            onChange={(e) => setFormData({ ...formData, exactLocation: e.target.value })}
                            placeholder="مثال: الطابق الأرضي قرب ستاربكس"
                            style={styles.mobileInput}
                          />
                        </div>

                        <div>
                          <label style={styles.fieldLabel}>تاريخ الفقدان أو العثور *</label>
                          <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            style={styles.mobileInput}
                          />
                        </div>

                        <div>
                          <label style={styles.fieldLabel}>الوصف وتفاصيل إضافية</label>
                          <textarea
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="أدخل أي علامات فارقة أو ألوان..."
                            style={styles.mobileTextarea}
                          />
                        </div>
                      </div>
                    )}

                    {/* STEP 3: Photo */}
                    {activeStep === 2 && (
                      <div style={styles.stepContent}>
                        <label style={styles.fieldLabel}>صورة الغرض</label>
                        <div
                          style={styles.photoUploadArea}
                          onClick={() => setFormData({ ...formData, hasImage: !formData.hasImage })}
                        >
                          {formData.hasImage ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
                              <img src={mockSampleDataAr.image} alt="Upload" style={styles.thumbImage} />
                              <div>
                                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>iphone_photo.jpg</div>
                                <div style={{ fontSize: '11px', color: '#059669' }}>✓ تم رفع الصورة بنجاح</div>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div style={{ fontSize: '28px' }}>📷</div>
                              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>اضغط لرفع صورة</div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* STEP 4: Review */}
                    {activeStep === 3 && (
                      <div style={styles.stepContent}>
                        <div style={styles.reviewBox}>
                          <div style={styles.reviewItem}>
                            <span style={{ color: '#64748B' }}>نوع الإعلان:</span>
                            <strong style={{ color: formData.type === 'LOST' ? '#DC2626' : '#059669' }}>
                              {formData.type === 'LOST' ? 'فقدتُ غرضاً' : 'وجدتُ غرضاً'}
                            </strong>
                          </div>
                          <div style={styles.reviewItem}>
                            <span style={{ color: '#64748B' }}>الغرض:</span>
                            <strong>{formData.title}</strong>
                          </div>
                          <div style={styles.reviewItem}>
                            <span style={{ color: '#64748B' }}>الموقع:</span>
                            <span>{formData.city}</span>
                          </div>
                          <div style={styles.reviewItem}>
                            <span style={{ color: '#64748B' }}>التاريخ:</span>
                            <span>{formData.date}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* SHEET FOOTER CONTROLS */}
              {!isPublished && (
                <div style={styles.sheetFooter}>
                  {activeStep > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveStep(activeStep - 1)}
                      style={styles.backMobileBtn}
                    >
                      السابق
                    </button>
                  )}

                  {activeStep < 3 ? (
                    <button
                      type="button"
                      onClick={() => setActiveStep(activeStep + 1)}
                      style={styles.primaryMobileBtn}
                    >
                      التالي ←
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsPublished(true)}
                      style={styles.publishMobileBtn}
                    >
                      نشر الإعلان الآن 🚀
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  outerCanvas: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#0F172A',
    padding: '20px',
    fontFamily: "'Cairo', 'Plus Jakarta Sans', sans-serif",
  },
  phoneFrame: {
    width: '390px',
    height: '820px',
    backgroundColor: '#FFFFFF',
    borderRadius: '46px',
    boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.6), 0 0 0 10px #1E293B, 0 0 0 12px #334155',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  dynamicIsland: {
    position: 'absolute',
    top: '10px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '110px',
    height: '28px',
    backgroundColor: '#000000',
    borderRadius: '20px',
    zIndex: 1000,
  },
  browserBar: {
    padding: '44px 16px 10px',
    backgroundColor: '#F8FAFC',
    borderBottom: '1px solid #E2E8F0',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    zIndex: 900,
    direction: 'ltr',
  },
  urlPill: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    border: '1px solid #CBD5E1',
    borderRadius: '20px',
    padding: '6px 12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    fontSize: '13px',
    fontWeight: 600,
    color: '#0F172A',
    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
  },
  homeBackground: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(180deg, #F0F6FF 0%, #FFFFFF 100%)',
    position: 'relative',
    overflow: 'hidden',
  },
  homeNav: {
    padding: '14px 18px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandLogo: {
    fontSize: '20px',
    fontWeight: 800,
    color: '#1A73E8',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  langBadge: {
    fontSize: '12px',
    color: '#64748B',
    fontWeight: 600,
    background: '#F1F5F9',
    padding: '4px 8px',
    borderRadius: '8px',
  },
  homeHero: {
    padding: '26px 20px 10px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
  },
  heroHeading: {
    fontSize: '24px',
    fontWeight: 800,
    color: '#0F172A',
    lineHeight: 1.3,
    margin: 0,
  },
  heroSub: {
    fontSize: '13px',
    color: '#64748B',
    lineHeight: 1.5,
    margin: 0,
  },
  actionButtonsArea: {
    width: '100%',
    padding: '24px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    marginTop: 'auto',
    marginBottom: '20px',
    boxSizing: 'border-box',
  },
  bigActionBtn: {
    width: '100%',
    padding: '16px 20px',
    borderRadius: '18px',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontFamily: 'inherit',
    cursor: 'pointer',
    boxShadow: '0 8px 20px -6px rgba(0,0,0,0.1)',
  },
  lostGradient: {
    background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
    color: '#FFFFFF',
  },
  foundGradient: {
    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    color: '#FFFFFF',
  },
  actionBtnTitle: {
    fontSize: '17px',
    fontWeight: 700,
  },
  actionBtnSub: {
    fontSize: '12px',
    opacity: 0.9,
    marginTop: '2px',
  },
  dialogOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    backdropFilter: 'blur(4px)',
    zIndex: 1100,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    width: '100%',
    maxHeight: '86%',
    backgroundColor: '#FFFFFF',
    borderRadius: '26px 26px 0 0',
    boxShadow: '0 -10px 40px rgba(0,0,0,0.25)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  sheetHandle: {
    width: '40px',
    height: '4px',
    backgroundColor: '#CBD5E1',
    borderRadius: '2px',
    margin: '10px auto 4px',
  },
  sheetHeader: {
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #F1F5F9',
  },
  sheetTitle: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#0F172A',
    margin: 0,
  },
  stepSubtitle: {
    fontSize: '11px',
    color: '#64748B',
    marginTop: '2px',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    color: '#94A3B8',
    cursor: 'pointer',
  },
  stepIndicatorRow: {
    display: 'flex',
    gap: '6px',
    padding: '8px 20px 4px',
  },
  stepBar: {
    flex: 1,
    height: '4px',
    borderRadius: '2px',
    transition: 'background-color 0.2s ease',
  },
  sheetBody: {
    padding: '14px 20px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  stepContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  fieldLabel: {
    fontSize: '12px',
    fontWeight: 700,
    color: '#334155',
    marginBottom: '6px',
    display: 'block',
  },
  dualToggle: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
  },
  toggleCard: {
    padding: '10px 12px',
    borderRadius: '12px',
    border: '1.5px solid #E2E8F0',
    backgroundColor: '#F8FAFC',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontFamily: 'inherit',
    cursor: 'pointer',
    textAlign: 'right',
  },
  toggleCardLost: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
    color: '#DC2626',
    boxShadow: '0 0 0 2px rgba(239, 68, 68, 0.15)',
  },
  toggleCardFound: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
    color: '#059669',
  },
  categoryGridMobile: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '6px',
  },
  categoryTile: {
    border: '1.5px solid #E2E8F0',
    borderRadius: '10px',
    padding: '8px 2px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
    fontFamily: 'inherit',
    cursor: 'pointer',
  },
  mobileInput: {
    width: '100%',
    padding: '9px 12px',
    borderRadius: '10px',
    border: '1.5px solid #E2E8F0',
    fontSize: '13px',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    outline: 'none',
  },
  mobileTextarea: {
    width: '100%',
    padding: '9px 12px',
    borderRadius: '10px',
    border: '1.5px solid #E2E8F0',
    fontSize: '13px',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    outline: 'none',
    resize: 'none',
  },
  photoUploadArea: {
    border: '2px dashed #CBD5E1',
    borderRadius: '12px',
    padding: '16px',
    backgroundColor: '#F8FAFC',
    textAlign: 'center',
    cursor: 'pointer',
  },
  thumbImage: {
    width: '50px',
    height: '50px',
    borderRadius: '8px',
    objectFit: 'cover',
  },
  reviewBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    fontSize: '13px',
  },
  reviewItem: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  sheetFooter: {
    padding: '12px 20px 20px',
    borderTop: '1px solid #F1F5F9',
    display: 'flex',
    gap: '10px',
    backgroundColor: '#FFFFFF',
  },
  primaryMobileBtn: {
    flex: 1,
    padding: '12px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: '#1A73E8',
    color: '#FFFFFF',
    fontSize: '14px',
    fontWeight: 700,
    fontFamily: 'inherit',
    cursor: 'pointer',
  },
  publishMobileBtn: {
    flex: 1,
    padding: '12px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: '#059669',
    color: '#FFFFFF',
    fontSize: '14px',
    fontWeight: 700,
    fontFamily: 'inherit',
    cursor: 'pointer',
  },
  backMobileBtn: {
    padding: '12px 18px',
    borderRadius: '12px',
    border: '1px solid #CBD5E1',
    backgroundColor: '#FFFFFF',
    color: '#475569',
    fontSize: '13px',
    fontWeight: 600,
    fontFamily: 'inherit',
    cursor: 'pointer',
  },
  successWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  successBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#ECFDF5',
    color: '#065F46',
    padding: '10px 14px',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: 600,
  },
  publishedCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    padding: '12px',
  },
  typeTag: {
    alignSelf: 'flex-start',
    padding: '3px 8px',
    borderRadius: '10px',
    fontSize: '11px',
    fontWeight: 700,
  },
  cardImage: {
    width: '100%',
    height: '140px',
    borderRadius: '8px',
    objectFit: 'cover',
    marginTop: '6px',
  },
};
