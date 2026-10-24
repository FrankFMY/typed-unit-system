import { LengthSI, MassSI, SpeedSI, UnitDefinition, scalar, getUnitSystem, PowerSI, TimeSI, ElectricVoltageSI, ElectricCurrentSI, parrot, multi, div, FuelConsumptionSI } from "@frankfmy/typed-unit-system";
import type { UnitCursor, IUnitScalarPrototype, IUnitCompositePrototype, IUnitCompositeStep } from "@frankfmy/typed-unit-system";
const length: number = LengthSI.convert(1, "km", "m");
SpeedSI.convert(36, ["L/T", ["km", "h"]], ["L/T", ["m", "s"]]);
const massCursor: UnitCursor<"mass"> = ["mass", "kg"];
const speedCursor: UnitCursor<"speed"> = ["speed", ["L/T", ["km", "h"]]];
const config = { one: scalar({ name: "One", short: "w" }), kilo: scalar({ name: "Thousand", short: "kw" }, 1000) } satisfies Record<string, IUnitScalarPrototype>;
const custom = new UnitDefinition("widget", config, "one", "one", "Widgets");
custom.convert(1, "kilo", "one");
// @ts-expect-error mass keys are not length keys
LengthSI.convert(1, "kg", "m");
// @ts-expect-error inferred registry entry retains mass keys
getUnitSystem("mass").convert(1, "m", "kg");
// @ts-expect-error composite tuple requires a time denominator
SpeedSI.convert(1, ["L/T", ["km", "kg"]], ["L/T", ["m", "s"]]);
// @ts-expect-error composite tuple arity is part of the contract
SpeedSI.convert(1, ["L/T", ["km"]], ["L/T", ["m", "s"]]);
// @ts-expect-error cursor cannot mix system and unit identity
const bad: UnitCursor<"mass"> = ["mass", "m"];
// @ts-expect-error custom system does not widen keys to string
custom.convert(1, "other", "one");
// @ts-expect-error extra source composite members are invalid
SpeedSI.convert(1, ["L/T", ["km", "h", "s"]], ["L/T", ["m", "s"]]);
// @ts-expect-error extra target composite members are invalid
SpeedSI.convert(1, ["L/T", ["km", "h"]], ["L/T", ["m", "s", "h"]]);
const energyConfig = {
  J: scalar({ name: "Joule", short: "J" }),
  "P*t": { steps: [parrot(PowerSI), multi(TimeSI)] } as IUnitCompositePrototype<[IUnitCompositeStep<typeof PowerSI>, IUnitCompositeStep<typeof TimeSI>]>,
  "V*A*t": { steps: [parrot(ElectricVoltageSI), multi(ElectricCurrentSI), multi(TimeSI)] } as IUnitCompositePrototype<[IUnitCompositeStep<typeof ElectricVoltageSI>, IUnitCompositeStep<typeof ElectricCurrentSI>, IUnitCompositeStep<typeof TimeSI>]>,
};
const energy = new UnitDefinition("energy-fixture", energyConfig, "J", "J", "Energy Fixture");
energy.convert(1, ["P*t", ["W", "h"]], "J");
energy.convert(3600, "J", ["V*A*t", ["V", "A", "h"]]);
// @ts-expect-error a composite key must stay bound to its own member tuple
energy.convert(1, ["P*t", ["V", "A", "h"]], "J");
// @ts-expect-error target composite variants cannot borrow another key's tuple
energy.convert(3600, "J", ["V*A*t", ["W", "h"]]);
// @ts-expect-error a step member cannot be an unspecified composite prototype
multi(energy).prev(1, "P*t");
// @ts-expect-error a carrier member needs a scalar key
parrot(energy).prev(1, "P*t");
// @ts-expect-error divisor members cannot be bare composite names
div(energy).next(1, "P*t");
const fuelConfig = {
  m3: scalar({ name: "Cubic Meter", short: "m3" }),
  "L*FC": { steps: [parrot(LengthSI), multi(FuelConsumptionSI)] } as IUnitCompositePrototype<[IUnitCompositeStep<typeof LengthSI>, IUnitCompositeStep<typeof FuelConsumptionSI>]>,
};
const fuelVolume = new UnitDefinition("fuel-volume", fuelConfig, "m3", "m3", "Fuel Volume");
fuelVolume.convert(100000, ["L*FC", ["m", "l/100km"]], "m3");
// @ts-expect-error composite member tuples admit scalar members only
fuelVolume.convert(100000, ["L*FC", ["m", "V/L"]], "m3");
parrot(FuelConsumptionSI, ["V/L", ["m3", "m"]]).prev(1, "l/100km");
// @ts-expect-error an explicit normalization unit needs a full composite tuple
multi(FuelConsumptionSI, "V/L");
// @ts-expect-error a normalization unit must belong to this exact system
multi(MassSI, "unregistered");
void [length, massCursor, speedCursor, bad, MassSI];
