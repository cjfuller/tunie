<script>
  import "../lib/i18n.ts";
  import Nav from "../lib/nav.svelte";
  import { _ } from "svelte-i18n";
  import Container from "../lib/container.svelte";
</script>

<svelte:head>
  <title>Tunie - {$_("Tuner")}</title>
</svelte:head>

<Nav />
<Container>
  <div class="text">
    {$_("Coming soon")}
  </div>
</Container>

<style>
  .text {
    color: #9cb6f0;
  }
</style>
