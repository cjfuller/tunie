<script lang="ts">
  import { _ } from "svelte-i18n";
  import Container from "../lib/container.svelte";
  import { InputGroup, InputGroupText, Input, ButtonGroup, Button } from "@sveltestrap/sveltestrap";
  import { calculateFreq } from "./sound-math.ts";
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
  };
  const endPlaying = () => {
    sounds?.stop();
    sounds = null;
    playing = false;
  };
</script>

<Container>
  <InputGroup class="manual-entry">
    <InputGroupText class="manual-entry-component">A4</InputGroupText>
    <Input
      class="manual-entry-component"
      type="number"
      min={400}
      max={460}
      step="1"
      bind:value={baseFreqHz}
      disabled={playing}
    />
    <InputGroupText class="manual-entry-component">Hz</InputGroupText>
  </InputGroup>
  <div class="spacer" />
  <InputGroup class="manual-entry">
    <InputGroupText class="manual-entry-component">{$_("Octave")}</InputGroupText>
    <Input
      class="manual-entry-component"
      type="number"
      min={0}
      max={10}
      step="1"
      bind:value={octave}
      disabled={playing}
    />
  </InputGroup>
  <div class="spacer" />
  <InputGroup>
    <InputGroupText class="multi-button">{$_("Pitch")}</InputGroupText>
    <ButtonGroup>
      {#each ["a", "b", "c", "d", "e", "f", "g"] as buttonPitch}
        <Button
          color="light"
          active={buttonPitch === pitch}
          class={buttonPitch === pitch ? "multi-button active-multi-button" : "multi-button"}
          disabled={playing}
          on:click={() => {
            pitch = buttonPitch;
          }}
        >
          {$_(`pitches.${buttonPitch}`)}
        </Button>
      {/each}
    </ButtonGroup>
  </InputGroup>
  <div class="spacer" />
  <ButtonGroup>
    {#each ["\u266e", "\u266d", "\u266f"] as modifier}
      <Button
        color="light"
        active={modifier === mod}
        class={modifier === mod ? "multi-button active-multi-button" : "multi-button"}
        disabled={playing}
        on:click={() => {
          mod = modifier;
        }}
      >
        {modifier}
      </Button>
    {/each}
  </ButtonGroup>
  <div class="spacer" />
  <Button
    class={playing ? "stop-button" : "play-button"}
    on:click={() => (playing ? endPlaying() : beginPlaying())}
  >
    {playing ? $_("Stop") : $_("Play")}
  </Button>
  <div class="spacer" />
  {uaIsWebkit ? $_("iOSMessage") : ""}
</Container>

<style>
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
