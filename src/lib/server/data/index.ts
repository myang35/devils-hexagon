import type { Game } from '$lib/server/models';

export const data: {
	games: {
		[id: string]: Game;
	};
} = {
	games: {}
};
