# Spendly — Minimalist Daily Budget & Expense Tracker ⚡

Spendly is a minimalist personal finance web application built around daily budget recalculation and effortless expense logging.

---

## Key Features

* **Dynamic Daily Allowance:** Automatically calculates and redistributes your daily spending limit across remaining days.
* **Instant 2-Tap Logging:** Quick category pills with emojis for rapid expense capture.
* **Smart Overspending Smoothing:** If you spend more than your daily target, future daily allowances are smoothly recalculated to keep your budget on track.
* **Offline-First & Cloud Sync:** Use immediately as a guest with local storage persistence, or sign in via Supabase for multi-device cloud synchronization.
* **Visual Analytics:** Real-time expense breakdown charts by category and net balance tracking.
* **Dark & Light Mode:** Seamlessly switch between dark graphite and light modern themes.

---

## Tech Stack

* **Frontend:** React 19, Vite, Vanilla CSS Design System
* **Data Visualization:** Recharts
* **Backend & Auth:** Supabase (PostgreSQL, Supabase Auth)
* **Storage:** Hybrid LocalStorage & Supabase Real-time Database
* **Deployment:** GitHub Pages / Static Web Hosting

---

## Getting Started

### Prerequisites
* Node.js 18+ and npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Dima3939/Spendly.git
   cd Spendly
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env.local` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run local development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

---

## License
MIT License
