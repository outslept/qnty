import type {
  CubeUnit,
  Dimensionless,
  DivideUnits,
  MultiplyUnits,
  PowUnit,
  ReciprocalUnit,
  RootUnit,
  SqrtUnit,
  SquareUnit,
} from "./algebra.ts";
import { type ParseUnit } from "./format.ts";
import {
  type CanonicalDim,
  type CompatibleUnits,
  convertScalar,
  type ResolveUnit,
  type ResolveUnitStr,
} from "./unitSystem.ts";

declare const __unit: unique symbol;

/** A zero-cost branded number carrying its sparse unit vector at compile time. */
export type Qty<U = Dimensionless, N = number> = N & { readonly [__unit]: U };

/** Resolves a unit expression string (e.g. 'kg * m / s^2' or 'N') into a branded Qty type. */
export type Unit<S extends string, N = number> = Qty<ResolveUnitStr<S>, N>;

// Reject mixed scales along the same physical axis (e.g. multiplying 'km' by 'm' without converting first)
type SingleAxis<U> = keyof CanonicalDim<{ readonly [P in keyof U]: 1 }>;
type HasScaleConflict<A, B> = [keyof A & keyof B] extends [never]
  ? [SingleAxis<A> & SingleAxis<B>] extends [never]
    ? false
    : true
  : false;

export type SafeMul<A, B> =
  HasScaleConflict<A, B> extends true ? never : ResolveUnit<MultiplyUnits<A, B>>;

export type SafeDiv<A, B> =
  HasScaleConflict<A, B> extends true ? never : ResolveUnit<DivideUnits<A, B>>;

export const qty = <S extends string = "">(value: number, _unit?: S): Unit<S> =>
  value as unknown as Unit<S>;

export const unwrap = <U>(x: Qty<U>): number => x as unknown as number;

export const add = <U>(a: Qty<U>, b: Qty<U>): Qty<U> =>
  ((a as unknown as number) + (b as unknown as number)) as unknown as Qty<U>;

export const sub = <U>(a: Qty<U>, b: Qty<U>): Qty<U> =>
  ((a as unknown as number) - (b as unknown as number)) as unknown as Qty<U>;

export const neg = <U>(a: Qty<U>): Qty<U> => -(a as unknown as number) as unknown as Qty<U>;

export const scale = <U>(a: Qty<U>, factor: number): Qty<U> =>
  ((a as unknown as number) * factor) as unknown as Qty<U>;

export const mul = <A, B>(
  a: Qty<A>,
  b: HasScaleConflict<A, B> extends true ? never : Qty<B>,
): Qty<SafeMul<A, B>> =>
  ((a as unknown as number) * (b as unknown as number)) as unknown as Qty<SafeMul<A, B>>;

export const div = <A, B>(
  a: Qty<A>,
  b: HasScaleConflict<A, B> extends true ? never : Qty<B>,
): Qty<SafeDiv<A, B>> =>
  ((a as unknown as number) / (b as unknown as number)) as unknown as Qty<SafeDiv<A, B>>;

export const inv = <U>(a: Qty<U>): Qty<ReciprocalUnit<U>> =>
  (1 / (a as unknown as number)) as unknown as Qty<ReciprocalUnit<U>>;

export const sq = <U>(a: Qty<U>): Qty<SquareUnit<U>> =>
  ((a as unknown as number) ** 2) as unknown as Qty<SquareUnit<U>>;

export const cubed = <U>(a: Qty<U>): Qty<CubeUnit<U>> =>
  ((a as unknown as number) ** 3) as unknown as Qty<CubeUnit<U>>;

export const pow = <U, E extends number>(a: Qty<U>, exp: E): Qty<PowUnit<U, E>> =>
  ((a as unknown as number) ** exp) as unknown as Qty<PowUnit<U, E>>;

export const sqrt = <U>(a: SqrtUnit<U> extends never ? never : Qty<U>): Qty<SqrtUnit<U>> =>
  Math.sqrt(a as unknown as number) as unknown as Qty<SqrtUnit<U>>;

export const cbrt = <U>(a: RootUnit<U, 3> extends never ? never : Qty<U>): Qty<RootUnit<U, 3>> =>
  Math.cbrt(a as unknown as number) as unknown as Qty<RootUnit<U, 3>>;

export const abs = <U>(a: Qty<U>): Qty<U> => Math.abs(a as unknown as number) as unknown as Qty<U>;
export const floor = <U>(a: Qty<U>): Qty<U> =>
  Math.floor(a as unknown as number) as unknown as Qty<U>;
export const ceil = <U>(a: Qty<U>): Qty<U> =>
  Math.ceil(a as unknown as number) as unknown as Qty<U>;
export const round = <U>(a: Qty<U>): Qty<U> =>
  Math.round(a as unknown as number) as unknown as Qty<U>;
export const trunc = <U>(a: Qty<U>): Qty<U> =>
  Math.trunc(a as unknown as number) as unknown as Qty<U>;

export const min = <U>(first: Qty<U>, ...rest: Qty<U>[]): Qty<U> =>
  Math.min(first as unknown as number, ...(rest as unknown as number[])) as unknown as Qty<U>;

export const max = <U>(first: Qty<U>, ...rest: Qty<U>[]): Qty<U> =>
  Math.max(first as unknown as number, ...(rest as unknown as number[])) as unknown as Qty<U>;

export const hypot = <U>(first: Qty<U>, ...rest: Qty<U>[]): Qty<U> =>
  Math.hypot(first as unknown as number, ...(rest as unknown as number[])) as unknown as Qty<U>;

export const sum = <U>(first: Qty<U>, ...rest: Qty<U>[]): Qty<U> => {
  let acc = first as unknown as number;
  for (let i = 0; i < rest.length; i++) acc += rest[i] as unknown as number;
  return acc as unknown as Qty<U>;
};

export function to<From extends string, To extends string>(
  value: CompatibleUnits<ParseUnit<From>, ParseUnit<To>> extends true ? Unit<From> : never,
  from: From,
  target: To,
): Unit<To> {
  return convertScalar(value as unknown as number, from, target) as unknown as Unit<To>;
}

export function format<S extends string>(
  value: Unit<S>,
  unit: S,
  formatValue: (n: number) => string = String,
): string {
  const suffix = unit.trim();
  return suffix
    ? `${formatValue(value as unknown as number)} ${suffix}`
    : formatValue(value as unknown as number);
}
