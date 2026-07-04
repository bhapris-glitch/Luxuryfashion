# Layboka: Luxe Boutique SaaS Platform

Layboka is a premium, automated fashion-tech platform designed for bespoke tailors and boutique owners. It combines luxury aesthetics with powerful business automation, including a 7-day trial engine, global Stripe payments, and AI-driven fabric assistance.

## Key Features
- **Birth of the Icon**: Elegant splash screen experience.
- **7-Day Revenue Engine**: Automated trial locking on the 8th day.
- **Global Autopay**: Multi-currency subscription handling via Stripe.
- **Birth of a Dress**: Visual production timeline for custom garments.
- **Fabric AI**: Intelligent suggestions for craftsmanship.
- **Graceful Exit**: Professional session termination animation.

## Prerequisites
- Node.js (v18 or higher)
- Stripe Account (for API keys)
- Render.com Account (for persistent disk deployment)

## Local Installation

1.  **Clone the repository**
2.  **Install Dependencies**:
    `npm install`
3.  **Environment Setup**:
    - Create a `.env` file in the root directory (use `.env.example` as a template).
    - Add your `STRIPE_SECRET_KEY` and `JWT_SECRET`.
4.  **Run Locally**:
    `npm run dev`
    - The server starts on `http://localhost:5000`
    - The frontend starts on `http://localhost:5173`

## Render.com Deployment Guide

1.  **Create a Web Service**: Connect your GitHub repository.
2.  **Build Command**: `npm install && npm run build`
3.  **Start Command**: `npm run start`
4.  **Persistent Disk**:
    - Go to **Settings** > **Disks** on Render.
    - Add a Disk: Name: `layboka_data`, Mount Path: `/opt/render/project/src/data`, Size: 1GB.
    - Set Environment Variable: `DATABASE_PATH=/opt/render/project/src/data/layboka.db`.
5.  **Environment Variables**: Add all variables from `.env.example` to the Render Dashboard.

## Project Structure
- `server.js`: Express backend with SQLite and Stripe logic.
- `src/App.jsx`: Main application controller and trial routing.
- `src/components/`: Luxury UI components (Splash, Lock, Dashboard).
- `data/`: Local SQLite storage (ensured via persistent disk).

## Troubleshooting
- **Database Errors**: Ensure the `data/` folder is writable in your environment.
- **Stripe Connection**: Verify your Webhook secret if payments are not updating the trial lock.
- **PWA Installation**: Ensure the site is served over HTTPS to enable the "Install App" prompt.

Designed with elegance. Built for scale.
**Powered by Layboka.**
