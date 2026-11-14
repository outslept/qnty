import { describe, expect, it } from "vite-plus/test";
import { Measure } from "../../measure/measure.ts";
import { degrees, piRadians } from "../angle.ts";
import { kilograms, meters, radians, seconds } from "../base.ts";
import { bytes, gibi, kibi } from "../memory.ts";
import { atto, kilo, newtons } from "../metric.ts";
import * as Trig from "../trig.ts";

describe("SI base, metric, memory, and trig units", () => {
  it("matches derived metric units with compound base expressions", () => {
    expect(newtons).toEqual(kilograms.times(meters.per(seconds.squared())).withSymbol("N"));
    expect(kilo(meters).symbol).toBe("km");
    expect(atto(meters).symbol).toBe("am");
    expect(kibi(bytes).value).toBe(8192);
    expect(gibi(bytes).symbol).toBe("GiB");
  });

  it("evaluates trig and inverse trig functions on angles and matching units", () => {
    const zeroRad = Measure.of(0, radians);
    const zero = Measure.dimensionless(0);

    expect(Trig.cos(zeroRad)).toEqual(Measure.dimensionless(1));
    expect(Trig.sin(zeroRad)).toEqual(zero);
    expect(Trig.tan(zeroRad)).toEqual(zero);
    expect(Trig.acos(zero)).toEqual(Measure.of(0.5, piRadians));
    expect(Trig.asin(zero)).toEqual(zeroRad);
    expect(Trig.atan(zero)).toEqual(zeroRad);
    expect(Trig.atan2(Measure.of(5, meters), Measure.of(5, meters)).value).toBeCloseTo(
      Measure.of(45, degrees).value,
      10,
    );

    // @ts-expect-error sin requires radians angle
    Trig.sin(meters);

    // @ts-expect-error acos requires dimensionless input
    Trig.acos(radians);

    // @ts-expect-error atan2 requires matching units
    Trig.atan2(meters, seconds);
  });
});
