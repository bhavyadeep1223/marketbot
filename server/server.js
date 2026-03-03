const express = require('express');
const cors = require('cors');
const db = require('./db');
const { getHistoricalData, getLivePrice } = require('./marketService');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/api/historical/:symbol', async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();

  try {
    const result = await getHistoricalData(symbol);
    db.run(`INSERT INTO searches(symbol) VALUES(?)`, [symbol]);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/live/:symbol', async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();

  try {
    const result = await getLivePrice(symbol);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});