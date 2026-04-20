<script lang="ts">
  import type { Config } from "../types";
  import Dialog from "./Dialog.svelte";

  type Props = {
    config: Config
    closeDialog: () => void
    newGame: (config: Config) => void
  }
  let { config, closeDialog, newGame }: Props = $props();

  let config2 = $derived(config);

  const setColor = (colorCount: number) => {
    config2 = { ...config2, colorCount };
  }
</script>

<Dialog
  title="Nouvelle Partie"
  onCancel={closeDialog}
  onOk={() => newGame(config2)}
>
  <div class="container">
    <div class="title">Dimensions</div>
    <div class="buttons">
      {#each ["10x10", "15x15", "20x20"] as dims}
        <button
          //class={{toggled: color === config2.colorCount}}
          //onclick={() => setColor(color)}
        > 
          {dims}
        </button>
      {/each}
    </div>
    <div class="title">Nombre de couleurs</div>
    <div class="buttons">
      {#each [3, 4, 5] as color}
        <button
          class={{toggled: color === config2.colorCount}}
          onclick={() => setColor(color)}
        > 
          {color}
        </button>
      {/each}
    </div>
  </div>
</Dialog>

<style>
  button {
    padding-left: 1rem;
    padding-right: 1rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;

    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;

    color: rgb(55, 65, 81);
    background-color: transparent;

    border: 1px solid rgb(31, 41, 55);
    &.toggled {
      background-color: rgba(253, 224, 71, 0.5);
    }
  }

  .container {
    display: grid;
    grid-template-columns: 30% 70%;
    gap: 2rem;
  }

  .title {
    font-weight: bold;
    font-size: 1.125rem;
    line-height: 1.75rem;
  }

  .buttons {
    display: flex;
    gap: 1rem;
    font-size: 1.125rem;
    line-height: 1.75rem;
    height: 3rem;
  }
</style>