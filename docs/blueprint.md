# **App Name**: SyllabusAce

## Core Features:

- Syllabus Input: Accept syllabus input via text or file upload (PDF/TXT).
- Exam Details Input: Capture exam type (Internal/Semester) and available study time.
- AI-Powered Tiered Prioritization: Utilize Google Gemini (gemini-1.5-flash) as a tool to analyze the syllabus, identify key concepts, and prioritize topics into tiered study levels (Tier 1, Tier 2, Tier 3) based on importance and prerequisites, optimized for exam performance.
- Structured JSON Output: Output a JSON object with tiered topics, recommendations, risk analysis, and quick revision notes.
- Tiered Content Display: Present the syllabus content organized by tiers in a clean, readable format in the UI.
- Risk Analysis & Recommendations: Present the risk analysis (overall risk, high-risk topics if skipped, notes) and overall study recommendations.
- Error Handling & Logging: Implement robust error handling for invalid JSON output from Gemini, Gemini failures, and missing environment variables, with detailed logging.

## Style Guidelines:

- Primary color: Dark blue (#2E4DA6) to convey knowledge, seriousness, and focus.
- Background color: Very light blue (#F0F4FF) for a clean, distraction-free study environment.
- Accent color: Light orange (#FFA500) to highlight key information, CTAs, and important warnings, creating contrast.
- Body text: 'PT Sans', a clear and readable sans-serif font, suitable for body text.
- Headline text: 'Space Grotesk', for headers.
- Use simple, clear icons to represent tiers and categories within the syllabus. Keep the icons minimalistic.
- Employ a clean, well-spaced layout for each tier. Clearly separate the content by importance (Tier 1, Tier 2, Tier 3). Ensure easy navigation and readability.