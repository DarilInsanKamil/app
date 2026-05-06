import { db } from "$lib/server/db";
import { armada, bundle } from "$lib/server/db/schema";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const dataArmada = await db.select().from(armada).limit(5)
  const dataBundle = await db.select().from(bundle).limit(5)
  return {
    success: true,
    armada: dataArmada,
    bundle: dataBundle,
  }
}
