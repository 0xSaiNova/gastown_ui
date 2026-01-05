/**
 * Data synchronization store using Svelte 5 runes
 *
 * Provides:
 * - Initial state fetch on connection
 * - Incremental updates via WebSocket
 * - Conflict resolution with last-write-wins strategy
 * - Offline action queue with automatic retry
 * - Sync status indicator
 */

import { wsClient, type WSMessage } from './websocket.svelte';
import { networkState, type QueuedAction } from './network.svelte';

// Browser detection
const browser = typeof window !== 'undefined';

// Sync states
export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error' | 'offline';

// Version tracking for conflict resolution
export interface VersionedData<T> {
	data: T;
	version: number;
	updatedAt: number;
	source: 'local' | 'remote';
}

// Sync operation types
export type SyncOperation = 'create' | 'update' | 'delete';

// Pending sync item
export interface PendingSyncItem<T = unknown> {
	id: string;
	collection: string;
	operation: SyncOperation;
	data: T;
	version: number;
	timestamp: number;
	retries: number;
}

// Sync event for handlers
export interface SyncEvent<T = unknown> {
	collection: string;
	operation: SyncOperation;
	id: string;
	data: T;
	version: number;
	isLocal: boolean;
}

// Conflict resolution strategy
export type ConflictStrategy = 'last-write-wins' | 'server-wins' | 'client-wins' | 'manual';

// Sync handler callback
type SyncHandler<T = unknown> = (event: SyncEvent<T>) => void;
type StatusHandler = (status: SyncStatus) => void;
type ConflictHandler<T = unknown> = (
	local: VersionedData<T>,
	remote: VersionedData<T>
) => VersionedData<T> | null;

// Configuration
interface SyncConfig {
	maxRetries: number;
	retryDelay: number;
	conflictStrategy: ConflictStrategy;
	syncOnReconnect: boolean;
	batchSize: number;
}

const DEFAULT_CONFIG: SyncConfig = {
	maxRetries: 3,
	retryDelay: 1000,
	conflictStrategy: 'last-write-wins',
	syncOnReconnect: true,
	batchSize: 50
};

class SyncStore {
	// Configuration
	#config: SyncConfig;

	// Sync state
	#status = $state<SyncStatus>('idle');
	#lastSyncAt = $state<number>(0);
	#pendingCount = $state<number>(0);
	#errorMessage = $state<string>('');

	// Pending sync queue
	#pendingItems = new Map<string, PendingSyncItem>();

	// Version tracking per collection/id
	#versions = new Map<string, Map<string, VersionedData<unknown>>>();

	// Handlers
	#syncHandlers = new Map<string, Set<SyncHandler>>();
	#statusHandlers: StatusHandler[] = [];
	#conflictHandlers = new Map<string, ConflictHandler>();

	// Unsubscribe functions
	#unsubscribers: (() => void)[] = [];
	#initialized = false;

	// Retry timer
	#retryTimeout: ReturnType<typeof setTimeout> | null = null;

	constructor(config: Partial<SyncConfig> = {}) {
		this.#config = { ...DEFAULT_CONFIG, ...config };

		if (browser) {
			this.#init();
		}
	}

	// Public getters
	get status() {
		return this.#status;
	}

	get lastSyncAt() {
		return this.#lastSyncAt;
	}

	get pendingCount() {
		return this.#pendingCount;
	}

	get errorMessage() {
		return this.#errorMessage;
	}

	get isSyncing() {
		return this.#status === 'syncing';
	}

	get isOnline() {
		return this.#status !== 'offline';
	}

	get hasPendingChanges() {
		return this.#pendingCount > 0;
	}

	// Initialize sync listeners
	#init() {
		if (this.#initialized) return;
		this.#initialized = true;

		// Listen for WebSocket connection state
		this.#unsubscribers.push(
			wsClient.onStateChange((state) => {
				if (state === 'connected' && this.#config.syncOnReconnect) {
					this.#syncPendingItems();
				} else if (state === 'disconnected' || state === 'reconnecting') {
					if (networkState.isOffline) {
						this.#setStatus('offline');
					}
				}
			})
		);

		// Listen for network state
		this.#unsubscribers.push(
			networkState.onStatusChange((isOnline) => {
				if (!isOnline) {
					this.#setStatus('offline');
				} else if (wsClient.isConnected) {
					this.#syncPendingItems();
				}
			})
		);

		// Set initial status based on connection
		if (networkState.isOffline) {
			this.#setStatus('offline');
		} else if (!wsClient.isConnected) {
			this.#setStatus('idle');
		}
	}

	// Track a local change that needs syncing
	track<T>(
		collection: string,
		id: string,
		operation: SyncOperation,
		data: T
	): string {
		const key = `${collection}:${id}`;
		const version = this.#getNextVersion(collection, id);

		const item: PendingSyncItem<T> = {
			id,
			collection,
			operation,
			data,
			version,
			timestamp: Date.now(),
			retries: 0
		};

		this.#pendingItems.set(key, item);
		this.#updatePendingCount();

		// Update local version
		this.#setVersion(collection, id, {
			data,
			version,
			updatedAt: Date.now(),
			source: 'local'
		});

		// Dispatch local event
		this.#dispatchEvent({
			collection,
			operation,
			id,
			data,
			version,
			isLocal: true
		});

		// Try to sync immediately if online
		if (wsClient.isConnected) {
			this.#syncItem(key, item);
		}

		return key;
	}

	// Apply a remote update
	applyRemote<T>(
		collection: string,
		id: string,
		operation: SyncOperation,
		data: T,
		remoteVersion: number
	) {
		const key = `${collection}:${id}`;
		const localVersion = this.#getVersion(collection, id);

		// Check for conflict
		if (localVersion && localVersion.source === 'local') {
			const resolved = this.#resolveConflict(
				collection,
				localVersion,
				{ data, version: remoteVersion, updatedAt: Date.now(), source: 'remote' }
			);

			if (!resolved) {
				// Manual resolution needed, skip this update
				return;
			}

			// Use resolved data
			this.#setVersion(collection, id, resolved);
			this.#dispatchEvent({
				collection,
				operation,
				id,
				data: resolved.data as T,
				version: resolved.version,
				isLocal: false
			});
		} else {
			// No conflict, apply directly
			this.#setVersion(collection, id, {
				data,
				version: remoteVersion,
				updatedAt: Date.now(),
				source: 'remote'
			});

			this.#dispatchEvent({
				collection,
				operation,
				id,
				data,
				version: remoteVersion,
				isLocal: false
			});
		}

		// Clear pending item if it was synced
		if (this.#pendingItems.has(key)) {
			const pending = this.#pendingItems.get(key)!;
			if (pending.version <= remoteVersion) {
				this.#pendingItems.delete(key);
				this.#updatePendingCount();
			}
		}
	}

	// Force sync all pending items
	async sync(): Promise<boolean> {
		if (!wsClient.isConnected) {
			this.#setStatus('offline');
			return false;
		}

		return this.#syncPendingItems();
	}

	// Subscribe to sync events for a collection
	onSync<T>(collection: string, handler: SyncHandler<T>): () => void {
		if (!this.#syncHandlers.has(collection)) {
			this.#syncHandlers.set(collection, new Set());
		}
		this.#syncHandlers.get(collection)!.add(handler as SyncHandler);

		return () => {
			this.#syncHandlers.get(collection)?.delete(handler as SyncHandler);
		};
	}

	// Subscribe to status changes
	onStatusChange(handler: StatusHandler): () => void {
		this.#statusHandlers.push(handler);
		handler(this.#status); // Immediate callback

		return () => {
			const idx = this.#statusHandlers.indexOf(handler);
			if (idx > -1) this.#statusHandlers.splice(idx, 1);
		};
	}

	// Set custom conflict handler for a collection
	setConflictHandler<T>(collection: string, handler: ConflictHandler<T>) {
		this.#conflictHandlers.set(collection, handler as ConflictHandler);
	}

	// Get current version of an item
	getVersion<T>(collection: string, id: string): VersionedData<T> | undefined {
		return this.#getVersion(collection, id) as VersionedData<T> | undefined;
	}

	// Clear all pending items (use with caution)
	clearPending() {
		this.#pendingItems.clear();
		this.#updatePendingCount();
	}

	// Reset sync state
	reset() {
		this.#pendingItems.clear();
		this.#versions.clear();
		this.#updatePendingCount();
		this.#setStatus('idle');
		this.#lastSyncAt = 0;
		this.#errorMessage = '';
	}

	// Cleanup
	destroy() {
		if (this.#retryTimeout) {
			clearTimeout(this.#retryTimeout);
			this.#retryTimeout = null;
		}

		for (const unsubscribe of this.#unsubscribers) {
			unsubscribe();
		}

		this.#unsubscribers = [];
		this.#syncHandlers.clear();
		this.#statusHandlers = [];
		this.#conflictHandlers.clear();
		this.#initialized = false;
	}

	// Private methods

	#setStatus(status: SyncStatus, error?: string) {
		const previous = this.#status;
		this.#status = status;

		if (error) {
			this.#errorMessage = error;
		} else if (status !== 'error') {
			this.#errorMessage = '';
		}

		if (previous !== status) {
			for (const handler of this.#statusHandlers) {
				try {
					handler(status);
				} catch (e) {
					console.error('Status handler error:', e);
				}
			}
		}
	}

	#getVersion(collection: string, id: string): VersionedData<unknown> | undefined {
		return this.#versions.get(collection)?.get(id);
	}

	#setVersion(collection: string, id: string, data: VersionedData<unknown>) {
		if (!this.#versions.has(collection)) {
			this.#versions.set(collection, new Map());
		}
		this.#versions.get(collection)!.set(id, data);
	}

	#getNextVersion(collection: string, id: string): number {
		const current = this.#getVersion(collection, id);
		return (current?.version || 0) + 1;
	}

	#updatePendingCount() {
		this.#pendingCount = this.#pendingItems.size;
	}

	#resolveConflict(
		collection: string,
		local: VersionedData<unknown>,
		remote: VersionedData<unknown>
	): VersionedData<unknown> | null {
		// Check for custom handler
		const customHandler = this.#conflictHandlers.get(collection);
		if (customHandler) {
			return customHandler(local, remote);
		}

		// Apply default strategy
		switch (this.#config.conflictStrategy) {
			case 'last-write-wins':
				return local.updatedAt > remote.updatedAt ? local : remote;

			case 'server-wins':
				return remote;

			case 'client-wins':
				return local;

			case 'manual':
				// Return null to signal manual resolution needed
				console.warn(`Conflict detected for ${collection}, manual resolution required`);
				return null;
		}
	}

	#dispatchEvent(event: SyncEvent) {
		const handlers = this.#syncHandlers.get(event.collection);
		if (!handlers) return;

		for (const handler of handlers) {
			try {
				handler(event);
			} catch (e) {
				console.error(`Sync handler error for ${event.collection}:`, e);
			}
		}
	}

	async #syncPendingItems(): Promise<boolean> {
		if (this.#pendingItems.size === 0) {
			this.#setStatus('synced');
			this.#lastSyncAt = Date.now();
			return true;
		}

		this.#setStatus('syncing');

		const items = Array.from(this.#pendingItems.entries());
		let allSuccess = true;

		// Process in batches
		for (let i = 0; i < items.length; i += this.#config.batchSize) {
			const batch = items.slice(i, i + this.#config.batchSize);

			for (const [key, item] of batch) {
				const success = await this.#syncItem(key, item);
				if (!success) {
					allSuccess = false;
				}
			}
		}

		if (allSuccess) {
			this.#setStatus('synced');
			this.#lastSyncAt = Date.now();
		} else if (this.#pendingItems.size > 0) {
			this.#scheduleRetry();
		}

		return allSuccess;
	}

	async #syncItem(key: string, item: PendingSyncItem): Promise<boolean> {
		if (!wsClient.isConnected) {
			return false;
		}

		const message: WSMessage = {
			type: 'queue_update',
			timestamp: Date.now(),
			payload: {
				collection: item.collection,
				id: item.id,
				operation: item.operation,
				data: item.data,
				version: item.version
			}
		};

		const sent = wsClient.send(message.type, message.payload);

		if (sent) {
			// Mark as syncing - will be removed when server confirms
			item.retries = 0;
			return true;
		} else {
			item.retries++;

			if (item.retries >= this.#config.maxRetries) {
				this.#setStatus('error', `Failed to sync ${item.collection}:${item.id} after ${this.#config.maxRetries} attempts`);
				// Keep in queue for manual retry
			}

			return false;
		}
	}

	#scheduleRetry() {
		if (this.#retryTimeout) return;

		this.#retryTimeout = setTimeout(() => {
			this.#retryTimeout = null;
			if (wsClient.isConnected && this.#pendingItems.size > 0) {
				this.#syncPendingItems();
			}
		}, this.#config.retryDelay);
	}
}

// Singleton instance
export const syncStore = new SyncStore();

// Factory for custom configurations
export function createSyncStore(config: Partial<SyncConfig> = {}) {
	return new SyncStore(config);
}

// Helper hooks for Svelte components
export function useSyncStatus() {
	return {
		get status() {
			return syncStore.status;
		},
		get lastSyncAt() {
			return syncStore.lastSyncAt;
		},
		get pendingCount() {
			return syncStore.pendingCount;
		},
		get isSyncing() {
			return syncStore.isSyncing;
		},
		get hasPendingChanges() {
			return syncStore.hasPendingChanges;
		}
	};
}
