<script type="ts">
  import { _ } from "svelte-i18n";
  import Container from "../lib/container.svelte";
  import { InputGroup, InputGroupText, Input, ButtonGroup, Button } from "sveltestrap";
  let tempo = 60;
  let playing = false;
  let interval: number | null = null;
  let uaSearch = globalThis?.navigator?.userAgent?.indexOf("AppleWebKit");
  let uaIsWebkit = uaSearch != null && uaSearch != -1;

  function createClick(ctx: AudioContext) {
    // Create an oscillator and a gain node
    const oscillator = ctx.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.value = 880;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.001);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.015);

    const highPassFilter = ctx.createBiquadFilter();
    highPassFilter.type = "highpass";
    highPassFilter.frequency.value = 800;

    oscillator.connect(gainNode);
    gainNode.connect(highPassFilter);
    highPassFilter.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.02);
  }

  const beginPlaying = () => {
    playing = true;
    const audioContext = new AudioContext();
    createClick(audioContext);
    interval = setInterval(() => createClick(audioContext), 60000 / tempo) as unknown as number;
  };

  const endPlaying = () => {
    playing = false;
    if (interval != null) {
      clearInterval(interval);
    }
  };
</script>

<Container>
  <InputGroup class="manual-entry">
    <InputGroupText class="manual-entry-component">{"\u2669 = "}</InputGroupText>
    <Input
      class="manual-entry-component"
      type="number"
      min={10}
      max={300}
      step="1"
      bind:value={tempo}
      disabled={playing}
    />
  </InputGroup>
  <div class="spacer" />
  <InputGroup>
    <ButtonGroup>
      {#each [45, 60, 80, 90, 100, 120, 140] as fixedTempo}
        <Button
          color="light"
          active={fixedTempo === tempo}
          class={fixedTempo === tempo ? "multi-button active-multi-button" : "multi-button"}
          on:click={() => {
            tempo = fixedTempo;
            if (playing) {
              endPlaying();
              beginPlaying();
            }
          }}
        >
          {fixedTempo}
        </Button>
      {/each}
    </ButtonGroup>
  </InputGroup>
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
    background-color: #31384c;
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
