import { describe, expect, it } from "vite-plus/test";
import { convertScalar, evalUnitVec } from "../unitSystem.ts";

describe("runtime unit evaluation and conversion", () => {
  it("converts compound linear units accurately", () => {
    expect(convertScalar(60, "mi/hr", "m/s")).toBeCloseTo(26.8224, 5);
    expect(convertScalar(1, "N * m", "J")).toBe(1);
    expect(convertScalar(1, "atm", "Pa")).toBe(101325);
    expect(convertScalar(1, "L", "cm^3")).toBeCloseTo(1000, 8);
  });

  it("converts affine temperature scales accurately", () => {
    expect(convertScalar(0, "degC", "K")).toBeCloseTo(273.15, 5);
    expect(convertScalar(100, "degC", "degF")).toBeCloseTo(212, 5);
    expect(convertScalar(-40, "degC", "degF")).toBeCloseTo(-40, 5);
  });

  it("throws on unknown symbols, compound affine units, or mismatched dimensions", () => {
    expect(() => evalUnitVec("blarg")).toThrow("Unknown unit symbol: blarg");
    expect(() => evalUnitVec("degC * m")).toThrow("Affine unit 'degC'");
    expect(() => evalUnitVec("degC^2")).toThrow("Affine unit 'degC'");
    expect(() => convertScalar(10, "m/s", "kg")).toThrow("Incompatible dimensions");
  });
});
