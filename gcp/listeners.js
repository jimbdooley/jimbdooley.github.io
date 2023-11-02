G.M = {
  up: true,
  down: false,
  justDown: false,
  justUp: false,
  lastDown: [-1, -1],
  lastUp: [-1, -1],
  hover: [-1, -1],
};

function setMouseXY(e, mouseLoc) {
  const rect = gcp_canvas.getBoundingClientRect();
  let borderWidth = parseInt(gcp_canvas.style.borderWidth);
  borderWidth = isNaN(borderWidth) ? 0 : borderWidth
  mouseLoc[0] = e.clientX - rect.x - borderWidth;
  mouseLoc[1] = e.clientY - rect.y - borderWidth;
}

function setCanvasListeners(gcp_canvas) {
  gcp_canvas.addEventListener("mouseup", (e) => {
    G.M.down = false;
    G.M.up = true;
    G.M.justUp = true;
    setMouseXY(e, G.M.lastUp);
  });
  gcp_canvas.addEventListener("mousedown", (e) => {
    G.M.down = true;
    G.M.up = false;
    G.M.justDown = true;
    setMouseXY(e, G.M.lastDown);
  });
  gcp_canvas.addEventListener("mousemove", (e) => {
    setMouseXY(e, G.M.hover);
  });
}