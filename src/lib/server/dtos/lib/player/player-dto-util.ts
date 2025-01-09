import type { Player } from '$lib/server/models';
import type { PlayerDto } from './player-dto';

export const PlayerDtoUtil = {
	fromPlayer: (player: Player) => {
		return {
			id: player.id
		} as PlayerDto;
	}
};
