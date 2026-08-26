import { describe, expect, test } from "bun:test";
import {
  DataRateSI,
  DensitySI,
  ElectricChargeSI,
  FuelConsumptionSI,
  MassSI,
  PowerSI,
  SpeedSI,
  TemperatureSI,
  TimeSI,
  getUnitSystem,
  unitSystemKeys,
} from "../src/index.js";

describe("typed unit system", () => {
  test("converts scalar units and preserves round trips", () => {
    expect(MassSI.convert(1, "kg", "g")).toBe(1_000);
    expect(MassSI.convert(2.20462, "lb", "kg")).toBeCloseTo(1, 2);
    expect(MassSI.convert(MassSI.convert(1.5, "t", "mg"), "mg", "t")).toBeCloseTo(1.5, 5);
    expect(TimeSI.convert(1, "h", "s")).toBe(3_600);
  });

  test("supports affine temperature conversion", () => {
    expect(TemperatureSI.convert(0, "C", "K")).toBe(273.15);
    expect(TemperatureSI.convert(100, "C", "F")).toBe(212);
    expect(TemperatureSI.convert(-40, "F", "C")).toBe(-40);
  });

  test("converts composite units", () => {
    expect(DensitySI.convert(1, ["m/V", ["g", "cm3"]], ["m/V", ["kg", "m3"]])).toBe(1_000);
    expect(ElectricChargeSI.convert(1, ["A*t", ["A", "h"]], "C")).toBe(3_600);
    expect(ElectricChargeSI.convert(3_600, "C", ["A*t", ["A", "h"]])).toBe(1);
    expect(SpeedSI.convert(36, ["L/T", ["km", "h"]], ["L/T", ["m", "s"]])).toBeCloseTo(10, 8);
    expect(DataRateSI.convert(1, ["B/t", ["MB", "s"]], ["B/t", ["KB", "s"]])).toBe(1_024);
  });

  test("rejects malformed composite unit tuples with an explicit boundary error", () => {
    expect(() => DensitySI.convert(1, ["m/V", ["kg"]] as never, ["m/V", ["kg", "m3"]])).toThrow("arity");
    expect(() => DensitySI.convert(1, ["m/V", ["kg", "m3"]], ["m/V", ["kg"]] as never)).toThrow("arity");
  });

  test("exposes a complete English metadata registry", () => {
    expect(unitSystemKeys).toContain("mass");
    expect(getUnitSystem("mass").tag).toBe("Mass");
    expect(getUnitSystem("mass").getPrototype("kg")).toMatchObject({ name: "Kilograms", short: "kg" });
    expect(getUnitSystem("temperature").getPrototype("C")).toMatchObject({ name: "Celsius", short: "°C" });
  });

  test("supports domain-friendly convenience units", () => {
    expect(PowerSI.convert(30, "dBm", "W")).toBeCloseTo(1, 8);
    expect(PowerSI.convert(1, "W", "dBm")).toBeCloseTo(30, 8);
    expect(FuelConsumptionSI.convert(10, "l/100km", ["V/L", ["m3", "m"]])).toBeCloseTo(1e-7, 12);
  });
});
