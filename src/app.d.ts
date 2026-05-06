import type { User, Session } from 'better-auth/minimal';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user?: User & { role?: 'user' | 'admin' | string };
			session?: Session;
		}

		// interface Error {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
		interface ActionData {
			snapToken?: string
			reservasiId?: string
			message?: string
			success?: boolean
		}
		interface Window {
			snap: {
				pay: (token: string, options: {
					onSuccess: (result: unknown) => void
					onPending: (result: unknown) => void
					onError: (result: unknown) => void
					onClose: () => void
				}) => void
			}
		}
	}
}

export { };
