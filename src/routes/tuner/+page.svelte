<script>
  import "../../lib/i18n.ts";
  import { _ } from "svelte-i18n";
  import Tuner from "../../lib/tuner.svelte";
</script>

<svelte:head>
  <title>Tunie - {$_("Tuner")}</title>
</svelte:head>

<Tuner />
