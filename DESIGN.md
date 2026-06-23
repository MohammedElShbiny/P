---
name: Core Systems Portfolio
colors:
  surface: '#051424'
  surface-dim: '#051424'
  surface-bright: '#2c3a4c'
  surface-container-lowest: '#010f1f'
  surface-container-low: '#0d1c2d'
  surface-container: '#122131'
  surface-container-high: '#1c2b3c'
  surface-container-highest: '#273647'
  on-surface: '#d4e4fa'
  on-surface-variant: '#c1c6d7'
  inverse-surface: '#d4e4fa'
  inverse-on-surface: '#233143'
  outline: '#8b90a0'
  outline-variant: '#414754'
  surface-tint: '#aec6ff'
  primary: '#aec6ff'
  on-primary: '#002e6b'
  primary-container: '#0070f3'
  on-primary-container: '#ffffff'
  inverse-primary: '#0059c5'
  secondary: '#4ae176'
  on-secondary: '#003915'
  secondary-container: '#00b954'
  on-secondary-container: '#004119'
  tertiary: '#c9beff'
  on-tertiary: '#30009b'
  tertiary-container: '#7759fb'
  on-tertiary-container: '#fffeff'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#aec6ff'
  on-primary-fixed: '#001a43'
  on-primary-fixed-variant: '#004397'
  secondary-fixed: '#6bff8f'
  secondary-fixed-dim: '#4ae176'
  on-secondary-fixed: '#002109'
  on-secondary-fixed-variant: '#005321'
  tertiary-fixed: '#e6deff'
  tertiary-fixed-dim: '#c9beff'
  on-tertiary-fixed: '#1b0063'
  on-tertiary-fixed-variant: '#4618ca'
  background: '#051424'
  on-background: '#d4e4fa'
  surface-variant: '#273647'
typography:
  display:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.5'
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 40px
  xl: 80px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  max-width: 1280px
---

## Brand & Style

The design system is engineered for a high-level systems and full-stack developer, emphasizing precision, performance, and technical mastery. It balances the "hacker" aesthetic of deep environments with the polished, corporate reliability required for high-stakes engineering roles.

The visual style is **Corporate / Modern** with a **Minimalist** foundation, borrowing elements of **Glassmorphism** for depth. It evokes a "terminal-to-production" feeling: rigorous, clean, and highly structured. The target audience includes technical recruiters, engineering managers, and potential clients who value organized code and robust architecture.

The UI should feel:

- **Precise:** Every pixel and line has a function.
- **Performant:** Transitions are swift; layout is lean.
- **Architectural:** Clear hierarchy and modularity.

## Colors

This design system utilizes a high-contrast palette optimized for code readability and professional brand alignment.

### Dark Mode (Primary)

- **Background:** Uses deep slate (`#0f172a`) to reduce eye strain and provide a canvas for vibrant accents.
- **Primary:** Neon blue (`#0070f3`) for calls to action and active states.
- **Secondary:** Success-oriented green (`#22c55e`) for Node.js integrations and uptime indicators.
- **Accent:** Deep purple (`#512bd4`) used sparingly for backend/system-level highlights.

### Light Mode

- **Background:** Pure white (`#ffffff`) for maximum clarity.
- **Surface:** Light gray strokes and backgrounds (`#f8fafc`) replace the deep slates.
- **Typography:** Deep navy or charcoal for high legibility.

## Typography

The typography strategy employs a "UI vs. Data" distinction. **Inter** provides a highly readable, neutral canvas for interface elements and long-form descriptions. **JetBrains Mono** is reserved for technical data, tech stack badges, and code snippets, signaling a developer-first environment.

### Hierarchy Rules

- Use **Display** for hero sections with tight letter spacing.
- Use **Code-MD** for any technical metadata or inline system paths.
- **RTL Support:** Typography maintains consistent line-heights and weight scales across English and Arabic. Ensure the monospace font supports basic Arabic numerals or falls back gracefully to Inter for text strings.

## Layout & Spacing

This design system uses a **12-column fluid grid** for desktop and a **4-column grid** for mobile.

### Grid Philosophy

- **Modular Blocks:** Content is housed in modular cards or sections separated by `lg` (40px) or `xl` (80px) vertical spacing.
- **Directional Agility:** Layouts must use logical properties (e.g., `margin-inline-start` instead of `margin-left`) to support seamless LTR/RTL switching.
- **Breakpoints:**
  - Mobile: < 640px (16px margin)
  - Tablet: 640px - 1024px (32px margin)
  - Desktop: > 1024px (Fixed max-width container at 1280px).

## Elevation & Depth

Depth is achieved through **Tonal Layers** and **Subtle Outlines** rather than heavy shadows, maintaining a technical, flat aesthetic.

- **Surface 0:** The main background color (Slate 950 / White).
- **Surface 1:** Elevated cards use a slightly lighter slate in dark mode or a subtle gray in light mode, with a 1px border (`#ffffff10` in dark, `#e2e8f0` in light).
- **Interactive Depth:** On hover, cards use a **Backdrop Blur** (12px) and a subtle glow from the primary color (low opacity) to indicate interactivity.
- **Admin States:** Editable regions are marked with a dashed border treatment to distinguish them from read-only production data.

## Shapes

The shape language is **Soft (0.25rem)**. This preserves a "precise" and "engineered" feeling while avoiding the harshness of sharp 90-degree angles.

- **Small elements (Badges/Chips):** Use 0.25rem (rounded).
- **Standard elements (Buttons/Inputs):** Use 0.5rem (rounded-lg).
- **Large elements (Cards/Modals):** Use 0.75rem (rounded-xl).
- **Toggles:** Theme and language switches utilize pill-shaped (full-round) containers for distinct visual metaphors.

## Components

### Buttons

- **Primary:** Solid `#0070f3` with white text. High-contrast hover with a slight scale effect.
- **Secondary:** Outlined with 1px stroke. In dark mode, use a subtle glow on hover.

### Project Cards

- **Header:** Title in `headline-md`, tech badges in `label-sm` using monospace.
- **Footer:** Direct links to GitHub/Live Demo using iconography and `code-md` labels.
- **Visuals:** Use a "window chrome" effect (browser dots) on image containers to reinforce the "Web Dev" theme.

### Pricing & Admin

- **Pricing Tables:** Utilize a vertical stack. Admin users see an "Edit" icon (top-right) and dashed borders around editable text strings.
- **Status Indicators:** Small circles using `secondary` (Node.js green) for "Live" and `neutral` for "Maintenance."

### Navigation & Toggles

- **Theme Switcher:** A dual-state toggle using a Sun/Moon icon.
- **Language Switcher:** A simple text toggle (EN/AR) that triggers a layout direction flip (`dir="rtl"`).

### Admin Dashboard Widgets

- **Stat Cards:** Large numbers in Inter Bold with a small sparkline background.
- **Message List:** Zebra-striped rows with `code-md` timestamps for a log-file appearance.
