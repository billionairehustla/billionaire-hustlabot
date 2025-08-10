# Billionaire-hustlabot

## Overview

This bot listens for TradingView webhook alerts and places orders automatically on your chosen broker — currently supports **Alpaca** (stocks) and **Binance** (crypto).

---

## Setup Instructions (Grandma-Friendly!)

### Step 1: Create a GitHub Repository

1. Go to https://github.com/new
2. Name the repo `Billionaire-hustlabot`
3. Make it Public (or Private if you prefer)
4. Create the repo

### Step 2: Add the Bot Files

Copy the files (`server.js`, `.env.example`, `package.json`, `Procfile`) into your repo.

You can do this by uploading files directly on GitHub or cloning and pushing via Git.

---

### Step 3: Connect to Railway

1. Go to https://railway.app and log in with your GitHub account.
2. Click **New Project** → **Deploy from GitHub Repo**.
3. Select your `Billionaire-hustlabot` repo.
4. Set environment variables (API keys, secrets) under **Settings → Environment Variables**:
    - `ALPACA_KEY` and `ALPACA_SECRET` for Alpaca.
    - `BINANCE_KEY` and `BINANCE_SECRET` for Binance.
5. Click **Deploy** and wait for the bot to start.

---

### Step 4: Configure TradingView Alerts

1. Open TradingView and set up alerts on your strategy.
2. Use this **Webhook URL** from Railway (example):
    ```
    https://your-bot-url.up.railway.app/webhook
    ```
3. Use this **Alert Message** format (JSON):

```json
{
  "exchange": "alpaca",
  "symbol": "AAPL",
  "qty": 1,
  "side": "buy",
  "type": "market"
}
