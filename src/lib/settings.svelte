<script>
  import Container from "./container.svelte";

  import { _ } from "svelte-i18n";
  import { getBasePitchHz, setBasePitchHz } from "./pitch-settings";
  import NumericInput from "./numeric_input.svelte";

  let basePitch = $state(getBasePitchHz());
  $effect(() => {
    setBasePitchHz(basePitch);
  });
</script>

<Container selectedItem="settings">
  <div class="settings">
    <div>
      <NumericInput label={$_("Base pitch")} min={220} max={880} bind:value={basePitch} /> Hz
    </div>
    <div class="big-spacer"></div>
    <div class="footer">
      {$_("Made with love")} <a href="https://github.com/cjfuller/tunie">{$_("open source")}</a>.
    </div>
    <div class="spacer"></div>
  </div>
</Container>

<style>
  .settings {
    background-color: #1a2238;
    color: #9cb6f0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    height: 100%;
  }
  .spacer {
    height: 8px;
  }
  .big-spacer {
    flex-grow: 1;
    flex-shrink: 1;
    width: 0;
    min-height: 0;
  }
  .footer {
    border-top: 1px solid #9cb6f0;
    padding-top: 8px;
    box-sizing: border-box;
  }
</style>
