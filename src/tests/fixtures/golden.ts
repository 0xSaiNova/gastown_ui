/**
 * Golden Fixtures for Contract Tests
 *
 * Standardized test data representing valid API responses.
 * These fixtures ensure API contracts are maintained across tests.
 *
 * @module tests/fixtures/golden
 */

/**
 * Golden fixture for RigSnapshot
 */
export const GOLDEN_RIG_SNAPSHOT = {
	name: 'gastown_ui',
	status: 'active' as const,
	polecats: 3,
	has_witness: true,
	has_refinery: true,
	active_work: 2
};

/**
 * Golden fixture for PolecatSnapshot
 */
export const GOLDEN_POLECAT_SNAPSHOT = {
	id: 'gastown_ui-polecats-furiosa',
	name: 'Furiosa',
	role: 'polecat',
	rig: 'gastown_ui',
	status: 'running' as const,
	has_work: true,
	task: 'gu-v8gw'
};

/**
 * Golden fixture for ConvoySnapshot
 */
export const GOLDEN_CONVOY_SNAPSHOT = {
	id: 'gu-pod',
	title: 'Phase 1 Foundation Sprint',
	status: 'open',
	priority: 1,
	issue_count: 12
};

/**
 * Golden fixture for ActivitySnapshot
 */
export const GOLDEN_ACTIVITY_SNAPSHOT = {
	id: 'gu-cn7',
	title: 'Implement Operations Store for Operation Center',
	type: 'task',
	status: 'completed',
	updated_at: '2026-01-14T12:00:00Z'
};

/**
 * Golden fixture for GasТownSnapshot (full snapshot response)
 */
export const GOLDEN_GASTOWN_SNAPSHOT = {
	rigs: [
		GOLDEN_RIG_SNAPSHOT,
		{
			name: 'backend_service',
			status: 'idle' as const,
			polecats: 1,
			has_witness: false,
			has_refinery: false,
			active_work: 0
		}
	],
	polecats: [
		GOLDEN_POLECAT_SNAPSHOT,
		{
			id: 'gastown_ui-polecats-toast',
			name: 'Toast',
			role: 'polecat',
			rig: 'gastown_ui',
			status: 'idle' as const,
			has_work: false
		}
	],
	convoys: [
		GOLDEN_CONVOY_SNAPSHOT,
		{
			id: 'gu-598',
			title: 'Phase 1 UI Sprint',
			status: 'in_progress',
			priority: 2,
			issue_count: 8
		}
	],
	recent_activity: [
		GOLDEN_ACTIVITY_SNAPSHOT,
		{
			id: 'gu-9gt',
			title: 'Implement Known Bug Detection system',
			type: 'feature',
			status: 'completed',
			updated_at: '2026-01-14T11:30:00Z'
		}
	],
	timestamp: '2026-01-14T12:00:00Z'
};

/**
 * Golden fixture for MailMessage
 */
export const GOLDEN_MAIL_MESSAGE = {
	id: 'hq-6xll',
	from: 'mayor/',
	subject: 'NEW CONVOY: Config & Test Infrastructure',
	body: 'YOUR CONVOY (complete ALL 4):\n\n1. gu-v8gw - Environment Configuration module',
	timestamp: '2026-01-14T17:09:33Z',
	read: false,
	priority: 'normal' as const,
	messageType: 'CONVOY',
	threadId: 'thread-34f87e0a9c27'
};

/**
 * Golden fixture for mail inbox response
 */
export const GOLDEN_MAIL_INBOX = {
	messages: [
		GOLDEN_MAIL_MESSAGE,
		{
			id: 'hq-vns3',
			from: 'mayor/',
			subject: 'CONVOY: 4 Tasks - Complete ALL before signaling done',
			body: 'Complete all tasks in sequence.',
			timestamp: '2026-01-14T11:22:00Z',
			read: true,
			priority: 'high' as const,
			messageType: 'CONVOY',
			threadId: 'thread-abc123'
		}
	],
	unreadCount: 1,
	total: 2
};

/**
 * Golden fixture for Agent entity
 */
export const GOLDEN_AGENT = {
	id: 'agent-001',
	name: 'Furiosa',
	role: 'polecat',
	status: 'running' as const,
	rig: 'gastown_ui',
	created_at: '2026-01-14T10:00:00Z',
	updated_at: '2026-01-14T12:00:00Z'
};

/**
 * Golden fixture for Convoy entity (detailed)
 */
export const GOLDEN_CONVOY = {
	id: 'gu-pod',
	title: 'Phase 1 Foundation Sprint',
	description: 'Foundation infrastructure for GasTown UI',
	status: 'open',
	priority: 1,
	issues: [
		{
			id: 'gu-v8gw',
			title: 'Environment Configuration module',
			status: 'in_progress'
		},
		{
			id: 'gu-7isd',
			title: 'Create golden fixtures for contract tests',
			status: 'pending'
		}
	],
	issue_count: 12,
	assignee: 'gastown_ui/furiosa',
	created_at: '2026-01-14T09:00:00Z',
	updated_at: '2026-01-14T12:00:00Z'
};

/**
 * Golden fixture for API Error response
 */
export const GOLDEN_API_ERROR = {
	code: 'VALIDATION_ERROR' as const,
	message: 'Invalid request parameters',
	status: 400,
	details: {
		field: 'priority',
		error: 'Must be between 1 and 3'
	},
	retryable: false
};

/**
 * Golden fixture for API Success response wrapper
 */
export const GOLDEN_API_RESPONSE = {
	data: GOLDEN_GASTOWN_SNAPSHOT,
	status: 200,
	headers: new Headers({
		'content-type': 'application/json'
	})
};

/**
 * Create a variant of a golden fixture with custom overrides
 */
export function createFixtureVariant<T extends Record<string, any>>(
	base: T,
	overrides: Partial<T>
): T {
	return { ...base, ...overrides };
}

/**
 * Create multiple fixture variants at once
 */
export function createFixtureVariants<T extends Record<string, any>>(
	base: T,
	variants: Partial<T>[]
): T[] {
	return variants.map((overrides) => createFixtureVariant(base, overrides));
}
