import { describe, expect, it } from "vitest";
import { hashPassword, validatePassword, verifyPassword } from "./passwordAuth";

describe("password authentication", () => {
  it("hashes and verifies a password without storing the original value", () => {
    const password = "FlorSegura123";
    const hash = hashPassword(password);
    expect(hash).not.toContain(password);
    expect(verifyPassword(password, hash)).toBe(true);
    expect(verifyPassword("senha-incorreta", hash)).toBe(false);
  });

  it("requires at least eight characters", () => {
    expect(validatePassword("1234567")).toBe(false);
    expect(validatePassword("12345678")).toBe(true);
  });
});
