<script>
  import "../../lib/i18n.ts";
  import { _ } from "svelte-i18n";
  import Metronome from "../../lib/metronome.svelte";
</script>

<svelte:head>
  <title>Tunie - {$_("Metronome")}</title>
</svelte:head>

<Metronome />
