import { db } from '$lib/server/database';
import { GameDtoUtil } from '$lib/server/dtos';
import type { RequestHandler } from '../[roomId]/$types';

export const GET: RequestHandler = async ({ params }) => {
	const game = await db.game.getByRoomId(params.roomId);

	if (!game) {
		return Response.json({ error: 'NOT_FOUND', message: 'Game does not exist' }, { status: 404 });
	}

	return Response.json(GameDtoUtil.fromGame(game));
};

export const PUT: RequestHandler = async ({ params, request }) => {
	const body = await request.json();
	const updatedGame = await db.game.updateByRoomId(params.roomId, body);

	if (!updatedGame) {
		return Response.json({ error: 'NOT_FOUND', message: 'Game does not exist' }, { status: 404 });
	}

	return Response.json(GameDtoUtil.fromGame(updatedGame));
};
