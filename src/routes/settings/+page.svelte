<script>
  import "../../lib/i18n.ts";
  import { _ } from "svelte-i18n";
  import Settings from "../../lib/settings.svelte";
</script>

<svelte:head>
  <title>Tunie - {$_("Settings")}</title>
</svelte:head>

<Settings />
