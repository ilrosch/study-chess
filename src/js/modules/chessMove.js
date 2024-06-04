const getAvailableMoves = (figure, position) => {
  const boardSize = 8;
  const positionToCoords = (pos) => {
    const col = pos.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
    const row = parseInt(pos[1]);
    return [row, col];
  };

  const coordsToPosition = (coords) => {
    const col = String.fromCharCode('a'.charCodeAt(0) + coords[1] - 1);
    return `${col}${coords[0]}`;
  };

  const isInBounds = (x, y) => {
    return x >= 1 && x <= boardSize && y >= 1 && y <= boardSize;
  };

  const directions = {
    r: [[1, 0], [-1, 0], [0, 1], [0, -1]], // ладья
    b: [[1, 1], [1, -1], [-1, 1], [-1, -1]], // слон
    q: [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]], // ферзь
    n: [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]], // конь
    k: [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]], // король
    p: [[1, 0], [1, 1], [1, -1]] // пешка
  };

  let availableMoves = [];
  let [x, y] = positionToCoords(position);

  const addLinearMoves = (steps) => {
    steps.forEach(([dx, dy]) => {
      let newX = x + dx;
      let newY = y + dy;
      while (isInBounds(newX, newY)) {
        availableMoves.push(coordsToPosition([newX, newY]));
        newX += dx;
        newY += dy;
      }
    });
  };

  const addSingleMoves = (steps) => {
    steps.forEach(([dx, dy]) => {
      let newX = x + dx;
      let newY = y + dy;
      if (isInBounds(newX, newY)) {
        availableMoves.push(coordsToPosition([newX, newY]));
      }
    });
  };

  switch (figure) {
    case 'r':
      addLinearMoves(directions.r);
      break;
    case 'b':
      addLinearMoves(directions.b);
      break;
    case 'q':
      addLinearMoves(directions.q);
      break;
    case 'n':
      addSingleMoves(directions.n);
      break;
    case 'k':
      addSingleMoves(directions.k);
      break;
    case 'p':
      let pawnMoves = directions.p.filter(([dx, dy]) => isInBounds(x + dx, y + dy));
      pawnMoves.forEach(([dx, dy]) => {
        availableMoves.push(coordsToPosition([x + dx, y + dy]));
      });
      break;
  }

  return availableMoves;
};

const highlightCells = (moves) => {
  moves.forEach(move => {
    const cell = document.querySelector(`[data-cell="${move}"]`);
    if (cell) {
      cell.classList.add('highlight');
    }
  });
};

const removeHighlights = () => {
  const highlightedCells = document.querySelectorAll('.highlight');
  highlightedCells.forEach(cell => {
    cell.classList.remove('highlight');
  });
};

const movePiece = (from, to) => {
  const fromCell = document.querySelector(`[data-cell="${from}"]`);
  const toCell = document.querySelector(`[data-cell="${to}"]`);
  if (fromCell && toCell) {
    const piece = fromCell.querySelector('img');
    if (piece) {
      toCell.appendChild(piece);
    }
  }
};

// Обработчики событий для фигур
document.querySelectorAll('.chess-piece').forEach(piece => {
  piece.addEventListener('click', (event) => {
    removeHighlights();
    const pieceType = piece.getAttribute('data-piece-type');
    const position = piece.parentElement.getAttribute('data-cell');
    const moves = getAvailableMoves(pieceType, position);
    highlightCells(moves);

    const board = document.querySelector('.chess-board');
    board.addEventListener('click', function boardClickListener(event) {
      if (event.target.matches('.highlight')) {
        const targetCell = event.target.getAttribute('data-cell');
        movePiece(position, targetCell);
        removeHighlights();
        board.removeEventListener('click', boardClickListener);
      }
    }, { once: true });
  });
});

export default getAvailableMoves;