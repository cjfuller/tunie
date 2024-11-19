<script>
  import "../../lib/i18n.ts";
  import { _ } from "svelte-i18n";
  import TuningFork from "../../lib/tuning_fork.svelte";
</script>

<svelte:head>
  <title>Tunie - {$_("Tuning fork")}</title>
</svelte:head>

<TuningFork />
