

function geoDist(p0, p1) {
  let sm = 0;
  for (let i = 0; i < p0.length; i++) {
    const d = p0[i] - p1[i]
    sm += d*d
  }
  return Math.sqrt(sm)
}

function mul3x3 (a, b) {
  const rtn = [0, 0, 0, 0, 0, 0, 0, 0, 0]
  rtn[0] = b[0]*a[0] + b[3]*a[1] + b[6]*a[2]
  rtn[1] = b[1]*a[0] + b[4]*a[1] + b[7]*a[2]
  rtn[2] = b[2]*a[0] + b[5]*a[1] + b[8]*a[2]
  rtn[3] = b[0]*a[3] + b[3]*a[4] + b[6]*a[5]
  rtn[4] = b[1]*a[3] + b[4]*a[4] + b[7]*a[5]
  rtn[5] = b[2]*a[3] + b[5]*a[4] + b[8]*a[5]
  rtn[6] = b[0]*a[6] + b[3]*a[7] + b[6]*a[8]
  rtn[7] = b[1]*a[6] + b[4]*a[7] + b[7]*a[8]
  rtn[8] = b[2]*a[6] + b[5]*a[7] + b[8]*a[8]
  return rtn
}

function mul3x3vec(m, v) {
  const rtn = [0, 0, 0]
  rtn[0] = m[0]*v[0] + m[1]*v[1] + m[2]*v[2]
  rtn[1] = m[3]*v[0] + m[4]*v[1] + m[5]*v[2]
  rtn[2] = m[6]*v[0] + m[7]*v[1] + m[8]*v[2]
  return rtn
}

function center_cutter(abcd, range=0.3, max_dev=0.07) {
  const a = abcd[0]
  const b = abcd[1]
  const c = abcd[2]
  const d = abcd[3]
  /*

  x = ay^3 + by^2 + cy + d
  dx/dx = 3ay^2 + 2by + c

  zero_1 = (-2b + sqrt(4b^2 - 12ac)) / (6a)
  zero_2 = (-2b - sqrt(4b^2 - 12ac)) / (6a)

  */
  const minMaxYs = []
  minMaxYs.push(a + b + c + d)
  minMaxYs.push(-a + b + -c + d)
  if (4*b*b - 12*a*c >= 0) {
    const z1 = (-2*b - Math.sqrt(4*b*b - 12*a*c)) / (6*a)
    const z2 = (-2*b + Math.sqrt(4*b*b - 12*a*c)) / (6*a)
    if ((-1 <= z1) && (z1 <= 1)) {
      minMaxYs.push(a*z1*z1*z1 + b*z1*z1 + c*z1 + d)
    }
    if ((-1 <= z2) && (z2 <= 1)) {
      minMaxYs.push(a*z2*z2*z2 + b*z2*z2 + c*z2 + d)
    }
  }
  let mn = minMaxYs[0]
  let mx = minMaxYs[0]
  for (let i = 1; i < minMaxYs.length; i++) {
    mn = Math.min(minMaxYs[i], mn)
    mx = Math.max(minMaxYs[i], mx)
  }
  
  const scale = mx - mn > range ? range / (mx - mn) : 1
  abcd[0] *= scale
  abcd[1] *= scale
  abcd[2] *= scale
  abcd[3] *= scale

  const center = 0.5 * (mx + mn) * scale
  abcd[3] -= center
}

function print_for_kotlin(posNormInd){
  const res = 10000
  for(let i = 0; i < posNormInd.posArr.length; i++) posNormInd.posArr[i] = Math.round(res*posNormInd.posArr[i])/res;
  for(let i = 0; i < posNormInd.normArr.length; i++) posNormInd.normArr[i] = Math.round(res*posNormInd.normArr[i])/res;

  return {
    pos:JSON.stringify(posNormInd.posArr).replace("[", "").replace("]", "").replaceAll(",", "f,").replaceAll("-0f", "0f") + "f",
    norm:JSON.stringify(posNormInd.normArr).replace("[", "").replace("]", "").replaceAll(",", "f,").replaceAll("-0f", "0f") + "f",
    ind:JSON.stringify(posNormInd.indArr).replace("[", "").replace("]", "")
  }
}

function printAsObj(pos4, norm4, ind3) {
  let rtn = ""
  for (let i = 0; i < pos4.length; i+=4) {
    rtn += `v ${pos4[i]} ${pos4[i+1]} ${pos4[i+2]}\n`;
  }
  for (let i = 0; i < norm4.length; i+=4) {
    rtn += `vn ${norm4[i]} ${norm4[i+1]} ${norm4[i+2]}\n`;
  }
  for (let i = 0; i < ind3.length; i+=3) {
    rtn += `f ${1+ind3[i]} ${1+ind3[i+1]} ${1+ind3[i+2]}\n`
  }
  return rtn;
}


function dot(a, b) {
  let rtn = 0
  for (let i = 0; i < a.length; i++) {
    rtn += a[i]*b[i]
  }
  return rtn;
}

function scaleVec(c, a) {
  return [c*a[0] + c*a[1] + c*a[2]];
}

function add(aC, a, bC, b) {
  return [
    aC*a[0] + bC*b[0],
    aC*a[1] + bC*b[1],
    aC*a[2] + bC*b[2],
  ];
}

function cross(a, b) {
  return [
    a[1]*b[2] - a[2]*b[1],
    a[2]*b[0] - a[0]*b[2],
    a[0]*b[1] - a[1]*b[0],
  ];
}


function vectorPlaneIntersect(v0, vd, pp, pn) {
  const vectorDotNormal = dot(vd, pn);
  if (vectorDotNormal == 0) return [-1, null];
  const d = dot(add(1, pp, -1, v0), pn) / vectorDotNormal;
  return [d, add(1, v0, d, vd)];
}

function vectorThreePointPlaneIntersect(v0, vd, p0, p1, p2){
  const a1 = p2[0] - p1[0];
  const a2 = p2[1] - p1[1];
  const a3 = p2[2] - p1[2];
  const b1 = p0[0] - p1[0];
  const b2 = p0[1] - p1[1];
  const b3 = p0[2] - p1[2];
  const pn = [
    a2*b3-a3*b2,
    a3*b1-a1*b3,
    a1*b2-a2*b1,
  ];
  return vectorPlaneIntersect(v0, vd, p0, pn);
}


function multiply(a, b, dst) {
  dst = dst || new Float32Array(16);
  const b00 = b[0];
  const b01 = b[1];
  const b02 = b[2];
  const b03 = b[3];
  const b10 = b[4];
  const b11 = b[5];
  const b12 = b[6];
  const b13 = b[7];
  const b20 = b[8];
  const b21 = b[9];
  const b22 = b[10];
  const b23 = b[11];
  const b30 = b[12];
  const b31 = b[13];
  const b32 = b[14];
  const b33 = b[15];
  const a00 = a[0];
  const a01 = a[1];
  const a02 = a[2];
  const a03 = a[3];
  const a10 = a[4];
  const a11 = a[5];
  const a12 = a[6];
  const a13 = a[7];
  const a20 = a[8];
  const a21 = a[9];
  const a22 = a[10];
  const a23 = a[11];
  const a30 = a[12];
  const a31 = a[13];
  const a32 = a[14];
  const a33 = a[15];
  dst[ 0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
  dst[ 1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
  dst[ 2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
  dst[ 3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
  dst[ 4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
  dst[ 5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
  dst[ 6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
  dst[ 7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
  dst[ 8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
  dst[ 9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
  dst[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
  dst[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
  dst[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
  dst[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
  dst[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
  dst[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;
  return dst;
}

function skew_rot_rod_trans(M, o){
  const cos_th_z = Math.cos(o.th_z);
  const sin_th_z = Math.sin(o.th_z);
  const t00 = cos_th_z*o.sx;
  const t01 = -sin_th_z*o.sy;
  const t10 = sin_th_z*o.sx;
  const t11 = cos_th_z*o.sy;
  const a = Math.cos(o.th/2);
  const sin_th_over_2 = Math.sin(o.th/2);
  const b = o.k0*sin_th_over_2;
  const c = o.k1*sin_th_over_2;
  const ab2 = 2*a*b, ac2 = 2*a*c, bc2 = 2*b*c;
  const aa = a*a, bb = b*b, cc = c*c;
  const d00 = aa + bb - cc
  const d11 = aa - bb + cc
  const d22 = aa - bb - cc;
  M[0] = d00*t00 + bc2*t10;
  M[1] = bc2*t00 + d11*t10;
  M[2] = ab2*t10 - ac2*t00;
  M[3] = 0;
  M[4] = d00*t01 + bc2*t11;
  M[5] = bc2*t01 + d11*t11;
  M[6] = ab2*t11 - ac2*t01;
  M[7] = 0;
  M[8] = o.sz*ac2;
  M[9] = -o.sz*ab2;
  M[10] = o.sz*d22;
  M[11] = 0;
  M[12] = o.x;
  M[13] = o.y;
  M[14] = o.z;
  M[15] = 1;
}

function inverseCentered(m, dst) {
  dst = dst || new Float32Array(16);
  const m00 = m[0],  m01 = m[1],  m02 = m[2];
  const m10 = m[4],  m11 = m[5],  m12 = m[6];
  const m20 = m[8],  m21 = m[9],  m22 = m[10];
  const tmp_16 = m10 * m21, tmp_17 = m20 * m11;
  const tmp_20 = m00 * m21;
  const tmp_21 = m20 * m01, tmp_22 = m00 * m11, tmp_23 = m10 * m01;
  const t0 = (m22 * m11) - ( m12 * m21);
  const t1 = (m02 * m21) - (m22 * m01);
  const t2 = ( m12 ) - (m02 * m11);
  const d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2);
  dst[0] = d * t0;
  dst[1] = d * t1;
  dst[2] = d * t2;
  dst[3] = 0
  dst[4] = d * (( m12 * m20) - (m22 * m10));
  dst[5] = d * ((m22 * m00) - (m02 * m20));
  dst[6] = d * ((m02 * m10) - ( m12 * m00));
  dst[7] = 0
  dst[8] = d * ((tmp_16) - (tmp_17));
  dst[9] = d * ((tmp_21) - (tmp_20));
  dst[10] = d * ((tmp_22) - (tmp_23));
  dst[11] = 0
  dst[12] = 0
  dst[13] = 0
  dst[14] = 0
  dst[15] = 1
  return dst;
}

function inverse(m, dst) {
  dst = dst || new Float32Array(16);
  const m00 = m[0],  m01 = m[1],  m02 = m[2],  m03 = m[3];
  const m10 = m[4],  m11 = m[5],  m12 = m[6],  m13 = m[7];
  const m20 = m[8],  m21 = m[9],  m22 = m[10], m23 = m[11];
  const m30 = m[12], m31 = m[13], m32 = m[14], m33 = m[15];
  const tmp_0  = m22 * m33, tmp_1  = m32 * m23, tmp_2  = m12 * m33;
  const tmp_3  = m32 * m13, tmp_4  = m12 * m23, tmp_5  = m22 * m13;
  const tmp_6  = m02 * m33, tmp_7  = m32 * m03, tmp_8  = m02 * m23;
  const tmp_9  = m22 * m03, tmp_10 = m02 * m13, tmp_11 = m12 * m03;
  const tmp_12 = m20 * m31, tmp_13 = m30 * m21, tmp_14 = m10 * m31;
  const tmp_15 = m30 * m11, tmp_16 = m10 * m21, tmp_17 = m20 * m11;
  const tmp_18 = m00 * m31, tmp_19 = m30 * m01, tmp_20 = m00 * m21;
  const tmp_21 = m20 * m01, tmp_22 = m00 * m11, tmp_23 = m10 * m01;
  const t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) - (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
  const t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) - (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
  const t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) - (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
  const t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) - (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);
  const d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);
  dst[0] = d * t0;
  dst[1] = d * t1;
  dst[2] = d * t2;
  dst[3] = d * t3;
  dst[4] = d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) - (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30));
  dst[5] = d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) - (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30));
  dst[6] = d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) - (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30));
  dst[7] = d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) - (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20));
  dst[8] = d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) - (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33));
  dst[9] = d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) - (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33));
  dst[10] = d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) - (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33));
  dst[11] = d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) - (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23));
  dst[12] = d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) - (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22));
  dst[13] = d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) - (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02));
  dst[14] = d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) - (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12));
  dst[15] = d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) - (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02));
  return dst;
}

function look_at(cam_pos, target, up, dst) {
  const rtn = dst || new Float32Array(16);
  const z_x = cam_pos[0] - target[0];
  const z_y = cam_pos[1] - target[1];
  const z_z = cam_pos[2] - target[2];
  const z_mag = Math.sqrt(z_x*z_x + z_y*z_y + z_z*z_z);
  const x_x = up[1]*z_z - up[2]*z_y;
  const x_y = up[2]*z_x - up[0]*z_z;
  const x_z = up[0]*z_y - up[1]*z_x;
  const x_mag = Math.sqrt(x_x*x_x + x_y*x_y + x_z*x_z);
  const y_x = z_y*x_z - z_z*x_y;
  const y_y = z_z*x_x - z_x*x_z;
  const y_z = z_x*x_y - z_y*x_x;
  const y_mag = Math.sqrt(y_x*y_x + y_y*y_y + y_z*y_z);
  rtn[0] = x_x/x_mag;
  rtn[1] = x_y/x_mag;
  rtn[2] = x_z/x_mag;
  rtn[3] = 0;
  rtn[4] = y_x/y_mag;
  rtn[5] = y_y/y_mag;
  rtn[6] = y_z/y_mag;
  rtn[7] = 0;
  rtn[8] = z_x/z_mag;
  rtn[9] = z_y/z_mag;
  rtn[10] = z_z/z_mag;
  rtn[11] = 0;
  rtn[12] = cam_pos[0];
  rtn[13] = cam_pos[1];
  rtn[14] = cam_pos[2];
  rtn[15] = 1;
  return rtn;
}

function perspective(fieldOfViewInRadians, aspect, near, far, dst) {
  dst = dst || new Float32Array(16);
  const f = Math.tan(0.5*(Math.PI - fieldOfViewInRadians));
  const rangeInv = 1.0 / (near - far);
  dst[ 0] = f / aspect;
  dst[ 1] = 0;
  dst[ 2] = 0;
  dst[ 3] = 0;
  dst[ 4] = 0;
  dst[ 5] = f;
  dst[ 6] = 0;
  dst[ 7] = 0;
  dst[ 8] = 0;
  dst[ 9] = 0;
  dst[10] = (near + far) * rangeInv;
  dst[11] = -1;
  dst[12] = 0;
  dst[13] = 0;
  dst[14] = near * far * rangeInv * 2;
  dst[15] = 0;
  return dst;
}

function swap_vertex_indices(verts,  norm, indices, i0){
  const a1 = verts[indices[i0]*3+0] - verts[indices[i0+1]*3+0];
  const a2 = verts[indices[i0]*3+1] - verts[indices[i0+1]*3+1];
  const a3 = verts[indices[i0]*3+2] - verts[indices[i0+1]*3+2];
  const b1 = verts[indices[i0+2]*3+0] - verts[indices[i0+1]*3+0];
  const b2 = verts[indices[i0+2]*3+1] - verts[indices[i0+1]*3+1];
  const b3 = verts[indices[i0+2]*3+2] - verts[indices[i0+1]*3+2];
  const cx = a2*b3-a3*b2;
  const cy = a3*b1-a1*b3;
  const cz = a1*b2-a2*b1;
  const d = cx*norm[0] + cy*norm[1] + cz*norm[2];
  let temp;
  if(d > 0){
    temp = indices[i0];
    indices[i0] = indices[i0+1];
    indices[i0+1] = temp;
  }
}
