

function getFinishable() {
    const N = 5
    const N2 = 2
    const r2 = 2.2
    const posArr = new Float32Array(32 * (N+N2))
    for (let i = 0; i < posArr.length; i++) posArr[i] = 1
    const normArr = new Float32Array(32 * (N+N2) )
    const texArr = new Float32Array(32 * (N+N2) )
    const indArr = new Uint16Array(12 * (N+N2))
    for (let i = 0; i < 2*N; i++) {
        const th1 = 0.5 * Math.PI - i * Math.PI / N
        const th2 = 0.5 * Math.PI - (i+1) * Math.PI / N
        const xOfs = (i < N) ? 1 : -1
        posArr[16*i+0] = xOfs + Math.cos(th1)
        posArr[16*i+1] = Math.sin(th1)
        posArr[16*i+2] = 0
        posArr[16*i+4] = xOfs + r2*Math.cos(th1)
        posArr[16*i+5] = r2*Math.sin(th1)
        posArr[16*i+6] = 0
        posArr[16*i+8] = xOfs + Math.cos(th2)
        posArr[16*i+9] = Math.sin(th2)
        posArr[16*i+10] = 0
        posArr[16*i+12] = xOfs + r2*Math.cos(th2)
        posArr[16*i+13] = r2*Math.sin(th2)
        posArr[16*i+14] = 0
        for (let j = 0; j < 4; j++) {
            normArr[16*i + 4*j + 2] = 1
        }
        texArr[16*i+0] = 0
        texArr[16*i+1] = 0
        texArr[16*i+4] = 0
        texArr[16*i+5] = 1
        texArr[16*i+8] = 1
        texArr[16*i+9] = 0
        texArr[16*i+12] = 1
        texArr[16*i+13] = 1
        indArr[6*i+0] = (4*i + 0)
        indArr[6*i+1] = (4*i + 2)
        indArr[6*i+2] = (4*i + 1)
        indArr[6*i+3] = (4*i + 1)
        indArr[6*i+4] = (4*i + 2)
        indArr[6*i+5] = (4*i + 3)
    }
    for (let i = 0; i < N2; i++) {
        posArr[32*N + 16*i+0] = -1 + 2 * i / N2
        posArr[32*N + 16*i+1] = 1
        posArr[32*N + 16*i+2] = 0
        posArr[32*N + 16*i+4] = -1 + 2 * i / N2
        posArr[32*N + 16*i+5] = r2
        posArr[32*N + 16*i+6] = 0
        posArr[32*N + 16*i+8] = -1 + 2 * (1+i) / N2
        posArr[32*N + 16*i+9] = 1
        posArr[32*N + 16*i+10] = 0
        posArr[32*N + 16*i+12] = -1 + 2 * (1+i) / N2
        posArr[32*N + 16*i+13] = r2
        posArr[32*N + 16*i+14] = 0
        for (let j = 0; j < 4; j++) {
            normArr[32*N + 16*i + 4*j + 2] = 1
        }
        texArr[32*N + 16*i+0] = 0
        texArr[32*N + 16*i+1] = 0
        texArr[32*N + 16*i+4] = 0
        texArr[32*N + 16*i+5] = 1
        texArr[32*N + 16*i+8] = 1
        texArr[32*N + 16*i+9] = 0
        texArr[32*N + 16*i+12] = 1
        texArr[32*N + 16*i+13] = 1
        indArr[12*N + 6*i+0] = (8*N + 4*i + 0)
        indArr[12*N + 6*i+1] = (8*N + 4*i + 2)
        indArr[12*N + 6*i+2] = (8*N + 4*i + 1)
        indArr[12*N + 6*i+3] = (8*N + 4*i + 1)
        indArr[12*N + 6*i+4] = (8*N + 4*i + 2)
        indArr[12*N + 6*i+5] = (8*N + 4*i + 3)
    }
    for (let i = 0; i < N2; i++) {
        posArr[16*N2 + 32*N + 16*i+0] = -1 + 2 * i / N2
        posArr[16*N2 + 32*N + 16*i+1] = -1
        posArr[16*N2 + 32*N + 16*i+2] = 0
        posArr[16*N2 + 32*N + 16*i+4] = -1 + 2 * i / N2
        posArr[16*N2 + 32*N + 16*i+5] = -r2
        posArr[16*N2 + 32*N + 16*i+6] = 0
        posArr[16*N2 + 32*N + 16*i+8] = -1 + 2 * (1+i) / N2
        posArr[16*N2 + 32*N + 16*i+9] = -1
        posArr[16*N2 + 32*N + 16*i+10] = 0
        posArr[16*N2 + 32*N + 16*i+12] = -1 + 2 * (1+i) / N2
        posArr[16*N2 + 32*N + 16*i+13] = -r2
        posArr[16*N2 + 32*N + 16*i+14] = 0
        for (let j = 0; j < 4; j++) {
            normArr[16*N2 + 32*N + 16*i + 4*j + 2] = 1
        }
        texArr[16*N2 + 32*N + 16*i+0] = 1
        texArr[16*N2 + 32*N + 16*i+1] = 0
        texArr[16*N2 + 32*N + 16*i+4] = 1
        texArr[16*N2 + 32*N + 16*i+5] = 1
        texArr[16*N2 + 32*N + 16*i+8] = 0
        texArr[16*N2 + 32*N + 16*i+9] = 0
        texArr[16*N2 + 32*N + 16*i+12] = 0
        texArr[16*N2 + 32*N + 16*i+13] = 1
        indArr[6*N2 + 12*N + 6*i+0] = (4*N2 + 8*N + 4*i + 0)
        indArr[6*N2 + 12*N + 6*i+1] = (4*N2 + 8*N + 4*i + 1)
        indArr[6*N2 + 12*N + 6*i+2] = (4*N2 + 8*N + 4*i + 2)
        indArr[6*N2 + 12*N + 6*i+3] = (4*N2 + 8*N + 4*i + 2)
        indArr[6*N2 + 12*N + 6*i+4] = (4*N2 + 8*N + 4*i + 1)
        indArr[6*N2 + 12*N + 6*i+5] = (4*N2 + 8*N + 4*i + 3)
    }
    for (let i = 0; i < posArr.length; i+=4) {
        posArr[i] *= 0.5
        posArr[i+1] *= 0.9
    }
    return PosNormIndTex(posArr, normArr, indArr, texArr)
}

function getFlagPosNormIndTex() {
    const rows = 1
    const cols = 10
    const rowsF = rows
    const colsF = cols
    const h = 0.8
    const w = 1
    const poleW = 0.27
    const pos = new Float32Array(16 * rows * cols + 16)
    const norm = new Float32Array(16 * rows * cols + 16)
    for (let i = 2; i < norm.length; i += 4) norm[i] = 1
    const ind = new Uint16Array(6*rows*cols + 6)
    for (let i = 0; i < rows; i++) {
        const iF = i
        for (let j = 0; j < cols; j++) {
            const jF = j
            for (let k = 0; k < 4; k++) {
                pos[16 * cols * i + 16 * j + 4*k + 2] = 0
                pos[16 * cols * i + 16 * j + 4*k + 3] = 1
            }
            pos[16 * cols * i + 16 * j + 0] = w * jF / colsF
            pos[16 * cols * i + 16 * j + 1] = h * (rowsF - iF) / rowsF
            pos[16 * cols * i + 16 * j + 4] = w * (jF+1) / colsF
            pos[16 * cols * i + 16 * j + 5] = h * (rowsF - iF) / rowsF
            pos[16 * cols * i + 16 * j + 8] = w * (jF+1) / colsF
            pos[16 * cols * i + 16 * j + 9] = h * (rowsF - iF - 1) / rowsF
            pos[16 * cols * i + 16 * j + 12] = w * jF / colsF
            pos[16 * cols * i + 16 * j + 13] = h * (rowsF - iF - 1) / rowsF
            ind[6 * (i * cols + j) + 0] = (4 * (cols * i + j) + 0)
            ind[6 * (i * cols + j) + 1] = (4 * (cols * i + j) + 2)
            ind[6 * (i * cols + j) + 2] = (4 * (cols * i + j) + 1)
            ind[6 * (i * cols + j) + 3] = (4 * (cols * i + j) + 0)
            ind[6 * (i * cols + j) + 4] = (4 * (cols * i + j) + 3)
            ind[6 * (i * cols + j) + 5] = (4 * (cols * i + j) + 2)
        }
    }
    // flagpole
    for (let i = 0; i < 4; i++) {
        pos[16*rows*cols + 4*i + 2] = 0
        pos[16*rows*cols + 4*i + 3] = 1
    }
    pos[16*rows*cols + 0] = 0
    pos[16*rows*cols + 1] = h
    pos[16*rows*cols + 4] = 0
    pos[16*rows*cols + 5] = -h
    pos[16*rows*cols + 8] = -poleW
    pos[16*rows*cols + 9] = -h
    pos[16*rows*cols + 12] = -poleW
    pos[16*rows*cols + 13] = h
    ind[6*rows*cols + 0] = (4 * rows * cols + 0)
    ind[6*rows*cols + 1] = (4 * rows * cols + 2)
    ind[6*rows*cols + 2] = (4 * rows * cols + 1)
    ind[6*rows*cols + 3] = (4 * rows * cols + 0)
    ind[6*rows*cols + 4] = (4 * rows * cols + 3)
    ind[6*rows*cols + 5] = (4 * rows * cols + 2)

    const tex = new Float32Array(16 * rows * cols + 16)
    for (let i = 0; i < tex.size; i++) {
        if (i < 16*rows*cols) {
            tex[i] = i % 4 < 2 ? pos[i] : 0
        } else {
            tex[i] = i % 4 < 2 ? pos[i] : -0
        }
    }

    for (let i = 0; i < pos.length; i+=4) {
        pos[i] -= 0.5 * (w - poleW)
    }

    return PosNormIndTex(pos, norm, ind, tex)
}

function getClickedCircle() {
    const N = 16
    const outerR = 1.5
    const r = 1
    const innerR = 0.6
    const posArr = []
    const normArr = []
    const texArr = []
    for (let i = 0; i < 32 * N; i++) {
        posArr.push(1)
        normArr.push(0)
        texArr.push(0)
    }
    const indArr = []
    for (let i = 0; i < 12 * N; i++) indArr.push(0)
    for (let i = 0; i < 2*N; i++) {
        const r0 = (i < N) ? r : innerR
        const r1 = (i < N) ? outerR : r
        const th1 = i * 2.0 * Math.PI / N
        const th2 = (i+1) * 2.0 * Math.PI / N
        posArr[16*i+0] = r0*Math.cos(th1)
        posArr[16*i+1] = r0*Math.sin(th1)
        posArr[16*i+2] = 0
        posArr[16*i+4] = r1*Math.cos(th1)
        posArr[16*i+5] = r1*Math.sin(th1)
        posArr[16*i+6] = 0
        posArr[16*i+8] = r0*Math.cos(th2)
        posArr[16*i+9] = r0*Math.sin(th2)
        posArr[16*i+10] = 0
        posArr[16*i+12] = r1*Math.cos(th2)
        posArr[16*i+13] = r1*Math.sin(th2)
        posArr[16*i+14] = 0
        for (let j = 0; j < 4; j++) {
            normArr[16*i + 4*j + 2] = 1
        }
        texArr[16*i+0] = 0
        texArr[16*i+1] = (i < N) ? 0 : 1
        texArr[16*i+4] = 0
        texArr[16*i+5] = (i < N) ? 1 : 0
        texArr[16*i+8] = 1
        texArr[16*i+9] = (i < N) ? 0 : 1
        texArr[16*i+12] = 1
        texArr[16*i+13] = (i < N) ? 1 : 0
        indArr[6*i+0] = (4*i + 0)
        indArr[6*i+1] = (4*i + 1)
        indArr[6*i+2] = (4*i + 2)
        indArr[6*i+3] = (4*i + 2)
        indArr[6*i+4] = (4*i + 1)
        indArr[6*i+5] = (4*i + 3)
    }
    
    return PosNormIndTex(posArr, normArr, indArr, texArr)
}

function getBtnSidePNIT(TTH) {
    const posArr = [
        0, 1 - TTH, 0, 1,
        0, TTH - 1, 0, 1,
        -TTH, -1, -TTH, 1,
        -TTH, 1, -TTH, 1,
        0, 1 - TTH, 0, 1,
        0, 1, -TTH, 1,
        -TTH, 1, -TTH, 1,
        0, TTH - 1, 0, 1,
        -TTH, -1, -TTH, 1,
        0, -1, -TTH, 1,
    ]
    const indArr = [0, 2, 1, 0, 3, 2, 4, 5, 6, 7, 8, 9]
    const normArr = new Float32Array(posArr.length)
    const texArr = new Float32Array(posArr.length)
    for (let i = 0; i < indArr.length; i += 3) {
        setNaturalNormals(posArr, normArr, indArr, i)
    }
    return PosNormIndTex(posArr, normArr, indArr, texArr)
}

function getBtnTopBotPNIT(TTH) {
    const posArr = [
        -1, 1, -TTH, 1,
        -1, 1-TTH, 0, 1,
        1, 1-TTH, 0, 1,
        1, 1, -TTH, 1,
        -1, -1, -TTH, 1,
        -1, TTH-1, 0, 1,
        1, TTH-1, 0, 1,
        1, -1, -TTH, 1,
    ]
    const indArr = [0, 1, 2, 2, 3, 0, 4, 6, 5, 7, 6, 4]
    const normArr = new Float32Array(posArr.length)
    const texArr = new Float32Array(posArr.length)
    for (let i = 0; i < indArr.length; i += 3) {
        setNaturalNormals(posArr, normArr, indArr, i)
    }
    return PosNormIndTex(posArr, normArr, indArr, texArr)
}


function getGearPosNormIndTex(bumps = 10) {
    const points = []
    const innerPoints = []
    const verts = []
    const norms = []
    const inds = []
    const texs = []
    const innerR = 0.28
    const toothSlope = 0.12
    const zHalf = 0.25
    for (let i = 0; i < bumps; i++) {
        points.push(Math.cos(2*Math.PI*(i + toothSlope) / bumps))
        points.push(Math.sin(2*Math.PI*(i + toothSlope) / bumps))
        points.push(Math.cos(2*Math.PI*(i+GEAR_PEAK_R-toothSlope) / bumps))
        points.push(Math.sin(2*Math.PI*(i+GEAR_PEAK_R-toothSlope) / bumps))
        points.push(GEAR_VALLEY_R*Math.cos(2*Math.PI*(i+GEAR_PEAK_R) / bumps))
        points.push(GEAR_VALLEY_R*Math.sin(2*Math.PI*(i+GEAR_PEAK_R) / bumps))
        points.push(GEAR_VALLEY_R*Math.cos(2*Math.PI*(i+1) / bumps))
        points.push(GEAR_VALLEY_R*Math.sin(2*Math.PI*(i+1) / bumps))
        innerPoints.push(innerR*Math.cos(2*Math.PI*(i + 0.5) / bumps))
        innerPoints.push(innerR*Math.sin(2*Math.PI*(i + 0.5) / bumps))
        innerPoints.push(innerR*Math.cos(2*Math.PI*(i + 1) / bumps))
        innerPoints.push(innerR*Math.sin(2*Math.PI*(i + 1) / bumps))
    }
    let units = 0
    for (let i = 0; i < bumps; i++) {
        verts.push(points[8*i+0])
        verts.push(points[8*i+1])
        verts.push(zHalf)
        verts.push(1)
        verts.push(points[8*i+0])
        verts.push(points[8*i+1])
        verts.push(-zHalf)
        verts.push(1)
        verts.push(points[8*i+2])
        verts.push(points[8*i+3])
        verts.push(zHalf)
        verts.push(1)
        verts.push(points[8*i+2])
        verts.push(points[8*i+3])
        verts.push(-zHalf)
        verts.push(1)

        verts.push(points[8*i+2])
        verts.push(points[8*i+3])
        verts.push(zHalf)
        verts.push(1)
        verts.push(points[8*i+2])
        verts.push(points[8*i+3])
        verts.push(-zHalf)
        verts.push(1)
        verts.push(points[8*i+4])
        verts.push(points[8*i+5])
        verts.push(zHalf)
        verts.push(1)
        verts.push(points[8*i+4])
        verts.push(points[8*i+5])
        verts.push(-zHalf)
        verts.push(1)

        verts.push(points[8*i+4])
        verts.push(points[8*i+5])
        verts.push(zHalf)
        verts.push(1)
        verts.push(points[8*i+4])
        verts.push(points[8*i+5])
        verts.push(-zHalf)
        verts.push(1)
        verts.push(points[8*i+6])
        verts.push(points[8*i+7])
        verts.push(zHalf)
        verts.push(1)
        verts.push(points[8*i+6])
        verts.push(points[8*i+7])
        verts.push(-zHalf)
        verts.push(1)

        verts.push(points[8*i+6])
        verts.push(points[8*i+7])
        verts.push(zHalf)
        verts.push(1)
        verts.push(points[8*i+6])
        verts.push(points[8*i+7])
        verts.push(-zHalf)
        verts.push(1)
        verts.push(points[8*((1+i)%bumps)+0])
        verts.push(points[8*((1+i)%bumps)+1])
        verts.push(zHalf)
        verts.push(1)
        verts.push(points[8*((1+i)%bumps)+0])
        verts.push(points[8*((1+i)%bumps)+1])
        verts.push(-zHalf)
        verts.push(1)

        verts.push(points[8*i+0])
        verts.push(points[8*i+1])
        verts.push(zHalf)
        verts.push(1)
        verts.push(points[8*i+2])
        verts.push(points[8*i+3])
        verts.push(zHalf)
        verts.push(1)
        verts.push(points[8*i+4])
        verts.push(points[8*i+5])
        verts.push(zHalf)
        verts.push(1)
        verts.push(points[8*((i+bumps-1)%bumps) +6])
        verts.push(points[8*((i+bumps-1)%bumps)+7])
        verts.push(zHalf)
        verts.push(1)

        verts.push(points[8*i+0])
        verts.push(points[8*i+1])
        verts.push(-zHalf)
        verts.push(1)
        verts.push(points[8*i+2])
        verts.push(points[8*i+3])
        verts.push(-zHalf)
        verts.push(1)
        verts.push(points[8*i+4])
        verts.push(points[8*i+5])
        verts.push(-zHalf)
        verts.push(1)
        verts.push(points[8*((i+bumps-1)%bumps) +6])
        verts.push(points[8*((i+bumps-1)%bumps)+7])
        verts.push(-zHalf)
        verts.push(1)

        verts.push(points[8*i + 4])
        verts.push(points[8*i + 5])
        verts.push(zHalf)
        verts.push(1)
        verts.push(points[8*i + 6])
        verts.push(points[8*i + 7])
        verts.push(zHalf)
        verts.push(1)
        verts.push(innerPoints[4*i + 0])
        verts.push(innerPoints[4*i + 1])
        verts.push(zHalf)
        verts.push(1)
        verts.push(innerPoints[4*i + 2])
        verts.push(innerPoints[4*i + 3])
        verts.push(zHalf)
        verts.push(1)

        verts.push(points[8*i + 6])
        verts.push(points[8*i + 7])
        verts.push(zHalf)
        verts.push(1)
        verts.push(points[8*((i+1)%bumps) + 4])
        verts.push(points[8*((i+1)%bumps) + 5])
        verts.push(zHalf)
        verts.push(1)
        verts.push(innerPoints[4*i + 2])
        verts.push(innerPoints[4*i + 3])
        verts.push(zHalf)
        verts.push(1)
        verts.push(innerPoints[4*((i+1)%bumps) + 0])
        verts.push(innerPoints[4*((i+1)%bumps) + 1])
        verts.push(zHalf)
        verts.push(1)

        verts.push(points[8*i + 4])
        verts.push(points[8*i + 5])
        verts.push(-zHalf)
        verts.push(1)
        verts.push(points[8*i + 6])
        verts.push(points[8*i + 7])
        verts.push(-zHalf)
        verts.push(1)
        verts.push(innerPoints[4*i + 0])
        verts.push(innerPoints[4*i + 1])
        verts.push(-zHalf)
        verts.push(1)
        verts.push(innerPoints[4*i + 2])
        verts.push(innerPoints[4*i + 3])
        verts.push(-zHalf)
        verts.push(1)

        verts.push(points[8*i + 6])
        verts.push(points[8*i + 7])
        verts.push(-zHalf)
        verts.push(1)
        verts.push(points[8*((i+1)%bumps) + 4])
        verts.push(points[8*((i+1)%bumps) + 5])
        verts.push(-zHalf)
        verts.push(1)
        verts.push(innerPoints[4*i + 2])
        verts.push(innerPoints[4*i + 3])
        verts.push(-zHalf)
        verts.push(1)
        verts.push(innerPoints[4*((i+1)%bumps) + 0])
        verts.push(innerPoints[4*((i+1)%bumps) + 1])
        verts.push(-zHalf)
        verts.push(1)

        verts.push(innerPoints[4*i+0])
        verts.push(innerPoints[4*i+1])
        verts.push(zHalf)
        verts.push(1)
        verts.push(innerPoints[4*i+0])
        verts.push(innerPoints[4*i+1])
        verts.push(-zHalf)
        verts.push(1)
        verts.push(innerPoints[4*i+2])
        verts.push(innerPoints[4*i+3])
        verts.push(zHalf)
        verts.push(1)
        verts.push(innerPoints[4*i+2])
        verts.push(innerPoints[4*i+3])
        verts.push(-zHalf)
        verts.push(1)

        verts.push(innerPoints[4*i+2])
        verts.push(innerPoints[4*i+3])
        verts.push(zHalf)
        verts.push(1)
        verts.push(innerPoints[4*i+2])
        verts.push(innerPoints[4*i+3])
        verts.push(-zHalf)
        verts.push(1)
        verts.push(innerPoints[4*((i+1)%bumps)+0])
        verts.push(innerPoints[4*((i+1)%bumps)+1])
        verts.push(zHalf)
        verts.push(1)
        verts.push(innerPoints[4*((i+1)%bumps)+0])
        verts.push(innerPoints[4*((i+1)%bumps)+1])
        verts.push(-zHalf)
        verts.push(1)

        units = (i == 0) ? verts.length / 4 : units
        inds.push((units*i+0))
        inds.push((units*i+1))
        inds.push((units*i+2))
        inds.push((units*i+1))
        inds.push((units*i+3))
        inds.push((units*i+2))

        inds.push((units*i+4))
        inds.push((units*i+5))
        inds.push((units*i+6))
        inds.push((units*i+5))
        inds.push((units*i+7))
        inds.push((units*i+6))

        inds.push((units*i+8))
        inds.push((units*i+9))
        inds.push((units*i+10))
        inds.push((units*i+9))
        inds.push((units*i+11))
        inds.push((units*i+10))

        inds.push((units*i+12))
        inds.push((units*i+13))
        inds.push((units*i+14))
        inds.push((units*i+13))
        inds.push((units*i+15))
        inds.push((units*i+14))

        inds.push((units*i+16))
        inds.push((units*i+17))
        inds.push((units*i+18))
        inds.push((units*i+19))
        inds.push((units*i+16))
        inds.push((units*i+18))

        inds.push((units*i+20))
        inds.push((units*i+22))
        inds.push((units*i+21))
        inds.push((units*i+23))
        inds.push((units*i+22))
        inds.push((units*i+20))

        inds.push((units*i+24))
        inds.push((units*i+25))
        inds.push((units*i+26))
        inds.push((units*i+26))
        inds.push((units*i+25))
        inds.push((units*i+27))

        inds.push((units*i+28))
        inds.push((units*i+29))
        inds.push((units*i+30))
        inds.push((units*i+30))
        inds.push((units*i+29))
        inds.push((units*i+31))

        inds.push((units*i+33))
        inds.push((units*i+32))
        inds.push((units*i+34))
        inds.push((units*i+33))
        inds.push((units*i+34))
        inds.push((units*i+35))

        inds.push((units*i+37))
        inds.push((units*i+36))
        inds.push((units*i+38))
        inds.push((units*i+37))
        inds.push((units*i+38))
        inds.push((units*i+39))

        inds.push((units*i+40))
        inds.push((units*i+42))
        inds.push((units*i+41))
        inds.push((units*i+41))
        inds.push((units*i+42))
        inds.push((units*i+43))

        inds.push((units*i+44))
        inds.push((units*i+46))
        inds.push((units*i+45))
        inds.push((units*i+45))
        inds.push((units*i+46))
        inds.push((units*i+47))
        for (let j = 0; j < units*4; j++) {
            texs.push(0)
            norms.push(0)
        }
    }

    const finalVert = verts
    const finalNorm = norms
    const finalInds = inds
    for (let i = 0; i < finalInds.length; i+=3) setNaturalNormals(finalVert, finalNorm, finalInds, i)
    return PosNormIndTex(finalVert, finalNorm, finalInds, texs)
}
