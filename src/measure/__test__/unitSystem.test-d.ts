import { describe, expectTypeOf, it } from "vite-plus/test";
import type { ParseUnit } from "../format.ts";
import type { CanonicalDim, CompatibleUnits, ResolveUnitStr } from "../unitSystem.ts";

describe("type-level unit resolution and dimensional compatibility", () => {
  it("unifies coherent SI derived aliases with their base expressions", () => {
    expectTypeOf<ResolveUnitStr<"N">>().toEqualTypeOf<ResolveUnitStr<"kg * m / s^2">>();
    expectTypeOf<ResolveUnitStr<"N * m">>().toEqualTypeOf<ResolveUnitStr<"J">>();
    expectTypeOf<ResolveUnitStr<"W * s">>().toEqualTypeOf<ResolveUnitStr<"J">>();
    expectTypeOf<ResolveUnitStr<"V * A">>().toEqualTypeOf<ResolveUnitStr<"W">>();
  });

  it("keeps scaled units distinct in ResolveUnitStr but equal in CanonicalDim", () => {
    expectTypeOf<ResolveUnitStr<"km">>().toEqualTypeOf<{ readonly km: 1 }>();
    expectTypeOf<CanonicalDim<ParseUnit<"mi / hr">>>().toEqualTypeOf<{
      readonly m: 1;
      readonly s: -1;
    }>();
    expectTypeOf<
      CompatibleUnits<ParseUnit<"mi / hr">, ParseUnit<"km / s">>
    >().toEqualTypeOf<true>();
    expectTypeOf<CompatibleUnits<ParseUnit<"psi">, ParseUnit<"Pa">>>().toEqualTypeOf<true>();
    expectTypeOf<CompatibleUnits<ParseUnit<"degC">, ParseUnit<"degF">>>().toEqualTypeOf<true>();
    expectTypeOf<CompatibleUnits<ParseUnit<"mi / hr">, ParseUnit<"kg">>>().toEqualTypeOf<false>();
  });
});
