import { Constants } from "./constants.js";
import * as helpers from "./moves.js";
import * as makeMove from "./makeMove.js";

export class Board extends Constants {
  side = this.COLORS.WHITE;
  fiftyMove = 0;
  hisPly = 0;
  ply = 0; // current depth of the search tree
  castlePermission = 0;
  enPas = 0;
  material = new Array(2); // will hold total value of material for each color
  pceNum = new Array(13); //stores how many pieces for each type for all the 12 pieces + empty
  pList = new Array(14 * 10); // stores the index for every piece in the board
  posKey = 0; // for repeat draw (RAND_32 if we have duplicate keys will know that there is some repetition )
  pieces = new Array(this.BRD_SQ_NUM);
  sideKey = this.RAND_32();
  moveList = new Array(this.MAX_DEPTH * this.MAX_POSITION_MOVES);
  moveListStart = new Array(this.MAX_DEPTH).fill(0); // index for the first move at a given ply
  moveScores = new Array(this.MAX_DEPTH * this.MAX_POSITION_MOVES);
  gameHis = new Array(this.MAX_MOVES).fill(null).map(() => ({
    move: this.noMove,
    castlePermission: 0,
    enPas: 0,
    fiftyMove: 0,
    posKey: 0,
  }));
  player = this.COLORS.WHITE;
  engine = this.player ^ 1;
  end = 0;
  killerMoves = new Array(2 * this.MAX_DEPTH);
  historyMoves = new Array(14 * this.BRD_SQ_NUM);
  pvLength = new Array(this.MAX_DEPTH);
  pvTable = new Array(this.MAX_DEPTH * this.MAX_DEPTH);

  constructor() {
    super();
    this.bindHelperFunctions();
    this.initBoard();
    this.initPosKey();
  }
  bindHelperFunctions() {
    for (const [name, func] of Object.entries(helpers)) {
      this[name] = func.bind(this);
    }
    for (const [name, func] of Object.entries(makeMove)) {
      this[name] = func.bind(this);
    }
  }
  initPosKey() {
    this.sideKey = this.RAND_32();
    for (let index = 0; index < this.pieceKeys.length; index++) {
      this.pieceKeys[index] = this.RAND_32();
    }
    for (let index = 0; index < this.castleKeys.length; index++) {
      this.castleKeys[index] = this.RAND_32();
    }
  }
  generatePosKey() {
    let key = 0;
    for (let square = 0; square < this.BRD_SQ_NUM; square++) {
      const piece = this.pieces[square];
      if (piece != this.PIECES.EMPTY && piece != this.SQUARES.OFF_BOARD) {
        key ^= this.pieceKeys[piece * 120 + square];
      }
    }
    if (this.side == this.COLORS.WHITE) {
      key ^= this.SideKey;
    }

    if (this.enPas != this.SQUARES.NO_SQ) {
      key ^= this.pieceKeys[this.enPas];
    }
    key ^= this.castleKeys[this.castlePermission];
    return key;
  }
  parseFen(fen) {
    this.resetBoard();
    const parts = fen.split(" ");
    const placement = parts[0].split("/");
    let sq = 63;
    placement.forEach((rank) => {
      for (let charIndex = rank.length - 1; charIndex >= 0; charIndex--) {
        let char = rank.charAt(charIndex);
        if (char > 0) {
          for (; char > 0; char--, sq--) {
            this.pieces[this.SQ120(sq)] = this.PIECES.EMPTY;
          }
        } else {
          this.pieces[this.SQ120(sq--)] = this.PIECES[char];
        }
      }
    });
    this.side = parts[1] === "w" ? this.COLORS.WHITE : this.COLORS.BLACK;
    this.player = this.side;
    this.engine = parts[1] === "w" ? this.COLORS.BLACK : this.COLORS.WHITE;
    for (let charIndex = 0; charIndex < parts[2].length; charIndex++) {
      const char = parts[2].charAt(charIndex);
      switch (char) {
        case "K":
          this.castlePermission += this.CASTLE_BIT.WKCA;
          break;
        case "Q":
          this.castlePermission += this.CASTLE_BIT.WQCA;
          break;
        case "k":
          this.castlePermission += this.CASTLE_BIT.BKCA;
          break;
        case "q":
          this.castlePermission += this.CASTLE_BIT.BQCA;
          break;
      }
    }
    if (parts[3] != "-") {
      let rank = this.RANKS.RANK_8;
      let file = this.FILES.FILE_A;
      file = parts[3].charAt(0).charCodeAt() - "a".charCodeAt();
      rank = parts[3].charAt(1).charCodeAt() - "1".charCodeAt();
      this.enPas = this.FR2SQ(file, rank);
    }
    this.posKey = this.generatePosKey();
    this.updatePList();
    return true;
  }
  initBoard() {
    for (let square = 0; square < this.BRD_SQ_NUM; square++) {
      if (square > 20 && square < 99 && square % 10 != 0 && square % 10 != 9) {
        this.pieces[square] = this.PIECES.EMPTY;
        this.sq120to64[square] = this.from120to64(square);
        this.sq64to120[this.from120to64(square)] = square;
      } else {
        this.pieces[square] = this.SQUARES.OFF_BOARD;
        this.filesBrd[square] = this.SQUARES.OFF_BOARD;
        this.ranksBrd[square] = this.SQUARES.OFF_BOARD;
        this.sq120to64[square] = -1;
      }
    }
    for (let rank = this.RANKS.RANK_1; rank <= this.RANKS.RANK_8; ++rank) {
      for (let file = this.FILES.FILE_A; file <= this.FILES.FILE_H; ++file) {
        const sq = this.FR2SQ(file, rank);
        this.filesBrd[sq] = file;
        this.ranksBrd[sq] = rank;
      }
    }
    this.moveListStart[this.ply] = 0;
  }
  resetBoard() {
    this.initBoard();
    this.side = this.COLORS.BOTH;
    this.enPas = this.SQUARES.NO_SQ;
    this.posKey = 0;
    this.ply = 0;
    this.hisPly = 0;
    this.castlePermission = 0;
    this.end = 0;
    this.moveListStart[this.ply] = 0;
    this.gameHis.map(() => ({
      move: this.noMove,
      castlePermission: 0,
      enPas: 0,
      fiftyMove: 0,
      posKey: 0,
    }));
  }

  displayBoard() {
    let tempArr = [];
    for (let rank = this.RANKS.RANK_8; rank >= this.RANKS.RANK_1; rank--) {
      let line = this.RANK_CHAR[rank] + "  ";
      for (let file = this.FILES.FILE_A; file <= this.FILES.FILE_H; file++) {
        const sq = this.FR2SQ(file, rank);
        const piece = this.pieces[sq];
        line += " " + this.PIECE_CHAR[piece] + " ";
      }
      console.log(line);
    }
    console.log(" ");
    let line = "   ";
    for (let file = this.FILES.FILE_A; file <= this.FILES.FILE_H; file++) {
      line += " " + this.FILE_CHAR[file] + " ";
    }
    console.log(line);
    console.log("Side:", this.SIDE_CHAR[this.side]);
    console.log("enPas:", this.enPas);
    if (this.castlePermission & this.CASTLE_BIT.WKCA) tempArr.push("K");
    if (this.castlePermission & this.CASTLE_BIT.WQCA) tempArr.push("Q");
    if (this.castlePermission & this.CASTLE_BIT.BKCA) tempArr.push("k");
    if (this.castlePermission & this.CASTLE_BIT.BQCA) tempArr.push("q");
    if (tempArr.length !== 0) console.log("Castle:", tempArr.join(""));
    else {
      console.log("Castle: -");
    }
    console.log(this.posKey.toString(16));
    this.displaySqAttacked();
  }

  updatePList() {
    for (let index = 0; index < 13; index++) {
      this.pceNum[index] = 0;
    }
    for (let index = 0; index < 14 * 120; index++) {
      this.pList[index] = this.PIECES.EMPTY;
    }
    for (let index = 0; index < 2; index++) {
      this.material[index] = 0;
    }
    for (let sq = 0; sq < 64; sq++) {
      const piece = this.pieces[this.SQ120(sq)];
      if (piece != this.PIECES.EMPTY) {
        const pieceCol = this.PieceColor[piece];
        this.material[pieceCol] += this.PieceVal[piece];
        const pceNum = this.pceNum[piece]++;
        this.pList[this.PCE_INDEX(piece, pceNum)] = this.SQ120(sq);
      }
    }
  }

  displayPieceList() {
    for (let pce = this.PIECES.P; pce <= this.PIECES.k; pce++) {
      for (let pceNum = 0; pceNum < this.pceNum[pce]; pceNum++) {
        console.log(
          "Piece:",
          this.PIECE_CHAR[pce],
          "on:",
          this.getFileRank(this.pList[this.PCE_INDEX(pce, pceNum)])
        );
      }
    }
  }

  displaySqAttacked() {
    console.log("Attacked:");
    let piece;
    for (let rank = this.RANKS.RANK_8; rank >= this.RANKS.RANK_1; rank--) {
      let line = rank + 1 + "  ";
      for (let file = this.FILES.FILE_A; file <= this.FILES.FILE_H; file++) {
        const sq = this.FR2SQ(file, rank);
        if (this.isSqAttacked(sq, this.side) == this.BOOL.TRUE) piece = "X";
        else {
          piece = "-";
        }
        line += " " + piece + " ";
      }
      console.log(line);
    }
    console.log(" ");
    let line = "   ";
    for (let file = this.FILES.FILE_A; file <= this.FILES.FILE_H; file++) {
      line += " " + this.FILE_CHAR[file] + " ";
    }
    console.log(line);
  }

  displayBoardIndices() {
    for (let rank = this.RANKS.RANK_8; rank >= this.RANKS.RANK_1; rank--) {
      let line = " ";
      for (let file = this.FILES.FILE_A; file <= this.FILES.FILE_H; file++) {
        const sq = this.FR2SQ(file, rank);
        const piece = this.pieces[sq];
        line += " " + sq + " ";
      }
      console.log(line);
    }
  }

  insuffMaterial() {
    if (this.pceNum[this.PIECES.P] !== 0 || this.pceNum[this.PIECES.p] !== 0) {
      return false;
    }
    if (this.pceNum[this.PIECES.Q] !== 0 || this.pceNum[this.PIECES.q] !== 0) {
      return false;
    }
    if (this.pceNum[this.PIECES.R] !== 0 || this.pceNum[this.PIECES.r] !== 0) {
      return false;
    }
    if (this.pceNum[this.PIECES.B] > 1 || this.pceNum[this.PIECES.b] > 1) {
      return false;
    }
    if (
      (this.pceNum[this.PIECES.B] !== 0 && this.pceNum[this.PIECES.N] !== 0) ||
      (this.pceNum[this.PIECES.b] !== 0 && this.pceNum[this.PIECES.n] !== 0)
    ) {
      return false;
    }
    return true;
  }
  threeFold() {
    let r = 0;
    for (let i = 0; i < this.hisPly; i++) {
      if (this.gameHis[i].posKey === this.posKey) {
        r++;
      }
    }
    return r;
  }
  getResult() {
    if (this.fiftyMove >= 100) {
      this.end = 1;
      return 1;
    }
    if (this.threeFold() >= 2) {
      this.end = 1;
      return 1;
    }
    if (this.insuffMaterial()) {
      this.end = 1;
      return 1;
    }
    this.generateMoves();
    for (
      let index = this.moveListStart[this.ply];
      index < this.moveListStart[this.ply + 1];
      ++index
    ) {
      const move = this.moveList[index];
      if (this.makeMove(move) != 0) {
        this.takeMove();
        return 0;
      }
    }
    this.end = 1;
    if (
      this.isSqAttacked(
        this.pList[this.PCE_INDEX(this.KINGS[this.side], 0)],
        this.side ^ 1
      )
    ) {
      return 2; // checkmate
    }
    return 1; // stalemate
  }
}
