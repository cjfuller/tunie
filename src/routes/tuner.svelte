<script>
  import "../lib/i18n.ts";
  import Nav from "../lib/nav.svelte";
  import {_} from "svelte-i18n";
  import Container from "../lib/container.svelte"
</script>

<svelte:head>
  <title>Tunie - {$_("Tuner")}</title>
</svelte:head>

<Nav/>
<Container>
  {$_("Coming soon")}
</Container>
