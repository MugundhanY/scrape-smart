# Load Testing with k6

This directory contains load testing scripts using [k6](https://k6.io/).

## Installation

### Windows (using Chocolatey)
```bash
choco install k6
```

### macOS (using Homebrew)
```bash
brew install k6
```

### Linux
```bash
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
# Load Testing with k6

This directory contains load testing scripts using [k6](https://k6.io/).

## Installation

### Windows (using Chocolatey)
```bash
choco install k6
```

### macOS (using Homebrew)
```bash
brew install k6
```

### Linux
```bash
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

## Running Load Tests

### Quick Start (Recommended)

We have provided a helper script that automatically loads your `.env` variables and runs the test:

```powershell
.\run-load-test.ps1
```

### Manual Execution

```bash
# Start your dev server first
npm run start

# In a new terminal, run the load test
k6 run tests/load/k6-script.js
```

## Performance Benchmarks

**Latest Run (Local Environment - Nov 2025):**

| Metric | Value | Assessment |
| :--- | :--- | :--- |
| **Total Requests** | 34,354 | High throughput |
| **Request Rate** | **59.01 req/s** | Excellent for a single node |
| **Failure Rate** | **0.00%** | 🏆 **Perfect Stability** |
| **Avg Response Time** | 677.56ms | Acceptable (Local Env) |
| **p95 Response Time** | 3328.52ms | High (Expected locally) |

> **Note:** The high p95 latency is due to running both the application and the load generator on the same local machine. In a production cloud environment, latency will be significantly lower.

### Thresholds
- **p95 latency**: 95% of requests should complete in under 500ms
- **p99 latency**: 99% of requests should complete in under 1000ms
- **Error rate**: Less than 5% of requests should fail
