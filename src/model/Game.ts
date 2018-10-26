export interface ICoord {
  y: number;
  x: number;
}

export enum GameStatus {
  INPROGRESS = 'INPROGRESS',
  WIN = 'WIN',
  LOSE = 'LOSE',
}

export enum Tile {
  BOMB = 'BOMB',
  LOSINGBOMB = 'LOSINGBOMB',
  FLAG = 'FLAG',
  BLANK = 'BLANK',
  UNKNOWN = 'UNKNOWN',
}

export interface IBombMap {
  readonly [coord: string]: ICoord;
}

export type GameTiles = ReadonlyArray<ReadonlyArray<Tile | number>>;

export class Game {
  public readonly height: number;
  public readonly width: number;
  public readonly startTime: number = Date.now();
  private _tiles: GameTiles;
  private _status: GameStatus = GameStatus.INPROGRESS;
  private _endTime?: number;
  private _flags: number;
  private readonly bombs: IBombMap;

  constructor(height: number, width: number, bombCount: number) {
    if (bombCount > (height * width)) {
      throw new Error('Cannot have more bombs that tiles');
    }

    this.height = height;
    this.width = width;
    this.bombs = this.createBombs(height, width, bombCount);
    this._tiles = this.initializeTiles(height, width);
    this._flags = bombCount;
  }

  public get tiles(): GameTiles {
    return this._tiles;
  }

  public get status(): GameStatus {
    return this._status;
  }

  public get endTime(): number | undefined {
    return this._endTime;
  }

  public get flags(): number {
    return this._flags;
  }

  public sweepCell(y: number, x: number, hasSwept: { [coord: string]: boolean } = {}): void {
    const coord = this.toCoord(y, x);

    if (hasSwept[coord]) {
      return;
    } else {
      hasSwept[coord] = true;
    }

    if (this.bombs[coord]) {
      return this.gameOver(y, x);
    }

    const bombCount = this.getBombCount(y, x);

    if (bombCount) {
      this.setTile(y, x, bombCount);
    } else {
      this.setTile(y, x, Tile.BLANK);

      this.getSiblingCoordinates(y, x)
        .forEach((sibling) => this.sweepCell(sibling.y, sibling.x, hasSwept));
    }

    this.checkStatus();
  }

  public toggleFlag(y: number, x: number): void {
    const tile = this.tiles[y][x];

    if (tile === Tile.UNKNOWN && this._flags > 0) {
      this.setTile(y, x, Tile.FLAG);
      this._flags--;
    } else if (tile === Tile.FLAG) {
      this.setTile(y, x, Tile.UNKNOWN);
      this._flags++;
    }

    this.checkStatus();
  }

  private initializeTiles(height: number, width: number): GameTiles {
    return new Array(height).fill(new Array(width).fill(Tile.UNKNOWN));
  }

  private createBombs(height: number, width: number, bombCount: number): IBombMap {
    const bombs = {};
    while (Object.keys(bombs).length < bombCount) {
      const y = Math.floor(Math.random() * height);
      const x = Math.floor(Math.random() * width);
      const bomb = { y, x };
      const coord = this.toCoord(bomb.y, bomb.x);
      if (bombs.hasOwnProperty(coord)) {
        continue;
      }
      bombs[coord] = bomb;
    }
    return bombs;
  }

  private toCoord(y: number, x: number): string {
    return `${y}:${x}`;
  }

  private setTile(y: number, x: number, value: Tile | number): void {
    this._tiles = this._tiles.map((row, ty) => row.map((t, tx) => ty === y && tx === x ? value : t));
  }

  private setStatus(status: GameStatus): void {
    this._status = status;
    if (status === GameStatus.WIN || status === GameStatus.LOSE) {
      this._endTime = Date.now();
    }
  }

  private checkStatus(): void {
    if (this.tiles.every((row, y) => row.every((tile, x) =>
      !(tile === Tile.UNKNOWN || (tile === Tile.FLAG && !this.bombs[this.toCoord(y, x)]))
    ))) {
      this.setStatus(GameStatus.WIN);
    }
  }

  private getBombCount(y: number, x: number): number {
    return this.getSiblingCoordinates(y, x).reduce((bombCount, { y: sy, x: sx }) => {
      return this.bombs[this.toCoord(sy, sx)] ? bombCount + 1 : bombCount;
    }, 0);
  }

  private gameOver(y: number, x: number): void {
    this.setStatus(GameStatus.LOSE);
    Object.values(this.bombs).forEach((bomb) => this.setTile(bomb.y, bomb.x, Tile.BOMB));
    this.setTile(y, x, Tile.LOSINGBOMB);
  }

  private getSiblingCoordinates(y: number, x: number): ICoord[] {
    const siblings: ICoord[] = [];
    for (let oy = -1; oy <= 1; oy++) {
      for (let ox = -1; ox <= 1; ox++) {
        const sy = oy + y;
        const sx = ox + x;

        if (sy === y && sx === x) {
          continue;
        }
        if (sy < 0 || sy > this.height - 1) {
          continue;
        }
        if (sx < 0 || sx > this.width - 1) {
          continue;
        }
        siblings.push({ y: sy, x: sx });
      }
    }
    return siblings;
  }
}