/**
 * MSW (Mock Service Worker) Handlers
 *
 * Request handlers for mocking API responses in tests.
 * Uses golden fixtures to ensure consistent test data.
 *
 * @module tests/mocks/handlers
 */

import { http, HttpResponse } from 'msw';
import { API_CONFIG } from '../config';
import {
	GOLDEN_GASTOWN_SNAPSHOT,
	GOLDEN_MAIL_INBOX,
	GOLDEN_CONVOY,
	GOLDEN_AGENT,
	GOLDEN_API_ERROR
} from '../fixtures/golden';

/**
 * GasTown API handlers
 */
export const gastownHandlers = [
	/**
	 * GET /api/gastown/snapshot
	 * Returns the current state of GasTown
	 */
	http.get(`${API_CONFIG.baseUrl}/api/gastown/snapshot`, () => {
		return HttpResponse.json(GOLDEN_GASTOWN_SNAPSHOT);
	}),

	/**
	 * GET /api/gastown/mail
	 * Returns mail inbox data
	 */
	http.get(`${API_CONFIG.baseUrl}/api/gastown/mail`, () => {
		return HttpResponse.json(GOLDEN_MAIL_INBOX);
	}),

	/**
	 * GET /api/gastown/convoys
	 * Returns list of convoys
	 */
	http.get(`${API_CONFIG.baseUrl}/api/gastown/convoys`, () => {
		return HttpResponse.json({
			convoys: GOLDEN_GASTOWN_SNAPSHOT.convoys,
			total: GOLDEN_GASTOWN_SNAPSHOT.convoys.length
		});
	}),

	/**
	 * GET /api/gastown/convoys/:id
	 * Returns a single convoy by ID
	 */
	http.get(`${API_CONFIG.baseUrl}/api/gastown/convoys/:id`, ({ params }) => {
		const { id } = params;
		if (id === GOLDEN_CONVOY.id) {
			return HttpResponse.json(GOLDEN_CONVOY);
		}
		return HttpResponse.json(
			{ ...GOLDEN_API_ERROR, message: 'Convoy not found', code: 'NOT_FOUND', status: 404 },
			{ status: 404 }
		);
	}),

	/**
	 * GET /api/gastown/agents (placeholder - assuming endpoint exists)
	 * Returns list of agents
	 */
	http.get(`${API_CONFIG.baseUrl}/api/gastown/agents`, () => {
		return HttpResponse.json({
			agents: [GOLDEN_AGENT],
			total: 1
		});
	}),

	/**
	 * POST /api/gastown/operations (example of POST handler)
	 * Creates a new operation
	 */
	http.post(`${API_CONFIG.baseUrl}/api/gastown/operations`, async ({ request }) => {
		const body = (await request.json()) as Record<string, any>;
		return HttpResponse.json(
			{
				id: 'op-001',
				...body,
				created_at: new Date().toISOString()
			},
			{ status: 201 }
		);
	})
];

/**
 * Error simulation handlers
 * Use these to test error handling scenarios
 */
export const errorHandlers = [
	/**
	 * Simulate network timeout
	 */
	http.get(`${API_CONFIG.baseUrl}/api/gastown/timeout`, async () => {
		await new Promise((resolve) => setTimeout(resolve, API_CONFIG.timeout + 1000));
		return HttpResponse.json({ error: 'Timeout' }, { status: 504 });
	}),

	/**
	 * Simulate server error
	 */
	http.get(`${API_CONFIG.baseUrl}/api/gastown/error`, () => {
		return HttpResponse.json(
			{ ...GOLDEN_API_ERROR, message: 'Internal server error', code: 'SERVER_ERROR', status: 500 },
			{ status: 500 }
		);
	}),

	/**
	 * Simulate unauthorized error
	 */
	http.get(`${API_CONFIG.baseUrl}/api/gastown/unauthorized`, () => {
		return HttpResponse.json(
			{ ...GOLDEN_API_ERROR, message: 'Unauthorized', code: 'UNAUTHORIZED', status: 401 },
			{ status: 401 }
		);
	}),

	/**
	 * Simulate rate limit error
	 */
	http.get(`${API_CONFIG.baseUrl}/api/gastown/rate-limit`, () => {
		return HttpResponse.json(
			{
				...GOLDEN_API_ERROR,
				message: 'Too many requests',
				code: 'RATE_LIMITED',
				status: 429,
				retryable: true
			},
			{
				status: 429,
				headers: {
					'Retry-After': '60'
				}
			}
		);
	})
];

/**
 * Default handlers for tests
 * Combines all GasTown handlers
 */
export const handlers = [...gastownHandlers];

/**
 * All handlers including error scenarios
 */
export const allHandlers = [...gastownHandlers, ...errorHandlers];

/**
 * Helper to override a handler for a specific test
 */
export function createHandlerOverride(
	method: 'get' | 'post' | 'put' | 'patch' | 'delete',
	path: string,
	response: any,
	status: number = 200
) {
	const fullPath = path.startsWith('http') ? path : `${API_CONFIG.baseUrl}${path}`;
	return http[method](fullPath, () => {
		return HttpResponse.json(response, { status });
	});
}

/**
 * Helper to create a delayed response handler
 */
export function createDelayedHandler(
	method: 'get' | 'post' | 'put' | 'patch' | 'delete',
	path: string,
	response: any,
	delayMs: number = 1000
) {
	const fullPath = path.startsWith('http') ? path : `${API_CONFIG.baseUrl}${path}`;
	return http[method](fullPath, async () => {
		await new Promise((resolve) => setTimeout(resolve, delayMs));
		return HttpResponse.json(response);
	});
}
