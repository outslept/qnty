import type { Dimensionless } from "../measure/algebra.ts";
import { Measure } from "../measure/measure.ts";
import { radians } from "./base.ts";

type Angle = Measure<{ readonly rad: 1 }>;
type Unitless = Measure<Dimensionless>;

export const cos = (angle: Angle): Unitless => Measure.dimensionless(Math.cos(angle.value));
export const sin = (angle: Angle): Unitless => Measure.dimensionless(Math.sin(angle.value));
export const tan = (angle: Angle): Unitless => Measure.dimensionless(Math.tan(angle.value));

export const acos = (x: Unitless): Angle => Measure.of(Math.acos(x.value), radians);
export const asin = (x: Unitless): Angle => Measure.of(Math.asin(x.value), radians);
export const atan = (x: Unitless): Angle => Measure.of(Math.atan(x.value), radians);

// Any two measures sharing unit U have a dimensionless ratio y/x
export const atan2 = <U>(y: Measure<U>, x: Measure<U>): Angle =>
  Measure.of(Math.atan2(y.value, x.value), radians);
