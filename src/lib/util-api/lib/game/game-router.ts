import { base } from '$app/paths';
import type { GameDto, UpdateGameParamsDto } from '$lib/server/dtos';

export const gameRouter = {
	get: async (id: string) => {
		return fetch(`${base}/api/game/${id}`).then((res) => res.json()) as Promise<GameDto>;
	},
	update: async (id: string, game: UpdateGameParamsDto) => {
		return fetch(`${base}/api/game/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(game)
		}).then((res) => res.json()) as Promise<GameDto>;
	}
};
