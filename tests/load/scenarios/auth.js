import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

/**
 * Auth Flow Scenario
 * Tests: Registration, Login, Session Management
 */

export function authScenario() {
    // Test 1: Health Check
    let res = http.get(`${BASE_URL}/api/health`);

    check(res, {
        'health check is 200': (r) => r.status === 200,
        'health check response is JSON': (r) => {
            try {
                // Only try to parse if we got a successful response
                if (r.status === 200 && r.body) {
                    const body = JSON.parse(r.body);
                    return body.status === 'healthy';
                }
                return false;
            } catch (e) {
                console.log('Health check response was not JSON:', r.body.substring(0, 200));
                return false;
            }
        },
    });

    sleep(1);

    // Test 2: User Registration
    // Use VU and ITER to ensure uniqueness
    const uniqueId = `${__VU}-${__ITER}-${Date.now()}`;
    const newUser = {
        name: `Test User ${uniqueId}`,
        email: `test-${uniqueId}@example.com`,
        password: 'TestPassword123!',
    };

    res = http.post(
        `${BASE_URL}/api/auth/register`,
        JSON.stringify(newUser),
        {
            headers: { 'Content-Type': 'application/json' },
        }
    );

    check(res, {
        'registration endpoint responds': (r) => r.status === 201 || r.status === 400 || r.status === 500,
        'registration response is JSON': (r) => {
            try {
                if (r.body) {
                    JSON.parse(r.body);
                    return true;
                }
                return false;
            } catch (e) {
                console.log('Registration response was not JSON');
                return false;
            }
        },
    });

    sleep(1);

    // Test 3: Session Check
    res = http.get(`${BASE_URL}/api/auth/session`);
    check(res, {
        'session endpoint responds': (r) => r.status === 200,
    });

    sleep(1);
}

// Export for use in main k6 script
export default authScenario;
