let currentSymbol = "";
let lastLivePrice = null;

const ctx = document.getElementById('stockChart').getContext('2d');

const stockChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Price (Last 30 Days)',
      data: [],
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99,102,241,0.15)',
      tension: 0.3,
      fill: true
    }]
  }
});

async function handleSearch() {
  const symbol = document.getElementById('symbolInput').value.trim().toUpperCase();
  if (!symbol) return;

  currentSymbol = symbol;
  addMessage(`📊 Fetching historical data for ${symbol}...`);

  const response = await fetch(`/api/historical/${symbol}`);
  const data = await response.json();

  if (data.error) {
    addMessage("❌ " + data.error);
    return;
  }

  stockChart.data.labels = data.dates;
  stockChart.data.datasets[0].data = data.prices;
  stockChart.update();

  lastLivePrice = parseFloat(data.prices[data.prices.length - 1]);
  document.getElementById("livePrice").innerText = "₹" + lastLivePrice;

  addMessage(`📈 Showing 1-month data for ${symbol}`);
}

async function fetchLiveUpdate() {
  if (!currentSymbol) return;

  try {
    const response = await fetch(`/api/live/${currentSymbol}`);
    const data = await response.json();

    if (data.error) return;

    const newPrice = parseFloat(data.price);
    const changePercent = data.changePercent;

    document.getElementById("livePrice").innerText = "₹" + newPrice;
    document.getElementById("priceChange").innerText = changePercent;

    let emoji = "⏺";
    let directionText = "stable";

    if (lastLivePrice) {
      if (newPrice > lastLivePrice) {
        emoji = "📈";
        directionText = "up";
      } else if (newPrice < lastLivePrice) {
        emoji = "📉";
        directionText = "down";
      }
    }

    addLiveFeedItem(`${emoji} ${currentSymbol} ${directionText} (${changePercent})`);

    lastLivePrice = newPrice;

  } catch (err) {
    console.log("Live update failed");
  }
}
setInterval(fetchLiveUpdate, 30000);

function addLiveFeedItem(text) {
  const feed = document.getElementById("liveFeedList");
  const item = document.createElement("div");
  item.className = "feed-item";
  item.innerText = text;
  feed.prepend(item);

  if (feed.children.length > 10) {
    feed.removeChild(feed.lastChild);
  }
}

function addMessage(text) {
  const chatBox = document.getElementById("chatBox");
  const msg = document.createElement("div");
  msg.className = "bot-msg";
  msg.innerText = text;
  chatBox.appendChild(msg);
}

function showPopup(message) {
  const popup = document.getElementById("popup");
  popup.innerText = message;
  popup.style.right = "25px";
  setTimeout(() => popup.style.right = "-350px", 4000);
}