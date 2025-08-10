require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const ccxt = require('ccxt');

const app = express();
app.use(bodyParser.text({ type: '*/*' }));

// Parse alert payload safely
function parsePayload(raw) {
  try {
    return typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch {
    return null;
  }
}

// Place order on Alpaca
async function alpacaOrder(signal) {
  const url = (process.env.ALPACA_BASE_URL || 'https://paper-api.alpaca.markets') + '/v2/orders';
  const headers = {
    'APCA-API-KEY-ID': process.env.ALPACA_KEY,
    'APCA-API-SECRET-KEY': process.env.ALPACA_SECRET,
    'Content-Type': 'application/json',
  };

  const body = {
    symbol: signal.symbol,
    qty: signal.qty,
    side: signal.side,
    type: signal.type || 'market',
    time_in_force: 'gtc',
  };

  if (signal.stop) body.stop_price = signal.stop;
  if (signal.limit) body.limit_price = signal.limit;

  return axios.post(url, body, { headers });
}

// Place order on Binance via ccxt
async function binanceOrder(signal) {
  const exchange = new ccxt.binance({
    apiKey: process.env.BINANCE_KEY,
    secret: process.env.BINANCE_SECRET,
    enableRateLimit: true,
  });

  if (signal.type === 'market') {
    return exchange.createMarketOrder(signal.symbol, signal.side, signal.amount);
  } else {
    return exchange.createOrder(signal.symbol, 'limit', signal.side, signal.amount, signal.price);
  }
}

// Webhook endpoint
app.post('/webhook', async (req, res) => {
  res.send('ok'); // quick ack to TradingView

  const payload = parsePayload(req.body);
  if (!payload) {
    console.log('Invalid payload:', req.body);
    return;
  }

  try {
    let result;
    if (payload.exchange === 'alpaca') {
      result = await alpacaOrder(payload);
      console.log('Alpaca order placed:', result.data);
    } else if (payload.exchange === 'binance') {
      result = await binanceOrder(payload);
      console.log('Binance order placed:', result);
    } else {
      console.log('Unknown exchange:', payload.exchange);
    }
  } catch (err) {
    console.error('Order error:', err.response?.data || err.message);
  }
});

app.get('/', (req, res) => res.send('Billionaire-hustlabot is running.'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
