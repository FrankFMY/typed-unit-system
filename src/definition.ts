import type { KEYS, NeverKeysFilterType } from "./types.js";

//...

export type AnyUnitDefinition = UnitDefinition<any, any>;

export interface IUnitCompositeStep<Definition extends AnyUnitDefinition = AnyUnitDefinition> {
	def: Definition;
	prev: (v: number, key: KEYS<Definition["__type_config"]>) => number;
	next: (v: number, key: KEYS<Definition["__type_config"]>) => number;
}

export interface IUnitCompositePrototype<Steps extends IUnitCompositeStep<any>[] = IUnitCompositeStep<any>[]> {
	steps: Steps;
}

export interface IUnitScalarPrototype {
	name: string;
	short: string;
	to: (v: number) => number;
	from: (v: number) => number;
}

export type IUnitPrototype = IUnitScalarPrototype | IUnitCompositePrototype;

//...

export type isCompositePrototypeType<T> = T extends IUnitCompositePrototype<any> ? true : false;

export type CompositeKeys<T> = { [K in keyof T]: isCompositePrototypeType<T[K]> extends true ? K : never }[keyof T];

export type NotCompositeKeys<T> = { [K in keyof T]: isCompositePrototypeType<T[K]> extends false ? K : never }[keyof T];

//...

export type CompositeSteps<T extends object, K extends CompositeKeys<T>> = T[K] extends IUnitCompositePrototype<any> ? T[K]["steps"] : never;

export type CompositeUnitsArray<T extends object, K extends CompositeKeys<T>> = {
	[I in keyof CompositeSteps<T, K>]: KEYS<CompositeSteps<T, K>[I]["def"]["__type_config"]>;
};

// Кортеж для композита: [KeyComposite, [...CompositeUnitsArray]]
// TypeScript тащил ключами методы массива, ни один способ починки не прокатил. Но у них было значение never и NeverKeysFilterType фильтрация спасла
export type CompositeArgs<T extends object, K extends CompositeKeys<T> = CompositeKeys<T>> = [K, NeverKeysFilterType<CompositeUnitsArray<T, K>>];

// Объединенный тип аргумента: либо простой ключ, либо кортеж композита
export type IUnit<T extends object> = NotCompositeKeys<T> | CompositeArgs<T>;

export interface IUnitD<U extends AnyUnitDefinition> {
	name: U["name"];
	keys: U["__type_keys"];
	units: U["__type_units"];
	cursor: U["__type_cursor"];
}

/*
 * Определение системы единиц измерения.
 *
 * @remarks
 * **Почему `Config extends object`, а не `Config extends Record<string, IUnitPrototype>`?**
 * При использовании `Record` ломается вывод конкретных ключей — TypeScript расширяет тип до `string`,
 * теряя все литеральные ключи.
 *
 * @example
 * ```typescript
 * const LengthUnits = {
 *   m:  scalar({ name: "Meters", short: "m" }),
 *   km: scalar({ name: "Kilometers", short: "km" }, 1000),
 * } satisfies Record<string, IUnitScalarPrototype>;
 *
 * export const LengthSI = new UnitDefinition("length", LengthUnits, "m", "m");
 * ```
 */
export class UnitDefinition<Name extends string, Config extends object> {
	readonly name: Name;
	readonly config: Config;
	readonly parrots: KEYS<Config>;
	readonly default: IUnit<Config>;
	readonly tag: string;

	readonly entries: [KEYS<Config>, IUnitPrototype][] = [];
	readonly ptps: Map<KEYS<Config>, IUnitPrototype>;

	declare __type_config: Config;
	declare __type_keys: KEYS<Config>;
	declare __type_units: IUnit<Config>;
	declare __type_cursor: [Name, IUnit<Config>];

	constructor(name: Name, config: Config, parrots: KEYS<Config>, default_unit: IUnit<Config>, tag: string) {
		this.tag = tag;
		this.name = name;
		this.config = config;
		this.parrots = parrots;
		this.default = default_unit;
		this.entries = Object.entries(config) as [KEYS<Config>, IUnitPrototype][];
		this.ptps = new Map<KEYS<Config>, IUnitPrototype>(this.entries);
	}

	getPrototype<K extends KEYS<Config>>(key: K): Config[K] {
		return this.ptps.get(key) as Config[K];
	}

	/*
	 * Конвертирует значение между двумя единицами данной системы.
	 *
	 *
	 * @example
	 * ```typescript
	 * LengthSI.convert(100, "cm", "m");           // 1
	 * SpeedSI.convert(1, ["L/T", ["km", "h"]], ["L/T", ["m", "s"]]); // 0.2777...
	 * EnergySI.convert(1, ["P*t", ["kW", "h"]], "J"); // 3_600_000
	 * ```
	 */
	convert<A extends IUnit<Config>, B extends IUnit<Config>>(v: number, a: A, b: B): number {
		let parrots = v;

		if (Array.isArray(a)) {
			const ptp = this.getPrototype(a[0] as KEYS<Config>) as IUnitCompositePrototype;
			const keys = a[1] as string[];
			if (keys.length !== ptp.steps.length) throw new TypeError("Composite unit arity mismatch");
			for (let i = ptp.steps.length - 1; i >= 0; i--) {
				const step = ptp.steps[i];
				const key = keys[i];
				if (!step || key === undefined) throw new TypeError("Composite unit arity mismatch");
				parrots = step.prev(parrots, key);
			}
		} else {
			parrots = (this.getPrototype(a as KEYS<Config>) as IUnitScalarPrototype).to(v);
		}

		if (Array.isArray(b)) {
			const ptp = this.getPrototype(b[0] as KEYS<Config>) as IUnitCompositePrototype;
			const keys = b[1] as string[];
			if (keys.length !== ptp.steps.length) throw new TypeError("Composite unit arity mismatch");
			for (let i = 0; i < ptp.steps.length; i++) {
				const step = ptp.steps[i];
				const key = keys[i];
				if (!step || key === undefined) throw new TypeError("Composite unit arity mismatch");
				parrots = step.next(parrots, key);
			}
		} else {
			parrots = (this.getPrototype(b as KEYS<Config>) as IUnitScalarPrototype).from(parrots);
		}

		return parrots;
	}
}
