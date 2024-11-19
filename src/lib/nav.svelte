<script lang="ts">
  import { _, locale } from "svelte-i18n";
  import Navitem from "./navitem.svelte";
  const setLocale = (newLocale: string) => {
    window.localStorage.setItem("locale", newLocale);
    locale.set(newLocale);
  };
  let isOpen = false;
  // eslint-disable-next-lint no-explicit-any
  function handleUpdate(event: any) {
    isOpen = event.detail.isOpen;
  }

  let { selectedItem }: { selectedItem: "tuner" | "metronome" | "tuning-fork" | "settings" } = $props();
</script>

<div class="navbar">
  <Navitem
    label={$_("Tuner")}
    iconPath="/tuner_icon.svg"
    href="/tuner"
    selected={selectedItem === "tuner"}
  />
  <Navitem
    label={$_("Metronome")}
    iconPath="/metronome_icon.svg"
    href="/metronome"
    selected={selectedItem === "metronome"}
  />
  <Navitem
    label={$_("Tuning fork")}
    iconPath="/tuning_fork_icon.svg"
    href="/tuning-fork"
    selected={selectedItem === "tuning-fork"}
  />
  <div class="big-spacer"></div>
  <Navitem
    label={$_("Settings")}
    iconPath="/settings_icon.svg"
    href="/settings"
    selected={selectedItem === "settings"}
  />
  <div class="spacer"></div>
  <div class="pre-lang-spacer"></div>
  <div class="spacer"></div>
  <div class="locale" class:selected-locale={$locale === "en"}>
    <div onclick={() => setLocale("en")} onkeyup={(evt) => (evt.key === " ") ? setLocale("en") : null} role="button" tabindex="0">
      EN
    </div>
  </div>
  <div class="spacer"></div>
  <div class="locale" class:selected-locale={$locale === "fr"}>
    <div onclick={() => setLocale("fr")} onkeyup={(evt) => (evt.key === " ") ? setLocale("fr") : null} role="button" tabindex="0">
      FR
    </div>
  </div>
  <div class="spacer"></div>
</div>

<style>
  .spacer {
    height: 8px;
    width: 0px;
  }
  .locale {
    width: 100%;
    text-align: center;
  }
  .locale:hover { 
    cursor: pointer; 
  }
  .locale:not(.selected-locale):hover {
    background-color: #8faede;
    border-radius: 4px;
  }
  .selected-locale {
    background-color: #758fb9;
    border-radius: 4px;
  }
  :global(.navbar) {
    background-color: #9cb6f0;
    color: #1a2238 !important;
  }
  .big-spacer {
    flex-grow: 1;
    flex-shrink: 1;
    min-height: 0;
  }
  .pre-lang-spacer {
    height: 0;
    border: 1px solid #2c2c2c;
    box-sizing: border-box;
    margin-left: 4px;
    margin-right: 4px;
    width: calc(100% - 8px);
  }
  .navbar {
    height: 100vh;
    min-width: 60px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }
  :global(.button-item) {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
</style>
