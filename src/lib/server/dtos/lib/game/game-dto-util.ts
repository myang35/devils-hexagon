import type { Game } from '$lib/server/models';

export const GameDtoUtil = {
	fromGame(game: Game) {
		return {
			id: game.id,
			status: game.status,
			players: game.players,
			gridValues: game.gridValues,
			selectedIndexes: game.selectedIndexes,
			foundSolutions: game.foundSolutions,
			target: game.target,
			lastModified: game.lastModified
		};
	}
};
