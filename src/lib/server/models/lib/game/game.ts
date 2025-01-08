export class Game {
	id: string;
	players: {
		[id: string]: {
			name: string;
			ready: boolean;
			points: number;
			isAnswering: boolean;
		};
	}[];
	gridValues: number[];
	foundSolutions: number[][];
	status: 'waiting' | 'beginning' | 'memorizing' | 'answering' | 'finished';
	lastModified: number;

	constructor() {
		this.id = (() => {
			const charList = 'ABCDEFHIJKLMNOPQRSTUVWXYZ0123456789';
			let result = '';
			for (let i = 0; i < 6; i++) {
				const randomIndex = Math.floor(Math.random() * charList.length);
				result += charList[randomIndex];
			}
			return result;
		})();
		this.players = [];
		this.gridValues = [];
		this.foundSolutions = [];
		this.status = 'waiting';
		this.lastModified = Date.now();
	}
}
