import { db } from '$lib/server/database';
import { GameDtoUtil } from '$lib/server/dtos';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async () => {
	const game = await db.game.create();
	const gameDto = GameDtoUtil.fromGame(game);
	return Response.json(gameDto, { status: 201 });
};
