function searchFunction() {
  const query = document.getElementById('search-bar').value;
  // Replace this with code to fetch stock information using an API
  // Example: You can use a stock data API like Alpha Vantage or Yahoo Finance API

// Replace 'your_stock_data' with the actual stock data for the selected stock.
const StockData = {
  stockName: 'Nintendo Co. Ltd. ADR',
  stockCode: 'NTDOY U.S.: OTC',
  lastPrice: 123.45,  // Replace with actual data.
  percentChange: 2.5,  // Replace with actual data.
  volume: 1000000,  // Replace with actual data.
};

const searchResultsContainer = document.querySelector('.search-card-results');

// Function to display stock data in the search card.
function displayStockData(stockData) {
  searchResultsContainer.innerHTML = `
    <div class="stock-info-card">
      <h2>${stockData.stockName}</h2>
      <p>${stockData.stockCode}</p>
      <p>Last Price: ${stockData.lastPrice}</p>
      <p>% Change: ${stockData.percentChange}%</p>
      <p>Volume: ${stockData.volume}</p>
    </div>
  `;
}

// Call the function when the page loads or when a stock is selected.
displayStockData(StockData);
}