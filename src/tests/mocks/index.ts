/**
 * MSW Mocks Index
 *
 * Central export for all MSW mock utilities.
 *
 * @module tests/mocks
 */

export * from './handlers';

// Export server utilities with explicit naming
export {
	server,
	setupMockServer,
	teardownMockServer,
	resetMockServer,
	useHandlers as useServerHandlers
} from './server';

// Export browser utilities with explicit naming
export {
	worker,
	startMocking,
	stopMocking,
	resetHandlers,
	useHandlers as useBrowserHandlers
} from './browser';
