/** String keys only. */
export type KEYS<T> = keyof T extends infer Key ? (Key extends string ? Key : never) : never;

/** Remove tuple/object members whose inferred value is never. */
export type NeverKeysFilterType<T> = {
  [K in keyof T as T[K] extends never ? never : K]: T[K];
};
