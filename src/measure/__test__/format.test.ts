import { describe, expect, it } from "vite-plus/test";
import { formatUnit, parseUnit } from "../format.ts";

describe("runtime parseUnit and formatUnit", () => {
  it("parses and normalizes unit strings", () => {
    expect(parseUnit("")).toEqual({});
    expect(parseUnit("1/s")).toEqual({ s: -1 });
    expect(parseUnit("kg ⋅ m / s²")).toEqual({ kg: 1, m: 1, s: -2 });
    expect(parseUnit("m^2 / (kg * s^2)")).toEqual({ m: 2, kg: -1, s: -2 });
    expect(parseUnit("m * s / s")).toEqual({ m: 1 });
    expect(parseUnit("a / (b / (c * d))")).toEqual({ a: 1, b: -1, c: 1, d: 1 });
  });

  it("formats unit vectors canonically and round-trips with parseUnit", () => {
    expect(formatUnit({})).toBe("");
    expect(formatUnit({ m: 1 })).toBe("m");
    expect(formatUnit({ s: -1 })).toBe("s^-1");
    expect(formatUnit({ m: -3, s: -2 })).toBe("m^-3 * s^-2");
    expect(formatUnit({ kg: 1, m: 1, s: -2 })).toBe("kg * m / s^2");
    expect(formatUnit({ m: 2, kg: -1, s: -2 })).toBe("m^2 / (kg * s^2)");
    expect(parseUnit(formatUnit({ m: 2, kg: -1, s: -2 }))).toEqual({ m: 2, kg: -1, s: -2 });
  });
});
