export function isSqAttacked(sq, side) {
  if (side == this.COLORS.BLACK) {
    const result = this.getAttackingSquares(sq, this.PIECES.p).filter(
      (sq) => this.pieces[sq] === this.PIECES.p
    );
    if (result.length > 0) return true;
    for (let pce = this.PIECES.n; pce <= this.PIECES.k; pce++) {
      let result = this.getAttackingSquares(sq, pce).filter(
        (pceSq) =>
          this.pieces[pceSq] === pce && this.isValidAttack(sq, pceSq, pce)
      );
      if (result.length > 0) {
        return true;
      }
    }
  } else {
    const result = this.getAttackingSquares(sq, this.PIECES.P).filter(
      (newSq) => this.pieces[newSq] === this.PIECES.P
    );
    if (result.length > 0) return true;
    for (let pce = this.PIECES.N; pce <= this.PIECES.K; pce++) {
      const result = this.getAttackingSquares(sq, pce).filter(
        (pceSq) =>
          this.pieces[pceSq] === pce && this.isValidAttack(sq, pceSq, pce)
      );

      if (result.length > 0) {
        return true;
      }
    }
  }
  return false;
}

export function getAttackingSquares(sq, attackPce) {
  const attackSquare = [];
  switch (attackPce) {
    case this.PIECES.p:
      attackSquare.push(
        ...this.OFFSETS.P.map((offset) => sq + offset).filter(
          (newSq) =>
            this.pieces[newSq] !== this.SQUARES.OFF_BOARD &&
            this.PieceColor[this.pieces[newSq]] !=
              this.PieceColor[this.pieces[sq]]
        )
      );
      break;
    case this.PIECES.P:
      attackSquare.push(
        ...this.OFFSETS.p
          .map((offset) => sq + offset)
          .filter(
            (newSq) =>
              this.pieces[newSq] !== this.SQUARES.OFF_BOARD &&
              this.PieceColor[this.pieces[newSq]] !=
                this.PieceColor[this.pieces[sq]]
          )
      );
      break;
    case this.PIECES.N:
    case this.PIECES.n:
      attackSquare.push(
        ...this.OFFSETS.KNIGHT.map((offset) => sq + offset).filter(
          (newSq) =>
            this.pieces[newSq] !== this.SQUARES.OFF_BOARD &&
            this.PieceColor[this.pieces[newSq]] !=
              this.PieceColor[this.pieces[sq]]
        )
      );
      break;
    case this.PIECES.Q:
    case this.PIECES.q:
    case this.PIECES.B:
    case this.PIECES.b:
      attackSquare.push(...this.getDiagonalSquares(sq, 11));
      attackSquare.push(...this.getDiagonalSquares(sq, -11));
      attackSquare.push(...this.getDiagonalSquares(sq, 9));
      attackSquare.push(...this.getDiagonalSquares(sq, -9));
      if (attackPce === this.PIECES.B || attackPce === this.PIECES.b) {
        break;
      }
    case this.PIECES.R:
    case this.PIECES.r:
      for (
        let tempSq = this.SQ120((sq % 10) - 1);
        this.pieces[tempSq] != this.SQUARES.OFF_BOARD;
        tempSq += 10
      ) {
        tempSq !== sq && attackSquare.push(tempSq);
      }
      for (
        let tempSq = sq - (sq % 10) + 1;
        this.pieces[tempSq] != this.SQUARES.OFF_BOARD;
        tempSq += 1
      ) {
        tempSq !== sq && attackSquare.push(tempSq);
      }
      break;
    case this.PIECES.K:
    case this.PIECES.k:
      attackSquare.push(
        ...this.OFFSETS.KING.map((offset) => sq + offset).filter(
          (newSq) =>
            this.pieces[newSq] !== this.SQUARES.OFF_BOARD &&
            this.PieceColor[this.pieces[newSq]] !=
              this.PieceColor[this.pieces[sq]]
        )
      );
    default:
      break;
  }
  return attackSquare;
}
export function isValidAttack(sq, pceSq, pce) {
  if (this.PieceColor[this.pieces[sq]] == this.PieceColor[pce]) {
    return false;
  }
  switch (pce) {
    case this.PIECES.Q:
    case this.PIECES.q:
    case this.PIECES.B:
    case this.PIECES.b: {
      const max = Math.max(pceSq, sq);
      const min = Math.min(pceSq, sq);
      if (this.getFileNum(max) < this.getFileNum(min)) {
        for (
          let midSq = min + 9;
          midSq < max && this.pieces[midSq] !== this.SQUARES.OFF_BOARD;
          midSq += 9
        ) {
          if (this.pieces[midSq] !== this.PIECES.EMPTY) {
            return false;
          }
        }
      } else if (this.getFileNum(max) > this.getFileNum(min)) {
        for (
          let midSq = min + 11;
          midSq < max && this.pieces[midSq] !== this.SQUARES.OFF_BOARD;
          midSq += 11
        ) {
          if (this.pieces[midSq] !== this.PIECES.EMPTY) return false;
        }
      }
      if (pce === this.PIECES.B || pce === this.PIECES.b) {
        break;
      }
    }
    case this.PIECES.R:
    case this.PIECES.r:
      const max = Math.max(pceSq, sq);
      const min = Math.min(pceSq, sq);
      if (this.getFileNum(pceSq) === this.getFileNum(sq)) {
        for (
          let midSq = min + 10;
          midSq < max && this.pieces[midSq] !== this.SQUARES.OFF_BOARD;
          midSq += 10
        ) {
          if (this.pieces[midSq] !== this.PIECES.EMPTY) return false;
        }
      }
      if (this.getRankNum(pceSq) === this.getRankNum(sq)) {
        for (
          let midSq = min + 1;
          midSq < max && this.pieces[midSq] !== this.SQUARES.OFF_BOARD;
          midSq += 1
        ) {
          if (this.pieces[midSq] !== this.PIECES.EMPTY) return false;
        }
      }
      break;
    default:
  }
  return true;
}
export function getDiagonalSquares(sq, direction) {
  const attackSquare = [];
  let startSq = sq;
  while (this.pieces[startSq + direction] !== this.SQUARES.OFF_BOARD) {
    startSq += direction;
    attackSquare.push(startSq);
  }
  return attackSquare;
}
export function move(from, to, capture, promoted, flag) {
  return from | (to << 7) | (capture << 14) | (promoted << 20) | flag;
}

export function displayCapMoves(side) {
  this.generateCaps();
  for (
    let index = this.moveListStart[this.ply];
    index < this.moveListStart[this.ply + 1];
    ++index
  ) {
    const move = this.moveList[index];
    console.log(
      "adding Cap: ",
      this.PIECE_CHAR[this.pieces[this.getFromSq(move)]],
      this.PIECE_CHAR[this.pieces[this.getToSq(move)]]
    );
  }
}
// the next three functions are the same but the name different for readability
export function addCapMove(move) {
  this.moveList[this.moveListStart[this.ply + 1]] = move;
  this.moveScores[this.moveListStart[this.ply + 1]++] =
    this.mvvLva[
      this.MVVLVA_INDEX(
        this.pieces[this.getFromSq(move)],
        this.getCaptured(move)
      )
    ] + 1000000; 
}
export function addQuiteMove(move) {
  this.moveList[this.moveListStart[this.ply + 1]] = move;
  if (this.killerMoves[this.ply * 2] === move) {
    this.moveScores[this.moveListStart[this.ply + 1]++] = 9000;
  } else if (this.killerMoves[this.ply * 2 + 1] === move) {
    this.moveScores[this.moveListStart[this.ply + 1]++] = 8000;
  } else {
    this.moveScores[this.moveListStart[this.ply + 1]++] =
      this.historyMoves[
        this.pieces[this.getFromSq(move)] * this.BRD_SQ_NUM +
          this.getToSq(move)
      ];
  }
}
export function addEnPassMove(move) {
  this.moveList[this.moveListStart[this.ply + 1]] = move;
  this.moveScores[this.moveListStart[this.ply + 1]++] = 105 + 1000000; // we assign it to zero because we don't care about the worth when generating moves
}

export function addWpCapMove(from, to, cap) {
  if (this.RANKS.RANK_7 === this.ranksBrd[from]) {
    addCapMove.bind(this)(move(from, to, cap, this.PIECES.Q, 0));
    addCapMove.bind(this)(move(from, to, cap, this.PIECES.N, 0));
    addCapMove.bind(this)(move(from, to, cap, this.PIECES.B, 0));
    addCapMove.bind(this)(move(from, to, cap, this.PIECES.R, 0));
  } else {
    addCapMove.bind(this)(move(from, to, cap, 0, 0));
  }
}

export function addBpCapMove(from, to, cap) {
  if (this.RANKS.RANK_2 === this.ranksBrd[from]) {
    addCapMove.bind(this)(move(from, to, cap, this.PIECES.q, 0));
    addCapMove.bind(this)(move(from, to, cap, this.PIECES.n, 0));
    addCapMove.bind(this)(move(from, to, cap, this.PIECES.b, 0));
    addCapMove.bind(this)(move(from, to, cap, this.PIECES.r, 0));
  } else {
    addCapMove.bind(this)(move(from, to, cap, 0, 0));
  }
}
export function addWpQMove(from, to) {
  if (this.RANKS.RANK_7 === this.ranksBrd[from]) {
    this.addQuiteMove(move(from, to, 0, this.PIECES.Q, 0));
    this.addQuiteMove(move(from, to, 0, this.PIECES.N, 0));
    this.addQuiteMove(move(from, to, 0, this.PIECES.B, 0));
    this.addQuiteMove(move(from, to, 0, this.PIECES.R, 0));
  } else {
    this.addQuiteMove(move(from, to, 0, 0, 0));
  }
}
export function addBpQMove(from, to) {
  if (this.RANKS.RANK_2 === this.ranksBrd[from]) {
    this.addQuiteMove(move(from, to, 0, this.PIECES.q, 0));
    addQuiteMove.bind(this)(move(from, to, 0, this.PIECES.n, 0));
    addQuiteMove.bind(this)(move(from, to, 0, this.PIECES.b, 0));
    addQuiteMove.bind(this)(move(from, to, 0, this.PIECES.r, 0));
  } else {
    addQuiteMove.bind(this)(move(from, to, 0, 0, 0));
  }
}
export function generateMoves() {
  this.moveListStart[this.ply + 1] = this.moveListStart[this.ply];
  let pce = 0;
  if (this.side == this.COLORS.WHITE) {
    // ===?
    pce = this.PIECES.P;
    for (let pceNum = 0; pceNum < this.pceNum[pce]; pceNum++) {
      const sq = this.pList[this.PCE_INDEX(pce, pceNum)];
      if (this.pieces[sq + 10] == this.PIECES.EMPTY) {
        this.addWpQMove(sq, sq + 10);
        if (
          this.ranksBrd[sq] == this.RANKS.RANK_2 &&
          this.pieces[sq + 20] == this.PIECES.EMPTY
        ) {
          this.addQuiteMove(this.move(sq, sq + 20, 0, 0, this.maskPawnStart));
        }
      }
      if (this.PieceColor[this.pieces[sq + 9]] == this.COLORS.BLACK) {
        this.addWpCapMove(sq, sq + 9, this.pieces[sq + 9]);
      }
      if (this.PieceColor[this.pieces[sq + 11]] == this.COLORS.BLACK) {
        this.addWpCapMove(sq, sq + 11, this.pieces[sq + 11]);
      }

      if (this.enPas != this.SQUARES.NO_SQ) {
        if (sq + 9 == this.enPas) {
          this.addEnPassMove(this.move(sq, sq + 9, 0, 0, this.maskEnPass));
        }
        if (sq + 11 == this.enPas) {
          this.addEnPassMove(this.move(sq, sq + 11, 0, 0, this.maskEnPass));
        }
      }
    }
    if (this.castlePermission & this.CASTLE_BIT.WKCA) {
      if (
        this.pieces[this.SQUARES.F1] === this.PIECES.EMPTY &&
        this.pieces[this.SQUARES.G1] === this.PIECES.EMPTY
      ) {
        if (
          !this.isSqAttacked(this.SQUARES.E1, this.COLORS.BLACK) &&
          !this.isSqAttacked(this.SQUARES.F1, this.COLORS.BLACK)
        ) {
          this.addQuiteMove(
            this.move(this.SQUARES.E1, this.SQUARES.G1, 0, 0, this.maskCastle)
          );
        }
      }
    }
    if (this.castlePermission & this.CASTLE_BIT.WQCA) {
      if (
        this.pieces[this.SQUARES.D1] == this.PIECES.EMPTY &&
        this.pieces[this.SQUARES.C1] == this.PIECES.EMPTY &&
        this.pieces[this.SQUARES.B1] == this.PIECES.EMPTY &&
        !this.isSqAttacked(this.SQUARES.E1, this.COLORS.BLACK) &&
        !this.isSqAttacked(this.SQUARES.D1, this.COLORS.BLACK) &&
        !this.isSqAttacked(this.SQUARES.C1, this.COLORS.BLACK)
      ) {
        this.addQuiteMove(
          this.move(this.SQUARES.E1, this.SQUARES.C1, 0, 0, this.maskCastle)
        );
      }
    }
  } else if (this.side == this.COLORS.BOTH) {
    console.log("MOVE GENERATOR ERROR!");
  } else {
    pce = this.PIECES.p;
    for (let pceNum = 0; pceNum < this.pceNum[pce]; pceNum++) {
      const sq = this.pList[this.PCE_INDEX(pce, pceNum)];
      if (this.pieces[sq - 10] == this.PIECES.EMPTY) {
        this.addBpQMove(sq, sq - 10);
        if (
          this.ranksBrd[sq] == this.RANKS.RANK_7 &&
          this.pieces[sq - 20] == this.PIECES.EMPTY
        ) {
          this.addQuiteMove(this.move(sq, sq - 20, 0, 0, this.maskPawnStart));
        }
      }
      if (this.PieceColor[this.pieces[sq - 9]] == this.COLORS.WHITE) {
        this.addBpCapMove(sq, sq - 9, this.pieces[sq - 9]);
      }
      if (this.PieceColor[this.pieces[sq - 11]] == this.COLORS.WHITE) {
        this.addBpCapMove(sq, sq - 11, this.pieces[sq - 11]);
      }
      if (this.enPas != this.SQUARES.NO_SQ) {
        if (sq - 9 == this.enPas) {
          this.addEnPassMove(this.move(sq, sq - 9, 0, 0, this.maskEnPass));
        }
        if (sq - 11 == this.enPas) {
          this.addEnPassMove(this.move(sq, sq - 11, 0, 0, this.maskEnPass));
        }
      }
    }
    if (this.castlePermission & this.CASTLE_BIT.BKCA) {
      if (
        this.pieces[this.SQUARES.F8] == this.PIECES.EMPTY &&
        this.pieces[this.SQUARES.G8] == this.PIECES.EMPTY &&
        !this.isSqAttacked(this.SQUARES.E8, this.COLORS.WHITE) &&
        !this.isSqAttacked(this.SQUARES.F8, this.COLORS.WHITE)
      ) {
        this.addQuiteMove(
          this.move(this.SQUARES.E8, this.SQUARES.G8, 0, 0, this.maskCastle)
        );
      }
    }
    if (this.castlePermission & this.CASTLE_BIT.BQCA) {
      if (
        this.pieces[this.SQUARES.D8] == this.PIECES.EMPTY &&
        this.pieces[this.SQUARES.C8] == this.PIECES.EMPTY &&
        this.pieces[this.SQUARES.B8] == this.PIECES.EMPTY &&
        !this.isSqAttacked(this.SQUARES.E8, this.COLORS.WHITE) &&
        !this.isSqAttacked(this.SQUARES.C8, this.COLORS.WHITE) &&
        !this.isSqAttacked(this.SQUARES.D8, this.COLORS.WHITE)
      ) {
        this.addQuiteMove(
          this.move(this.SQUARES.E8, this.SQUARES.C8, 0, 0, this.maskCastle)
        );
      }
    }
  }
  const king = pce + 5;
  for (pce += 1; pce <= king; pce += 4) {
    // loop through the different Pieces
    for (let pceNum = 0; pceNum < this.pceNum[pce]; pceNum++) {
      const sq = this.pList[this.PCE_INDEX(pce, pceNum)];
      for (let index = 0; index < this.OFFSETS_NUM[pce]; index++) {
        const toSq = sq + this.PIECE_Off_Arr[pce][index];

        if (
          this.pieces[toSq] != this.SQUARES.OFF_BOARD &&
          this.PieceColor[this.pieces[toSq]] != this.PieceColor[pce]
        ) {
          // add move here
          if (this.pieces[toSq] != this.PIECES.EMPTY) {
            this.addCapMove(this.move(sq, toSq, this.pieces[toSq], 0, 0));
          } else {
            this.addQuiteMove(this.move(sq, toSq, 0, 0, 0));
          }
        }
      }
    }
  }
  //now we shall loop through the sliding pieces i.e. queen, rock, bishop
  pce -= 7; // to get the side bishop
  for (; pce < king; pce++) {
    // loop through every piece of the same type and get it's possible moves
    for (let pceNum = 0; pceNum < this.pceNum[pce]; pceNum++) {
      const sq = this.pList[this.PCE_INDEX(pce, pceNum)];
      const attackingSquares = this.getAttackingSquares(sq, pce);
      const result = attackingSquares.filter((toSq) => {
        const isValidMove =
          this.pieces[sq] === pce && this.isValidAttack(toSq, sq, pce);
        if (isValidMove) {
          if (
            this.PieceColor[this.pieces[toSq]] != this.side &&
            this.PieceColor[this.pieces[toSq]] != this.COLORS.BOTH
          ) {
            this.addCapMove(this.move(sq, toSq, this.pieces[toSq], 0, 0));
          } else {
            this.addQuiteMove(this.move(sq, toSq, 0, 0, 0));
          }
        }
        return isValidMove;
      });
    }
  }
}
export function generateCaps() {
  this.moveListStart[this.ply + 1] = this.moveListStart[this.ply];
  let pce = 0;
  if (this.side == this.COLORS.WHITE) {
    // ===?
    pce = this.PIECES.P;
    for (let pceNum = 0; pceNum < this.pceNum[pce]; pceNum++) {
      const sq = this.pList[this.PCE_INDEX(pce, pceNum)];
      if (this.PieceColor[this.pieces[sq + 9]] == this.COLORS.BLACK) {
        this.addWpCapMove(sq, sq + 9, this.pieces[sq + 9]);
      }
      if (this.PieceColor[this.pieces[sq + 11]] == this.COLORS.BLACK) {
        this.addWpCapMove(sq, sq + 11, this.pieces[sq + 11]);
      }

      if (this.enPas != this.SQUARES.NO_SQ) {
        if (sq + 9 == this.enPas) {
          //note: there is no capture piece here because it will be handled in makeMove function
          this.addEnPassMove(this.move(sq, sq + 9, 0, 0, this.maskEnPass));
        }
        if (sq + 11 == this.enPas) {
          this.addEnPassMove(this.move(sq, sq + 11, 0, 0, this.maskEnPass));
        }
      }
    }
  } else if (this.side == this.COLORS.BOTH) {
    console.log("MOVE GENERATOR ERROR!");
  } else {
    pce = this.PIECES.p;
    for (let pceNum = 0; pceNum < this.pceNum[pce]; pceNum++) {
      const sq = this.pList[this.PCE_INDEX(pce, pceNum)];
      if (this.PieceColor[this.pieces[sq - 9]] == this.COLORS.WHITE) {
        this.addBpCapMove(sq, sq - 9, this.pieces[sq - 9]);
      }
      if (this.PieceColor[this.pieces[sq - 11]] == this.COLORS.WHITE) {
        this.addBpCapMove(sq, sq - 11, this.pieces[sq - 11]);
      }
      if (this.enPas != this.SQUARES.NO_SQ) {
        if (sq - 9 == this.enPas) {
          this.addEnPassMove(this.move(sq, sq - 9, 0, 0, this.maskEnPass));
        }
        if (sq - 11 == this.enPas) {
          this.addEnPassMove(this.move(sq, sq - 11, 0, 0, this.maskEnPass));
        }
      }
    }
  }
  const king = pce + 5;
  for (pce += 1; pce <= king; pce += 4) {
    // loop through the different Pieces
    for (let pceNum = 0; pceNum < this.pceNum[pce]; pceNum++) {
      const sq = this.pList[this.PCE_INDEX(pce, pceNum)];
      for (let index = 0; index < this.OFFSETS_NUM[pce]; index++) {
        const toSq = sq + this.PIECE_Off_Arr[pce][index];

        if (
          this.pieces[toSq] != this.SQUARES.OFF_BOARD &&
          this.PieceColor[this.pieces[toSq]] != this.PieceColor[pce]
        ) {
          // add move here
          if (this.pieces[toSq] != this.PIECES.EMPTY) {
            this.addCapMove(this.move(sq, toSq, this.pieces[toSq], 0, 0));
          }
        }
      }
    }
  }
  //now we shall loop through the sliding pieces i.e. queen, rock, bishop
  pce -= 7; // to get the side bishop
  for (; pce < king; pce++) {
    // loop through every piece of the same type and get it's possible moves
    for (let pceNum = 0; pceNum < this.pceNum[pce]; pceNum++) {
      const sq = this.pList[this.PCE_INDEX(pce, pceNum)];
      const attackingSquares = this.getAttackingSquares(sq, pce);
      const result = attackingSquares.filter((toSq) => {
        const isValidMove =
          this.pieces[sq] === pce && this.isValidAttack(toSq, sq, pce);
        if (isValidMove) {
          if (
            this.PieceColor[this.pieces[toSq]] != this.side &&
            this.PieceColor[this.pieces[toSq]] != this.COLORS.BOTH
          ) {
            this.addCapMove(this.move(sq, toSq, this.pieces[toSq], 0, 0));
          }
        }
        return isValidMove;
      });
    }
  }
}

export function sortMoves() {
  for (
    let i = this.moveListStart[this.ply];
    i < this.moveListStart[this.ply + 1] - 1;
    i++
  ) {
    for (let j = i + 1; j < this.moveListStart[this.ply + 1]; j++) {
      if (this.moveScores[i] < this.moveScores[j]) {
        let temp = this.moveScores[i];
        this.moveScores[i] = this.moveScores[j];
        this.moveScores[j] = temp;
        temp = this.moveList[i];
        this.moveList[i] = this.moveList[j];
        this.moveList[j] = temp;
      }
    }
  }
}
