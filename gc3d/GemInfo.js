
function envDMxFromScale(s) {
    if (s >= 0.6) {
        return 8
    } else if (s >= 0.45){
        return 16
    } else if (s >= 0.3) {
        return 64
    } else if (s >= 0.2){
        return 200
    } else {
        return 600
    }
}


const GemShape = {
    HEART: {i: 0, shaderI: 0, defined: true},
    BRIOLETTE: {i: 1, shaderI: 1, defined: true},
    MARQUISE: {i: 2, shaderI: -1, defined: true},
    RECTANGLE: {i: 3, shaderI: 2, defined: true},
    PRINCESS: {i: 4, shaderI: 3, defined: true},
    TRILLIANT: {i: 5, shaderI: 4, defined: true},
    ROSE: {i: 6, shaderI: 5, defined: true},
    ICO: {i: 7, shaderI: -1, defined: true},
    MERKABA: {i: 8, shaderI: -1, defined: true},
    DONUT: {i: 9, shaderI: -1, defined: true},
    ALL: {i: 10, shaderI: -1, defined: false},
    NULL: {i: 11, shaderI: -1, defined: false},
}
const GemShape_values = [
    GemShape.HEART,
    GemShape.BRIOLETTE,
    GemShape.MARQUISE,
    GemShape.RECTANGLE,
    GemShape.PRINCESS,
    GemShape.TRILLIANT,
    GemShape.ROSE,
    GemShape.ICO,
    GemShape.MERKABA,
    GemShape.DONUT,
    GemShape.ALL,
    GemShape.NULL,
]
GemShape.values = function() { return GemShape_values }
for (let i = 0; i < GemShape_values.length; i++) GemShape_values[i].nominal = i
for (const key in GemShape) GemShape[key].name = key

const GemColor = {
    BLACK: {i: 0}, //onyx
    RED: {i: 1}, //ruby
    BLUE: {i: 2}, //saphire
    GREEN: {i: 3}, //emerald,
    YELLOW: {i: 4}, //citrine
    PURPLE: {i: 5}, //amathyst
    WHITE: {i: 6}, //diamond,
    LIGHT_BLUE: {i: 7}, //aquamarine
    PINK: {i: 8},
    LIGHT_GREY: {i: 9},
    MONO_WHITE: {i: 10},
    NULL: {i: 11},
    ALL: {i: 12},
}
GemColor_values = [
    GemColor.BLACK,
    GemColor.RED,
    GemColor.BLUE,
    GemColor.GREEN,
    GemColor.YELLOW,
    GemColor.PURPLE,
    GemColor.WHITE,
    GemColor.LIGHT_BLUE,
    GemColor.PINK,
    GemColor.LIGHT_GREY,
    GemColor.MONO_WHITE,
    GemColor.NULL,
    GemColor.ALL
]
GemColor.values = function() { return GemColor_values }
for (let i = 0; i < GemColor_values.length; i++) GemColor_values[i] = i
for (const key in GemColor) GemColor[key].name = key

function shaderShapeFromGemShape(gemShape) {
    if (-1 != GEM_SHAPES_WITH_UNIQUE_SHADERS.indexOf(gemShape)) {
        return gemShape
    } else if (gemShape == GemShape.DONUT) {
        return GemShape.BRIOLETTE
    } else if (gemShape == GemShape.MARQUISE) {
        return GemShape.HEART
    } else if (gemShape == GemShape.ICO) {
        return GemShape.PRINCESS
    } else { // merkaba
        return GemShape.PRINCESS
    }
}

const splitInfoFromGemShapeI = [1, 0, 2, 2, 1, 2, 2, 1, 0, 2]
const rainbowDirInfoFromGemShapeI = [0, 1, 0, 0, 0, 0, 0, 2, 1, 0]


function setThsFromGemShape(o, t, shape) {
    const T = 2200.0 * Math.PI
    if (shape == GemShape.HEART) {
        o.thK = 0.5 * Math.PI
        o.thTilt = 0.2 * Math.PI * Math.sin(t * 2.0 * Math.PI / T)
        o.thZ = 0
    } else if (shape == GemShape.BRIOLETTE) {
        o.thK = 1.0 * Math.PI
        o.thTilt = 0.42 * Math.PI
        o.thZ = (t * 2.0 * Math.PI / T)
    } else if (shape == GemShape.RECTANGLE) {
        o.thK = 0.5 * Math.PI
        o.thTilt = 0.8*Math.cos(-t * 2.0 * Math.PI / T)
        o.thZ = 0
    } else if (shape == GemShape.MARQUISE) {
        o.thK = 0.5 * Math.PI - 0.32 * Math.PI
        o.thTilt = (t * 2.0 * Math.PI / T)
        o.thZ = -0.32 * Math.PI + 0.2*Math.cos(t * 2.0 * Math.PI / T)
    } else if (shape == GemShape.TRILLIANT) {
        const cycleLen = T
        const startLen = T * 0.5
        const finalAngle = 0.175 * Math.PI
        const _t = t % cycleLen
        if (_t < startLen) {
            o.thK = -(Math.PI * _t * 4.0/ T)
            o.thTilt = (-finalAngle * _t / startLen)
            o.thZ = Math.PI * 0.6666
        } else {
            o.thK = -(Math.PI * _t * 4.0/ T)
            o.thTilt = (-finalAngle * (cycleLen - _t) / startLen)
            o.thZ = Math.PI * 0.6666
        }
    } else if (shape == GemShape.PRINCESS) {
        const cycleLen = T
        const startLen = T * 0.5
        const finalAngle = (0.175 * Math.PI)
        const _t = t % cycleLen
        if (_t < startLen) {
            o.thK = -(Math.PI * _t * 4.0/ T)
            o.thTilt = (-finalAngle * _t / startLen)
            o.thZ = 0
        } else {
            o.thK = -(Math.PI * _t * 4.0/ T)
            o.thTilt = (-finalAngle * (cycleLen - _t) / startLen)
            o.thZ = 0
        }
    } else if (shape == GemShape.ICO) {
        o.thK = 0.3 * Math.sin(t * 2.0 * Math.PI / T)
        o.thTilt = (t * 2.0 * Math.PI / T)
        o.thZ = 0
    } else if (shape == GemShape.ROSE) {
        o.thK = 0
        o.thTilt = 0.15
        o.thZ = (t * 2.0 * Math.PI / T)
    } else if (shape == GemShape.DONUT) {
        o.thK = 0.5 * Math.PI
        o.thTilt = 0.2 * Math.PI * Math.sin(t * 2.0 * Math.PI / T)
        o.thZ = Math.PI * 0.2
    } else if (shape == GemShape.MERKABA) {
        o.thK = 1.0 * Math.PI
        o.thTilt = 0.5 * Math.PI
        o.thZ = (t * 2.0 * Math.PI / T)
    } else {
        o.thK = 1.0 * Math.PI
        o.thTilt = 0.42 * Math.PI
        o.thZ = (t * 2.0 * Math.PI / T)
    }
}

const dummyShineColor = [1, 1, 1]
const shineArrFromGemColor = {}
shineArrFromGemColor[GemColor.BLACK.i] = [0.1, 0.1, 0.1]
shineArrFromGemColor[GemColor.RED.i] = [1, 0.2, 0.2]
shineArrFromGemColor[GemColor.PINK.i] = [1, 0.65, 0.68]
shineArrFromGemColor[GemColor.LIGHT_BLUE.i] = [0.4, 0.88, 1]
shineArrFromGemColor[GemColor.BLUE.i] = [0.12, 0.33, 0.75]
shineArrFromGemColor[GemColor.GREEN.i] = [0.16, 0.8, 0.16]
shineArrFromGemColor[GemColor.YELLOW.i] = [1, 1, 0]
shineArrFromGemColor[GemColor.PURPLE.i] = [0.6, 0.2, 0.7]
shineArrFromGemColor[GemColor.WHITE.i] = [0.5, 0.5, 0.5]
shineArrFromGemColor[GemColor.MONO_WHITE.i] = [0.5, 0.5, 0.5]
shineArrFromGemColor[GemColor.LIGHT_GREY.i] = [0.37, 0.37, 0.37]

const dummyColor = [0, 1, 0, 0]
const colorArrFromGemColor = {}
colorArrFromGemColor[GemColor.BLACK.i] = [0.1, 0.1, 0.1, 0]
colorArrFromGemColor[GemColor.RED.i] = [1, 0.2, 0.2, 0]
colorArrFromGemColor[GemColor.PINK.i] = [1, 0.65, 0.68, 0]
colorArrFromGemColor[GemColor.LIGHT_BLUE.i] = [0.4, 0.88, 1, 0]
colorArrFromGemColor[GemColor.BLUE.i] = [0.12, 0.33, 0.75, 0]
colorArrFromGemColor[GemColor.GREEN.i] = [0.16, 0.8, 0.16, 0]
colorArrFromGemColor[GemColor.YELLOW.i] = [1, 1, 0, 0]
colorArrFromGemColor[GemColor.PURPLE.i] = [0.6, 0.2, 0.7, 0]
colorArrFromGemColor[GemColor.WHITE.i] = [1, 1, 1, 0]
colorArrFromGemColor[GemColor.MONO_WHITE.i] = [1, 1, 1, 1]
colorArrFromGemColor[GemColor.LIGHT_GREY.i] = [0.37, 0.37, 0.37, 1]

const plasmaDummyColor = [0, 1, 0, 0]
const plasmaColorArrFromGemColor = {}
plasmaColorArrFromGemColor[GemColor.BLACK.i] = [1, 1, 0, 0]
plasmaColorArrFromGemColor[GemColor.RED.i] = [0.4, 0.88, 1, 0]
plasmaColorArrFromGemColor[GemColor.PINK.i] = [0, 1, 0, 0]
plasmaColorArrFromGemColor[GemColor.LIGHT_BLUE.i] = [1, 1, 0, 0]
plasmaColorArrFromGemColor[GemColor.BLUE.i] = [0.12, 0.33, 0.75, 0]
plasmaColorArrFromGemColor[GemColor.GREEN.i] = [0, 0, 0, 0]
plasmaColorArrFromGemColor[GemColor.YELLOW.i] = [0, 0, 0, 0]
plasmaColorArrFromGemColor[GemColor.PURPLE.i] = [0.6, 0.2, 0.7, 0]
plasmaColorArrFromGemColor[GemColor.WHITE.i] = [1, 0, 0, 0]
plasmaColorArrFromGemColor[GemColor.MONO_WHITE.i] = [0, 0, 0, 0]
plasmaColorArrFromGemColor[GemColor.LIGHT_GREY.i] = [1, 1, 1, 0]


function gemShapeEquals(a, b) {
    if (a.cardType == CardType.GEM_COUNTERFEIT || b.cardType == CardType.GEM_COUNTERFEIT) return true
    if (a.cardType == CardType.GEM_SHAPESHIFT || b.cardType == CardType.GEM_SHAPESHIFT) return true
    return a.gemShape == b.gemShape
}
function gemColorEquals(a, b) {
    if (a.cardType == CardType.GEM_RAINBOW || b.cardType == CardType.GEM_RAINBOW) return true
    if (a.cardType == CardType.GEM_COUNTERFEIT || b.cardType == CardType.GEM_COUNTERFEIT) return true
    if (a.cardType == CardType.GEM_DUO && b.cardType == CardType.GEM_DUO) {
        let rtn = false
        rtn = rtn || a.gemColorI == b.gemColorI
        rtn = rtn || a.gemColorI2 == b.gemColorI
        rtn = rtn || a.gemColorI == b.gemColorI2
        rtn = rtn || a.gemColorI2 == b.gemColorI2
        return rtn
    }
    if (a.cardType == CardType.GEM_DUO) {
        return a.gemColorI == b.gemColorI || a.gemColorI2 == b.gemColorI
    }
    if (b.cardType == CardType.GEM_DUO) {
        return a.gemColorI == b.gemColorI || a.gemColorI == b.gemColorI2
    }
    return a.gemColorI == b.gemColorI
}


