var isTablet = false
function isVerticalMode() {
    return true
    //return World_gc.viewWidth <= World_gc.viewHeight || isTablet
}
const MyGLRenderer = {}
MyGLRenderer.dob = DisplayObject(xyz=[-12, 0, 0])
MyGLRenderer.dobPlayGem = DisplayObject()
MyGLRenderer.testPNIT = getStarPosNormIndTex()
MyGLRenderer.testGemShapeArr = [GemShape.MARQUISE, GemShape.BRIOLETTE, GemShape.HEART, GemShape.RECTANGLE]

adObj = DisplayObject()

dxyz = [0, 0, 0]
const tStill = 7
function setDxyz(i) {
    const t = (9 * i + (World_gc.t_s-3)) % 54 - 9
    dxyz[1] = (t >= 0 ? Math.max(0, t - tStill*0.5) : Math.min(0, t + tStill*0.5))
    dxyz[0] = 0.6 * dxyz[1]
    dxyz[2] = 20.25 * dxyz[1]
    const sign = dxyz[1] > 0 ? 1 : -1
    dxyz[1] *= 4 * sign * dxyz[1]
}

MyGLRenderer.render = function() {
    gc3d_gl.clear(gc3d_gl.COLOR_BUFFER_BIT)
    gc3d_gl.clear(gc3d_gl.DEPTH_BUFFER_BIT)
    World_gc.onFrame()
    DrawerIntro.draw(dxyz[0], dxyz[1], dxyz[2])

    //DrawerVanilla.draw(adObj, "r1", PosNormIndTexs.square)
}

MyGLRenderer.init = function() {
    gc3d_gl.clearColor(0.24, 0.04, 0.24, 1.0);
    gc3d_gl.clearDepth(1.0);
    gc3d_gl.enable(gc3d_gl.CULL_FACE);
    gc3d_gl.enable(gc3d_gl.DEPTH_TEST);
    gc3d_gl.enable(gc3d_gl.BLEND);
    gc3d_gl.blendFunc(gc3d_gl.SRC_ALPHA, gc3d_gl.ONE_MINUS_SRC_ALPHA);
    defineGemData()
    PosNormIndTexs.setupFirst()
    PosNormIndTexs.setupSecond()
    DrawerGem.setup()
    DrawerScene.setup()
    DrawerVanilla.setup()
    MyGLRenderer.onSurfaceChanged()
}

MyGLRenderer.onSurfaceChanged = function() {
    //while (DrawerVanilla.textnamesDone.length > 0) DrawerVanilla.textnamesDone.pop()
    gc3d_gl.viewport(0, 0, gc3d_canvas.width, gc3d_canvas.height)
    World_gc.updateForViewWidthHeight(gc3d_canvas.width, gc3d_canvas.height)
    DrawerIntro.setup()
}


async function swapSS() {
    pause = true
    gc3d_canvas.width = gc3d_canvas.width == 300 ? 700 : 300
    gc3d_canvas.style.width = `${gc3d_canvas.width}px`
    MyGLRenderer.onSurfaceChanged()
    pause = false
}