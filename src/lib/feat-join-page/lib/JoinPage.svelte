<script lang="ts">
	const { game } = $props();

	function onAnswerClick() {}
</script>

<div class="flex flex-col items-center gap-4 p-4">
	<span class="text-center">Game ID: 07057S</span>
	<button
		class="h-96 w-full rounded-full border-8 border-red-800/80 bg-gradient-to-tr from-red-500/80 to-red-500/60 text-5xl font-bold tracking-wide text-white"
		onclick={onAnswerClick}>Answer</button
	>
</div>
