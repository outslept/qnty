import { describe, expect, expectTypeOf, it } from "vite-plus/test";
import { Measure } from "../measure.ts";
import type { Unit } from "../qty.ts";

describe("fluent Measure class", () => {
  const m = Measure.of(1, "m");
  const s = Measure.of(1, "s");
  const kg = Measure.of(1, "kg");

  it("constructs, chains arithmetic, and unboxes to Qty", () => {
    const speed = Measure.of(100, m).over(Measure.of(10, s));
    const force = Measure.of(5, kg).times(speed.over(Measure.of(2, s)));

    expect(speed.value).toBe(10);
    expect(speed.toString()).toBe("10 m / s");
    expect(force.toString()).toBe("25 kg * m / s^2");
    expectTypeOf(force.toQty()).toEqualTypeOf<Unit<"N">>();
    expect(speed.squared().sqrt().value).toBe(10);
  });

  it("converts and formats via .valueIn() and .in() using string or Measure targets", () => {
    const kilo = Measure.prefix("k", 1000);
    const km = kilo(m);
    const dist = Measure.of(2500, m);

    expect(dist.valueIn(km)).toBe(2.5);
    expect(dist.in(km)).toBe("2.5 km");
    expect(dist.valueIn("km")).toBe(2.5);
    expect(dist.in("km")).toBe("2.5 km");
    expect(Measure.of(100, "degC").valueIn("degF")).toBeCloseTo(212, 5);
  });
});
