# Reddit Marketing Tool - Design System

## 🎨 Brand Identity

### Core Philosophy
- **Premium & Modern**: Dark theme with vibrant accents
- **Consistency**: Every element follows the same spacing, sizing, and styling rules
- **Clarity**: Clear hierarchy and intuitive interactions
- **Personality**: Professional yet approachable, matching Aniruddh's voice

---

## 📐 Spacing System

### Standard Spacing Scale
```
4px   (0.5 rem) - xs    - Tight gaps, icon spacing
8px   (1 rem)   - sm    - Small gaps between related elements
12px  (1.5 rem) - base  - Default gap
16px  (2 rem)   - md    - Section spacing
24px  (3 rem)   - lg    - Card padding, major spacing
32px  (4 rem)   - xl    - Page section spacing
48px  (6 rem)   - 2xl   - Major section dividers
```

### Component Spacing Rules
- **Page Titles**: `mb-3` (12px) between title and subtitle
- **Page Header to Content**: `mb-8` (32px) 
- **Card Padding**: Always `p-6` (24px) - NEVER vary
- **Card Gaps in Grids**: Always `gap-6` (24px)
- **Form Field Spacing**: `space-y-5` (20px) between fields
- **Button Groups**: `gap-2` (8px) or `gap-3` (12px) for larger buttons

---

## 🔘 Buttons

### Primary Button
```tsx
className="btn-primary"
// Spec:
// - Height: h-11 (44px) for standard, h-9 (36px) for compact
// - Padding: px-6 py-3 (24px horizontal, 12px vertical)
// - Border radius: rounded-full (pill shape)
// - Font: font-semibold text-[15px]
// - Shadow: shadow-lg shadow-primary/25
```

### Secondary Button  
```tsx
className="btn-secondary"
// Spec:
// - Height: h-11 for standard, h-9 for compact
// - Padding: px-5 py-2.5
// - Border: 1px solid border
// - Border radius: rounded-full
// - Font: font-medium text-[15px]
```

### Button Sizes
- **Standard**: `h-11` (Use this 90% of the time)
- **Compact**: `h-9` (Use in tight spaces, card actions)
- **Large**: `h-12` (Use for primary page actions)

### Button States
- **Hover**: Slight lift (`-translate-y-0.5`) + increased shadow
- **Active**: No transform
- **Disabled**: `opacity-50` + `cursor-not-allowed`

---

## 📦 Cards

### Standard Card
```tsx
className="card"
// Spec:
// - Padding: p-6 (24px) - ALWAYS
// - Border radius: rounded-2xl (16px)
// - Border: 1px solid var(--border)
// - Background: var(--card)
// - Hover: border-primary + slight lift
```

### Card Variations
- **Default**: Standard card with hover effect
- **Static**: Add `hover:transform-none` to disable hover
- **Highlighted**: Add `border-primary/20 shadow-lg shadow-primary/5`
- **Dashed (Empty State)**: Add `border-dashed`

---

## 📝 Typography

### Page Titles
```tsx
<h2 className="text-3xl font-bold mb-2 tracking-tight">Title</h2>
<p className="text-muted-foreground text-base mb-8">Subtitle</p>
```

### Section Titles
```tsx
<h3 className="text-lg font-semibold mb-4">Section Title</h3>
```

### Card Titles
```tsx
<h4 className="text-base font-semibold mb-3">Card Title</h4>
```

### Body Text
- **Standard**: `text-[15px] leading-relaxed`
- **Secondary**: `text-sm text-muted-foreground`
- **Caption**: `text-xs text-muted-foreground`

---

## 🎯 Input Fields

### Text Input
```tsx
className="input"
// Spec:
// - Padding: px-4 py-3.5 (16px horizontal, 14px vertical)
// - Border radius: rounded-xl (12px)
// - Border: 1px solid var(--border)
// - Background: var(--input)
// - Font: text-[15px]
// - Focus: ring-2 ring-primary ring-offset-2
```

### Textarea
```tsx
className="textarea"
// Spec:
// - Same as input
// - Min height: min-h-[120px]
// - Resize: resize-y
```

### Select
```tsx
className="select"
// Same as input
```

---

## 🏷️ Badges & Chips

### Status Badge
```tsx
// Success
className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20"

// Warning
className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"

// Info
className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20"

// Danger
className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20"
```

### Subreddit Chip
```tsx
className="subreddit-chip"
// Spec:
// - Padding: px-4 py-2 (16px horizontal, 8px vertical)
// - Border radius: rounded-full
// - Font: text-sm font-medium
// - Selected: bg-primary + ring-2 ring-primary
```

---

## 🎨 Color Usage

### Primary Colors
- **Primary**: `var(--primary)` - Purple/Blue (#4F46E5 equivalent)
- **Accent**: `var(--accent)` - Cyan (#00D2FF equivalent)
- **Success**: `#10b981` (green-500)
- **Warning**: `#f59e0b` (yellow-500)
- **Danger**: `#ef4444` (red-500)

### Text Colors
- **Primary**: `text-foreground` - White/near-white
- **Secondary**: `text-muted-foreground` - Gray
- **Accent**: `text-primary` - Brand purple

---

## 🎭 Empty States

### Standard Empty State
```tsx
<div className="card h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 border-dashed">
  <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-6">
    <Icon className="w-8 h-8 text-muted-foreground/50" />
  </div>
  <h3 className="text-xl font-semibold mb-2">Empty State Title</h3>
  <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed">
    Description text
  </p>
</div>
```

---

## 📱 Responsive Grid

### Standard Layouts
- **Dashboard Stats**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`
- **Two Column**: `grid-cols-1 lg:grid-cols-2 gap-8`
- **Three Column**: `grid-cols-1 lg:grid-cols-3 gap-8`
- **Form + Preview**: `grid-cols-1 lg:grid-cols-3 gap-8` (1/3 split)

---

## ✨ Animations

### Standard Transitions
- **All interactions**: `transition-all duration-200 ease-out`
- **Hover lifts**: `hover:-translate-y-0.5`
- **Fade in**: `animate-fade-in` (0.5s ease-out)

### Loading States
- **Spinner**: Use `Loader2` icon with `animate-spin`
- **Skeleton**: Use `shimmer` class

---

## 🎯 Icons

### Icon Sizing
- **Extra Small**: `w-3 h-3` (12px) - Inline with text
- **Small**: `w-4 h-4` (16px) - Buttons, labels
- **Medium**: `w-5 h-5` (20px) - Section headers
- **Large**: `w-6 h-6` (24px) - Stats, features
- **Extra Large**: `w-8 h-8` (32px) - Empty states

### Icon Colors
- **Primary**: Match text color or use `text-primary`
- **Decorative**: `text-muted-foreground`
- **Status**: Match badge/status color

---

## 📋 Component Checklist

When creating ANY new component:
- [ ] Uses standard spacing (`p-6` for cards, `gap-6` for grids)
- [ ] Buttons are `h-11` for standard or `h-9` for compact
- [ ] All transitions use `transition-all duration-200`
- [ ] Empty states follow standard format
- [ ] Typography uses correct scale
- [ ] Colors from design system only
- [ ] Icons are appropriately sized
- [ ] Hover states are consistent

---

## 🚫 Common Mistakes to Avoid

1. ❌ **Random padding**: Always use `p-6` for cards
2. ❌ **Inconsistent gaps**: Use `gap-6` for major grids, `gap-3` for button groups
3. ❌ **Different button heights**: Standardize on `h-11` or `h-9`
4. ❌ **Mixing border radius**: Card = `rounded-2xl`, Buttons = `rounded-full`, Inputs = `rounded-xl`
5. ❌ **Custom colors**: Use CSS variables from theme
6. ❌ **Inconsistent shadows**: Use `shadow-lg shadow-primary/25` for primary actions
7. ❌ **Random font sizes**: Stick to `text-3xl`, `text-lg`, `text-base`, `text-sm`, `text-xs`
