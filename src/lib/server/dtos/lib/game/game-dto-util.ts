import type { Game } from '$lib/server/models';
import type { GameDto } from './game-dto';

export const GameDtoUtil = {
	fromGame(game: Game) {
		return {
			id: game._id.toString(),
			roomId: game.roomId,
			status: game.status,
			players: game.players,
			gridValues: game.gridValues,
			selectedIndexes: game.selectedIndexes,
			foundSolutions: game.foundSolutions,
			target: game.target,
			lastModified: game.lastModified.getTime()
		} as GameDto;
	}
};
