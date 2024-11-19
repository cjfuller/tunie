<script lang="ts" generics="T">
  let {
    label,
    options,
    onChange,
    selectedOption = $bindable(),
  }: {
    label: string;
    options: T[];
    selectedOption: T;
    onChange: (newValue: T) => void;
  } = $props();
</script>

<div class="outer-container">
  <div class="group-container">
    <fieldset>
      <legend>{label}</legend>
      <div class="button-container">
        {#each options as option}
          <button
            class="button-item"
            class:active-button={selectedOption === option}
            class:inactive-button={selectedOption !== option}
            onclick={() => onChange(option)}
            >{option}
          </button>
        {/each}
      </div>
    </fieldset>
  </div>
  <div class="h-grow"></div>
</div>

<style>
  .outer-container {
    max-width: calc(100% - 2 * 8px);
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
  }
  .group-container {
    background-color: #1a2238;
    color: #9cb6f0;
    flex-grow: 0;
  }
  .h-grow {
    flex-grow: 1;
  }
  .button-container {
    display: flex;
    flex-direction: row;
    align-items: baseline;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  .inactive-button {
    background-color: #1a2238;
    color: #9cb6f0;
  }
  .active-button {
    color: #1a2238;
    background-color: #9cb6f0;
  }
  .button-item {
    min-width: 48px;
    min-height: 48px;
    border: 1px solid #9cb6f0;
    text-align: center;
    font-family: inherit !important;
    font-size: 1rem;
    display: flex-inline;
    align-items: center;
    justify-content: center;
    box-sizing: content-box;
    /* Simulates a "border-collapse" look. */
    margin-top: -1px;
    margin-left: -1px;
  }
  .button-item:hover {
    cursor: pointer;
  }
  fieldset {
    border-color: #9cb6f0;
  }
</style>
