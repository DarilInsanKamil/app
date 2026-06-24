import { db } from "$lib/server/db";
import { fail, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { asc, count, eq, ilike, or } from "drizzle-orm";
import { customer } from "$lib/server/db/schema";

export const load: PageServerLoad = async ({ url }) => {
  const search = url.searchParams.get('search')?.toString() ?? ''
  const page = Number(url.searchParams.get('page')?.toString() ?? '1')
  const limit = Number(url.searchParams.get('limit')?.toString() ?? '10')
  const offset = (page - 1) * limit;

  const whereClause = search
    ? or(
        ilike(customer.namaLengkap, `%${search}%`),
        ilike(customer.email, `%${search}%`),
        ilike(customer.noHp, `%${search}%`)
      )
    : undefined;

  const result = await db.select().from(customer)
    .where(whereClause)
    .limit(limit)
    .offset(offset)
    .orderBy(asc(customer.createdAt));

  const totalResult = await db.select({ count: count() })
    .from(customer)
    .where(whereClause);

  const totalData = totalResult[0].count;
  const totalPages = Math.ceil(totalData / limit);

  return {
    success: true,
    dataCustomer: result,
    meta: {
      currentPage: page,
      totalPages,
      totalData,
      limit,
      search
    }
  };
};

export const actions: Actions = {
  delete: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get('id')?.toString() ?? '';

    const existing = await db.query.customer.findFirst({
      where: eq(customer.id, id)
    });

    if (!existing) {
      return fail(404, { message: "Data customer tidak ditemukan" });
    }

    try {
      await db.delete(customer).where(eq(customer.id, id));
    } catch (err) {
      return fail(500, { message: "Internal server error" });
    }
  }
};
