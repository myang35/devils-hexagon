<script lang="ts">
	import { GameLobbyPage } from '$lib/feat-game-lobby-page';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();
</script>

<GameLobbyPage {...data} />
