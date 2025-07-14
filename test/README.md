# Learning Platform Performance Tests

This folder contains scripts to test the performance of the learning platform, including:

- Connection capacity (how many users can connect simultaneously)
- Latency measurements (how quickly data is transferred between users)
- Room creation and joining functionality

## Running the Tests

1. Install dependencies:

```
cd test
npm install
```

2. Run the connection test:

```
npm test
```

3. Generate a visual report from the results:

```
node visualize_results.js
```

4. Open `report.html` in your browser to view the results.

## Test Configuration

You can modify the following parameters in `connection_test.js`:

- `NUM_CLIENTS`: Number of simulated clients (default: 50)
- `TEST_DURATION`: Duration of the test in milliseconds (default: 60000)
- `ELEMENT_SEND_INTERVAL`: How often to send test elements (default: 1000ms)

## Results

The test results are saved in `results.json` and include:

- Number of successful connections
- Maximum concurrent connections achieved
- Average connection time
- Average latency for data transmission
- Number of elements successfully received

These metrics can be used to demonstrate the platform's performance capabilities in a resume or portfolio.
