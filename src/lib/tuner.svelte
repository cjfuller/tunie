<script type="ts">
  import { _ } from "svelte-i18n";
  import Container from "./container.svelte";
  import { InputGroup, InputGroupText, Input, Button } from "sveltestrap";
    import { freqToPitchAndError } from "./sound-math";

  let baseFreqHz = 440;
  let listening = false;
  let audioContext: AudioContext | null = null;
  let frequency: number | null = null;
  let interval: number | null = null;
  let stream: MediaStream | null = null;
  let source: MediaStreamAudioSourceNode | null = null;
  let analyser: AnalyserNode | null = null;
  let dataArray: Uint8Array | null = null;
  $: bufferLength = analyser?.frequencyBinCount || null;
  $: freqConversion = frequency ? freqToPitchAndError(frequency, baseFreqHz) : null;
  $: pitchClass = freqConversion ? freqConversion[0] : null;
  $: modifier = freqConversion ? freqConversion[1] : null;
  $: err = freqConversion ? freqConversion[2] : null;
  $: sign = err != null ? (err >= 0 ? "+" : "") : null;

  const initializeListening = async () => {
    audioContext = new AudioContext();
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    source = audioContext.createMediaStreamSource(stream);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 32768;
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    source.connect(analyser);
  }

  const indexToFreq = (index: number): number => {
    if (audioContext == null || bufferLength == null) {
      return 0
    } else {
      return (index * audioContext.sampleRate) / (2 * bufferLength)
    }
  }

  const analyzeFrequency = (): number | null => {
    if (analyser == null || dataArray == null || bufferLength == null || audioContext == null) {
      return null;
    }

    analyser.getByteFrequencyData(dataArray);

    // Not great heuristic method for finding the dominant frequency.
    // TODO(colin): improve after doing some more reading.
    let maxes = [[-Infinity, -1], [-Infinity, -1], [-Infinity, -1]];

    for (let i = 0; i < bufferLength; i++) {
      if (dataArray[i] > maxes[0][0]) {
        maxes.push([dataArray[i], i]);
        maxes.sort(([val1,], [val2,]) => val1 - val2);
        maxes = maxes.slice(1);
      }
    }

    let total = 0;
    let totalWeight = 0;

    if (maxes.some(([val, idx]) => idx === -1)) {
      return null;
    }

    for (let [val, idx] of maxes) {
      total += val * indexToFreq(idx);
      totalWeight += val;
    }

    return total / totalWeight;
  };

  const beginListening = () => {
    listening = true;

    initializeListening().then(() => {
      interval = setInterval(() => {
        frequency = analyzeFrequency();
        
      }, 100) as unknown as number;
    })
  };

  const endListening = () => {
    listening = false;
    if (interval != null) {
      clearInterval(interval);
    }
    if (source != null) {
      source.disconnect();
      source = null;
    }
    if (analyser != null) {
      analyser.disconnect();
      analyser = null;
    }
    if (stream != null) {
      stream.getTracks().forEach((track) => track.stop());
      stream = null
    }
    dataArray = null;
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
      disabled={listening}
    />
    <InputGroupText class="manual-entry-component">Hz</InputGroupText>
  </InputGroup>
  <div class="spacer" />
  <Button
    class={listening ? "stop-button" : "play-button"}
    on:click={() => (listening ? endListening() : beginListening())}
  >
    {listening ? $_("Stop") : $_("Listen")}
  </Button>
  <div class="spacer" />
  <div class="frequency">
    {frequency ? `${Math.round(frequency)}Hz → ${pitchClass}${modifier} ${sign}${err}%` : ""}
  </div>
</Container>

<style>
  .spacer {
    height: 8px;
  }
  .frequency {
    color: #9cb7f0;
    font-size: 32px;
    font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, 'DejaVu Sans Mono', monospace;
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