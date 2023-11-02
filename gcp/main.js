const gcp_canvas = document.getElementById("gcp_canvas");
const gcp_ctx = gcp_canvas.getContext("2d");

setCanvasListeners(gcp_canvas);
regionInit();
gameInit("beginner");
playGame();
