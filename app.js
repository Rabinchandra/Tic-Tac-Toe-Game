let game_board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ],
  game_end = false;
pcLastPos = null;
// Rendering Game Board to DOM
const renderGameBoard = function () {
  document.querySelector(".game-board").innerHTML = `
        <div id="00">${game_board[0][0]}</div>
        <div id="01">${game_board[0][1]}</div>
        <div id="02">${game_board[0][2]}</div>
        <div id="10">${game_board[1][0]}</div>
        <div id="11">${game_board[1][1]}</div>
        <div id="12">${game_board[1][2]}</div>
        <div id="20">${game_board[2][0]}</div>
        <div id="21">${game_board[2][1]}</div>
        <div id="22">${game_board[2][2]}</div>
    `;
};

const isDraw = function () {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (!game_board[i][j]) return false;
    }
  }
  return true;
};

const fillPos = function (pos) {
  if (pos == null) {
    return null;
  }
  if (pos == pcLastPos) {
    const posMatches = generateMatches(`${pos[0]}${pos[1]}`);
    return pcPos(posMatches, pos);
  }
  if (!game_board[~~pos[0]][~~pos[1]]) {
    const posMatches = generateMatches(pos);
    game_board[~~pos[0]][~~pos[1]] = "X";
    if (hasWon(pos, posMatches)) {
      return;
    }
    return pcPos(posMatches, pos);
  }
};

const pcPos = function (posMatches, pos) {
  // PC'S TURN

  let aPos = [~~pos[0], ~~pos[1]],
    a = game_board[aPos[0]][aPos[1]];
  for (let i = 0; i < posMatches.length; i++) {
    let bPos = [~~posMatches[i][0][0], ~~posMatches[i][0][1]],
      cPos = [~~posMatches[i][1][0], ~~posMatches[i][1][1]],
      b = game_board[bPos[0]][bPos[1]],
      c = game_board[cPos[0]][cPos[1]];
    // if any two of matches are equal,
    // then attack or defence
    if (a === b || a === c) {
      if (a === b) {
        return cPos;
      } else if (c === a) {
        return bPos;
      }
    }
  }
  return null;
};

// Function to check if won
const hasWon = function (pos, posMatches) {
  let aPos = [~~pos[0], ~~pos[1]],
    a = game_board[aPos[0]][aPos[1]];
  for (let i = 0; i < posMatches.length; i++) {
    let b = game_board[~~posMatches[i][0][0]][~~posMatches[i][0][1]],
      c = game_board[~~posMatches[i][1][0]][~~posMatches[i][1][1]];
    if (a === b && b === c) {
      alert("You won!");
      game_end = true;
      return true;
    }
  }
  return false;
};

// Generating a random postion which is still not filled
const fillRandomPos = function () {
  if (!isDraw()) {
    const row = parseInt(Math.random() * 3);
    const col = parseInt(Math.random() * 3);
    if (!game_board[row][col]) {
      game_board[row][col] = "O";
      pcLastPos = [row, col];
      return;
    } else {
      fillRandomPos();
    }
  } else {
    if (!game_end) {
      setTimeout(() => {
        alert("GAME DRAW");
        game_end = true;
      }, 500);
    }
  }
};

const inputPos = function (pos) {
  const defencePos = fillPos(pos);
  const attackPos = fillPos(pcLastPos);
  //   Two cases of attack pos being null
  // 1. pclastpos is null
  // 2. attack pos not found either filled or not available
  if (!game_end) {
    if (attackPos == null) {
      if (pcLastPos == null) {
        fillRandomPos();
      } else {
        defence(defencePos);
      }
    } else {
      if (!attack(attackPos)) {
        defence(defencePos);
      }
    }
  }

  renderGameBoard();
};

const attack = function (attackPos) {
  if (game_board[attackPos[0]][attackPos[1]] === "") {
    game_board[attackPos[0]][attackPos[1]] = "O";
    alert("PC WINS");
    game_end = true;
    return true;
  }
  return false;
};

const defence = function (defencePos) {
  if (defencePos == null) {
    fillRandomPos();
    return;
  }
  if (game_board[defencePos[0]][defencePos[1]] == "") {
    game_board[defencePos[0]][defencePos[1]] = "O";
    pcLastPos = defencePos;
  } else {
    fillRandomPos();
  }
};

// Reset game
const resetGame = function () {
  game_board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  game_end = false;
  pcLastPos = null;
  renderGameBoard();
};

// Generate all the rows and cols matches (or to be checked)
const generateMatches = function (a) {
  let matches = null;
  switch (a) {
    case "00":
      matches = [
        ["01", "02"],
        ["10", "20"],
        ["11", "22"],
      ];
      break;
    case "01":
      matches = [
        ["00", "02"],
        ["11", "21"],
      ];
      break;
    case "02":
      matches = [
        ["00", "01"],
        ["12", "22"],
        ["11", "20"],
      ];
      break;
    case "10":
      matches = [
        ["00", "20"],
        ["11", "12"],
      ];
      break;
    case "11":
      matches = [
        ["01", "21"],
        ["10", "12"],
        ["00", "22"],
        ["02", "20"],
      ];
      break;
    case "12":
      matches = [
        ["02", "22"],
        ["10", "11"],
      ];
      break;
    case "20":
      matches = [
        ["10", "00"],
        ["21", "22"],
        ["11", "02"],
      ];
      break;
    case "21":
      matches = [
        ["01", "11"],
        ["20", "22"],
      ];
      break;
    case "22":
      matches = [
        ["12", "02"],
        ["20", "21"],
        ["00", "11"],
      ];
      break;
  }
  return matches;
};

renderGameBoard();

const game_board_ui = document.querySelector(".game-board");
const reset = document.querySelector("#reset");

// User input event
game_board_ui.addEventListener("click", (e) => {
  if (e.target.innerText == "" && !game_end) {
    inputPos(e.target.id);
  }
});

// Reset Event
reset.addEventListener("click", () => resetGame());
