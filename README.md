# AI Resume Builder

> **Project 3** — KodNest Premium Build System

**Build a Resume That Gets Read.**

A premium, clean, calm webapp for crafting professional resumes. Built with KodNest Premium Design System conventions — no noise, no clutter, just intentional design.

## 🔗 Live Link

**[https://mukeshchettyd.github.io/ai-resume-builder/](https://mukeshchettyd.github.io/ai-resume-builder/)**

## Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Landing page with CTA |
| `/builder` | Builder | Two-column form + live preview |
| `/preview` | Preview | Clean full-page resume display |
| `/proof` | Proof | Artifact collection placeholder |

## Features (Skeleton)

- **Home**: Premium landing with "Start Building" CTA
- **Builder**: 7-section form (Personal, Summary, Education, Experience, Projects, Skills, Links)
  - Add/remove multiple entries for Education, Experience, Projects
  - Live preview in right panel
  - "Load Sample Data" button with realistic resume
  - Data persists to localStorage
- **Preview**: Full-page clean resume — black + white, premium typography
- **Proof**: Artifact placeholders for future submission

## Design System

Following KodNest Premium conventions:
- Playfair Display headings + Inter body text
- 4 semantic colors + neutrals
- 8px spacing scale
- 150-200ms transitions only
- No gradients, no glassmorphism, no animation noise

## Tech Stack

- React 19 + React Router 7
- Vite 7
- Vanilla CSS with design tokens
- localStorage persistence
- GitHub Pages deployment

## Getting Started

```bash
git clone https://github.com/mukeshchettyd/ai-resume-builder.git
cd ai-resume-builder
npm install
npm run dev
```

## License

MIT
