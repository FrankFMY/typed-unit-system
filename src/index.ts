import { UnitDefinition } from "./definition.js";
import * as systems from "./library.js";
import type { ExtractUnitDefinitionsType } from "./utils.js";

export * from "./definition.js";
export * from "./library.js";
export * from "./types.js";
export * from "./utils.js";

export type UnitSystems = {
  [K in ExtractUnitDefinitionsType<typeof systems> as K["name"]]: K;
};

export type UnitSystemKey = keyof UnitSystems;
export type UnitCursor<K extends UnitSystemKey = UnitSystemKey> = UnitSystems[K]["__type_cursor"];

export const unitSystems = Object.fromEntries(
  Object.values(systems)
    .filter((system) => system instanceof UnitDefinition)
    .map((system) => [system.name, system]),
) as UnitSystems;

export const unitSystemKeys = Object.keys(unitSystems) as UnitSystemKey[];
export const getUnitSystem = <K extends UnitSystemKey>(key: K): UnitSystems[K] => unitSystems[key];
