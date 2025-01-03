const intervals: { [name: string]: number } = {};

export const NamedInterval = {
	set(name: string, handler: Function, timeout?: number, ...args: any[]) {
		intervals[name] = setInterval(handler, timeout, args);
		return intervals[name];
	},
	clear(name: string) {
		clearInterval(intervals[name]);
		delete intervals[name];
	}
};
