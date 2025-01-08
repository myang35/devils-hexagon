export class Game {
	id: string;
	status: 'waiting' | 'beginning' | 'memorizing' | 'answering' | 'finished';
	players: {
		[id: string]: {
			name: string;
			ready: boolean;
			points: number;
			isAnswering: boolean;
		};
	};
	gridValues: number[];
	selectedIndexes: number[];
	foundSolutions: number[][];
	target: number;
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
		this.status = 'waiting';
		this.players = {};
		this.gridValues = [];
		this.selectedIndexes = [];
		this.foundSolutions = [];
		this.target = 0;
		this.lastModified = Date.now();
	}
}
