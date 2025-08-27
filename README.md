# Web3 Message Signer & Verifier (Headless Dynamic.xyz)

Full-stack: React (CRA + Tailwind, headless Dynamic) + Node/Express + ethers.

## Features
- Headless **Email OTP** auth (no widget)
- Headless **Embedded Wallet** (created in code)
- Sign any message → backend verifies with `ethers.verifyMessage`
- Local history (last 50) via `localStorage`
- TypeScript across stack + tests

## Setup

### Backend
```bash
cd backend
cp .env.example .env
npm i
npm run dev
```

### Frontend
```bash
cd frontend
cp .env.example .env
npm i
npm run dev
```