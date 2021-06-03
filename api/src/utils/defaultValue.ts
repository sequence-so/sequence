export function defaultValue<T>(
  value: T,
  defaultValue: NonNullable<T>
): NonNullable<T> {
  if (typeof value === "undefined") {
    return defaultValue;
  }
  return value as NonNullable<T>;
}
