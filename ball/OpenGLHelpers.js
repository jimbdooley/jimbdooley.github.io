function PVM(_width, _height, fov, camX, camY, camZ) {
    const rtn = {}
    rtn.p = perspective(null, _width / _height, fov)
    rtn.v = invert4By4(lookAt([camX, camY, camZ], [0, LOOKAT_Y, 0]), null)
    rtn.m = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
    rtn.mCen = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
    rtn.mCenInv = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
    rtn.pv = mul4By4(rtn.p, rtn.v, null)
    rtn.pvm = new Float32Array(16)
    rtn.updateWidthHeight = function(_newWidth, _newHeight, fov, camX, camY, camZ){
        perspective(rtn.p, _newWidth / _newHeight, fov)
        mul4By4(rtn.p, rtn.v, rtn.pv)
    }
    rtn.updateCamera = function (x) {
        invert4By4(lookAt([x, CAM_Y, CAM_Z], [x, LOOKAT_Y, 0]), rtn.v)
        mul4By4(rtn.p, rtn.v, rtn.pv)
        
    },
    rtn.updateWithDisplayObject = function(o) {
        skewRotRodTrans(this.m, o)
        mul3x3sOf4x4s(o.postRotMat, this.m, this.m)
        mul4By4(this.pv, this.m, this.pvm)

    }
    rtn.updateWithDisplayObjectBall = function(o) {
        skewRotRodTransX(this.m, o)
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

function Shader(vertCode, fragCode, name=null){
    const rtn = {
        vert : ball_gl.createShader(ball_gl.VERTEX_SHADER),
        frag : ball_gl.createShader(ball_gl.FRAGMENT_SHADER),
        full : ball_gl.createProgram(),
        vertCompileLog : "",
        fragCompileLog : "",
    }
    ball_gl.shaderSource(rtn.vert, vertCode)
    ball_gl.compileShader(rtn.vert)
    rtn.vertCompileLog = ball_gl.getShaderInfoLog(rtn.vert)
    ball_gl.shaderSource(rtn.frag, fragCode)
    ball_gl.compileShader(rtn.frag)
    rtn.fragCompileLog = ball_gl.getShaderInfoLog(rtn.frag)
    if (name != null) {
        console.log(`${name} vertlog`, rtn.vertCompileLog)
        console.log(`${name} fraball_glog`, rtn.fragCompileLog)
    }
    ball_gl.attachShader(rtn.full, rtn.vert)
    ball_gl.attachShader(rtn.full, rtn.frag)
    ball_gl.linkProgram(rtn.full)
    return rtn
}

function PosNormInd(_pos, _norm, _ind) {
    const rtn = {}
    rtn.posArr = _pos
    rtn.normArr = _norm
    rtn.indArr = _ind
    rtn.pos =  ball_gl.createBuffer()
    rtn.norm = ball_gl.createBuffer()
    rtn.ind = ball_gl.createBuffer()
    ball_gl.bindBuffer(ball_gl.ARRAY_BUFFER, rtn.pos)
    ball_gl.bufferData(ball_gl.ARRAY_BUFFER, new Float32Array(rtn.posArr), ball_gl.STATIC_DRAW)
    ball_gl.bindBuffer(ball_gl.ARRAY_BUFFER, rtn.norm)
    ball_gl.bufferData(ball_gl.ARRAY_BUFFER, new Float32Array(rtn.normArr), ball_gl.STATIC_DRAW)
    ball_gl.bindBuffer(ball_gl.ELEMENT_ARRAY_BUFFER, rtn.ind)
    ball_gl.bufferData(ball_gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(rtn.indArr), ball_gl.STATIC_DRAW)
    return rtn
}

function PosNormIndTex(_pos, _norm, _ind, _tex) {
    const rtn = {}
    rtn.posArr = _pos
    rtn.normArr = _norm
    rtn.indArr = _ind
    rtn.texArr = _tex
    rtn.pos =  ball_gl.createBuffer()
    rtn.norm = ball_gl.createBuffer()
    rtn.ind = ball_gl.createBuffer()
    rtn.tex = ball_gl.createBuffer()
    ball_gl.bindBuffer(ball_gl.ARRAY_BUFFER, rtn.pos)
    ball_gl.bufferData(ball_gl.ARRAY_BUFFER, new Float32Array(rtn.posArr), ball_gl.STATIC_DRAW)
    ball_gl.bindBuffer(ball_gl.ARRAY_BUFFER, rtn.norm)
    ball_gl.bufferData(ball_gl.ARRAY_BUFFER, new Float32Array(rtn.normArr), ball_gl.STATIC_DRAW)
    ball_gl.bindBuffer(ball_gl.ELEMENT_ARRAY_BUFFER, rtn.ind)
    ball_gl.bufferData(ball_gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(rtn.indArr), ball_gl.STATIC_DRAW)
    ball_gl.bindBuffer(ball_gl.ARRAY_BUFFER, rtn.tex)
    ball_gl.bufferData(ball_gl.ARRAY_BUFFER, new Float32Array(rtn.texArr), ball_gl.STATIC_DRAW)
    return rtn
}

