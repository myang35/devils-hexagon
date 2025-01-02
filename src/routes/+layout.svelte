<script lang="ts">
	import { base } from '$app/paths';
	import '../app.css';
	let { children } = $props();
</script>

<div class="bg-red-900/80 py-2 text-center">
	<a href="{base}/" class="text-3xl text-red-100">Devil's Hexagon</a>
</div>

{@render children()}
