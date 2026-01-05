/**
 * Service Worker registration and update detection utilities.
 * Provides reactive state for service worker lifecycle events.
 */

export type ServiceWorkerState =
	| 'unsupported'
	| 'installing'
	| 'installed'
	| 'activating'
	| 'activated'
	| 'update-available'
	| 'error';

export interface ServiceWorkerRegistrationResult {
	/** Current state of the service worker */
	state: ServiceWorkerState;
	/** The waiting service worker when an update is available */
	waitingWorker: ServiceWorker | null;
	/** Error message if registration failed */
	error: string | null;
	/** Skip waiting and activate the new service worker */
	skipWaiting: () => void;
	/** Reload the page to use the new service worker */
	reload: () => void;
}

/**
 * Registers a service worker and returns reactive state.
 * Call this once at app initialization.
 *
 * @param scriptUrl - Path to the service worker script (default: '/sw.js')
 * @param options - ServiceWorker registration options
 * @returns Object with state, waiting worker, and control functions
 *
 * @example
 * ```typescript
 * const { state, skipWaiting, reload } = registerServiceWorker();
 *
 * // In your component
 * if (state === 'update-available') {
 *   // Show update prompt
 * }
 * ```
 */
export function registerServiceWorker(
	scriptUrl = '/sw.js',
	options?: RegistrationOptions
): ServiceWorkerRegistrationResult {
	const result: ServiceWorkerRegistrationResult = {
		state: 'unsupported',
		waitingWorker: null,
		error: null,
		skipWaiting: () => {},
		reload: () => {}
	};

	// Check for service worker support
	if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
		return result;
	}

	result.state = 'installing';

	// Register the service worker
	navigator.serviceWorker
		.register(scriptUrl, options)
		.then((registration) => {
			// Track the waiting worker for updates
			const updateWaitingWorker = () => {
				if (registration.waiting) {
					result.state = 'update-available';
					result.waitingWorker = registration.waiting;
				}
			};

			// Initial check for waiting worker
			updateWaitingWorker();

			// Listen for new service worker installing
			registration.addEventListener('updatefound', () => {
				const newWorker = registration.installing;
				if (!newWorker) return;

				result.state = 'installing';

				newWorker.addEventListener('statechange', () => {
					switch (newWorker.state) {
						case 'installed':
							if (navigator.serviceWorker.controller) {
								// New update available
								result.state = 'update-available';
								result.waitingWorker = newWorker;
							} else {
								// First install
								result.state = 'installed';
							}
							break;
						case 'activating':
							result.state = 'activating';
							break;
						case 'activated':
							result.state = 'activated';
							break;
					}
				});
			});

			// Set up skipWaiting function
			result.skipWaiting = () => {
				if (result.waitingWorker) {
					result.waitingWorker.postMessage({ type: 'SKIP_WAITING' });
				}
			};

			// Set up reload function for graceful reload
			result.reload = () => {
				if (result.waitingWorker) {
					result.skipWaiting();
				}
				window.location.reload();
			};

			// If already activated
			if (registration.active && !registration.waiting) {
				result.state = 'activated';
			}
		})
		.catch((error) => {
			result.state = 'error';
			result.error = error instanceof Error ? error.message : 'Service worker registration failed';
		});

	// Listen for controller change (when new SW takes over)
	navigator.serviceWorker.addEventListener('controllerchange', () => {
		// Optionally auto-reload on controller change
		// This happens after skipWaiting is called
	});

	return result;
}

/**
 * Creates a Svelte-compatible reactive service worker registration.
 * Returns a store-like object that updates when SW state changes.
 *
 * @param scriptUrl - Path to the service worker script
 * @returns Reactive service worker state
 *
 * @example
 * ```svelte
 * <script>
 *   import { createServiceWorkerStore } from '$lib/serviceWorker';
 *   const sw = createServiceWorkerStore();
 * </script>
 *
 * {#if sw.state === 'update-available'}
 *   <UpdatePrompt onUpdate={sw.reload} />
 * {/if}
 * ```
 */
export function createServiceWorkerStore(
	scriptUrl = '/sw.js',
	options?: RegistrationOptions
): {
	subscribe: (fn: (value: ServiceWorkerRegistrationResult) => void) => () => void;
	skipWaiting: () => void;
	reload: () => void;
} {
	const subscribers = new Set<(value: ServiceWorkerRegistrationResult) => void>();

	let currentState: ServiceWorkerRegistrationResult = {
		state: 'unsupported',
		waitingWorker: null,
		error: null,
		skipWaiting: () => {},
		reload: () => {}
	};

	const notify = () => {
		subscribers.forEach(fn => fn(currentState));
	};

	// Check for service worker support
	if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
		currentState.state = 'installing';

		navigator.serviceWorker
			.register(scriptUrl, options)
			.then((registration) => {
				const updateState = (
					state: ServiceWorkerState,
					waitingWorker: ServiceWorker | null = currentState.waitingWorker
				) => {
					currentState = {
						...currentState,
						state,
						waitingWorker
					};
					notify();
				};

				// Check for waiting worker
				if (registration.waiting) {
					updateState('update-available', registration.waiting);
				}

				// Listen for new service worker
				registration.addEventListener('updatefound', () => {
					const newWorker = registration.installing;
					if (!newWorker) return;

					updateState('installing');

					newWorker.addEventListener('statechange', () => {
						switch (newWorker.state) {
							case 'installed':
								if (navigator.serviceWorker.controller) {
									updateState('update-available', newWorker);
								} else {
									updateState('installed');
								}
								break;
							case 'activating':
								updateState('activating');
								break;
							case 'activated':
								updateState('activated');
								break;
						}
					});
				});

				currentState.skipWaiting = () => {
					if (currentState.waitingWorker) {
						currentState.waitingWorker.postMessage({ type: 'SKIP_WAITING' });
					}
				};

				currentState.reload = () => {
					currentState.skipWaiting();
					window.location.reload();
				};

				if (registration.active && !registration.waiting) {
					updateState('activated');
				}
			})
			.catch((error) => {
				currentState = {
					...currentState,
					state: 'error',
					error: error instanceof Error ? error.message : 'Registration failed'
				};
				notify();
			});
	}

	return {
		subscribe(fn) {
			subscribers.add(fn);
			fn(currentState);
			return () => subscribers.delete(fn);
		},
		skipWaiting: () => currentState.skipWaiting(),
		reload: () => currentState.reload()
	};
}

/**
 * Check if a service worker update is available.
 * Useful for manual update checks.
 *
 * @returns Promise resolving to true if update is available
 */
export async function checkForUpdate(): Promise<boolean> {
	if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
		return false;
	}

	const registration = await navigator.serviceWorker.getRegistration();
	if (!registration) return false;

	await registration.update();
	return registration.waiting !== null;
}
