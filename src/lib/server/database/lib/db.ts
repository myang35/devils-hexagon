import { Db, MongoClient } from 'mongodb';
import { gameRouter } from './routers/game/game-router';
import { playerRouter } from './routers/player/player-router';

export const db = {
	game: gameRouter,
	player: playerRouter
};

export let dbRef: Db;

export function initDb(url: string) {
	if (dbRef) return db;

	const client = new MongoClient(url);
	dbRef = client.db('devils_hexagon');
	return db;
}
