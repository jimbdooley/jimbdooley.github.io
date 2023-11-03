
const STAR_VALLEY_TO_PEAK = 0.4
const STAR_Z = 0.18
/*
function getStarPosNormIndTex() {
    const pos = [
        0, 1, 0, 1, 0, 0, STAR_Z, 1,
        STAR_VALLEY_TO_PEAK* Math.cos(Math.PI*0.3), STAR_VALLEY_TO_PEAK* Math.sin(Math.PI*0.3), 0, 1,
        0, 0, STAR_Z, 1, 0, 1, 0, 1,
        -STAR_VALLEY_TO_PEAK* Math.cos(Math.PI*0.3), STAR_VALLEY_TO_PEAK* Math.sin(Math.PI*0.3), 0, 1,
    ]
    for (let i = 1; i < 5; i++) {
        for (let j = 0; j < 24; j += 4) {
            const th = 2 * Math.PI * i / 5
            const cosTh = Math.cos(th)
            const sinTh = Math.sin(th)
            pos.push(pos[j] * cosTh - pos[j+1] * sinTh)
            pos.push(pos[j] * sinTh + pos[j+1] * cosTh)
            pos.push(pos[j+2])
            pos.push(1)
        }
    }
    const posSize = pos.length
    for (let i = 0; i < posSize; i += 4) {
        pos.push(-pos[i])
        pos.push(pos[i+1])
        pos.push(-pos[i+2])
        pos.push(1)
    }
    const norm = pos.map(el, i => i % 4 == 2 ? 1 : 0)
    const tex = pos.map(el, i => i % 4 < 2 ? 0.5*el + 0.5 : 0)
    const inds = []
    for (let i = 0; i < pos.length / 4; i++) inds.push(i)
    const posArr = pos
    const normArr = norm
    const indArr = inds
    for (let i = 0; i < indArr.length; i+=3) {
        setNaturalNormals(posArr, normArr, indArr, i)
    }
    return PosNormIndTex(posArr, normArr, indArr, tex)
}
*/
function getStarShadowPosNormIndTex() {
    const pos = [
        0, 1, 0, 1, 0, 0, 0, 1,
        STAR_VALLEY_TO_PEAK*Math.cos(Math.PI*0.3), STAR_VALLEY_TO_PEAK*Math.sin(Math.PI*0.3), 0, 1,
        0, 0, 0, 1, 0, 1, 0, 1,
        -STAR_VALLEY_TO_PEAK*Math.cos(Math.PI*0.3), STAR_VALLEY_TO_PEAK*Math.sin(Math.PI*0.3), 0, 1,
    ]
    for (let i = 1; i < 5; i++) {
        for (let j = 0; j < 24; j += 4) {
            const th = 2 *Math.PI * i / 5
            const cosTh = Math.cos(th)
            const sinTh = Math.sin(th)
            pos.push(pos[j] * cosTh - pos[j+1] * sinTh)
            pos.push(pos[j] * sinTh + pos[j+1] * cosTh)
            pos.push(pos[j+2])
            pos.push(1)
        }
    }
    const norm = pos.map((el, i) => i % 4 == 2 ? 1 : 0)
    const tex = pos.map((el, i) => i % 4 < 2 ? 0.5*el + 0.5 : 0)
    const inds = []
    for (let i = 0; i < pos.length / 4; i++) inds.push(i)
    const posArr = pos
    const normArr = norm
    const indArr = inds
    return PosNormIndTex(posArr, normArr, indArr, tex)
}

function getBlockyBitmap(w=7) {
    const pixels = new Uint8ClampedArray(w*w*4)
    for (let i = 0; i < w; i++) {
        for (let j = 0; j < w; j++) {
            let a;
            if (Random.nextInt(0, 8) < 3) {
                a = Random.nextInt(64, 128)
            } else {
                a = Random.nextInt(128, 256)
            }
            pixels[4*(w*i + j) + 0] = a
            pixels[4*(w*i + j) + 1] = a
            pixels[4*(w*i + j) + 2] = a
            pixels[4*(w*i + j) + 3] = 255
        }
    }
    return new ImageData(pixels, w, w)
}
const BLOCKY_BITMAP = getBlockyBitmap()
const BLOCKY_DEFAULT = getBlockyBitmap(8)

function getStarPosNormInd() {
    const pos = [
        0, 1, 0, 1, 0, 0, STAR_Z, 1,
        STAR_VALLEY_TO_PEAK*Math.cos(Math.PI*0.3), STAR_VALLEY_TO_PEAK*Math.sin(Math.PI*0.3), 0, 1,
        0, 0, STAR_Z, 1, 0, 1, 0, 1,
        -STAR_VALLEY_TO_PEAK*Math.cos(Math.PI*0.3), STAR_VALLEY_TO_PEAK*Math.sin(Math.PI*0.3), 0, 1,
    ]
    for (let i = 1; i < 5; i++) {
        for (let j = 0; j < 24; j += 4) {
            const th = 2*Math.PI * i / 5
            const cosTh = Math.cos(th)
            const sinTh = Math.sin(th)
            pos.push(pos[j] * cosTh - pos[j+1] * sinTh)
            pos.push(pos[j] * sinTh + pos[j+1] * cosTh)
            pos.push(pos[j+2])
            pos.push(1)
        }
    }
    const posSize = pos.length
    for (let i = 0; i < posSize; i += 4) {
        pos.push(-pos[i])
        pos.push(pos[i+1])
        pos.push(-pos[i+2])
        pos.push(1)
    }
    let norm = []
    for (let i = 0; i < pos.length; i++) norm.push(i % 4 == 2 ? 1 : 0)
    let tex = []
    for (let i = 0; i < pos.length; i++) tex.push(i % 4 < 2 ? 0.5*pos[i] + 0.5 : 0)
    const inds = []
    for (let i = 0; i < pos.length/4; i++) inds.push(i)
    const posArr = pos
    const normArr = norm
    const indArr = inds
    for (let i = 0; i < indArr.length; i += 3) {
        setNaturalNormals(posArr, normArr, indArr, i)
    }
    return PosNormInd(posArr, normArr, indArr)
}
function getStarPosNormIndTex() {
    const pos = [
        0, 1, 0, 1, 0, 0, STAR_Z, 1,
        STAR_VALLEY_TO_PEAK*Math.cos(Math.PI*0.3), STAR_VALLEY_TO_PEAK*Math.sin(Math.PI*0.3), 0, 1,
        0, 0, STAR_Z, 1, 0, 1, 0, 1,
        -STAR_VALLEY_TO_PEAK*Math.cos(Math.PI*0.3), STAR_VALLEY_TO_PEAK*Math.sin(Math.PI*0.3), 0, 1,
    ]
    for (let i = 1; i < 5; i++) {
        for (let j = 0; j < 24; j += 4) {
            const th = 2*Math.PI * i / 5
            const cosTh = Math.cos(th)
            const sinTh = Math.sin(th)
            pos.push(pos[j] * cosTh - pos[j+1] * sinTh)
            pos.push(pos[j] * sinTh + pos[j+1] * cosTh)
            pos.push(pos[j+2])
            pos.push(1)
        }
    }
    const posSize = pos.length
    for (let i = 0; i < posSize; i += 4) {
        pos.push(-pos[i])
        pos.push(pos[i+1])
        pos.push(-pos[i+2])
        pos.push(1)
    }
    let norm = []
    for (let i = 0; i < pos.length; i++) norm.push(i % 4 == 2 ? 1 : 0)
    let tex = []
    for (let i = 0; i < pos.length; i++) tex.push(i % 4 < 2 ? 0.5*pos[i] + 0.5 : 0)
    const inds = []
    for (let i = 0; i < pos.length/4; i++) inds.push(i)
    const posArr = pos
    const normArr = norm
    const indArr = inds
    for (let i = 0; i < indArr.length; i += 3) {
        setNaturalNormals(posArr, normArr, indArr, i)
    }
    return PosNormIndTex(posArr, normArr, indArr, tex)
}

const GEM_SHAPES_WITH_UNIQUE_SHADERS = [
    GemShape.HEART,
    GemShape.BRIOLETTE,
    GemShape.RECTANGLE,
    GemShape.PRINCESS,
    GemShape.TRILLIANT,
    GemShape.ROSE
]
const GEM_PNIs = []
const GEM_PNIAs = []

function defineGemData(context) { 
    for (gemShape of GemShape.values()) {
        if (!gemShape.defined) continue
        GEM_PNIs.push(objToPosNormInd(assets[`objs/${gemShape.name.toLowerCase()}.obj`]))
        GEM_PNIAs.push(PNI_to_PNIA(GEM_PNIs[gemShape.i],
            gemShape == GemShape.MERKABA || gemShape == GemShape.RECTANGLE))
    }
}

function getOctagon() {
    const l = OCT_SIDE_R + Math.sqrt(2)
    const posML = [
        0, 0, 0, 1,
        OCT_SIDE_R, l, 0, 1,
        -OCT_SIDE_R, l, 0, 1,
        l, OCT_SIDE_R, 0, 1,
    ]
    for (let h = 1; h < 4; h++) {
        const th = h * 0.5 * Math.PI
        for (let i = 0; i < 16; i+= 4) {
            posML.push(posML[i] * Math.cos(th) - posML[i+1] * Math.sin(th))
            posML.push(posML[i] * Math.sin(th) + posML[i+1] * Math.cos(th))
            posML.push(0)
            posML.push(1)
        }
    }
    const inds = new Uint16Array(24)
    for (let i = 0; i < 4; i++) {
        inds[6*i + 0] = 0 + i * 4
        inds[6*i + 1] = 1 + i * 4
        inds[6*i + 2] = 2 + i * 4
        inds[6*i + 3] = 0 + i * 4
        inds[6*i + 4] = 3 + i * 4
        inds[6*i + 5] = 1 + i * 4
    }
    const norms = new Float32Array(posML.length)
    for (let i = 0; i < norms.length; i++) {
        norms[i] = i % 4 == 2 ? 1 : 0
    }
    const texs = posML.map((el, i) => i % 4 == 1 ? 0.25 * (2-el) : 0.5 + 0.25 * el)
    return PosNormIndTex(posML, norms, inds, texs)
}

const PosNormIndTexs = {
    square: null,
    map_square: null,
    map_hexagon: null,
    map_octagon: getOctagon(),
    counterfeit: null,
    gold_nugget: null,
    crate: null,
    star: getStarPosNormIndTex(),
    starShadow: getStarShadowPosNormIndTex(),
    pickHandle: null,
    pickHead: null,
    pickHeadTextured: null,
    pickHeadBig: null,
    clickedCirlce: getClickedCircle(),
    finishClickable: getFinishable(),
    g: null,
    e: null,
    m: null,
    c: null,
    o: null,
    l: null,
    d: null,
    t: null,
    r: null,
    three: null,
    setupSecond() {
    },
    setupFirst() {
        if (this.three != null) return
        this.square = objProperToPosNormIndTex(assets["objs/square.obj"])
        this.g = objProperToPosNormIndTex(assets["objs/g.obj"])
        this.e = objProperToPosNormIndTex(assets["objs/e.obj"])
        this.m = objProperToPosNormIndTex(assets["objs/m.obj"])
        this.c = objProperToPosNormIndTex(assets["objs/c.obj"])
        this.o = objProperToPosNormIndTex(assets["objs/o.obj"])
        this.l = objProperToPosNormIndTex(assets["objs/l.obj"])
        this.d = objProperToPosNormIndTex(assets["objs/d.obj"])
        this.t = objProperToPosNormIndTex(assets["objs/t.obj"])
        this.r = objProperToPosNormIndTex(assets["objs/r.obj"])
        this.three = objProperToPosNormIndTex(assets["objs/three.obj"])
    },
}

function getSparklePosArr(x, y, z, P, r) {
    const rtn = []
    for (let i = 0; i < P*4; i++) rtn.push(1)
    for (let i = 0; i < P*4; i += 4) {
        rtn[i] = x + r * Math.cos(i*0.5*Math.PI/P)
        rtn[i+1] = y + r * Math.sin(i*0.5*Math.PI/P)
        rtn[i+2] = z
    }
    return rtn
}

function getSparksPPPPTOfsInd(N=40, maxDt=0.15, uniformDarkness=false, maxDarkness=1,
    minSize=0.03, maxSize=0.09, r=1.2, h=2, P=7, startR=0.2, hDev=0.25, overShootR=0.25
) {
    const posArrs = [[], [], [], []]
    for (let n = 0; n < N; n++) {
        const size = minSize + (maxSize - minSize) * Math.random()
        const angle = (2.0 * Math.random() * Math.PI)
        const startX = startR*(1 - 2*Math.random())
        const startY = startR*(1 - 2*Math.random())
        const startZ = startR*(1 - 2*Math.random())
        const points = [
            [startX, startY, startZ],
            [startX + Math.cos(angle) * r * 0.5, startY + h*(1 + hDev*(1-2*Math.random())), startZ + Math.sin(angle) * r * 0.5],
            [startX + Math.cos(angle) * r, startY, startZ + Math.sin(angle) * r],
            [0, 0, 0]
        ]
        for (let i = 0;i < 3; i++) {
            points[3][i] = points[1][i] + (points[2][i] - points[1][i]) * (1 + overShootR)
        }
        for (let i = 0; i < 4; i++) {
            const sparkPosArr = getSparklePosArr(points[i][0], points[i][1], points[i][2], P, i == 3 ? 0 : size)
            for (el in sparkPosArr) posArrs[i].push(el)
        }

    }
    
    const tofsArr = []
    for (let i = 0; i < posArrs[0].length; i++) tofsArr.push(0) 
    for (let i = 0; i < tofsArr.length; i+= 4*P) {
        const ofs = maxDt * Math.random()
        let darkness = Math.random()
        for (let j = 0; j < P*4; j += 4) {
            tofsArr[i+j] = ofs
            darkness = uniformDarkness ? darkness : Math.random()
            tofsArr[i+j+1] = 1 - maxDarkness * darkness
        }
    }
    const inds = []
    for (let i = 0; i < N*(P-2)*3; i++) inds.push(0)
    const particleIndCount = 3*(P - 2)
    for (let i = 0; i < inds.length; i += particleIndCount) {
        const start = P * (i / particleIndCount)
        for (let j = 0; j < particleIndCount; j += 3) {
            inds[i+j] = start
            inds[i+j+1] = (start + j/3 + 1)
            inds[i+j+2] = (start + j/3 + 2)
        }
    }
    return PPPPTOfsInd(posArrs, tofsArr, inds)
}
const DIRT_PPPP = getSparksPPPPTOfsInd(30,0.15, false, 1,0.03, 0.06)
const BIG_DIRT_PPPP = getSparksPPPPTOfsInd(45,0.15, false, 1,0.04, 0.09)
const GOLD_SMALL_PPPP = getSparksPPPPTOfsInd(20,0.45, true, 0.3,0.02, 0.03, 0.8, 0.9)
const GOLD_MID_PPPP = getSparksPPPPTOfsInd(30,0.55, true, 0.3,0.02, 0.03, 1.0, 1.4)
const GOLD_LARGE_PPPP = getSparksPPPPTOfsInd(40,0.75, true, 0.3,0.02, 0.03, 1.3, 2.4)
