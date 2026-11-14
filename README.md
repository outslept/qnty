# qnty

Type-level Units of Measure for TypeScript - combining **F#-style string unit expressions**, **zero-cost branded numbers (`Qty`)**, and a **fluent OOP `Measure` API** (a successor to `safe-units`).

## Features

- **Sparse Type-Level Vector Algebra** - cancels zero exponents automatically (`m * s / s` -> `{ readonly m: 1 }`), computes arbitrary integer powers and exact roots (`sqrt`, `cbrt`), and keeps IDE hover types compact.
- **Type-Level Unit String Parser** - parses compound expressions (`"kg * m / s^2"`, `"kg ⋅ m / s²"`, `"m^2 / (kg * s^2)"`) with nested parentheses at both compile time and runtime.
- **Automatic Coherent SI Unification** - `Unit<"N">`, `Unit<"J / m">`, and `Unit<"kg * m / s^2">` resolve to the exact same type.
- **Dual API: Zero-Cost `Qty` & Fluent `Measure`** - use unboxed `number` primitives (`Qty`) in hot loops or fluent `Measure` instances with automatic scaling and unit symbols.
- **Compile-Time Checked Conversions** - convert between metric, imperial, US customary, and affine temperature scales (`degC`, `degF`, `K`) while rejecting incompatible dimensions at compile time.
- **90+ Physical Quantities & Predefined Units** - SI base/derived units, metric & binary prefixes (`kilo`, `milli`, `kibi`, `gibi`), common/imperial/US customary units, and dimensional quantities (`Velocity`, `Force`, `Energy`, `Voltage`, etc.).

---

## Quick Start

### 1. Zero-Cost Primitive API (`Qty` / `Unit`)

`Qty` values are raw JavaScript `number` primitives at runtime (`typeof d === "number"`) branded with their unit vector at compile time.

```ts
import { add, div, format, mul, qty, sqrt, to, type Unit } from "qnty";

const distance = qty(100, "m");
const time = qty(9.58, "s");

// Inferred as Qty<{ readonly m: 1; readonly s: -1 }> (identical to Unit<"m/s">)
const speed: Unit<"m/s"> = div(distance, time);

const mass = qty(75, "kg");
const accel = div(speed, time);

// Automatically unifies with Unit<"N"> and Unit<"J">
const force: Unit<"N"> = mul(mass, accel);
const work: Unit<"J"> = mul(force, distance);

// Compile-time checked unit conversions (including affine temperatures)
const mph = to(speed, "m/s", "mi/hr");
const boilingF = to(qty(100, "degC"), "degC", "degF"); // 212

console.log(format(force, "N", (n) => n.toFixed(1))); // "817.1 N"

// Compile-time errors:
// add(qty(1, "m"), qty(1, "s"));        // Error: incompatible units
// mul(qty(2, "km"), qty(500, "m"));     // Error: mixed scales on the same axis
// sqrt(qty(9, "m"));                    // Error: odd exponent cannot take square root
// to(speed, "m/s", "kg");               // Error: incompatible dimensions
```

---

### 2. OOP API (`Measure`)

`Measure` wraps a canonical SI scalar and unit vector, supporting chained arithmetic, prefixes, and unit conversions.

```ts
import {
  Acceleration,
  Force,
  Length,
  Measure,
  Velocity,
  hours,
  kilo,
  kilograms,
  meters,
  miles,
  seconds,
} from "qnty";

const kilometers = kilo(meters);
const kmPerHour = kilometers.per(hours);

const speed: Velocity = Measure.of(100, kmPerHour);
const duration = Measure.of(2, hours);
const distance: Length = speed.times(duration);

console.log(distance.in(kilometers)); // "200 km"
console.log(distance.valueIn(miles)); // 124.2742384474668
console.log(distance.in("mi")); // "124.2742384474668 mi"

// Construct directly from unit expression strings
const g: Acceleration = Measure.of(9.80665, "m / s^2");
const weight: Force = Measure.of(80, kilograms).times(g);

console.log(weight.in("N")); // "784.532 N"

// Unbox to zero-cost Qty<U> at any time
const rawForce = weight.toQty(); // Unit<"N">
```

---

## Predefined Units & Prefixes

```ts
import {
  atan2,
  bytes,
  cos,
  degrees,
  gibi,
  kilo,
  liters,
  meters,
  milli,
  newtons,
  pascals,
  watts,
} from "qnty";

// Metric (SI) prefixes: yotta..yocto
const km = kilo(meters);
const mL = milli(liters);
const kPa = kilo(pascals);
const MW = Measure.prefix("M", 1e6)(watts);

// Binary (IEC) memory prefixes: kibi..yobi
const ram = Measure.of(16, gibi(bytes)); // 16 GiB

// Type-safe trigonometry
const angle = atan2(Measure.of(10, meters), Measure.of(10, meters));
console.log(angle.valueIn(degrees)); // 45
console.log(cos(angle).value); // 0.7071067811865476
```

---

## Physical Quantities

Every physical quantity in `qnty` is exported both as a **type** and as a **unit value**:

- **Base:** `Dimensionless`, `Length`, `Mass`, `Time`, `ElectricCurrent`, `Temperature`, `AmountOfSubstance`, `LuminousIntensity`, `PlaneAngle`, `SolidAngle`, `Memory`
- **Kinematics & Mechanics:** `Area`, `Volume`, `Frequency`, `Velocity`, `Acceleration`, `Jerk`, `AngularVelocity`, `Force`, `Pressure`, `Energy`, `Power`, `Momentum`, `MomentOfInertia`, `DynamicViscosity`, `SurfaceTension`, ...
- **Electromagnetism:** `ElectricCharge`, `Voltage`, `ElectricFieldStrength`, `ElectricalResistance`, `ElectricalConductance`, `ElectricalCapacitance`, `ElectricalInductance`, `MagneticFlux`, `MagneticFluxDensity`, ...
- **Thermodynamics, Chemistry & Optics:** `Entropy`, `SpecificHeat`, `ThermalConductivity`, `Molarity`, `Molality`, `MolarMass`, `CatalyticActivity`, `RadiationDose`, `LuminousFlux`, `Illuminance`, `Luminance`, `Radiance`, ...
