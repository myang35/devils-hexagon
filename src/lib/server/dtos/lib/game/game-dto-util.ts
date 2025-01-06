import type { Game } from '$lib/server/models';

export const GameDtoUtil = {
	fromGame(game: Game) {
		return {
			id: game.id,
			players: game.players,
			gridValues: game.gridValues,
			foundSolutions: game.foundSolutions,
			isRunning: game.isRunning
		};
	}
};
