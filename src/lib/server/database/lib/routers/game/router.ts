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
	},
	update: async (id: string, body: any) => {
		const game = data.games[id];
		if (!game) return null;
		Object.assign(game, body);
		return game;
	}
};
