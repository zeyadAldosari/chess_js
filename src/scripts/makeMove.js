import { isSqAttacked } from "./moves.js";

export function clearPiece(sq) {
  const pce = this.pieces[sq];
  const color = this.PieceColor[pce];
  this.hashPce(pce, sq);
  this.pieces[sq] = this.PIECES.EMPTY;
  this.material[color] -= this.PieceVal[pce];
  let tempPceNum = -1;
  for (let index = 0; index < this.pceNum[pce]; ++index) {
    if (this.pList[this.PCE_INDEX(pce, index)] == sq) {
      tempPceNum = index;
      break;
    }
  }

  this.pceNum[pce]--;
  this.pList[this.PCE_INDEX(pce, tempPceNum)] =
    this.pList[this.PCE_INDEX(pce, this.pceNum[pce])];
}

export function addPiece(sq, pce) {
  const color = this.PieceColor[pce];
  this.hashPce(pce, sq);
  this.pieces[sq] = pce;
  this.material[color] += this.PieceVal[pce];
  this.pList[this.PCE_INDEX(pce, this.pceNum[pce])] = sq;
  this.pceNum[pce]++;
}

export function movePiece(fromSq, toSq) {
  const pce = this.pieces[fromSq];
  this.hashPce(pce, fromSq);
  this.pieces[fromSq] = this.PIECES.EMPTY;
  this.hashPce(pce, toSq);
  this.pieces[toSq] = pce;
  for (let pceNum = 0; pceNum < this.pceNum[pce]; pceNum++) {
    if (this.pList[this.PCE_INDEX(pce, pceNum)] === fromSq) {
      this.pList[this.PCE_INDEX(pce, pceNum)] = toSq;
      break;
    }
  }
}

export function checkBoard() {
  let t_pceNum = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let t_material = [0, 0];
  let sq64, t_piece, t_pce_num, sq120;

  for (t_piece = this.PIECES.wP; t_piece <= this.PIECES.bK; ++t_piece) {
    for (t_pce_num = 0; t_pce_num < this.pceNum[t_piece]; ++t_pce_num) {
      sq120 = this.pList[PCE_INDEX(t_piece, t_pce_num)];
      if (this.pieces[sq120] != t_piece) {
        console.log("Error Pce Lists");
        return this.BOOL.FALSE;
      }
    }
  }

  for (sq64 = 0; sq64 < 64; ++sq64) {
    sq120 = this.SQ120(sq64);
    t_piece = this.pieces[sq120];
    t_pceNum[t_piece]++;
    t_material[this.PieceColor[t_piece]] += this.PieceVal[t_piece];
  }

  for (t_piece = this.PIECES.wP; t_piece <= this.PIECES.bK; ++t_piece) {
    if (t_pceNum[t_piece] != this.pceNum[t_piece]) {
      console.log("Error t_pceNum");
      return this.BOOL.FALSE;
    }
  }

  if (
    t_material[this.COLORS.WHITE] != this.material[this.COLORS.WHITE] ||
    t_material[this.COLORS.BLACK] != this.material[this.COLORS.BLACK]
  ) {
    console.log(
      t_material[this.COLORS.BLACK],
      this.material[this.COLORS.BLACK]
    );
    console.log(
      t_material[this.COLORS.WHITE],
      this.material[this.COLORS.WHITE]
    );
    console.log("Error t_material");
    return this.BOOL.FALSE;
  }

  if (this.side != this.COLORS.WHITE && this.side != this.COLORS.BLACK) {
    console.log("Error this.side");
    return this.BOOL.FALSE;
  }

  if (this.generatePosKey() != this.posKey) {
    console.log("Error this.posKey");
    return this.BOOL.FALSE;
  }
  return this.BOOL.TRUE;
}

export function makeMove(move) {
  const fromSq = this.getFromSq(move);
  const toSq = this.getToSq(move);
  // we store the pos for the repetition
  this.gameHis[this.hisPly].posKey = this.posKey;
  if ((move & this.maskEnPass) !== 0) {
    this.side === this.COLORS.WHITE
      ? this.clearPiece(toSq - 10)
      : this.clearPiece(toSq + 10);
  } else if ((move & this.maskCastle) !== 0) {
    switch (toSq) {
      case this.SQUARES.G1:
        this.movePiece(this.SQUARES.H1, this.SQUARES.F1);
        break;
      case this.SQUARES.C1:
        this.movePiece(this.SQUARES.A1, this.SQUARES.D1);
        break;
      case this.SQUARES.G8:
        this.movePiece(this.SQUARES.H8, this.SQUARES.F8);
        break;
      case this.SQUARES.C8:
        this.movePiece(this.SQUARES.A8, this.SQUARES.D8);
        break;
      default:
        break;
    }
  }
  if (this.enPas !== this.SQUARES.NO_SQ) this.hashEnPas();
  this.hashCastle();
  this.gameHis[this.hisPly].move = move;
  this.gameHis[this.hisPly].fiftyMove = this.fiftyMove;
  this.gameHis[this.hisPly].enPas = this.enPas;
  this.gameHis[this.hisPly].castlePermission = this.castlePermission;
  this.castlePermission &= this.castlePermArr[fromSq];
  this.castlePermission &= this.castlePermArr[toSq];
  this.enPas = this.SQUARES.NO_SQ;
  this.hashCastle();
  this.fiftyMove++;
  if (this.getCaptured(move) !== 0) {
    const pce = this.pieces[fromSq];
    this.clearPiece(toSq);
    this.fiftyMove = 0;
  }
  this.ply++;
  this.hisPly++;
  if (this.PiecePawn[this.pieces[fromSq]] !== 0) {
    this.fiftyMove = 0;
    if ((move & this.maskPawnStart) !== 0) {
      this.enPas = this.side === this.COLORS.WHITE ? fromSq + 10 : fromSq - 10;
      this.hashEnPas();
    }
  }
  this.movePiece(fromSq, toSq);
  const promPce = this.getPromotion(move);
  if (promPce !== 0) {
    this.clearPiece(toSq);
    this.addPiece(toSq, promPce);
  }
  const preSide = this.side;
  this.side ^= 1;
  this.hashSide();
  if (
    this.isSqAttacked(
      this.pList[this.PCE_INDEX(this.KINGS[preSide], 0)],
      this.side
    )
  ) {
    this.takeMove();
    return false;
  }
  return true;
}

export function takeMove() {
  this.hisPly--;
  this.ply--;
  
  // hash enpas, castle
  this.hashCastle();
  if (this.enPas != this.SQUARES.NO_SQ) this.hashEnPas();
  // get the older values
  this.castlePermission = this.gameHis[this.hisPly].castlePermission;
  this.fiftyMove = this.gameHis[this.hisPly].fiftyMove;
  this.enPas = this.gameHis[this.hisPly].enPas;
  //hash enpas, castle
  if (this.enPas != this.SQUARES.NO_SQ) this.hashEnPas();
  this.hashCastle();

  // hash the side and change it
  this.side ^= 1;
  this.hashSide();
  // reverse the special moves
  const move = this.gameHis[this.hisPly].move;
  const fromSq = this.getFromSq(move);
  const toSq = this.getToSq(move);
  if ((move & this.maskEnPass) !== 0) {
    this.side === this.COLORS.WHITE
      ? this.addPiece(toSq - 10, this.PIECES.p)
      : this.addPiece(toSq + 10, this.PIECES.P);
  } else if ((move & this.maskCastle) !== 0) {
    switch (toSq) {
      case this.SQUARES.G1:
        this.movePiece(this.SQUARES.F1, this.SQUARES.H1);
        break;
      case this.SQUARES.C1:
        this.movePiece(this.SQUARES.D1, this.SQUARES.A1);
        break;
      case this.SQUARES.G8:
        this.movePiece(this.SQUARES.F8, this.SQUARES.H8);
        break;
      case this.SQUARES.C8:
        this.movePiece(this.SQUARES.D8, this.SQUARES.A8);
        break;
      default:
        break;
    }
  }
  this.movePiece(toSq, fromSq);
  if (this.getCaptured(move) !== 0) {
    this.addPiece(toSq, this.getCaptured(move));
  }
  if (this.getPromotion(move) != 0) {
    this.clearPiece(fromSq);
    this.addPiece(
      fromSq,
      this.side === this.COLORS.WHITE ? this.PIECES.P : this.PIECES.p
    );
  }
}
