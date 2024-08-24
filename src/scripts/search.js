export class SearchEngine {
  constructor(gameBoard) {
    this.gameBoard = gameBoard;
    this.start = Date.now();
    this.nodes = 0;
    this.best = this.gameBoard.noMove;
    this.depth = 5;
    this.stop = 0;
    this.followPv = 0;
    this.thinking = 0;
  }
  DURATIONS = [1000, 2000, 5000, 10000];

  materialScore = [
    0, // empty Square
    100, // white pawn score
    325, // white knight score
    325, // white bishop score
    550, // white rook score
    1000, // white queen score
    50000, // white king score
    -100, // black pawn score
    -325, // black knight score
    -325, // black bishop score
    -550, // black rook score
    -1000, // black queen score
    -50000, // black king score
  ];

  pawnScore = [
    0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 0, -10, -10, 0, 10, 10, 5, 0, 0, 5, 5, 0, 0,
    5, 0, 0, 10, 20, 20, 10, 0, 0, 5, 5, 5, 10, 10, 5, 5, 5, 10, 10, 10, 20, 20,
    10, 10, 10, 20, 20, 20, 30, 30, 20, 20, 20, 0, 0, 0, 0, 0, 0, 0, 0,
  ];

  knightScore = [
    0, -10, 0, 0, 0, 0, -10, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 10, 10, 10, 10, 0,
    0, 0, 0, 10, 20, 20, 10, 5, 0, 5, 10, 15, 20, 20, 15, 10, 5, 5, 10, 10, 20,
    20, 10, 10, 5, 0, 0, 5, 10, 10, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ];

  bishopScore = [
    0, 0, -10, 0, 0, -10, 0, 0, 0, 0, 0, 10, 10, 0, 0, 0, 0, 0, 10, 15, 15, 10,
    0, 0, 0, 10, 15, 20, 20, 15, 10, 0, 0, 10, 15, 20, 20, 15, 10, 0, 0, 0, 10,
    15, 15, 10, 0, 0, 0, 0, 0, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ];

  rookScore = [
    0, 0, 5, 10, 10, 5, 0, 0, 0, 0, 5, 10, 10, 5, 0, 0, 0, 0, 5, 10, 10, 5, 0,
    0, 0, 0, 5, 10, 10, 5, 0, 0, 0, 0, 5, 10, 10, 5, 0, 0, 0, 0, 5, 10, 10, 5,
    0, 0, 25, 25, 25, 25, 25, 25, 25, 25, 0, 0, 5, 10, 10, 5, 0, 0,
  ];
  kingScore = [
    0, 0, 5, 10, 10, 5, 0, 0, 0, 0, 5, 10, 10, 5, 0, 0, 0, 0, 5, 10, 10, 5, 0,
    0, 0, 0, 5, 10, 10, 5, 0, 0, 0, 0, 5, 10, 10, 5, 0, 0, 0, 0, 5, 10, 10, 5,
    0, 0, 25, 25, 25, 25, 25, 25, 25, 25, 0, 0, 5, 10, 10, 5, 0, 0,
  ];
  scores = {
    0: 0,
    1: this.pawnScore,
    2: this.knightScore,
    3: this.bishopScore,
    4: this.rookScore,
    5: this.rookScore,
    6: this.kingScore,
    7: this.pawnScore,
    8: this.knightScore,
    9: this.bishopScore,
    10: this.rookScore,
    11: this.rookScore,
    12: this.kingScore,
  };

  bishopPair = 40;

  isTimerUp() {
    if (Date.now() - this.start >= this.DURATIONS[this.thinking]) {
      this.stop = 1;
      return true;
    }
    return false;
  }

  evaluate() {
    const gameBoard = this.gameBoard;
    let score = 0;
    for (let pce = gameBoard.PIECES.P; pce <= gameBoard.PIECES.k; pce++) {
      for (let pceNum = 0; pceNum < gameBoard.pceNum[pce]; pceNum++) {
        score += this.materialScore[pce];
        let sq = gameBoard.pList[gameBoard.PCE_INDEX(pce, pceNum)];
        if (pce < 7) {
          sq = gameBoard.SQ64(sq);
          score += this.scores[pce][sq];
        } else {
          sq = gameBoard.MIRROR64(gameBoard.SQ64(sq));
          score -= this.scores[pce][sq];
        }
      }
    }
    if (gameBoard.pceNum[gameBoard.PIECES.B] > 1) {
      score += this.bishopPair;
    }
    if (gameBoard.pceNum[gameBoard.PIECES.b] > 1) {
      score -= this.bishopPair;
    }
    return gameBoard.side == gameBoard.COLORS.WHITE ? score : -score;
  }
  isRepeated(){
    const gameBoard = this.gameBoard;
    for(let index = gameBoard.hisPly - gameBoard.fiftyMove; index < gameBoard.hisPly - 1; index++){
      if (gameBoard.posKey === gameBoard.gameHis[index].posKey) {
        return true;
      }
    }
    return false;
  }
  quiescence(alpha, beta) {
    if (this.nodes % 2100 == 0) {
      this.isTimerUp();
    }

    const gameBoard = this.gameBoard;
    this.nodes++;
    
    let val = this.evaluate();
    if (val >= beta) {
      return beta;
    }
    if (val > alpha) {
      alpha = val;
    }
    gameBoard.generateCaps();
    gameBoard.sortMoves();
    for (
      let index = gameBoard.moveListStart[gameBoard.ply];
      index < gameBoard.moveListStart[gameBoard.ply + 1];
      ++index
    ) {
      const move = gameBoard.moveList[index];
      if (gameBoard.makeMove(move) == gameBoard.BOOL.FALSE) {
        continue;
      }
      const score = -this.quiescence(-beta, -alpha); // 1 inf -inf 0 -inf inf return 20
      gameBoard.takeMove();
      if (this.stop === 1) {
        return 0;
      }
      // fail-hard beta cutoff
      if (score >= beta) {
        return beta;
      }
      if (score > alpha) {
        alpha = score;
      }
    }
    // node fails low
    return alpha;
  }
  scorePvMove() {
    const gameBoard = this.gameBoard;
    this.followPv = 0;
    for (
      let index = gameBoard.moveListStart[gameBoard.ply];
      index < gameBoard.moveListStart[gameBoard.ply + 1];
      index++
    ) {
      const move = gameBoard.moveList[index];
      if (
        gameBoard.pvTable[
          gameBoard.MAX_DEPTH * gameBoard.ply + gameBoard.ply
        ] === move
      ) {
        this.followPv = 1;
        gameBoard.moveScores[index] = 2000000;
        break;
      }
    }
  }
  alphaBeta(depth, alpha, beta) {
    const gameBoard = this.gameBoard;
    gameBoard.pvLength[gameBoard.ply] = gameBoard.ply;
    if (depth < 1) {
      return this.quiescence(alpha, beta);
    }
    if (this.nodes % 2100 == 0) {
      this.isTimerUp();
    }
    this.nodes++;
    // check repetition and fifty move rule
    if (gameBoard.ply !== 0 && this.isRepeated()) {
      return 0;
    }
    const inCheck = gameBoard.isSqAttacked(
      gameBoard.pList[gameBoard.PCE_INDEX(gameBoard.KINGS[gameBoard.side], 0)],
      gameBoard.side ^ 1
    );
    if (inCheck) {
      depth++;
    }

    if (gameBoard.ply > gameBoard.MAX_DEPTH - 1) {
      return this.evaluate();
    }
    let legalMoves = 0;
    let score = -gameBoard.INFINITY;
    gameBoard.generateMoves();
    if (this.followPv !== 0) {
      this.scorePvMove();
    }
    gameBoard.sortMoves();
    for (
      let index = gameBoard.moveListStart[gameBoard.ply];
      index < gameBoard.moveListStart[gameBoard.ply + 1];
      ++index
    ) {
      const move = gameBoard.moveList[index];
      if (gameBoard.makeMove(move) == gameBoard.BOOL.FALSE) {
        continue;
      }
      legalMoves++;
      score = -this.alphaBeta(depth - 1, -beta, -alpha); // 1 inf -inf 0 -inf inf return 20
      gameBoard.takeMove();
      if (this.stop === 1) {
        return 0;
      }
      if (score >= beta) {
        if ((move & gameBoard.maskCap) === 0) {
          gameBoard.killerMoves[gameBoard.ply * 2 + 1] =
            gameBoard.killerMoves[gameBoard.ply * 2];
          gameBoard.killerMoves[gameBoard.ply * 2] = move;
        }
        return beta;
      }
      if (score > alpha) {
        if ((move & gameBoard.maskCap) === 0) {
          gameBoard.historyMoves[
            gameBoard.pieces[gameBoard.getFromSq(move)] * gameBoard.BRD_SQ_NUM +
              gameBoard.getToSq(move)
          ] += depth;
        }
        alpha = score;
        gameBoard.pvTable[gameBoard.ply * gameBoard.MAX_DEPTH + gameBoard.ply] =
          move;
        for (
          let nextPly = gameBoard.ply + 1;
          nextPly < gameBoard.pvLength[gameBoard.ply + 1];
          nextPly++
        ) {
          gameBoard.pvTable[gameBoard.ply * gameBoard.MAX_DEPTH + nextPly] =
            gameBoard.pvTable[
              (gameBoard.ply + 1) * gameBoard.MAX_DEPTH + nextPly
            ];
        }
        gameBoard.pvLength[gameBoard.ply] =
          gameBoard.pvLength[gameBoard.ply + 1];
      }
    }
    if (legalMoves === 0) {
      if (inCheck) {
        return -gameBoard.CHECKMATE + gameBoard.ply;
      } else {
        return 0;
      }
    }
    
    return alpha;
  }
  clearHistory() {
    this.nodes = 0;
    this.start = Date.now();
    this.gameBoard.ply = 0;
    this.stop = 0;
    this.followPv = 0;
    const gameBoard = this.gameBoard;
    gameBoard.historyMoves.fill(0);
    gameBoard.killerMoves.fill(0);
    gameBoard.pvLength.fill(0);
    gameBoard.pvTable.fill(0);
  }
  logPv(){
    this.gameBoard.pvTable.forEach((move, index) => {
      if (move != 0) {
        const moveChar =
        this.gameBoard.getFileRank(this.gameBoard.getFromSq(move)) +
        this.gameBoard.getFileRank(this.gameBoard.getToSq(move));
        console.log(index, moveChar);
        
      }
    })
  }
  searchPosition(depth = 2) {
    const gameBoard = this.gameBoard;
    if (gameBoard.end === 1) {
      return gameBoard.noMove;
    }
    this.clearHistory();
    let score = 0;
    for (let curDepth = 1; curDepth <= depth; curDepth++) {
      this.nodes = 0;
      this.followPv = 1;
      score = this.alphaBeta(curDepth, -31000, 31000);
      if (this.stop === 1) {
        break;
      }
      let line = "";
      for (let index = 0; index < gameBoard.pvLength[0]; index++) {
        const move = gameBoard.pvTable[index];
        const moveChar =
          gameBoard.getFileRank(gameBoard.getFromSq(move)) +
          gameBoard.getFileRank(gameBoard.getToSq(move));
        line += moveChar + " ";
      }
      console.log(
        "Score: " +
          score +
          " depth: " +
          curDepth +
          " nodes: " +
          this.nodes +
          " pv: " +
          line
      );
    }
    const moveChar =
      gameBoard.FILE_CHAR[
        gameBoard.getFileNum(
          gameBoard.getFromSq(gameBoard.pvTable[0])
        )
      ] +
      gameBoard.RANK_CHAR[
        gameBoard.getRankNum(
          gameBoard.getFromSq(gameBoard.pvTable[0])
        )
      ] +
      gameBoard.FILE_CHAR[
        gameBoard.getFileNum(
          gameBoard.getToSq(gameBoard.pvTable[0])
        )
      ] +
      gameBoard.RANK_CHAR[
        gameBoard.getRankNum(
          gameBoard.getToSq(gameBoard.pvTable[0])
        )
      ];
    console.log("Nodes: " + this.nodes + " and the best move is : " + moveChar); 
    console.log("");
    return gameBoard.pvTable[0];
  }

  playRandMove() {
    if (this.gameBoard.side == this.gameBoard.engine) {
      this.gameBoard.generateMoves();
      const listLength =
        this.gameBoard.moveListStart[this.gameBoard.ply + 1] -
        this.gameBoard.moveListStart[this.gameBoard.ply];
      const firstMv = this.gameBoard.moveListStart[this.gameBoard.ply];
      const randInd = Math.floor(firstMv + Math.random() * listLength);
      console.log(firstMv, randInd, listLength);
      const randMove = this.gameBoard.moveList[randInd];
      return this.gameBoard.makeMove(randMove);
    }
    return 0;
  }

  print_move_scores() {
    const gameBoard = this.gameBoard;
    for (
      let moveInd = gameBoard.moveListStart[gameBoard.ply];
      moveInd < gameBoard.moveListStart[gameBoard.ply + 1];
      moveInd++
    ) {
      const move = gameBoard.moveList[moveInd];
      const score = gameBoard.moveScores[moveInd];
      const moveChar =
        gameBoard.getFileRank(gameBoard.getFromSq(move)) +
        gameBoard.getFileRank(gameBoard.getToSq(move));
      if (score === 2000000) {
        console.log("move: " + moveChar + "  Score: " + score);
      }
    }
  }
}
