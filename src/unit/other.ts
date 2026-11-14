import { Measure } from "../measure/measure.ts";
import { meters, seconds } from "./base.ts";
import { grams } from "./common.ts";
import { milli, nano, pascals } from "./metric.ts";

export const carats = Measure.of(200, milli(grams), "ct");
export const angstroms = Measure.of(0.1, nano(meters), "Å");
export const ares = Measure.of(100, meters.squared(), "a");
export const hectares = Measure.of(10_000, meters.squared(), "ha");
export const liters = Measure.of(0.001, meters.cubed(), "L");
export const speedOfLight = Measure.of(299_792_458, meters.per(seconds), "c");
export const bars = Measure.of(100_000, pascals, "bar");
export const atmospheres = Measure.of(101_325, pascals, "atm");
export const torrs = Measure.of(1 / 760, atmospheres, "Torr");
export const psi = Measure.of(6894.757_293_168, pascals, "psi");
