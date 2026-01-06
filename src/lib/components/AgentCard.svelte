<script lang="ts" module>
	import { tv, type VariantProps } from 'tailwind-variants';

	/**
	 * AgentCard variant definitions using tailwind-variants
	 * Dark industrial aesthetic for Gas Town
	 */
	export const agentCardVariants = tv({
		slots: {
			card: [
				'relative bg-gas-surface border border-gas-border rounded-lg overflow-hidden',
				'transition-all duration-200',
				'hover:border-gas-primary'
			],
			content: 'p-4 space-y-3',
			header: 'flex items-start justify-between gap-3',
			name: 'font-display font-semibold text-foreground truncate',
			badge: [
				'absolute top-3 right-3',
				'px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wide'
			],
			metaGrid: 'grid grid-cols-2 gap-3',
			metaItem: 'space-y-1',
			metaLabel: 'text-xs text-muted-foreground uppercase tracking-wide',
			metaValue: 'font-mono text-sm text-foreground',
			details: 'overflow-hidden transition-all duration-300 ease-out',
			actions: 'flex gap-2 pt-3 border-t border-gas-border',
			actionBtn: [
				'flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded text-sm font-medium',
				'bg-gas-border/50 hover:bg-gas-primary hover:text-foreground',
				'transition-all duration-200 active:scale-95 min-h-[44px]'
			]
		},
		variants: {
			status: {
				running: {
					badge: 'bg-status-online/20 text-status-online'
				},
				idle: {
					badge: 'bg-status-idle/20 text-status-idle'
				},
				error: {
					card: 'border-gas-error [filter:sepia(0.1)]',
					badge: 'bg-gas-error/20 text-gas-error animate-pulse'
				},
				complete: {
					badge: 'bg-status-online/20 text-status-online'
				}
			},
			expanded: {
				true: { details: 'max-h-96 opacity-100' },
				false: { details: 'max-h-0 opacity-0' }
			},
			compact: {
				true: { content: 'p-3' },
				false: {}
			}
		},
		defaultVariants: {
			status: 'idle',
			expanded: false,
			compact: false
		}
	});

	/**
	 * Props type derived from variant definitions
	 */
	export type AgentCardProps = VariantProps<typeof agentCardVariants> & {
		name: string;
		task?: string;
		meta?: string;
		progress?: number;
		class?: string;
		icon?: string;
		uptime?: string;
		errorMessage?: string;
		expandable?: boolean;
		onInspect?: () => void;
		onReboot?: () => void;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import StatusIndicator from './StatusIndicator.svelte';
	import ProgressBar from './ProgressBar.svelte';

	// Component props
	let {
		name,
		status = 'idle',
		task = '',
		meta = '',
		progress = 0,
		class: className = '',
		uptime = '',
		errorMessage = '',
		expandable = false,
		compact = false,
		onInspect,
		onReboot
	}: AgentCardProps = $props();

	// Expandable state
	let isExpanded = $state(false);

	// Derived styles
	const styles = $derived(agentCardVariants({ status, expanded: isExpanded, compact }));

	// Map status to StatusIndicator status type
	const statusIndicatorMap = {
		running: 'running',
		idle: 'idle',
		error: 'error',
		complete: 'complete'
	} as const;

	// Map status to ProgressBar color
	const progressColorMap = {
		running: 'default',
		idle: 'default',
		error: 'error',
		complete: 'success'
	} as const;

	// Status label mapping
	const statusLabels = {
		running: 'Running',
		idle: 'Idle',
		error: 'Error',
		complete: 'Complete'
	} as const;

	// Toggle expanded state
	function toggleExpanded() {
		if (expandable) {
			isExpanded = !isExpanded;
		}
	}

	// Handle keyboard for expansion
	function handleKeyDown(e: KeyboardEvent) {
		if (expandable && (e.key === 'Enter' || e.key === ' ')) {
			e.preventDefault();
			toggleExpanded();
		}
	}
</script>

<article
	class={cn(styles.card(), className)}
	role={expandable ? 'button' : undefined}
	tabindex={expandable ? 0 : undefined}
	aria-expanded={expandable ? isExpanded : undefined}
	onclick={expandable ? toggleExpanded : undefined}
	onkeydown={expandable ? handleKeyDown : undefined}
>
	<!-- Status Badge (positioned top-right) -->
	<span class={styles.badge()}>
		{statusLabels[status ?? 'idle']}
	</span>

	<div class={styles.content()}>
		<!-- Header: Name + Status Indicator -->
		<header class={styles.header()}>
			<div class="flex items-center gap-2 min-w-0 pr-16">
				<StatusIndicator status={statusIndicatorMap[status ?? 'idle']} size="sm" />
				<h3 class={styles.name()}>{name}</h3>
			</div>
			{#if expandable}
				<svg
					class="w-4 h-4 text-muted-foreground transition-transform duration-200 flex-shrink-0"
					class:rotate-180={isExpanded}
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					aria-hidden="true"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
				</svg>
			{/if}
		</header>

		<!-- Task Description -->
		{#if task}
			<p class="text-sm text-muted-foreground line-clamp-2">{task}</p>
		{/if}

		<!-- Metadata Grid -->
		{#if meta || uptime}
			<div class={styles.metaGrid()}>
				{#if meta}
					<div class={styles.metaItem()}>
						<span class={styles.metaLabel()}>Task</span>
						<span class={styles.metaValue()}>{meta}</span>
					</div>
				{/if}
				{#if uptime}
					<div class={styles.metaItem()}>
						<span class={styles.metaLabel()}>Uptime</span>
						<span class={styles.metaValue()}>{uptime}</span>
					</div>
				{/if}
			</div>
		{/if}

		<!-- Error Message -->
		{#if status === 'error' && errorMessage}
			<div class="p-3 rounded bg-gas-error/10 border border-gas-error/30">
				<p class="text-sm text-gas-error font-medium flex items-start gap-2">
					<svg class="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
					</svg>
					{errorMessage}
				</p>
			</div>
		{/if}

		<!-- Progress Bar -->
		{#if status === 'running' && progress > 0}
			<div class="pt-1">
				<ProgressBar
					value={progress}
					size="sm"
					color={progressColorMap[status ?? 'idle']}
				/>
			</div>
		{/if}

		<!-- Expandable Details Section -->
		{#if expandable}
			<div class={styles.details()}>
				{#if isExpanded}
					<!-- Quick Actions -->
					{#if onInspect || onReboot}
						<div class={styles.actions()}>
							{#if onInspect}
								<button
									type="button"
									class={styles.actionBtn()}
									onclick={(e) => { e.stopPropagation(); onInspect?.(); }}
								>
									<!-- Lucide Search icon -->
									<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
										<circle cx="11" cy="11" r="8" />
										<path d="m21 21-4.3-4.3" />
									</svg>
									Inspect
								</button>
							{/if}
							{#if onReboot}
								<button
									type="button"
									class={cn(
										styles.actionBtn(),
										status === 'error' && 'bg-gas-error/20 hover:bg-gas-error/30 text-gas-error'
									)}
									onclick={(e) => { e.stopPropagation(); onReboot?.(); }}
								>
									<!-- Lucide RefreshCw icon -->
									<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
										<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
										<path d="M21 3v5h-5" />
										<path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
										<path d="M3 21v-5h5" />
									</svg>
									Reboot
								</button>
							{/if}
						</div>
					{/if}

					<!-- Custom expanded content slot -->
					{#if $$slots.expanded}
						<div class="pt-3">
							<slot name="expanded" />
						</div>
					{/if}
				{/if}
			</div>
		{/if}

		<!-- Legacy actions slot (non-expandable cards) -->
		{#if !expandable && $$slots.actions}
			<div class="flex items-center gap-1 pt-2">
				<slot name="actions" />
			</div>
		{/if}
	</div>

	<!-- Custom content slot -->
	{#if $$slots.default}
		<div class="px-4 pb-4 pt-2 border-t border-gas-border">
			<slot />
		</div>
	{/if}
</article>
