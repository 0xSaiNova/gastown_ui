/**
 * Test Environment Configuration
 *
 * Centralized configuration for test environments including API endpoints,
 * feature flags, and test-specific settings.
 *
 * @module tests/config
 */

/**
 * API configuration for tests
 */
export const API_CONFIG = {
	/** Base URL for API requests in tests */
	baseUrl: 'http://localhost:3000',

	/** API endpoints */
	endpoints: {
		agents: '/api/gastown/agents',
		convoys: '/api/gastown/convoys',
		mail: '/api/gastown/mail',
		snapshot: '/api/gastown/snapshot',
		operations: '/api/gastown/operations'
	},

	/** Request timeout in milliseconds */
	timeout: 5000,

	/** Retry configuration */
	retry: {
		maxAttempts: 3,
		delayMs: 100
	}
} as const;

/**
 * Feature flags for testing
 */
export const FEATURE_FLAGS = {
	/** Enable degraded mode banner */
	degradedMode: false,

	/** Enable operation center */
	operationCenter: true,

	/** Enable virtualization for long lists */
	virtualization: true,

	/** Enable known bug detection */
	knownBugDetection: true
} as const;

/**
 * Test data configuration
 */
export const TEST_DATA = {
	/** Default pagination size */
	defaultPageSize: 20,

	/** Maximum items for performance tests */
	maxItems: 1000,

	/** Virtualization threshold */
	virtualizationThreshold: 50
} as const;

/**
 * Test timing configuration
 */
export const TIMING = {
	/** Default debounce delay in ms */
	debounce: 300,

	/** Animation duration in ms */
	animation: 200,

	/** Toast auto-dismiss duration in ms */
	toastDuration: 5000,

	/** Network request timeout in ms */
	networkTimeout: 5000
} as const;

/**
 * Accessibility test configuration
 */
export const A11Y_CONFIG = {
	/** WCAG compliance level */
	wcagLevel: 'AA' as const,

	/** Axe-core rules to disable in tests */
	disabledRules: [] as string[],

	/** Minimum contrast ratio */
	contrastRatio: 4.5
} as const;

/**
 * Performance test thresholds
 */
export const PERFORMANCE_THRESHOLDS = {
	/** Maximum LCP (Largest Contentful Paint) in ms */
	lcp: 2500,

	/** Maximum FID (First Input Delay) in ms */
	fid: 100,

	/** Maximum CLS (Cumulative Layout Shift) */
	cls: 0.1,

	/** Maximum bundle size in KB */
	bundleSize: 500
} as const;

/**
 * Get the full URL for an API endpoint
 */
export function getApiUrl(endpoint: keyof typeof API_CONFIG.endpoints): string {
	return `${API_CONFIG.baseUrl}${API_CONFIG.endpoints[endpoint]}`;
}

/**
 * Check if a feature flag is enabled
 */
export function isFeatureEnabled(feature: keyof typeof FEATURE_FLAGS): boolean {
	return FEATURE_FLAGS[feature];
}

/**
 * Get environment-specific configuration
 */
export function getTestConfig() {
	return {
		api: API_CONFIG,
		features: FEATURE_FLAGS,
		data: TEST_DATA,
		timing: TIMING,
		a11y: A11Y_CONFIG,
		performance: PERFORMANCE_THRESHOLDS
	} as const;
}
