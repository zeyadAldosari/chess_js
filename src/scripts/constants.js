export class Constants {
  BRD_SQ_NUM = 120;
  MAX_MOVES = 2048;
  MAX_POSITION_MOVES = 256;
  MAX_DEPTH = 64;
  START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  TEMP_FEN = "8/2p5/3p4/KP5r/1R2P1Pk/8/5p2/8 w - - 0 3";
  MATE_FEN = "8/8/6pr/6p1/5pPk/5P1p/5P1K/R7 w - - 0 1";
  STALE_FEN = "4k3/8/5K2/8/1Q6/8/8/8 w - - 0 1";
  TRICKY_FEN = "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1";
  CMK_FEN =
    "r2q1rk1/ppp2ppp/2n1bn2/2b1p3/3pP3/3P1NPP/PPP1NPB1/R1BQ1RK1 b - - 0 9 ";
  PROMOTE_FEN =
    "8/8/2K5/8/3k4/8/5p2/8 b - - 0 1";
  SIDE_CHAR = "wb-";
  PIECE_CHAR = ".PNBRQKpnbrqk";
  RANK_CHAR = "12345678";
  FILE_CHAR = "ABCDEFGH";
  CHECKMATE = 30000;
  INFINITY = 31000;
  
  FILES = {
    FILE_A: 0,
    FILE_B: 1,
    FILE_C: 2,
    FILE_D: 3,
    FILE_E: 4,
    FILE_F: 5,
    FILE_G: 6,
    FILE_H: 7,
    FILE_NONE: 8,
  };
  RANKS = {
    RANK_1: 0,
    RANK_2: 1,
    RANK_3: 2,
    RANK_4: 3,
    RANK_5: 4,
    RANK_6: 5,
    RANK_7: 6,
    RANK_8: 7,
    RANK_NONE: 8,
  };
  SQUARES = {
    A1: 21,
    B1: 22,
    C1: 23,
    D1: 24,
    E1: 25,
    F1: 26,
    G1: 27,
    H1: 28,
    A8: 91,
    B8: 92,
    C8: 93,
    D8: 94,
    E8: 95,
    F8: 96,
    G8: 97,
    H8: 98,
    NO_SQ: 99, 
    OFF_BOARD: 100,
  };
  CASTLE_BIT = {
    WKCA: 1,
    WQCA: 2,
    BKCA: 4,
    BQCA: 8,
  };
  COLORS = {
    WHITE: 0,
    BLACK: 1,
    BOTH: 2,
  };

  BOOL = {
    FALSE: 0,
    TRUE: 1,
  };

  MOVE_TYPE = {
    QUITE: 0,
    CASTLE: 1,
    CAPTURE: 2,
    PROMOTE: 3
  };

  filesBrd = new Array(this.BRD_SQ_NUM);
  ranksBrd = new Array(this.BRD_SQ_NUM);
  pieceKeys = new Array(13 * 120);
  castleKeys = new Array(16);
  sq64to120 = new Array(64);
  sq120to64 = new Array(this.BRD_SQ_NUM);

  castlePermArr = [
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 13, 15, 15, 15, 12, 15, 15, 14, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 7, 15, 15, 15,
    3, 15, 15, 11, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15,
  ];

  PIECES = {
    EMPTY: 0,
    P: 1,
    N: 2,
    B: 3,
    R: 4,
    Q: 5,
    K: 6,
    p: 7,
    n: 8,
    b: 9,
    r: 10,
    q: 11,
    k: 12,
  };
  
  KINGS = [this.PIECES.K, this.PIECES.k, 0];
  
  PieceVal = [
    0, 100, 325, 325, 550, 1000, 50000, 100, 325, 325, 550, 1000, 50000,
  ];
  PieceColor = [
    this.COLORS.BOTH,
    this.COLORS.WHITE,
    this.COLORS.WHITE,
    this.COLORS.WHITE,
    this.COLORS.WHITE,
    this.COLORS.WHITE,
    this.COLORS.WHITE,
    this.COLORS.BLACK,
    this.COLORS.BLACK,
    this.COLORS.BLACK,
    this.COLORS.BLACK,
    this.COLORS.BLACK,
    this.COLORS.BLACK,
  ];

  PiecePawn = [
    this.BOOL.FALSE,
    this.BOOL.TRUE,
    this.BOOL.FALSE,
    this.BOOL.FALSE,
    this.BOOL.FALSE,
    this.BOOL.FALSE,
    this.BOOL.FALSE,
    this.BOOL.TRUE,
    this.BOOL.FALSE,
    this.BOOL.FALSE,
    this.BOOL.FALSE,
    this.BOOL.FALSE,
    this.BOOL.FALSE,
  ];

  OFFSETS = {
    P: [11, 9],
    p: [-11, -9],
    KNIGHT: [-21, -19, 21, 19, -12, -8, 12, 8],
    BISHOP: [-11, -9, 9, 11],
    ROCK: [-10, -1, 1, 10],
    KING: [1, -1, 10, 9, 11, -10, -9, -11],
  };
  OFFSETS_NUM = [0, 0, 8, 4, 4, 8, 8, 0, 8, 4, 4, 8, 8];
  PIECE_Off_Arr = [
    0,
    0,
    this.OFFSETS.KNIGHT,
    this.OFFSETS.BISHOP,
    this.OFFSETS.ROCK,
    this.OFFSETS.KING,
    this.OFFSETS.KING,
    0,
    this.OFFSETS.KNIGHT,
    this.OFFSETS.BISHOP,
    this.OFFSETS.ROCK,
    this.OFFSETS.KING,
    this.OFFSETS.KING,
  ];

  FR2SQ(file, rank) {
    return 21 + file + 10 * rank;
  }

  RAND_32() {
    return (
      (Math.floor(Math.random() * 255 + 1) << 23) |
      (Math.floor(Math.random() * 255 + 1) << 16) |
      (Math.floor(Math.random() * 255 + 1) << 8) |
      Math.floor(Math.random() * 255 + 1)
    );
  }

  from64to120(square) {
    const columns = 8;
    const rank = Math.floor(square / columns);
    const file = square % columns;
    return 20 + rank * 10 + file + 1;
  }
  from120to64(square) {
    const columns = 10;
    const row = Math.floor((square - 20) / columns);
    const file = ((square - 20) % columns) - 1;
    return row * 8 + file;
  }

  SQ64(sq120) {
    return this.sq120to64[sq120];
  }

  SQ120(sq64) {
    return this.sq64to120[sq64];
  }

  PCE_INDEX(pce, pceNum) {
    return pce * 10 + pceNum;
  }
  getFileNum(sq120) {
    return (sq120 % 10) - 1;
  }
  getRankNum(sq120) {
    return Math.floor(sq120 / 10) - 2;
  }
  getFileRank(square) {
    return (
      this.FILE_CHAR[this.filesBrd[square]] +
      this.RANK_CHAR[this.ranksBrd[square]]
    );
  }


  // masks for move bits:
  maskEnPass = 0x40000;
  maskPawnStart = 0x80000;
  maskCastle = 0x1000000;
  maskCap = 0x7C000;
  maskProm = 0xf00000;
  noMove = 0;
  getFromSq(move) {
    return move & 0x7f;
  }
  getEnPass(move) {
    return move & 0x40000;
  }
  getToSq(move) {
    return (move >> 7) & 0x7f;
  }
  getCaptured(move) {
    return (move >> 14) & 0xf;
  }
  getPromotion(move) {
    return (move >> 20) & 0xf;
  }
  hashPce(pce, sq) {
    return (this.posKey ^= this.pieceKeys[pce * 120 + sq]);
  }
  hashCastle() {
    return (this.posKey ^= this.castleKeys[this.castlePermission]);
  }
  hashSide() {
    return (this.posKey ^= this.SideKey);
  }
  hashEnPas() {
    return (this.posKey ^= this.pieceKeys[this.enPas]);
  }

  Mirror64 = [
    56, 57, 58, 59, 60, 61, 62, 63, 48, 49, 50, 51, 52, 53, 54, 55, 40, 41, 42,
    43, 44, 45, 46, 47, 32, 33, 34, 35, 36, 37, 38, 39, 24, 25, 26, 27, 28, 29,
    30, 31, 16, 17, 18, 19, 20, 21, 22, 23, 8, 9, 10, 11, 12, 13, 14, 15, 0, 1,
    2, 3, 4, 5, 6, 7,
  ];

  MIRROR64(sq) {
    return this.Mirror64[sq];
  }
  mvvLva = [
    105, 205, 305, 405, 505, 605,  105, 205, 305, 405, 505, 605,
    104, 204, 304, 404, 504, 604,  104, 204, 304, 404, 504, 604,
    103, 203, 303, 403, 503, 603,  103, 203, 303, 403, 503, 603,
    102, 202, 302, 402, 502, 602,  102, 202, 302, 402, 502, 602,
    101, 201, 301, 401, 501, 601,  101, 201, 301, 401, 501, 601,
    100, 200, 300, 400, 500, 600,  100, 200, 300, 400, 500, 600,
  
    105, 205, 305, 405, 505, 605,  105, 205, 305, 405, 505, 605,
    104, 204, 304, 404, 504, 604,  104, 204, 304, 404, 504, 604,
    103, 203, 303, 403, 503, 603,  103, 203, 303, 403, 503, 603,
    102, 202, 302, 402, 502, 602,  102, 202, 302, 402, 502, 602,
    101, 201, 301, 401, 501, 601,  101, 201, 301, 401, 501, 601,
    100, 200, 300, 400, 500, 600,  100, 200, 300, 400, 500, 600
    ];
  MVVLVA_INDEX(attacker, victim){
    return (attacker - 1) * 12 + (victim - 1);
  }
}
