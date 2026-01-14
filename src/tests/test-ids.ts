/**
 * Test ID Selectors
 *
 * Constants for data-testid attributes used in component testing.
 * Provides type-safe, centralized test selectors that decouple tests
 * from implementation details.
 *
 * Usage in components:
 * ```svelte
 * <button data-testid={TEST_IDS.BUTTON.PRIMARY}>Click me</button>
 * ```
 *
 * Usage in tests:
 * ```typescript
 * screen.getByTestId(TEST_IDS.BUTTON.PRIMARY)
 * ```
 *
 * @module tests/test-ids
 */

/**
 * Common UI component test IDs
 */
export const BUTTON = {
	/** Primary action button */
	PRIMARY: 'button-primary',
	/** Secondary action button */
	SECONDARY: 'button-secondary',
	/** Danger/destructive action button */
	DANGER: 'button-danger',
	/** Ghost/minimal button */
	GHOST: 'button-ghost',
	/** Close/dismiss button */
	CLOSE: 'button-close',
	/** Icon-only button */
	ICON: 'button-icon'
} as const;

/**
 * Input field test IDs
 */
export const INPUT = {
	/** Text input field */
	TEXT: 'input-text',
	/** Email input field */
	EMAIL: 'input-email',
	/** Password input field */
	PASSWORD: 'input-password',
	/** Search input field */
	SEARCH: 'input-search',
	/** Number input field */
	NUMBER: 'input-number',
	/** Textarea field */
	TEXTAREA: 'input-textarea',
	/** Checkbox input */
	CHECKBOX: 'input-checkbox',
	/** Radio input */
	RADIO: 'input-radio',
	/** Select dropdown */
	SELECT: 'input-select'
} as const;

/**
 * Navigation test IDs
 */
export const NAV = {
	/** Main navigation container */
	MAIN: 'nav-main',
	/** Side navigation/sheet */
	SIDE: 'nav-side',
	/** Navigation menu toggle */
	TOGGLE: 'nav-toggle',
	/** Navigation link */
	LINK: 'nav-link',
	/** Breadcrumb navigation */
	BREADCRUMB: 'nav-breadcrumb'
} as const;

/**
 * Dashboard component test IDs
 */
export const DASHBOARD = {
	/** Main dashboard container */
	CONTAINER: 'dashboard-container',
	/** Dashboard header */
	HEADER: 'dashboard-header',
	/** Stats grid container */
	STATS_GRID: 'dashboard-stats-grid',
	/** Stats card */
	STATS_CARD: 'dashboard-stats-card',
	/** Activity feed */
	ACTIVITY_FEED: 'dashboard-activity-feed',
	/** Quick actions section */
	QUICK_ACTIONS: 'dashboard-quick-actions'
} as const;

/**
 * Agent card test IDs
 */
export const AGENT_CARD = {
	/** Agent card container */
	CONTAINER: 'agent-card-container',
	/** Agent name */
	NAME: 'agent-card-name',
	/** Agent role */
	ROLE: 'agent-card-role',
	/** Agent status indicator */
	STATUS: 'agent-card-status',
	/** Agent task */
	TASK: 'agent-card-task',
	/** Agent rig */
	RIG: 'agent-card-rig'
} as const;

/**
 * Convoy component test IDs
 */
export const CONVOY = {
	/** Convoy list container */
	LIST: 'convoy-list',
	/** Convoy item */
	ITEM: 'convoy-item',
	/** Convoy title */
	TITLE: 'convoy-title',
	/** Convoy status */
	STATUS: 'convoy-status',
	/** Convoy priority */
	PRIORITY: 'convoy-priority',
	/** Convoy issue count */
	ISSUE_COUNT: 'convoy-issue-count',
	/** Convoy details view */
	DETAILS: 'convoy-details'
} as const;

/**
 * Mail/inbox test IDs
 */
export const MAIL = {
	/** Mail inbox container */
	INBOX: 'mail-inbox',
	/** Mail message item */
	MESSAGE: 'mail-message',
	/** Message subject */
	SUBJECT: 'mail-subject',
	/** Message body */
	BODY: 'mail-body',
	/** Message from/sender */
	FROM: 'mail-from',
	/** Message timestamp */
	TIMESTAMP: 'mail-timestamp',
	/** Unread indicator */
	UNREAD: 'mail-unread',
	/** Message type badge */
	TYPE_BADGE: 'mail-type-badge',
	/** Compose button */
	COMPOSE: 'mail-compose'
} as const;

/**
 * Data table test IDs
 */
export const TABLE = {
	/** Table container */
	CONTAINER: 'table-container',
	/** Table header */
	HEADER: 'table-header',
	/** Table body */
	BODY: 'table-body',
	/** Table row */
	ROW: 'table-row',
	/** Table cell */
	CELL: 'table-cell',
	/** Column header */
	COLUMN_HEADER: 'table-column-header',
	/** Sort button */
	SORT: 'table-sort',
	/** Filter button */
	FILTER: 'table-filter',
	/** Pagination */
	PAGINATION: 'table-pagination'
} as const;

/**
 * Modal/dialog test IDs
 */
export const MODAL = {
	/** Modal container */
	CONTAINER: 'modal-container',
	/** Modal overlay */
	OVERLAY: 'modal-overlay',
	/** Modal header */
	HEADER: 'modal-header',
	/** Modal body */
	BODY: 'modal-body',
	/** Modal footer */
	FOOTER: 'modal-footer',
	/** Modal close button */
	CLOSE: 'modal-close',
	/** Modal confirm button */
	CONFIRM: 'modal-confirm',
	/** Modal cancel button */
	CANCEL: 'modal-cancel'
} as const;

/**
 * Toast notification test IDs
 */
export const TOAST = {
	/** Toast container */
	CONTAINER: 'toast-container',
	/** Toast message */
	MESSAGE: 'toast-message',
	/** Toast title */
	TITLE: 'toast-title',
	/** Toast description */
	DESCRIPTION: 'toast-description',
	/** Toast close button */
	CLOSE: 'toast-close',
	/** Toast action button */
	ACTION: 'toast-action'
} as const;

/**
 * Loading/skeleton test IDs
 */
export const LOADING = {
	/** Loading spinner */
	SPINNER: 'loading-spinner',
	/** Skeleton loader */
	SKELETON: 'loading-skeleton',
	/** Progress bar */
	PROGRESS: 'loading-progress',
	/** Loading overlay */
	OVERLAY: 'loading-overlay'
} as const;

/**
 * Empty state test IDs
 */
export const EMPTY_STATE = {
	/** Empty state container */
	CONTAINER: 'empty-state-container',
	/** Empty state icon */
	ICON: 'empty-state-icon',
	/** Empty state title */
	TITLE: 'empty-state-title',
	/** Empty state description */
	DESCRIPTION: 'empty-state-description',
	/** Empty state action button */
	ACTION: 'empty-state-action'
} as const;

/**
 * Virtual list test IDs
 */
export const VIRTUAL_LIST = {
	/** Virtual list container */
	CONTAINER: 'virtual-list-container',
	/** Virtual list viewport */
	VIEWPORT: 'virtual-list-viewport',
	/** Virtual list item */
	ITEM: 'virtual-list-item',
	/** Virtual list spacer (top) */
	SPACER_TOP: 'virtual-list-spacer-top',
	/** Virtual list spacer (bottom) */
	SPACER_BOTTOM: 'virtual-list-spacer-bottom'
} as const;

/**
 * Operation Center test IDs
 */
export const OPERATION_CENTER = {
	/** Operation Center container */
	CONTAINER: 'operation-center-container',
	/** Operation Center toggle */
	TOGGLE: 'operation-center-toggle',
	/** Operation Center panel */
	PANEL: 'operation-center-panel',
	/** Operation item */
	OPERATION: 'operation-center-operation',
	/** Operation status */
	STATUS: 'operation-center-status',
	/** Operation error */
	ERROR: 'operation-center-error'
} as const;

/**
 * Degraded Mode Banner test IDs
 */
export const DEGRADED_BANNER = {
	/** Banner container */
	CONTAINER: 'degraded-banner-container',
	/** Banner message */
	MESSAGE: 'degraded-banner-message',
	/** Banner icon */
	ICON: 'degraded-banner-icon',
	/** Banner dismiss button */
	DISMISS: 'degraded-banner-dismiss'
} as const;

/**
 * Page layout test IDs
 */
export const PAGE = {
	/** Page container */
	CONTAINER: 'page-container',
	/** Page header */
	HEADER: 'page-header',
	/** Page title */
	TITLE: 'page-title',
	/** Page content */
	CONTENT: 'page-content',
	/** Page footer */
	FOOTER: 'page-footer',
	/** Page sidebar */
	SIDEBAR: 'page-sidebar'
} as const;

/**
 * All test IDs organized by category
 */
export const TEST_IDS = {
	BUTTON,
	INPUT,
	NAV,
	DASHBOARD,
	AGENT_CARD,
	CONVOY,
	MAIL,
	TABLE,
	MODAL,
	TOAST,
	LOADING,
	EMPTY_STATE,
	VIRTUAL_LIST,
	OPERATION_CENTER,
	DEGRADED_BANNER,
	PAGE
} as const;

/**
 * Helper to create dynamic test IDs with suffixes
 *
 * @example
 * createTestId(TEST_IDS.CONVOY.ITEM, 'gu-pod') // 'convoy-item-gu-pod'
 */
export function createTestId(baseId: string, suffix: string | number): string {
	return `${baseId}-${suffix}`;
}

/**
 * Helper to create scoped test IDs
 *
 * @example
 * createScopedTestId('convoy', 'gu-pod', 'title') // 'convoy-gu-pod-title'
 */
export function createScopedTestId(scope: string, id: string | number, element: string): string {
	return `${scope}-${id}-${element}`;
}
