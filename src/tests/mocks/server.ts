/**
 * MSW Server Setup
 *
 * Configures Mock Service Worker for Node.js environments (unit tests).
 * Use this to intercept network requests in Vitest tests.
 *
 * @module tests/mocks/server
 */

import { setupServer } from 'msw/node';
import { handlers } from './handlers';

/**
 * MSW server for Node.js environment
 */
export const server = setupServer(...handlers);

/**
 * Setup function to be called before all tests
 */
export function setupMockServer() {
	// Start the server before all tests
	server.listen({
		onUnhandledRequest: 'warn'
	});
}

/**
 * Cleanup function to be called after all tests
 */
export function teardownMockServer() {
	// Stop the server after all tests
	server.close();
}

/**
 * Reset function to be called after each test
 */
export function resetMockServer() {
	// Reset handlers after each test
	server.resetHandlers();
}

/**
 * Use custom handlers for a specific test
 */
export function useHandlers(...newHandlers: Parameters<typeof server.use>) {
	server.use(...newHandlers);
}
