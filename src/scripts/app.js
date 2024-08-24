import { Board } from "./board.js";
import { SearchEngine } from "./search.js";
import * as ui from "./ui.js";
class Game {
  constructor() {
    this.bindHelperFunctions();
    this.gameBoard = new Board();
    this.boundedMHandlers = new Map();
    this.boundedDHandlers = this.displayMoves.bind(this);
    this.searchEngine = new SearchEngine(this.gameBoard);
    this.isSwitched = 0;
    this.pValue = this.gameBoard.KINGS[this.gameBoard.player] - 1;
    this.fenBtn = document.querySelector("#fen-submit");
    this.fenBtn.addEventListener("click", this.sendFen.bind(this));
    this.switchBtn = document.querySelector("#switch-btn");
    this.switchBtn.addEventListener("click", this.switchSides.bind(this));
    this.promDown = document.querySelector("#prom-down");
    this.promDown.addEventListener("click", () => {
      this.toggleDropDown();
    });
    this.thinkDown = document.querySelector("#think-down");
    this.thinkDown.addEventListener("click", () => {
      this.toggleDropDown("thinks");
    });
    this.parseHandler(this.gameBoard.START_FEN);
    // this.parseHandler(this.gameBoard.TEMP_FEN);
    // this.parseHandler("1q6/2b2ppb/4p1k1/7p/2Np1p1P/3P1Q2/6PK/8 w - - 0 1");
    // this.parseHandler("8/8/3K4/3p4/8/8/3q1k2/1q6 b - - 0 1");
    // this.parseHandler(this.gameBoard.MATE_FEN);
    // this.parseHandler(this.gameBoard.STALE_FEN);
    // this.parseHandler(this.gameBoard.CMK_FEN);
    // this.parseHandler(this.gameBoard.TRICKY_FEN);
    // this.parseHandler(this.gameBoard.PROMOTE_FEN);
    this.gameBoard.checkBoard();
  }

  bindHelperFunctions() {
    for (const [name, func] of Object.entries(ui)) {
      this[name] = func.bind(this);
    }
  }

  showModal(helperText = "LOST") {
    const backdrop = document.querySelector(".backdrop");
    const rematchBtn = document.getElementById("rematch-btn");
    document.getElementById("result").textContent = helperText;
    rematchBtn.addEventListener("click", () => {
      this.toggleBackdrop();
      this.parseHandler(this.gameBoard.START_FEN);
    });
    backdrop.addEventListener("click", (event) => {
      if (event.target === backdrop) {
        this.toggleBackdrop();
      }
    });
    this.toggleBackdrop();
  }

  updateResult() {
    const result = this.gameBoard.getResult();
    let flag = false;
    switch (result) {
      case 1: //stalemate
        this.showModal("TIED");
        flag = true;
        break;
      case 2:
        this.showModal(
          (this.gameBoard.side ^ 1) === this.gameBoard.player ? "WON" : "LOST"
        );
        flag = true;
        break;
    }
    return flag;
  }

  paintBoard() {
    const boardContainer = document.querySelector("#board");
    const gameBoard = this.gameBoard;
    boardContainer.innerHTML = "";
    for (let sq = 63; sq >= 0; sq--) {
      const sqContainer = document.createElement("span");
      let rank, file;
      if (this.isSwitched === 0) {
        rank = gameBoard.getRankNum(gameBoard.SQ120(sq));
        file = gameBoard.getFileNum(gameBoard.SQ120(sq));
        sqContainer.id = `${sq}`;
      } else {
        rank = gameBoard.getRankNum(gameBoard.SQ120(gameBoard.MIRROR64(sq)));
        file = gameBoard.getFileNum(gameBoard.SQ120(gameBoard.MIRROR64(sq)));
        sqContainer.id = `${gameBoard.MIRROR64(sq)}`;
      }
      const sqStyle =
        (rank + file) % 2 === 0
          ? "bg-orange-900 flex justify-center items-center aspect-square" // lightSq
          : "bg-orange-200 flex justify-center items-center aspect-square"; // darkSq
      sqContainer.classList = sqStyle;
      boardContainer.append(sqContainer);
    }
  }

  updateBoard() {
    this.paintBoard();
    const gameBoard = this.gameBoard;
    const searchEngine = this.searchEngine;
    const squares = document.querySelectorAll("#board span");
    squares.forEach((sq) => {
      const sq120 = gameBoard.SQ120(parseInt(sq.id));
      const pce = gameBoard.PIECE_CHAR[gameBoard.pieces[sq120]];
      if (pce != gameBoard.PIECE_CHAR[gameBoard.PIECES.EMPTY]) {
        const pceImg = document.createElement("img");
        pceImg.src = `..\\pics\\${pce}.svg`;
        sq.append(pceImg);
        pceImg.parentElement.classList.add("cursor-pointer");
        pceImg.parentElement.addEventListener("click", this.boundedDHandlers);
      }
    });
    if (gameBoard.side === gameBoard.engine) {
      setTimeout(() => {
        const move = searchEngine.searchPosition(this.gameBoard.MAX_DEPTH);
        if (move !== gameBoard.noMove) {
          this.moveHandler(move);
          this.updateBoard();
        }
      }, 500);
    }
  }

  parseHandler(fen){
    const gameBoard = this.gameBoard;
    gameBoard.parseFen(fen);
    if (gameBoard.player === gameBoard.COLORS.WHITE && this.isSwitched === 1) {
      this.flipBoard();
    }else if(gameBoard.player === gameBoard.COLORS.BLACK && this.isSwitched === 0){
      this.flipBoard();
    }
    this.updateBoard()
  }
  sendFen() {
    const fenInp = document.querySelector("#fen");
    if (fenInp.value.trim() !== "") {
      this.parseHandler(fenInp.value.trim());
      this.updateBoard();
    } else {
      alert("Fill the input first");
    }
  }

  displayMoves(event) {
    this.unMarkSquares();
    const gameBoard = this.gameBoard;
    const sq64 = event.target.parentElement.id;
    const sq120 = gameBoard.SQ120(sq64);
    gameBoard.generateMoves();
    for (
      let index = gameBoard.moveListStart[gameBoard.ply];
      index < gameBoard.moveListStart[gameBoard.ply + 1];
      index++
    ) {
      const move = gameBoard.moveList[index];
      const toSq = gameBoard.getToSq(move);
      const fromSq = gameBoard.getFromSq(move);
      if (
        fromSq !== sq120 ||
        gameBoard.makeMove(move) == gameBoard.BOOL.FALSE
      ) {
        continue;
      }
      gameBoard.takeMove();
      if ((move & gameBoard.maskProm) != 0) {
        if (gameBoard.getPromotion(move) != this.pValue) {
          continue;
        }
      }
      const id = gameBoard.SQ64(toSq);
      this.markSq(id);
      this.moveEventHandler(id, true, move);
    }
  }

  markSq(trgId) {
    const trgSq = document.getElementById(trgId);
    trgSq.classList.toggle("border-4");
    trgSq.classList.toggle("border-green-600");
    trgSq.classList.toggle("cursor-pointer");
  }

  unMarkSquares() {
    const squares = document.querySelectorAll("#board span");
    squares.forEach((sq) => {
      if (sq.classList.contains("border-4")) {
        this.moveEventHandler(parseInt(sq.id), false);
        sq.classList.remove("border-4");
        sq.classList.remove("border-green-600");
        sq.classList.remove("cursor-pointer");
      }
    });
  }
  playSound(move) {
    const gameBoard = this.gameBoard;
    let url = "quite";
    if ((move & gameBoard.maskCastle) !== 0) {
      url = "castle";
    }
    if ((move & gameBoard.maskProm) !== 0) {
      url = "promote";
    }
    if ((move & gameBoard.maskCap) !== 0) {
      url = "capture";
    }
    if (
      gameBoard.isSqAttacked(
        gameBoard.pList[
          gameBoard.PCE_INDEX(gameBoard.KINGS[gameBoard.side], 0)
        ],
        gameBoard.side ^ 1
      )
    ) {
      url = "check";
    }
    if (gameBoard.end !== 0) {
      url = "end"
    }
    const moveSound = new Audio(`../sounds/${url}.mp3`);
    moveSound.play();
  }
  moveHandler(move = this.gameBoard.noMove) {
    if (move !== this.gameBoard.noMove) {
      this.gameBoard.makeMove(move);
    } else {
      this.gameBoard.takeMove();
    }
    this.updateBoard();
    this.updateResult();
    this.playSound(move);
  }

  moveEventHandler(id, flag, move = null) {
    const boundMHandler = flag
      ? this.moveHandler.bind(this, move)
      : this.boundedMHandlers.get(id);
    const trgSq = document.getElementById(id);
    if (flag) {
      this.boundedMHandlers.set(id, boundMHandler);
      trgSq.addEventListener("click", boundMHandler);
      trgSq.removeEventListener("click", this.boundedDHandlers);
      return;
    } else {
      trgSq.removeEventListener("click", boundMHandler);
      this.boundedMHandlers.delete(id);
      trgSq.addEventListener("click", this.boundedDHandlers);
    }
  }

  switchSides() {
    const gameBoard = this.gameBoard;
    this.pValue = gameBoard.KINGS[gameBoard.player] - 1;
    gameBoard.player ^= 1;
    gameBoard.engine ^= 1;
    this.flipBoard();
  }
  flipBoard(){
    this.isSwitched ^= 1;
    const boardContainer = document.querySelector("#board");
    boardContainer.classList.toggle("rtl-grid");
    this.updateBoard();

  }
}
const game = new Game();
