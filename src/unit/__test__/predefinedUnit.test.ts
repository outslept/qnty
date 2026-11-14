import { describe, expect, it } from "vite-plus/test";
import { Measure } from "../../measure/measure.ts";
import * as Angle from "../angle.ts";
import * as Base from "../base.ts";
import * as Common from "../common.ts";
import * as Imperial from "../imperial.ts";
import * as Memory from "../memory.ts";
import * as Metric from "../metric.ts";
import * as Other from "../other.ts";
import * as US from "../uscu.ts";

describe("predefined units", () => {
  const groups = { Angle, Base, Common, Imperial, Memory, Metric, Other, US };

  it("defines a valid non-empty symbol and positive scale for every unit", () => {
    for (const [groupName, group] of Object.entries(groups)) {
      for (const [name, val] of Object.entries(group)) {
        if (val instanceof Measure) {
          expect(val.symbol, `${groupName}.${name} missing symbol`).toBeTruthy();
          expect(val.value, `${groupName}.${name} invalid scale`).toBeGreaterThan(0);
        }
      }
    }
  });

  it("converts accurately between metric, common, imperial, and US units", () => {
    expect(Measure.of(1, Common.miles).valueIn(Base.meters)).toBeCloseTo(1609.344, 5);
    expect(Measure.of(1, Common.acres).valueIn(Base.meters.squared())).toBeCloseTo(4046.8564224, 5);
    expect(Measure.of(1, US.gallons).valueIn(Other.liters)).toBeCloseTo(3.785411784, 6);
    expect(Measure.of(1, Imperial.gallons).valueIn(Other.liters)).toBeCloseTo(4.54609, 3);
  });
});
