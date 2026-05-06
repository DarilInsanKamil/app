import { fail, redirect, isRedirect, type Actions } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';
import { APIError } from 'better-auth/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user?.role === 'admin') {
		throw redirect(302, '/dashboard');
	}

	if (locals.user) {
		throw redirect(302, '/');
	}
};

export const actions: Actions = {
	signInEmail: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email')?.toString() ?? '';
		const password = formData.get('password')?.toString() ?? '';

		if (!email || !password) {
			return fail(400, { message: 'Email dan password wajib diisi' });
		}

		try {
			const result = await auth.api.signInEmail({
				body: {
					email,
					password
				},
				asResponse: false // Ensure better-auth handles the event context
			});

			throw redirect(302, result.user.role === 'admin' ? '/dashboard' : '/');
		} catch (error) {
			if (isRedirect(error)) throw error; // Allow SvelteKit to handle the redirect

			if (error instanceof APIError) {
				return fail(400, { message: error.message || 'Signin failed' });
			}
			return fail(500, { message: 'Unexpected error' });
		}
	}
};
