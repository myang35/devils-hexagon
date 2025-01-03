const timeouts: { [name: string]: number } = {};

export const NamedTimeout = {
	set(name: string, handler: Function, timeout?: number, ...args: any[]) {
		timeouts[name] = setTimeout(
			() => {
				handler();
				delete timeouts[name];
			},
			timeout,
			args
		);
		return timeouts[name];
	},
	clear(name: string) {
		clearTimeout(timeouts[name]);
		delete timeouts[name];
	}
};
