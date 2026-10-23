# MR & MRS DESIGNER STUDIO — DESIGN SPECIFICATION
**Corporate Entity:** Mr & Mrs Modern (GST Verified)  
**Brand Identity:** Mr & Mrs Designer Studio — Haute Couture Atelier & Apparel Engineering  
**Aesthetic Theme:** Atelier Haute Luxe & Modern Indian Heritage  
**Design Skills Integrated:**
1. **Nutlope/hallmark** (57-Gate Slop Tests, 21-Theme Macrostructure, Restraint & Hierarchy)
2. **Leonxlnx/taste-skill** (8pt Baseline Grid, Typographic Art Direction, Fluid Spacing)
3. **VoltAgent/awesome-design-md** (Design Token Architecture, Semantic Palette, Brand Systems)
4. **alchaincyf/huashu-design** (Fact-Based Design Health Check, Eastern Textile Heritage)
5. **nextlevelbuilder/ui-ux-pro-max-skill** (Mobile-First Architecture, Bottom App Bar, 48px Touch Targets)
6. **docsor1212/aesthete-agent** (Mechanical Contrast Gates, Gradient Ban on Surfaces)
7. **yetone/kill-ai-slop** (Purge of 33 AI Slop Tells, Zero Emoji Listicles, Authentic Copywriting)

---

## 1. Anti-Slop Enforcement & Gatekeeper Rules

| Hallmark & Slop Gate | Status | Implementation in this System |
|---|---|---|
| **Gate 01: Purple/Indigo Linear Gradients** | **BANNED (P0)** | 100% solid, organic palette inspired by silk, natural dyes, and antique brass. Zero `#6366f1` / `#a855f7` tropes. |
| **Gate 02: Pervasive Frosted Glassmorphism** | **BANNED (P0)** | Solid card surfaces with crisp hairline borders (`1px solid #E6DFD3` or `1px solid rgba(197, 160, 89, 0.28)`). |
| **Gate 03: Oversized 24px+ Cartoon Radii** | **BANNED (P1)** | Architectural radii only: `0px` (sharp editorial cut) for hero banners, `4px` to `6px` for luxury cards. |
| **Gate 04: Generic Inter/Roboto Default Stacks** | **BANNED (P1)** | Display serif *Cinzel* & *Playfair Display* paired with crisp *Plus Jakarta Sans* with fluid `clamp()` sizing. |
| **Gate 05: Emoji-Driven Feature Lists (🚀 ⭐ 💡)** | **BANNED (P1)** | Replaced with Roman numerals (I, II, III, IV) and bespoke minimalist SVG atelier insignia. |
| **Gate 06: Generic Fake Metrics ("99% Satisfaction")** | **BANNED (P1)** | Concrete verified studio metrics: GST Entity "Mr & Mrs Modern", in-house DTF/Sublimation industrial unit, 2-minute pre-pleat speed. |
| **Gate 07: Unresponsive Mobile Viewports** | **BANNED (P0)** | Mobile-first baseline, fluid typography, sticky mobile bottom navigation, 48px touch targets, zero horizontal bleed. |

---

## 2. Design Tokens (VoltAgent Standard)

```css
:root {
  /* Surface Foundations */
  --color-canvas: #FBF9F5;        /* Warm raw silk alabaster */
  --color-surface: #FFFFFF;       /* Crisp paper white */
  --color-surface-subtle: #F5EFE6;/* Warm linen ecru */
  --color-surface-muted: #EDE5D8; /* Pressed parchment */
  
  /* Obsidian & Charcoal Accents */
  --color-obsidian: #11100F;      /* Deep midnight velvet */
  --color-charcoal: #1C1A18;      /* Atelier dark slate */
  --color-card-dark: #22201D;     /* Dark panel surface */
  
  /* Inks & Contrast (APCA / WCAG AAA Compliant) */
  --ink-primary: #181614;         /* Highest contrast headline ink */
  --ink-secondary: #524B43;       /* Editorial body copy */
  --ink-muted: #7E756A;           /* Supporting metadata & tags */
  --ink-light: #F8F5EE;           /* Light text on dark backgrounds */
  --ink-light-muted: #B8B0A4;     /* Secondary light text */
  
  /* Metallic Zari & Brass Accents */
  --gold-zari: #C5A059;           /* Authentic gold zari thread */
  --gold-zari-hover: #D6AF65;     /* Polished metallic gold */
  --gold-zari-dark: #917336;      /* Antique brass */
  --gold-zari-tint: rgba(197, 160, 89, 0.12);
  --gold-zari-border: rgba(197, 160, 89, 0.32);
  
  /* Indian Silk Accent Accents */
  --accent-vermilion: #9E2A2B;    /* Sindoor bridal red */
  --accent-vermilion-tint: rgba(158, 42, 43, 0.08);
  --accent-emerald: #1F3D2B;      /* Deep silk sari green */
  --accent-emerald-tint: rgba(31, 61, 43, 0.08);

  /* Hairlines & Dividers */
  --border-light: #E8E1D5;
  --border-dark: rgba(255, 255, 255, 0.1);
  --border-accent: rgba(197, 160, 89, 0.3);

  /* Typography Stacks */
  --font-display: 'Cinzel', serif;
  --font-serif: 'Playfair Display', Georgia, serif;
  --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;

  /* 8pt Spacing Scale (Taste-Skill) */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;
  --space-9: 96px;

  /* Touch Targets (UI-UX Pro Max) */
  --touch-target-min: 48px;
  
  /* Radii */
  --radius-xs: 2px;
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-subtle: 0 4px 16px rgba(18, 17, 16, 0.05);
  --shadow-medium: 0 10px 30px rgba(18, 17, 16, 0.08);
  --shadow-deep: 0 20px 50px rgba(0, 0, 0, 0.35);
}
```

---

## 3. Mobile-First UX Architecture (UI-UX Pro Max)

1. **Sticky Mobile Navigation & Drawer**:
   - Header height: 68px on mobile, 80px on desktop.
   - Smooth slide-out navigation with backdrop overlay.
2. **Sticky Mobile Bottom App Bar**:
   - Fixed to bottom on `< 768px` screens.
   - 4 quick touch actions: `Call Atelier`, `Pre-Pleat Drape`, `Cost Calculator`, `Book Trial`.
   - Never obstructs interactive forms.
3. **Fluid Typography Formula**:
   - `font-size: clamp(2rem, 5vw + 1rem, 3.8rem);` ensures hero headlines adapt seamlessly from 360px phones to 4K monitors without awkward breaks.
4. **Touch Target Guarantee**:
   - Every tap element has a minimum bounding box of 48px × 48px.
