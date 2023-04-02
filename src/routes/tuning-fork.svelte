<script>
  import "../lib/i18n.ts";
  import Nav from "../lib/nav.svelte";
  import { _ } from "svelte-i18n";
  import TuningFork from "../lib/tuning_fork.svelte";
</script>

<svelte:head>
  <title>Tunie - {$_("Tuning fork")}</title>
</svelte:head>

<Nav />
<TuningFork />
