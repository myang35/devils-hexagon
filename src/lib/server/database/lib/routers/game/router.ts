import { data } from '$lib/server/data';
import { Game } from '$lib/server/models';

export const gameRouter = {
	get: async (id: string) => {
		const game = data.games[id];
		if (!game) return null;
		return game;
	},
	create: async () => {
		const game = new Game();
		data.games[game.id] = game;
		return game;
	}
};
