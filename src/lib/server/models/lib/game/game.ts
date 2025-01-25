import type { ObjectId } from 'mongodb';

export type Game = {
	_id: ObjectId;
	roomId: string;
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
	lastModified: Date;
};
