import type {
  CubeUnit,
  Dimensionless,
  PowUnit,
  ReciprocalUnit,
  SqrtUnit,
  SquareUnit,
  UnitVec,
} from "./algebra.ts";
import { formatUnit, type ParseUnit, parseUnit } from "./format.ts";
import type { Qty, SafeDiv, SafeMul } from "./qty.ts";
import {
  type CompatibleUnits,
  convertScalar,
  evalUnitVec,
  type ResolveUnitStr,
} from "./unitSystem.ts";

export interface MeasureFormatter {
  formatValue?: (value: number) => string;
  formatUnit?: (unit: UnitVec) => string;
}

export class Measure<in out U = Dimensionless> {
  constructor(
    public readonly value: number,
    public readonly unit: U,
    public readonly symbol?: string,
  ) {}

  static of<S extends string>(value: number, unit: S, symbol?: string): Measure<ResolveUnitStr<S>>;
  static of<U>(value: number, quantity: Measure<U>, symbol?: string): Measure<U>;
  static of(value: number, unitOrQty: string | Measure<any>, symbol?: string): any {
    if (typeof unitOrQty === "string") {
      const { scale, dim, offset } = evalUnitVec(unitOrQty);
      const canonical = offset ? value : value * scale;
      return new Measure(
        canonical,
        offset ? parseUnit(unitOrQty) : dim,
        symbol ?? (unitOrQty || undefined),
      );
    }
    return new Measure(value * unitOrQty.value, unitOrQty.unit, symbol);
  }

  static dimensionless(value: number): Measure<Dimensionless> {
    return new Measure(value, {});
  }

  static prefix(prefix: string, multiplier: number) {
    return <U>(m: Measure<U>): Measure<U> =>
      new Measure(m.value * multiplier, m.unit, m.symbol ? `${prefix}${m.symbol}` : undefined);
  }

  toQty(): Qty<U> {
    return this.value as unknown as Qty<U>;
  }

  plus(other: Measure<U>): Measure<U> {
    return new Measure(this.value + other.value, this.unit);
  }

  minus(other: Measure<U>): Measure<U> {
    return new Measure(this.value - other.value, this.unit);
  }

  negate(): Measure<U> {
    return new Measure(-this.value, this.unit);
  }

  scale(factor: number): Measure<U> {
    return new Measure(this.value * factor, this.unit);
  }

  times<V>(other: Measure<V>): Measure<SafeMul<U, V>> {
    const out: Record<string, number> = { ...(this.unit as UnitVec) };
    for (const [k, v] of Object.entries(other.unit as UnitVec)) {
      const next = (out[k] ?? 0) + v;
      if (next === 0) delete out[k];
      else out[k] = next;
    }
    return new Measure(this.value * other.value, out as SafeMul<U, V>);
  }

  over<V>(other: Measure<V>): Measure<SafeDiv<U, V>> {
    const out: Record<string, number> = { ...(this.unit as UnitVec) };
    for (const [k, v] of Object.entries(other.unit as UnitVec)) {
      const next = (out[k] ?? 0) - v;
      if (next === 0) delete out[k];
      else out[k] = next;
    }
    return new Measure(this.value / other.value, out as SafeDiv<U, V>);
  }

  per<V>(other: Measure<V>): Measure<SafeDiv<U, V>> {
    return this.over(other);
  }

  div<V>(other: Measure<V>): Measure<SafeDiv<U, V>> {
    return this.over(other);
  }

  squared(): Measure<SquareUnit<U>> {
    return this.pow(2);
  }

  cubed(): Measure<CubeUnit<U>> {
    return this.pow(3);
  }

  pow<E extends number>(exp: E): Measure<PowUnit<U, E>> {
    const out: Record<string, number> = {};
    if (exp !== 0) {
      for (const [k, v] of Object.entries(this.unit as UnitVec)) out[k] = v * exp;
    }
    return new Measure(this.value ** exp, out as PowUnit<U, E>);
  }

  inverse(): Measure<ReciprocalUnit<U>> {
    const out: Record<string, number> = {};
    for (const [k, v] of Object.entries(this.unit as UnitVec)) out[k] = -v;
    return new Measure(1 / this.value, out as ReciprocalUnit<U>);
  }

  reciprocal(): Measure<ReciprocalUnit<U>> {
    return this.inverse();
  }

  sqrt(this: SqrtUnit<U> extends never ? never : Measure<U>): Measure<SqrtUnit<U>> {
    const out: Record<string, number> = {};
    for (const [k, v] of Object.entries(this.unit as UnitVec)) out[k] = v / 2;
    return new Measure(Math.sqrt(this.value), out as SqrtUnit<U>);
  }

  compare(other: Measure<U>): number {
    return this.value - other.value;
  }
  lt(other: Measure<U>): boolean {
    return this.value < other.value;
  }
  lte(other: Measure<U>): boolean {
    return this.value <= other.value;
  }
  eq(other: Measure<U>): boolean {
    return this.value === other.value;
  }
  neq(other: Measure<U>): boolean {
    return this.value !== other.value;
  }
  gte(other: Measure<U>): boolean {
    return this.value >= other.value;
  }
  gt(other: Measure<U>): boolean {
    return this.value > other.value;
  }

  valueIn<To extends string>(
    target: CompatibleUnits<U, ParseUnit<To>> extends true ? To : never,
  ): number;
  valueIn(target: Measure<U>): number;
  valueIn(target: string | Measure<U>): number {
    return typeof target === "string"
      ? convertScalar(this.value, this.unit as UnitVec, target)
      : this.value / target.value;
  }

  in<To extends string>(
    target: CompatibleUnits<U, ParseUnit<To>> extends true ? To : never,
    formatter?: MeasureFormatter,
  ): string;
  in(target: Measure<U>, formatter?: MeasureFormatter): string;
  in(target: string | Measure<U>, formatter?: MeasureFormatter): string {
    const fmtVal = formatter?.formatValue ?? String;
    if (typeof target === "string") {
      return `${fmtVal(convertScalar(this.value, this.unit as UnitVec, target))} ${target}`.trimEnd();
    }
    if (!target.symbol) return this.toString(formatter);
    return `${fmtVal(this.value / target.value)} ${target.symbol}`;
  }

  withSymbol(symbol: string | undefined): Measure<U> {
    return new Measure(this.value, this.unit, symbol);
  }

  toString(formatter?: MeasureFormatter): string {
    const fmtVal = formatter?.formatValue ?? String;
    const fmtUnit = formatter?.formatUnit ?? formatUnit;
    return `${fmtVal(this.value)} ${fmtUnit(this.unit as UnitVec)}`.trimEnd();
  }
}
