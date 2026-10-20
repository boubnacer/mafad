/**
 * Assets and seed data for the Jewelry / Necklace in Marrakech showcase.
 */

// High quality vector SVG representation of a luxury Moroccan filigree gold necklace with a turquoise gem
export const GOLD_NECKLACE_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450" fill="none">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="%231E1B4B"/>
      <stop offset="100%" stop-color="%230F0D24"/>
    </radialGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%23FDE047"/>
      <stop offset="35%" stop-color="%23EAB308"/>
      <stop offset="70%" stop-color="%23CA8A04"/>
      <stop offset="100%" stop-color="%23FEF08A"/>
    </linearGradient>
    <linearGradient id="turqGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%232DD4BF"/>
      <stop offset="60%" stop-color="%230D9488"/>
      <stop offset="100%" stop-color="%23115E59"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Velvet Background -->
  <rect width="600" height="450" fill="url(%23bgGrad)"/>
  
  <!-- Subtle lighting vignette -->
  <circle cx="300" cy="225" r="180" fill="%23EAB308" opacity="0.08" filter="url(%23glow)"/>

  <!-- Golden Chain loops -->
  <path d="M160 50 C180 180, 240 250, 300 250 C360 250, 420 180, 440 50" stroke="url(%23goldGrad)" stroke-width="4.5" stroke-linecap="round" fill="none" stroke-dasharray="6,4"/>
  <path d="M190 50 C210 160, 255 215, 300 215 C345 215, 390 160, 410 50" stroke="url(%23goldGrad)" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.85"/>

  <!-- Moroccan Pendant connector ring -->
  <circle cx="300" cy="250" r="14" stroke="url(%23goldGrad)" stroke-width="4" fill="none"/>

  <!-- Ornate Filigree Pendant Body -->
  <g transform="translate(300, 290)">
    <!-- Outer Filigree Teardrop -->
    <path d="M0 -35 C35 -5, 55 25, 45 60 C35 95, -35 95, -45 60 C-55 25, -35 -5, 0 -35 Z" fill="url(%23goldGrad)" stroke="%23CA8A04" stroke-width="2" filter="url(%23glow)"/>
    
    <!-- Inner Carved Geometric Pattern -->
    <path d="M0 -20 C22 2, 34 26, 28 48 C22 70, -22 70, -28 48 C-34 26, -22 2, 0 -20 Z" fill="%230F0D24" stroke="url(%23goldGrad)" stroke-width="1.8"/>
    
    <!-- Central Moroccan Turquoise Stone -->
    <ellipse cx="0" cy="30" rx="15" ry="20" fill="url(%23turqGrad)" stroke="url(%23goldGrad)" stroke-width="2.5"/>
    <ellipse cx="-4" cy="22" rx="4" ry="6" fill="%23CCFBF1" opacity="0.7"/>

    <!-- Small Hanging Pearls / Gold droplets -->
    <circle cx="0" cy="85" r="6" fill="url(%23goldGrad)"/>
    <circle cx="-25" cy="70" r="4.5" fill="url(%23goldGrad)"/>
    <circle cx="25" cy="70" r="4.5" fill="url(%23goldGrad)"/>
  </g>

  <!-- Tag / Watermark text -->
  <rect x="20" y="395" width="220" height="35" rx="10" fill="%23000000" opacity="0.6"/>
  <text x="32" y="418" fill="%23FDE047" font-family="'Cairo', sans-serif" font-size="13" font-weight="bold">💎 عقد ذهبي مرصع · مراكش</text>
</svg>`;

export const HIGH_RES_NECKLACE_URL = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80';

export const SHOWCASE_JEWELRY_DATA = {
  type: 'LOST' as const,
  category: 'jewelry',
  categoryNameAr: 'مجوهرات وحلي',
  categoryIcon: '💎',
  title: 'عقد ذهبي مرصع (Golden Necklace)',
  city: 'مراكش (Marrakech)',
  exactLocation: 'سوق السمارين، قرب ساحة جامع الفنا',
  date: '2026-10-18',
  description: 'عقد ذهبي مغربي أصيل عيار 18، نقش تقليدي يدوي مع حجر فيروزي أزرق، فُقد أثناء التجول بالسوق. مكافأة مجزية لمن يجده.',
  image: HIGH_RES_NECKLACE_URL,
  fallbackImage: GOLD_NECKLACE_SVG,
  fileName: 'necklace_marrakech_gold.jpg',
  fileSize: '1.4 MB',
};
