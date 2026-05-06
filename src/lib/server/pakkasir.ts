import { env } from '$env/dynamic/private';
import { Pakasir } from 'pakasir-sdk';

export const pakasir = new Pakasir({
	slug: env.PAKASIR_SLUG,
	apikey: env.PAKASIR_API_KEY
});
