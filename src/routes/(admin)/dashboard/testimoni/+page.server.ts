import { db } from "$lib/server/db";
import { testimoni } from "$lib/server/db/schema";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const dataTestimoni = await db.select().from(testimoni).limit(5)
  return {
    success: true,
    dataTestimoni
  }
}
