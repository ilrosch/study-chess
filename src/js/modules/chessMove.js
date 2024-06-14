const getAvailableMoves = (name, position) => {
  const getMovesPawn = () => {
    if (position > 48) {
      return [position - 8, position - 16];
    }
    return [position - 8];
  };

  const getMovesRook = () => {
    const moves = [];
    // вертикальные ходы
    for (let i = position - 8; i > 0; i -= 8) moves.push(i);
    for (let i = position + 8; i <= 64; i += 8) moves.push(i);
    // горизонтальные ходы
    const rowStart = Math.floor((position - 1) / 8) * 8 + 1;
    for (let i = position - 1; i >= rowStart; i -= 1) moves.push(i);
    for (let i = position + 1; i <= rowStart + 7; i += 1) moves.push(i);
    return moves;
  };

  const getMovesNag = () => {
    const potentialMoves = [
      position - 17, position - 15, position - 10, position - 6,
      position + 6, position + 10, position + 15, position + 17,
    ];
    const moves = potentialMoves.filter((move) => move > 0 && move < 65);
    return moves;
  };

  const getMovesBishop = () => {
    const moves = [];
    // диагональ вправо-вниз
    for (let i = position; i <= 64; i += 9) moves.push(i);
    // диагональ вправо-вверх
    for (let i = position; i > 0 && i <= 64 && (i - 1) % 8 !== 0; i -= 7) moves.push(i);
    // диагональ влево-вниз
    for (let i = position; i > 0 && i <= 64 && i % 8 !== 0; i += 7) moves.push(i);
    // диагональ влево-вверх
    for (let i = position; i > 0; i -= 9) moves.push(i);
    return moves;
  };

  const getMovesQueen = () => [...getMovesRook(), ...getMovesBishop()];
  const getMovesKing = () => {
    const potentialMoves = [
      position - 8, position - 7, position + 1, position + 9,
      position + 8, position + 7, position - 1, position - 9,
    ];
    const moves = potentialMoves.filter((move) => move > 0 && move < 65);
    return moves;
  };

  switch (name) {
    case 'p': return getMovesPawn();
    case 'r': return getMovesRook();
    case 'n': return getMovesNag();
    case 'b': return getMovesBishop();
    case 'q': return getMovesQueen();
    case 'k': return getMovesKing();
    default: return [];
  }
};

export default getAvailableMoves;
