type PitchClass = "a" | "b" | "c" | "d" | "e" | "f" | "g";
type Modifier = "\u266e" | "\u266d" | "\u266f";

export const pitchClassHalfSteps = (pitch: PitchClass): number => {
  switch (pitch) {
    case "c":
      return 0;
    case "d":
      return 2;
    case "e":
      return 4;
    case "f":
      return 5;
    case "g":
      return 7;
    case "a":
      return 9;
    case "b":
      return 11;
  }
};

export const modifierHalfSteps = (modifier: Modifier): number => {
  switch (modifier) {
    case "\u266d":
      return -1;
    case "\u266e":
      return 0;
    case "\u266f":
      return 1;
  }
};

export const halfSteps = (pitch: PitchClass, modifier: Modifier, octave: number): number =>
  12 * octave + pitchClassHalfSteps(pitch) + modifierHalfSteps(modifier);

export const calculateFreq = (
  baseFreq: number,
  pitch: PitchClass,
  modifier: Modifier,
  octave: number,
): number =>
  baseFreq * Math.pow(2, (halfSteps(pitch, modifier, octave) - halfSteps("a", "\u266e", 4)) / 12.0);
