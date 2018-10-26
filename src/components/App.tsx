import * as React from 'react';
import { Game, GameStatus } from '../model/Game';
import GameBoard from './GameBoard';
import GameControl from './GameControl';
import GameStatusView from './GameStatusView';

interface IState {
  game?: Game;
  height: number;
  width: number;
  bombCount: number;
}

const appContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  width: 200,
  margin: 'auto',
  alignItems: 'center',
};

class App extends React.Component<object, IState> {

  public state: IState = {
    bombCount: 5,
    height: 10,
    width: 10,
  };

  public componentDidMount() {
    this.newGame();
  }

  public render() {
    const { game } = this.state;

    return (
      <div style={ appContainerStyle }>
        { game && <GameControl game={ game } onNewGame={ this.newGame }/> }
        { game && <GameBoard game={ game } onSweep={ this.onSweep } onFlag={ this.onFlag }/> }
        { game && <GameStatusView game={ game }/> }
      </div>
    );
  }

  private newGame = () => {
    this.setState({
      game: new Game(
        this.state.height,
        this.state.width,
        this.state.bombCount,
      ),
    });
  };

  private onSweep = (y: number, x: number) => {
    if (this.state.game!.status === GameStatus.INPROGRESS) {
      this.state.game!.sweepCell(y, x);
      this.forceUpdate();
    }
  };

  private onFlag = (y: number, x: number) => {
    if (this.state.game!.status === GameStatus.INPROGRESS) {
      this.state.game!.toggleFlag(y, x);
      this.forceUpdate();
    }
  };
}

export default App;
