
roundParams = {"segs":8,"inner_d":0.17961638977967145,"middle_d":0.26740171530011847,"dz0":0.041221340751045096,"dz1":0.07409036538095672,"dz2":0.01458610266127628}


function getRoundPosNormInd(p, wh=1){
  const total_z = p.dz0 + p.dz1 + p.dz2;
  const segs = 2*Math.round(p.segs/2)
  const verts = [0, 0, total_z];
  const inds = [];
  for(let i = 0; i < segs; i++){
    verts.push(p.inner_d*Math.cos(i*2*Math.PI/segs), p.inner_d*Math.sin(i*2*Math.PI/segs), total_z);
    inds.push(0, i+1, 1 + (i+1) % segs)
  }
  for(let i = 0; i < segs; i++){
    verts.push(p.inner_d*Math.cos((i+1)*2*Math.PI/segs), p.inner_d*Math.sin((i+1)*2*Math.PI/segs), total_z);
    verts.push(p.inner_d*Math.cos(i*2*Math.PI/segs), p.inner_d*Math.sin(i*2*Math.PI/segs), total_z);
    verts.push(p.middle_d*Math.cos((i+0.5)*2*Math.PI/segs), p.middle_d*Math.sin((i+0.5)*2*Math.PI/segs), total_z - p.dz0);
    inds.push(1  +segs + 3*i, 1+segs + 3*i+1, 1+segs + 3*i + 2);
  }

  for(let i = 0; i < segs; i++){
    const j = (i-1+segs)%segs;
    let newP = get4thcorner(verts, 1+segs+3*i+1, 1+segs+3*i+2, 1+segs+3*j+2, total_z - p.dz0 - p.dz1);
    verts.push(p.middle_d*Math.cos((i+0.5)*2*Math.PI/segs), p.middle_d*Math.sin((i+0.5)*2*Math.PI/segs), total_z - p.dz0);
    verts.push(p.inner_d*Math.cos(i*2*Math.PI/segs), p.inner_d*Math.sin(i*2*Math.PI/segs), total_z);
    verts.push(newP[0], newP[1], newP[2]);
    verts.push(p.inner_d*Math.cos(i*2*Math.PI/segs), p.inner_d*Math.sin(i*2*Math.PI/segs), total_z);
    verts.push(p.middle_d*Math.cos((j+0.5)*2*Math.PI/segs), p.middle_d*Math.sin((j+0.5)*2*Math.PI/segs), total_z - p.dz0);
    verts.push(newP[0], newP[1], newP[2]);
    inds.push(
      1  + 4*segs + 6*i,
      1  + 4*segs + 6*i+1,
      1  + 4*segs + 6*i + 2,
      1  + 4*segs + 6*i + 3,
      1+4*segs + 6*i+4,
      1+4*segs + 6*i + 5,
    );
  }
  for(let i = 0; i < segs; i++){
    const j = (i+1) % segs;
    const i0 = 1 + segs + 3*segs + 6*i + 2;
    const i1 = 1 + segs + 3*segs + 6*j + 2;
    const i2 = 1 + segs + 3*segs + 6*i + 0;
    const newP = get4thcorner(verts, i2, i0, i1,  total_z - p.dz0 - p.dz1 - p.dz2);
    verts.push(verts[i1*3], verts[i1*3+1], verts[i1*3+2]);
    verts.push(verts[i2*3], verts[i2*3+1], verts[i2*3+2]);
    verts.push(newP[0], newP[1], newP[2]);
    verts.push(verts[i2*3], verts[i2*3+1], verts[i2*3+2]);
    verts.push(verts[i0*3], verts[i0*3+1], verts[i0*3+2]);
    verts.push(newP[0], newP[1], newP[2]);
    inds.push(
      1  + 10*segs + 6*i,
      1  + 10*segs + 6*i+1,
      1  + 10*segs + 6*i+2,
      1  + 10*segs + 6*i+3,
      1  + 10*segs + 6*i+4,
      1  + 10*segs + 6*i+5,
    );
  }

  for(let i = 0; i < segs; i++){
    const i0 = 1 + 10*segs + 6*i + 2;
    const i1 = 1 + 10*segs + 6*i + 0;
    verts.push(verts[i1*3], verts[i1*3+1], verts[i1*3+2]);
    verts.push(verts[i0*3], verts[i0*3+1], verts[i0*3+2]);
    verts.push(verts[i1*3], verts[i1*3+1], -verts[i1*3+2]);
    inds.push(
      1  + 16*segs + 3*i,
      1  + 16*segs + 3*i+1,
      1  + 16*segs + 3*i+2,
    );
  }

/*
  for(let i = 0; i < segs; i++){
    verts.push(verts[3 + 3*segs + 3*3*segs + 3*6*i + 2*3], verts[3 + 3*segs + 3*3*segs + 3*6*i + 2*3 + 1], verts[3 + 3*segs + 3*3*segs + 3*6*i + 2*3 + 2]);
    verts.push(verts[3 + 3*segs + 3*3*segs + 3*6*j + 2*3], verts[3 + 3*segs + 3*3*segs + 3*6*j + 2*3 + 1], verts[3 + 3*segs + 3*3*segs + 3*6*j + 2*3 + 2]);
    verts.push(verts[3 + 3*segs + 3*3*segs + 3*6*i + 0*3], verts[3 + 3*segs + 3*3*segs + 3*6*i + 0*3 + 1], verts[3 + 3*segs + 3*3*segs + 3*6*i + 0*3 + 2]);
    inds.push(
      1  + 10*segs + 3*i,
      1  + 10*segs + 3*i+1,
      1  + 10*segs + 3*i + 2,
    );
  }

  for(let i = 0; i < segs; i++){
    j = (i+1) % segs;
    verts.push(verts[3 + 3*segs + 3*3*segs + 3*6*i + 2*3], verts[3 + 3*segs + 3*3*segs + 3*6*i + 2*3 + 1], verts[3 + 3*segs + 3*3*segs + 3*6*i + 2*3 + 2]);
    verts.push(verts[3 + 3*segs + 3*3*segs + 3*6*i + 2*3], verts[3 + 3*segs + 3*3*segs + 3*6*i + 2*3 + 1], -verts[3 + 3*segs + 3*3*segs + 3*6*i + 2*3 + 2]);
    verts.push(verts[3 + 3*segs + 3*3*segs + 3*6*j + 2*3], verts[3 + 3*segs + 3*3*segs + 3*6*j + 2*3 + 1], verts[3 + 3*segs + 3*3*segs + 3*6*j + 2*3 + 2]);
    inds.push(
      1  + 13*segs + 3*i,
      1  + 13*segs + 3*i+1,
      1  + 13*segs + 3*i + 2,
    );
  }
*/



  const halfIndSize = inds.length;
  const halfVertsSize = verts.length;
  for(let i = 0; i < halfVertsSize; i+=3){
    verts.push(-verts[i])
    verts.push(verts[i+1])
    verts.push(-verts[i+2])
  }
  for(let i = 0; i < halfIndSize; i++) inds.push(inds[i] + halfVertsSize/3)
  let mx = 0;
  for(let i = 0; i < verts.length; i++) mx = Math.max(mx, Math.abs(verts[i]))
  for(let i = 0; i < verts.length; i++) verts[i] /= mx



  const verts4 = [];
  for (let i = 0; i < verts.length; i+= 3) {
      verts4.push(verts[i])
      verts4.push(verts[i+1])
      verts4.push(verts[i+2])
      verts4.push(1)
  }
  const indsRtn = inds
  const vertsRtn = verts4
  const normsRtn = []
  for(let i = 0; i < vertsRtn.length; i+=4){
      normsRtn[i] = 0
      normsRtn[i+1] = 0
      normsRtn[i+2] = 1
      normsRtn[i+3] = 0
  }

  for(let i = 0; i < indsRtn.length; i+= 3){
      setNaturalNormals(vertsRtn, normsRtn, indsRtn, i)
  }
  return PosNormInd(round_gl, vertsRtn, normsRtn, indsRtn)
}
let round = getRoundPosNormInd(roundParams)
