import { COOKIE_NAME } from "@shared/const";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { productImages, products, stores } from "../drizzle/schema";
import { getDb } from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";

async function getOrCreateStoreId(ownerId: number) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const existing = await db.select({ id: stores.id }).from(stores).where(eq(stores.ownerId, ownerId)).limit(1);
  if (existing[0]) return existing[0].id;
  const result = await db.insert(stores).values({ ownerId, name: "Minha loja" });
  return Number(result[0].insertId);
}

export const productInput = z.object({
  name: z.string().min(1).max(160),
  category: z.string().min(1).max(80),
  description: z.string().optional(),
  sizes: z.string().optional(),
  colors: z.string().optional(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/),
  compareAtPrice: z.string().regex(/^\d+(\.\d{1,2})?$/).optional().or(z.literal("")),
  status: z.enum(["available", "sold_out", "coming_soon", "promotion", "sale"]).default("available"),
}).refine((value) => !["promotion", "sale"].includes(value.status) || Boolean(value.compareAtPrice), {
  message: "Promoções e liquidações precisam de um preço anterior.",
  path: ["compareAtPrice"],
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  admin: router({
    store: router({
      get: adminProcedure.query(async ({ ctx }) => {
        const db = await getDb();
        if (!db) return null;
        const rows = await db.select().from(stores).where(eq(stores.ownerId, ctx.user.id)).limit(1);
        return rows[0] ?? null;
      }),
      save: adminProcedure.input(z.object({ name: z.string().min(1).max(160), whatsapp: z.string().max(32).optional(), defaultMessage: z.string().optional(), instagram: z.string().max(160).optional() })).mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Banco de dados indisponível");
        const existing = await db.select().from(stores).where(eq(stores.ownerId, ctx.user.id)).limit(1);
        if (existing[0]) {
          await db.update(stores).set({ ...input, updatedAt: new Date() }).where(eq(stores.id, existing[0].id));
          return { ...existing[0], ...input };
        }
        const result = await db.insert(stores).values({ ownerId: ctx.user.id, ...input });
        return { id: result[0].insertId, ownerId: ctx.user.id, ...input };
      }),
    }),
    products: router({
      list: adminProcedure.query(async ({ ctx }) => {
        const db = await getDb();
        if (!db) return [];
        const storeId = await getOrCreateStoreId(ctx.user.id);
        return db.select().from(products).where(eq(products.storeId, storeId)).orderBy(desc(products.createdAt));
      }),
      create: adminProcedure.input(productInput).mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Banco de dados indisponível");
        const storeId = await getOrCreateStoreId(ctx.user.id);
        const result = await db.insert(products).values({ storeId, ...input, compareAtPrice: input.compareAtPrice || null });
        return { id: result[0].insertId };
      }),
      update: adminProcedure.input(productInput.safeExtend({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Banco de dados indisponível");
        const { id, ...values } = input;
        const storeId = await getOrCreateStoreId(ctx.user.id);
        await db.update(products).set({ ...values, compareAtPrice: values.compareAtPrice || null, updatedAt: new Date() }).where(and(eq(products.id, id), eq(products.storeId, storeId)));
        return { success: true };
      }),
      remove: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Banco de dados indisponível");
        await db.delete(productImages).where(eq(productImages.productId, input.id));
        const storeId = await getOrCreateStoreId(ctx.user.id);
        await db.delete(products).where(and(eq(products.id, input.id), eq(products.storeId, storeId)));
        return { success: true };
      }),
    }),
  }),
});

export type AppRouter = typeof appRouter;
