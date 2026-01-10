/**
 * Shared Date/Time Formatting Utilities
 *
 * Consolidates duplicated date formatting functions from across the codebase.
 * All functions use consistent locale settings (en-US) for uniformity.
 */

/**
 * Format an ISO date string as a relative time (e.g., "5m ago", "2h ago", "3d ago")
 * Falls back to formatted date for times older than 7 days.
 *
 * @param isoString - ISO date string (e.g., "2025-01-10T14:30:00Z")
 * @param fallbackFormat - Format to use for dates older than 7 days (default: 'short')
 * @returns Formatted relative time string
 */
export function formatRelativeTime(
	isoString: string | null | undefined,
	fallbackFormat: 'short' | 'long' = 'short'
): string {
	if (!isoString) return '';

	const date = new Date(isoString);
	if (isNaN(date.getTime())) return '';

	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffSecs = Math.floor(diffMs / 1000);
	const diffMins = Math.floor(diffSecs / 60);
	const diffHours = Math.floor(diffMins / 60);
	const diffDays = Math.floor(diffHours / 24);

	if (diffSecs < 60) return 'just now';
	if (diffMins < 60) return `${diffMins}m ago`;
	if (diffHours < 24) return `${diffHours}h ago`;
	if (diffDays < 7) return `${diffDays}d ago`;

	// Fallback to formatted date for older times
	return fallbackFormat === 'long' ? formatTimestamp(isoString) : formatDate(isoString);
}

/**
 * Format an ISO date string as a full timestamp with weekday
 * e.g., "Mon, Jan 10, 2:30 PM"
 *
 * @param isoString - ISO date string
 * @returns Formatted timestamp string
 */
export function formatTimestamp(isoString: string | null | undefined): string {
	if (!isoString) return 'Unknown';

	const date = new Date(isoString);
	if (isNaN(date.getTime())) return 'Invalid date';

	return date.toLocaleDateString('en-US', {
		weekday: 'short',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});
}

/**
 * Format an ISO date string as a short date with time
 * e.g., "Jan 10, 2:30 PM" or "Jan 10, 2025, 2:30 PM" (with year option)
 *
 * @param isoString - ISO date string
 * @param includeYear - Whether to include the year (default: false)
 * @returns Formatted date string
 */
export function formatDate(
	isoString: string | null | undefined,
	includeYear: boolean = false
): string {
	if (!isoString) return 'Unknown';

	const date = new Date(isoString);
	if (isNaN(date.getTime())) return 'Invalid date';

	const options: Intl.DateTimeFormatOptions = {
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	};

	if (includeYear) {
		options.year = 'numeric';
	}

	return date.toLocaleDateString('en-US', options);
}

/**
 * Format an ISO date string as time only
 * e.g., "2:30:45 PM"
 *
 * @param isoString - ISO date string
 * @param includeSeconds - Whether to include seconds (default: true)
 * @returns Formatted time string
 */
export function formatTime(
	isoString: string | null | undefined,
	includeSeconds: boolean = true
): string {
	if (!isoString) return 'Never';

	const date = new Date(isoString);
	if (isNaN(date.getTime())) return 'Invalid time';

	const options: Intl.DateTimeFormatOptions = {
		hour: '2-digit',
		minute: '2-digit'
	};

	if (includeSeconds) {
		options.second = '2-digit';
	}

	return date.toLocaleTimeString('en-US', options);
}

/**
 * Format an ISO date string as a friendly date label
 * Returns "Today", "Yesterday", or formatted date for older dates
 *
 * @param isoString - ISO date string
 * @returns "Today", "Yesterday", or formatted date
 */
export function formatFriendlyDate(isoString: string | null | undefined): string {
	if (!isoString) return 'Unknown';

	const date = new Date(isoString);
	if (isNaN(date.getTime())) return 'Invalid date';

	const today = new Date();
	const yesterday = new Date(today);
	yesterday.setDate(yesterday.getDate() - 1);

	if (date.toDateString() === today.toDateString()) {
		return 'Today';
	} else if (date.toDateString() === yesterday.toDateString()) {
		return 'Yesterday';
	}

	return date.toLocaleDateString('en-US', {
		weekday: 'short',
		month: 'short',
		day: 'numeric'
	});
}

/**
 * Format a duration in milliseconds to a human-readable string
 * e.g., "2h 30m", "45s", "3d 2h"
 *
 * @param ms - Duration in milliseconds
 * @returns Formatted duration string
 */
export function formatDuration(ms: number): string {
	if (ms < 0) return '0s';

	const seconds = Math.floor(ms / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	if (days > 0) {
		const remainingHours = hours % 24;
		return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
	}
	if (hours > 0) {
		const remainingMins = minutes % 60;
		return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`;
	}
	if (minutes > 0) {
		return `${minutes}m`;
	}
	return `${seconds}s`;
}

/**
 * Check if a date is today
 *
 * @param isoString - ISO date string
 * @returns true if the date is today
 */
export function isToday(isoString: string | null | undefined): boolean {
	if (!isoString) return false;
	const date = new Date(isoString);
	const today = new Date();
	return date.toDateString() === today.toDateString();
}

/**
 * Check if a date is in the past
 *
 * @param isoString - ISO date string
 * @returns true if the date is in the past
 */
export function isPast(isoString: string | null | undefined): boolean {
	if (!isoString) return false;
	return new Date(isoString).getTime() < Date.now();
}
