
const World_gc = {}
World_gc.testLights = [0, 0, 0, 0, 0.707 ,0.707, 0.707, 0, 0.707]
World_gc.lightThs = []
World_gc.lightMomentums = []
for (let i = 0; i < 6; i++) {
    World_gc.lightThs.push(0.3 + 0.4*Math.PI*Math.random())
    World_gc.lightMomentums.push(1-Math.random)
}
World_gc.t_0 = Date.now()
World_gc.t_prev = World_gc.t_0 - 17
World_gc.dT_ms = 17
World_gc.t_ms = 0
World_gc.t_s = 0
World_gc.onFrame = function () {
    const now = Date.now()
    World_gc.dT_ms = now - World_gc.t_prev
    World_gc.t_ms += World_gc.dT_ms
    World_gc.t_prev = now
    World_gc.t_s = 0.001 * World_gc.t_ms
}

World_gc.dobsStarScaleOrig = 1
World_gc.regionThanksForPlaying = [0, 0, 0, 0]
World_gc.regionThanksShift = [0, 0, 0, 0]
World_gc.regionThanksShiftText = [0, 0, 0, 0]
World_gc.regionPickaxeInstruction = [0, 0, 0, 0]
World_gc.regionBranding = [0, 0, 0, 0]
World_gc.dummyXYZ = [0, 0, 0]
World_gc.regionDummy = [0, 0, 0, 0]
World_gc.regionIntroMenu = [0, 0, 0, 0]
World_gc.regionIntroIcon = [0, 0, 0, 0]
World_gc.regionIntroGem = [0, 0, 0, 0]
World_gc.regionMap = [0, 0, 0, 0]
World_gc.regionMenu = [0, 0, 0, 0]
World_gc.regionHand = [0, 0, 0, 0]
World_gc.regionTutMap = [0, 0, 0, 0]
World_gc.regionTut = [0, 0, 0, 0]
World_gc.regionScore = [0, 0, 0, 0]
World_gc.regionBrickBot = [0, 0, 0, 0]
World_gc.dobBrickBot = DisplayObject()
World_gc.regionBrickTop = [0, 0, 0, 0]
World_gc.dobBrickTop = DisplayObject()
World_gc.regionHome = [0, 0, 0, 0]
World_gc.dobGlobe = DisplayObject()
World_gc.regionSettings = [0, 0, 0, 0]
World_gc.dobsBorder = []
World_gc.offscreenXYZ = [0, 0, 0]
World_gc.regionFlag = [0, 0, 0, 0]
World_gc.dobDisplayShade = DisplayObject()
World_gc.dobDisplayMenuShade = DisplayObject()
World_gc.dobsStarShadow = [
    DisplayObject(_xyz=[0, 0, SHADE_Z + 0.1]),
    DisplayObject(_xyz=[0, 0, SHADE_Z + 0.1]),
    DisplayObject(_xyz=[0, 0, SHADE_Z + 0.1]),
    DisplayObject(_xyz=[0, 0, SHADE_Z + 0.1]),
    DisplayObject(_xyz=[0, 0, SHADE_Z + 0.1]),
]
World_gc.dobsStar = [
    DisplayObject(_xyz= [0, 0, SHADE_Z + 1.1]),   
    DisplayObject(_xyz= [0, 0, SHADE_Z + 1.1]),   
    DisplayObject(_xyz= [0, 0, SHADE_Z + 1.1]),   
    DisplayObject(_xyz= [0, 0, SHADE_Z + 1.1]),   
    DisplayObject(_xyz= [0, 0, SHADE_Z + 1.1]),   
]

World_gc.updateForViewWidthHeight = function(_viewWidth, _viewHeight) {
    World_gc.viewWidth = _viewWidth// * window.devicePixelRatio
    World_gc.viewHeight = _viewHeight// * window.devicePixelRatio
    World_gc.fov = Math.atan(Math.tan(FOV_FOR_MAX) * World_gc.viewHeight / Math.max(World_gc.viewWidth, World_gc.viewHeight))
    World_gc.pvm = PVM(World_gc.viewWidth, World_gc.viewHeight, World_gc.fov)
    World_gc.dy = CAM_Z_GC * Math.tan(World_gc.fov * 0.5)
    World_gc.dx = World_gc.dy * World_gc.viewWidth / World_gc.viewHeight
    World_gcSetRegions()
    World_gc.pvm.updateWidthHeight(World_gc.viewWidth, World_gc.viewHeight, World_gc.fov, 0, 0, CAM_Z_GC)
}
/*
World_gc.miscDO = DisplayObject()
World_gc.dobsBorder = []
World_gc.offscreenXYZ = floatArrayOf(0, 0, 0)
World_gc.regionThanksForPlaying = [0, 0, 0, 0]
World_gc.regionThanksShift = [0, 0, 0, 0]
World_gc.regionThanksShiftText = [0, 0, 0, 0]
World_gc.regionHand = [0, 0, 0, 0]
World_gc.regionMenu = [0, 0, 0, 0]
World_gc.regionFlag = [0, 0, 0, 0]
World_gc.regionFlagL = [0, 0, 0, 0]
World_gc.regionFlagR = [0, 0, 0, 0]
World_gc.regionEndCheckFail = [0, 0, 0, 0]
World_gc.regionScore = [0, 0, 0, 0]
World_gc.regionSettings = [0, 0, 0, 0]
World_gc.regionPullUp1 = [0, 0, 0, 0]
World_gc.regionPullUp2 = [0, 0, 0, 0]
World_gc.regionPickpone = [0, 0, 0, 0]
World_gc.dobPickponeA = DisplayObject()
World_gc.dobPickponeB = DisplayObject()
World_gc.regionForfeit = [0, 0, 0, 0]
World_gc.regionDontForfeit = [0, 0, 0, 0]
World_gc.regionHome = [0, 0, 0, 0]
World_gc.regionDisplayTitleASingle = [0, 0, 0, 0]
World_gc.regionDisplayTitleADoubleA = [0, 0, 0, 0]
World_gc.regionDisplayTitleADoubleB = [0, 0, 0, 0]
World_gc.regionDisplayTitleBSingle = [0, 0, 0, 0]
World_gc.regionDisplayTitleBDoubleA = [0, 0, 0, 0]
World_gc.regionDisplayTitleBDoubleB = [0, 0, 0, 0]
World_gc.dobDisplaySingle = DisplayObject()
World_gc.dobDisplayDoubleA = DisplayObject()
World_gc.dobDisplayDoubleB = DisplayObject()
World_gc.regionDisplayTitleBotSingle = [0, 0, 0, 0]
World_gc.regionDisplayTitleBotDoubleA = [0, 0, 0, 0]
World_gc.regionDisplayTitleBotDoubleB = [0, 0, 0, 0]
World_gc.regionDisplayDescriptionSingle = [0, 0, 0, 0]
World_gc.regionDisplayDescriptionDoubleA = [0, 0, 0, 0]
World_gc.regionDisplayDescriptionDoubleB = [0, 0, 0, 0]
World_gc.regionDisplayDescriptionSmallSingle = [0, 0, 0, 0]
World_gc.regionDisplayDescriptionSmallDoubleA = [0, 0, 0, 0]
World_gc.regionDisplayDescriptionSmallDoubleB = [0, 0, 0, 0]
World_gc.regionQuarterHand = [0, 0, 0, 0]
World_gc.regionUse = [0, 0, 0, 0]
World_gc.buttonIntroPlay = BButton(Textname.introPlay, 0)
World_gc.buttonIntroSettings = BButton(Textname.introSettings, 0)
World_gc.buttonClose = BButton(Textname.close, DISPLAY_Z)
World_gc.buttonViewMap = BButton(Textname.pickaxeViewMap, DISPLAY_Z)
World_gc.buttonFinish = BButton(Textname.finishButton, WIDGET_Z)
World_gc.buttonForfeit = BButton(Textname.forfeit, DISPLAY_Z)
World_gc.buttonReturnToLevels = BButton(Textname.returnToLevels, DISPLAY_Z)

World_gc.clickableSettingsRegion = [0, 0, 0, 0]
*/