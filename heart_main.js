
heart_S = {t:0, clicked:false, shapeGem:1, showCube:false, passed:0, addGold:0}
heart_S.pMatrix = perspective(1.31, heart_canvas.width/heart_canvas.height, 0.1, 20);
heart_S.vMatrix = inverse(look_at([0, 0, 5], [0, 0, 0], [0, 1, 0]));
heart_S.mMatrix = new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
heart_S.pvMatrix = new Float32Array(16);
heart_S.pvmMatrix = new Float32Array(16);
heart_S.mInv = new Float32Array(16);
heart_S.mCen = new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
heart_S.mTrans = new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
const toCenter = [0, 1, 2, 4, 5, 6, 8, 9, 10]

function objFactory(_init={}){
  const rtn = {x:0, y:0, z:0, th:0, th_k:0, k0:1, k1:0, th_z:0, sx:1, sy:1, sz:1};
  (["x", "y", "z", "th", "th_k", "th_z", "k0", "k1", "sx", "sy", "sz"]).forEach((e) => {
    if(e in _init) rtn[e] = _init[e];
  });
  rtn.set_th_k = (self, val) => {
    self.k0 = Math.cos(val);
    self.k1 = Math.sin(val);
    self.th_k = val;
  }
  return rtn;
}

const round_S = {t:0, clicked:false, shapeGem:0, showCube:false, passed:0}
round_S.pMatrix = perspective(1.31, round_canvas.width/round_canvas.height, 0.1, 20);
round_S.vMatrix = inverse(look_at([0, 0, 5], [0, 0, 0], [0, 1, 0]));
round_S.mMatrix = new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
round_S.pvMatrix = new Float32Array(16);
round_S.pvmMatrix = new Float32Array(16);
const round_obj = objFactory({sx:1.2,sy:1.2,sz:1.2});

const heart_obj = objFactory({sx:1.0,sy:1.0,sz:1.0});
data = [1, 1, 0 ,Math.sqrt(2)/2, 0, Math.sqrt(2)/2, 0, 1, 0]
color1 = [1, 0, 0, 0]
color2 = [1, 0, 1, 0]
rnbwData = [0.25, 0, 0, 1]
shift_data = [0, 0, 2, 0]
data2 = [
  Math.random()*2-1,
  Math.random()*2-1,
  Math.random()*2-1,
  Math.random()*2-1,
]
center_cutter(data2, 0.3)



function reCalcCube(){
  heart = getHeartPosNormInd(heartParams);
  round = getRoundPosNormInd(roundParams);
}
heart_cube=null;
if(heart_S.shapeGem){
  adjustParams(heart_S, heartParams)
  adjustParams(heart_S, heartParams2, "params2")
  //reCalcCube()
} 
round_cube=null;
if(round_S.shapeGem){
  //adjustParams(round_S, roundParams)
  //reCalcCube()
} else {
  round_cube = getCube(round_gl, cubeShape.x, cubeShape.y, cubeShape.z);
  adjustShaderParams(round_S, roundShaderParams, updateRound, "round_params");
}

const round_envCubeMap = getTestBitmap(round_gl)


function updateRound(){
  updateRoundVars();
  roundNormBoxShader = makeRoundNormBox();
  update_round_get_normal_func();
  makeRoundReplacements()
  roundFinal = makeRoundFinal();
}
function updateHeart(){
  updateHeartVars();
  heartNormBoxShader = makeHeartNormBox();
  update_heart_get_normal_func();
  makeHeartReplacements()
  heartFinal = makeFinal(heartFinalVert, heartFinalFrag);
  heartRnbw = makeFinalRnbw(heartFinalVert, heartRnbwFrag)
  heartDuo = makeFinalDuo(heart_gl, heartFinalVert, heartDuoFrag)
  heartShift = makeFinalShift(shiftingVert, heartFinalFrag);
  heartLightning = makeFinalLightning(heartFinalVert, heartLightningFrag);
}


heart_obj.sx = 2
heart_obj.sy = 2
heart_obj.sz = 2
round_obj.th = -1

function round_draw() {
  round_obj.th_z += 0.01
  round_gl.clear(round_gl.COLOR_BUFFER_BIT | round_gl.DEPTH_BUFFER_BIT);
  skew_rot_rod_trans(round_S.mMatrix, round_obj);


  multiply(round_S.pMatrix, round_S.vMatrix, round_S.pvMatrix);
  multiply(round_S.pvMatrix, round_S.mMatrix, round_S.pvmMatrix);

  round_S.mMatrix[12] = -2.8;
  multiply(round_S.pvMatrix, round_S.mMatrix, round_S.pvmMatrix);
  roundNormBoxShader.use(round_S.pvmMatrix, round_S.mMatrix, round_cube);
  round_S.mMatrix[12] = 0;
  multiply(round_S.pvMatrix, round_S.mMatrix, round_S.pvmMatrix);
  roundFinal.use(round_S.pvmMatrix, round_S.mMatrix, round, round_envCubeMap, null );

  round_S.passed--;
}

function heart_draw(){
  requestAnimationFrame(heart_draw);
  if (!ENABLES.gem_anims) return
  heart_S.t += 1;
  heart_obj.y = 1

  round_draw()

  heart_gl.clear(heart_gl.COLOR_BUFFER_BIT | heart_gl.DEPTH_BUFFER_BIT);

  
  skew_rot_rod_trans(heart_S.mMatrix, heart_obj);
  data[1] = (heart_S.t / 100) % (2000*Math.PI) + 2*Math.PI

  multiply(heart_S.pMatrix, heart_S.vMatrix, heart_S.pvMatrix);
  multiply(heart_S.pvMatrix, heart_S.mMatrix, heart_S.pvmMatrix);

  if(heart_S.shapeGem){
    heart_S.mMatrix[13] = 0
    heart_S.mMatrix[12] = 0
    multiply(heart_S.pvMatrix, heart_S.mMatrix, heart_S.pvmMatrix);
    shapeTest.use(heart_S.pvmMatrix, heart_S.mMatrix, heart);


  }

}

function heart_init(){
  heart_gl.clearColor(0.0, 0.0, 0.0, 1.0);
  heart_gl.clearDepth(1.0);
  heart_gl.enable(heart_gl.CULL_FACE);
  heart_gl.enable(heart_gl.DEPTH_TEST);
  heart_gl.enable(heart_gl.BLEND);
  heart_gl.blendFunc(heart_gl.ONE, heart_gl.ONE_MINUS_SRC_ALPHA);
  round_gl.clearColor(0.0, 0.0, 0.0, 1.0);
  round_gl.clearDepth(1.0);
  round_gl.enable(round_gl.CULL_FACE);
  round_gl.enable(round_gl.DEPTH_TEST);
  round_gl.enable(round_gl.BLEND);
  round_gl.blendFunc(round_gl.ONE, round_gl.ONE_MINUS_SRC_ALPHA);
  heart_draw();
}
heart_init();

(addListeners=()=>{
  function rotate_to(canvas, obj, ex, ey){
    x = ex - heart_canvas.getBoundingClientRect().x-canvas.width/2;
    y = canvas.height/2 -  ey + canvas.getBoundingClientRect().y;
    obj.set_th_k(obj, Math.atan2(x, -y));
    obj.th = Math.sqrt(x*x+y*y)/100
  }
  heart_canvas.addEventListener('mousedown', (e)=>{
    rotate_to(heart_canvas, heart_obj, e.clientX, e.clientY);
    heart_S.clicked = true;
  });
  heart_canvas.addEventListener('mouseup', (e)=>{
    heart_S.clicked = false;
  });
  heart_canvas.addEventListener('mousemove', (e)=>{
    if(!heart_S.clicked) return;
    rotate_to(heart_canvas, heart_obj, e.clientX, e.clientY)
  });
  document.addEventListener('keydown', (e)=>{
    if(e.key == " ") heart_S.showCube = !heart_S.showCube;
    if(e.key == "c") {
      heart_obj.th = 0;
      heart_obj.th_k = 0;
      heart_obj.th_z = 0;
      heart_obj.k0 = 1;
      heart_obj.k1 = 0;
    }
  });
  heart_canvas.addEventListener('wheel', (e)=>{
    if(e.deltaY == 0) return;
    const dScale = e.deltaY < 0 ? 0.99 : 1.01;
    heart_obj.sx *= dScale;
    heart_obj.sy *= dScale;
    heart_obj.sz *= dScale;
  });


  round_canvas.addEventListener('mousedown', (e)=>{
    rotate_to(round_canvas, round_obj, e.clientX, e.clientY);
    round_S.clicked = true;
  });
  round_canvas.addEventListener('mouseup', (e)=>{
    round_S.clicked = false;
  });
  round_canvas.addEventListener('mousemove', (e)=>{
    if(!round_S.clicked) return;
    rotate_to(round_canvas, round_obj, e.clientX, e.clientY)
  });
  document.addEventListener('keydown', (e)=>{
    if(e.key == " ") round_S.showCube = !round_S.showCube;
    if(e.key == "c") {
      round_obj.th = 0;
      round_obj.th_k = 0;
      round_obj.th_z = 0;
      round_obj.k0 = 1;
      round_obj.k1 = 0;
    }
  });
  round_canvas.addEventListener('wheel', (e)=>{
    if(e.deltaY == 0) return;
    const dScale = e.deltaY < 0 ? 0.99 : 1.01;
    round_obj.sx *= dScale;
    round_obj.sy *= dScale;
    round_obj.sz *= dScale;
  });
})();
