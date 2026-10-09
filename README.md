# VisionX 👁️♻️
> **See it. Understand it. Dispose of it right.**

VisionX turns a camera into an AI-powered waste-disposal assistant that helps users understand what an item is, how it should be handled, and why the recommended disposal action matters.

Developed for the **WeMakeDevs × AWS Environmental Hacks Hackathon** under the **Waste & Energy Track**.

---

## 🌟 Key Features

- **Retro Neo-Brutalist / Soft Brutalism Aesthetic:** Bold outlines, hard offset ink shadows, tactile physical button physics, and high-contrast editorial poster layouts. Zero gradients, zero blurred shadows, zero glassmorphism.
- **Dedicated Camera Scanner (`/scan`):**
  - Real browser webcam stream with zero-lag canvas still-frame capture.
  - Front/Rear camera switching and mirrored selfie preview.
  - Drag-and-drop photo upload with client-side format & size validation.
- **Action-Oriented Structured Guidance:**
  - Moves beyond raw object labels to deliver preparation checklists (rinsing, cap retention, drying).
  - Explicit contamination risk callouts.
  - Responsible uncertainty flagging (e.g., distinguishing unverified polymers from confirmed organics).
- **Interactive Demonstrations & Simulations:**
  - 3 preconfigured benchmark waste scenarios (Plastic Beverage Bottle, Banana Peel, Takeout Container).
  - Grounded mock conversational assistant ready for AWS Strands Agents integration.
- **Two-Row Technology Marquee:** Continuous infinite scrolling showcasing the core CV stack and agent ecosystem.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, TypeScript, Vite 8, Lucide Icons
- **Design Tokens:** Strict retro neo-brutalist CSS variables (`--ink`, `--paper`, `--sun`, `--pink`, `--violet`, `--lime`, `--sky`, `--sand`)
- **Computer Vision (Pipeline Target):** YOLOv11 / Ultralytics, OpenCV, Python
- **Conversational Intelligence (Pipeline Target):** AWS Strands Agents SDK, Ollama / Bedrock

---

## 🚀 Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ITS-LLM-2026/VisionX.git
   cd VisionX
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173/](http://localhost:5173/) in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Lint check:**
   ```bash
   npm run lint
   ```

---

## ☁️ Deployment on Render

This repository includes a `render.yaml` blueprint for instant one-click deployment on [Render](https://render.com).

### Manual Setup on Render:
1. Create a new **Static Site** on Render.
2. Connect your GitHub repository (`https://github.com/ITS-LLM-2026/VisionX`).
3. Set the following configuration:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
4. Under **Redirects / Rewrites**:
   - **Source:** `/*`
   - **Destination:** `/index.html`
   - **Action:** `Rewrite`
5. Click **Create Static Site**.

---

## 📜 Open Research & Citations
- **TACO Dataset:** Proença, P. F., & Simões, P. (2020). *TACO: Trash Annotations in Context for Litter Detection*. arXiv:2003.06975.
- **EPA Municipal Solid Waste:** Advancing Sustainable Materials Management: Fact Sheet.
- **AWS Strands Agents SDK:** Open-source Python agent framework.

---

## 📄 License
MIT License. Built for the WeMakeDevs × AWS Environmental Hacks Hackathon.
