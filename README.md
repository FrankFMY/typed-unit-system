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

## Type and runtime boundaries

Unit keys, system cursors and exact composite tuple members/arity are checked at compile time. The carrier step is converted to canonical units before linear ratio steps are applied (and operations are inverted in reverse order), so dBm-as-power energy conversions work. Composite multiplication/division helpers require ratio-compatible units for their factor steps; do not use an affine/logarithmic factor as if it were a linear scale. JavaScript inputs and persisted cursors still need caller validation. This is not symbolic dimensional algebra or a parser for arbitrary unit strings; a numeric result is not branded with a dimension. Custom conversion functions and definitions are trusted configuration.

## Precision and calendar boundaries

Conversions use JavaScript `number`. Fixed-duration year and month units represent 365 days and 30 days respectively; they are duration conveniences, not calendar arithmetic. Applications requiring decimal-money guarantees, leap-aware dates, or uncertainty propagation should layer those rules above this package.

## Composite helper contracts

`parrot`, `multi` and `div` normalize scalar members against the system's canonical pivot, including systems such as fuel consumption whose canonical label is composite. Implicit normalization never passes nested composite tuples into scalar-only custom callbacks. An explicit normalization override accepts a scalar key or a fully specified composite tuple. Each member in a parent composite still names a scalar unit from that step's system: a bare composite name is not a usable member.

For custom composites, retain a tuple type with `IUnitCompositePrototype<[IUnitCompositeStep<typeof FirstSystem>, IUnitCompositeStep<typeof SecondSystem>]>`; a widened array cannot retain per-position keys and arity. Runtime conversion also checks arity. The first step carries the value (including supported affine/nonlinear conversion); later multiply/divide factors must be linear ratios. This is registered-unit safety, not a proof of physical dimensional consistency.

## Package status

Registry installation is available when the desired version has been published. [npm package](https://www.npmjs.com/package/@frankfmy/typed-unit-system) · [source](https://github.com/FrankFMY/typed-unit-system). ESM on Node.js 20+ or Bun 1.4+; conversion code has no platform dependencies.

```bash
npm install @frankfmy/typed-unit-system
```

Until approval, clone this repository, run `bun install --frozen-lockfile && bun run build`, then `npm pack` and install that tarball. Automatic release-triggered registry publication is not enabled.

## Development

```bash
bun install --frozen-lockfile
bun run verify
```

## Author

**Artem Prianishnikov**

- GitHub: https://github.com/FrankFMY
- Website: https://frankfmy.com
- Email: Pryanishnikovartem@gmail.com · frankfmy@proton.me
- Telegram: https://t.me/FrankFMY
- LinkedIn: https://www.linkedin.com/in/frankfmy/
- X: https://x.com/FrankFMY
- npm: https://www.npmjs.com/~frankfmy

## License

MIT © 2026 Artem Prianishnikov. See [LICENSE](LICENSE).
