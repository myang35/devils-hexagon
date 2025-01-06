import { db } from '$lib/server/database';
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

	return { game };
}) satisfies PageServerLoad;
