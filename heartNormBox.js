var heartNormBoxVertCode = `
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


var replaceNeededHeartNormBoxFragCode = `
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

function makeHeartNormBox(){
  heartNormBoxFragCode = replaceNeededHeartNormBoxFragCode.replace("---normal_func---", heart_get_normal_func)
  const rtn = {}
  setupShader(heart_gl, rtn, heartNormBoxVertCode, heartNormBoxFragCode);
  rtn.locs = {
    u_pvmMat:gl.getUniformLocation(rtn.program, "u_pvmMat"),
    u_mMat:gl.getUniformLocation(rtn.program, "u_mMat"),
    a_pos:gl.getAttribLocation(rtn.program, "a_pos"),
    a_norm:gl.getAttribLocation(rtn.program, "a_norm")
  }
  rtn.use = (_pvmMat, _mMat, _obj)=>{

    gl.useProgram(rtn.program);

    gl.uniformMatrix4fv(rtn.locs.u_pvmMat, false, _pvmMat);
    gl.uniformMatrix4fv(rtn.locs.u_mMat, false, _mMat);

    gl.bindBuffer(gl.ARRAY_BUFFER, _obj.pos);
    gl.enableVertexAttribArray(rtn.locs.a_pos);
    gl.vertexAttribPointer(rtn.locs.a_pos, 4, gl.FLOAT, 0, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, _obj.norm);
    gl.enableVertexAttribArray(rtn.locs.a_norm);
    gl.vertexAttribPointer(rtn.locs.a_norm, 4, gl.FLOAT, 0, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, _obj.ind);

    gl.drawElements(gl.TRIANGLES, _obj.indArr.length, gl.UNSIGNED_SHORT, 0);
  }
  return rtn;
}

heartNormBoxShader = makeHeartNormBox();
