const lessons = [
  {
    id: 1, title: 'Lesson 1: Pawn', content: ['The pawn is the most common piece, as each player has 8 pawns. They are placed on the second row. The pawn moves forward one square, except on its first move when it can move forward two squares. The pawn captures pieces that are one square diagonally from it. Despite its weakness, the pawn can be promoted to any captured piece upon reaching the opposite end of the board.'], chess: [{ cell: 53, element: 'wp' }],
  },
  {
    id: 2, title: 'Lesson 2: Rook', content: ['The rook moves horizontally and vertically any number of squares. It starts the game in the corners of the board. The rook is a powerful piece due to its long-range moves along ranks and files.'], chess: [{ cell: 28, element: 'wr' }],
  },
  {
    id: 3, title: 'Lesson 3: Knight', content: ['The knight moves in an "L" shape: two squares in one direction and one square perpendicular. It is the only piece that can jump over other pieces, meaning the knight can move to its target square even if there are pieces in between. The knight starts the game next to the rooks.'], chess: [{ cell: 36, element: 'wn' }],
  },
  {
    id: 4, title: 'Lesson 4: Bishop', content: ['The bishop moves diagonally any number of squares. Each player has two bishops: one that moves on light squares and one on dark squares. The bishop starts the game between the knight and the queen/king.'], chess: [{ cell: 28, element: 'wb' }, { cell: 45, element: 'wb' }],
  },
  {
    id: 5, title: 'Lesson 5: Queen', content: ['The queen is the most powerful piece, able to move horizontally, vertically, and diagonally any number of squares. The queen starts the game next to the king (on a white square for white pieces, and on a black square for black pieces).'], chess: [{ cell: 30, element: 'wq' }],
  },
  {
    id: 6, title: 'Lesson 6: King', content: ['The king is the most important piece, though weak in its moves. It can move one square in any direction (forward, backward, left, right, and diagonally). The goal of the game is to checkmate the opponents king, which means putting the king under attack in such a way that it cannot escape capture.'], chess: [{ cell: 60, element: 'wk' }],
  },
  {
    id: 7, title: 'Lesson 7: Victory', content: ['Checkmate: Victory is achieved when the opponents king is under check and cannot make any move to escape the check.'], chess: [{ cell: 62, element: 'wk' }, { cell: 63, element: 'wr' }],
  },
  {
    id: 8, title: 'Lesson 8: Defeat', content: ['Resignation: A player can voluntarily resign if they consider their position hopeless. • Time: In timed games, the player whose time runs out loses automatically, provided the opponent has enough pieces to deliver checkmate. • Checkmate: You have been checkmated.'], chess: [{ cell: 20, element: 'wp' }, { cell: 36, element: 'bp' }],
  },
  {
    id: 9, title: 'Lesson 9: Draw', content: ['1. Stalemate: When the player whose turn it is cannot make any legal move, and their king is not in check. 2. Threefold repetition: If the same position occurs three times with the same possibilities for moves for both sides. 3. 50-move rule: If in the last 50 moves, neither side has moved a pawn or captured a piece. 4. Insufficient material: If neither side has enough pieces to deliver checkmate (e.g., king against king or king and bishop against king).'],
  },
  {
    id: 10, title: 'Lesson 1.1: Pawn Promotion', content: ['A pawn has a special way of capturing a piece, it captures only when the opponents piece is diagonally from the pawn.'], chess: [{ cell: 56, element: 'wp' }],
  },
  {
    id: 11, title: 'Lesson 1.2: Pawn on the Edge of the Board', content: ['When a pawn reaches the last rank, it can be promoted to any other piece except the king.'], chess: [{ cell: 56, element: 'wp' }],
  },
  {
    id: 12, title: 'Lesson 1.2: Pawn on the Edge of the Board', content: ['When a pawn reaches the last rank, it can be promoted to any other piece except the king.'], chess: [{ cell: 56, element: 'wp' }],
  },
  {
    id: 13, title: 'Lesson 1.2: Pawn on the Edge of the Board', content: ['When a pawn reaches the last rank, it can be promoted to any other piece except the king.'], chess: [{ cell: 56, element: 'wp' }],
  },
];

window.Storage = lessons;
