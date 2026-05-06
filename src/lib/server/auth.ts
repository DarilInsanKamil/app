import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { env } from '$env/dynamic/private';
import { getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';
import bcrypt from 'bcrypt';

export const auth = betterAuth({
	baseURL: env.ORIGIN,
	secret: env.BETTER_AUTH_SECRET,
	trustedOrigins: [
		'http://localhost:5173',
		process.env.FRONTEND_URL ?? 'http://localhost:5173',
		'https://chemo-stiffen-angular.ngrok-free.dev'
	],
	database: drizzleAdapter(db, { provider: 'pg' }),
	user: {
		additionalFields: {
			role: {
				type: 'string',
				required: false,
				defaultValue: 'user',
				input: true
			}
		}
	},
	emailAndPassword: {
		enabled: true,
		autoSignIn: true,
		password: {
			hash: (pass) => bcrypt.hash(pass, 10),
			verify: ({ password, hash }) => bcrypt.compare(password, hash)
		}
	},
	advanced: {
		database: {
			generateId: 'uuid'
		}
	},
	session: {
		expiresIn: 60 * 60 * 24 * 7,
		cookieCache: {
			enabled: true,
			maxAge: 60 * 5
		}
	},
	plugins: [
		sveltekitCookies(getRequestEvent) // make sure this is the last plugin in the array
	]
});
