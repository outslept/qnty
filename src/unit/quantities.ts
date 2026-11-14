import { Measure } from "../measure/measure.ts";
import {
  amperes,
  bits,
  candelas,
  kelvin,
  kilograms,
  meters,
  moles,
  radians,
  seconds,
  steradians,
} from "./base.ts";

// Base quantities
export const Dimensionless = Measure.dimensionless(1);
export type Dimensionless = typeof Dimensionless;

export const Length = meters;
export type Length = typeof Length;

export const Mass = kilograms;
export type Mass = typeof Mass;

export const Time = seconds;
export type Time = typeof Time;

export const ElectricCurrent = amperes;
export type ElectricCurrent = typeof ElectricCurrent;

export const Temperature = kelvin;
export type Temperature = typeof Temperature;

export const AmountOfSubstance = moles;
export type AmountOfSubstance = typeof AmountOfSubstance;

export const LuminousIntensity = candelas;
export type LuminousIntensity = typeof LuminousIntensity;

export const Memory = bits;
export type Memory = typeof Memory;

export const PlaneAngle = radians;
export type PlaneAngle = typeof PlaneAngle;

export const SolidAngle = steradians;
export type SolidAngle = typeof SolidAngle;

// Kinematics & geometry
export const Area = meters.squared();
export type Area = typeof Area;

export const Volume = meters.cubed();
export type Volume = typeof Volume;

export const Frequency = seconds.inverse();
export type Frequency = typeof Frequency;

export const FrequencyDrift = Frequency.per(seconds);
export type FrequencyDrift = typeof FrequencyDrift;

export const FuelEfficiency = meters.per(Volume);
export type FuelEfficiency = typeof FuelEfficiency;

export const Wavenumber = meters.inverse();
export type Wavenumber = typeof Wavenumber;

export const Absement = meters.times(seconds);
export type Absement = typeof Absement;

export const Velocity = meters.per(seconds);
export type Velocity = typeof Velocity;

export const Acceleration = Velocity.per(seconds);
export type Acceleration = typeof Acceleration;

export const Jerk = Acceleration.per(seconds);
export type Jerk = typeof Jerk;

export const Jounce = Jerk.per(seconds);
export type Jounce = typeof Jounce;

export const Crackle = Jounce.per(seconds);
export type Crackle = typeof Crackle;

export const Pop = Crackle.per(seconds);
export type Pop = typeof Pop;

export const AngularVelocity = radians.per(seconds);
export type AngularVelocity = typeof AngularVelocity;

export const AngularAcceleration = AngularVelocity.per(seconds);
export type AngularAcceleration = typeof AngularAcceleration;

export const VolumetricFlow = Volume.per(seconds);
export type VolumetricFlow = typeof VolumetricFlow;

// Mechanics
export const MassFlowRate = kilograms.per(seconds);
export type MassFlowRate = typeof MassFlowRate;

export const LinearDensity = kilograms.per(meters);
export type LinearDensity = typeof LinearDensity;

export const AreaDensity = kilograms.per(Area);
export type AreaDensity = typeof AreaDensity;

export const VolumeDensity = kilograms.per(Volume);
export type VolumeDensity = typeof VolumeDensity;

export const SpecificVolume = Volume.per(kilograms);
export type SpecificVolume = typeof SpecificVolume;

export const Force = kilograms.times(Acceleration);
export type Force = typeof Force;

export const Yank = Force.per(seconds);
export type Yank = typeof Yank;

export const Pressure = Force.per(Area);
export type Pressure = typeof Pressure;

export const Compressibility = Pressure.inverse();
export type Compressibility = typeof Compressibility;

export const DynamicViscosity = Pressure.times(seconds);
export type DynamicViscosity = typeof DynamicViscosity;

export const SurfaceTension = Force.per(meters);
export type SurfaceTension = typeof SurfaceTension;

export const Momentum = Force.times(seconds);
export type Momentum = typeof Momentum;

export const MomentOfInertia = kilograms.times(Area);
export type MomentOfInertia = typeof MomentOfInertia;

export const AngularMomentum = Momentum.times(meters);
export type AngularMomentum = typeof AngularMomentum;

export const SpecificAngularMomentum = AngularMomentum.per(kilograms);
export type SpecificAngularMomentum = typeof SpecificAngularMomentum;

export const Energy = Force.times(meters);
export type Energy = typeof Energy;

export const Power = Energy.per(seconds);
export type Power = typeof Power;

export const PowerDensity = Power.per(Volume);
export type PowerDensity = typeof PowerDensity;

export const Irradiance = Power.per(Area);
export type Irradiance = typeof Irradiance;

// Electromagnetism
export const ElectricCharge = amperes.times(seconds);
export type ElectricCharge = typeof ElectricCharge;

export const LinearChargeDensity = ElectricCharge.per(meters);
export type LinearChargeDensity = typeof LinearChargeDensity;

export const ElectricChargeDensity = ElectricCharge.per(Volume);
export type ElectricChargeDensity = typeof ElectricChargeDensity;

export const ElectricCurrentDensity = amperes.per(Area);
export type ElectricCurrentDensity = typeof ElectricCurrentDensity;

export const ElectricDisplacement = ElectricCharge.per(Area);
export type ElectricDisplacement = typeof ElectricDisplacement;

export const Voltage = Power.per(amperes);
export type Voltage = typeof Voltage;

export const ElectricFieldStrength = Voltage.per(meters);
export type ElectricFieldStrength = typeof ElectricFieldStrength;

export const EletricFieldStrength = ElectricFieldStrength;
export type EletricFieldStrength = ElectricFieldStrength;

export const ElectricalCapacitance = ElectricCharge.per(Voltage);
export type ElectricalCapacitance = typeof ElectricalCapacitance;

export const Permittivity = ElectricalCapacitance.per(meters);
export type Permittivity = typeof Permittivity;

export const ElectricalResistance = Voltage.per(amperes);
export type ElectricalResistance = typeof ElectricalResistance;

export const ElectricalResistivity = ElectricalResistance.times(meters);
export type ElectricalResistivity = typeof ElectricalResistivity;

export const ElectricalConductance = ElectricalResistance.inverse();
export type ElectricalConductance = typeof ElectricalConductance;

export const ElectricalConductivity = ElectricalConductance.per(meters);
export type ElectricalConductivity = typeof ElectricalConductivity;

export const MagneticFlux = Voltage.times(seconds);
export type MagneticFlux = typeof MagneticFlux;

export const MagneticFluxDensity = MagneticFlux.per(Area);
export type MagneticFluxDensity = typeof MagneticFluxDensity;

export const ElectricalInductance = MagneticFlux.per(amperes);
export type ElectricalInductance = typeof ElectricalInductance;

export const MagneticPermeability = ElectricalInductance.per(meters);
export type MagneticPermeability = typeof MagneticPermeability;

export const Magnetization = amperes.per(meters);
export type Magnetization = typeof Magnetization;

export const MagneticReluctance = ElectricalInductance.inverse();
export type MagneticReluctance = typeof MagneticReluctance;

export const MagneticMoment = MagneticFlux.times(meters);
export type MagneticMoment = typeof MagneticMoment;

export const MagneticRigidity = MagneticFluxDensity.times(meters);
export type MagneticRigidity = typeof MagneticRigidity;

export const MagneticDipoleMoment = Energy.per(MagneticFluxDensity);
export type MagneticDipoleMoment = typeof MagneticDipoleMoment;

export const MagneticSusceptibility = Magnetization.per(MagneticFluxDensity);
export type MagneticSusceptibility = typeof MagneticSusceptibility;

export const ElectronMobility = Area.per(Voltage.times(seconds));
export type ElectronMobility = typeof ElectronMobility;

// Thermodynamics & chemistry
export const Entropy = Energy.per(kelvin);
export type Entropy = typeof Entropy;

export const SpecificHeat = Entropy.per(kilograms);
export type SpecificHeat = typeof SpecificHeat;

export const ThermalConductivity = Power.per(meters.times(kelvin));
export type ThermalConductivity = typeof ThermalConductivity;

export const ThermalResistance = kelvin.per(Power);
export type ThermalResistance = typeof ThermalResistance;

export const ThermalExpansionCoefficient = kelvin.inverse();
export type ThermalExpansionCoefficient = typeof ThermalExpansionCoefficient;

export const ThermalGradient = kelvin.per(meters);
export type ThermalGradient = typeof ThermalGradient;

export const MolarEntropy = Entropy.per(moles);
export type MolarEntropy = typeof MolarEntropy;

export const MolarEnergy = Energy.per(moles);
export type MolarEnergy = typeof MolarEnergy;

export const Molarity = moles.per(Volume);
export type Molarity = typeof Molarity;

export const MolarVolume = Volume.per(moles);
export type MolarVolume = typeof MolarVolume;

export const Molality = moles.per(kilograms);
export type Molality = typeof Molality;

export const MolarMass = kilograms.per(moles);
export type MolarMass = typeof MolarMass;

export const MolarConductivity = ElectricalConductance.times(Area).per(moles);
export type MolarConductivity = typeof MolarConductivity;

export const CatalyticActivity = moles.per(seconds);
export type CatalyticActivity = typeof CatalyticActivity;

export const CatalyticEfficiency = MolarVolume.per(seconds);
export type CatalyticEfficiency = typeof CatalyticEfficiency;

export const ReactionRate = Molarity.per(seconds);
export type ReactionRate = typeof ReactionRate;

// Radiation & photometry
export const RadiationDose = Energy.per(kilograms);
export type RadiationDose = typeof RadiationDose;

export const RadiationDoseRate = RadiationDose.per(seconds);
export type RadiationDoseRate = typeof RadiationDoseRate;

export const Luminance = candelas.per(Area);
export type Luminance = typeof Luminance;

export const LuminousFlux = candelas.times(steradians);
export type LuminousFlux = typeof LuminousFlux;

export const Illuminance = LuminousFlux.per(Area);
export type Illuminance = typeof Illuminance;

export const LuminousEnergy = LuminousFlux.times(seconds);
export type LuminousEnergy = typeof LuminousEnergy;

export const LuminousExposure = Illuminance.times(seconds);
export type LuminousExposure = typeof LuminousExposure;

export const LuminousEfficiency = LuminousFlux.per(Power);
export type LuminousEfficiency = typeof LuminousEfficiency;

export const RadiantIntensity = Power.per(steradians);
export type RadiantIntensity = typeof RadiantIntensity;

export const SpectralIntensity = RadiantIntensity.per(meters);
export type SpectralIntensity = typeof SpectralIntensity;

export const Radiance = RadiantIntensity.per(Area);
export type Radiance = typeof Radiance;

export const SpectralRadiance = Radiance.per(meters);
export type SpectralRadiance = typeof SpectralRadiance;
