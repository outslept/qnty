import { describe, expectTypeOf, it } from "vite-plus/test";
import { type ParseUnit, parseUnit } from "../format.ts";

describe("type-level unit string parser", () => {
  it("parses base, compound, parenthesized, and unicode units", () => {
    expectTypeOf<ParseUnit<"">>().toEqualTypeOf<{}>();
    expectTypeOf<ParseUnit<"1/s">>().toEqualTypeOf<{ readonly s: -1 }>();
    expectTypeOf<ParseUnit<"1^2 / s">>().toEqualTypeOf<{ readonly s: -1 }>();
    expectTypeOf<ParseUnit<"s⁻¹">>().toEqualTypeOf<{ readonly s: -1 }>();
    expectTypeOf<ParseUnit<"kg * m / s^2">>().toEqualTypeOf<{
      readonly kg: 1;
      readonly m: 1;
      readonly s: -2;
    }>();
    expectTypeOf<ParseUnit<"kg ⋅ m ⋅ s⁻²">>().toEqualTypeOf<{
      readonly kg: 1;
      readonly m: 1;
      readonly s: -2;
    }>();
    expectTypeOf<ParseUnit<"kg ⋅ m / s²">>().toEqualTypeOf<{
      readonly kg: 1;
      readonly m: 1;
      readonly s: -2;
    }>();
    expectTypeOf<ParseUnit<"m^2 / (kg * s^2)">>().toEqualTypeOf<{
      readonly m: 2;
      readonly kg: -1;
      readonly s: -2;
    }>();
    expectTypeOf<ParseUnit<"a / (b / (c * d))">>().toEqualTypeOf<{
      readonly a: 1;
      readonly b: -1;
      readonly c: 1;
      readonly d: 1;
    }>();
  });

  it("cancels opposing dimensions and types runtime parseUnit", () => {
    expectTypeOf(parseUnit("m * s / s")).toEqualTypeOf<{ readonly m: 1 }>();
    expectTypeOf(parseUnit("m / m")).toEqualTypeOf<{}>();
  });
});
