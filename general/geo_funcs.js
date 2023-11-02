
let delta = 0.01
function adjustParams(S, p, divName="params"){
  if(!S.shapeGem) return
  document.getElementById(divName).innerHTML = ""
  for(key in p){
    if(key == "divs") continue;
    e = document.createElement("div")
    e.innerHTML = `${key}: ${p[key]}`
    e.onwheel = (e)=>{
      e.preventDefault()
      if(p[e.target.innerHTML.substr(0, e.target.innerHTML.indexOf(":"))] > 0.01){
        p[e.target.innerHTML.substr(0, e.target.innerHTML.indexOf(":"))] *= e.deltaY > 0 ? (1+delta) : (1 - delta);
      } else if(p[e.target.innerHTML.substr(0, e.target.innerHTML.indexOf(":"))] < -0.01) {
        p[e.target.innerHTML.substr(0, e.target.innerHTML.indexOf(":"))] *= e.deltaY > 0 ?  (1 - delta) : (1+delta);
      } else {
        p[e.target.innerHTML.substr(0, e.target.innerHTML.indexOf(":"))] += e.deltaY > 0 ? 0.0002 : -0.0002;
      }
      e.target.innerHTML = e.target.innerHTML.substr(0, e.target.innerHTML.indexOf(":")) + ": " + p[e.target.innerHTML.substr(0, e.target.innerHTML.indexOf(":"))]
      reCalcCube();
    }
    document.getElementById(divName).appendChild(e)
    //document.getElementById(divName).appendChild(document.createElement("br"))
  }

}


function unroll(pos, norm, ind) {
  const p2 = [];
  const n2 = [];
  const ind2 = [];
  for (let i = 0; i < ind.length; i+=3) {
    const i0 = ind[i]
    const i1 = ind[i+1]
    const i2 = ind[i+2]
    ind2.push(i)
    ind2.push(i+1)
    ind2.push(i+2)
    for (let j = 0; j < 4; j++) p2.push(pos[4*i0 + j])
    for (let j = 0; j < 4; j++) p2.push(pos[4*(i1) + j])
    for (let j = 0; j < 4; j++) p2.push(pos[4*(i2) + j])
    for (let j = 0; j < 4; j++) n2.push(norm[4*i0 + j])
    for (let j = 0; j < 4; j++) n2.push(norm[4*(i1) + j])
    for (let j = 0; j < 4; j++) n2.push(norm[4*(i2) + j])
  }
  return { pos: p2, norm: n2, ind: ind2}
}

function PNIA_from_PNI(gl, PNI, combine_equal_norms=false, exclude_orthoginal=false) {
  const unrolled = unroll(PNI.posArr, PNI.normArr, PNI.indArr)
  aveArr = []
  for (let i = 0; i < unrolled.pos.length; i += 12) {
    for (let j = 0; j < 3; j++) {
      let sm = unrolled.pos[i + j]
      sm += unrolled.pos[i + j + 4]
      sm += unrolled.pos[i + j + 8]
      aveArr.push(sm/3);
    }
    aveArr.push(0)
    for (let j = 4; j < 12; j++) {
      aveArr.push(aveArr[aveArr.length - 4])
    }
  }
  if (!combine_equal_norms) {
    return PosNormIndAve(gl, unrolled.pos, unrolled.norm, unrolled.ind, aveArr)
  }
  const ns = unrolled.norm
  for (let i = 0; i < ns.length; i += 12) {
    const eqs = [i]
    for (let j = i + 12; j < ns.length; j+=12) {
      if (0.0000001 > Math.abs(ns[j]-ns[i]) + Math.abs(ns[j+1]-ns[i+1]) + Math.abs(ns[j+2]-ns[i+2])) {
        const isOrthignal = Math.abs(ns[j]) == 1 || Math.abs(ns[j+1]) == 1 || Math.abs(ns[j+2]) == 1
        if (!isOrthignal || !exclude_orthoginal) {
          eqs.push(j)
        }
      }
    }
    aves = [0, 0, 0]
    for (const j of eqs) {
      aves[0] += aveArr[j+0] / eqs.length
      aves[1] += aveArr[j+1] / eqs.length
      aves[2] += aveArr[j+2] / eqs.length
    }
    for (const j of eqs) {
      for (let k = 0; k < 12; k += 4) {
        aveArr[j+k+0] = aves[0]
        aveArr[j+k+1] = aves[1]
        aveArr[j+k+2] = aves[2]
      }
    }

  }

  return PosNormIndAve(gl, unrolled.pos, unrolled.norm, unrolled.ind, aveArr)
}

function PosNormInd(gl, _pos, _norm, _ind){
  const pos_buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, pos_buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(_pos), gl.STATIC_DRAW);
  const norm_buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, norm_buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(_norm), gl.STATIC_DRAW);
  const ind_buf = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ind_buf);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(_ind), gl.STATIC_DRAW);
  return {
    pos:pos_buf,
    norm: norm_buf,
    ind: ind_buf,
    posArr: _pos,
    normArr: _norm,
    indArr: _ind,
  }
}
function PosNormIndAve(gl, _pos, _norm, _ind, _ave){
  const pos_buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, pos_buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(_pos), gl.STATIC_DRAW);
  const norm_buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, norm_buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(_norm), gl.STATIC_DRAW);
  const ind_buf = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ind_buf);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(_ind), gl.STATIC_DRAW);
  const ave_buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, ave_buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(_ave), gl.STATIC_DRAW);
  return {
    pos:pos_buf,
    norm: norm_buf,
    ind: ind_buf,
    ave: ave_buf,
    posArr: _pos,
    normArr: _norm,
    indArr: _ind,
    aveArr: _ave,
  }
}

function setNaturalNormals(pos, norm, ind, i, hint=false) {
    const a1 = pos[ind[i + 0] * COORDS_PER_VERTEX + 0] - pos[ind[i + 1] * COORDS_PER_VERTEX + 0]
    const a2 = pos[ind[i + 0] * COORDS_PER_VERTEX + 1] - pos[ind[i + 1] * COORDS_PER_VERTEX + 1]
    const a3 = pos[ind[i + 0] * COORDS_PER_VERTEX + 2] - pos[ind[i + 1] * COORDS_PER_VERTEX + 2]
    const b1 = pos[ind[i + 2] * COORDS_PER_VERTEX + 0] - pos[ind[i + 1] * COORDS_PER_VERTEX + 0]
    const b2 = pos[ind[i + 2] * COORDS_PER_VERTEX + 1] - pos[ind[i + 1] * COORDS_PER_VERTEX + 1]
    const b3 = pos[ind[i + 2] * COORDS_PER_VERTEX + 2] - pos[ind[i + 1] * COORDS_PER_VERTEX + 2]
    const cross = [a2*b3 - a3*b2, a3*b1 - a1*b3, a1*b2 - a2*b1]
    const dot = cross[0]*norm[i] + cross[1]*norm[i+1] + cross[2]*norm[i+2]
    const mag = Math.sqrt(cross[0]*cross[0] + cross[1]*cross[1] + cross[2]*cross[2])
    cross[0] /= -mag
    cross[1] /= -mag
    cross[2] /= -mag
    if(hint && (dot < 0)){
        cross[0] = -cross[0]
        cross[1] = -cross[1]
        cross[2] = -cross[2]
    }
    for(let j = 0; j < 3; j++){
        norm[ind[i+j] * COORDS_PER_VERTEX + 0] = cross[0]
        norm[ind[i+j] * COORDS_PER_VERTEX + 1] = cross[1]
        norm[ind[i+j] * COORDS_PER_VERTEX + 2] = cross[2]
    }
}


function get4thcorner(verts, _i0, _i1, _i2, newZ, vertSize=3) {
    function dot(a, b){
      let rtn = 0;
      for(let i = 0; i < a.length; i++) rtn += a[i]*b[i];
      return rtn;
    }
    const i0 = vertSize*_i0
    const i1 = vertSize*_i1
    const i2 = vertSize*_i2
    const useXIntersection = Math.abs(verts[i2] - verts[i1]) < Math.abs(verts[i2+1] - verts[i1+1])
    const e = [verts[i0] - verts[i1], verts[i0+1] - verts[i1+1], verts[i0+2] - verts[i1+2]]
    const f = [verts[i2] - verts[i1], verts[i2+1] - verts[i1+1], verts[i2+2] - verts[i1+2]]
    const n1 = [e[1]*f[2] - e[2]*f[1], e[2]*f[0] - e[0]*f[2], e[0]*f[1] - e[1]*f[0]]
    const n2 = [0, 0, 1]
    const v = [n1[1]*n2[2] - n1[2]*n2[1], n1[2]*n2[0] - n1[0]*n2[2], n1[0]*n2[1] - n1[1]*n2[0]]
    // get K for Ax + By + Cz = K
    const K1 = n1[0]*verts[i0] + n1[1]*verts[i0+1] + n1[2]*verts[i0+2]
    const K2 = n2[2]*newZ
    const intersection = useXIntersection ? (K1-K2*n1[2]/n2[2])/n1[0] : (K1-K2*n1[2]/n2[2])/n1[1]
    const r = useXIntersection ? [intersection, 0, newZ] : [0, intersection, newZ]
    const cornerNormal = [verts[i1]-verts[i2], verts[i1+1]-verts[i2+1], verts[i1+2]-verts[i2+2]]
    const cornerToCornerMag = Math.sqrt(cornerNormal[0]*cornerNormal[0] + cornerNormal[1]*cornerNormal[1] + cornerNormal[2]*cornerNormal[2])
    cornerNormal[0] /= cornerToCornerMag
    cornerNormal[1] /= cornerToCornerMag
    cornerNormal[2] /= cornerToCornerMag
    const centerPoint = [(verts[i2] + verts[i1])/2, (verts[i2+1] + verts[i1+1])/2,(verts[i2+2] + verts[i1+2])/2]
    const d = dot([centerPoint[0]-r[0], centerPoint[1]-r[1], centerPoint[2]-r[2]], cornerNormal)/dot(v, cornerNormal)
    return [r[0] + v[0]*d, r[1] + v[1]*d, r[2] + v[2]*d]
}
