
G.regions = {
  hand: {x: 0, y: 0, w: 1, h: 1},
  field: {x: 0, y: 0, w: 1, h: 1},
}

function regionInit() {
  G.regions.hand.x = 0;
  G.regions.hand.y = gcp_canvas.height*0.8;
  G.regions.hand.w = gcp_canvas.width;
  G.regions.hand.h = gcp_canvas.height*0.2;
  G.regions.field.x = 0;
  G.regions.field.y = 0;
  G.regions.field.w = gcp_canvas.width;
  G.regions.field.h = gcp_canvas.height*0.8;
}

