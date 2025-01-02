import { db } from '$lib/server/database';
import type { PageServerLoad } from './$types';

export const load = (async ({ url }) => {
	const gameId = url.searchParams.get('g');
	const game = gameId ? await db.game.get(gameId) : null;
	return { game };
}) satisfies PageServerLoad;
