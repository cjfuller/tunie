export type PitchClass = "a" | "b" | "c" | "d" | "e" | "f" | "g";
export type Modifier = "\u266e" | "\u266d" | "\u266f";

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

export const freqToHalfSteps = (freq: number, baseFreq: number): number =>
  12 * Math.log2(freq / baseFreq);

export const freqToPitchAndError = (
  freq: number,
  baseFreq: number,
): [PitchClass, Modifier, number] => {
  let halfStepsFrac = freqToHalfSteps(freq, baseFreq);
  while (halfStepsFrac < 0) {
    halfStepsFrac += 12;
  }
  const halfSteps = Math.round(halfStepsFrac);
  const err = halfStepsFrac - halfSteps;
  let pitchClass: PitchClass = "a";
  let modifier: Modifier = "\u266e";
  switch (halfSteps % 12) {
    case 0:
      pitchClass = "a";
      break;
    case 1:
      if (err < 0) {
        pitchClass = "a";
        modifier = "\u266f";
      } else {
        pitchClass = "b";
        modifier = "\u266d";
      }
      break;
    case 2:
      pitchClass = "b";
      break;
    case 3:
      pitchClass = "c";
      break;
    case 4:
      if (err < 0) {
        pitchClass = "c";
        modifier = "\u266f";
      } else {
        pitchClass = "d";
        modifier = "\u266d";
      }
      break;
    case 5:
      pitchClass = "d";
      break;
    case 6:
      if (err < 0) {
        pitchClass = "d";
        modifier = "\u266f";
      } else {
        pitchClass = "e";
        modifier = "\u266d";
      }
      break;
    case 7:
      pitchClass = "e";
      break;
    case 8:
      pitchClass = "f";
      break;
    case 9:
      if (err < 0) {
        pitchClass = "f";
        modifier = "\u266f";
      } else {
        pitchClass = "g";
        modifier = "\u266d";
      }
      break;
    case 10:
      pitchClass = "g";
      break;
    case 11:
      if (err < 0) {
        pitchClass = "g";
        modifier = "\u266f";
      } else {
        pitchClass = "a";
        modifier = "\u266d";
      }
      break;
  }
  return [pitchClass, modifier, Math.round(err * 100)];
};
