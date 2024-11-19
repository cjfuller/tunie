<script lang="ts">
  import Nav from "../lib/nav.svelte";

  let {
    selectedItem,
    children,
  }: { selectedItem: "tuner" | "metronome" | "tuning-fork" | "settings"; children: any } = $props();
</script>

<div class="page-container">
  <div class="navbar-outer">
    <Nav {selectedItem} />
  </div>
  <div class="main-page">
    <div class="flexible-h-spacer"></div>
    <div class="main-container">
      {@render children?.()}
    </div>
    <div class="flexible-h-spacer"></div>
  </div>
</div>

<style>
  .page-container {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    height: 100vh;
    width: 100vw;
  }
  .main-container {
    padding-top: 16px;
    box-sizing: border-box;
    flex-grow: 1;
    flex-shrink: 0;
    max-width: 100%;
  }
  .main-page {
    flex-grow: 1;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    max-width: 100%;
  }
  .navbar-outer {
    flex-grow: 0;
  }
  .flexible-h-spacer {
    min-width: 8px;
    max-width: 48px;
    flex-grow: 10;
    flex-shrink: 1;
  }
</style>
