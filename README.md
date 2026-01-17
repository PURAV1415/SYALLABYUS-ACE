# SyllabusAce

This is a Next.js project in Firebase Studio.

## Core Features:

- Syllabus Input: Accept syllabus input via text or file upload (PDF/TXT).
- Exam Details Input: Capture exam type (Internal/Semester) and available study time.
- AI-Powered Tiered Prioritization: Utilize Google Gemini (gemini-1.5-flash) as a tool to analyze the syllabus, identify key concepts, and prioritize topics into tiered study levels (Tier 1, Tier 2, Tier 3) based on importance and prerequisites, optimized for exam performance.
- Structured JSON Output: Output a JSON object with tiered topics, recommendations, risk analysis, and quick revision notes.
- Tiered Content Display: Present the syllabus content organized by tiers in a clean, readable format in the UI.
- Risk Analysis & Recommendations: Present the risk analysis (overall risk, high-risk topics if skipped, notes) and overall study recommendations.
- Error Handling & Logging: Implement robust error handling for invalid JSON output from Gemini, Gemini failures, and missing environment variables, with detailed logging.

## Project Structure

```
.
├── apphosting.yaml
├── components.json
├── docs
│   └── blueprint.md
├── next.config.ts
├── next-env.d.ts
├── node_modules
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── README.md
├── src
│   ├── ai
│   │   ├── dev.ts
│   │   ├── flows
│   │   │   └── generate-syllabus-tiers-flow.ts
│   │   └── genkit.ts
│   ├── app
│   │   ├── actions.ts
│   │   ├── api
│   │   │   └── auth
│   │   │       ├── login
│   │   │       └── logout
│   │   ├── components
│   │   │   ├── form-fields.tsx
│   │   │   ├── hero.tsx
│   │   │   ├── page.tsx
│   │   │   ├── results-display.tsx
│   │   │   ├── results-panel.tsx
│   │   │   ├── submit-button.tsx
│   │   │   └── syllabus-compressor.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components
│   │   └── ui
│   │       ├── accordion.tsx
│   │       ├── alert-dialog.tsx
│   │       ├── alert.tsx
│   │       ├── avatar.tsx
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── calendar.tsx
│   │       ├── card.tsx
│   │       ├── carousel.tsx
│   │       ├── chart.tsx
│   │       ├── checkbox.tsx
│   │       ├── collapsible.tsx
│   │       ├── dialog.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── form.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── menubar.tsx
│   │       ├── popover.tsx
│   │       ├── progress.tsx
│   │       ├── radio-group.tsx
│   │       ├── scroll-area.tsx
│   │       ├── select.tsx
│   │       ├── separator.tsx
│   │       ├── sheet.tsx
│   │       ├── sidebar.tsx
│   │       ├── skeleton.tsx
│   │       ├── slider.tsx
│   │       ├── switch.tsx
│   │       ├── table.tsx
│   │       ├── tabs.tsx
│   │       ├── textarea.tsx
│   │       ├── toaster.tsx
│   │       ├── toast.tsx
│   │       └── tooltip.tsx
│   ├── hooks
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib
│   │   ├── placeholder-images.json
│   │   ├── placeholder-images.ts
│   │   └── utils.ts
│   └── middleware.ts
├── tailwind.config.ts
└── tsconfig.json
```

## Running the project

To run the development server, you will need two separate terminals.

**Terminal 1: Run the Next.js app**
```bash
npm run dev
```

**Terminal 2: Run the Genkit AI flows**
```bash
npm run genkit:dev
```

Once both are running, open [http://localhost:9003](http://localhost:9003) in your browser to see the application.

## Getting Started with Editing

To get started, take a look at `src/app/page.tsx`.
