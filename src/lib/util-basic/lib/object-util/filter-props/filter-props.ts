export function filterByKeys<T extends Record<string, any>, K extends keyof T>(
	obj: T,
	keys: K[]
): { [P in K]: T[P] } {
	const result = {} as { [P in K]: T[P] };

	keys.forEach((key) => {
		if (key in obj) {
			result[key] = obj[key];
		}
	});

	return result;
}
