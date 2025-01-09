import { Player } from '$lib/server/models';

export const playerRouter = {
	create: async () => {
		return new Player();
	}
};
