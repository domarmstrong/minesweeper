import * as React from 'react';
import { Game, GameStatus } from '../model/Game';

interface IProps {
  game: Game;
}

class GameStatusView extends React.Component<IProps> {
  public render() {
    const { game } = this.props;

    if (game.status === GameStatus.WIN) {
      return <h1>Winner!!!</h1>;
    }
    if (game.status === GameStatus.LOSE) {
      return <h1>Loser!!! :(</h1>;
    }
    return null;
  }
}

export default GameStatusView;
