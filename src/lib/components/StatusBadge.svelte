<script lang="ts">
	import { tv, type VariantProps } from 'tailwind-variants';
	import { cn } from '$lib/utils';

	/**
	 * StatusBadge - Pill-shaped status badge with glow effects
	 * Designed to match gas-town-control reference
	 */
	const statusBadgeVariants = tv({
		slots: {
			badge: 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-bold font-mono tracking-wider uppercase',
			dot: 'w-1.5 h-1.5 rounded-full flex-shrink-0'
		},
		variants: {
			status: {
				running: {
					badge: 'bg-primary/10 border-primary/30 text-primary',
					dot: 'bg-primary'
				},
				idle: {
					badge: 'bg-accent/10 border-accent/30 text-accent',
					dot: 'bg-accent'
				},
				error: {
					badge: 'bg-destructive/10 border-destructive/30 text-destructive',
					dot: 'bg-destructive'
				},
				warning: {
					badge: 'bg-warning/10 border-warning/30 text-warning',
					dot: 'bg-warning'
				},
				success: {
					badge: 'bg-success/10 border-success/30 text-success',
					dot: 'bg-success'
				},
				pending: {
					badge: 'bg-status-pending/10 border-status-pending/30 text-status-pending',
					dot: 'bg-status-pending'
				}
			},
			glow: {
				true: {},
				false: {}
			}
		},
		compoundVariants: [
			{
				status: 'running',
				glow: true,
				class: {
					dot: 'status-dot-glow-primary'
				}
			},
			{
				status: 'error',
				glow: true,
				class: {
					dot: 'status-dot-glow-error'
				}
			},
			{
				status: 'success',
				glow: true,
				class: {
					dot: 'status-dot-glow-success'
				}
			}
		],
		defaultVariants: {
			status: 'idle',
			glow: false
		}
	});

	type StatusBadgeProps = VariantProps<typeof statusBadgeVariants> & {
		class?: string;
		label?: string;
		pulse?: boolean;
	};

	let {
		status = 'idle',
		glow = false,
		pulse = false,
		class: className = '',
		label
	}: StatusBadgeProps = $props();

	// Use $derived for reactive variant computation
	const variants = $derived(statusBadgeVariants({ status, glow }));

	// Default labels for each status
	const statusLabels: Record<string, string> = {
		running: 'Running',
		idle: 'Idle',
		error: 'Error',
		warning: 'Warning',
		success: 'Success',
		pending: 'Pending'
	};

	const displayLabel = $derived(label ?? statusLabels[status ?? 'idle']);
</script>

<span
	class={cn(variants.badge(), className)}
	role="status"
	aria-label={displayLabel}
>
	<span
		class={cn(
			variants.dot(),
			pulse && status === 'running' && 'animate-pulse-status',
			glow && status === 'running' && 'status-dot-glow-primary'
		)}
		aria-hidden="true"
	></span>
	<span>{displayLabel}</span>
</span>

<style>
	/* Glow effects for status dots - GPU-optimized using opacity */
	.status-dot-glow-primary {
		position: relative;
		box-shadow: 0 0 6px 2px hsl(var(--primary) / 0.6);
		animation: dot-glow-pulse 2s ease-in-out infinite;
	}

	.status-dot-glow-error {
		position: relative;
		box-shadow: 0 0 6px 2px hsl(var(--destructive) / 0.6);
	}

	.status-dot-glow-success {
		position: relative;
		box-shadow: 0 0 6px 2px hsl(var(--success) / 0.6);
	}

	@keyframes dot-glow-pulse {
		0%, 100% {
			box-shadow: 0 0 4px 1px hsl(var(--primary) / 0.4);
		}
		50% {
			box-shadow: 0 0 8px 3px hsl(var(--primary) / 0.7);
		}
	}

	/* Reduced motion: static glow */
	@media (prefers-reduced-motion: reduce) {
		.status-dot-glow-primary,
		.status-dot-glow-error,
		.status-dot-glow-success {
			animation: none !important;
		}

		.status-dot-glow-primary {
			box-shadow: 0 0 6px 2px hsl(var(--primary) / 0.5);
		}
	}
</style>
