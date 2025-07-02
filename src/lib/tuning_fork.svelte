<script lang="ts">
  import { _ } from "svelte-i18n";
  import Container from "../lib/container.svelte";
  import { calculateFreq } from "./sound-math.ts";
  import type { PitchClass, Modifier } from "./sound-math.ts";
  import { onDestroy, onMount } from "svelte";
  import MultiButton from "./multi_button.svelte";
  import StartStopButton from "./start_stop_button.svelte";
    import { isiOS } from "./detect-ios.ts";
    import { getBasePitchHz } from "./pitch-settings.ts";
  let playing = $state(false);
  let octave = $state(4);
  let pitch: PitchClass = $state("a");
  let mod: Modifier = $state("\u266e");
  let baseFreqHz = $state(getBasePitchHz());
  let sounds: OscillatorNode | null = null;
  let uaSearch = globalThis?.navigator?.userAgent?.indexOf("AppleWebKit");
  let uaIsWebkit = uaSearch != null && uaSearch != -1;

  const beginPlaying = () => {
    playing = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContext();
    sounds = ctx.createOscillator();
    const freq = calculateFreq(baseFreqHz, pitch, mod, octave);
    sounds.frequency.value = freq;
    sounds.connect(ctx.destination);
    sounds.start();
  };
  const endPlaying = () => {
    sounds?.stop();
    sounds = null;
    playing = false;
  };
  function changeItem<T>(newItem: T, getter: () => T, setter: (newItem: T) => void) {
    let restart = false;
    if (newItem !== getter() && playing) {
      restart = true;
      endPlaying();
    }
    setter(newItem);
    if (restart) {
      beginPlaying();
    }
  }
  const changePitch = (newItem: PitchClass) =>
    changeItem(
      newItem,
      () => pitch,
      (newPitch) => {
        pitch = newPitch;
      },
    );
  const changeMod = (newItem: Modifier) =>
    changeItem(
      newItem,
      () => mod,
      (newMod) => {
        mod = newMod;
      },
    );
  const changeOctave = (newItem: number) =>
    changeItem(
      newItem,
      () => octave,
      (newOctave) => {
        octave = newOctave;
      },
    );
  const allPitches: PitchClass[] = ["a", "b", "c", "d", "e", "f", "g"];
  const allMods: Modifier[] = ["\u266e", "\u266d", "\u266f"];
  onDestroy(endPlaying);
  // Is this necessary for prerendering or no?
  onMount(() => {
    baseFreqHz = getBasePitchHz();
  });
</script>

<Container selectedItem="tuning-fork">
  <div class="main-container">
    <StartStopButton
      activeText={$_("Stop")}
      inactiveText={$_("Play")}
      onActivate={beginPlaying}
      onDeactivate={endPlaying}
      bind:active={playing}
    />
    <div class="spacer"></div>
    <MultiButton
      label={$_("Pitch")}
      options={allPitches}
      onChange={changePitch}
      bind:selectedOption={pitch}
    />
    <div class="spacer"></div>
    <MultiButton
      label={$_("Modifier")}
      options={allMods}
      onChange={changeMod}
      bind:selectedOption={mod}
    />
    <div class="spacer"></div>
    <MultiButton
      label={$_("Octave")}
      options={[2, 3, 4, 5, 6]}
      onChange={changeOctave}
      bind:selectedOption={octave}
    />
    <div class="spacer"></div>
    {isiOS() ? $_("iOSMessage") : ""}
  </div>
</Container>

<style>
  .main-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
  }
  :global(.manual-entry) {
    max-width: 317px;
  }
  :global(.manual-entry-component) {
    border: 1px solid #9cb6f0 !important;
    background-color: #1a2238;
    color: #9cb6f0;
  }
  :global(.manual-entry-component:disabled) {
    border: 1px solid #9cb6f0 !important;
    background-color: #1a2238;
    color: #9cb6f0;
  }
  :global(.manual-entry-component:focus) {
    border: 1px solid #9cb6f0 !important;
    background-color: #1a2238;
    color: #9cb6f0;
  }
  :global(.active-multi-button) {
    background-color: #9cb6f0 !important;
    color: #1a2238 !important;
  }
  :global(.active-multi-button:focus) {
    background-color: #9cb6f0 !important;
    color: #1a2238 !important;
  }
  :global(.multi-button) {
    border: 1px solid #9cb6f0 !important;
    background-color: #1a2238;
    color: #9cb6f0;
    border-collapse: collapse;
  }
  :global(.multi-button:disabled) {
    border: 1px solid #9cb6f0 !important;
    background-color: #1a2238;
    color: #9cb6f0;
    border-collapse: collapse;
  }
  :global(.multi-button:hover) {
    background-color: #31384c !important;
    color: #9cb6f0;
  }
  :global(.multi-button:focus) {
    background-color: #31384c !important;
    color: #9cb6f0;
  }
  .spacer {
    height: 8px;
  }
  :global(.play-button) {
    color: #a4dd96 !important;
    border: 1px solid #a4dd96 !important;
    background-color: #1a2238 !important;
    border: none;
  }
  :global(.play-button:active) {
    background-color: #4c6844 !important;
  }
  :global(.play-button:active:hover) {
    background-color: #4c6844 !important;
  }
  :global(.play-button:hover) {
    background-color: #34502c !important;
    color: #1a2238;
  }
  :global(.play-button:focus) {
    background-color: #34502c !important;
    color: #1a2238;
  }
  :global(.stop-button) {
    background-color: #1a2238 !important;
    color: #d67278 !important;
    border: 1px solid #d67278 !important;
    border: none;
  }
  :global(.stop-button:active) {
    background-color: #5c3438 !important;
  }
  :global(.stop-button:active:hover) {
    background-color: #5c3438 !important;
  }
  :global(.stop-button:hover) {
    background-color: #3e1c22 !important;
    color: #000;
  }
  :global(.stop-button:focus) {
    background-color: #3e1c22 !important;
    color: #000;
  }
</style>
