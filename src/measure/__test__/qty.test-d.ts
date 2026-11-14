import { describe, expectTypeOf, it } from "vite-plus/test";
import { add, div, mul, qty, sqrt, to, type Unit } from "../qty.ts";

describe("zero-cost Qty type safety", () => {
  it("propagates dimensions through arithmetic and matches SI aliases", () => {
    const d = qty(100, "m");
    const t = qty(10, "s");
    const v = div(d, t);
    const a = div(v, t);
    const f = mul(qty(5, "kg"), a);

    expectTypeOf(v).toEqualTypeOf<Unit<"m/s">>();
    expectTypeOf(f).toEqualTypeOf<Unit<"N">>();
    expectTypeOf(mul(f, d)).toEqualTypeOf<Unit<"J">>();
    expectTypeOf(sqrt(mul(d, d))).toEqualTypeOf<Unit<"m">>();
  });

  it("rejects incompatible additions, invalid roots, and mixed-scale multiplication", () => {
    // @ts-expect-error cannot add meters and feet
    add(qty(1, "m"), qty(1, "ft"));

    // @ts-expect-error cannot take square root of odd power
    sqrt(qty(9, "m"));

    // @ts-expect-error cannot multiply km and m without converting first
    mul(qty(2, "km"), qty(500, "m"));

    // @ts-expect-error cannot convert velocity into mass
    to(qty(60, "mi/hr"), "mi/hr", "kg");
  });
});
