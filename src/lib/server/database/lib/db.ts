import { gameRouter } from './routers/game/game-router';
import { playerRouter } from './routers/player/player-router';

export const db = {
	game: gameRouter,
	player: playerRouter
};
