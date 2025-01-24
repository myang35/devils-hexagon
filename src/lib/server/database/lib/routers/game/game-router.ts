import type { Game } from '$lib/server/models';
import { ObjectId } from 'mongodb';
import { dbRef } from '../../db';

export const gameRouter = {
	get: async (id: string) => {
		const game = await dbRef.collection('games').findOne({ _id: new ObjectId(id) });
		return game as Game | null;
	},
	getByRoomId: async (roomId: string) => {
		const game = await dbRef.collection('games').findOne({ roomId });
		return game as Game | null;
	},
	create: async () => {
		const game = {
			roomId: (() => {
				const charList = 'ABCDEFHIJKLMNOPQRSTUVWXYZ0123456789';
				let result = '';
				for (let i = 0; i < 6; i++) {
					const randomIndex = Math.floor(Math.random() * charList.length);
					result += charList[randomIndex];
				}
				return result;
			})(),
			status: 'waiting',
			players: {},
			gridValues: [],
			selectedIndexes: [],
			foundSolutions: [],
			target: 0,
			lastModified: Date.now()
		};
		const gamesCollection = dbRef.collection('games');
		const gameDoc = await gamesCollection.insertOne(game);
		return {
			_id: gameDoc.insertedId,
			...game
		} as Game;
	},
	update: async (
		id: string,
		body: {
			status?: string;
			players?: {
				[id: string]: {
					name?: string;
					ready?: boolean;
					points?: number;
					isAnswering?: boolean;
				};
			};
			gridValues?: number[];
			selectedIndexes?: number[];
			foundSolutions?: number[][];
			target?: number;
		}
	) => {
		const game = await dbRef.collection('games').findOneAndUpdate(
			{ _id: new ObjectId(id) },
			{
				...body,
				lastModified: Date.now()
			}
		);
		return game as Game | null;
	},
	updateByRoomId: async (
		roomId: string,
		body: {
			status?: string;
			players?: {
				[id: string]: {
					name?: string;
					ready?: boolean;
					points?: number;
					isAnswering?: boolean;
				};
			};
			gridValues?: number[];
			selectedIndexes?: number[];
			foundSolutions?: number[][];
			target?: number;
		}
	) => {
		const collection = dbRef.collection('games');
		const game = await collection.findOneAndUpdate(
			{ roomId },
			{
				$set: {
					...body,
					lastModified: Date.now()
				}
			}
		);
		return game as Game | null;
	}
};
