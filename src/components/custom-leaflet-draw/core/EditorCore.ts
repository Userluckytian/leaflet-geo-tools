// 核心抽象：历史栈和吸附占位实现
export type Point = [number, number];

export class HistoryStack<T = any> {
  private stack: T[] = [];
  private index = -1;

  push(state: T) {
    // 丢弃 redo 状态
    this.stack = this.stack.slice(0, this.index + 1);
    this.stack.push(state);
    this.index = this.stack.length - 1;
  }

  undo(): T | null {
    if (this.index <= 0) return null;
    this.index -= 1;
    return this.stack[this.index];
  }

  redo(): T | null {
    if (this.index >= this.stack.length - 1) return null;
    this.index += 1;
    return this.stack[this.index];
  }

  current(): T | null {
    return this.index >= 0 ? this.stack[this.index] : null;
  }
}

export class SnappingManager {
  // 最小可用实现：基于固定网格吸附
  private gridSize: number;
  constructor(gridSize = 0.0001) {
    this.gridSize = gridSize;
  }

  snapLngLat(lng: number, lat: number): [number, number] {
    const gx = Math.round(lng / this.gridSize) * this.gridSize;
    const gy = Math.round(lat / this.gridSize) * this.gridSize;
    return [gx, gy];
  }
}
