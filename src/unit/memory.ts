import { Measure } from "../measure/measure.ts";
import { bits } from "./base.ts";
import type { PrefixFn } from "./metric.ts";

export const bytes = Measure.of(8, bits, "B");

export const kibi: PrefixFn = Measure.prefix("Ki", 2 ** 10);
export const mebi: PrefixFn = Measure.prefix("Mi", 2 ** 20);
export const gibi: PrefixFn = Measure.prefix("Gi", 2 ** 30);
export const tebi: PrefixFn = Measure.prefix("Ti", 2 ** 40);
export const pibi: PrefixFn = Measure.prefix("Pi", 2 ** 50);
export const exbi: PrefixFn = Measure.prefix("Ei", 2 ** 60);
export const zebi: PrefixFn = Measure.prefix("Zi", 2 ** 70);
export const yobi: PrefixFn = Measure.prefix("Yi", 2 ** 80);
