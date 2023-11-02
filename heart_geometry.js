
function lineLineIntersect(x1, y1, x2, y2, x3, y3, x4, y4){
  const D = (x1-x2)*(y3-y4) - (y1-y2)*(x3-x4);
  const Px = ((x1*y2-y1*x2)*(x3-x4) - (x1-x2)*(x3*y4-y3*x4))/D;
  const Py = ((x1*y2-y1*x2)*(y3-y4) - (y1-y2)*(x3*y4-y3*x4))/D;
  return [Px, Py];
}

heartParams = {"z":0.25,"x0":0,"y0":0.23801286694985915,"x1":0.3,"y1":0.3795600268453624,"x2":0.55,"y2":0.28,"x3":0.48665242630321853,"y3":0.00831371282944573,"x4":0.2984861817290427,"y4":-0.25043156500231883,"x5":0,"y5":-0.42738067557454434,"pocket_y":0.4422922935685465,"z0":0.25,"z1":0.25,"z2":0.25,"z3":0.25,"z4":0.25,"z5":0.25};

heartParams2 = {"dz":-0.06,"x0":0,"y0":0.36975113117550573,"dz0":-0.01,"x1":0.4970620585946859,"y1":0.4872057486021655,"dz1":-0.01,"x2":0.6972751806084532,"y2":0.22485534499360488,"dz2":-0.01,"x3":0.4709552224596751,"y3":-0.24141644832809447,"dz3":-0.03400058578789796,"x4":0.07852147699814896,"y4":-0.5398025982617525,"dz4":-0.006,"dx0":0.014887177808646073,"dy0":0.07056271766641678,"dx05":0.0333273068614049,"dy05":0.06136240030488606,"dx1":0.08313015027928244,"dy1":0.003793021791781218,"dx15":0.06354501308608505,"dy15":0,"dx2":0.014411103717868504,"dy2":0.005199999999999999,"dx25":0,"dy25":0,"dx3":0,"dy3":0,"dx35":0,"dy35":0}


param12links = [
  ["0", "1", "0"],
  ["1", "2", "1"],
  ["2", "3", "2"],
  ["3", "4", "3"],
  ["4", "5", "4"],
]


function getHeartPosNormInd(p){
  p2 = heartParams2;
  for(let i = 0; i <= 5; i++) heartParams["z" + i] = heartParams.z;
  swaps = [];
  verts = [
    p.x0, p.y0, p.z,
    p.x1, p.y1, p.z,
    p.x2, p.y2, p.z,
    p.x3, p.y3, p.z,
    p.x4, p.y4, p.z,
    p.x5, p.y5, p.z,
    -p.x4, p.y4, p.z,
    -p.x3, p.y3, p.z,
    -p.x2, p.y2, p.z,
    -p.x1, p.y1, p.z,
  ];
  inds = [0, 2, 1, 0, 3, 2, 0, 4, 3, 0, 5, 4, 0, 6, 5, 0, 7, 6, 0, 8, 7, 0, 9, 8];
  for(let i = 0; i < param12links.length; i++) {
    verts.push(heartParams["x"+param12links[i][0]], heartParams["y"+param12links[i][0]], heartParams["z"+param12links[i][0]]);
    verts.push(heartParams["x"+param12links[i][1]], heartParams["y"+param12links[i][1]], heartParams["z"+param12links[i][1]]);
    verts.push(heartParams2["x"+param12links[i][2]], heartParams2["y"+param12links[i][2]], p["z"+param12links[i][2]] + heartParams2.dz +  heartParams2["dz"+param12links[i][2]]);
  }
  for(let i = 0; i < 15; i++) {
    inds.push(10+i);
    if(i%3 == 0) swaps.push(inds.length);
  };

  quad_bots = [
    get4thcorner(verts, 1, 12, 15, 0),
    get4thcorner(verts, 2, 15, 18, 0),
    get4thcorner(verts, 3, 18, 21, 0),
    get4thcorner(verts, 4, 21, 24, 0),
    get4thcorner([
      verts[5*3], verts[5*3+1], verts[5*3+2],
      verts[24*3], verts[24*3+1], verts[24*3+2],
      -verts[24*3], verts[24*3+1], verts[24*3+2],
    ], 0, 1, 2, 0)
  ];
  for(let i = 0; i <= 3; i++){
    verts.push(verts[3*(3*i + 12)], verts[3*(i*3 + 12)+1], verts[3*(i*3 + 12)+2]);
    verts.push(quad_bots[i][0], quad_bots[i][1], quad_bots[i][2]);
    verts.push(verts[3+3*i], verts[3+3*i+1], verts[3+3*i+2]);
    verts.push(verts[3*(3*i + 15)], verts[3*(i*3 + 15)+1], verts[3*(i*3 + 15)+2]);
    swaps.push(inds.length+1, inds.length+3);
    inds.push(25+4*i, 27+4*i, 26+4*i, 26+4*i, 27+4*i, 28+4*i);
  }
  // next i : 28+4*3 + 1 == 41

  verts.push(verts[12*3], verts[12*3+1], verts[12*3+2]);
  verts.push(quad_bots[0][0], quad_bots[0][1], quad_bots[0][2]);
  verts.push(0, p.pocket_y, 0);
  swaps.push(inds.length);
  inds.push(41, 42, 43);

  
  num3 = 2;
  for (let i = 0; i < num3; i++) {
    swaps.push(inds.length, inds.length + 3, inds.length + 6);
    inds.push(44+9*i, 45+9*i, 46+9*i, 47+9*i, 48+9*i, 49+9*i, 50+9*i, 51+9*i, 52+9*i);
    const mid1 = [
      p2["dx"+i] + quad_bots[i][0] + 1 * (quad_bots[i+1][0]-quad_bots[i][0])/3, 
      p2["dy"+i] + quad_bots[i][1] + 1 * (quad_bots[i+1][1]-quad_bots[i][1])/3, 
      quad_bots[i][2] + 1 * (quad_bots[i+1][2]-quad_bots[i][2])/3, 
    ];
    const mid2 = [
      p2["dx"+i+"5"] + quad_bots[i][0] + 2 * (quad_bots[i+1][0]-quad_bots[i][0])/3, 
      p2["dy"+i+"5"] + quad_bots[i][1] + 2 * (quad_bots[i+1][1]-quad_bots[i][1])/3, 
      quad_bots[i][2] + 2 * (quad_bots[i+1][2]-quad_bots[i][2])/3, 
    ];
    verts.push(quad_bots[i][0], quad_bots[i][1], quad_bots[i][2]);
    verts.push(verts[3*(15+3*i)], verts[3*(15+3*i)+1], verts[3*(15+3*i)+2]);
    verts.push(mid1[0], mid1[1], mid1[2]);
    verts.push(mid1[0], mid1[1], mid1[2]);
    verts.push(verts[3*(15+3*i)], verts[3*(15+3*i)+1], verts[3*(15+3*i)+2]);
    verts.push(mid2[0], mid2[1], mid2[2]);
    verts.push(mid2[0], mid2[1], mid2[2]);
    verts.push(verts[3*(15+3*i)], verts[3*(15+3*i)+1], verts[3*(15+3*i)+2]);
    verts.push(quad_bots[1+i][0], quad_bots[1+i][1], quad_bots[1+i][2]);
  }
  num2 = 0
  for(let i = num3; i < num3 + num2; i++) {
    swaps.push(inds.length, inds.length + 3);
    inds.push(44+9*num3+6*(i-num3), 45+9*num3 + 6*(i-num3), 46+9*num3 + 6*(i-num3), 47+9*num3 + 6*(i-num3), 48+9*num3 + 6*(i-num3), 49+9*num3 + 6*(i-num3));
    const mid = [p2["dx"+i] + (quad_bots[i][0]+quad_bots[i+1][0])/2, p2["dy"+i] + (quad_bots[i][1]+quad_bots[i+1][1])/2, (quad_bots[i][2]+quad_bots[i+1][2])/2];
    verts.push(quad_bots[i][0], quad_bots[i][1], quad_bots[i][2]);
    verts.push(verts[3*(15+3*i)], verts[3*(15+3*i)+1], verts[3*(15+3*i)+2]);
    verts.push(mid[0], mid[1], mid[2]);
    verts.push(mid[0], mid[1], mid[2]);
    verts.push(verts[3*(15+3*i)], verts[3*(15+3*i)+1], verts[3*(15+3*i)+2]);
    verts.push(quad_bots[1+i][0], quad_bots[1+i][1], quad_bots[1+i][2]);
  }
  for(let i = num3 + num2; i < 4; i++) {
    swaps.push(inds.length);
    inds.push(44+9*num3+6*num2+3*(i-num3-num2), 45+9*num3+6*num2+3*(i-num3-num2), 46+9*num3+6*num2+3*(i-num3-num2));
    verts.push(quad_bots[i][0], quad_bots[i][1], quad_bots[i][2]);
    verts.push(verts[3*(15+3*i)], verts[3*(15+3*i)+1], verts[3*(15+3*i)+2]);
    verts.push(quad_bots[1+i][0], quad_bots[1+i][1], quad_bots[1+i][2]);
  }


  verts_to_dupe = verts.length - 30;
  for(let i = 0; i < verts_to_dupe; i+=3){
    verts.push(
      -verts[30+i],
      verts[30+i+1],
      verts[30+i+2],
    );
  }

  maxInd = 0;
  for(let i = 0; i < inds.length; i++) maxInd = Math.max(maxInd, inds[i]);
  inds_to_ignore = 10;
  inds_to_dupe = maxInd+1 - inds_to_ignore;
  dupe_i_start = 24;
  dupe_i_stop = inds.length;
  ind_offset = inds.length - 24;
  for(let i = dupe_i_start; i < dupe_i_stop; i++){
    //console.log(`${inds[i]+inds_to_dupe} pushed`)
    inds.push(inds[i] + inds_to_dupe);
  }
  for(let i = 0; i < swaps.length; i++) {
    swaps[i] += ind_offset;
    temp = inds[swaps[i]];
    inds[swaps[i]] = inds[swaps[i]+1];
    inds[swaps[i]+1] = temp;
  }

  const final_ind_start = verts.length/3;
  verts.push(
    verts[24*3], verts[24*3+1], verts[24*3+2],
    verts[5*3], verts[5*3+1], verts[5*3+2],
    quad_bots[4][0], quad_bots[4][1], quad_bots[4][2],
    -verts[24*3], verts[24*3+1], verts[24*3+2],
  )
  inds.push(final_ind_start, final_ind_start+1, final_ind_start+2, final_ind_start+2, final_ind_start+1, final_ind_start+3);

  minmax_y = [1, -1];
  for(let i = 0; i < verts.length; i += 3) {
    minmax_y[0] = Math.min(minmax_y[0], verts[i+1]);
    minmax_y[1] = Math.max(minmax_y[1], verts[i+1]);
  }
  for(let i = 0; i < verts.length; i+=3) verts[i+1] -= (minmax_y[1] - Math.abs(minmax_y[0]))/2

  vertsLen = verts.length;
  indsLen = inds.length;
  indCount = 0;
  for(let i = 0; i < inds.length; i++) indCount = Math.max(indCount, inds[i]);
  indCount += 1;
  for(let i = 0; i < vertsLen; i+=3){
    verts.push(-verts[i]);
    verts.push(verts[i+1]);
    verts.push(-verts[i+2]);
  }
  for(let i = 0; i < indsLen; i++) {
    inds.push(inds[i] + indCount);
  }

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
  const avesRtn = []
  for(let i = 0; i < vertsRtn.length; i+=4){
      normsRtn[i] = 0
      normsRtn[i+1] = 0
      normsRtn[i+2] = 1
      normsRtn[i+3] = 0
  }
  for(let i = 0; i < indsRtn.length; i+= 3){
      setNaturalNormals(vertsRtn, normsRtn, indsRtn, i)
  }
  for (let i = 0; i < vertsRtn.length; i += 1) {
    vertsRtn[i] = parseFloat(vertsRtn[i].toFixed(5))
    normsRtn[i] = parseFloat(normsRtn[i].toFixed(5))
  }

  return PosNormInd(heart_gl, vertsRtn, normsRtn, indsRtn)

}
let heart = getHeartPosNormInd(heartParams)
