import { data } from '$lib/server/data';
import type { GameAddPlayerParamsDto, UpdateGameParamsDto } from '$lib/server/dtos';
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
	update: async (id: string, body: UpdateGameParamsDto) => {
		const game = data.games[id];
		if (!game) return null;
		Object.assign(game, body);
		game.lastModified = Date.now();
		return game;
	},
	addPlayer: async (id: string, player: GameAddPlayerParamsDto) => {
		const game = data.games[id];
		if (!game) return null;
		game.players[player.id] = {
			name: player.name,
			ready: false,
			points: 0,
			isAnswering: false
		};
		game.lastModified = Date.now();
		return game;
	}
};
