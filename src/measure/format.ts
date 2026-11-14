import type {
  CleanUnit,
  Dimensionless,
  MultiplyUnits,
  NegExp,
  ReciprocalUnit,
  UnitVec,
} from "./algebra.ts";

type SupMap = { "¹": 1; "²": 2; "³": 3; "⁴": 4; "⁵": 5; "⁶": 6 };

type NormalizeOps<S extends string> = S extends `${infer A} ${infer B}`
  ? NormalizeOps<`${A}${B}`>
  : S extends `${infer A}${"⋅" | "·"}${infer B}`
    ? NormalizeOps<`${A}*${B}`>
    : S;

type FlipOps<S extends string> = S extends `${infer A}*${infer B}`
  ? `${FlipOps<A>}/${FlipOps<B>}`
  : S extends `${infer A}/${infer B}`
    ? `${FlipOps<A>}*${FlipOps<B>}`
    : S;

// Locate the last '(' before the first ')' to resolve innermost parentheses first
type LastOpen<S extends string, Pre extends string = ""> = S extends `${infer A}(${infer B}`
  ? LastOpen<B, `${Pre}${A}(`>
  : Pre extends `${infer P}(`
    ? [P, S]
    : never;

type FlattenParens<S extends string> = S extends `${infer BeforeClose})${infer AfterClose}`
  ? LastOpen<BeforeClose> extends [infer Pre extends string, infer Inner extends string]
    ? Pre extends `${infer P}/`
      ? FlattenParens<`${P}/${FlipOps<Inner>}${AfterClose}`>
      : FlattenParens<`${Pre}${Inner}${AfterClose}`>
    : S
  : S;

type ParseRawTerm<S extends string> = S extends "" | "1"
  ? Dimensionless
  : S extends `${infer U}^${infer E extends number}`
    ? U extends "1"
      ? Dimensionless
      : { readonly [K in U]: E }
    : S extends `${infer U}⁻${infer D extends keyof SupMap}`
      ? { readonly [K in U]: NegExp<SupMap[D]> }
      : S extends `${infer U}${infer D extends keyof SupMap}`
        ? { readonly [K in U]: SupMap[D] }
        : { readonly [K in S]: 1 };

type ParseTerm<S extends string, Sign extends 1 | -1> = Sign extends 1
  ? CleanUnit<ParseRawTerm<S>>
  : ReciprocalUnit<ParseRawTerm<S>>;

type ParseTokens<
  S extends string,
  Sign extends 1 | -1 = 1,
  Acc = Dimensionless,
> = S extends `${infer Left}*${infer Right}`
  ? Left extends `${infer Term}/${infer AfterSlash}`
    ? MultiplyUnits<Acc, ParseTerm<Term, Sign>> extends infer Next
      ? ParseTokens<`${AfterSlash}*${Right}`, -1, Next>
      : never
    : MultiplyUnits<Acc, ParseTerm<Left, Sign>> extends infer Next
      ? ParseTokens<Right, 1, Next>
      : never
  : S extends `${infer Term}/${infer Right}`
    ? MultiplyUnits<Acc, ParseTerm<Term, Sign>> extends infer Next
      ? ParseTokens<Right, -1, Next>
      : never
    : MultiplyUnits<Acc, ParseTerm<S, Sign>>;

export type ParseUnit<S extends string> = ParseTokens<FlattenParens<NormalizeOps<S>>>;

const SUP_DIGITS: Record<string, string> = {
  "¹": "1",
  "²": "2",
  "³": "3",
  "⁴": "4",
  "⁵": "5",
  "⁶": "6",
};

export function parseUnit<S extends string>(input: S): ParseUnit<S> {
  let s = input
    .replace(/\s+/g, "")
    .replace(/[⋅·]/g, "*")
    .replace(/⁻([¹²³⁴⁵⁶])/g, (_, d) => `^-${SUP_DIGITS[d]}`)
    .replace(/[¹²³⁴⁵⁶]/g, (d) => `^${SUP_DIGITS[d]}`);

  while (s.includes("(")) {
    s = s.replace(/(\/?)\(([^()]+)\)/g, (_, slash: string, inner: string) =>
      slash ? "/" + inner.replace(/[*/]/g, (op) => (op === "*" ? "/" : "*")) : inner,
    );
  }

  const out: Record<string, number> = {};
  let sign = 1;
  for (const part of s.split(/([*/])/)) {
    if (part === "*") sign = 1;
    else if (part === "/") sign = -1;
    else if (part && part !== "1") {
      const [base, exp = "1"] = part.split("^");
      if (base && base !== "1") {
        const next = (out[base] ?? 0) + sign * Number(exp);
        if (next === 0) delete out[base];
        else out[base] = next;
      }
    }
  }
  return out as ParseUnit<S>;
}

export function formatUnit(unit: UnitVec): string {
  const pos: [string, number][] = [];
  const neg: [string, number][] = [];
  for (const [sym, exp] of Object.entries(unit)) {
    if (exp > 0) pos.push([sym, exp]);
    else if (exp < 0) neg.push([sym, exp]);
  }
  if (!pos.length && !neg.length) return "";
  pos.sort(([a], [b]) => (a < b ? -1 : 1));
  neg.sort(([a], [b]) => (a < b ? -1 : 1));

  const fmt = (items: [string, number][]) =>
    items.map(([s, e]) => (e === 1 ? s : `${s}^${e}`)).join(" * ");

  if (!pos.length) return fmt(neg);
  if (!neg.length) return fmt(pos);
  const den = fmt(neg.map(([s, e]) => [s, -e]));
  return `${fmt(pos)} / ${neg.length > 1 ? `(${den})` : den}`;
}
