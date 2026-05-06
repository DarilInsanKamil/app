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
	signUpEmail: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email')?.toString() ?? '';
		const password = formData.get('password')?.toString() ?? '';
		const name = formData.get('name')?.toString() ?? '';

		if (!name || !email || !password) {
			return fail(400, { message: 'Nama, email, dan password wajib diisi' });
		}

		try {
			await auth.api.signUpEmail({
				body: {
					email,
					password,
					name,
					role: 'user'
				},
				asResponse: false
			});

			throw redirect(302, '/');
		} catch (error) {
			if (isRedirect(error)) throw error;

			console.error('Signup Error:', error);

			if (error instanceof APIError) {
				return fail(400, { message: error.message });
			}

			const errorMessage = error instanceof Error ? error.message : 'Unexpected error';
			return fail(500, { message: errorMessage });
		}
	}
};
