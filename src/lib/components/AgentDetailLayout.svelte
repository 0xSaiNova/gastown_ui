<script lang="ts">
	import { cn } from '$lib/utils';
	import GridPattern from './GridPattern.svelte';
	import StatusIndicator from './StatusIndicator.svelte';

	interface Props {
		name: string;
		status?: 'running' | 'idle' | 'error' | 'complete' | 'processing' | 'warning';
		task?: string;
		meta?: string;
		class?: string;
	}

	let {
		name,
		status = 'idle',
		task = '',
		meta = '',
		class: className = ''
	}: Props = $props();
</script>

<div class={cn('relative min-h-screen bg-background', className)}>
	<!-- Grid pattern background -->
	<GridPattern variant="lines" opacity={0.1} />

	<!-- Main content wrapper -->
	<div class="relative z-10 flex flex-col min-h-screen">
		<!-- Agent header -->
		<header class="sticky top-0 z-50 panel-glass border-b border-border px-4 py-4">
			<div class="container">
				<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<!-- Agent info -->
					<div class="flex items-center gap-3">
						<StatusIndicator {status} size="lg" />
						<div>
							<h1 class="text-xl font-semibold text-foreground">{name}</h1>
							{#if meta}
								<p class="text-sm text-muted-foreground">{meta}</p>
							{/if}
						</div>
					</div>

					<!-- Action buttons -->
					{#if $$slots.actions}
						<div class="flex items-center gap-2">
							<slot name="actions" />
						</div>
					{/if}
				</div>
			</div>
		</header>

		<!-- Main content area - responsive layout -->
		<main class="flex-1 container py-6">
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<!-- Left column: Task details -->
				<div class="lg:col-span-1 space-y-4">
					<!-- Current task panel -->
					<section class="panel-glass p-4 space-y-3">
						<h2 class="text-sm font-medium text-muted-foreground uppercase tracking-wide">
							Current Task
						</h2>
						{#if task}
							<p class="text-foreground">{task}</p>
						{:else}
							<p class="text-muted-foreground italic">No active task</p>
						{/if}
					</section>

					<!-- Task details slot -->
					{#if $$slots.details}
						<section class="panel-glass p-4 space-y-3">
							<h2 class="text-sm font-medium text-muted-foreground uppercase tracking-wide">
								Details
							</h2>
							<slot name="details" />
						</section>
					{/if}
				</div>

				<!-- Right column: Log stream -->
				<div class="lg:col-span-2">
					<section class="panel-glass flex flex-col h-[calc(100vh-16rem)]">
						<header class="flex items-center justify-between p-4 border-b border-border">
							<h2 class="text-sm font-medium text-muted-foreground uppercase tracking-wide">
								Live Log
							</h2>
							{#if $$slots['log-actions']}
								<slot name="log-actions" />
							{/if}
						</header>
						<div class="flex-1 overflow-y-auto">
							{#if $$slots.logs}
								<slot name="logs" />
							{:else}
								<div class="p-4 text-center text-muted-foreground">
									<p>No log entries</p>
								</div>
							{/if}
						</div>
					</section>
				</div>
			</div>
		</main>

		<!-- Footer slot -->
		{#if $$slots.footer}
			<footer class="mt-auto border-t border-border px-4 py-3">
				<div class="container">
					<slot name="footer" />
				</div>
			</footer>
		{/if}
	</div>
</div>
