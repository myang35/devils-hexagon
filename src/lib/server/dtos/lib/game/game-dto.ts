export type GameDto = {
	id: string;
	roomId: string;
	status: string;
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
};
