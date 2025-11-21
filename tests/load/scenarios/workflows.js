import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const API_SECRET = __ENV.API_SECRET || 'dc8627d5429302d398ba342940e00d2f176b4403208a33f0193b56cca255b041';

/**
 * Workflow Scenario
 * Tests: Workflow execution, cron triggers
 */

export function workflowScenario() {
    // Test 1: Workflow Cron Endpoint (with auth)
    let res = http.get(`${BASE_URL}/api/workflows/cron`, {
        headers: {
            'Authorization': `Bearer ${API_SECRET}`,
        },
    });

    check(res, {
        'workflow cron responds': (r) => r.status === 200 || r.status === 401,
        'workflow cron returns workflow count': (r) => {
            if (r.status === 200) {
                try {
                    const body = JSON.parse(r.body);
                    return body.workflowsToRun !== undefined;
                } catch {
                    return false;
                }
            }
            return true; // 401 is expected without valid secret
        },
    });

    sleep(1);

    // Test 2: Homepage Load
    res = http.get(`${BASE_URL}/`);
    check(res, {
        'homepage loads': (r) => r.status === 200,
        'homepage has content': (r) => r.body.length > 0,
    });

    sleep(1);

    // Test 3: Dashboard/App Routes
    res = http.get(`${BASE_URL}/workflows`);
    check(res, {
        'workflows page responds': (r) => r.status === 200 || r.status === 307 || r.status === 401,
    });

    sleep(1);
}

// Export for use in main k6 script
export default workflowScenario;
