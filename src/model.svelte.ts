import { random, tabulate } from "./util";

type Block = {
  color: number;
  id: number;
  row: number;
  col: number;
  component: number;
  slide: number;
};

let newId = (() => {
  let id = 0;
  return () => id++;
})();

export class Board {
  #width: number;
  #height: number;
  #grid: Block[];

  constructor(width: number, height: number, colorCount: number) {
    this.#width = width;
    this.#height = height;
    this.#grid = $state.raw(tabulate(width * height, i => ({
      color: random(0, colorCount),
      id: i,
      row: (i / width) | 0,
      col: i % width,
      component: -1,
      slide: 0,
    })));
    this.updateComponents();
  }

  get width() {
    return this.#width;
  }

  get height() {
    return this.#height;
  }

  blocks() {
    return this.#grid.filter(block => block.color !== -1).toSorted((a, b) => a.id - b.id)
  }

  removeComponent(comp: number) {
    let count = 0;
    for (const block of this.#grid) {
      if (block.component === comp) {
        block.color = -1;
        block.component = -1;
        count++;
      }
    }
    this.#grid = this.#grid.slice();
    return count;
  }

  updateComponents() {
    for (const block of this.#grid) {
      block.component = -1;
    }
    for (const block of this.#grid) {
      if (block.component !== -1) {
        continue;
      }
      let componentId = newId();
      const stack = [block];
      let size = 0;
      while (stack.length > 0) {
        const currentBlock = stack.pop()!;
        if (currentBlock.color !== block.color) {
          continue;
        }
        size += 1;
        currentBlock.component = componentId;
        let index = currentBlock.row * this.#width + currentBlock.col;

        if (currentBlock.row > 0 && this.#grid[index - this.#width].component === -1) {
          stack.push(this.#grid[index - this.#width]);
        }
        if (
          currentBlock.row < this.#height - 1 &&
          this.#grid[index + this.#width].component === -1
        ) {
          stack.push(this.#grid[index + this.#width]);
        }
        if (currentBlock.col > 0 && this.#grid[index - 1].component === -1) {
          stack.push(this.#grid[index - 1]);
        }
        if (currentBlock.col < this.#width - 1 && this.#grid[index + 1].component === -1) {
          stack.push(this.#grid[index + 1]);
        }
      }
      if (size <= 1) {
        block.component = -1;
      }
    }
    this.#grid = this.#grid.slice();
  }

  contract1() {
    let maxSlide = 0;
    for (let col = 0; col < this.#width; col++) {
      let bot = col;
      while (bot < this.#grid.length && this.#grid[bot].color !== -1) {
        bot += this.#width;
      }
      if (bot >= this.#grid.length) {
        continue;
      }
      let current = bot + this.#width;
      while (true) {
        while (current < this.#grid.length && this.#grid[current].color === -1) {
          current += this.#width;
        }
        if (current >= this.#grid.length) {
          break;
        }
        this.#grid[bot].color = this.#grid[current].color;
        this.#grid[bot].id = this.#grid[current].id;
        const slide = this.#grid[current].row - this.#grid[bot].row;
        this.#grid[bot].slide = slide;
        maxSlide = Math.max(maxSlide, slide);
        this.#grid[current].color = -1;
        bot += this.#width;
        current += this.#width;
      }
    }
    this.#grid = this.#grid.slice();
    return maxSlide;
  }

  contract2() {
    let left = 0;
    while (left < this.#width && this.#grid[left].color !== -1) {
      left++;
    }
    if (left >= this.#width) {
      return 0;
    }
    let maxSlide = 0;
    let current = left + 1;
    while (true) {
      while (current < this.#width && this.#grid[current].color === -1) {
        current++;
      }
      if (current >= this.#width) {
        break;
      }
      const slide = current - left;
      maxSlide = Math.max(maxSlide, slide);
      for (let delta = 0; delta < this.#grid.length; delta += this.#width) {
        this.#grid[left+delta].color = this.#grid[current+delta].color;
        this.#grid[left+delta].id = this.#grid[current+delta].id;
        this.#grid[left+delta].slide = slide;
        this.#grid[current+delta].color = -1;
      }
      left++;
      current++;
    }
    this.#grid = this.#grid.slice();
    return maxSlide;
  }
}