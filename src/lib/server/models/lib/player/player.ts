export class Player {
	id: string;

	constructor() {
		this.id = crypto.randomUUID();
	}
}
