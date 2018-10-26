import * as React from 'react';
import { Game } from '../model/Game';

interface IProps {
  game: Game;
  onNewGame: () => void;
}

const controlContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
};

class GameControl extends React.Component<IProps> {

  private timer: number;

  public componentDidMount() {
    this.timer = window.setInterval(() => this.forceUpdate(), 1000);
  }

  public componentWillUnmount() {
    window.clearInterval(this.timer);
  }

  public render() {
    const { game, onNewGame } = this.props;

    return (
      <div style={ controlContainerStyle }>
        <div>{ game.flags }</div>
        <button onClick={ onNewGame }>NEW</button>
        <div>{ this.getTimer() }</div>
      </div>
    );
  }

  private getTimer() {
    const { game } = this.props;
    return Math.round(((game.endTime ? game.endTime : Date.now()) - this.props.game.startTime) / 1000);
  }
}

export default GameControl;
