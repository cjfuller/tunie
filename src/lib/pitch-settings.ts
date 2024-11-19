export const refPitchStorageKey = "base-pitch";
export const defaultPitchHz = "442";

export function getBasePitchHz(): number {
  return Number.parseInt(
    globalThis.localStorage?.getItem(refPitchStorageKey) ?? defaultPitchHz,
    10,
  );
}

export function setBasePitchHz(newValue: number) {
  window.localStorage.setItem(refPitchStorageKey, newValue.toString());
}
