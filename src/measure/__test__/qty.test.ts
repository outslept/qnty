import { describe, expect, it } from "vite-plus/test";
import {
  add,
  cbrt,
  cubed,
  div,
  format,
  hypot,
  inv,
  max,
  min,
  mul,
  neg,
  pow,
  qty,
  sq,
  sqrt,
  sub,
  sum,
  to,
} from "../qty.ts";

describe("zero-cost Qty runtime operations", () => {
  it("evaluates arithmetic as raw numbers with zero wrapper overhead", () => {
    const d = qty(100, "m");
    const t = qty(10, "s");
    expect(typeof d).toBe("number");
    expect(add(d, qty(50, "m"))).toBe(150);
    expect(sub(d, qty(30, "m"))).toBe(70);
    expect(neg(d)).toBe(-100);
    expect(div(d, t)).toBe(10);
    expect(mul(div(d, t), t)).toBe(100);
    expect(inv(t)).toBe(0.1);
    expect(sq(t)).toBe(100);
    expect(cubed(t)).toBe(1000);
    expect(pow(t, 4)).toBe(10000);
    expect(sqrt(sq(d))).toBe(100);
    expect(cbrt(cubed(d))).toBe(100);
  });

  it("supports math helpers, conversions, and formatting", () => {
    expect(hypot(qty(3, "m"), qty(4, "m"))).toBe(5);
    expect(sum(qty(1, "m"), qty(2, "m"), qty(3, "m"))).toBe(6);
    expect(min(qty(5, "m"), qty(2, "m"))).toBe(2);
    expect(max(qty(5, "m"), qty(2, "m"))).toBe(5);
    expect(to(qty(100, "degC"), "degC", "degF")).toBeCloseTo(212, 5);
    expect(format(qty(9.81, "m/s^2"), "m/s^2")).toBe("9.81 m/s^2");
  });
});
