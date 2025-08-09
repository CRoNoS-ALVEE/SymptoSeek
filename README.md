# SymptoSeek

An intelligent **Next.js**‑based frontend application for SymptomSeek—a modern healthcare assistant that allows users to log symptoms, interact via chat, and access medical insights in real time.

## Features

- Built with **Next.js** (TypeScript) using **create‑next‑app**
- Responsive UI framework powered by **Tailwind CSS**
- Clean project structure with configuration files: `next.config.ts`, `tailwind.config.ts`, ESLint, PostCSS, and more
- Seamless interaction with backend APIs handling symptom analysis, doctor recommendations, appointment bookings, user authentication, and health report generation

## Getting Started

### Prerequisites

- **Node.js** (LTS recommended)
- **Yarn** or **npm**
- Running backend server (ensure your SymptoSeek-Backend is accessible and configured)

### Installation

```bash
git clone https://github.com/CRoNoS-ALVEE/SymptoSeek.git
cd SymptoSeek
npm install   # or yarn install
```

### Running Locally

```bash
npm run dev   # or yarn dev
```
Visit `http://localhost:3000` to explore the interface. UI auto‑reloads on changes—especially if you modify `app/page.tsx`.

### Building for Production

```bash
npm run build
npm run start
```
Deploy easily to platforms like **Vercel**—the project appears live at `sympto-seek.vercel.app`.

## Project Structure (Key Files & Folders)

```
SymptoSeek/
├── app/                 # Next.js app routes/components
├── public/              # Static assets
├── .env                 # Environment variables (e.g., API_BASE_URL)
├── next.config.ts       # Next.js configuration
├── tailwind.config.ts   # Tailwind CSS configuration
├── package.json         # NPM scripts and dependencies
├── postcss.config.js    # PostCSS setup
├── eslint.config.mjs    # ESLint rules
├── tsconfig.json        # TypeScript settings
└── README.md            # This documentation
```

## Environment Variables

Add a `.env.local` file with:

```env
NEXT_PUBLIC_API_URL=https://your-backend.api
# Other necessary variables here
```

Customize according to your backend setup.

## How to Contribute

1. Fork the repository
2. Create a new branch: `git checkout -b feature/my-feature`
3. Make changes and commit: `git commit -m "Add my feature"`
4. Push to your fork: `git push origin feature/my-feature`
5. Open a Pull Request for review

## Have a look
symptoseek.me
