import * as React from 'react';
import { Game, Tile } from '../model/Game';

interface IProps {
  game: Game;
  onSweep: (y: number, x: number) => void;
  onFlag: (y: number, x: number) => void;
}

const gridStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  fontFamily: 'monospace',
};
const rowStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
};
const cellStyle: React.CSSProperties = {
  border: '1px solid #666',
  cursor: 'default',
  height: 15,
  width: 15,
  textAlign: 'center',
};

class GameBoard extends React.Component<IProps> {
  public render() {
    const { game, onSweep } = this.props;

    return (
      <div style={ gridStyle }>
        { game.tiles.map((row, y) => (
          <div key={ y } style={ rowStyle }>
            { row.map((tile, x) => (
              <div key={ x } style={ cellStyle } onClick={ () => onSweep(y, x) }
                   onContextMenu={ (event) => this.onFlag(event, y, x) }>
                { tile === Tile.UNKNOWN && 'o' }
                { tile === Tile.BLANK && ' ' }
                { tile === Tile.BOMB && 'x' }
                { tile === Tile.LOSINGBOMB && <span style={ { background: 'red' } }>x</span> }
                { tile === Tile.FLAG && '!' }
                { typeof tile === 'number' && tile }
              </div>
            )) }
          </div>
        )) }
      </div>
    );
  }

  private onFlag(event: React.MouseEvent, y: number, x: number) {
    event.preventDefault();
    this.props.onFlag(y, x);
  }
}

export default GameBoard;
