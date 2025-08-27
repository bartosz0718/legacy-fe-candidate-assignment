# Backend – Web3 Message Verifier API

This is the **Node.js + Express + ethers.js** backend for the Decentralized Masters take-home task.  
It provides a REST API to verify Ethereum message signatures.

---

## ✨ Features
- `POST /verify-signature` endpoint to validate signed messages  
- Uses **ethers.js v6** to recover signer from a signature  
- Returns validity, signer address, and original message  
- Configurable CORS for frontend integration  
- TypeScript codebase with ESLint  
- Tests with **Vitest + Supertest**

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
cd backend
npm install
npm dev
