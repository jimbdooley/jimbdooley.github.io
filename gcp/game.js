
function shuffle(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    const swapI = i + Math.floor((arr.length - i)*Math.random());
    const temp = arr[swapI];
    arr[swapI] = arr[i];
    arr[i] = temp;
  }
}

function copyCard(gemToCopy) {
  const rtn = {};
  for (const key in gemToCopy) {
    rtn[key] = gemToCopy[key];
  }
  return rtn;
}

function setupBoard(state) {
  if (state.board.length > 1) console.log("ERROR: setting up non-empty board");
  if (G.gameState.grid < G.levels[G.gameState.level].grids.length) {
    for (const row of G.levels[G.gameState.level].grids[G.gameState.grid]) {
      for (let i = 0; i < row.length; i++) {
        let spot = row[i] == 'o' ? -1 : -2;
        state.board.push(spot);
      }
    }
  } 
}

function mouseLocIn(loc, x, y, dx, dy) {
  return x <= loc[0] && loc[0] <= x + dx && y <= loc[1] && loc[1] <= y + dy;
}

function mouseHandIntersect(mouseLoc) {
  for (let i = 0; i < G.physState.hand.length; i++) {
    const pos = G.gameState.cards[G.physState.hand[i]].currPos;
    const pos_h = G.CARD_HW*pos.w;
    if (pos.x - pos.w/2 <= mouseLoc[0]
        && mouseLoc[0] <= pos.x + pos.w/2
        && pos.y - pos_h/2 <= mouseLoc[1]
        && mouseLoc[1] <= pos.y + pos_h/2) return i;
  }
  return -1;
}

function mouseBoardIntersect(mouseLoc, unitSize) {
  let endRow = -1;
  let endCol = -1; 
  const grid = G.levels[G.gameState.level].grids[G.gameState.grid];
  const x0 = G.regions.field.x + G.regions.field.w/2 - unitSize*grid[0].length/2;
  const y0 = G.regions.field.y + G.regions.field.h/2 - unitSize*grid.length/2;
  for (let row_i = 0; row_i < grid.length; row_i++) {
    for (let col_i = 0; col_i < grid[0].length; col_i++) {
      if (x0 + col_i*unitSize <= mouseLoc[0] 
          && mouseLoc[0] <= x0 + (1 + col_i)*unitSize
          && y0 + row_i*unitSize <= mouseLoc[1] 
          && mouseLoc[1] <= y0 + (1 + row_i)*unitSize) {
        endRow = row_i;
        endCol = col_i;
      }
    }
  }
  return endRow == -1 ? -1 : grid[0].length*endRow + endCol;
}

function checkForHandToBoard(unitSize=75) {
  const startI = mouseHandIntersect(G.M.lastDown);
  const endI = mouseBoardIntersect(G.M.lastUp, unitSize);
  if (startI == -1 || endI == -1 || G.physState.board[endI] == -2) return null;
  if (G.physState.board[endI] == -1) {
    G.physState.board[endI] = G.physState.hand[startI];
    G.physState.hand.splice(startI, 1);
  } else {
    const temp = G.physState.board[endI];
    G.physState.board[endI] = G.physState.hand[startI];
    G.physState.hand[startI] = temp;
  }
  G.gameState.animTotal = 20;
  G.gameState.animating = 20;
}

function checkForBoardToHand(unitSize=75) {
  const startI = mouseBoardIntersect(G.M.lastDown, unitSize);
  const endsInHand = G.M.lastUp[1] > G.regions.hand.y;
  if (startI == -1 || !endsInHand || G.physState.board[startI] < 0) return;
  G.physState.hand.push(G.physState.board[startI]);
  G.physState.board[startI] = -1;
  G.gameState.animTotal = 20;
  G.gameState.animating = 20;
}

function checkForFinish() {
  const pressed = mouseLocIn(G.M.lastDown, 0, 0, 100, 100);
  const released = mouseLocIn(G.M.lastUp, 0, 0, 100, 100);
  if (!(pressed && released && G.M.justUp)) return;
  const grid = G.levels[G.gameState.level].grids[G.gameState.grid];
  for (let i = 0; i < grid.length; i++) {
    if (-1 == G.physState.board[grid[i].length*i]) return;
    let sameShapes = true;
    let sameColors = true;
    for (let j = 1; j < grid[i].length; j++) {
      const cardId = G.physState.board[grid[i].length*i + j];
      const prevId = G.physState.board[grid[i].length*i + j - 1];
      if (-1 == cardId) return;
      if (-2 == cardId) {
        sameShapes = true;
        sameColors = true;
        continue;
      }
      if (prevId >= 0) {
        sameColors &= G.gameState.cards[cardId].color ==  G.gameState.cards[prevId].color;
        sameShapes &= G.gameState.cards[cardId].shape ==  G.gameState.cards[prevId].shape;
        if (!sameColors && !sameShapes) return;
      }
    }
  }
  for (let j = 0; j < grid[0].length; j++) {
    if (-1 == G.physState.board[j]) return;
    let sameShapes = true;
    let sameColors = true;
    for (let i = 1; i < grid.length; i++) {
      const cardId = G.physState.board[grid[i].length*i + j];
      const prevId = G.physState.board[grid[i].length*(i - 1) + j];
      if (-1 == cardId) return;
      if (-2 == cardId) {
        sameShapes = true;
        sameColors = true;
        continue;
      }
      if (prevId >= 0) {
        sameColors &= G.gameState.cards[cardId].color ==  G.gameState.cards[prevId].color;
        sameShapes &= G.gameState.cards[cardId].shape ==  G.gameState.cards[prevId].shape;
        if (!sameColors && !sameShapes) return;
      }
    }
  }
  for (let i = G.physState.board.length - 1; i >= 0; i--) {
    if (G.physState.board[i] >= 0) {
      G.physState.deck.push(G.physState.board[i]);
    }
    G.physState.board.pop(); 
  }
  shuffle(G.physState.deck);
  G.gameState.grid += 1;
  if (G.gameState.grid >= G.levels.length) {
    gcp_done = true
    return
  }
  let toDraw = 0;
  const newGrid = G.levels[G.gameState.level].grids[G.gameState.grid];
  for (let i = 0; i < newGrid.length; i++) {
    for (let j = 0; j < newGrid[i].length; j++) {
      G.physState.board.push(newGrid[i][j] == "o" ? -1 : -2);
      toDraw += newGrid[i][j] == "o" ? 1 : 0;
    }
  }
  for (let i = 0; i < toDraw; i++) {
    G.physState.hand.push(G.physState.deck.pop());
  }
  G.gameState.animTotal = 30;
  G.gameState.animating = 30;
}

let gcp_done = false
function playGame() {
  if (gcp_done) return
  requestAnimationFrame(playGame);

  if (G.M.justUp && G.gameState.animating == 0) {
    checkForHandToBoard();
    checkForBoardToHand();
    checkForFinish();
  }

  showGame();
  G.M.justUp = false;
  G.M.justDown = false;
}

function gameInit(level) {
  G.prevState = {
    hand: [],
    board: [],
    deck: [],
    discard: [],
  }
  G.physState = {
    hand: [],
    board: [],
    deck: [],
    discard: [],
  }
  G.gameState = {
    cards: {},
    level: level,
    grid: 0,
    animating: 80,
    animTotal: 80,
  }

  for (const card of G.levels[level].cards) {
    G.gameState.cards[card.id] = copyCard(card);
    G.gameState.cards[card.id].currPos = {x: -1, y: -1, w: -1};
    G.gameState.cards[card.id].prevPos = {x: -1, y: -1, w: -1};
    G.prevState.deck.push(card.id);
    G.physState.deck.push(card.id);
  }
  for (let i = 0; i < 1000; i++) {
    const i1 = Math.floor(G.prevState.deck.length*Math.random());
    const i2 = Math.floor(G.prevState.deck.length*Math.random());
    const temp = G.prevState.deck[i1];
    G.prevState.deck[i1] = G.prevState.deck[i2];
    G.prevState.deck[i2] = temp;
    G.physState.deck[i1] = G.prevState.deck[i1];
    G.physState.deck[i2] = G.prevState.deck[i2];
  }
  for (let i = 0; i < G.levels[level].startingHandSize; i++) {
    G.physState.hand.push(G.physState.deck[G.physState.deck.length-1]);
    G.physState.deck.pop();
  }
  setupBoard(G.prevState);
  setupBoard(G.physState);
}

