import { db } from '$lib/server/database';
import { GameDtoUtil, PlayerDtoUtil, type PlayerDto } from '$lib/server/dtos';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ url, cookies }) => {
	const gameId = url.searchParams.get('g');

	if (!gameId) {
		error(400, 'Game ID is required');
	}

	const game = await db.game.get(gameId);

	if (!game) {
		error(404, 'Game not found');
	}

	const gameDto = GameDtoUtil.fromGame(game);

	const playerDto = await (async () => {
		const playerCookie = cookies.get('player');
		if (playerCookie) return JSON.parse(playerCookie) as PlayerDto;

		const player = await db.player.create();
		cookies.set('player', JSON.stringify(player), { path: '/', secure: false });
		return PlayerDtoUtil.fromPlayer(player);
	})();

	return { game: gameDto, player: playerDto };
}) satisfies PageServerLoad;
