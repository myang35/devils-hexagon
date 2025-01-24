import type { Player } from '$lib/server/models';

export const playerRouter = {
	create: async () => {
		return {
			id: crypto.randomUUID()
		} as Player;
	}
};
