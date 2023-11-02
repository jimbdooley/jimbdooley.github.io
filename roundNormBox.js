var roundNormBoxVertCode = `
precision mediump float;

attribute vec4 a_pos;
attribute vec4 a_norm;
uniform mat4 u_pvmMat;
uniform mat4 u_mMat;
varying vec4 v_world_norm;
varying vec4 v_object_pos;

void main() {
  gl_Position = u_pvmMat * a_pos;
  v_world_norm = vec4(normalize((u_mMat * a_norm).xyz),0.0);
  v_object_pos = a_pos;
}`;


var replaceNeededRoundNormBoxFragCode = `
precision mediump float;
varying vec4 v_world_norm;
varying vec4 v_object_pos;
//uniform samplerCube u_sampler;

---normal_func---


void main(){
  //vec3 cube_normalized_dir = (1.0/max(abs(v_object_pos.x), max(abs(v_object_pos.y), abs(v_object_pos.z)))) * v_object_pos.xyz;
  vec3 color = 0.5 + 0.5*get_normal(v_object_pos.xyz);
  gl_FragColor = vec4(color*(v_world_norm.z*0.7 + 0.3), 1.0);
}`;

function makeRoundNormBox(){
  roundNormBoxFragCode = replaceNeededRoundNormBoxFragCode.replace("---normal_func---", round_get_normal_func)
  const rtn = {}
  setupShader(round_gl, rtn, roundNormBoxVertCode, roundNormBoxFragCode);
  rtn.locs = {
    u_pvmMat:round_gl.getUniformLocation(rtn.program, "u_pvmMat"),
    u_mMat:round_gl.getUniformLocation(rtn.program, "u_mMat"),
    a_pos:round_gl.getAttribLocation(rtn.program, "a_pos"),
    a_norm:round_gl.getAttribLocation(rtn.program, "a_norm")
  }
  rtn.use = (_pvmMat, _mMat, _obj)=>{

    round_gl.useProgram(rtn.program);

    round_gl.uniformMatrix4fv(rtn.locs.u_pvmMat, false, _pvmMat);
    round_gl.uniformMatrix4fv(rtn.locs.u_mMat, false, _mMat);

    round_gl.bindBuffer(round_gl.ARRAY_BUFFER, _obj.pos);
    round_gl.enableVertexAttribArray(rtn.locs.a_pos);
    round_gl.vertexAttribPointer(rtn.locs.a_pos, 4, round_gl.FLOAT, 0, 0, 0);
    round_gl.bindBuffer(round_gl.ARRAY_BUFFER, _obj.norm);
    round_gl.enableVertexAttribArray(rtn.locs.a_norm);
    round_gl.vertexAttribPointer(rtn.locs.a_norm, 4, round_gl.FLOAT, 0, 0, 0);
    round_gl.bindBuffer(round_gl.ELEMENT_ARRAY_BUFFER, _obj.ind);

    round_gl.drawElements(round_gl.TRIANGLES, _obj.indArr.length, round_gl.UNSIGNED_SHORT, 0);
  }
  return rtn;
}

roundNormBoxShader = makeRoundNormBox();
