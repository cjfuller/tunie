<script lang="ts">
  let { label, min, max, value = $bindable(), disabled = false}: {label: string, min: number, max: number, value: number, disabled?: boolean} = $props();
</script>

<label class="label">
  {label}
  <input class="numeric" type=number min={min} max={max} bind:value={value} {disabled}>
</label>

<style>
  .label {
    color: #9cb6f0;
    background-color: #1a2238;
  }
  .numeric {
    border: 1px solid #9cb6f0;
    background-color: #1a2238;
    color: #9cb6f0;
    font-size: 1rem;
    box-sizing: border-box;
    margin-left: 0.2rem;
    border-radius: 2px;
  }
</style>