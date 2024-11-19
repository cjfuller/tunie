<script lang="ts">
  import { _ } from "svelte-i18n";
  import Container from "./container.svelte";
  import { freqToPitchAndError } from "./sound-math";
  import { onDestroy, onMount } from "svelte";
  import { getBasePitchHz } from "./pitch-settings";
  import StartStopButton from "./start_stop_button.svelte";

  let baseFreqHz = $state(getBasePitchHz());
  let listening = $state(false);
  let audioContext: AudioContext | null = null;
  let frequency: number | null = $state(null);
  let interval: number | null = $state(null);
  let stream: MediaStream | null = $state(null);
  let source: MediaStreamAudioSourceNode | null = $state(null);
  let analyser: AnalyserNode | null = $state(null);
  let dataArray: Uint8Array | null = $state(null);
  let bufferLength: number | null = $state(null);
  let freqConversion = $derived(frequency ? freqToPitchAndError(frequency, baseFreqHz) : null);
  let pitchClass = $derived(freqConversion ? freqConversion[0] : null);
  let modifier = $derived(freqConversion ? freqConversion[1] : null);
  let err = $derived(freqConversion ? freqConversion[2] : null);
  let sign = $derived(err != null ? (err >= 0 ? "+" : "") : null);

  async function initializeListening(): Promise<void> {
    audioContext = new AudioContext();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 32768;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    const createdStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream = createdStream;
    if (audioContext && analyser) {
      source = audioContext.createMediaStreamSource(createdStream);
      source.connect(analyser);
    }
  }

  const indexToFreq = (index: number): number => {
    if (audioContext == null || bufferLength == null) {
      return 0;
    } else {
      return (index * audioContext.sampleRate) / (2 * bufferLength);
    }
  };

  const analyzeFrequency = (): number | null => {
    if (analyser == null || dataArray == null || bufferLength == null || audioContext == null) {
      return null;
    }

    analyser.getByteFrequencyData(dataArray);

    // Not great heuristic method for finding the dominant frequency.
    // Find the N higest frequency peaks, then take the one at the
    const N = 30;
    // TODO(colin): improve after doing some more reading.
    let maxes = [];
    for (let i = 0; i < Math.min(N, bufferLength / 10); i++) {
      maxes.push([-Infinity, -1]);
    }

    const W = 3;
    if (bufferLength <= W) {
      throw new Error("Sample rate too low to perform calculation.");
    }
    // The first element of the array is freq = 0, and the highest frequency is
    // sample rate / 2, which is usually at or above the limit of human hearing.
    // We skip the first W elements and last W elements for convenience, since
    // they are usually irrelevant anyway.
    for (let i = W; i < bufferLength - W; i++) {
      if (dataArray[i] > maxes[0][0]) {
        let isMax = true;
        for (let w = 1; w <= W; w++) {
          isMax = isMax && dataArray[i] > dataArray[i - w] && dataArray[i] > dataArray[i + w];
        }
        if (isMax) {
          maxes.push([dataArray[i], i]);
          maxes.sort(([val1], [val2]) => val1 - val2);
          maxes = maxes.slice(1);
        }
      }
    }

    let potentialFreqs = maxes.filter(([, idx]) => idx !== -1);
    if (potentialFreqs.length === 0) {
      return null;
    }
    const highestAmplitude = potentialFreqs[potentialFreqs.length - 1][0];
    // Filter to those peaks only that are > 50% of maximal amplitude.
    potentialFreqs = potentialFreqs.filter(([ampl]) => ampl > highestAmplitude / 2);
    // Find the lowest frequency of the remaining peaks, which is probably the fundamental.
    potentialFreqs.sort(([, idx1], [, idx2]) => idx1 - idx2);
    // However, we're still potentially off by an audible amount because of discretization error.
    // So we take the bins on either side of the fundamental too and do a weighted average.
    const peakIndex = potentialFreqs[0][1];
    let total = 0;
    let subBinIndex = 0;
    for (let i = -W; i <= W; i++) {
      total += dataArray[peakIndex + i];
      subBinIndex += (peakIndex + i) * dataArray[peakIndex + i];
    }
    subBinIndex /= total;
    return indexToFreq(subBinIndex);
  };

  const beginListening = () => {
    listening = true;

    initializeListening().then(() => {
      interval = setInterval(() => {
        frequency = analyzeFrequency();
      }, 100) as unknown as number;
    });
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
      stream = null;
    }
    dataArray = null;
  };

  // Is this necessary for prerendering or no?
  onMount(() => {
    baseFreqHz = getBasePitchHz();
  });
  onDestroy(endListening);
</script>

<Container selectedItem="tuner">
  <StartStopButton
    activeText={$_("Stop")}
    inactiveText={$_("Listen")}
    onActivate={beginListening}
    onDeactivate={endListening}
    bind:active={listening}
  />
  <div class="spacer"></div>
  <div class="pitch info">
    <span class:in-tune={Math.abs(err ?? 100) <= 3}
      >{frequency ? `${pitchClass}${modifier}` : ""}</span
    >
    <div class="spacer-h"></div>
    <span class="other-info">{frequency ? `${sign}${err}%` : ""}</span>
  </div>
  <div class="info other-info">
    {frequency ? `${Math.round(frequency)}Hz` : ""}
  </div>
</Container>

<style>
  .in-tune {
    color: #a4dd96;
    background-color: #4c6844;
  }
  .spacer-h {
    width: 16px;
  }
  .spacer {
    height: 8px;
  }
  .pitch {
    font-size: 72px;
    display: flex;
    flex-direction: row;
    align-items: baseline;
    justify-content: flex-start;
  }
  .other-info {
    font-size: 32px;
  }
  .info {
    color: #9cb7f0;
    font-family: ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Consolas,
      "DejaVu Sans Mono", monospace;
  }
</style>
