<script lang="ts">
	import { tv } from 'tailwind-variants';
	import { cn } from '$lib/utils';

	/**
	 * Navigation item variant definitions
	 */
	const navItemVariants = tv({
		base: 'flex flex-col items-center justify-center gap-1 min-w-[64px] py-2 px-3 touch-target-interactive transition-colors',
		variants: {
			active: {
				true: 'text-primary',
				false: 'text-muted-foreground hover:text-foreground'
			}
		},
		defaultVariants: {
			active: false
		}
	});

	interface NavItem {
		id: string;
		label: string;
		href?: string;
		icon?: string;
		badge?: number | string;
	}

	interface Props {
		items?: NavItem[];
		activeId?: string;
		class?: string;
	}

	let {
		items = [],
		activeId = '',
		class: className = ''
	}: Props = $props();

	// Trigger haptic feedback where supported
	function triggerHaptic() {
		if ('vibrate' in navigator) {
			navigator.vibrate(10);
		}
	}
</script>

<nav
	class={cn(
		'fixed bottom-0 left-0 right-0 z-50',
		'panel-glass border-t border-border',
		'pb-safe px-safe',
		'md:hidden', // Hide on desktop
		className
	)}
	aria-label="Bottom navigation"
>
	<div class="flex items-center justify-around max-w-lg mx-auto">
		{#each items as item}
			{@const isActive = item.id === activeId}
			<a
				href={item.href ?? '#'}
				class={cn(navItemVariants({ active: isActive }), 'relative')}
				aria-current={isActive ? 'page' : undefined}
				onclick={triggerHaptic}
			>
				<!-- Icon with badge -->
				<span class="relative">
					{#if item.icon}
						<span class="text-xl" aria-hidden="true">{item.icon}</span>
					{:else}
						<span class="w-6 h-6 rounded-full bg-current opacity-20" aria-hidden="true"></span>
					{/if}

					<!-- Badge -->
					{#if item.badge}
						<span
							class="absolute -top-1 -right-2 min-w-[16px] h-4 px-1 text-[10px] font-bold text-white bg-destructive rounded-full flex items-center justify-center"
							aria-label="{item.badge} notifications"
						>
							{typeof item.badge === 'number' && item.badge > 99 ? '99+' : item.badge}
						</span>
					{/if}
				</span>

				<!-- Label -->
				<span class="text-2xs font-medium">{item.label}</span>

				<!-- Active indicator -->
				{#if isActive}
					<span
						class="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full"
						aria-hidden="true"
					></span>
				{/if}
			</a>
		{/each}
	</div>
</nav>

<!-- Spacer to prevent content overlap -->
<div class="h-16 pb-safe md:hidden" aria-hidden="true"></div>
