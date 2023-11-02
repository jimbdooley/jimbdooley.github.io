
G.gemShapes = {
  "n_heart":"heart", 
  "n_princess":"princess", 
  "n_trilliant":"trilliant", 
  "n_marquise":"marquise", 
  "n_rectangle":"rectangle",
  "n_briolette":"briolette",
  "n_rose":"rose",
  "n_kite":"kite",
  "n_round_brilliant":"round brilliant",
  "n_oval":"oval"
};

G.gemColors = {
  "n_diamond":"#bbbbbb",
  "n_onyx":"#111111",
  "n_ruby":"red",
  "n_sapphire":"blue",
  "n_emerald":"green",
  "n_yellow":"yellow",
  "n_purple":"purple",
  "n_orange": "orange",
};
G.CARD_HW = 1.4;

function drawCard(card, x, y, w) {
  gcp_ctx.fillStyle = "#aaaaaa";
  gcp_ctx.fillRect(x - w/2, y - w*G.CARD_HW/2, w, w*G.CARD_HW);
  drawGem(card.shape, card.color, [x - w/2 + 5, y - w*G.CARD_HW/2 + 5], w - 10);
  gcp_ctx.lineWidth = 2;
  gcp_ctx.strokeStyle = "black";
  gcp_ctx.beginPath();
  gcp_ctx.rect(x - w/2, y - w*G.CARD_HW/2, w, w*G.CARD_HW);
  gcp_ctx.stroke();
}

function drawGem(gemShapeName, gemColorName, xy, l){
  gcp_ctx.strokeStyle = "black";
  gcp_ctx.lineWidth = 2;
  gcp_ctx.fillStyle = G.gemColors[gemColorName];
  gcp_ctx.beginPath();
  switch(G.gemShapes[gemShapeName]){
      case "oval":
          gcp_ctx.arc(xy[0] + 0.3*l, xy[1] + 0.5*l, 0.3*l, 0.5*Math.PI, 1.5*Math.PI);
          gcp_ctx.lineTo(xy[0] + 0.7*l, xy[1] + 0.2*l);
          gcp_ctx.arc(xy[0] + 0.7*l, xy[1] + 0.5*l, 0.3*l, 1.5*Math.PI, 0.5*Math.PI);
          gcp_ctx.lineTo(xy[0] + 0.3*l, xy[1] + 0.8*l);
          break;
      case "round brilliant":
          gcp_ctx.moveTo(xy[0] + 0.2*l, xy[1]);
          gcp_ctx.lineTo(xy[0] + 0.8*l, xy[1]);
          gcp_ctx.lineTo(xy[0] + l, xy[1] + 0.3*l);
          gcp_ctx.lineTo(xy[0] + 0.5*l, xy[1] + l);
          gcp_ctx.lineTo(xy[0] + 0, xy[1] + 0.3*l);
          gcp_ctx.lineTo(xy[0] + 0.2*l, xy[1]);
          break;
      case "kite":
          gcp_ctx.moveTo(xy[0] + 0.5*l, xy[1]);
          gcp_ctx.lineTo(xy[0] + 0.8*l, xy[1] + 0.3*l);
          gcp_ctx.lineTo(xy[0] + 0.5*l, xy[1] + l);
          gcp_ctx.lineTo(xy[0] + 0.2*l, xy[1] + 0.3*l);
          gcp_ctx.lineTo(xy[0] + 0.5*l, xy[1]);
          break;
      case "briolette":
          gcp_ctx.arc(xy[0] + 0.5*l, xy[1] + 0.7*l, 0.3*l, 0, Math.PI);
          gcp_ctx.lineTo(xy[0] + 0.5*l, xy[1]);
          gcp_ctx.lineTo(xy[0] + 0.8*l, xy[1] + 0.7*l);
          break;
      case "rectangle":
          gcp_ctx.rect(xy[0] + 0.3*l, xy[1], 0.4*l, l);
          break;
      case "marquise":
          gcp_ctx.arc(xy[0] + 1.3*l, xy[1] + 1.3*l, 
                  Math.sqrt(1.78)*l, 
                  Math.PI + Math.atan(3/13), 
                  3*Math.PI/2 - Math.atan(3/13));
          gcp_ctx.arc(xy[0] - 0.3*l, xy[1] - 0.3*l, 
                  Math.sqrt(1.78)*l, 
                  Math.atan(3/13), 
                  Math.PI/2 - Math.atan(3/13));
          break;
      case "heart": 
          gcp_ctx.arc(xy[0]+0.25*l, xy[1] + 0.4*l, l/4, Math.PI, 0);
          gcp_ctx.arc(xy[0]+0.75*l, xy[1] + 0.4*l, l/4, Math.PI, 0);
          gcp_ctx.lineTo(xy[0] + 0.5*l, xy[0] + l);
          gcp_ctx.lineTo(xy[0], xy[0] + 0.4*l);
          break;
      case "rose":
          gcp_ctx.arc(xy[0] + l/2, xy[1] + l/2, l/2, 0, 2*Math.PI);
          break;
      case "princess":
          gcp_ctx.rect(xy[0], xy[1], l, l);
          break
      case "trilliant":
          gcp_ctx.moveTo(xy[0], xy[1]);
          gcp_ctx.lineTo(xy[0] + l, xy[1] + l/2);
          gcp_ctx.lineTo(xy[0], xy[1] + l);
          gcp_ctx.closePath();
          break;
      default:
          console.log(`shape '${gemShape}' not drawable`);
          return;
  }
  gcp_ctx.fill();
  gcp_ctx.stroke();
}
