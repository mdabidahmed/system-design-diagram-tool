export type ClassValue = string | number | false | null | undefined;

/** Tiny, dependency-free classnames joiner. */
export function cx(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
