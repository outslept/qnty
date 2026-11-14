import { describe, expect, expectTypeOf, it } from "vite-plus/test";
import {
  Acceleration,
  AngularAcceleration,
  AngularMomentum,
  AngularVelocity,
  Area,
  AreaDensity,
  CatalyticActivity,
  Compressibility,
  DynamicViscosity,
  ElectricCharge,
  ElectricCurrentDensity,
  ElectricFieldStrength,
  ElectricalCapacitance,
  ElectricalConductance,
  ElectricalInductance,
  ElectricalResistance,
  Energy,
  Entropy,
  Force,
  Frequency,
  Illuminance,
  Irradiance,
  Length,
  LuminousFlux,
  MagneticFlux,
  MagneticFluxDensity,
  Mass,
  Momentum,
  Power,
  Pressure,
  RadiationDose,
  SpecificHeat,
  SurfaceTension,
  Time,
  Velocity,
  Voltage,
  Volume,
  VolumeDensity,
  Wavenumber,
  amperes,
  candelas,
  kelvin,
  kilograms,
  meters,
  moles,
  radians,
  seconds,
  steradians,
} from "../../index.ts";

describe("Physical quantities", () => {
  it("matches base and derived dimensional equations at runtime and type level", () => {
    expect(Length).toEqual(meters);
    expect(Mass).toEqual(kilograms);
    expect(Time).toEqual(seconds);

    expect(Frequency).toEqual(seconds.inverse());
    expectTypeOf(Frequency).toEqualTypeOf(seconds.inverse());

    expect(Wavenumber).toEqual(meters.inverse());
    expect(Area).toEqual(meters.squared());
    expect(Volume).toEqual(meters.cubed());

    expect(Velocity).toEqual(meters.per(seconds));
    expect(Acceleration).toEqual(Velocity.per(seconds));
    expect(Force).toEqual(kilograms.times(Acceleration));
    expectTypeOf(Force).toEqualTypeOf(kilograms.times(Acceleration));

    expect(Pressure).toEqual(Force.per(Area));
    expect(Compressibility).toEqual(Pressure.inverse());
    expect(DynamicViscosity).toEqual(Pressure.times(seconds));
    expect(SurfaceTension).toEqual(Force.per(meters));
    expect(Momentum).toEqual(Force.times(seconds));

    expect(Energy).toEqual(Force.times(meters));
    expectTypeOf(Energy).toEqualTypeOf(Force.times(meters));

    expect(Power).toEqual(Energy.per(seconds));
    expect(Irradiance).toEqual(Power.per(Area));
    expect(AreaDensity).toEqual(kilograms.per(Area));
    expect(VolumeDensity).toEqual(kilograms.per(Volume));

    expect(ElectricCharge).toEqual(amperes.times(seconds));
    expect(ElectricCurrentDensity).toEqual(amperes.per(Area));
    expect(Voltage).toEqual(Power.per(amperes));
    expectTypeOf(Voltage).toEqualTypeOf(Power.per(amperes));

    expect(ElectricFieldStrength).toEqual(Voltage.per(meters));
    expect(ElectricalResistance).toEqual(Voltage.per(amperes));
    expect(ElectricalConductance).toEqual(ElectricalResistance.inverse());
    expect(ElectricalCapacitance).toEqual(ElectricCharge.per(Voltage));

    expect(MagneticFlux).toEqual(Voltage.times(seconds));
    expect(MagneticFluxDensity).toEqual(MagneticFlux.per(Area));
    expect(ElectricalInductance).toEqual(MagneticFlux.per(amperes));

    expect(Entropy).toEqual(Energy.per(kelvin));
    expect(SpecificHeat).toEqual(Entropy.per(kilograms));
    expect(CatalyticActivity).toEqual(moles.per(seconds));
    expect(RadiationDose).toEqual(Energy.per(kilograms));

    expect(AngularMomentum).toEqual(Momentum.times(meters));
    expect(AngularVelocity).toEqual(radians.per(seconds));
    expect(AngularAcceleration).toEqual(AngularVelocity.per(seconds));

    expect(LuminousFlux).toEqual(candelas.times(steradians));
    expect(Illuminance).toEqual(LuminousFlux.per(Area));
  });
});
