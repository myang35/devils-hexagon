import { data } from '../../data';

export const gameRouter = {
	get: async (id: string) => {
		return data.games[id];
	},
	create: async () => {
		const id = (() => {
			const charList = 'ABCDEFHIJKLMNOPQRSTUVWXYZ0123456789';
			let result = '';
			for (let i = 0; i < 6; i++) {
				const randomIndex = Math.floor(Math.random() * charList.length);
				result += charList[randomIndex];
			}
			return result;
		})();

		const game = { id };

		data.games[id] = game;

		return game;
	}
};
