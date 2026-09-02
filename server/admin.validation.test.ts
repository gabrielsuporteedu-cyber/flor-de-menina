import { describe, expect, it } from "vitest";
import { productInput } from "./routers";

describe("admin product validation", () => {
  it("accepts a product with a promotional compare-at price", () => {
    const result = productInput.safeParse({
      name: "Vestido Aurora",
      category: "Vestidos",
      description: "Vestido leve para dias especiais.",
      sizes: "P, M, G",
      colors: "Rosé",
      price: "199.00",
      compareAtPrice: "249.00",
      status: "promotion",
    });

    expect(result.success).toBe(true);
  });

  it("rejects malformed prices", () => {
    const result = productInput.safeParse({
      name: "Top Nude",
      category: "Top",
      price: "R$ 89,00",
      status: "available",
    });

    expect(result.success).toBe(false);
  });
});
