import { MONGO_URI } from '$env/static/private';
import { initDb } from '$lib/server/database';
import type { LayoutServerLoad } from './$types';

export const load = (async () => {
	initDb(MONGO_URI);
	return {};
}) satisfies LayoutServerLoad;
