import { relations, sql } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  uuid,
  pgEnum,
  integer,
  jsonb,
  date,
  check,
  numeric,
} from "drizzle-orm/pg-core";

interface AddOnsProperties {
  nama: string;
}

export const roleEnum = pgEnum("role", ["user", "admin"]);
export const user = pgTable("user", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: roleEnum("role").default("user"),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const armada = pgTable("armada", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  imageUrl: text("image_url").notNull(),
  publicImageId: text("public_image_id").notNull(),
  namaArmada: text("nama_armada").notNull(),
  jumlahUnit: integer("jumlah_unit").default(1),
  platNomor: text("plat_nomor").notNull(),
  kapasitas: integer("kapasitas").notNull(),
  deskripsi: text("deskripsi"),
  isAvailable: boolean("is_available").default(true).notNull(),
  hargaSewa: numeric("harga_sewa").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
});

export const bundle = pgTable("bundle", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  namaBundle: text("nama_bundle").notNull(),
  imageUrl: text("image_url").notNull(),
  publicImageId: text("public_image_id").notNull(),
  deskripsi: text("deskripsi"),
  hargaBundle: numeric("harga_bundle").notNull(),
  jumlahUnit: integer("jumlah_unit").notNull(),
  addOns: jsonb("add_ons").$type<string[]>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
});

export const gallery = pgTable("gallery", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  imageUrl: text("image_url").notNull(),
  publicImageId: text("public_image_id").notNull(),
  deskripsi: text("deskripsi"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
});

export const testimoni = pgTable("testimoni", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  nama: text("nama").notNull(),
  komentar: text("komentar").notNull(),
  rating: integer("rating").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
});

export const customer = pgTable("customer", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  namaLengkap: text("nama_lengkap").notNull(),
  alamat: text("alamat"),
  email: text("email").unique(),
  noHp: text("no_hp").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
});
export const StatusTransaksiEnum = pgEnum("status_transaksi", [
  "menunggu_pembayaran",
  "dp",
  "lunas",
  "dibatalkan",
]);

export const reservasi = pgTable(
  "reservasi",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    bundleId: uuid("bundle_id").references(() => bundle.id),
    armadaId: uuid("armada_id").references(() => armada.id),
    jumlahUnit: integer("jumlah_unit").notNull(),
    customerId: uuid("customer_id").references(() => customer.id),
    totalHarga: numeric("total_harga").notNull(),
    tanggalMulai: date("tanggal_mulai").notNull(),
    kodeBooking: text("kode_booking").unique(),
    tanggalSelesai: date("tanggal_selesai").notNull(),
    lokasiJemput: text("lokasi_jemput"),
    statusTransaksi: StatusTransaksiEnum("status_transaksi").default(
      "menunggu_pembayaran",
    ),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    check(
      "check_bundle_or_armada",
      sql`(${table.bundleId} IS NOT NULL OR ${table.armadaId} IS NOT NULL)`,
    ),
    index("idx_reservasi_customer").on(table.customerId),
    index("idx_reservasi_status").on(table.statusTransaksi),
  ],
);

export const StatusPembayaranEnum = pgEnum("status_pembayaran", [
  "pending",
  "canceled",
  "completed",
]);
export const MetodeBayarEnum = pgEnum("metode_bayar", ["dp", "lunas"])
export const pembayaran = pgTable("pembayaran", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  reservasiId: uuid("reservasi_id")
    .references(() => reservasi.id)
    .notNull(),
  orderId: text("order_id").unique().notNull(),
  metodeBayar: MetodeBayarEnum("metode_bayar").default("lunas").notNull(),
  amount: numeric("amount").notNull(),
  fee: numeric("fee").notNull(),
  totalPayment: numeric("total_payment").notNull(),
  paymentMethod: text("payment_method").notNull(),
  paymentNumber: text("payment_number"),
  paymentUrl: text("payment_url"),
  redirectUrl: text("redirect_url"),
  status: StatusPembayaranEnum("status").default("pending").notNull(),
  expiredAt: timestamp("expired_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
});

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const armadaRelations = relations(armada, ({ many }) => ({
  reservasi: many(reservasi),
}));

export const bundleRelations = relations(bundle, ({ many }) => ({
  reservasi: many(reservasi),
}));

export const customerRelations = relations(customer, ({ many }) => ({
  reservasi: many(reservasi),
}));

export const reservasiRelations = relations(reservasi, ({ one, many }) => ({
  // many-to-one — reservasi milik satu customer
  customer: one(customer, {
    fields: [reservasi.customerId],
    references: [customer.id],
  }),

  // many-to-one — reservasi bisa pakai satu armada (nullable)
  armada: one(armada, {
    fields: [reservasi.armadaId],
    references: [armada.id],
  }),

  // many-to-one — reservasi bisa pakai satu bundle (nullable)
  bundle: one(bundle, {
    fields: [reservasi.bundleId],
    references: [bundle.id],
  }),

  // one-to-many — satu reservasi bisa punya banyak pembayaran (DP → Lunas)
  pembayaran: many(pembayaran),
}));

export const pembayaranRelations = relations(pembayaran, ({ one }) => ({
  // many-to-one — pembayaran milik satu reservasi
  reservasi: one(reservasi, {
    fields: [pembayaran.reservasiId],
    references: [reservasi.id],
  }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const schema = {
  user,
  account,
  verification,
  session,
  userRelations,
  accountRelations,
  sessionRelations,
  armada,
  gallery,
  bundle,
  testimoni,
  reservasi,
  pembayaran,
  customer,
  armadaRelations,
  reservasiRelations,
  bundleRelations,
  customerRelations,
  pembayaranRelations,
};
