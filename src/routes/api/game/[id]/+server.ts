import { db } from '$lib/server/database';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const game = await db.game.get(params.id);

	if (!game) {
		return Response.json({ error: 'NOT_FOUND', message: 'Game does not exist' }, { status: 404 });
	}

	return Response.json(game);
};
