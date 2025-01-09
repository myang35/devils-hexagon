import { db } from '$lib/server/database';
import { GameDtoUtil } from '$lib/server/dtos';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ url }) => {
	const gameId = url.searchParams.get('g');

	if (!gameId) {
		error(400, 'Game ID is required');
	}

	const game = await db.game.get(gameId);

	if (!game) {
		error(404, 'Game not found');
	}

	const gameDto = GameDtoUtil.fromGame(game);

	return { game: gameDto };
}) satisfies PageServerLoad;
