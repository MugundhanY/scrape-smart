import http from 'k6/http';
import { check, sleep, group } from 'k6';
import authScenario from './scenarios/auth.js';
import workflowScenario from './scenarios/workflows.js';

// Configuration
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export const options = {
    stages: [
        { duration: '30s', target: 20 },   // Ramp up to 20 users
        { duration: '1m', target: 50 },    // Ramp up to 50 users
        { duration: '2m', target: 100 },   // Ramp up to 100 users
        { duration: '2m', target: 200 },   // Ramp up to 200 users
        { duration: '2m', target: 200 },   // Stay at 200 users
        { duration: '1m', target: 100 },   // Ramp down to 100
        { duration: '30s', target: 50 },   // Ramp down to 50
        { duration: '30s', target: 0 },    // Ramp down to 0
    ],
    thresholds: {
        http_req_duration: ['p(95)<500', 'p(99)<1000'],
        http_req_failed: ['rate<0.05'],
        http_reqs: ['rate>10'],
    },
};

export default function () {
    // Scenario 1: Health Check & API Tests
    group('Health & API', () => {
        const healthRes = http.get(`${BASE_URL}/api/health`);
        check(healthRes, {
            'health check status is 200': (r) => r.status === 200,
            'health check response time < 200ms': (r) => r.timings.duration < 200,
        });

        sleep(1);
    });

    // Scenario 2: Auth Flow
    group('Authentication Flow', () => {
        authScenario();
    });

    // Scenario 3: Workflow Operations
    group('Workflow Operations', () => {
        workflowScenario();
    });

    // Scenario 4: Static Pages
    group('Static Pages', () => {
        const homeRes = http.get(`${BASE_URL}/`);
        check(homeRes, {
            'homepage status is 200': (r) => r.status === 200,
            'homepage loads in < 500ms': (r) => r.timings.duration < 500,
        });

        sleep(1);
    });

    // Wait between iterations
    sleep(Math.random() * 3 + 2); // Random sleep between 2-5 seconds
}

// Setup function (runs once per VU before main function)
export function setup() {
    console.log(`Starting load test against: ${BASE_URL}`);
    console.log(`Target: 200 concurrent users`);
    console.log(`Performance thresholds: p95 < 500ms, p99 < 1000ms`);

    // Verify the application is accessible
    const res = http.get(`${BASE_URL}/api/health`);
    if (res.status !== 200) {
        console.log(`Warning: Health check returned status ${res.status}. Continuing anyway...`);
    } else {
        console.log('Application is healthy. Starting load test...');
    }
}

// Teardown function (runs once after test completion)
export function teardown(data) {
    console.log('Load test completed!');
    console.log('Check the summary for detailed metrics.');
}

// Handle summary with null checks
export function handleSummary(data) {
    // Only generate console output, skip file to avoid errors
    return {
        'stdout': textSummary(data, { indent: ' ', enableColors: true }),
    };
}

function textSummary(data, options = {}) {
    const indent = options.indent || '';
    let summary = '\n';

    try {
        summary += `${indent}✓ Test Duration: ${(data.state.testRunDurationMs / 1000).toFixed(2)}s\n`;

        if (data.metrics.http_reqs && data.metrics.http_reqs.values) {
            summary += `${indent}✓ Total Requests: ${data.metrics.http_reqs.values.count || 0}\n`;
            summary += `${indent}✓ Request Rate: ${(data.metrics.http_reqs.values.rate || 0).toFixed(2)} req/s\n`;
        }

        if (data.metrics.http_req_failed && data.metrics.http_req_failed.values) {
            summary += `${indent}✓ Failed Requests: ${((data.metrics.http_req_failed.values.rate || 0) * 100).toFixed(2)}%\n`;
        }

        if (data.metrics.http_req_duration && data.metrics.http_req_duration.values) {
            summary += `${indent}✓ Avg Response Time: ${(data.metrics.http_req_duration.values.avg || 0).toFixed(2)}ms\n`;
            summary += `${indent}✓ p95 Response Time: ${(data.metrics.http_req_duration.values['p(95)'] || 0).toFixed(2)}ms\n`;
            summary += `${indent}✓ p99 Response Time: ${(data.metrics.http_req_duration.values['p(99)'] || 0).toFixed(2)}ms\n`;
        }
    } catch (e) {
        summary += `${indent}Error generating summary: ${e.message}\n`;
    }

    return summary;
}
