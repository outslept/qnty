import {
  type CleanUnit,
  type Dimensionless,
  type MultiplyUnits,
  type PowUnit,
  type UnitVec,
} from "./algebra.ts";
import { formatUnit, type ParseUnit, parseUnit } from "./format.ts";

export interface UnitDef {
  readonly scale: number;
  readonly dim: UnitVec;
  readonly offset?: number;
}

// Coherent SI derived units (scale = 1, offset = 0) expand directly to SI base vectors
export type CoherentSIAliases = {
  Hz: { readonly s: -1 };
  N: { readonly kg: 1; readonly m: 1; readonly s: -2 };
  Pa: { readonly kg: 1; readonly m: -1; readonly s: -2 };
  J: { readonly kg: 1; readonly m: 2; readonly s: -2 };
  W: { readonly kg: 1; readonly m: 2; readonly s: -3 };
  C: { readonly A: 1; readonly s: 1 };
  V: { readonly kg: 1; readonly m: 2; readonly A: -1; readonly s: -3 };
  F: { readonly A: 2; readonly s: 4; readonly kg: -1; readonly m: -2 };
  ohm: { readonly kg: 1; readonly m: 2; readonly A: -2; readonly s: -3 };
  Ω: { readonly kg: 1; readonly m: 2; readonly A: -2; readonly s: -3 };
  S: { readonly A: 2; readonly s: 3; readonly kg: -1; readonly m: -2 };
  Wb: { readonly kg: 1; readonly m: 2; readonly A: -1; readonly s: -2 };
  T: { readonly kg: 1; readonly A: -1; readonly s: -2 };
  H: { readonly kg: 1; readonly m: 2; readonly A: -2; readonly s: -2 };
  lm: { readonly cd: 1; readonly sr: 1 };
  lx: { readonly cd: 1; readonly sr: 1; readonly m: -2 };
  Sv: { readonly m: 2; readonly s: -2 };
  kat: { readonly mol: 1; readonly s: -1 };
};

// Maps scaled/imperial/affine symbols to their canonical SI physical dimensions
export type ScaledUnitDims = CoherentSIAliases & {
  km: { readonly m: 1 };
  cm: { readonly m: 1 };
  mm: { readonly m: 1 };
  um: { readonly m: 1 };
  nm: { readonly m: 1 };
  in: { readonly m: 1 };
  ft: { readonly m: 1 };
  yd: { readonly m: 1 };
  mi: { readonly m: 1 };
  nmi: { readonly m: 1 };
  ms: { readonly s: 1 };
  us: { readonly s: 1 };
  ns: { readonly s: 1 };
  min: { readonly s: 1 };
  hr: { readonly s: 1 };
  d: { readonly s: 1 };
  g: { readonly kg: 1 };
  mg: { readonly kg: 1 };
  lb: { readonly kg: 1 };
  oz: { readonly kg: 1 };
  ton: { readonly kg: 1 };
  degC: { readonly K: 1 };
  degF: { readonly K: 1 };
  deg: { readonly rad: 1 };
  B: { readonly b: 1 };
  L: { readonly m: 3 };
  gal: { readonly m: 3 };
  ha: { readonly m: 2 };
  acre: { readonly m: 2 };
  bar: { readonly kg: 1; readonly m: -1; readonly s: -2 };
  atm: { readonly kg: 1; readonly m: -1; readonly s: -2 };
  psi: { readonly kg: 1; readonly m: -1; readonly s: -2 };
};

type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;

type LastKey<U> =
  UnionToIntersection<U extends unknown ? () => U : never> extends () => infer R ? R : never;

type ExpandTerm<K, E extends number, Map> = K extends keyof Map
  ? PowUnit<Map[K], E>
  : CleanUnit<{ readonly [P in K & string]: E }>;

type MapUnitVec<U, Map, Acc = Dimensionless> = string extends keyof U
  ? Dimensionless
  : [keyof U] extends [never]
    ? Acc
    : LastKey<keyof U> extends infer K
      ? K extends keyof U
        ? MultiplyUnits<Acc, ExpandTerm<K, U[K] & number, Map>> extends infer Next
          ? MapUnitVec<Omit<U, K>, Map, Next>
          : never
        : Acc
      : Acc;

export type ResolveUnit<U> = MapUnitVec<U, CoherentSIAliases>;
export type ResolveUnitStr<S extends string> = string extends S
  ? Dimensionless
  : ResolveUnit<ParseUnit<S>>;
export type CanonicalDim<U> = MapUnitVec<U, ScaledUnitDims>;

export type CompatibleUnits<A, B> =
  CanonicalDim<A> extends CanonicalDim<B>
    ? CanonicalDim<B> extends CanonicalDim<A>
      ? true
      : false
    : false;

export const UNIT_DEFS: Readonly<Record<string, UnitDef>> = {
  // SI Base
  m: { scale: 1, dim: { m: 1 } },
  kg: { scale: 1, dim: { kg: 1 } },
  s: { scale: 1, dim: { s: 1 } },
  A: { scale: 1, dim: { A: 1 } },
  K: { scale: 1, dim: { K: 1 } },
  mol: { scale: 1, dim: { mol: 1 } },
  cd: { scale: 1, dim: { cd: 1 } },
  rad: { scale: 1, dim: { rad: 1 } },
  sr: { scale: 1, dim: { sr: 1 } },
  b: { scale: 1, dim: { b: 1 } },
  // Coherent SI Derived
  Hz: { scale: 1, dim: { s: -1 } },
  N: { scale: 1, dim: { kg: 1, m: 1, s: -2 } },
  Pa: { scale: 1, dim: { kg: 1, m: -1, s: -2 } },
  J: { scale: 1, dim: { kg: 1, m: 2, s: -2 } },
  W: { scale: 1, dim: { kg: 1, m: 2, s: -3 } },
  C: { scale: 1, dim: { A: 1, s: 1 } },
  V: { scale: 1, dim: { kg: 1, m: 2, A: -1, s: -3 } },
  F: { scale: 1, dim: { A: 2, s: 4, kg: -1, m: -2 } },
  ohm: { scale: 1, dim: { kg: 1, m: 2, A: -2, s: -3 } },
  Ω: { scale: 1, dim: { kg: 1, m: 2, A: -2, s: -3 } },
  S: { scale: 1, dim: { A: 2, s: 3, kg: -1, m: -2 } },
  Wb: { scale: 1, dim: { kg: 1, m: 2, A: -1, s: -2 } },
  T: { scale: 1, dim: { kg: 1, A: -1, s: -2 } },
  H: { scale: 1, dim: { kg: 1, m: 2, A: -2, s: -2 } },
  lm: { scale: 1, dim: { cd: 1, sr: 1 } },
  lx: { scale: 1, dim: { cd: 1, sr: 1, m: -2 } },
  Sv: { scale: 1, dim: { m: 2, s: -2 } },
  kat: { scale: 1, dim: { mol: 1, s: -1 } },
  // Scaled & Affine
  km: { scale: 1e3, dim: { m: 1 } },
  cm: { scale: 1e-2, dim: { m: 1 } },
  mm: { scale: 1e-3, dim: { m: 1 } },
  um: { scale: 1e-6, dim: { m: 1 } },
  nm: { scale: 1e-9, dim: { m: 1 } },
  in: { scale: 0.0254, dim: { m: 1 } },
  ft: { scale: 0.3048, dim: { m: 1 } },
  yd: { scale: 0.9144, dim: { m: 1 } },
  mi: { scale: 1609.344, dim: { m: 1 } },
  nmi: { scale: 1852, dim: { m: 1 } },
  ms: { scale: 1e-3, dim: { s: 1 } },
  us: { scale: 1e-6, dim: { s: 1 } },
  ns: { scale: 1e-9, dim: { s: 1 } },
  min: { scale: 60, dim: { s: 1 } },
  hr: { scale: 3600, dim: { s: 1 } },
  d: { scale: 86400, dim: { s: 1 } },
  g: { scale: 1e-3, dim: { kg: 1 } },
  mg: { scale: 1e-6, dim: { kg: 1 } },
  lb: { scale: 0.45359237, dim: { kg: 1 } },
  oz: { scale: 0.028349523125, dim: { kg: 1 } },
  ton: { scale: 907.18474, dim: { kg: 1 } },
  degC: { scale: 1, dim: { K: 1 }, offset: 273.15 },
  degF: { scale: 5 / 9, dim: { K: 1 }, offset: (459.67 * 5) / 9 },
  deg: { scale: Math.PI / 180, dim: { rad: 1 } },
  B: { scale: 8, dim: { b: 1 } },
  L: { scale: 1e-3, dim: { m: 3 } },
  gal: { scale: 0.003785411784, dim: { m: 3 } },
  ha: { scale: 1e4, dim: { m: 2 } },
  acre: { scale: 4046.8564224, dim: { m: 2 } },
  bar: { scale: 1e5, dim: { kg: 1, m: -1, s: -2 } },
  atm: { scale: 101325, dim: { kg: 1, m: -1, s: -2 } },
  psi: { scale: 6894.757293168, dim: { kg: 1, m: -1, s: -2 } },
};

export function evalUnitVec(
  input: UnitVec | string,
  defs: Readonly<Record<string, UnitDef>> = UNIT_DEFS,
): { scale: number; dim: UnitVec; offset: number } {
  const vec = typeof input === "string" ? parseUnit(input) : input;
  const entries = Object.entries(vec);
  let scale = 1;
  let offset = 0;
  const dim: Record<string, number> = {};

  for (const [sym, exp] of entries) {
    if (exp === 0) continue;
    const def = defs[sym];
    if (!def) throw new Error(`Unknown unit symbol: ${sym}`);
    if (def.offset && (entries.length > 1 || exp !== 1)) {
      throw new Error(`Affine unit '${sym}' cannot be combined or exponentiated`);
    }
    scale *= def.scale ** exp;
    offset = def.offset ?? 0;
    for (const [dKey, dExp] of Object.entries(def.dim)) {
      const next = (dim[dKey] ?? 0) + dExp * exp;
      if (next === 0) delete dim[dKey];
      else dim[dKey] = next;
    }
  }
  return { scale, dim, offset };
}

export function convertScalar(
  value: number,
  from: UnitVec | string,
  to: UnitVec | string,
  defs: Readonly<Record<string, UnitDef>> = UNIT_DEFS,
): number {
  const src = evalUnitVec(from, defs);
  const dst = evalUnitVec(to, defs);
  if (formatUnit(src.dim) !== formatUnit(dst.dim)) {
    throw new Error(
      `Incompatible dimensions: '${formatUnit(src.dim)}' vs '${formatUnit(dst.dim)}'`,
    );
  }
  return (value * src.scale + src.offset - dst.offset) / dst.scale;
}
