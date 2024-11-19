<script lang="ts">
  let {
    label,
    iconPath,
    href,
    selected,
  }: {
    label: string;
    iconPath: string;
    href: string;
    selected: boolean;
  } = $props();
</script>

<div class="item-container">
  <a {href} class="nav-link" class:selected={selected}>
    <div class="nav-button">
      <img alt={`${label} icon`} src={iconPath} height="32" width="32" />
      <span class="caption">
        {label}
      </span>
    </div>
  </a>
</div>

<style>
  .item-container {
    width: 100%;
  }
  .selected {
    background-color: #758fb9;
    border-radius: 4px;
  }
  .caption {
    font-size: 0.7rem;
  }
  .nav-link {
    width: 100%;
    padding: 0 !important;
    display: inline-block;
    text-decoration: none;
  }
  .nav-link:not(.selected):hover {
    background-color: #8faede;
    border-radius: 4px;
  }
  .nav-button {
    width: 100%;
    padding-left: 4px;
    padding-right: 4px;
    /* margin: 4px; */
    margin-top: 8px;
    margin-bottom: 8px;
    display: flex;
    box-sizing: border-box;
    /* border: 2px solid #2c2c2c; */
    flex-direction: column;
    align-items: center;
    /* border-radius: 8px; */
  }
</style>
