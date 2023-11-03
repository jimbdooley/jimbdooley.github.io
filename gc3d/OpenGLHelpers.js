
function PVM(_width, _height, fov) {
    rtn = {}
    rtn.p = perspective(null, _width / _height, fov)
    rtn.v = invert4By4(lookAt(), null)
    rtn.m = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
    rtn.mCen = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
    rtn.mCenInv = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
    rtn.pv = mul4By4(rtn.p, rtn.v, null)
    rtn.pvm = new Float32Array(16)
    rtn.updateWidthHeight = function(_newWidth, _newHeight, fov, camX=0, camY=0, camZ=CAM_Z_GC){
        perspective(rtn.vp, _newWidth / _newHeight, fov)
        invert4By4(lookAt([camX, camY, camZ], [0, 0, 0], [0, 1, 0], this.v), this.v)
        mul4By4(this.p, this.v, this.pv)
    }

   rtn.updateWithDisplayObject = function(o) {
        skewRotRodTrans(this.m, o)
        mul3x3sOf4x4s(o.postRotMat, this.m, this.m)
        mul4By4(this.pv, this.m, this.pvm)

    }
    rtn.updateCenters = function() {
        this.mCen[0] = this.m[0]
        this.mCen[1] = this.m[1]
        this.mCen[2] = this.m[2]
        this.mCen[4] = this.m[4]
        this.mCen[5] = this.m[5]
        this.mCen[6] = this.m[6]
        this.mCen[8] = this.m[8]
        this.mCen[9] = this.m[9]
        this.mCen[10] = this.m[10]
        this.mCenInv[0] = this.m[5]*this.m[10] - this.m[6]*this.m[9]
        this.mCenInv[1] = this.m[2]*this.m[9] - this.m[1]*this.m[10]
        this.mCenInv[2] = this.m[1]*this.m[6] - this.m[2]*this.m[5]
        this.mCenInv[4] = this.m[6]*this.m[8] - this.m[4]*this.m[10]
        this.mCenInv[5] = this.m[0]*this.m[10] - this.m[2]*this.m[8]
        this.mCenInv[6] = this.m[2]*this.m[4] - this.m[0]*this.m[6]
        this.mCenInv[8] = this.m[4]*this.m[9] - this.m[5]*this.m[8]
        this.mCenInv[9] = this.m[1]*this.m[8] - this.m[0]*this.m[9]
        this.mCenInv[10] = this.m[0]*this.m[5] - this.m[1]*this.m[4]
    }
    rtn.updateWithRotMat = function(rot) {
        for (let i = 0; i < 16; i++) this.m[i] = rot[i]
        mul4By4(this.pv, this.m, this.pvm)
    }
    return rtn

}
/*
function getWriteableBMP(cols, rows, color): Bitmap {
    const pixels = IntArray(rows * cols) { color }
    return Bitmap.createBitmap(pixels, cols, rows, Bitmap.Config.ARGB_8888)
}
*/
function Shader(vertCode, fragCode, name=null){
    const rtn = {
        vert : gc3d_gl.createShader(gc3d_gl.VERTEX_SHADER),
        frag : gc3d_gl.createShader(gc3d_gl.FRAGMENT_SHADER),
        full : gc3d_gl.createProgram(),
        vertCompileLog : "",
        fragCompileLog : "",
    }
    gc3d_gl.shaderSource(rtn.vert, vertCode)
    gc3d_gl.compileShader(rtn.vert)
    rtn.vertCompileLog = gc3d_gl.getShaderInfoLog(rtn.vert)
    gc3d_gl.shaderSource(rtn.frag, fragCode)
    gc3d_gl.compileShader(rtn.frag)
    rtn.fragCompileLog = gc3d_gl.getShaderInfoLog(rtn.frag)
    if (name != null) {
        //console.log(" vertlog", rtn.vertCompileLog)
        //console.log(" fraglog", rtn.fragCompileLog)
    }
    gc3d_gl.attachShader(rtn.full, rtn.vert)
    gc3d_gl.attachShader(rtn.full, rtn.frag)
    gc3d_gl.linkProgram(rtn.full)
    return rtn
}

function PPPPTOfsInd(_ps, _tofs, _ind) {
    return {
        indArr :_ind,
        pos0 : new Float32Array(_ps[0]),
        pos1 : new Float32Array(_ps[1]),
        pos2 : new Float32Array(_ps[2]),
        pos3 : new Float32Array(_ps[3]),
        tofs : new Float32Array(_tofs),
        ind : new Uint16Array(_ind),
    }
}

function PosNormIndTex(_pos, _norm, _ind, _tex) {
    const rtn = {}
    rtn.posArr = _pos
    rtn.normArr = _norm
    rtn.indArr = _ind
    rtn.texArr = _tex
    rtn.pos =  gc3d_gl.createBuffer()
    rtn.norm = gc3d_gl.createBuffer()
    rtn.ind = gc3d_gl.createBuffer()
    rtn.tex = gc3d_gl.createBuffer()
    gc3d_gl.bindBuffer(gc3d_gl.ARRAY_BUFFER, rtn.pos)
    gc3d_gl.bufferData(gc3d_gl.ARRAY_BUFFER, new Float32Array(rtn.posArr), gc3d_gl.STATIC_DRAW)
    gc3d_gl.bindBuffer(gc3d_gl.ARRAY_BUFFER, rtn.norm)
    gc3d_gl.bufferData(gc3d_gl.ARRAY_BUFFER, new Float32Array(rtn.normArr), gc3d_gl.STATIC_DRAW)
    gc3d_gl.bindBuffer(gc3d_gl.ELEMENT_ARRAY_BUFFER, rtn.ind)
    gc3d_gl.bufferData(gc3d_gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(rtn.indArr), gc3d_gl.STATIC_DRAW)
    gc3d_gl.bindBuffer(gc3d_gl.ARRAY_BUFFER, rtn.tex)
    gc3d_gl.bufferData(gc3d_gl.ARRAY_BUFFER, new Float32Array(rtn.texArr), gc3d_gl.STATIC_DRAW)
    return rtn
}

function PosNormIndAve(_pos, _norm, _ind, _ave) {
    const rtn = {
        posArr : _pos,
        normArr : _norm,
        indArr : _ind,
        aveArr : _ave,
        pos : gc3d_gl.createBuffer(),
        norm : gc3d_gl.createBuffer(),
        ind : gc3d_gl.createBuffer(),
        ave : gc3d_gl.createBuffer(),
    }
    gc3d_gl.bindBuffer(gc3d_gl.ARRAY_BUFFER, rtn.pos)
    gc3d_gl.bufferData(gc3d_gl.ARRAY_BUFFER, new Float32Array(rtn.posArr), gc3d_gl.STATIC_DRAW)
    gc3d_gl.bindBuffer(gc3d_gl.ARRAY_BUFFER, rtn.norm)
    gc3d_gl.bufferData(gc3d_gl.ARRAY_BUFFER, new Float32Array(rtn.normArr), gc3d_gl.STATIC_DRAW)
    gc3d_gl.bindBuffer(gc3d_gl.ELEMENT_ARRAY_BUFFER, rtn.ind)
    gc3d_gl.bufferData(gc3d_gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(rtn.indArr), gc3d_gl.STATIC_DRAW)
    gc3d_gl.bindBuffer(gc3d_gl.ARRAY_BUFFER, rtn.ave)
    gc3d_gl.bufferData(gc3d_gl.ARRAY_BUFFER, new Float32Array(rtn.aveArr), gc3d_gl.STATIC_DRAW)
    return rtn
}

function PNI_to_PNIA(pni, uniteOrthogonal) {
    const pos = new Float32Array(pni.indArr.length * 4)//FloatArray(pni.indArr.length * 4) { 0 }
    const norm = new Float32Array(pni.indArr.length * 4)//FloatArray(pni.indArr.length * 4) { 0 }
    const ind = new Int16Array(pni.indArr.length)//ShortArray(pni.indArr.length) { i -> i.toShort() }
    for (let i = 0; i < ind.length; i++) ind[i] = i
    const ave = new Float32Array(pni.indArr.length * 4)//FloatArray(pni.indArr.length * 4) { 0 }
    for (let i = 0; i < pni.indArr.length; i += 3) {
        const i0 = pni.indArr[i]
        const i1 = pni.indArr[i+1]
        const i2 = pni.indArr[i+2]
        for (let j = 0; j < 4; j++) pos[4*i + j] = pni.posArr[4*i0 + j]
        for (let j = 0; j < 4; j++) pos[4*i + j + 4] = pni.posArr[4*i1 + j]
        for (let j = 0; j < 4; j++) pos[4*i + j + 8] = pni.posArr[4*i2 + j]
        for (let j = 0; j < 4; j++) norm[4*i + j] = pni.normArr[4*i0 + j]
        for (let j = 0; j < 4; j++) norm[4*i + j + 4] = pni.normArr[4*i1 + j]
        for (let j = 0; j < 4; j++) norm[4*i + j + 8] = pni.normArr[4*i2 + j]
        for (let j = 0; j < 4; j++) {
            if (j == 3) {
                ave[4*i + j] = 0
                continue
            }
            ave[4*i + j] = ONE_THIRD * (pos[4*i + j] + pos[4*i + j + 4] + pos[4*i + j + 8])
            ave[4*i + j + 4] = ave[4*i + j]
            ave[4*i + j + 8] = ave[4*i + j]
        }
    }
    for (let i = 0; i < norm.length; i += 12) {
        const eqs = [i]
        for (let j = 0; j < norm.length; j += 12) {
            if (0.0000001 > Math.abs(norm[j]-norm[i]) + Math.abs(norm[j+1]-norm[i+1]) + Math.abs(norm[j+2]-norm[i+2])) {
                const isOrthignal = Math.abs(norm[j]) == 1 || Math.abs(norm[j+1]) == 1 || Math.abs(norm[j+2]) == 1
                if (!isOrthignal || uniteOrthogonal) {
                    eqs.push(j)
                }
            }
        }
        const eqs_size = eqs.length
        const aves = [0, 0, 0]
        for (const j of eqs) {
            aves[0] += ave[j+0] / eqs_size
            aves[1] += ave[j+1] / eqs_size
            aves[2] += ave[j+2] / eqs_size
        }
        for (const j of eqs) {
            for (let k = 0; k < 12; k += 4) {
                ave[j+k+0] = aves[0]
                ave[j+k+1] = aves[1]
                ave[j+k+2] = aves[2]
            }
        }
    }
    return PosNormIndAve(pos, norm, ind, ave)
}

function PosNormInd(_pos, _norm, _ind) {
    const rtn = {}
    rtn.posArr = _pos
    rtn.normArr = _norm
    rtn.indArr = _ind
    rtn.pos =  gc3d_gl.createBuffer()
    rtn.norm = gc3d_gl.createBuffer()
    rtn.ind = gc3d_gl.createBuffer()
    gc3d_gl.bindBuffer(gc3d_gl.ARRAY_BUFFER, rtn.pos)
    gc3d_gl.bufferData(gc3d_gl.ARRAY_BUFFER, new Float32Array(rtn.posArr), gc3d_gl.STATIC_DRAW)
    gc3d_gl.bindBuffer(gc3d_gl.ARRAY_BUFFER, rtn.norm)
    gc3d_gl.bufferData(gc3d_gl.ARRAY_BUFFER, new Float32Array(rtn.normArr), gc3d_gl.STATIC_DRAW)
    gc3d_gl.bindBuffer(gc3d_gl.ELEMENT_ARRAY_BUFFER, rtn.ind)
    gc3d_gl.bufferData(gc3d_gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(rtn.indArr), gc3d_gl.STATIC_DRAW)
    return rtn
}

function initCubeTexture(loc, bmp){
    gc3d_gl.bindTexture(gc3d_gl.TEXTURE_CUBE_MAP, loc)
    gc3d_gl.texImage2D(gc3d_gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gc3d_gl.RGBA, gc3d_gl.RGBA, gc3d_gl.UNSIGNED_BYTE, bmp)
    gc3d_gl.texImage2D(gc3d_gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gc3d_gl.RGBA, gc3d_gl.RGBA, gc3d_gl.UNSIGNED_BYTE, bmp)
    gc3d_gl.texImage2D(gc3d_gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gc3d_gl.RGBA, gc3d_gl.RGBA, gc3d_gl.UNSIGNED_BYTE, bmp)
    gc3d_gl.texImage2D(gc3d_gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gc3d_gl.RGBA, gc3d_gl.RGBA, gc3d_gl.UNSIGNED_BYTE, bmp)
    gc3d_gl.texImage2D(gc3d_gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gc3d_gl.RGBA, gc3d_gl.RGBA, gc3d_gl.UNSIGNED_BYTE, bmp)
    gc3d_gl.texImage2D(gc3d_gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gc3d_gl.RGBA, gc3d_gl.RGBA, gc3d_gl.UNSIGNED_BYTE, bmp)
    //gc3d_gl.generateMipmap(gc3d_gl.TEXTURE_CUBE_MAP)
    gc3d_gl.texParameteri(gc3d_gl.TEXTURE_CUBE_MAP, gc3d_gl.TEXTURE_MIN_FILTER, gc3d_gl.NEAREST)
    gc3d_gl.texParameteri(gc3d_gl.TEXTURE_CUBE_MAP, gc3d_gl.TEXTURE_MAG_FILTER, gc3d_gl.NEAREST)
    gc3d_gl.texParameteri(gc3d_gl.TEXTURE_CUBE_MAP, gc3d_gl.TEXTURE_WRAP_S, gc3d_gl.CLAMP_TO_EDGE)
    gc3d_gl.texParameteri(gc3d_gl.TEXTURE_CUBE_MAP, gc3d_gl.TEXTURE_WRAP_T, gc3d_gl.CLAMP_TO_EDGE)
}

