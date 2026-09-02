import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const contextFor = (role: "admin" | "user"): TrpcContext => ({
  user: { id: 7, openId: `user-${role}`, name: "Usuário", email: "user@example.com", loginMethod: "manus", role, createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
  req: { protocol: "https", headers: {} } as TrpcContext["req"],
  res: { clearCookie: () => undefined } as TrpcContext["res"],
});

describe("admin permissions", () => {
  it("blocks a regular user from reading the admin catalog", async () => {
    const caller = appRouter.createCaller(contextFor("user"));
    await expect(caller.admin.products.list()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
