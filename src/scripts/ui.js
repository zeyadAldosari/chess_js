export function toggleBackdrop() {
  const backdrop = document.body.querySelector(".backdrop");
  const modal = document.querySelector(".modal");
  backdrop.classList.toggle("hidden");
  backdrop.classList.toggle("flex");
  setTimeout(() => {
    backdrop.classList.toggle("opacity-100");
    modal.classList.toggle("opacity-100");
    modal.classList.toggle("translate-y-0");
  }, 10);
}

export function updateButtonStyles() {
  buttonSelectors.forEach((button) => {
    button.classList.remove(
      "bg-orange-500",
      "text-white",
      "ring-2",
      "ring-white"
    );
    button.classList.add("bg-gray-700", "text-gray-400", "hover:bg-gray-500");
  });
}
export function getThinkId() {
  return `think-${this.searchEngine.thinking}`;
}
export function getPromId() {
  const gameBoard = this.gameBoard;
  switch (this.pValue) {
    case gameBoard.PIECES.Q:
    case gameBoard.PIECES.q:
      return "queen-prom";
    case gameBoard.PIECES.R:
    case gameBoard.PIECES.r:
      return "rock-prom";
    case gameBoard.PIECES.b:
    case gameBoard.PIECES.B:
      return "bishop-prom";
    case gameBoard.PIECES.N:
    case gameBoard.PIECES.n:
      return "knight-prom";
    default:
      return "queen-prom";
  }
}
export function clearCheckedElement(id = "proms") {
  let promElement;
  if (id === "proms") {
    promElement = document.getElementById(this.getPromId());
  } else {
    promElement = document.getElementById(this.getThinkId());
  }
  if (promElement.childNodes[1]) {
    promElement.childNodes[1].remove();
  }
}

export function checkElement(id = "proms") {
  let checkedProm;
  if (id === "proms") {
    checkedProm = document.getElementById(this.getPromId());
  } else {
    checkedProm = document.getElementById(this.getThinkId());
  }
  const checkedSvg = `<svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                  class=""
                >
                  <path
                    fill="currentColor"
                    d="m9.55 18l-5.7-5.7l1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4z"
                  />
                </svg>`;
  checkedProm.innerHTML += checkedSvg;
}

export function changeElement(pElement) {
  switch (pElement.id) {
    case "queen-prom":
      this.pValue = this.gameBoard.player === 0 ? 5 : 11;
      break;
    case "rock-prom":
      this.pValue = this.gameBoard.player === 0 ? 4 : 10;
      break;
    case "bishop-prom":
      this.pValue = this.gameBoard.player === 0 ? 3 : 9;
      break;
    case "knight-prom":
      this.pValue = this.gameBoard.player === 0 ? 2 : 8;
      break;
    default:
      this.searchEngine.thinking = parseInt(pElement.id.slice(-1), 10);
      this.checkElement("thinks");
      return;
  }
  this.checkElement();
}

export function toggleDropDown(id = "proms") {
  const list = document.getElementById(id);
  list.classList.toggle("hidden");
  setTimeout(() => {
    list.classList.toggle("opacity-100");
    list.classList.toggle("translate-x-12");
  }, 100);
  this.toggleSvg(id);
  if (!list.classList.contains("hidden")) {
    this.clearCheckedElement(id);
    this.checkElement(id);
    list.childNodes.forEach((element) => {
      element.addEventListener("click", () => {
        this.clearCheckedElement(id);
        this.changeElement(element);
      });
    });
  }
}

export function toggleSvg(id) {
  const up = document.getElementById(id + "-drop-up");
  const down = document.getElementById(id + "-drop-down");
  up.classList.toggle("hidden");
  down.classList.toggle("hidden");
}
