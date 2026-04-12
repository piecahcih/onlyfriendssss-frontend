# Design System Document: Editorial Warmth

## 1. Overview & Creative North Star

### The Creative North Star: "The Curated Warmth"
This design system moves away from the sterile, "tech-first" aesthetic of typical mobile apps and leans into a "Curated Warmth" philosophy. It treats the interface like a premium lifestyle journal—one that is inviting, tactile, and intentionally soft. By combining a high-energy orange primary palette with generous whitespace and playful iconography, we create an experience that feels less like a utility and more like a personal assistant.

**The Editorial Shift:**
Standard apps rely on heavy borders and rigid grids. This system breaks that template by using **tonal depth** and **asymmetric breathing room**. We prioritize a "soft-touch" interface where roundedness isn't just a style choice—it's a functional cue for friendliness and accessibility.

---

## 2. Colors

The palette is anchored in a sophisticated "Burnt Terracotta" and "Soft Blush" relationship. It avoids pure whites and blacks to maintain a premium, editorial feel.

### The Palette
- **Primary (`#a83100`):** Use for high-impact actions and brand presence.
- **Primary Container (`#ff784c`):** Use for hero moments or high-visibility chips.
- **Surface (`#fff4f3`):** The default canvas. It is a warm, tinted white that reduces eye strain.
- **On-Surface (`#4e2120`):** Our "Black." A deep, warm cocoa that provides high contrast without the harshness of hex #000.

### The "No-Line" Rule
**Explicit Instruction:** 1px solid borders are strictly prohibited for sectioning or containment. 
Boundaries must be defined through:
1.  **Background Shifts:** Placing a `surface-container-low` component on a `surface` background.
2.  **Shadow Depth:** Using ambient, tinted shadows to lift elements.
3.  **Whitespace:** Using the spacing scale to create groupings.

### The "Glass & Gradient" Rule
To add "soul" to the UI, main CTAs should utilize a subtle linear gradient transitioning from `primary` to `primary-container`. For floating overlays (like navigation bars or tooltips), use **Glassmorphism**: a semi-transparent `surface` color with a `20px` backdrop blur to allow the background warmth to bleed through.

---

## 3. Typography

The typography strategy uses a "Modern Serif-Alternative" pairing. We use **Plus Jakarta Sans** for structure and **Be Vietnam Pro** for content clarity.

| Level | Token | Font Family | Size | Intent |
| :--- | :--- | :--- | :--- | :--- |
| **Display** | `display-lg` | Plus Jakarta Sans | 3.5rem | Impactful hero numbers or headers. |
| **Headline** | `headline-md` | Plus Jakarta Sans | 1.75rem | Page titles (e.g., "Create Activity"). |
| **Title** | `title-md` | Be Vietnam Pro | 1.125rem | Sub-headers and card titles. |
| **Body** | `body-lg` | Be Vietnam Pro | 1rem | Main user input and descriptions. |
| **Label** | `label-md` | Be Vietnam Pro | 0.75rem | Small captions or chip text. |

**Editorial Note:** Always use a `tracking` (letter-spacing) of `-0.02em` for headlines to give them a custom, typeset appearance.

---

## 4. Elevation & Depth

We eschew traditional Material shadows for **Tonal Layering**.

- **The Layering Principle:** Stacking surface tiers creates natural hierarchy. A `surface-container-lowest` card sitting on a `surface-container` background provides a crisp but soft lift.
- **Ambient Shadows:** For "floating" elements (Floating Action Buttons or Modals), use a shadow color of `rgba(78, 33, 32, 0.08)` (a tinted version of `on-surface`) with a blur radius of `32px` and a `Y-offset` of `8px`.
- **The "Ghost Border" Fallback:** If a border is required for accessibility in input fields, use `outline-variant` at **20% opacity**. Never use 100% opacity borders.

---

## 5. Components

### Input Fields
Inputs follow the "Pill" philosophy (Roundedness: `full`).
- **Styling:** `surface-container-lowest` background.
- **Iconography:** Use playful emojis as leading elements to guide the user:
    - ✏️ **Name:** For activity titles.
    - 📍 **Location:** For the "Drop Pin" field.
    - 📅 **Date:** For calendar selection.
    - 🏷️ **Category:** For tags.
    - 📝 **Notes:** For multi-line text areas.
- **State:** On focus, the "Ghost Border" transitions to 100% `primary` opacity at 2px width.

### Buttons
- **Primary:** Rounded `full`, `primary` to `primary-container` gradient, `on-primary` text.
- **Secondary:** `surface-container-high` background with `primary` text. No border.
- **Tertiary:** Transparent background, `primary` text, underlined only on hover/active states.

### Chips & Tags
- **The "Public" Chip:** As seen in the reference, use a soft `primary-container` (orange) or `tertiary-container` (purple) background with a leading emoji.
- **Selection:** Use `md` (1.5rem) roundedness for chips to distinguish them from the `full` roundedness of inputs.

### Cards & Lists
**Forbid Divider Lines.** Separate list items using `16px` of vertical whitespace. If grouping is required, wrap the items in a `surface-container-low` parent container with `lg` (2rem) corner radius.

---

## 6. Do's and Don'ts

### Do
- **Do** use emojis to inject personality into functional areas (forms, buttons).
- **Do** use "Plus Jakarta Sans" for all numerical data to maximize legibility.
- **Do** lean into the `surface-container` tiers to create a "nested" UI.
- **Do** use `xl` (3rem) or `full` corner radius for main action buttons to make them feel "squishy" and tappable.

### Don't
- **Don't** use pure black `#000000` for text; it breaks the editorial warmth of the system.
- **Don't** use sharp corners (`none` or `sm`). Every element should feel smoothed.
- **Don't** use standard system icons when an emoji can convey the same meaning with more "soul."
- **Don't** use high-contrast dividers. Let the background color shifts do the heavy lifting.