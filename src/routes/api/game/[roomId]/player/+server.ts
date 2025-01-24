import { db } from '$lib/server/database';
import { GameDtoUtil } from '$lib/server/dtos';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params, request }) => {
	const body = await request.json();

	const game = await db.game.updateByRoomId(params.roomId, {
		...body,
		players: {
			...body.players,
			[body.id]: {
				name: body.name,
				ready: false,
				points: 0,
				isAnswering: false
			}
		}
	});

	if (!game) {
		return Response.json({ error: 'NOT_FOUND', message: 'Game does not exist' }, { status: 404 });
	}

	return Response.json(GameDtoUtil.fromGame(game));
};
