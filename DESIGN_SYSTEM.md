# Pinely Design System

Use this guide to apply the Pinely visual style to your project. The design is warm, cozy, and calming - a dark theme that feels inviting rather than cold.

---

## Philosophy

- **Warm, not cold** - Dark theme with brown/warm undertones, not blue/gray
- **Cozy and calm** - Generous spacing, soft corners, gentle transitions
- **Non-judgmental** - Inviting copy, subtle interactions, forgiving UI
- **Focused** - Minimal distractions, clear hierarchy

---

## Color Palette

### Background Colors (Night)
Dark, warm browns for backgrounds:

| Token | Hex | Usage |
|-------|-----|-------|
| `night-50` | `#2A2523` | Lightest background |
| `night-100` | `#231F1D` | Light background |
| `night-200` | `#1C1917` | **Main background** |
| `night-300` | `#171412` | Dark background |
| `night-400` | `#12100E` | Darker background |
| `night-500` | `#0D0B0A` | Darkest background |

### Surface Colors
For cards, inputs, and elevated elements:

| Token | Hex | Usage |
|-------|-----|-------|
| `surface-light` | `#3D3633` | Hover states, scrollbar |
| `surface` | `#322C29` | Cards, inputs |
| `surface-dark` | `#2A2523` | Pressed states |

### Text Colors (Cream)
Warm off-white for text:

| Token | Hex | Usage |
|-------|-----|-------|
| `cream-light` | `#F5EDE4` | Brightest text, selection |
| `cream` | `#E8DED2` | **Primary text** |
| `cream-dark` | `#C4B8A9` | Secondary text |
| `cream-muted` | `#A89B8B` | Muted text, placeholders |

### Accent Colors (Sage)
Muted green for primary actions:

| Token | Hex | Usage |
|-------|-----|-------|
| `sage-light` | `#B8C4A8` | Light accent |
| `sage` | `#8FA47B` | **Primary buttons, focus rings** |
| `sage-dark` | `#6B8256` | Hover states, selection bg |

### Secondary Accent (Ember)
Warm orange for secondary highlights:

| Token | Hex | Usage |
|-------|-----|-------|
| `ember-light` | `#D4A574` | Light ember |
| `ember` | `#C4956A` | Secondary accent |
| `ember-dark` | `#A67B52` | Dark ember |

---

## Typography

### Fonts
- **Sans-serif**: Inter (body text, UI elements)
- **Serif**: Newsreader (headings, emphasis)

### Font Setup (Next.js)
```tsx
import { Inter, Newsreader } from "next/font/google";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});
```

### Usage
- Headings: `font-serif` (Newsreader)
- Body/UI: `font-sans` (Inter)
- Use `antialiased` on body for smoother rendering

---

## Spacing & Layout

### Border Radius
Generous, soft corners:

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-xl` | `1rem` | Small elements |
| `rounded-2xl` | `1.5rem` | Buttons, inputs |
| `rounded-3xl` | `2rem` | Cards, containers |

### Custom Spacing
```
spacing-18: 4.5rem
spacing-22: 5.5rem
```

### Layout Principles
- Center content with `max-w-2xl mx-auto`
- Generous padding: `p-6` to `p-8`
- Stack with `gap-4` to `gap-6`

---

## Components

### Buttons

Three variants with consistent styling:

```tsx
// Primary - sage green, for main actions
className="bg-sage text-night-200 hover:bg-sage-dark active:scale-[0.98] shadow-sm hover:shadow-md rounded-2xl px-6 py-3"

// Secondary - subtle surface color
className="bg-surface-light text-cream hover:bg-surface active:scale-[0.98] rounded-2xl px-6 py-3"

// Ghost - minimal, text only
className="text-cream-muted hover:text-cream hover:bg-surface rounded-2xl px-6 py-3"
```

### Sizes
- `sm`: `px-4 py-2 text-sm`
- `md`: `px-6 py-3 text-base`
- `lg`: `px-8 py-4 text-lg`

### Cards
```tsx
className="bg-surface rounded-3xl p-6 hover:bg-surface-light transition-colors"
```

### Inputs / Textareas
```tsx
className="w-full bg-surface rounded-2xl p-4 text-cream placeholder:text-cream-muted/70 border-none focus:ring-2 focus:ring-sage"
```

---

## Interactive States

### Transitions
Use smooth, gentle transitions:
```
transition-all duration-300 ease-out
```

### Hover
- Buttons: slight color shift + shadow increase
- Cards: background lightens to `surface-light`
- Text: muted to full cream

### Active/Pressed
```
active:scale-[0.98]
```

### Focus
Sage-colored focus ring:
```
focus-visible:outline-none
focus-visible:ring-2
focus-visible:ring-sage
focus-visible:ring-offset-2
focus-visible:ring-offset-night-200
```

### Disabled
```
disabled:opacity-50 disabled:cursor-not-allowed
```

---

## Global Styles

Add to your `globals.css`:

```css
:root {
  --background: #1C1917;
  --foreground: #E8DED2;
  --muted: #A89B8B;
  --accent: #8FA47B;
}

body {
  background: var(--background);
  color: var(--foreground);
}

/* Warm scrollbar */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #3D3633;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #4A433F;
}

/* Focus states */
*:focus-visible {
  outline: 2px solid #8FA47B;
  outline-offset: 2px;
}

/* Placeholder styling */
textarea::placeholder,
input::placeholder {
  color: #A89B8B;
  opacity: 0.7;
}

/* Selection */
::selection {
  background: #6B8256;
  color: #F5EDE4;
}
```

---

## Tailwind Config

```ts
// tailwind.config.ts
const config = {
  theme: {
    extend: {
      colors: {
        night: {
          50: "#2A2523",
          100: "#231F1D",
          200: "#1C1917",
          300: "#171412",
          400: "#12100E",
          500: "#0D0B0A",
        },
        surface: {
          light: "#3D3633",
          DEFAULT: "#322C29",
          dark: "#2A2523",
        },
        cream: {
          light: "#F5EDE4",
          DEFAULT: "#E8DED2",
          dark: "#C4B8A9",
          muted: "#A89B8B",
        },
        sage: {
          light: "#B8C4A8",
          DEFAULT: "#8FA47B",
          dark: "#6B8256",
        },
        ember: {
          light: "#D4A574",
          DEFAULT: "#C4956A",
          dark: "#A67B52",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
    },
  },
};
```

---

## Animations (Framer Motion)

Use subtle, smooth animations:

```tsx
// Page transitions
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
>

// Staggered children
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};
```

---

## Quick Reference

| Element | Classes |
|---------|---------|
| Page background | `bg-night-200` |
| Card | `bg-surface rounded-3xl p-6` |
| Primary text | `text-cream` |
| Muted text | `text-cream-muted` |
| Primary button | `bg-sage text-night-200 rounded-2xl` |
| Heading | `font-serif text-2xl text-cream` |
| Input | `bg-surface text-cream rounded-2xl` |

---

## Summary

The Pinely style is defined by:
1. **Warm dark colors** - browns, not grays
2. **Soft, large corners** - `rounded-2xl` to `rounded-3xl`
3. **Muted sage green** accent - not bright or harsh
4. **Cream text** - warm off-white, not pure white
5. **Gentle transitions** - 300ms, ease-out
6. **Serif + sans combo** - Newsreader for headings, Inter for body
