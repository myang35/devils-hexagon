<script>
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';

	let joinGameInputId = '';
	let joinGameMessage = '';

	async function onNewGameClick() {
		const response = await fetch(`${base}/api/game`, { method: 'post' });
		const responseBody = await response.json();
		goto(`${base}/play?g=${responseBody.id}`);
	}

	async function onJoinGameClick() {
		const response = await fetch(`${base}/api/game/${joinGameInputId}`);

		if (!response.ok) {
			joinGameMessage = 'Invalid Game ID!';
			return;
		}

		const responseBody = await response.json();
		goto(`${base}/join?g=${responseBody.id}`);
	}
</script>

<div class="mx-auto flex w-fit flex-col items-center gap-4 p-4">
	<div class="flex flex-col gap-4 rounded-xl border border-black/50 p-2">
		<form>
			<input
				type="text"
				placeholder="Game Room #"
				bind:value={joinGameInputId}
				class="outline-none"
			/>
			<button type="submit" onclick={onJoinGameClick}>Join Game</button>
		</form>

		{#if joinGameMessage}
			<span class="rounded border border-red-900 bg-red-900/40 px-2 py-1 text-sm text-red-900"
				>{joinGameMessage}</span
			>
		{/if}
	</div>

	<button onclick={onNewGameClick} class="rounded-xl border border-black/50 px-4 py-2"
		>New Game</button
	>
</div>
