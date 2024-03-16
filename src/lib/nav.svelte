<script lang="ts">
  import { _, locale } from "svelte-i18n";
  import { Navbar, NavbarBrand, Nav, NavItem, NavLink, Collapse, NavbarToggler } from "@sveltestrap/sveltestrap";
  const setLocale = (newLocale: string) => {
    window.localStorage.setItem("locale", newLocale);
    locale.set(newLocale);
  };
  let isOpen = false;
  function handleUpdate(event: any) {
    isOpen = event.detail.isOpen;
  }
</script>

<Navbar light class="navbar" expand="md">
  <NavbarBrand>Tunie</NavbarBrand>
  <NavbarToggler on:click={() => (isOpen = !isOpen)} />
  <Collapse {isOpen} navbar expand="md" on:update={handleUpdate}>
    <Nav class="ms-auto" navbar>
      <NavItem>
        <NavLink href="/tuner">
          {$_("Tuner")}
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="/metronome">
          {$_("Metronome")}
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="/tuning-fork">
          {$_("Tuning fork")}
        </NavLink>
      </NavItem>
      <NavItem class="button-item">
        <button on:click={() => setLocale("en")}>EN</button>
      </NavItem>
      <NavItem class="button-item">
        <button on:click={() => setLocale("fr")}>FR</button>
      </NavItem>
    </Nav>
  </Collapse>
</Navbar>

<style>
  :global(.navbar) {
    background-color: #9cb6f0;
    color: #1a2238 !important;
  }
  button {
    font-family: Seravek, "Gill Sans Nova", Ubuntu, Calibri, "DejaVu Sans", source-sans-pro,
      sans-serif;
    font-size: 16px;
    color: #1a2238 !important;
    background-color: #9cb6f0;
    border: none;
    padding: none;
  }
  button:hover {
    cursor: pointer;
  }
  :global(.button-item) {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
</style>
