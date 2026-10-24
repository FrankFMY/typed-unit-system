import type { AnyUnitDefinition, UnitDefinition, IUnit, IUnitCompositePrototype, IUnitCompositeStep, IUnitPrototype, IUnitScalarPrototype } from "./definition.js";

/** Extract the union of exported UnitDefinition instances from a module namespace. */
export type ExtractUnitDefinitionsType<F> = {
	[K in keyof F]: F[K] extends AnyUnitDefinition ? F[K] : never;
}[keyof F];

/** Create a linear scalar unit relative to its system canonical unit. */
export const scalar = (data: { name: string; short: string }, factor: number = 1): IUnitScalarPrototype => ({
	...data,
	from: (v: number): number => v / factor,
	to: (v: number): number => v * factor,
});

/** Scalar members encode the raw pivot; composite labels must not become nested callback keys. */
const toCanonical = (def: AnyUnitDefinition, value: number, key: string): number => {
	const canonical = def.getPrototype(def.parrots) as IUnitPrototype;
	const raw = (def.getPrototype(key) as IUnitScalarPrototype).to(value);
	return isCompositePrototype(canonical) ? raw : canonical.from(raw);
};

const fromCanonical = (def: AnyUnitDefinition, value: number, key: string): number => {
	const canonical = def.getPrototype(def.parrots) as IUnitPrototype;
	const raw = isCompositePrototype(canonical) ? value : canonical.to(value);
	return (def.getPrototype(key) as IUnitScalarPrototype).from(raw);
};

/** Preserve the concrete config when forwarding conditional composite arguments. */
const convert = <D extends AnyUnitDefinition>(def: D, value: number, from: IUnit<D["__type_config"]>, to: IUnit<D["__type_config"]>): number =>
	(def as UnitDefinition<D["name"], D["__type_config"]>).convert(value, from, to);

/** Use another system as the first, dimension-carrying composite step. */
export const parrot = <D extends AnyUnitDefinition>(def: D, def_key?: IUnit<D["__type_config"]>) =>
	({
		def,
		prev: (v, key): number => def_key === undefined ? toCanonical(def, v, key) : convert(def, v, key, def_key),
		next: (v, key): number => def_key === undefined ? fromCanonical(def, v, key) : convert(def, v, def_key, key),
	}) as IUnitCompositeStep<D>;

/** Multiply by a linear unit factor in a composite. Affine units are not ratio factors. */
export const multi = <D extends AnyUnitDefinition>(def: D, def_key?: IUnit<D["__type_config"]>) =>
	({
		def,
		next: (v, key): number => v * (def_key === undefined ? fromCanonical(def, 1, key) : convert(def, 1, def_key, key)),
		prev: (v, key): number => v / (def_key === undefined ? fromCanonical(def, 1, key) : convert(def, 1, def_key, key)),
	}) as IUnitCompositeStep<D>;

/** Divide by a linear unit factor in a composite. Affine units are not ratio factors. */
export const div = <D extends AnyUnitDefinition>(def: D, def_key?: IUnit<D["__type_config"]>) =>
	({
		def,
		next: (v, key): number => v / (def_key === undefined ? fromCanonical(def, 1, key) : convert(def, 1, def_key, key)),
		prev: (v, key): number => v * (def_key === undefined ? fromCanonical(def, 1, key) : convert(def, 1, def_key, key)),
	}) as IUnitCompositeStep<D>;

/** Test whether a unit prototype is composite. */
export const isCompositePrototype = (ptp: IUnitPrototype): ptp is IUnitCompositePrototype => "steps" in ptp;
