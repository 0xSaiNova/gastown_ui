<script lang="ts">
	import { Dashboard } from '$lib/components';

	let { data } = $props();

	const agents = $derived(data.agents);
	const stats = $derived(data.stats);
	const systemStatus = $derived(data.systemStatus);
	const error = $derived(data.error);
</script>

<Dashboard
	title="GASTOWN"
	{agents}
	{stats}
	{systemStatus}
	{error}
/>
