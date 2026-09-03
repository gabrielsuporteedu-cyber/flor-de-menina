import { COOKIE_NAME } from "@shared/const";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { productImages, products, stores } from "../drizzle/schema";
import { getDb, getUserByEmail, setUserPasswordHash } from "./db";
import { hashPassword, validatePassword, verifyPassword } from "./passwordAuth";
import { sdk } from "./_core/sdk";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { storagePut } from "./storage";

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
    me: publicProcedure.query(opts => { if (!opts.ctx.user) return null; const { passwordHash: _passwordHash, ...safeUser } = opts.ctx.user; return safeUser; }),
    hasPassword: adminProcedure.query(({ ctx }) => Boolean(ctx.user.passwordHash)),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
    login: publicProcedure.input(z.object({ email: z.string().email(), password: z.string().min(1) })).mutation(async ({ ctx, input }) => {
      const user = await getUserByEmail(input.email);
      if (!user || user.role !== "admin" || !verifyPassword(input.password, user.passwordHash)) {
        throw new Error("E-mail ou senha inválidos.");
      }
      const token = await sdk.createLocalSessionToken(user.id, user.name || "Admin");
      ctx.res.cookie(COOKIE_NAME, token, { ...getSessionCookieOptions(ctx.req), maxAge: 1000 * 60 * 60 * 24 * 30 });
      return { success: true } as const;
    }),
    setPassword: adminProcedure.input(z.object({ newPassword: z.string().min(8).max(128) })).mutation(async ({ ctx, input }) => {
      if (!validatePassword(input.newPassword)) throw new Error("A senha deve ter entre 8 e 128 caracteres.");
      await setUserPasswordHash(ctx.user.id, hashPassword(input.newPassword));
      return { success: true } as const;
    }),
    changePassword: adminProcedure.input(z.object({ currentPassword: z.string().min(1), newPassword: z.string().min(8).max(128) })).mutation(async ({ ctx, input }) => {
      if (!verifyPassword(input.currentPassword, ctx.user.passwordHash)) throw new Error("A senha atual está incorreta.");
      if (!validatePassword(input.newPassword)) throw new Error("A nova senha deve ter entre 8 e 128 caracteres.");
      await setUserPasswordHash(ctx.user.id, hashPassword(input.newPassword));
      return { success: true } as const;
    }),
  }),
  catalog: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    const store = await db.select({ id: stores.id }).from(stores).limit(1);
    if (!store[0]) return [];
    const rows = await db.select().from(products).where(eq(products.storeId, store[0].id)).orderBy(desc(products.createdAt));
    const images = await db.select().from(productImages);
    return rows.map((product) => ({ ...product, image: images.find((image) => image.productId === product.id && image.isPrimary === 1)?.url ?? images.find((image) => image.productId === product.id)?.url ?? null }));
  }),
  storeInfo: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return null;
    const rows = await db.select({ name: stores.name, logoUrl: stores.logoUrl, heroMediaUrl: stores.heroMediaUrl, heroMediaType: stores.heroMediaType, heroHeadline: stores.heroHeadline, whatsapp: stores.whatsapp, defaultMessage: stores.defaultMessage, instagram: stores.instagram }).from(stores).limit(1);
    return rows[0] ?? null;
  }),
  admin: router({
    store: router({
      get: adminProcedure.query(async ({ ctx }) => {
        const db = await getDb();
        if (!db) return null;
        const rows = await db.select().from(stores).where(eq(stores.ownerId, ctx.user.id)).limit(1);
        return rows[0] ?? null;
      }),
      uploadBrandAsset: adminProcedure.input(z.object({ kind: z.enum(["logo", "hero"]), fileName: z.string().max(180), mimeType: z.string(), data: z.string().regex(/^data:(image\/(jpeg|png|webp)|video\/mp4);base64,/) })).mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Banco de dados indisponível");
        const storeId = await getOrCreateStoreId(ctx.user.id);
        const stored = await storagePut(`store/${ctx.user.id}/${Date.now()}-${input.fileName}`, Buffer.from(input.data.split(",")[1] ?? "", "base64"), input.mimeType);
        await db.update(stores).set(input.kind === "logo" ? { logoUrl: stored.url } : { heroMediaUrl: stored.url, heroMediaType: "video" }).where(eq(stores.id, storeId));
        return stored;
      }),
      save: adminProcedure.input(z.object({ name: z.string().min(1).max(160), whatsapp: z.string().max(32).optional(), defaultMessage: z.string().optional(), instagram: z.string().max(160).optional(), heroHeadline: z.string().min(5).max(240) })).mutation(async ({ ctx, input }) => {
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
      uploadImage: adminProcedure.input(z.object({ productId: z.number().int().positive(), fileName: z.string().max(180), mimeType: z.string().regex(/^image\/(jpeg|png|webp)$/), data: z.string().regex(/^data:image\/(jpeg|png|webp);base64,/) })).mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Banco de dados indisponível");
        const storeId = await getOrCreateStoreId(ctx.user.id);
        const product = await db.select({ id: products.id }).from(products).where(and(eq(products.id, input.productId), eq(products.storeId, storeId))).limit(1);
        if (!product[0]) throw new Error("Produto não encontrado");
        const buffer = Buffer.from(input.data.split(",")[1] ?? "", "base64");
        const stored = await storagePut(`products/${ctx.user.id}/${Date.now()}-${input.fileName}`, buffer, input.mimeType);
        const existing = await db.select({ id: productImages.id }).from(productImages).where(eq(productImages.productId, input.productId));
        await db.insert(productImages).values({ productId: input.productId, url: stored.url, storageKey: stored.key, sortOrder: existing.length, isPrimary: existing.length === 0 ? 1 : 0 });
        return { url: stored.url, key: stored.key };
      }),
      images: router({
        list: adminProcedure.input(z.object({ productId: z.number().int().positive() })).query(async ({ ctx, input }) => {
          const db = await getDb();
          if (!db) return [];
          const storeId = await getOrCreateStoreId(ctx.user.id);
          const owned = await db.select({ id: products.id }).from(products).where(and(eq(products.id, input.productId), eq(products.storeId, storeId))).limit(1);
          if (!owned[0]) return [];
          return db.select().from(productImages).where(eq(productImages.productId, input.productId)).orderBy(productImages.sortOrder);
        }),
        setPrimary: adminProcedure.input(z.object({ id: z.number().int().positive(), productId: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
          const db = await getDb();
          if (!db) throw new Error("Banco de dados indisponível");
          const storeId = await getOrCreateStoreId(ctx.user.id);
          const owned = await db.select({ id: products.id }).from(products).where(and(eq(products.id, input.productId), eq(products.storeId, storeId))).limit(1);
          if (!owned[0]) throw new Error("Produto não encontrado");
          await db.update(productImages).set({ isPrimary: 0 }).where(eq(productImages.productId, input.productId));
          await db.update(productImages).set({ isPrimary: 1 }).where(and(eq(productImages.id, input.id), eq(productImages.productId, input.productId)));
          return { success: true };
        }),
        reorder: adminProcedure.input(z.object({ id: z.number().int().positive(), productId: z.number().int().positive(), direction: z.enum(["up", "down"]) })).mutation(async ({ ctx, input }) => {
          const db = await getDb();
          if (!db) throw new Error("Banco de dados indisponível");
          const storeId = await getOrCreateStoreId(ctx.user.id);
          const owned = await db.select({ id: products.id }).from(products).where(and(eq(products.id, input.productId), eq(products.storeId, storeId))).limit(1);
          if (!owned[0]) throw new Error("Produto não encontrado");
          const currentRows = await db.select().from(productImages).where(eq(productImages.productId, input.productId)).orderBy(productImages.sortOrder);
          const index = currentRows.findIndex((image) => image.id === input.id);
          const nextIndex = input.direction === "up" ? index - 1 : index + 1;
          if (index < 0 || !currentRows[nextIndex]) return { success: true };
          const current = currentRows[index];
          const next = currentRows[nextIndex];
          await db.update(productImages).set({ sortOrder: next.sortOrder }).where(eq(productImages.id, current.id));
          await db.update(productImages).set({ sortOrder: current.sortOrder }).where(eq(productImages.id, next.id));
          return { success: true };
        }),
        remove: adminProcedure.input(z.object({ id: z.number().int().positive(), productId: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
          const db = await getDb();
          if (!db) throw new Error("Banco de dados indisponível");
          const storeId = await getOrCreateStoreId(ctx.user.id);
          const owned = await db.select({ id: products.id }).from(products).where(and(eq(products.id, input.productId), eq(products.storeId, storeId))).limit(1);
          if (!owned[0]) throw new Error("Produto não encontrado");
          await db.delete(productImages).where(and(eq(productImages.id, input.id), eq(productImages.productId, input.productId)));
          return { success: true };
        }),
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
