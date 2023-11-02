

const plane_vert_buf = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, plane_vert_buf);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-0.5,0.5,0,1,0.5,-0.5,0,1,0.5,0.5,0,1,0.5,-0.5,0,1,-0.5,0.5,0,1,-0.5,-0.5,0,1]), gl.STATIC_DRAW);
const plane_norm_buf = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, plane_norm_buf);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0]), gl.STATIC_DRAW);
const plane_uv_buf = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, plane_uv_buf);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0,0,1,1,1,0,1,1,0,0,0,1]), gl.STATIC_DRAW);

function getSphere(gl, N, scale=1, xyz) {
  const verts = []
  const norms = []
  const inds = []
  for (let i = 0; i <= N; i++) {
    for (let j = 0; j <= N; j++) {
      verts.push(-1 + 2*i/N, 1, -1 +  2*j/N, 1)
      if (i == N || j == N) continue;
      inds.push(i*(1+N) + j, i*(1+N) + j + 1, (i+1)*(1+N) + j)
      inds.push(i*(1+N) + j + 1, (i+1)*(1+N) + j + 1, (i+1)*(1+N) + j)
    }
  }
  const vertsSize = verts.length
  const indsSize = inds.length
  let maxInd = 1 + inds.reduce((acc, curr) => {return Math.max(acc, curr)}, -1)
  let angle = 0
  for (let i = 0; i < 3; i++) {
    angle += Math.PI/2
    for (let j = 0; j < vertsSize; j+= 4) {
      verts.push(verts[j]*Math.cos(angle) - verts[j+1]*Math.sin(angle))
      verts.push(verts[j]*Math.sin(angle) + verts[j+1]*Math.cos(angle))
      verts.push(verts[j+2])
      verts.push(1)
    }
    for (let j = 0; j < indsSize; j++) {
      inds.push(inds[j] + (i+1)*maxInd)
    }
  }
  for (let h = 0; h < 2; h++) {
    angle = Math.PI * (h + 0.5)
    for (let j = 0; j < vertsSize; j+= 4) {
      verts.push(verts[j])
      verts.push(verts[j+1]*Math.cos(angle) - verts[j+2]*Math.sin(angle))
      verts.push(verts[j+1]*Math.sin(angle) + verts[j+2]*Math.cos(angle))
      verts.push(1)
    }
    for (let j = 0; j < indsSize; j++) {
      inds.push(inds[j] + (4 + h)*maxInd)
    }
  }

  for (let i = 0; i < verts.length; i+=4) {
    const dst = Math.sqrt(verts[i]*verts[i] + verts[i+1]*verts[i+1] + verts[i+2]*verts[i+2]);
    verts[i] /= dst
    verts[i+1] /= dst
    verts[i+2] /= dst
  }
  for (let i = 0; i < verts.length; i+=4) {
    norms.push(verts[i])
    norms.push(verts[i+1])
    norms.push(verts[i+2])
    norms.push(0)
    verts[i] *= scale
    verts[i+1] *= scale
    verts[i+2] *= scale
    verts[i] += xyz[0];
    verts[i+1] += xyz[1];
    verts[i+2] += xyz[2];
    
  }
  return PosNormInd(gl, verts, norms, inds)
}

function getCyl(gl, N, sx=1, sy=1, sz=1, xyz, rot=null) {
  const verts = []
  const norms = []
  const inds = [];
  /*
  verts.push(0, 0, 1, 1)
  norms.push(0, 0, 1, 0)
  for (let i = 0; i < N*4; i++) {
    verts.push(Math.cos(i * Math.PI/(2*N)), Math.sin(i * Math.PI/(2*N)), 1, 1)
    norms.push(0, 0, 1, 0)
    inds.push(0, i + 1, 1 + (i + 1) % (4*N))
  }
  inds_length = inds.length
  const indCount = 1 + inds.reduce((a, c) => Math.max(a, c), -1);
  verts_length = verts.length
  for (let i = 0; i < verts_length; i+=4) {
    verts.push(-verts[i], verts[i+1], -verts[i+2], 1)
    norms.push(0, 0, -1, 0)
  }
  for (let i = 0; i < inds_length; i++) {
    inds.push(inds[i] + indCount)
  }
  */
  for (let i = 0; i < N*4; i++) {
    verts.push(Math.cos(i * Math.PI/(2*N)), Math.sin(i * Math.PI/(2*N)), 1, 1)
    verts.push(Math.cos(i * Math.PI/(2*N)), Math.sin(i * Math.PI/(2*N)), -1, 1)
  }
  for (let i = 0; i < N*4; i++) {
    inds.push(
      2*i + 0, 
      2*i + 1, 
      (2*i + 2)%(8*N) + 0)
    inds.push( 
      (2*i + 2)%(8*N) + 0,
       2*i + 1,  
       (2*i + 2)%(8*N) + 1)
  }
  for (let i = 0; i < verts.length; i+=4) {
    norms.push(verts[i], verts[i+1], 0, 0)
    verts[i] *= sx
    verts[1+i] *= sy
    verts[2+i] *= sz
  }
  if (rot != null) {
    for (let i = 0; i < verts.length; i+=4) {
      const p = [verts[i], verts[i+1], verts[i+2]]
      const rotd = mul3x3vec(rot, p)
      verts[i] = rotd[0]
      verts[i+1] = rotd[1]
      verts[i+2] = rotd[2]
      const n = [norms[i], norms[i+1], norms[i+2]]
      const rotdn = mul3x3vec(rot, n)
      norms[i] = rotdn[0]
      norms[i+1] = rotdn[1]
      norms[i+2] = rotdn[2]
    }
  }
  for (let i = 0; i < verts.length; i+=4) {
    verts[i] += xyz[0]
    verts[i+1] += xyz[1]
    verts[i+2] += xyz[2]
  }

  return PosNormInd(gl, verts, norms, inds)
}


function getCube(gl, x=1, y=1, z=1){
  const verts = [
    -1, 1, 1, 1,
    -1, -1, 1, 1,
    1, -1, 1, 1,
    1, 1, 1, 1,
    -1, 1, -1, 1,
    -1, -1, -1, 1,
    1, -1, -1, 1,
    1, 1, -1, 1,
    -1, 1, 1, 1,
    -1, 1, -1, 1,
    1, 1, -1, 1,
    1, 1, 1, 1,
    -1, -1, 1, 1,
    -1, -1, -1, 1,
    1, -1, -1, 1,
    1, -1, 1, 1,
    1, -1, 1, 1,
    1, -1, -1, 1,
    1, 1, -1, 1,
    1, 1, 1, 1,
    -1, -1, 1, 1,
    -1, -1, -1, 1,
    -1, 1, -1, 1,
    -1, 1, 1, 1,
  ];
  const norms = [
    0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0,
    0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0,
    0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0,
    0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0,
    1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0,
    -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0,
  ];
  const inds = [
    0, 1, 2, 0, 2, 3,
    4, 6, 5, 4, 7, 6,
    8, 10, 9, 8, 11, 10,
    12, 13, 14, 12, 14, 15,
    16, 17, 18, 16, 18, 19,
    20, 22, 21, 20, 23, 22,
  ];
  for(let i = 0; i < verts.length; i+=4){
    verts[i] *= x;
    verts[i+1] *= y;
    verts[i+2] *= z;
  }
  const posBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
  const normBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normBuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(norms), gl.STATIC_DRAW);
  const indBuf = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indBuf);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(inds), gl.STATIC_DRAW);
  return {pos: posBuf, norm: normBuf, ind: indBuf, posArr: verts, normArr: norms, indArr: inds};
}
