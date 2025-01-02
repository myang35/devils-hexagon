import { db } from '$lib/server/database';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const game = await db.game.create();
	return { game };
}) satisfies PageServerLoad;
