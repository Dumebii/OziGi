# Contributing to Ozigi ⚡

First off, thank you for considering contributing to Ozigi. We are building a high-performance Context Engine designed to eliminate "AI-isms" and help creators ship authentic content.

## 🎨 Vibe-Coded and Proud of It

Ozigi was majorly vibe-coded. That is not a disclaimer — it is a design philosophy.

We believe the best tools are built by people who felt the problem before they solved it. If you have used Ozigi, hit something that annoyed you, and immediately knew how to fix it — that instinct is exactly what we want in a contributor. You do not need a perfect architecture diagram. You need a working branch and a clear explanation of what you changed and why.

**Vibe-coded contributions are explicitly welcome here.** Ship the fix. Write the note. We will figure out the rest together.

The only rule: your vibes must not break other people's vibes. Run the tests.

---

## 🛠 Our Engineering Philosophy

- **Staff Engineer Aesthetic:** High-contrast, professional, and slightly aggressive UI. Tailwind `slate-900`, `red-700`, `fafafa`.
- **Human-First Output:** Any changes to the AI logic must strictly enforce the **Banned Lexicon**. No "delve". No "tapestry". No "robust". If you are touching the generation pipeline, you are responsible for keeping the output human.
- **Performance:** Sub-8s latency is the target. Do not add heavy client-side libraries unless you can justify the tradeoff in your PR description.

---

## 🚀 Local Development Setup

1. Fork and clone the repository.
2. Install dependencies: `pnpm install`
3. Set up your `.env.local` — request access to the dev environment if needed.
4. Create a branch: `git checkout -b feature/your-feature-name`
5. Build something. Break something. Fix it.

---

## 📐 Pull Request Guidelines

- **Atomic Commits:** One PR = one feature or fix. Keep it focused.
- **Testing:** Run Playwright tests before submitting: `pnpm exec playwright test`
- **Styling:** Use the established Framer Motion variants (`fadeUp`, `staggerContainer`) for all new UI components.
- **Vibe check:** If your PR description is longer than your diff, you are probably overthinking it. Ship it.

---

## 📝 Commit Messages

Simplified conventional commit style:

- `feat:` — new feature
- `fix:` — bug fix
- `docs:` — documentation updates
- `chore:` — maintenance
- `vibe:` — you know what you did

---

## 💡 What We Actually Want Help With

Not sure where to start? Here are the areas where vibe-coded energy translates directly into value:

- **New publishing integrations** — Bluesky, Dev.to, Substack, Threads
- **Persona templates** — pre-built voice profiles that ship with the app
- **UI polish** — if something feels off, it probably is
- **Prompt constraint experiments** — ideas for expanding the Banned Lexicon or improving persona routing

Open an issue first if you are building something big. For small fixes, just PR it.

---

*By contributing to Ozigi, you agree that your contributions will be licensed under the project's MIT License.*