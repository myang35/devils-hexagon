import { db } from '$lib/server/database';
import { GameDtoUtil } from '$lib/server/dtos';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params, request }) => {
	const body = await request.json();
	const game = await db.game.addPlayer(params.id, body);

	if (!game) {
		return Response.json({ error: 'NOT_FOUND', message: 'Game does not exist' }, { status: 404 });
	}

	return Response.json(GameDtoUtil.fromGame(game));
};
