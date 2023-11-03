
const STAR_VALLEY_TO_PEAK = 0.4
const STAR_Z = 0.18

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

const GEM_SHAPES_WITH_UNIQUE_SHADERS = [
    GemShape.HEART,
    GemShape.BRIOLETTE,
    GemShape.RECTANGLE,
    GemShape.PRINCESS,
    GemShape.TRILLIANT,
    GemShape.ROSE
]
const GEM_PNIs = []

function defineGemData(context) { 
    for (gemShape of GemShape.values()) {
        if (!gemShape.defined) continue
        GEM_PNIs.push(objToPosNormInd(assets[`objs/${gemShape.name.toLowerCase()}.obj`]))
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
