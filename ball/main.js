


const track = DisplayObject([0, 24, 0], [6, 60, 6])
const track2 = DisplayObject([0, 34, -3], [30, 80, 6])
const track2B = DisplayObject([0, 194, -3], [30, 80, 6])
let trackObj = null
let trackObj2 = null
const ball_S = {
    captureMode: true,
    prevT: Date.now(),
    dt: 17,
    speed: 0.7
}

function ball_loop() {
    requestAnimationFrame(ball_loop)
    ball_gl.clear(ball_gl.COLOR_BUFFER_BIT)
    ball_gl.clear(ball_gl.DEPTH_BUFFER_BIT)
    const t_dontUse = Date.now()
    ball_S.dt = ball_S.captureMode ? 17 : Math.min(33, t_dontUse - ball_S.prevT)
    World.pvm.updateCamera(Ball.dobb.x)
    track2.y  -= 0.03*ball_S.dt*ball_S.speed
    track2B.y -= 0.03*ball_S.dt*ball_S.speed
    if(track2.y < -1.5 * track2.sy) track2.y += 4 * track2.sy
    if(track2B.y < - 1.5 * track2B.sy) track2B.y += 4 * track2B.sy
    DrawerFloor2.draw(track2, "hand_bgr", trackObj2)
    DrawerFloor2.draw(track2B, "hand_bgr", trackObj2)
    
    Ball.iterate(ball_S.dt * ball_S.speed)
    DrawerBall.draw(Ball.dobb, Ball.skin, Ball.pnit)
    ball_S.prevT = t_dontUse

}

async function ball_init() {
    trackObj = trackPNIT(Math.floor(track.sy / track.sx))// objProperToPosNormIndTex(assets["objs/square.obj"])
    trackObj2 = trackPNIT2()// objProperToPosNormIndTex(assets["objs/square.obj"])
    DrawerBall.setup()
    DrawerFloor2.setup()
    ball_gl.clearColor(0.0, 0.0, 0.0, 1.0);
    ball_gl.clearDepth(1.0);
    ball_gl.enable(ball_gl.CULL_FACE);
    ball_gl.enable(ball_gl.DEPTH_TEST);
    ball_gl.enable(ball_gl.BLEND);
    ball_gl.blendFunc(ball_gl.SRC_ALPHA, ball_gl.ONE_MINUS_SRC_ALPHA);
    
    ball_gl.viewport(0, 0, ball_canvas.width, ball_canvas.height);
    ball_loop()
}


ball_init()
