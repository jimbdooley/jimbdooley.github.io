const DrawerIntro = {
    moreFeatureDOs: [DisplayObject(), DisplayObject(), DisplayObject()],
    moreFeatureShapes: [GemShape.ROSE, GemShape.TRILLIANT, GemShape.PRINCESS],
    moreFeatureColors: [GemColor.LIGHT_BLUE, GemColor.WHITE, GemColor.YELLOW],
    BUTTON_DISPLAY_DELAY: 1.8,
    ANIMATION_DT: 2.1,
    introLights: [0, 0, 1, 0, 0, 1, 0, 0, 1],
    lightThs: [0.3+0.4*Math.PI*Math.random(), 0.3+0.4*Math.PI*Math.random(), 0.3+0.4*Math.PI*Math.random(), 0.3+0.4*Math.PI*Math.random(), 0.3+0.4*Math.PI*Math.random(), 0.3+0.4*Math.PI*Math.random()],
    lightMomentums: [1-Math.random(), 1-Math.random(), 1-Math.random(), 1-Math.random(), 1-Math.random(), 1-Math.random()],
    introDO: DisplayObject(_xyz= [100, 0, 0]),
    leftGemDO: DisplayObject(_xyz= [100, 0, 0]),
    rightGemDO: DisplayObject(_xyz= [100, 0, 0]),
    leftBotGemDO: DisplayObject(_xyz= [100, 0, 0]),
    rightBotGemDO: DisplayObject(_xyz= [100, 0, 0]),
    leftGemShape: GemShape.BRIOLETTE,
    rightBotGemShape: GemShape.HEART,
    leftBotGemShape: GemShape.RECTANGLE,
    rightGemShape: GemShape.MARQUISE,
    leftGemColor: GemColor.BLUE,
    rightBotGemColor: GemColor.RED,
    leftBotGemColor: GemColor.GREEN,
    rightGemColor: GemColor.PURPLE,
    iconObj: DisplayObject(),
    spelling: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    givenDPos: [
        [-1.55, 2.0, 0],
        [-0.52, 2.0, 0],
        [0.85, 2.0, 0],
        [-3.2, -0.2, 0],
        [-2.35, -0.35, 0],
        [-1.7, -0.39, 0],
        [-1.3, -0.41, 0],
        [-0.65, -0.45, 0],
        [0.23, -0.45, 0],
        [1.16, -0.4, 0],
        [2.1, -0.35, 0],
        [3.1, -0.2, 0],
        [1.4, -1.9, 0.4],
        [2.6, -1.9, 0.4],
    ],
    iconDx: 8.3,
    iconDy: 6,
    iconScale: 1,
    popTime: 0.3,
    popParams: [0, 0, 0],
    fullScreenRegion: [0, 0, 0, 0],

    LIGHTS_D_MOMENTUM: 0.002,
    MAX_MOMENTUM: 0.01,
    topThRange: Math.PI * 0.6,
    dT_ss: [],
    dPos:[],
    dStarts: [],
    dThZ: [
        0,
        0,
        0,
        -0.2,
        -0.14,
        -9999,
        -9999,
        -0.05,
        0.05,
        0.10,
        0.14,
        0.2,
        0,
        0
    ],
    iterateLights(lights, ths, momentums) {
        for (let i = 0; i < momentums.length; i++) {
            if (i % 2 == 1 && lights[i] < 0.5 * (Math.PI - this.topThRange)) {
                momentums[i] += this.LIGHTS_D_MOMENTUM
            } else if (i % 2 == 1 && lights[i] > Math.PI - 0.5 * (Math.PI - this.topThRange)) {
                momentums[i] -= this.LIGHTS_D_MOMENTUM
            } else {
                momentums[i] += this.LIGHTS_D_MOMENTUM * (1 - 2 * Math.random())
            }
            momentums[i] = Math.max(-this.MAX_MOMENTUM, Math.min(this.MAX_MOMENTUM, momentums[i]))
        }
        for (let i = 0; i < 6; i++) {
            ths[i] += momentums[i]
        }
        for (let i = 0; i < 3; i++) {
            lights[3*i + 0] = Math.cos(ths[2*i+1]) * Math.cos(ths[2*i])
            lights[3*i + 1] = Math.cos(ths[2*i+1]) * Math.sin(ths[2*i])
            lights[3*i + 2] = Math.sin(ths[2*i+1])
        }
    },
    setupIntroGems() {
        this.fullScreenRegion[2] = World_gc.viewWidth
        this.fullScreenRegion[3] = World_gc.viewHeight
        if (isVerticalMode()) {
            let gemCenter
            if (World_gc.regionIntroGem[2] >= 2 * World_gc.regionIntroGem[3]) {
                gemCenter = [
                    World_gc.regionIntroGem[0] + 0.5 * World_gc.regionIntroGem[3],
                    World_gc.regionIntroGem[1] + 0.5 * World_gc.regionIntroGem[3],
                    0
                ]
            } else {
                gemCenter = [
                    World_gc.regionIntroGem[0] + 0.25 * World_gc.regionIntroGem[2],
                    World_gc.regionIntroGem[1] + 0.5 * World_gc.regionIntroGem[3],
                    0
                ]
            }
            setWorldXYZFromDeviceXY(gemCenter, gemCenter[0], gemCenter[1], gemCenter[2])
            this.leftGemDO.x = gemCenter[0]
            this.leftGemDO.y = gemCenter[1]
            this.leftGemDO.z = gemCenter[2]
            if (World_gc.regionIntroGem[2] >= 2 * World_gc.regionIntroGem[3]) {
                this.leftGemDO.scale = 0.5 * yDistFromZAndDeviceRegion(0, World_gc.regionIntroGem)
            } else {
                this.leftGemDO.scale = 0.23 * xDistFromZAndDeviceRegion(0, World_gc.regionIntroGem)
            }
        } else {
            let gemCenter
            if (World_gc.regionIntroGem[3] >= 2 * World_gc.regionIntroGem[2]) {
                gemCenter = [
                    World_gc.regionIntroGem[0] + 0.5 * World_gc.regionIntroGem[2],
                    World_gc.regionIntroGem[1] + 0.5 * World_gc.regionIntroGem[2],
                    0
                ]
            } else {
                gemCenter = [
                    World_gc.regionIntroGem[0] + 0.5 * World_gc.regionIntroGem[2],
                    World_gc.regionIntroGem[1] + 0.25 * World_gc.regionIntroGem[3],
                    0
                ]
            }
            setWorldXYZFromDeviceXY(gemCenter, gemCenter[0], gemCenter[1], gemCenter[2])
            this.leftGemDO.x = gemCenter[0]
            this.leftGemDO.y = gemCenter[1]
            this.leftGemDO.z = gemCenter[2]
            if (World_gc.regionIntroGem[3] >= 2 * World_gc.regionIntroGem[2]) {
                this.leftGemDO.scale = 0.9 * 0.5 * xDistFromZAndDeviceRegion(0, World_gc.regionIntroGem)
            } else {
                this.leftGemDO.scale = 0.9 * 0.23 * yDistFromZAndDeviceRegion(0, World_gc.regionIntroGem)
            }
        }
        this.rightGemDO.scale = this.leftGemDO.scale
        this.rightBotGemDO.scale = this.leftGemDO.scale
        this.leftBotGemDO.scale = this.leftGemDO.scale
        this.rightGemDO.x = -this.leftGemDO.x
        this.rightGemDO.y = this.leftGemDO.y
        this.rightGemDO.z = this.leftGemDO.z
        this.leftBotGemDO.x = this.leftGemDO.x
        this.leftBotGemDO.y = -this.leftGemDO.y
        this.leftBotGemDO.z = this.leftGemDO.z
        this.rightBotGemDO.x = this.rightGemDO.x
        this.rightBotGemDO.y = -this.rightGemDO.y
        this.rightBotGemDO.z = this.rightGemDO.z
    },
    t_s0: 99999999,
    setup() {
        this.spelling = [
            PosNormIndTexs.g,
            PosNormIndTexs.e,
            PosNormIndTexs.m,
            PosNormIndTexs.c,
            PosNormIndTexs.o,
            PosNormIndTexs.l,
            PosNormIndTexs.l,
            PosNormIndTexs.e,
            PosNormIndTexs.c,
            PosNormIndTexs.t,
            PosNormIndTexs.o,
            PosNormIndTexs.r,
            PosNormIndTexs.three,
            PosNormIndTexs.d,
        ]
        this.setupIntroGems()
        parabolaFromThreePoints(this.popParams, 0, 0, 0.75, 1.18, 1, 1)
        const i = this.dT_ss.length - 2
        this.dT_ss[i] = this.ANIMATION_DT + 0.2 * (this.givenDPos[i][0] - this.givenDPos[i][1]) + 0.35
        this.dT_ss[i+1] =  this.ANIMATION_DT + 0.2 * (this.givenDPos[i+1][0] - this.givenDPos[i+1][1]) + 0.415
        if (this.dPos[6][0] - this.dPos[7][0] > 0.0001 || this.dPos[6][0] - this.dPos[7][0] < 0.0001) {
            this.dThZ[5] = Math.atan((this.dPos[6][1]-this.dPos[7][1]) / (this.dPos[6][0]-this.dPos[7][0]))
        } else {
            this.dThZ[5] = -0.095
        }
        this.dThZ[6] = this.dThZ[5]
        setXYZSXSYFromRegionAndZ(this.iconObj, World_gc.regionIntroIcon, 0)
        if (this.iconDx / this.iconDy < World_gc.regionIntroIcon[2] / World_gc.regionIntroIcon[3]) {
            this.iconScale = yDistFromZAndDeviceRegion(0, World_gc.regionIntroIcon) / this.iconDy
        } else {
            this.iconScale = xDistFromZAndDeviceRegion(0, World_gc.regionIntroIcon) / this.iconDx
        }
        for (let i = 0; i < this.dPos.length; i++) {
            for (let j = 0; j < 3; j++) {
                this.dPos[i][j] = this.iconScale * this.givenDPos[i][j]
            }
        }
        this.t_s0 = this.t_s0 == 99999999 ? World_gc.t_s : this.t_s0
    },
    charRelXYZ: [0, 0, 0],
    draw(dx=0, dy=0, dz=0) {
        this.iterateLights(this.introLights, this.lightThs, this.lightMomentums)
        this.iconObj.thK += 0.012
        this.iconObj.thTilt = 0.46
        const t_s = World_gc.t_s - this.t_s0
        
        setThsFromGemShape(this.leftGemDO, World_gc.t_ms, this.leftGemShape)
        setThsFromGemShape(this.rightGemDO, World_gc.t_ms, this.rightGemShape)
        setThsFromGemShape(this.leftBotGemDO, World_gc.t_ms, this.leftBotGemShape)
        setThsFromGemShape(this.rightBotGemDO, World_gc.t_ms, this.rightBotGemShape)
        DrawerGem.draw(this.leftGemDO, this.leftGemShape, this.leftGemColor, this.introLights)
        DrawerGem.draw(this.rightGemDO, this.rightGemShape, this.rightGemColor, this.introLights)
        DrawerGem.draw(this.leftBotGemDO, this.leftBotGemShape, this.leftBotGemColor, this.introLights)
        DrawerGem.draw(this.rightBotGemDO, this.rightBotGemShape, this.rightBotGemColor, this.introLights)

        for (let i = 0; i < this.spelling.length; i++) {
            this.dStarts[i][0] = i < this.spelling.length - 2 ? 0 : 1
            this.dStarts[i][1] = i < this.spelling.length - 2 ? 0 : 0
            this.dStarts[i][2] = i < this.spelling.length - 2 ? -3 : 30
            if (t_s  >= this.dT_ss[i] && t_s  - this.dT_ss[i] < this.popTime) {
                var r = (t_s - this.dT_ss[i]) / this.popTime
                r = this.popParams[0]*r*r +  this.popParams[1]*r + this.popParams[2]
                this.dStarts[i][0] *= (1 - r)
                this.dStarts[i][1] *= (1 - r)
                this.dStarts[i][2] *= (1 - r)
            }
            if (t_s  - this.dT_ss[i] >= this.popTime) {
                this.dStarts[i][0] = 0
                this.dStarts[i][1] = 0
                this.dStarts[i][2] = 0
            }
        }
        if (this.dStarts[this.dStarts.length-2][2] < 0) {
            for (let i = 0; i < this.dStarts.length - 2; i++) {
                this.dStarts[i][0] = this.dStarts[this.dStarts.length-2][0]
                this.dStarts[i][1] = this.dStarts[this.dStarts.length-2][1]
                this.dStarts[i][2] = this.dStarts[this.dStarts.length-2][2]
            }
        }
        if (this.dStarts[this.dStarts.length-1][2] < 0) {
            for (let i = 0; i < this.dStarts.length - 1; i++) {
                this.dStarts[i][0] = this.dStarts[this.dStarts.length-1][0]
                this.dStarts[i][1] = this.dStarts[this.dStarts.length-1][1]
                this.dStarts[i][2] = this.dStarts[this.dStarts.length-1][2]
            }
        }

        for (let i = 0; i < this.spelling.length; i++) {
            rotateVectorFromThKTiltZ(this.iconObj.thK, this.iconObj.thTilt, 
                this.iconObj.thZ, this.dPos[i], this.charRelXYZ)
            this.introDO.thZ = this.iconObj.thZ + this.dThZ[i]
            this.introDO.thK = this.iconObj.thK
            this.introDO.thTilt = this.iconObj.thTilt
            if (t_s  < this.dT_ss[i]) {
                this.introDO.x = this.dStarts[i][0] + this.iconObj.x
                this.introDO.y = this.dStarts[i][1] + this.iconObj.y
                this.introDO.z = this.dStarts[i][2] + this.iconObj.z
                this.introDO.scale = i < this.spelling.length - 2 ? 0 : 0
            } else if (t_s  - this.dT_ss[i] < this.popTime) {
                let r = (t_s  - this.dT_ss[i]) / this.popTime
                r = this.popParams[0]*r*r +  this.popParams[1]*r + this.popParams[2]
                const threeDR = r < 0.2 ? r * 5 : 1
                this.introDO.x = r * this.charRelXYZ[0] + this.dStarts[i][0] + this.iconObj.x
                this.introDO.y = r * this.charRelXYZ[1] + this.dStarts[i][1] + this.iconObj.y
                this.introDO.z = r * this.charRelXYZ[2] + this.dStarts[i][2] + this.iconObj.z
                this.introDO.scale = i < this.spelling.length - 2 ? r * this.iconScale : threeDR * this.iconScale
            } else {
                this.introDO.x = this.charRelXYZ[0] + this.dStarts[i][0] + this.iconObj.x
                this.introDO.y = this.charRelXYZ[1] + this.dStarts[i][1] + this.iconObj.y
                this.introDO.z = this.charRelXYZ[2] + this.dStarts[i][2] + this.iconObj.z
                this.introDO.scale = this.iconScale
            }
            this.introDO.x += dx
            this.introDO.y += dy
            this.introDO.z += dz
            if (this.spelling[i]) DrawerVanilla.draw(this.introDO, "letter", this.spelling[i])
        }
        DrawerScene.draw(this.fullScreenRegion, true, Scene.intro)

    },
}
for (let i = 0; i < DrawerIntro.spelling.length; i++) {
    DrawerIntro.dT_ss[i] = DrawerIntro.ANIMATION_DT + 0.2 * (DrawerIntro.givenDPos[i][0] - DrawerIntro.givenDPos[i][1])
    DrawerIntro.dPos[i] = [
        DrawerIntro.givenDPos[i][0],
        DrawerIntro.givenDPos[i][1],
        DrawerIntro.givenDPos[i][2],
    ]
    DrawerIntro.dStarts[i] = [0, 0, 0]
}
const notre = DrawerIntro.dPos[6][1]-DrawerIntro.dPos[7][1]
const dame = DrawerIntro.dPos[6][0]-DrawerIntro.dPos[7][0]
DrawerIntro.dThZ[5] = Math.atan(notre / dame)
DrawerIntro.dThZ[6] = DrawerIntro.dThZ[5]
