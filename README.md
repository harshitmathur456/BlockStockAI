# 🏗️ BlockStock AI: Future of Smart Warehouse Management

**BlockStock AI** is a next-generation Warehouse Management System (WMS) designed to bring transparency, spatial intelligence, and AI-driven automation to inventory logistics. Built with a premium "Dallas Warehouse" aesthetic, it combines military-grade immutable logging with a high-end executive interface.

---

## 📽️ Live Demonstration & Walkthrough
> [!IMPORTANT]
> The application features a custom-built **Dallas Warehouse** design system, utilizing a cream-themed, high-contrast palette for a premium industrial feel.

### 🏠 Command Center (Dashboard)
A high-level overview of warehouse health, showing real-time stock units, low-stock alerts, and pending retail orders.
![Dashboard](https://raw.githubusercontent.com/harshitmathur456/BlockStockAI/main/docs/screenshots/dashboard.png)

### 🗺️ Visual Warehouse Map
Navigate your warehouse spatially. Interactive rack zones allow you to visualize stock distribution and identify empty storage locations at a glance.
![Warehouse Map](https://raw.githubusercontent.com/harshitmathur456/BlockStockAI/main/docs/screenshots/map.png)

### 🔗 Blockchain-Powered Immutable Ledger
Every stock movement—receive, transfer, or dispatch—is cryptographically hashed and chained. This ensures a tamper-proof audit trail for judges and compliance officers.
![Ledger](https://raw.githubusercontent.com/harshitmathur456/BlockStockAI/main/docs/screenshots/ledger.png)

---

## 🚀 Key Features

### 💎 Dallas Warehouse Design System
- **Premium Aesthetics**: Cream background (`#FFF7DE`), burnt orange accents, and high-contrast black typography.
- **Typography-Driven UI**: Uses `DM Serif Display` for authority and `DM Mono` for precision data.
- **Responsive Layout**: A fixed sidebar architecture that adapts to all industrial screen sizes.

### 🔢 Fractional Stock Support
- **Precision Tracking**: Unlike traditional systems, BlockStock AI supports decimal quantities (e.g., 12.5 kg of Steel or 5.25 liters of fluid).
- **Retail Dispatch**: A built-in "Movements" system for imaginary retailers (BlockMart, QuickBuild) to order fractional inventory.

### 🤖 AI Neural Scanning (Vision)
- **Automated Counting**: Point a camera at inventory boxes to automatically count and sync stock to the ledger via AI vision.
- **Verification Loop**: AI-detected counts are compared against predicted ledger states to identify discrepancies.

### 🛡️ Immutable Security
- **Chained Transactions**: Each entry contains the hash of the previous block, creating a cryptographically secure history.
- **Tamper Detection**: Any modification to historical records breaks the chain integrity.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, Tailwind CSS, Lucide React, Framer Motion.
- **Backend**: Node.js, Express, Prisma ORM.
- **Database**: PostgreSQL (Supabase) with real-time capabilities.
- **AI/Vision**: Neural counting logic for stock detection.
- **Security**: SHA-256 Cryptographic Hashing for the Ledger.

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database (or Supabase URL)

### Backend Setup
1. `cd backend`
2. `npm install`
3. Configure `.env` with `DATABASE_URL`
4. `npx prisma db push`
5. `npm run dev`

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. `npm run dev -- -p 3005`

---

## 👨‍⚖️ Note to Judges
BlockStock AI was designed to solve the three biggest problems in modern warehousing: **Lack of Transparency**, **Inefficient Spatial Planning**, and **Human Error in Counting**. By combining Blockchain, AI Vision, and Spatial Mapping, we provide a 360-degree source of truth for any inventory operation.

Created by **Harshit Mathur**.
