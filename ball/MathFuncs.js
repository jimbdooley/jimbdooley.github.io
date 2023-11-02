
function parabolaFromTwoPointsAndSlopeAtX(params, x0, y0, x1, y1, sx, s) {
    const m = [
        [x0*x0, x0, 1],
        [x1*x1, x1, 1],
        [2*sx, 1, 0]
    ]
    const cf = [
        [-1, 2*sx, x1*x1-2*sx*x1],
        [1, -2*sx, x0*2*sx-x0*x0],
        [x0-x1, x1*x1-x0*x0, x0*x0*x1-x0*x1*x1],
    ]
    const adjoint = [
        [cf[0][0], cf[1][0], cf[2][0]],
        [cf[0][1], cf[1][1], cf[2][1]],
        [cf[0][2], cf[1][2], cf[2][2]]
    ]
    let det = 0
    det += m[0][0] * m[1][1] * m[2][2]
    det += m[0][1] * m[1][2] * m[2][0]
    det += m[0][2] * m[1][0] * m[2][1]
    det -= m[0][0] * m[1][2] * m[2][1]
    det -= m[0][1] * m[1][0] * m[2][2]
    det -= m[0][2] * m[1][1] * m[2][0]
    const mInv = [
        [adjoint[0][0]/det, adjoint[0][1]/det, adjoint[0][2]/det],
        [adjoint[1][0]/det, adjoint[1][1]/det, adjoint[1][2]/det],
        [adjoint[2][0]/det, adjoint[2][1]/det, adjoint[2][2]/det],
    ]
    params[0] = mInv[0][0]*y0 + mInv[0][1]*y1 + mInv[0][2]*sx
    params[1] = mInv[1][0]*y0 + mInv[1][1]*y1 + mInv[1][2]*sx
    params[2] = mInv[2][0]*y0 + mInv[2][1]*y1 + mInv[2][2]*sx
}

function parabolaFromThreePoints(params, x1, y1, x2, y2, x3, y3) {
    const m = [
        [x1*x1, x1, 1],
        [x2*x2, x2, 1],
        [x3*x3, x3, 1]
    ]
    const cf = [
        [x2-x3, x3*x3-x2*x2, x2*x2*x3-x2*x3*x3],
        [x3-x1, x1*x1-x3*x3, x1*x3*x3-x1*x1*x3],
        [x1-x2, x2*x2-x1*x1, x1*x1*x2-x1*x2*x2],
    ]
    const adjoint = [
        [cf[0][0], cf[1][0], cf[2][0]],
        [cf[0][1], cf[1][1], cf[2][1]],
        [cf[0][2], cf[1][2], cf[2][2]]
    ]
    let det = 0
    det += m[0][0] * m[1][1] * m[2][2]
    det += m[0][1] * m[1][2] * m[2][0]
    det += m[0][2] * m[1][0] * m[2][1]
    det -= m[0][0] * m[1][2] * m[2][1]
    det -= m[0][1] * m[1][0] * m[2][2]
    det -= m[0][2] * m[1][1] * m[2][0]
    const mInv = [
        [adjoint[0][0]/det, adjoint[0][1]/det, adjoint[0][2]/det],
        [adjoint[1][0]/det, adjoint[1][1]/det, adjoint[1][2]/det],
        [adjoint[2][0]/det, adjoint[2][1]/det, adjoint[2][2]/det],
    ]
    params[0] = mInv[0][0]*y1 + mInv[0][1]*y2 + mInv[0][2]*y3
    params[1] = mInv[1][0]*y1 + mInv[1][1]*y2 + mInv[1][2]*y3
    params[2] = mInv[2][0]*y1 + mInv[2][1]*y2 + mInv[2][2]*y3
}

function setNaturalNormals(pos, norm, ind, i, hint=false) {
    const a1 = pos[ind[i + 0] * COORDS_PER_VERTEX + 0] - pos[ind[i + 1] * COORDS_PER_VERTEX + 0]
    const a2 = pos[ind[i + 0] * COORDS_PER_VERTEX + 1] - pos[ind[i + 1] * COORDS_PER_VERTEX + 1]
    const a3 = pos[ind[i + 0] * COORDS_PER_VERTEX + 2] - pos[ind[i + 1] * COORDS_PER_VERTEX + 2]
    const b1 = pos[ind[i + 2] * COORDS_PER_VERTEX + 0] - pos[ind[i + 1] * COORDS_PER_VERTEX + 0]
    const b2 = pos[ind[i + 2] * COORDS_PER_VERTEX + 1] - pos[ind[i + 1] * COORDS_PER_VERTEX + 1]
    const b3 = pos[ind[i + 2] * COORDS_PER_VERTEX + 2] - pos[ind[i + 1] * COORDS_PER_VERTEX + 2]
    const cross = [a2*b3 - a3*b2, a3*b1 - a1*b3, a1*b2 - a2*b1]
    const mag = Math.sqrt(cross[0]*cross[0] + cross[1]*cross[1] + cross[2]*cross[2])
    cross[0] /= -mag
    cross[1] /= -mag
    cross[2] /= -mag
    if(hint){
        let dot = cross[0]*norm[ind[i].toInt()] + cross[1]*norm[ind[i+1].toInt()] + cross[2]*norm[ind[i+2].toInt()]
        if (dot < 0) {
            cross[0] = -cross[0]
            cross[1] = -cross[1]
            cross[2] = -cross[2]
        }
    }
    for(let j = 0; j < 3; j++){
        norm[ind[i+j] * COORDS_PER_VERTEX + 0] = cross[0]
        norm[ind[i+j] * COORDS_PER_VERTEX + 1] = cross[1]
        norm[ind[i+j] * COORDS_PER_VERTEX + 2] = cross[2]
    }
}

function rotMatFromAxisAnball_gle(u, th, _rtn=null) {
    const rtn = _rtn == null ? new Float32Array([5, 5, 5, 0, 5, 5, 5, 0, 5, 5, 5, 0, 0, 0, 0, 1]) : _rtn
    const cosTh = Math.cos(th)
    const sinTh = Math.sin(th)
    rtn[0] = cosTh + u[0]*u[0]*(1 - cosTh)
    rtn[1] = u[0]*u[1]*(1 - cosTh) - u[2]*sinTh
    rtn[2] = u[0]*u[2]*(1 - cosTh) + u[1]*sinTh
    rtn[4] = u[0]*u[1]*(1 - cosTh) + u[2]*sinTh
    rtn[5] = cosTh + u[1]*u[1]*(1 - cosTh)
    rtn[6] = u[1]*u[2]*(1 - cosTh) - u[0]*sinTh
    rtn[8] = u[0]*u[2]*(1 - cosTh) - u[1]*sinTh
    rtn[9] = u[1]*u[2]*(1 - cosTh) + u[0]*sinTh
    rtn[10] = cosTh + u[2]*u[2]*(1 - cosTh)
    return rtn
}

function rotateFromAxisAnball_gle(u, th, vec) {
    const cosTh = Math.cos(th)
    const sinTh = Math.sin(th)
    const rotMat = [
        cosTh + u[0]*u[0]*(1 - cosTh),
        u[0]*u[1]*(1 - cosTh) - u[2]*sinTh,
        u[0]*u[2]*(1 - cosTh) + u[1]*sinTh,
        u[0]*u[1]*(1 - cosTh) + u[2]*sinTh,
        cosTh + u[1]*u[1]*(1 - cosTh),
        u[1]*u[2]*(1 - cosTh) - u[0]*sinTh,
        u[0]*u[2]*(1 - cosTh) - u[1]*sinTh,
        u[1]*u[2]*(1 - cosTh) + u[0]*sinTh,
        cosTh + u[2]*u[2]*(1 - cosTh),
    ]
    return [
        rotMat[0]*vec[0] + rotMat[1]*vec[1] + rotMat[2]*vec[2],
        rotMat[3]*vec[0] + rotMat[4]*vec[1] + rotMat[5]*vec[2],
        rotMat[6]*vec[0] + rotMat[7]*vec[1] + rotMat[8]*vec[2],
    ]
}

function rotateVectorFromThKTiltZ(thK, thTilt, thZ, v) {
    const kVec = [Math.cos(thK), Math.sin(thK), 0]
    const tiltedVec = rotateFromAxisAnball_gle(kVec, thTilt, v)
    const zRotAxis = rotateFromAxisAnball_gle(kVec, thTilt, [0, 0, 1])
    return rotateFromAxisAnball_gle(zRotAxis, thZ, tiltedVec)
}

function skewRotRodTrans(m, o) {
    const cosThZ = Math.cos(o.thZ)
    const sinThZ = Math.sin(o.thZ)
    const t00 = cosThZ*o.sx
    const t01 = -sinThZ*o.sy
    const t10 = sinThZ*o.sx
    const t11 = cosThZ*o.sy
    const a = Math.cos(o.thTilt/2)
    const sinThOver2 = Math.sin(o.thTilt/2)
    const b = o.k0*sinThOver2
    const c = o.k1*sinThOver2
    const ab2 = 2*a*b
    const ac2 = 2*a*c
    const bc2 = 2*b*c
    const aa = a*a
    const bb = b*b
    const cc = c*c
    const d00 = aa + bb - cc
    const d11 = aa - bb + cc
    const d22 = aa - bb - cc
    m[0] = d00*t00 + bc2*t10
    m[1] = bc2*t00 + d11*t10
    m[2] = ab2*t10 - ac2*t00
    m[3] = 0
    m[4] = d00*t01 + bc2*t11
    m[5] = bc2*t01 + d11*t11
    m[6] = ab2*t11 - ac2*t01
    m[7] = 0
    m[8] = o.sz*ac2
    m[9] = -o.sz*ab2
    m[10] = o.sz*d22
    m[11] = 0
    m[12] = o.x
    m[13] = o.y
    m[14] = o.z
    m[15] = 1
}

const srrtxU = [0, 1, 0]
const srrtxM = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
function skewRotRodTransX(m, o) {
    const cosThZ = Math.cos(o.thX)
    const sinThZ = Math.sin(o.thX)
    const t11 = cosThZ*o.sx
    const t12 = -sinThZ*o.sy
    const t21 = sinThZ*o.sx
    const t22 = cosThZ*o.sy
    srrtxU[0] = Math.cos(o.thK)
    srrtxU[1] = Math.sin(o.thK)
    rotMatFromAxisAnball_gle(srrtxU, o.thTilt, srrtxM)
    m[0] = 1
    m[1] = 0
    m[2] = 0
    m[3] = 0
    m[4] = 0
    m[5] = t11
    m[6] = t12
    m[7] = 0
    m[8] = 0
    m[9] = t21
    m[10] = t22
    m[11] = 0
    m[12] = o.x
    m[13] = o.y
    m[14] = o.z
    m[15] = 1
    mul3x3sOf4x4s(srrtxM, m, m)
}


function projectToNewZ(
    DO,
    x, y, z,
    newZ,
    sx=1, sy=1,
    blockShallower=false
) {
    if (blockShallower && newZ > z) {
        DO.x = x
        DO.y = y
        DO.z = z
        DO.sx = sx
        DO.sy = sy
        return
    }
    const slopeXZ = x / (z - CAM_Z)
    const slopeYZ = y / (z - CAM_Z)
    DO.x = slopeXZ * (newZ - CAM_Z)
    DO.y = slopeYZ * (newZ - CAM_Z)
    DO.z = newZ
    DO.sx = sx * (CAM_Z - newZ) / (CAM_Z - z)
    DO.sy = sy * (CAM_Z - newZ) / (CAM_Z - z)
}

function dot(a, b){
    let rtn = 0
    for(i in a.indices) rtn += a[i]*b[i]
    return rtn
}

function cross(a, b) {
    return [
        a[1]*b[2] - a[2]*b[1],
        a[2]*b[0] - a[0]*b[2],
        a[0]*b[1] - a[1]*b[0],
    ]
}

function cross_and_normalize(a, b) {
    const x = cross(a, b)
    const mag = Math.sqrt(x[0]*x[0] + x[1]*x[1] + x[2]*x[2])
    return [x[0]/mag, x[1]/mag, x[2]/mag]
}

function mul3x3sOf4x4s(a, b, _dst) {
    const dst = new Float32Array(16)
    dst[0] = a[0]*b[0] + a[4]*b[1] + a[8]*b[2]
    dst[1] = a[1]*b[0] + a[5]*b[1] + a[9]*b[2]
    dst[2] = a[2]*b[0] + a[6]*b[1] + a[10]*b[2]
    dst[4] = a[0]*b[4] + a[4]*b[5] + a[8]*b[6]
    dst[5] = a[1]*b[4] + a[5]*b[5] + a[9]*b[6]
    dst[6] = a[2]*b[4] + a[6]*b[5] + a[10]*b[6]
    dst[8] = a[0]*b[8] + a[4]*b[9] + a[8]*b[10]
    dst[9] = a[1]*b[8] + a[5]*b[9] + a[9]*b[10]
    dst[10] = a[2]*b[8] + a[6]*b[9] + a[10]*b[10]
    if (_dst != null) {
        _dst[0] = dst[0]
        _dst[1] = dst[1]
        _dst[2] = dst[2]
        _dst[4] = dst[4]
        _dst[5] = dst[5]
        _dst[6] = dst[6]
        _dst[8] = dst[8]
        _dst[9] = dst[9]
        _dst[10] = dst[10]
    }
    return dst
}

function mul4By4(a, b, _dst) {
    const dst = new Float32Array(16)
    dst[0] = a[0]*b[0] + a[4]*b[1] + a[8]*b[2] + a[12]*b[3]
    dst[1] = a[1]*b[0] + a[5]*b[1] + a[9]*b[2] + a[13]*b[3]
    dst[2] = a[2]*b[0] + a[6]*b[1] + a[10]*b[2] + a[14]*b[3]
    dst[3] = a[3]*b[0] + a[7]*b[1] + a[11]*b[2] + a[15]*b[3]
    dst[4] = a[0]*b[4] + a[4]*b[5] + a[8]*b[6] + a[12]*b[7]
    dst[5] = a[1]*b[4] + a[5]*b[5] + a[9]*b[6] + a[13]*b[7]
    dst[6] = a[2]*b[4] + a[6]*b[5] + a[10]*b[6] + a[14]*b[7]
    dst[7] = a[3]*b[4] + a[7]*b[5] + a[11]*b[6] + a[15]*b[7]
    dst[8] = a[0]*b[8] + a[4]*b[9] + a[8]*b[10] + a[12]*b[11]
    dst[9] = a[1]*b[8] + a[5]*b[9] + a[9]*b[10] + a[13]*b[11]
    dst[10] = a[2]*b[8] + a[6]*b[9] + a[10]*b[10] + a[14]*b[11]
    dst[11] = a[3]*b[8] + a[7]*b[9] + a[11]*b[10] + a[15]*b[11]
    dst[12] = a[0]*b[12] + a[4]*b[13] + a[8]*b[14] + a[12]*b[15]
    dst[13] = a[1]*b[12] + a[5]*b[13] + a[9]*b[14] + a[13]*b[15]
    dst[14] = a[2]*b[12] + a[6]*b[13] + a[10]*b[14] + a[14]*b[15]
    dst[15] = a[3]*b[12] + a[7]*b[13] + a[11]*b[14] + a[15]*b[15]
    if (_dst != null) {
        for (let i = 0; i < 16; i++) { _dst[i] = dst[i] }
    }
    return dst
}

function mulTopLeftOf4by4by3Vec(m4x4, vec3, _rtn=null) {
    const a = m4x4[0]*vec3[0] + m4x4[1]*vec3[1] + m4x4[2]*vec3[2]
    const b = m4x4[4]*vec3[0] + m4x4[5]*vec3[1] + m4x4[6]*vec3[2]
    const c = m4x4[8]*vec3[0] + m4x4[9]*vec3[1] + m4x4[10]*vec3[2]
    const rtn = _rtn == null ? [a, b, c] : _rtn
    rtn[0] = a
    rtn[1] = b
    rtn[2] = c
    return rtn
}

function invert4By4(m, _dst) {
    const dst = _dst == null ? new Float32Array([
        0, 0, 0, 0, 
        0, 0, 0, 0, 
        0, 0, 0, 0, 
        0, 0, 0, 0
    ]) : _dst
    const tmp0 = m[10] * m[15]
    const tmp1 = m[14] * m[11]
    const tmp2 = m[6] * m[15]
    const tmp3 = m[14] * m[7]
    const tmp4 = m[6] * m[11]
    const tmp5 = m[10] * m[7]
    const tmp6 = m[2] * m[15]
    const tmp7 = m[14] * m[3]
    const tmp8 = m[2] * m[11]
    const tmp9 = m[10] * m[3]
    const tmp10 = m[2] * m[7]
    const tmp11 = m[6] * m[3]
    const tmp12 = m[8] * m[13]
    const tmp13 = m[12] * m[9]
    const tmp14 = m[4] * m[13]
    const tmp15 = m[12] * m[5]
    const tmp16 = m[4] * m[9]
    const tmp17 = m[8] * m[5]
    const tmp18 = m[0] * m[13]
    const tmp19 = m[12] * m[1]
    const tmp20 = m[0] * m[9]
    const tmp21 = m[8] * m[1]
    const tmp22 = m[0] * m[5]
    const tmp23 = m[4] * m[1]
    const t0 = (tmp0 * m[5] + tmp3 * m[9] + tmp4 * m[13]) - (tmp1 * m[5] + tmp2 * m[9] + tmp5 * m[13])
    const t1 = (tmp1 * m[1] + tmp6 * m[9] + tmp9 * m[13]) - (tmp0 * m[1] + tmp7 * m[9] + tmp8 * m[13])
    const t2 = (tmp2 * m[1] + tmp7 * m[5] + tmp10 * m[13]) - (tmp3 * m[1] + tmp6 * m[5] + tmp11 * m[13])
    const t3 = (tmp5 * m[1] + tmp8 * m[5] + tmp11 * m[9]) - (tmp4 * m[1] + tmp9 * m[5] + tmp10 * m[9])
    const d = 1.0 / (m[0] * t0 + m[4] * t1 + m[8] * t2 + m[12] * t3)
    dst[0] = d * t0
    dst[1] = d * t1
    dst[2] = d * t2
    dst[3] = d * t3
    dst[4] = d * ((tmp1 * m[4] + tmp2 * m[8] + tmp5 * m[12]) - (tmp0 * m[4] + tmp3 * m[8] + tmp4 * m[12]))
    dst[5] = d * ((tmp0 * m[0] + tmp7 * m[8] + tmp8 * m[12]) - (tmp1 * m[0] + tmp6 * m[8] + tmp9 * m[12]))
    dst[6] = d * ((tmp3 * m[0] + tmp6 * m[4] + tmp11 * m[12]) - (tmp2 * m[0] + tmp7 * m[4] + tmp10 * m[12]))
    dst[7] = d * ((tmp4 * m[0] + tmp9 * m[4] + tmp10 * m[8]) - (tmp5 * m[0] + tmp8 * m[4] + tmp11 * m[8]))
    dst[8] = d * ((tmp12 * m[7] + tmp15 * m[11] + tmp16 * m[15]) - (tmp13 * m[7] + tmp14 * m[11] + tmp17 * m[15]))
    dst[9] = d * ((tmp13 * m[3] + tmp18 * m[11] + tmp21 * m[15]) - (tmp12 * m[3] + tmp19 * m[11] + tmp20 * m[15]))
    dst[10] = d * ((tmp14 * m[3] + tmp19 * m[7] + tmp22 * m[15]) - (tmp15 * m[3] + tmp18 * m[7] + tmp23 * m[15]))
    dst[11] = d * ((tmp17 * m[3] + tmp20 * m[7] + tmp23 * m[11]) - (tmp16 * m[3] + tmp21 * m[7] + tmp22 * m[11]))
    dst[12] = d * ((tmp14 * m[10] + tmp17 * m[14] + tmp13 * m[6]) - (tmp16 * m[14] + tmp12 * m[6] + tmp15 * m[10]))
    dst[13] = d * ((tmp20 * m[14] + tmp12 * m[2] + tmp19 * m[10]) - (tmp18 * m[10] + tmp21 * m[14] + tmp13 * m[2]))
    dst[14] = d * ((tmp18 * m[6] + tmp23 * m[14] + tmp15 * m[2]) - (tmp22 * m[14] + tmp14 * m[2] + tmp19 * m[6]))
    dst[15] = d * ((tmp22 * m[10] + tmp16 * m[2] + tmp21 * m[6]) - (tmp20 * m[6] + tmp23 * m[10] + tmp17 * m[2]))
    return dst
}

// invert to use as View Matrix
function lookAt(cameraPosition=[0, 0, 24],
           target=[0, 0, 0],
           up=[0, 1, 0], _dst=null)  {
    const dst = _dst == null ? new Float32Array([
        0, 0, 0, 0, 
        0, 0, 0, 0, 
        0, 0, 0, 0, 
        0, 0, 0, 0
    ]) : _dst
    const zx = cameraPosition[0] - target[0];
    const zy = cameraPosition[1] - target[1];
    const zz = cameraPosition[2] - target[2];
    const zMag = Math.sqrt(zx*zx + zy*zy + zz*zz);
    const xx = up[1] * zz - up[2]*zy;
    const xy = up[2] * zx - up[0]*zz;
    const xz = up[0] * zy - up[1]*zx;
    const xMag = Math.sqrt(xx*xx + xy*xy + xz*xz);
    const yx = zy*xz - zz*xy;
    const yy = zz*xx - zx*xz;
    const yz = zx*xy - zy*xx;
    const yMag = Math.sqrt(yx*yx + yy*yy + yz*yz);
    dst[0] = xx/xMag;
    dst[1] = xy/xMag;
    dst[2] = xz/xMag;
    dst[3] = 0;
    dst[4] = yx/yMag;
    dst[5] = yy/yMag;
    dst[6] = yz/yMag;
    dst[7] = 0;
    dst[8] = zx/zMag;
    dst[9] = zy/zMag;
    dst[10] = zz/zMag;
    dst[11] = 0;
    dst[12] = cameraPosition[0];
    dst[13] = cameraPosition[1];
    dst[14] = cameraPosition[2];
    dst[15] = 1;
    return dst;

}

// use as Projection Matrix
function perspective(_dst, aspect, fov, near=NEAR, far=FAR) {
    const dst = _dst == null ? new Float32Array([
        0, 0, 0, 0, 
        0, 0, 0, 0, 
        0, 0, 0, 0, 
        0, 0, 0, 0
    ]) : _dst
    for (let i = 0; i < dst.length; i++) dst[i] = 0
    const f = Math.tan(0.5 * (PI - fov))
    const rangeInv = 1.0 / (near - far)
    dst[0] = f / aspect
    dst[5] = f
    dst[10] = (near + far) * rangeInv
    dst[11] = -1
    dst[14] = 2 * near * far * rangeInv
    return dst
}

function bezier2P(p1, p2, r) {
    const rtn = []
    for (let i = 0; i < 3; i++) {
        rtn.push(p1[i] * r + p2[i] * (1-r))
    }
    return rtn
}

function bezier3P(p1, p2, p3, r) {
    const q1 = []
    const q2 = []
    for (let i = 0; i < 3; i++) {
        q1.push(p1[i] * r + p2[i] * (1 - r))
        q2.push(p2[i] * r + p3[i] * (1 - r))
    }
    return bezier2P(q1, q2, r)
}

function bezier2V(v1, v2, r) {
    return v1 * r + v2 * (1 - r)
}

function bezier3V(v1, v2, v3, r) {
    const w1 = v1 * r + v2 * (1 - r)
    const w2 = v2 * r + v3 * (1 - r)
    return bezier2V(w1, w2, r)
}

function sCurve(x) { return 3*x*x - 2*x*x*x }

function sCurveInv(x, maxToMin=5) {
    const c = 2 * Math.sqrt(maxToMin - 1)
    const area = 1 + c * c * ((1 / 3) - (1 / 2) + (1 / 4))
    const pos = c*c*x*x*x/3 - c*c*x*x/2 + (c*c/4 + 1)*x
    return pos / area
}

