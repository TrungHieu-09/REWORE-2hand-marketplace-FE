---
name: REWORE
colors:
  surface: '#fff8f5'
  surface-dim: '#e9d7c8'
  surface-bright: '#fff8f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff1e8'
  surface-container: '#feeadc'
  surface-container-high: '#f8e5d6'
  surface-container-highest: '#f2dfd1'
  on-surface: '#231a11'
  on-surface-variant: '#55433d'
  inverse-surface: '#392e25'
  inverse-on-surface: '#ffeee1'
  outline: '#88726c'
  outline-variant: '#dbc1b9'
  surface-tint: '#9a4529'
  primary: '#974226'
  on-primary: '#ffffff'
  primary-container: '#b65a3c'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb59e'
  secondary: '#655d52'
  on-secondary: '#ffffff'
  secondary-container: '#ede1d2'
  on-secondary-container: '#6b6357'
  tertiary: '#556138'
  on-tertiary: '#ffffff'
  tertiary-container: '#6d7a4f'
  on-tertiary-container: '#fcffeb'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbd0'
  primary-fixed-dim: '#ffb59e'
  on-primary-fixed: '#3a0b00'
  on-primary-fixed-variant: '#7b2e14'
  secondary-fixed: '#ede1d2'
  secondary-fixed-dim: '#d0c5b7'
  on-secondary-fixed: '#201b12'
  on-secondary-fixed-variant: '#4d463b'
  tertiary-fixed: '#dae9b5'
  tertiary-fixed-dim: '#becc9b'
  on-tertiary-fixed: '#151f01'
  on-tertiary-fixed-variant: '#3f4b25'
  background: '#fff8f5'
  on-background: '#231a11'
  surface-variant: '#f2dfd1'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  max_width: 1280px
  gutter: 24px
  margin_desktop: 48px
  margin_mobile: 20px
  unit: 4px
---

## Brand & Style

The design system is built for a high-end secondhand fashion marketplace that bridges the gap between vintage charm and modern editorial aesthetics. The brand personality is curated, conscious, and communal, evoking the feeling of flipping through a premium heavy-stock fashion magazine or walking into a well-lit, organized boutique.

The design style utilizes a **Warm Editorial** approach:
- **Paper-like Depth:** Uses a layered "stock" effect where surfaces feel like physical paper rather than digital pixels.
- **Organic Sophistication:** Avoids the clinical coldness of modern SaaS by using softened neutrals and earthy tones.
- **Tactile Minimalism:** High-quality whitespace paired with subtle grain textures and soft shadows to create a trustworthy, human-centric interface.
- **Editorial Hierarchy:** Clear distinction between functional UI elements and expressive storytelling typography.

## Colors

This design system employs a warm, grounded palette designed to feel aged yet clean. The background (#F6F0E8) serves as the "paper" foundation, while the Surface (#FFFCF7) provides a crisp lift for interactive cards and modals. 

**Primary Action (Terracotta):** Reserved for high-priority conversions, checkout flows, and primary buttons. It provides high contrast against the neutral base.
**Accent Olive & Mustard:** Used sparingly for category tags, community badges, or seasonal highlights to maintain a botanical, vintage-inspired vibe.
**Semantic Colors:** Muted to match the overall saturation of the brand, ensuring that error or success states don't break the editorial immersion.

## Typography

The system uses a sophisticated pairing of an elegant Serif and a modern Sans-Serif.

- **Playfair Display:** Used for headings and branding to provide an authoritative, fashion-forward voice. High-contrast strokes evoke the look of printed mastheads.
- **Manrope:** Chosen for its modern, balanced geometry. It ensures high legibility for product descriptions, price tags, and functional UI components.
- **Styling Note:** Labels and small metadata should often use `label-md` with slight letter-spacing and uppercase styling to mimic the "tag" aesthetic found in physical retail.

## Layout & Spacing

The design system follows a **Fixed-Fluid Hybrid** approach. Content is constrained to a 1280px central container on desktop to maintain editorial focus, while the background color extends to the viewport edges.

- **Grid Model:** A 12-column grid for desktop with 24px gutters. For product listings, use a 4-column (desktop), 3-column (tablet), and 2-column (mobile) reflow pattern.
- **Vertical Rhythm:** Spacing is based on a 4px baseline. Use larger 80px-120px sections for storytelling components and tighter 16px-24px gaps for functional data entry.
- **Negative Space:** Embrace generous margins to allow the serif typography and high-quality photography to breathe, reinforcing the premium secondhand feel.

## Elevation & Depth

This design system avoids harsh, technical shadows in favor of **Organic Depth**.

- **Shadow Profile:** Use extremely soft, diffused shadows with a slight color tint derived from the Primary Text color (#2B2118 at 5-8% opacity). This creates a "lifted paper" effect rather than a "floating plastic" effect.
- **Tonal Layering:** Use the Secondary color (#EFE3D4) as a subtle inset or background for sections like filters or footer areas to distinguish them from the main canvas without needing borders.
- **Texture:** Apply a very low-opacity paper grain overlay (2-3%) globally to the background to enhance the tactile, vintage feel of the digital surfaces.

## Shapes

The shape language is a mix of high-fashion curves and structured containers.

- **Large Surfaces:** Product cards and main containers use a 20px radius to feel welcoming and soft.
- **Primary Buttons:** Utilize a full pill-shape (999px) to stand out as distinct interactive elements against the more structured grid.
- **Small Elements:** Chips, tags, and secondary buttons use a tighter 14px radius to maintain a sophisticated, tailored appearance.
- **Image Treatment:** All product photography should have a slight 4px - 8px radius to prevent "sharpness" that conflicts with the warm brand tone.

## Components

- **Buttons:** Primary buttons use Terracotta with white or light cream text. Secondary buttons use a Border-only style with the Primary Text color.
- **Product Cards:** Cards should have no border, using a subtle 20px radius and a soft ambient shadow. Product names use Manrope (Medium), while prices use Playfair Display for an upscale feel.
- **Chips & Tags:** Use the Accent Olive or Mustard backgrounds with low opacity (15%) and high-contrast text for categories like "Vintage," "Rare," or "Designer."
- **Input Fields:** Use the Border color (#E4D6C8) for the stroke. On focus, the border transitions to Primary Text (#2B2118) rather than the Primary Action color to keep the UI grounded.
- **Lists:** Use horizontal separators in the Border color with a 1px thickness. Add generous 16px padding between list items.
- **Special Component (The "Price Tag"):** For featured items, use a floating label styled like a physical price tag using the secondary color and `label-md` typography.