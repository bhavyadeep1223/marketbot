const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.API_KEY;

async function getHistoricalData(symbol) {
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}.BSE&apikey=${API_KEY}`;

  const response = await axios.get(url);
  const data = response.data["Time Series (Daily)"];

  if (!data) {
    throw new Error("Invalid Symbol or API limit reached");
  }

  const dates = Object.keys(data).slice(0, 30);
  const prices = dates.map(date => data[date]["4. close"]);

  return {
    dates: dates.reverse(),
    prices: prices.reverse()
  };
}

async function getLivePrice(symbol) {
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}.BSE&apikey=${API_KEY}`;

  const response = await axios.get(url);
  const data = response.data["Global Quote"];

  if (!data) {
    throw new Error("Live price unavailable");
  }

  return {
    price: data["05. price"],
    changePercent: data["10. change percent"]
  };
}

module.exports = { getHistoricalData, getLivePrice };