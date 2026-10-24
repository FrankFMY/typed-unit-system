# Changelog

## 0.1.1

- Convert nonlinear carrier units before applying composite ratio steps, and invert the operations in reverse order.
- Preserve exact composite tuple arity and key/member correlation across custom composite variants; reject unspecified composite member keys.
- Resolve composite canonical units in carrier/multiply/divide helpers, including fuel-consumption factors and custom canonical-composite systems without changing scalar callback keys, while preserving explicit normalization overrides.
- Qualify installed scalar, affine, composite, custom-system and registry behavior.
- Verify positive inference and 16 rejected unit/cursor/tuple/member uses in a separate TypeScript consumer.
- Clarify numeric/type/runtime boundaries and add package/contact links; underlying unit constants are unchanged.

## 0.1.0

- Initial public source release.
- Scalar and affine unit conversions.
- Typed composite multiplication and division.
- Built-in physical, electrical, data, and operational unit systems.
- Typed registry and persisted cursor model.
- Explicit malformed-composite boundary checks.
