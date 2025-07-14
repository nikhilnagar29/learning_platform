const fs = require('fs');
const path = require('path');

// Read results file
const resultsPath = path.join(__dirname, 'results.json');
const reportPath = path.join(__dirname, 'report.html');

try {
  const rawData = fs.readFileSync(resultsPath);
  const results = JSON.parse(rawData);
  
  // Generate HTML report
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Learning Platform Performance Test Results</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      color: #333;
      border-bottom: 2px solid #eee;
      padding-bottom: 10px;
    }
    .stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 30px;
    }
    .stat-card {
      background-color: #f9f9f9;
      border-radius: 8px;
      padding: 15px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .stat-value {
      font-size: 24px;
      font-weight: bold;
      color: #2c7be5;
      margin: 10px 0;
    }
    .stat-label {
      color: #666;
      font-size: 14px;
    }
    .summary {
      background-color: #e9f7ef;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    .timestamp {
      color: #666;
      font-style: italic;
      margin-top: 30px;
    }
  </style>
</head>
<body>
  <h1>Learning Platform Performance Test Results</h1>
  
  <div class="summary">
    <h2>Summary</h2>
    <p>This test simulated ${results.totalClients} clients connecting to the learning platform over ${results.testDuration} seconds.</p>
  </div>
  
  <div class="stats">
    <div class="stat-card">
      <div class="stat-label">Successful Connections</div>
      <div class="stat-value">${results.successfulConnections}/${results.totalClients}</div>
      <div class="stat-label">Success Rate: ${((results.successfulConnections / results.totalClients) * 100).toFixed(1)}%</div>
    </div>
    
    <div class="stat-card">
      <div class="stat-label">Max Concurrent Connections</div>
      <div class="stat-value">${results.maxConcurrentConnections}</div>
    </div>
    
    <div class="stat-card">
      <div class="stat-label">Average Connection Time</div>
      <div class="stat-value">${results.averageConnectionTime.toFixed(2)} ms</div>
    </div>
    
    <div class="stat-card">
      <div class="stat-label">Average Latency</div>
      <div class="stat-value">${results.averageLatency.toFixed(2)} ms</div>
    </div>
    
    <div class="stat-card">
      <div class="stat-label">Elements Received</div>
      <div class="stat-value">${results.elementsReceived || 0}</div>
    </div>
    
    <div class="stat-card">
      <div class="stat-label">Failed Connections</div>
      <div class="stat-value">${results.failedConnections}</div>
    </div>
  </div>
  
  <div class="timestamp">
    Test conducted on: ${new Date(results.timestamp).toLocaleString()}
  </div>
</body>
</html>
  `;
  
  fs.writeFileSync(reportPath, html);
  console.log(`Report generated at ${reportPath}`);
  
} catch (error) {
  console.error('Error generating report:', error);
} 