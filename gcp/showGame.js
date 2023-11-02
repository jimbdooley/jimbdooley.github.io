

function set_xyw(state, id, pos, unitSize=75) {
  if (state.hand.indexOf(id) != -1) {
    const x0 = gcp_canvas.width/2 - 70*(state.hand.length - 1)/2;
    pos.x = x0 + 70*state.hand.indexOf(id);
    pos.y = G.regions.hand.y + G.regions.hand.h/2;
    pos.w = 50
  }
  if (state.deck.indexOf(id) != -1) {
    pos.x = gcp_canvas.width + 50;
    pos.y = G.regions.hand.y;
    pos.w = 50
  }
  if (state.discard.indexOf(id) != -1) {
    pos.x = gcp_canvas.width + 50;
    pos.y = G.regions.hand.y/2;
    pos.w = 50
  }
  if (state.board.indexOf(id) != -1) {
    const boardI = state.board.indexOf(id);
    const grid = G.levels[G.gameState.level].grids[G.gameState.grid];
    const row = Math.floor(boardI/grid[0].length);
    const col = boardI % grid[0].length;
    const x0 = G.regions.field.x + G.regions.field.w/2 - unitSize*grid[0].length/2;
    const y0 = G.regions.field.y + G.regions.field.h/2 - unitSize*grid.length/2;
    pos.x = x0 + (0.5 + col)*unitSize
    pos.y = y0 + (0.5 + row)*unitSize
    pos.w = 50;
  }
}

function showAnimation () {
  const pct = 1 - G.gameState.animating/G.gameState.animTotal;
  for (const key in G.gameState.cards) {
    const cardId = G.gameState.cards[key].id
    set_xyw(G.prevState, cardId, G.gameState.cards[cardId].prevPos);
    set_xyw(G.physState, cardId, G.gameState.cards[cardId].currPos);
    drawCard(G.gameState.cards[cardId],
            G.gameState.cards[cardId].currPos.x*pct + G.gameState.cards[cardId].prevPos.x*(1-pct),
            G.gameState.cards[cardId].currPos.y*pct + G.gameState.cards[cardId].prevPos.y*(1-pct),
            G.gameState.cards[cardId].currPos.w*pct + G.gameState.cards[cardId].prevPos.w*(1-pct));
  }
}

function showCards() {
  for (const key in G.gameState.cards) {
    const cardId = G.gameState.cards[key].id
    set_xyw(G.prevState, cardId, G.gameState.cards[cardId].currPos);
    drawCard(G.gameState.cards[cardId],
             G.gameState.cards[cardId].currPos.x,
             G.gameState.cards[cardId].currPos.y,
             G.gameState.cards[cardId].currPos.w);
  }
}

function showBoard(unitSize=75) {
  const grid = G.levels[G.gameState.level].grids[G.gameState.grid];
  gcp_ctx.lineWidth = 2;
  gcp_ctx.strokeStyle = "black";
  gcp_ctx.fillStyle = "black";
  const x0 = G.regions.field.x + G.regions.field.w/2 - unitSize*grid[0].length/2;
  const y0 = G.regions.field.y + G.regions.field.h/2 - unitSize*grid.length/2;
  for (let row_i = 0; row_i < grid.length; row_i++) {
    for (let col_i = 0; col_i < grid[0].length; col_i++) {
      gcp_ctx.beginPath();
      gcp_ctx.rect(x0 + col_i*unitSize, y0 + row_i*unitSize, unitSize, unitSize);
      gcp_ctx.stroke();
      if (grid[row_i][col_i] == "x") gcp_ctx.fill();
    }
  }
}

function showGame() {
  gcp_ctx.clearRect(0, 0, gcp_canvas.width, gcp_canvas.height);

  gcp_ctx.fillStyle = "green";
  gcp_ctx.fillRect(0, 0, 100, 100);

  showBoard();

  if (G.gameState.animating > 0) {
    showAnimation();
    G.gameState.animating -= 1;
    if (--G.gameState.animating == 0) {
      for (const key in G.physState) {
        while (G.prevState[key].length > 0) G.prevState[key].pop();
        for (const val of G.physState[key]) G.prevState[key].push(val);
      }
    }
  } else {
    showCards();
  }


  if (G.M.down) {
    gcp_ctx.lineWidth = 5;
    gcp_ctx.strokeStyle = "green";
    gcp_ctx.beginPath();
    gcp_ctx.moveTo(G.M.lastDown[0], G.M.lastDown[1]);
    gcp_ctx.lineTo(G.M.hover[0], G.M.hover[1]);
    gcp_ctx.stroke();
  }
}