/**
 * MSW Browser Setup
 *
 * Configures Mock Service Worker for browser environments (E2E tests).
 * Use this to intercept network requests in Playwright tests.
 *
 * @module tests/mocks/browser
 */

import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

/**
 * MSW worker for browser environment
 */
export const worker = setupWorker(...handlers);

/**
 * Start the MSW worker for browser tests
 */
export function startMocking() {
	return worker.start({
		onUnhandledRequest: 'warn'
	});
}

/**
 * Stop the MSW worker
 */
export function stopMocking() {
	return worker.stop();
}

/**
 * Reset handlers to initial state
 */
export function resetHandlers() {
	return worker.resetHandlers();
}

/**
 * Use custom handlers for a specific test
 */
export function useHandlers(...newHandlers: Parameters<typeof worker.use>) {
	return worker.use(...newHandlers);
}
