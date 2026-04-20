<script lang="ts">
  import type { Board } from "../model.svelte";

  type Props = {
    board: Board;
    deletedComponent: number;
    removeComponent: (comp: number) => void;
  }
  
  let { board, deletedComponent, removeComponent }: Props = $props();
  let blocks = $derived(board.blocks());

  const SLIDE_DURATION = 250;

  let selectedComponent = $state(-1);

  function selectComponent(idx: number) {
    selectedComponent = idx;
  }

  const blockColors = ["#0000FF", "red", "#008000", "yellow", "purple"];
  const borderColors = ["#0000BB", "#BB0000", "#006000", "orange", "black"];
</script>

<main>
  <svg viewBox="0 0 2000 1000">
    {#each blocks as { color, id, row, col, component, slide } (id)}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <rect
        class="block"
        style:transform="translate({col * 100}px, {(9 - row) * 100}px)"
        style:opacity={deletedComponent === component ? "0" : "1"}
        fill={blockColors[color]}
        stroke={borderColors[color]}
        filter={selectedComponent === component && component !== -1
          ? "brightness(1.5)"
          : "none"}
        style:transition="opacity 500ms linear, transform {SLIDE_DURATION * slide}ms linear"
        onclick={() => removeComponent(component)}
        onpointerenter={() => selectComponent(component)}
        onpointerleave={() => selectComponent(-1)}
      />
    {/each}
  </svg>
</main>

<style>
  main {
    width: 1000px;
    height: 500px;
    border: solid brown 15px;
  }
  
  .block {
    x: 7px;
    y: 7px;
    width: 85px;
    height: 85px;
    stroke-width: 10;
  }
</style>
