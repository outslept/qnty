import { describe, expectTypeOf, it } from "vite-plus/test";
import type {
  AddExp,
  DivExp,
  DivideUnits,
  MulExp,
  MultiplyUnits,
  PowUnit,
  ReciprocalUnit,
  SqrtUnit,
  SubExp,
} from "../algebra.ts";

describe("exponent arithmetic", () => {
  it("adds, subtracts, multiplies, and divides signed integer powers", () => {
    expectTypeOf<AddExp<2, -3>>().toEqualTypeOf<-1>();
    expectTypeOf<SubExp<-2, -5>>().toEqualTypeOf<3>();
    expectTypeOf<MulExp<-2, 3>>().toEqualTypeOf<-6>();
    expectTypeOf<DivExp<-4, 2>>().toEqualTypeOf<-2>();
    expectTypeOf<DivExp<3, 2>>().toBeNever();
  });
});

describe("sparse unit vector algebra", () => {
  type Meter = { readonly m: 1 };
  type Second = { readonly s: 1 };
  type Kilogram = { readonly kg: 1 };
  type Velocity = DivideUnits<Meter, Second>;

  it("combines dimensions and cancels zero exponents", () => {
    expectTypeOf<Velocity>().toEqualTypeOf<{ readonly m: 1; readonly s: -1 }>();
    expectTypeOf<MultiplyUnits<Kilogram, DivideUnits<Velocity, Second>>>().toEqualTypeOf<{
      readonly kg: 1;
      readonly m: 1;
      readonly s: -2;
    }>();
    expectTypeOf<MultiplyUnits<Velocity, Second>>().toEqualTypeOf<Meter>();
    expectTypeOf<DivideUnits<Meter, Meter>>().toEqualTypeOf<{}>();
  });

  it("computes powers, reciprocals, and exact roots", () => {
    expectTypeOf<ReciprocalUnit<Second>>().toEqualTypeOf<{ readonly s: -1 }>();
    expectTypeOf<SqrtUnit<PowUnit<Velocity, 2>>>().toEqualTypeOf<Velocity>();
    expectTypeOf<SqrtUnit<Meter>>().toBeNever();
  });
});
