<script lang="ts">
  let {
    active = $bindable(),
    activeText,
    inactiveText,
    onActivate,
    onDeactivate,
  }: {
    active: boolean;
    activeText: string;
    inactiveText: string;
    onActivate: () => void;
    onDeactivate: () => void;
  } = $props();
</script>

<button
  class="button"
  class:stop-button={active}
  class:play-button={!active}
  onclick={() => (active ? onDeactivate() : onActivate())}
>
  {active ? activeText : inactiveText}
</button>

<style>
  .button {
    margin-left: 1px;
    box-sizing: border-box;
    border-radius: 8px;
    padding: 18px;
    font-size: 2rem;
    min-width: 180px;
    width: calc(min(max(180px, 100% - 16px), 427px));
    max-width: 427px;
    font-family: inherit !important;
  }
  .button:hover {
    cursor: pointer;
  }
  .play-button {
    color: #a4dd96 !important;
    border: 1px solid #a4dd96 !important;
    background-color: #1a2238 !important;
    border: none;
  }
  .play-button:active {
    background-color: #4c6844 !important;
  }
  .play-button:active:hover {
    background-color: #4c6844 !important;
  }
  .play-button:hover {
    background-color: #34502c !important;
    color: #1a2238;
  }
  .play-button:focus {
    background-color: #34502c !important;
    color: #1a2238;
  }
  .stop-button {
    background-color: #1a2238 !important;
    color: #d67278 !important;
    border: 1px solid #d67278 !important;
    border: none;
  }
  .stop-button:active {
    background-color: #5c3438 !important;
  }
  .stop-button:active:hover {
    background-color: #5c3438 !important;
  }
  .stop-button:hover {
    background-color: #3e1c22 !important;
    color: #000;
  }
  .stop-button:focus {
    background-color: #3e1c22 !important;
    color: #000;
  }
</style>
