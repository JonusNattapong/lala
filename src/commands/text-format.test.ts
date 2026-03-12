import { describe, expect, it } from "vitest";
import { shortenText } from "./text-format.js";

describe("shortenText", () => {
  it("returns original text when it fits", () => {
    expect(shortenText("lala", 16)).toBe("lala");
  });

  it("truncates and appends ellipsis when over limit", () => {
    expect(shortenText("lala-status-output", 10)).toBe("lala-…");
  });

  it("counts multi-byte characters correctly", () => {
    expect(shortenText("hello🙂world", 7)).toBe("hello🙂…");
  });
});
