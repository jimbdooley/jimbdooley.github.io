function DisplayObject(
    _xyz = [0, 0, 0],
    _xyzScale = [1, 1, 1],
    _thTilt = 0,
    _thK = 0,
    _thZ = 0 ) {
    const r = {
        set scale(val) {
            this.sx = val
            this.sy = val
            this.sz = val
        },
        get scale() {
            return this.sx
        },
        _thK: 0,
        set thK(val) {
            this._thK = val
            this.k0 = Math.cos(val)
            this.k1 = Math.sin(val)
        },
        get thK() {
            return this._thK
        }
    }
    r.copyVals = DisplayObject_copyVals
    r.postRotMat = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]
    r.targetXYZSXSYThZ = [0, 0, 0, 1, 1, 0]
    r.targeting = -1
    r.highlighted = false
    r.highlightVal = 0
    r.x = _xyz[0]
    r.y = _xyz[1]
    r.z = _xyz[2]
    r.thTilt = _thTilt
    r.thZ = _thZ
    r.k0 = Math.cos(_thK)
    r.k1 = Math.sin(_thK)
    r.thK = _thK
    r.scale = _xyzScale[0]
    r.sx = _xyzScale[0]
    r.sy = _xyzScale[1]
    r.sz = _xyzScale[2]
    return r
}

function DisplayObject_copyVals(o2) {
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
