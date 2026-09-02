import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("admin store isolation", () => {
  it("keeps product and image mutations scoped to the authenticated store", () => {
    const source = readFileSync(new URL("./routers.ts", import.meta.url), "utf8");
    expect(source).toContain("eq(products.storeId, storeId)");
    expect(source).toContain("eq(productImages.productId, input.productId)");
    expect(source).toContain("const storeId = await getOrCreateStoreId(ctx.user.id)");
  });
});
