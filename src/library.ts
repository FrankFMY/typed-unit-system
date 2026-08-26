/**
 * Библиотека готовых систем единиц измерения (СИ-ориентированных).
 *
 * Каждая система определяется как `UnitDefinition` + сопутствующий тип `IUnitD<typeof ...>`.
 *
 * @remarks
 * Конструкция типа `satisfies Record<string, IUnitScalarPrototype>` или `as IUnitCompositePrototype<[IUnitCompositeStep<typeof X>, ...]>`,
 * используются **намеренно**. Без этого TypeScript теряет точные ключи и все цепочки типов `CompositeArgs / IUnit` разваливаются.
 *
 * @see UnitDefinition
 * @see IUnit
 */

import type { IUnitCompositePrototype, IUnitCompositeStep, IUnitD, IUnitScalarPrototype } from "./definition.js";
import { UnitDefinition } from "./definition.js";
import { div, multi, parrot, scalar } from "./utils.js";

const PercentUnits = {
	p: scalar({ name: "Percent", short: "%" }),
} satisfies Record<string, IUnitScalarPrototype>;
export const PercentSI = new UnitDefinition("percent", PercentUnits, "p", "p", "Percent");
export type PercentD = IUnitD<typeof PercentSI>;

const QuantityUnits = {
	q: scalar({ name: "Items", short: "pcs" }),
} satisfies Record<string, IUnitScalarPrototype>;
export const QuantitySI = new UnitDefinition("quantity", QuantityUnits, "q", "q", "Items");
export type QuantityD = IUnitD<typeof QuantitySI>;

// --- Время (с) ---
const TimeUnits = {
	y: scalar({ name: "Years (365 days)", short: "yr" }, 31_536_000),
	mo: scalar({ name: "Months (30 days)", short: "mo" }, 2_592_000),
	week: scalar({ name: "Weeks", short: "wk" }, 604_800),
	d: scalar({ name: "Days", short: "d" }, 86_400),
	h: scalar({ name: "Hours", short: "h" }, 3_600),
	min: scalar({ name: "Minutes", short: "min" }, 60),
	s: scalar({ name: "Seconds", short: "s" }),
	ms: scalar({ name: "Milliseconds", short: "ms" }, 0.001),
	us: scalar({ name: "Microseconds", short: "μs" }, 1e-6),
	ns: scalar({ name: "Nanoseconds", short: "ns" }, 1e-9),
} satisfies Record<string, IUnitScalarPrototype>;
export const TimeSI = new UnitDefinition("time", TimeUnits, "s", "min", "Time");
export type TimeD = IUnitD<typeof TimeSI>;

// --- Масса (кг) ---
const MassUnits = {
	kt: scalar({ name: "Kilotons", short: "kt" }, 1_000_000),
	t: scalar({ name: "Metric tons", short: "t" }, 1_000),
	kg: scalar({ name: "Kilograms", short: "kg" }),
	g: scalar({ name: "Grams", short: "g" }, 0.001),
	mg: scalar({ name: "Milligrams", short: "mg" }, 1e-6),
	ug: scalar({ name: "Micrograms", short: "μg" }, 1e-9),
	lb: scalar({ name: "Pounds", short: "lb" }, 0.45359237),
	oz: scalar({ name: "Ounces", short: "oz" }, 0.02834952),
	st: scalar({ name: "Stone", short: "st" }, 6.35029),
	ct: scalar({ name: "Carats", short: "ct" }, 0.0002),
} satisfies Record<string, IUnitScalarPrototype>;
export const MassSI = new UnitDefinition("mass", MassUnits, "kg", "kg", "Mass");
export type MassD = IUnitD<typeof MassSI>;

// --- Длина (м) ---
const LengthUnits = {
	km: scalar({ name: "Kilometers", short: "km" }, 1_000),
	m: scalar({ name: "Meters", short: "m" }),
	cm: scalar({ name: "Centimeters", short: "cm" }, 0.01),
	mm: scalar({ name: "Millimeters", short: "mm" }, 0.001),
	um: scalar({ name: "Micrometers", short: "μm" }, 1e-6),
	nm: scalar({ name: "Nanometers", short: "nm" }, 1e-9),
	mi: scalar({ name: "Miles", short: "mi" }, 1_609.344),
	yd: scalar({ name: "Yards", short: "yd" }, 0.9144),
	ft: scalar({ name: "Feet", short: "ft" }, 0.3048),
	in: scalar({ name: "Inches", short: "in" }, 0.0254),
	nmi: scalar({ name: "Nautical miles", short: "nmi" }, 1_852),
} satisfies Record<string, IUnitScalarPrototype>;
export const LengthSI = new UnitDefinition("length", LengthUnits, "m", "m", "Length");
export type LengthD = IUnitD<typeof LengthSI>;

// --- Температура (Кельвин) ---
const TemperatureUnits = {
	K: scalar({ name: "Kelvin", short: "K" }),
	C: { name: "Celsius", short: "°C", from: (v) => v - 273.15, to: (v) => v + 273.15 },
	F: { name: "Fahrenheit", short: "°F", from: (v) => ((v - 273.15) * 9) / 5 + 32, to: (v) => ((v - 32) * 5) / 9 + 273.15 },
} satisfies Record<string, IUnitScalarPrototype>;
export const TemperatureSI = new UnitDefinition("temperature", TemperatureUnits, "K", "C", "Temperature");
export type TemperatureD = IUnitD<typeof TemperatureSI>;

// --- Площадь (м²) ---
const AreaUnits = {
	km2: scalar({ name: "Square kilometers", short: "km²" }, 1e6),
	h: scalar({ name: "Hectares", short: "ha" }, 10_000),
	ac: scalar({ name: "Acres", short: "ac" }, 4_046.85642),
	m2: scalar({ name: "Square meters", short: "m²" }),
	cm2: scalar({ name: "Square centimeters", short: "cm²" }, 0.0001),
	mm2: scalar({ name: "Square millimeters", short: "mm²" }, 1e-6),
	ft2: scalar({ name: "Square feet", short: "ft²" }, 0.092903),
	in2: scalar({ name: "Square inches", short: "in²" }, 0.00064516),
	sot: scalar({ name: "Ares", short: "a" }, 100),
} satisfies Record<string, IUnitScalarPrototype>;
export const AreaSI = new UnitDefinition("area", AreaUnits, "m2", "m2", "Area");
export type AreaD = IUnitD<typeof AreaSI>;

// --- Объём (м³) ---
const VolumeUnits = {
	km3: scalar({ name: "Cubic kilometers", short: "km³" }, 1e9),
	m3: scalar({ name: "Cubic meters", short: "m³" }),
	cm3: scalar({ name: "Cubic centimeters", short: "cm³" }, 1e-6),
	mm3: scalar({ name: "Cubic millimeters", short: "mm³" }, 1e-9),
	dm3: scalar({ name: "Cubic decimeters (liters)", short: "dm³ (L)" }, 0.001),
	ml: scalar({ name: "Milliliters", short: "mL" }, 1e-6),
	gal: scalar({ name: "US gallons", short: "US gal" }, 0.00378541),
	bbl: scalar({ name: "Oil barrels", short: "bbl" }, 0.158987),
	ft3: scalar({ name: "Cubic feet", short: "ft³" }, 0.0283168),
	in3: scalar({ name: "Cubic inches", short: "in³" }, 1.6387e-5),
} satisfies Record<string, IUnitScalarPrototype>;
export const VolumeSI = new UnitDefinition("volume", VolumeUnits, "m3", "dm3", "Volume");
export type VolumeD = IUnitD<typeof VolumeSI>;

// --- Сила тока (А) ---
const ElectricCurrentUnits = {
	MA: scalar({ name: "Megaamperes", short: "MA" }, 1_000_000),
	kA: scalar({ name: "Kiloamperes", short: "kA" }, 1_000),
	A: scalar({ name: "Amperes", short: "A" }),
	mA: scalar({ name: "Milliamperes", short: "mA" }, 0.001),
	uA: scalar({ name: "Microamperes", short: "μA" }, 1e-6),
} satisfies Record<string, IUnitScalarPrototype>;
export const ElectricCurrentSI = new UnitDefinition("electric-current", ElectricCurrentUnits, "A", "A", "Electric Current");
export type ElectricCurrentD = IUnitD<typeof ElectricCurrentSI>;

// --- Напряжение (В) ---
const ElectricVoltageUnits = {
	MV: scalar({ name: "Megavolts", short: "MV" }, 1_000_000),
	kV: scalar({ name: "Kilovolts", short: "kV" }, 1_000),
	V: scalar({ name: "Volts", short: "V" }),
	mV: scalar({ name: "Millivolts", short: "mV" }, 0.001),
	uV: scalar({ name: "Microvolts", short: "μV" }, 1e-6),
} satisfies Record<string, IUnitScalarPrototype>;
export const ElectricVoltageSI = new UnitDefinition("electric-voltage", ElectricVoltageUnits, "V", "V", "Electric Voltage");
export type ElectricVoltageD = IUnitD<typeof ElectricVoltageSI>;

// --- Сопротивление (Ом) ---
const ElectricResistanceUnits = {
	TOhm: scalar({ name: "Teraohms", short: "TΩ" }, 1e12),
	GOhm: scalar({ name: "Gigaohms", short: "GΩ" }, 1e9),
	MOhm: scalar({ name: "Megaohms", short: "MΩ" }, 1_000_000),
	kOhm: scalar({ name: "Kiloohms", short: "kΩ" }, 1_000),
	Ohm: scalar({ name: "Ohms", short: "Ω" }),
	mOhm: scalar({ name: "Milliohms", short: "mΩ" }, 0.001),
	uOhm: scalar({ name: "Microohms", short: "μΩ" }, 1e-6),
} satisfies Record<string, IUnitScalarPrototype>;
export const ElectricResistanceSI = new UnitDefinition("electric-resistance", ElectricResistanceUnits, "Ohm", "Ohm", "Electric Resistance");
export type ElectricResistanceD = IUnitD<typeof ElectricResistanceSI>;

// --- Емкость (Фарад) ---
const ElectricCapacitanceUnits = {
	F: scalar({ name: "Farads", short: "F" }),
	mF: scalar({ name: "Millifarads", short: "mF" }, 0.001),
	uF: scalar({ name: "Microfarads", short: "μF" }, 1e-6),
	nF: scalar({ name: "Nanofarads", short: "nF" }, 1e-9),
	pF: scalar({ name: "Picofarads", short: "pF" }, 1e-12),
} satisfies Record<string, IUnitScalarPrototype>;
export const ElectricCapacitanceSI = new UnitDefinition("electric-capacitance", ElectricCapacitanceUnits, "F", "uF", "Electric Capacitance");
export type ElectricCapacitanceD = IUnitD<typeof ElectricCapacitanceSI>;

// --- Заряд (Кулон) ---
const ElectricChargeUnits = {
	C: scalar({ name: "Coulombs", short: "C" }),
	kC: scalar({ name: "Kilocoulombs", short: "kC" }, 1_000),
	mC: scalar({ name: "Millicoulombs", short: "mC" }, 0.001),
	uC: scalar({ name: "Microcoulombs", short: "μC" }, 1e-6),
	nC: scalar({ name: "Nanocoulombs", short: "nC" }, 1e-9),
	pC: scalar({ name: "Picocoulombs", short: "pC" }, 1e-12),
	"A*t": {
		steps: [parrot(ElectricCurrentSI), multi(TimeSI)],
	} as IUnitCompositePrototype<[IUnitCompositeStep<typeof ElectricCurrentSI>, IUnitCompositeStep<typeof TimeSI>]>,
};
export const ElectricChargeSI = new UnitDefinition("electric-charge", ElectricChargeUnits, "C", ["A*t", ["mA", "h"]], "Electric Charge");
export type ElectricChargeD = IUnitD<typeof ElectricChargeSI>;

// --- Мощность (Вт) ---
const PowerUnits = {
	TW: scalar({ name: "Terawatts", short: "TW" }, 1e12),
	GW: scalar({ name: "Gigawatts", short: "GW" }, 1e9),
	MW: scalar({ name: "Megawatts", short: "MW" }, 1e6),
	kW: scalar({ name: "Kilowatts", short: "kW" }, 1_000),
	W: scalar({ name: "Watts", short: "W" }),
	mW: scalar({ name: "Milliwatts", short: "mW" }, 0.001),
	hp: scalar({ name: "Metric horsepower", short: "PS" }, 735.49875),
	hp_imp: scalar({ name: "Mechanical horsepower", short: "hp" }, 745.7),
	dBm: {
		name: "Decibel-milliwatts",
		short: "dBm",
		from: (v) => 10 * Math.log10(v / 0.001),
		to: (v) => 10 ** (v / 10) * 0.001,
	},
} satisfies Record<string, IUnitScalarPrototype>;
export const PowerSI = new UnitDefinition("power", PowerUnits, "W", "kW", "Power");
export type PowerD = IUnitD<typeof PowerSI>;

// --- Данные / Информация (Байт) ---
const DataUnits = {
	B: scalar({ name: "Bytes", short: "B" }),
	KB: scalar({ name: "Kibibytes", short: "KiB" }, 1024),
	MB: scalar({ name: "Mebibytes", short: "MiB" }, 1024 ** 2),
	GB: scalar({ name: "Gibibytes", short: "GiB" }, 1024 ** 3),
	TB: scalar({ name: "Tebibytes", short: "TiB" }, 1024 ** 4),
	PB: scalar({ name: "Pebibytes", short: "PiB" }, 1024 ** 5),
	bit: scalar({ name: "Bits", short: "bit" }, 0.125),
	Kbit: scalar({ name: "Kibibits", short: "Kibit" }, 1024 * 0.125),
	Mbit: scalar({ name: "Mebibits", short: "Mibit" }, 1024 ** 2 * 0.125),
	Gbit: scalar({ name: "Gibibits", short: "Gibit" }, 1024 ** 3 * 0.125),
} satisfies Record<string, IUnitScalarPrototype>;
export const DataSI = new UnitDefinition("data", DataUnits, "B", "MB", "Data");
export type DataD = IUnitD<typeof DataSI>;

// --- Угол (Радиан) ---
const AngleUnits = {
	rad: scalar({ name: "Radians", short: "rad" }),
	deg: scalar({ name: "Degrees", short: "°" }, Math.PI / 180),
	grad: scalar({ name: "Gradians", short: "grad" }, Math.PI / 200),
	rev: scalar({ name: "Revolutions", short: "rev" }, 2 * Math.PI),
} satisfies Record<string, IUnitScalarPrototype>;
export const AngleSI = new UnitDefinition("angle", AngleUnits, "rad", "deg", "Angle");
export type AngleD = IUnitD<typeof AngleSI>;

// --- Давление (Па) ---
const PressureUnits = {
	GPa: scalar({ name: "Gigapascals", short: "GPa" }, 1e9),
	MPa: scalar({ name: "Megapascals", short: "MPa" }, 1e6),
	kPa: scalar({ name: "Kilopascals", short: "kPa" }, 1_000),
	Pa: scalar({ name: "Pascals", short: "Pa" }),
	bar: scalar({ name: "Bars", short: "bar" }, 100_000),
	mbar: scalar({ name: "Millibars", short: "mbar" }, 100),
	atm: scalar({ name: "Atmospheres", short: "atm" }, 101_325),
	mmHg: scalar({ name: "Millimeters of mercury", short: "mmHg" }, 133.322),
	psi: scalar({ name: "Pounds per square inch", short: "psi" }, 6894.76),
} satisfies Record<string, IUnitScalarPrototype>;
export const PressureSI = new UnitDefinition("pressure", PressureUnits, "Pa", "kPa", "Pressure");
export type PressureD = IUnitD<typeof PressureSI>;

// ============================================================================
// СОСТАВНЫЕ СИСТЕМЫ (COMPOSITE SYSTEMS)
// ============================================================================

// --- Энергия (Джоуль) ---
const EnergyUnits = {
	"P*t": {
		steps: [parrot(PowerSI), multi(TimeSI)],
	} as IUnitCompositePrototype<[IUnitCompositeStep<typeof PowerSI>, IUnitCompositeStep<typeof TimeSI>]>,
	J: scalar({ name: "Joules", short: "J" }),
	kJ: scalar({ name: "Kilojoules", short: "kJ" }, 1_000),
	MJ: scalar({ name: "Megajoules", short: "MJ" }, 1e6),
	GJ: scalar({ name: "Gigajoules", short: "GJ" }, 1e9),
	cal: scalar({ name: "Calories", short: "cal" }, 4.184),
	kcal: scalar({ name: "Kilocalories", short: "kcal" }, 4184),
	Gcal: scalar({ name: "Gigacalories", short: "Gcal" }, 4.184e9),
};
export const EnergySI = new UnitDefinition("energy", EnergyUnits, "J", ["P*t", ["kW", "h"]], "Energy");
export type EnergyD = IUnitD<typeof EnergySI>;

// --- Скорость (м/с) ---
const SpeedUnits = {
	"L/T": {
		steps: [parrot(LengthSI), div(TimeSI)],
	} as IUnitCompositePrototype<[IUnitCompositeStep<typeof LengthSI>, IUnitCompositeStep<typeof TimeSI>]>,
};
export const SpeedSI = new UnitDefinition("speed", SpeedUnits, "L/T", ["L/T", ["km", "h"]], "Speed");
export type SpeedD = IUnitD<typeof SpeedSI>;

// --- Расход Топлива (м³/м) ---
const FuelConsumptionUnits = {
	"V/L": {
		steps: [parrot(VolumeSI), div(LengthSI)],
	} as IUnitCompositePrototype<[IUnitCompositeStep<typeof VolumeSI>, IUnitCompositeStep<typeof LengthSI>]>,
	"l/100km": {
		name: "Liters per 100 kilometers",
		short: "L/100km",
		from: (v) => v / 1e-8,
		to: (v) => v * 1e-8,
	} satisfies IUnitScalarPrototype,
};
export const FuelConsumptionSI = new UnitDefinition("fuel-consumption", FuelConsumptionUnits, "V/L", ["V/L", ["dm3", "km"]], "Fuel Consumption");
export type FuelConsumptionD = IUnitD<typeof FuelConsumptionSI>;

// --- Плотность (кг/м³) ---
const DensityUnits = {
	"m/V": {
		steps: [parrot(MassSI), div(VolumeSI)],
	} as IUnitCompositePrototype<[IUnitCompositeStep<typeof MassSI>, IUnitCompositeStep<typeof VolumeSI>]>,
};
export const DensitySI = new UnitDefinition("density", DensityUnits, "m/V", ["m/V", ["kg", "m3"]], "Density");
export type DensityD = IUnitD<typeof DensitySI>;

// --- Скорость передачи данных (Байт/с) ---
const DataRateUnits = {
	"B/t": {
		steps: [parrot(DataSI), div(TimeSI)],
	} as IUnitCompositePrototype<[IUnitCompositeStep<typeof DataSI>, IUnitCompositeStep<typeof TimeSI>]>,
};
export const DataRateSI = new UnitDefinition("data-rate", DataRateUnits, "B/t", ["B/t", ["MB", "s"]], "Data Rate");
export type DataRateD = IUnitD<typeof DataRateSI>;
