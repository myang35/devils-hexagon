import { db } from '$lib/server/database';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async () => {
	const game = await db.game.create();
	return Response.json(game);
};
