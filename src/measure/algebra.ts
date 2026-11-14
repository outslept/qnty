type PosTuple<N, Acc extends 1[] = []> = number extends N
  ? never
  : Acc["length"] extends N
    ? Acc
    : PosTuple<N, [...Acc, 1]>;

export type NegExp<N> = N extends 0
  ? 0
  : `${N & number}` extends `-${infer P extends number}`
    ? P
    : `-${N & number}` extends `${infer M extends number}`
      ? M
      : never;

type AddPos<A, B> =
  PosTuple<A> extends infer TA extends 1[]
    ? PosTuple<B> extends infer TB extends 1[]
      ? [...TA, ...TB]["length"]
      : never
    : never;

type SubPos<A, B> =
  PosTuple<A> extends infer TA extends 1[]
    ? PosTuple<B> extends infer TB extends 1[]
      ? TA extends [...TB, ...infer Rest]
        ? Rest["length"]
        : TB extends [...TA, ...infer Rest]
          ? NegExp<Rest["length"]>
          : 0
      : never
    : never;

export type AddExp<A, B> = `${A & number}` extends `-${infer LA extends number}`
  ? `${B & number}` extends `-${infer RB extends number}`
    ? NegExp<AddPos<LA, RB>>
    : SubPos<B, LA>
  : `${B & number}` extends `-${infer RB extends number}`
    ? SubPos<A, RB>
    : AddPos<A, B>;

export type SubExp<A, B> = AddExp<A, NegExp<B>>;

type MulTuple<
  TA extends 1[],
  B,
  Acc extends 1[] = [],
  Count extends 1[] = [],
> = Count["length"] extends B ? Acc["length"] : MulTuple<TA, B, [...Acc, ...TA], [...Count, 1]>;

type MulPos<A, B> = PosTuple<A> extends infer TA extends 1[] ? MulTuple<TA, B> : never;

export type MulExp<A, B> = A extends 0
  ? 0
  : B extends 0
    ? 0
    : `${A & number}` extends `-${infer LA extends number}`
      ? `${B & number}` extends `-${infer RB extends number}`
        ? MulPos<LA, RB>
        : NegExp<MulPos<LA, B>>
      : `${B & number}` extends `-${infer RB extends number}`
        ? NegExp<MulPos<A, RB>>
        : MulPos<A, B>;

type DivTuple<TA extends 1[], TB extends 1[], Q extends 1[] = []> = TA["length"] extends 0
  ? Q["length"]
  : TA extends [...TB, ...infer Rem extends 1[]]
    ? DivTuple<Rem, TB, [...Q, 1]>
    : never;

type DivPos<A, B> =
  PosTuple<A> extends infer TA extends 1[]
    ? PosTuple<B> extends infer TB extends 1[]
      ? DivTuple<TA, TB>
      : never
    : never;

export type DivExp<A, B> = B extends 0
  ? never
  : A extends 0
    ? 0
    : `${A & number}` extends `-${infer LA extends number}`
      ? `${B & number}` extends `-${infer RB extends number}`
        ? DivPos<LA, RB>
        : NegExp<DivPos<LA, B>>
      : `${B & number}` extends `-${infer RB extends number}`
        ? NegExp<DivPos<A, RB>>
        : DivPos<A, B>;

export type UnitVec = Readonly<Record<string, number>>;
export type Dimensionless = {};

// Strip zero-power dimensions and intersect with {}
export type CleanUnit<U> = {
  readonly [K in keyof U as U[K] extends 0 ? never : K]: U[K];
} & {};

export type MultiplyUnits<A, B> = CleanUnit<{
  [K in keyof A | keyof B]: K extends keyof A
    ? K extends keyof B
      ? AddExp<A[K], B[K]>
      : A[K]
    : K extends keyof B
      ? B[K]
      : never;
}>;

export type DivideUnits<A, B> = CleanUnit<{
  [K in keyof A | keyof B]: K extends keyof A
    ? K extends keyof B
      ? SubExp<A[K], B[K]>
      : A[K]
    : K extends keyof B
      ? NegExp<B[K]>
      : never;
}>;

export type PowUnit<U, E extends number> = E extends 0
  ? Dimensionless
  : CleanUnit<{
      [K in keyof U]: MulExp<U[K], E>;
    }>;

export type RootUnit<U, R extends number> = true extends {
  [K in keyof U]: [DivExp<U[K], R>] extends [never] ? true : false;
}[keyof U]
  ? never
  : CleanUnit<{ [K in keyof U]: DivExp<U[K], R> }>;

export type ReciprocalUnit<U> = PowUnit<U, -1>;
export type SquareUnit<U> = PowUnit<U, 2>;
export type CubeUnit<U> = PowUnit<U, 3>;
export type SqrtUnit<U> = RootUnit<U, 2>;
