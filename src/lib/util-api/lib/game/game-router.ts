import { base } from '$app/paths';

export const gameRouter = {
	get: async (roomid: string) => {
		return fetch(`${base}/api/game/${roomid}`);
	},
	update: async (
		roomid: string,
		game: {
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
		return fetch(`${base}/api/game/${roomid}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(game)
		});
	},
	addPlayer: async (
		roomid: string,
		player: {
			id: string;
			name: string;
		}
	) => {
		return fetch(`${base}/api/game/${roomid}/player`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(player)
		});
	}
};
