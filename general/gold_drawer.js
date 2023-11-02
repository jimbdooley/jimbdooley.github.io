
goldDrawerVert = `
precision mediump float;

attribute vec4 a_pos;
attribute vec4 a_norm;

uniform mat4 u_pvmMat;
uniform mat4 u_mMat;

varying vec4 v_world_norm;

void main() {
gl_Position = u_pvmMat * a_pos;
v_world_norm = vec4(normalize((u_mMat * a_norm).xyz), 0.0);
}`;

goldDrawerFrag = `
precision mediump float;

varying vec4 v_world_norm;
#define GOLD vec3(1.0, 0.843, 0.0)
#define _GOLD vec3(0.83, 0.83, 0.83)
float TO_WHITE_CUTOFF = 0.92;

void main() {
float light_ratio = 0.25;
float light = light_ratio + (1.0 - light_ratio) * v_world_norm.z;
float toWhite = float(light > TO_WHITE_CUTOFF);
vec3 goldColor = vec3(light * GOLD) / TO_WHITE_CUTOFF;
float whitePct = (light - TO_WHITE_CUTOFF) / (1.0 - TO_WHITE_CUTOFF);
vec3 whiteDif = vec3(1.0) - GOLD;
gl_FragColor = vec4(toWhite * (GOLD + whitePct*whiteDif) + (1.0-toWhite)*goldColor, 1.0);
}`;

const goldDrawer = {}
setupShader(brio_gl, goldDrawer, goldDrawerVert, goldDrawerFrag);
goldDrawer.locs = {
  u_pvmMat:brio_gl.getUniformLocation(goldDrawer.program, "u_pvmMat"),
  u_mMat:brio_gl.getUniformLocation(goldDrawer.program, "u_mMat"),
  a_pos:brio_gl.getAttribLocation(goldDrawer.program, "a_pos"),
  a_norm:brio_gl.getAttribLocation(goldDrawer.program, "a_norm")
}
goldDrawer.use = (gl, _pvmMat, _mMat, _obj)=>{

  gl.useProgram(goldDrawer.program);

  gl.uniformMatrix4fv(goldDrawer.locs.u_pvmMat, false, _pvmMat);
  gl.uniformMatrix4fv(goldDrawer.locs.u_mMat, false, _mMat);

  gl.bindBuffer(brio_gl.ARRAY_BUFFER, _obj.pos);
  gl.enableVertexAttribArray(goldDrawer.locs.a_pos);
  gl.vertexAttribPointer(goldDrawer.locs.a_pos, 4, brio_gl.FLOAT, 0, 0, 0);
  gl.bindBuffer(brio_gl.ARRAY_BUFFER, _obj.norm);
  gl.enableVertexAttribArray(goldDrawer.locs.a_norm);
  gl.vertexAttribPointer(goldDrawer.locs.a_norm, 4, brio_gl.FLOAT, 0, 0, 0);
  gl.bindBuffer(brio_gl.ELEMENT_ARRAY_BUFFER, _obj.ind);


  gl.drawElements(brio_gl.TRIANGLES, _obj.indArr.length, brio_gl.UNSIGNED_SHORT, 0);
}
