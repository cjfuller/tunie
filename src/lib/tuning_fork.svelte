<script type="ts">
  import {_} from "svelte-i18n";
  import Container from "../lib/container.svelte"
  import {InputGroup, InputGroupText, Input, ButtonGroup, Button} from "sveltestrap";
  import {calculateFreq} from "./sound-math.ts";
  let baseFreqHz = 440;
  let playing = false;
  let octave = 4;
  let pitch = "a";
  let mod = "\u266e";
  let sounds: OscillatorNode | null = null;
  let uaSearch = globalThis?.navigator?.userAgent?.indexOf("AppleWebKit");
  let uaIsWebkit = uaSearch != null && uaSearch != -1;

  const beginPlaying = () => {
    playing = true;
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContext();
    sounds = ctx.createOscillator();
    const freq = calculateFreq(baseFreqHz, pitch, mod, octave);
    sounds.frequency.value = freq;
    sounds.connect(ctx.destination);
    sounds.start();
  }
  const endPlaying = () => {
    sounds?.stop();
    sounds = null;
    playing = false;
  }
</script>

<Container>
  <InputGroup class="base-pitch">
    <InputGroupText>A4</InputGroupText>
    <Input type="number" min={400} max={460} step="1" bind:value={baseFreqHz} disabled={playing} />
    <InputGroupText>Hz</InputGroupText>
  </InputGroup>
  <div class="spacer"></div>
  <InputGroup class="base-pitch">
    <InputGroupText>{$_("Octave")}</InputGroupText>
    <Input type="number" min={0} max={10} step="1" bind:value={octave} disabled={playing} />
  </InputGroup>
  <div class="spacer"></div>
  <InputGroup>
    <InputGroupText>{$_("Pitch")}</InputGroupText>
    <ButtonGroup>
      {#each ["a", "b", "c", "d", "e", "f", "g"] as buttonPitch}
        <Button 
          color="light"
          active={buttonPitch === pitch}
          class={buttonPitch === pitch ? "pitch-button active-pitch" : "pitch-button"}
          disabled={playing}
          on:click={() => {pitch=buttonPitch}}
        >
          {$_(`pitches.${buttonPitch}`)}
        </Button>
      {/each}
    </ButtonGroup>
  </InputGroup>
  <div class="spacer"></div>
  <ButtonGroup>
    {#each ["\u266e", "\u266d", "\u266f"] as modifier}
      <Button
        color="light"
        active={modifier === mod}
        class={modifier === mod ? "pitch-button active-pitch" : "pitch-button"}
        disabled={playing}
        on:click={() => {mod = modifier}}
      >
        {modifier}
      </Button>
    {/each}
  </ButtonGroup>
  <div class="spacer"></div>
  <Button class={playing ? "stop-button" : "play-button"} on:click={ () => playing ? endPlaying() : beginPlaying() }>
    {playing ? $_("Stop") : $_("Play")}
  </Button>
  <div class="spacer"></div>
  {uaIsWebkit ? $_("iOSMessage") : ""}
</Container>

<style>
  :global(.base-pitch) {
    max-width: 300px;
  }
  :global(.active-pitch) {
    background-color: #9bd !important;
  }
  :global(.pitch-button) {
    border: 1px solid rgb(206, 212, 218) !important;
    border-collapse: collapse;
  }
  .spacer {
    height: 8px;
  }
  :global(.play-button) {
    background-color: #9db !important;
    color: #000 !important;
    border: none;
  }
  :global(.play-button:active) {
    background-color: #7b9 !important;
  }
  :global(.play-button:active:hover) {
    background-color: #7b9 !important;
  }
  :global(.play-button:hover) {
    background-color: #bfd !important;
    color: #000;
  }
  :global(.stop-button) {
    background-color: #d99 !important;
    color: #000 !important;
    border: none;
  }
  :global(.stop-button:active) {
    background-color: #b77 !important;
  }
  :global(.stop-button:active:hover) {
    background-color: #b77 !important;
  }
  :global(.stop-button:hover) {
    background-color: #fbb !important;
    color: #000;
  }
</style>