import { describe, expect, it } from "vite-plus/test";
import {
  abs,
  add,
  cbrt,
  ceil,
  cubed,
  div,
  floor,
  format,
  hypot,
  inv,
  max,
  min,
  mul,
  neg,
  pow,
  qty,
  round,
  scale,
  sq,
  sqrt,
  sub,
  sum,
  to,
  trunc,
  unwrap,
} from "../qty.ts";

describe("zero-cost Qty runtime operations", () => {
  it("evaluates arithmetic as raw numbers with zero wrapper overhead", () => {
    const d = qty(100, "m");
    const t = qty(10, "s");
    expect(typeof d).toBe("number");
    expect(unwrap(d)).toBe(100);
    expect(add(d, qty(50, "m"))).toBe(150);
    expect(sub(d, qty(30, "m"))).toBe(70);
    expect(neg(d)).toBe(-100);
    expect(scale(d, 2.5)).toBe(250);
    expect(div(d, t)).toBe(10);
    expect(mul(div(d, t), t)).toBe(100);
    expect(inv(t)).toBe(0.1);
    expect(sq(t)).toBe(100);
    expect(cubed(t)).toBe(1000);
    expect(pow(t, 4)).toBe(10000);
    expect(sqrt(sq(d))).toBe(100);
    expect(cbrt(cubed(d))).toBe(100);
  });

  it("supports rounding, math helpers, conversions, and formatting", () => {
    const x = qty(-3.7, "m");
    expect(abs(x)).toBe(3.7);
    expect(floor(x)).toBe(-4);
    expect(ceil(x)).toBe(-3);
    expect(round(x)).toBe(-4);
    expect(trunc(x)).toBe(-3);

    expect(hypot(qty(3, "m"), qty(4, "m"))).toBe(5);
    expect(sum(qty(1, "m"), qty(2, "m"), qty(3, "m"))).toBe(6);
    expect(min(qty(5, "m"), qty(2, "m"))).toBe(2);
    expect(max(qty(5, "m"), qty(2, "m"))).toBe(5);
    expect(to(qty(100, "degC"), "degC", "degF")).toBeCloseTo(212, 5);
    expect(format(qty(9.81, "m/s^2"), "m/s^2")).toBe("9.81 m/s^2");
    expect(format(qty(9.81, "m/s^2"), "m/s^2", (n) => n.toFixed(1))).toBe("9.8 m/s^2");
    expect(format(qty(42, ""), "")).toBe("42");
  });
});
