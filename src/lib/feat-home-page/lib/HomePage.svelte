<script>
	import { base } from '$app/paths';
</script>

<div class="mx-auto flex w-fit flex-col items-center gap-4 p-4">
	<div class="rounded-xl border border-black/50 p-4">
		<form>
			<input type="text" placeholder="Game Room #" class="outline-none" />
			<button type="submit">Join Game</button>
		</form>
	</div>

	<a href="{base}/game-lobby" class="rounded-xl border border-black/50 px-4 py-2">New Game</a>
</div>
