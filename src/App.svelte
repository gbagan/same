<script lang="ts">
  import { Board } from "./model.svelte";
  import BoardView from "./components/Board.svelte";
  import Button from "./components/Button.svelte";
  import NewGame from './components/NewGame.svelte';
  import type { Config } from "./types";
  import { delay } from "./util";

  const SLIDE_DURATION = 250;

  let deletedComponent = $state(-2);
  let score = $state(0);
  let isMoving = $state(false);
  let colorCount = $state(4);
  let board = $state(new Board(20, 10, 4));
  let dialogEl: HTMLDialogElement = $state()!;

  let config = $derived({colorCount});

  function openNewGameDialog() {
    if (isMoving) {
      return;
    }
    dialogEl.showModal();
  }

  function newGame(config: Config) {
    board = new Board(20, 10, config.colorCount);
    dialogEl.close();
  }

  async function removeComponent(comp: number) {
    if (isMoving || comp === -1) {
      return;
    }
    isMoving = true;
    deletedComponent = comp;
    await delay(500);
    const removedCount = board.removeComponent(comp);
    score += (removedCount - 2) ** 2;
    let maxSlide = board.contract1();
    await delay(SLIDE_DURATION * maxSlide+100);
    let maxSlide2 = board.contract2();
    board.updateComponents();
    await delay(SLIDE_DURATION * maxSlide2+100);
    isMoving = false;
  }
</script>

<div class="container">
  <div>
    <Button onclick={openNewGameDialog}>Nouvelle partie</Button>
    Score: {score}
  </div>
  <BoardView {board} {deletedComponent} {removeComponent} />
</div>
<dialog bind:this={dialogEl}>
  <NewGame
    config={config}
    closeDialog={() => dialogEl.close()}
    newGame={newGame}
  />
</dialog>

<style>
  .container {
    width: 100%;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }
</style>
