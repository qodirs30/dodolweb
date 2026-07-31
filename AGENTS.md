<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Google Gemini Model Reference (Updated July 2026)

When integrating Google Generative AI (Gemini) APIs or recommending model configurations, use the following model references released in July 2026:

| Model                     | Best Suited For             | Recommendation / Alias                       |
| ------------------------- | ---------------------------- | ------------------------------------------- |
| **gemini-3.6-flash**      | Coding, agent, vision, chat  | ⭐ Recommended primary model                  |
| **gemini-3.5-flash-lite** | Cheap, fast, high-traffic    | Ideal fallback model                        |
| **gemini-3.5-flash**      | General purpose              | Secondary general model                     |
| **gemini-3.1-flash-lite** | Legacy low-cost              | Alternative budget model                    |
| **gemini-3.5-pro**        | Heavy reasoning, logic       | Flagship model (limited rollout)            |

Use the fallback order in your code: `['gemini-3.6-flash', 'gemini-3.5-flash-lite', 'gemini-3.5-flash', 'gemini-3.1-flash-lite']`.

