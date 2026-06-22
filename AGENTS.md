# Basta_portfolio - Agent Instructions

## Project Overview
Portfolio website for a Cross-Platform Mobile Developer (React Native, Flutter). Single-page HTML site with dark/light theme.

## Structure
- `index.html` — Main HTML with sections: Header, Hero, About, Skills, Projects, Experience, Contact, Footer
- `css/styles.css` — All styles (CSS custom properties, no framework)
- `js/main.js` — Vanilla JS (IIFE pattern per feature, IntersectionObserver for animations)
- `assets/icons/`, `assets/images/` — Static assets

## Conventions
- **CSS**: Use CSS custom properties from `:root` / `[data-theme="dark"]`. No CSS framework. Mobile-first responsive via media queries (1024px, 768px, 480px).
- **JS**: Each feature wrapped in `(function initX() { ... })()`. Event listeners use `{ passive: true }` where possible. No external libraries.
- **HTML**: Semantic HTML5 with ARIA attributes (`role`, `aria-label`, `aria-expanded`). Sections have `id` attrs matching nav anchor links.
- **Animations**: Use `reveal`, `reveal-delay-*` classes for scroll-triggered entrance animations.

## Build & Serve
No build step. Open `index.html` directly in a browser or serve with any static file server.

## Commands
- `npx serve .` — Serve locally
