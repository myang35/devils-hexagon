export const Player = {
	init: () => {
		const localPlayerId = localStorage.getItem('player');
		if (localPlayerId) return localPlayerId;

		const newPlayerId = crypto.randomUUID();
		localStorage.setItem('player', newPlayerId);
		return newPlayerId;
	}
};
