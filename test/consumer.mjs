import assert from "node:assert/strict";
import { MassSI, TemperatureSI, SpeedSI, EnergySI, DensitySI, ElectricChargeSI, FuelConsumptionSI, DataRateSI, TimeSI, LengthSI, parrot, multi, div, UnitDefinition, scalar, getUnitSystem, unitSystems, unitSystemKeys } from "@frankfmy/typed-unit-system";
const close = (actual, expected) => assert.ok(Math.abs(actual - expected) <= 1e-8 * Math.max(1, Math.abs(expected)), `${actual} != ${expected}`);
assert.equal(MassSI.convert(2.5, "kg", "g"), 2500);
close(TemperatureSI.convert(100, "C", "F"), 212);
close(TemperatureSI.convert(-40, "F", "C"), -40);
close(SpeedSI.convert(36, ["L/T", ["km", "h"]], ["L/T", ["m", "s"]]), 10);
close(EnergySI.convert(1, ["P*t", ["kW", "h"]], "J"), 3600000);
close(EnergySI.convert(30, ["P*t", ["dBm", "h"]], "J"), 3600);
close(EnergySI.convert(3600, "J", ["P*t", ["dBm", "h"]]), 30);
close(DensitySI.convert(1, ["m/V", ["g", "cm3"]], ["m/V", ["kg", "m3"]]), 1000);
close(ElectricChargeSI.convert(1, ["A*t", ["A", "h"]], "C"), 3600);
close(FuelConsumptionSI.convert(10, "l/100km", ["V/L", ["m3", "m"]]), 1e-7);
assert.equal(DataRateSI.convert(1, ["B/t", ["MB", "s"]], ["B/t", ["KB", "s"]]), 1024);
assert.equal(TimeSI.convert(1, "y", "d"), 365);
assert.equal(TimeSI.convert(1, "mo", "d"), 30);
assert.equal(getUnitSystem("mass"), unitSystems.mass);
assert.ok(unitSystemKeys.includes("temperature"));
const custom = new UnitDefinition("widget", { one: scalar({ name: "One", short: "w" }), thousand: scalar({ name: "Thousand", short: "kw" }, 1000) }, "one", "one", "Widgets");
assert.equal(custom.convert(2, "thousand", "one"), 2000);
assert.throws(() => DensitySI.convert(1, ["m/V", ["kg"]], ["m/V", ["kg", "m3"]]), /arity/);
const ratioClose = (actual, expected) => assert.ok(Number.isFinite(actual) && Math.abs(actual - expected) <= Math.abs(expected) * 1e-12, `${actual} != ${expected}`);
ratioClose(parrot(FuelConsumptionSI).prev(1, "l/100km"), 0.001 / 100000);
ratioClose(multi(FuelConsumptionSI).prev(100000, "l/100km"), 0.001);
ratioClose(div(FuelConsumptionSI).next(1, "l/100km"), 0.001 / 100000);
ratioClose(multi(LengthSI, "cm").prev(1, "m"), 100);
const fuelVolume = new UnitDefinition("fuel-volume", {
  m3: scalar({ name: "Cubic Meter", short: "m3" }),
  l: scalar({ name: "Liter", short: "l" }, 0.001),
  "L*FC": { steps: [parrot(LengthSI), multi(FuelConsumptionSI)] },
}, "L*FC", "m3", "Fuel Volume");
ratioClose(fuelVolume.convert(100000, ["L*FC", ["m", "l/100km"]], "m3"), 0.001);
ratioClose(multi(fuelVolume).prev(1000, "l"), 1);
ratioClose(parrot(fuelVolume).prev(1000, "l"), 1);
const customFuelStep = { def: FuelConsumptionSI, prev: (v, key) => v * FuelConsumptionSI.getPrototype(key).to(1), next: (v, key) => v / FuelConsumptionSI.getPrototype(key).to(1) };
const customFuelVolume = new UnitDefinition("custom-fuel", { m3: scalar({ name: "Cubic Meter", short: "m3" }), l: scalar({ name: "Liter", short: "l" }, 0.001), "L*FC": { steps: [parrot(LengthSI), customFuelStep] } }, "L*FC", ["L*FC", ["km", "l/100km"]], "Fuel Volume");
ratioClose(customFuelVolume.convert(100, customFuelVolume.default, "m3"), 0.001);
ratioClose(parrot(customFuelVolume).prev(1000, "l"), 1);
ratioClose(multi(customFuelVolume).prev(1000, "l"), 1);
ratioClose(div(customFuelVolume).next(1000, "l"), 1);
console.log("installed scalar/affine/composite/custom/registry conversions: PASS");
