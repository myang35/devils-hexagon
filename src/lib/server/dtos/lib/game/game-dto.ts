export type GameDto = {
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
	status: string;
	lastModified: number;
};
