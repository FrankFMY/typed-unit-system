import type { KEYS } from "./types.js";
import type { AnyUnitDefinition, IUnitCompositePrototype, IUnitCompositeStep, IUnitPrototype, IUnitScalarPrototype } from "./definition.js";

/**
 * Извлекает из объекта (например, `import * as SI from "./library.js"`)
 * объединение всех экспортов-инстансов `UnitDefinition`.
 */
export type ExtractUnitDefinitionsType<F> = {
	[K in keyof F]: F[K] extends AnyUnitDefinition ? F[K] : never;
}[keyof F];

/**
 * Фабрика линейной скалярной единицы.
 *
 * @example
 * ```typescript
 * const km = scalar({ name: "Kilometers", short: "km" }, 1_000);
 * ```
 */
export const scalar = (data: { name: string; short: string }, factor: number = 1): IUnitScalarPrototype => ({
	...data,
	from: (v: number): number => v / factor,
	to: (v: number): number => v * factor,
});

/**
 * Шаг композита через каноническую конвертацию другой системы.
 *
 * Семантика: «возьми значение в единице X системы и приведи к её канону (и наоборот)».
 * Обычно это **первый** шаг композита — «носитель» размерности.
 *
 * @example
 * ```typescript
 * // Энергия = Мощность * Время: первый шаг — сама мощность.
 * { steps: [parrot(PowerSI), multi(TimeSI)] }
 * ```
 */
export const parrot = <D extends AnyUnitDefinition>(def: D, def_key: KEYS<D["__type_config"]> = def.parrots as KEYS<D["__type_config"]>) =>
	({
		def,
		prev: (v, key): number => def.convert(v, key, def_key),
		next: (v, key): number => def.convert(v, def_key, key),
	}) as IUnitCompositeStep<D>;

/**
 * Шаг композита типа **умножение** на другую систему.
 *
 * Семантика: `X * Y` — «во сколько раз Y отличается от его канона».
 * Значение умножается на фактор при движении «по направлению», и делится — при обратном.
 *
 * @example
 * ```typescript
 * // Джоуль = Ватт * Секунда. В композите `P*t` время входит как множитель.
 * { steps: [parrot(PowerSI), multi(TimeSI)] }
 * ```
 */
export const multi = <D extends AnyUnitDefinition>(def: D, def_key: KEYS<D["__type_config"]> = def.parrots as KEYS<D["__type_config"]>) =>
	({
		def,
		next: (v, key): number => v * def.convert(1, def_key, key),
		prev: (v, key): number => v / def.convert(1, def_key, key),
	}) as IUnitCompositeStep<D>;

/**
 * Шаг композита типа **деление** на другую систему.
 *
 * Семантика: `X / Y` — «во сколько раз Y отличается от его канона», но в знаменателе.
 *
 * @example
 * ```typescript
 * // Скорость = Длина / Время. В композите `L/T` время входит как делитель.
 * { steps: [parrot(LengthSI), div(TimeSI)] }
 * ```
 */
export const div = <D extends AnyUnitDefinition>(def: D, def_key: KEYS<D["__type_config"]> = def.parrots as KEYS<D["__type_config"]>) =>
	({
		def,
		next: (v, key): number => v / def.convert(1, def_key, key),
		prev: (v, key): number => v * def.convert(1, def_key, key),
	}) as IUnitCompositeStep<D>;

/** Type guard: является ли прототип композитным. */
export const isCompositePrototype = (ptp: IUnitPrototype): ptp is IUnitCompositePrototype => "steps" in ptp;
