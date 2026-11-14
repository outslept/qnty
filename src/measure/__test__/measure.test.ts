import { describe, expect, expectTypeOf, it } from "vite-plus/test";
import { Measure } from "../measure.ts";
import type { Unit } from "../qty.ts";

describe("fluent Measure class", () => {
  const m = Measure.of(1, "m");
  const s = Measure.of(1, "s");
  const kg = Measure.of(1, "kg");

  it("constructs, chains arithmetic, and unboxes to Qty", () => {
    const speed = Measure.of(100, m).over(Measure.of(10, s));
    const force = Measure.of(5, kg).times(speed.div(Measure.of(2, s)));

    expect(speed.value).toBe(10);
    expect(speed.toString()).toBe("10 m / s");
    expect(force.toString()).toBe("25 kg * m / s^2");
    expectTypeOf(force.toQty()).toEqualTypeOf<Unit<"N">>();

    expect(Measure.of(10, m).plus(Measure.of(5, m)).value).toBe(15);
    expect(Measure.of(10, m).minus(Measure.of(3, m)).value).toBe(7);
    expect(Measure.of(10, m).negate().value).toBe(-10);
    expect(Measure.of(10, m).scale(3).value).toBe(30);
    expect(Measure.of(2, m).cubed().value).toBe(8);
    expect(Measure.of(5, m).pow(0)).toEqual(Measure.dimensionless(1));
    expect(Measure.of(4, s).reciprocal().value).toBe(0.25);
    expect(speed.squared().sqrt().value).toBe(10);
  });

  it("compares measures of the same dimension", () => {
    const a = Measure.of(5, m);
    const b = Measure.of(10, m);
    const a2 = Measure.of(5, m);

    expect(a.compare(b)).toBeLessThan(0);
    expect(a.lt(b)).toBe(true);
    expect(a.lte(a2)).toBe(true);
    expect(a.eq(a2)).toBe(true);
    expect(a.neq(b)).toBe(true);
    expect(b.gt(a)).toBe(true);
    expect(b.gte(a2)).toBe(true);
  });

  it("converts and formats via .valueIn() and .in() with custom formatters", () => {
    const kilo = Measure.prefix("k", 1000);
    const km = kilo(m);
    const dist = Measure.of(2500, m);

    expect(dist.valueIn(km)).toBe(2.5);
    expect(dist.in(km)).toBe("2.5 km");
    expect(dist.valueIn("km")).toBe(2.5);
    expect(dist.in("km")).toBe("2.5 km");
    expect(dist.in(km.withSymbol(undefined))).toBe("2500 m");
    expect(dist.in(km, { formatValue: (v) => v.toFixed(2) })).toBe("2.50 km");
    expect(Measure.of(100, "degC").valueIn("degF")).toBeCloseTo(212, 5);
  });

  it("rejects invalid operations at compile time", () => {
    // @ts-expect-error cannot add meters and seconds
    m.plus(s);

    // @ts-expect-error cannot compare meters and kilograms
    m.lt(kg);

    // @ts-expect-error cannot take square root of odd power
    m.sqrt();
  });
});
