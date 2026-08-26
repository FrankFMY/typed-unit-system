# Typed Unit System

A zero-runtime-dependency TypeScript library for type-safe scalar, affine, and composite unit conversion.

I built this library for applications where unit identities must remain explicit in types while runtime conversion still supports practical systems such as energy, density, data rate, electric charge, speed, and fuel consumption.

## Highlights

- literal-key inference for every unit system;
- scalar linear conversions;
- affine conversions such as Celsius, Fahrenheit, and Kelvin;
- composite multiplication and division;
- explicit runtime rejection of malformed composite tuples;
- one typed registry for lookup and persisted unit cursors;
- English display metadata and stable symbols;
- no runtime dependencies.

## Included systems

- percent and quantity;
- time, mass, length, area, and volume;
- temperature and pressure;
- electric current, voltage, resistance, capacitance, charge, and power;
- data size and data rate;
- angle, energy, speed, density, and fuel consumption.

## Example

```ts
import {
  DensitySI,
  ElectricChargeSI,
  SpeedSI,
  TemperatureSI,
} from "@frankfmy/typed-unit-system";

TemperatureSI.convert(100, "C", "F"); // 212

SpeedSI.convert(
  36,
  ["L/T", ["km", "h"]],
  ["L/T", ["m", "s"]],
); // 10

DensitySI.convert(
  1,
  ["m/V", ["g", "cm3"]],
  ["m/V", ["kg", "m3"]],
); // 1000

ElectricChargeSI.convert(
  1,
  ["A*t", ["A", "h"]],
  "C",
); // 3600
```

## Registry API

```ts
import {
  getUnitSystem,
  unitSystemKeys,
  unitSystems,
  type UnitCursor,
} from "@frankfmy/typed-unit-system";

const cursor: UnitCursor<"mass"> = ["mass", "kg"];
const mass = getUnitSystem("mass");
const grams = mass.convert(2.5, "kg", "g");
```

## Defining a custom system

```ts
import {
  UnitDefinition,
  scalar,
  type IUnitScalarPrototype,
} from "@frankfmy/typed-unit-system";

const CurrencyUnits = {
  base: scalar({ name: "Base unit", short: "BASE" }),
  kilo: scalar({ name: "Thousand base units", short: "kBASE" }, 1_000),
} satisfies Record<string, IUnitScalarPrototype>;

const CurrencySI = new UnitDefinition(
  "currency-example",
  CurrencyUnits,
  "base",
  "base",
  "Currency Example",
);
```

## Precision and calendar boundaries

Conversions use JavaScript `number`. Fixed-duration year and month units represent 365 days and 30 days respectively; they are duration conveniences, not calendar arithmetic. Applications requiring decimal-money guarantees, leap-aware dates, or uncertainty propagation should layer those rules above this package.

## Package status

The GitHub repository is public. Registry publication is intentionally deferred; the npm package remains marked private until a separate release gate is completed.

## Development

```bash
bun install --frozen-lockfile
bun run verify
```

## Author

**Artem Prianishnikov**

- GitHub: https://github.com/FrankFMY
- Website: https://frankfmy.com
- Email: Pryanishnikovartem@gmail.com

## License

MIT © 2026 Artem Prianishnikov. See [LICENSE](LICENSE).
