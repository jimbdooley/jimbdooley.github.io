function DisplayObject(
    _xyz = [0, 0, 0],
    _xyzScale = [1, 1, 1],
    _thTilt = 0,
    _thK = 0,
    _thZ = 0 ) {
    const rtn = {
        _scale: 1,
        get scale() { return this._scale },
        set scale(val) {
            this.sx = val
            this.sy = val
            this.sz = val
            this._scale = val
        },
        _thK,
        get thK() { return this._thK },
        set thK(val) {
            this.k0 = Math.cos(val)
            this.k1 = Math.sin(val)
            this._thK = val
        },
    }
    rtn.copyVals = function(o2) {
        for (let i = 0; i < 16; i++) postRotMat[i] = o2.postRotMat[i]
        for (let i = 0; i < 6; i++) targetXYZSXSYThZ[i] = o2.targetXYZSXSYThZ[i]
        this.targeting = o2.targeting
        this.highlighted = o2.highlighted
        this.highlightVal = o2.highlightVal
        this.x = o2.x
        this.y = o2.y
        this.z = o2.z
        this.scale = o2.scale
        this.thTilt = o2.thTilt
        this.thK = o2.thK
        this.thZ = o2.thZ
    }
    rtn.postRotMat = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1]
    rtn.targetXYZSXSYThZ = [0, 0, 0, 1, 1, 0]
    rtn.targeting = -1
    rtn.highlighted = false
    rtn.highlightVal = 0
    rtn.x = _xyz[0]
    rtn.y = _xyz[1]
    rtn.z = _xyz[2]
    rtn.thTilt = _thTilt
    rtn.thZ = _thZ
    rtn.k0 = Math.cos(_thK)
    rtn.k1 = Math.sin(_thK)
    rtn.thK = _thK
    rtn.scale = _xyzScale[0]
    rtn.sx = _xyzScale[0]
    rtn.sy = _xyzScale[1]
    rtn.sz = _xyzScale[2]
    return rtn
}
function DisplayObjectBall(
    _xyz = [0, 0, 0],
    _xyzScale = [1, 1, 1],
    _thTilt = 0,
    _thK = 0,
    _thX = 0 ) {
    const rtn = {
        _scale: 1,
        get scale() { return this._scale },
        set scale(val) {
            this.sx = val
            this.sy = val
            this.sz = val
            this._scale = val
        },
        _thK,
        get thK() { return this._thK },
        set thK(val) {
            this.k0 = Math.cos(val)
            this.k1 = Math.sin(val)
            this._thK = val
        },
    }
    rtn.copyVals = function(o2) {
        for (let i = 0; i < 16; i++) postRotMat[i] = o2.postRotMat[i]
        for (let i = 0; i < 6; i++) targetXYZSXSYThZ[i] = o2.targetXYZSXSYThZ[i]
        this.targeting = o2.targeting
        this.highlighted = o2.highlighted
        this.highlightVal = o2.highlightVal
        this.x = o2.x
        this.y = o2.y
        this.z = o2.z
        this.scale = o2.scale
        this.thTilt = o2.thTilt
        this.thK = o2.thK
        this.thX = o2.thX
    }
    rtn.postRotMat = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1]
    rtn.targetXYZSXSYThZ = [0, 0, 0, 1, 1, 0]
    rtn.targeting = -1
    rtn.highlighted = false
    rtn.highlightVal = 0
    rtn.x = _xyz[0]
    rtn.y = _xyz[1]
    rtn.z = _xyz[2]
    rtn.thTilt = _thTilt
    rtn.thX = _thX
    rtn.k0 = Math.cos(_thK)
    rtn.k1 = Math.sin(_thK)
    rtn.thK = _thK
    rtn.scale = _xyzScale[0]
    rtn.sx = _xyzScale[0]
    rtn.sy = _xyzScale[1]
    rtn.sz = _xyzScale[2]
    return rtn
}
