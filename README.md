# Secrets of Empires: Jack Hawthorne's Adventure

A playable, educational choose-your-own-adventure game set in the Victorian era (London, 1851). Players guide twelve-year-old Jack Hawthorne through the Crimean War, British India, Qing-dynasty China, and the Great Exhibition — learning real history along the way.

## How to Play

- **Choose your path** — every scene offers choices, and each of the four story routes leads to different endings (9 in total).
- **Collect History Facts** — tap the glowing magnifying glasses on each scene's illustration to add real historical facts to Jack's Journal.
- **Earn Explorer Badges** — each ending unlocks a unique badge, and every ending includes a "What Really Happened" note about the real history behind it.
- **Brave the coin flip** — one path comes down to pure luck, decided by a real coin flip.
- **Take the Knowledge Quiz** — a 10-question quiz covering all four story paths, with explanations for every answer.

Progress (badges, facts, and best quiz score) is saved in the browser, so players can replay to find every ending.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```
   npm install
   ```
2. Run the app:
   ```
   npm run dev
   ```
3. Open http://localhost:3000

### Optional: Gemini API features

The game is fully playable offline with its bundled illustrations and the browser's built-in text-to-speech narration. If you set `GEMINI_API_KEY` in `.env.local`, the game will additionally use Gemini for AI-generated narration audio and for generating images for any scene without a bundled illustration.

## Educational Topics Covered

- The Industrial Revolution and child labour
- The Great Exhibition of 1851 and the Crystal Palace
- The Crimean War, Florence Nightingale, and battlefield medicine
- The East India Company and the Sepoy Rebellion of 1857
- The Opium Wars and 19th-century diplomacy
- Victorian-era ciphers, the telegraph, and early codebreaking
