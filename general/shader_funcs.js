
function setupShader(gl, obj, vertCode, fragCode){
  obj.vert = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(obj.vert, vertCode);
  gl.compileShader(obj.vert);
  obj.frag = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(obj.frag, fragCode);
  gl.compileShader(obj.frag);
  obj.program = gl.createProgram();
  gl.attachShader(obj.program, obj.vert);
  gl.attachShader(obj.program, obj.frag);
  gl.linkProgram(obj.program);
}

function adjustShaderParams(S, p, updateFunc, divName){
  if(S.shapeGem) return
  document.getElementById(divName).innerHTML = ""
  for(key in p){
    if(key == "divs") continue;
    e = document.createElement("div")
    e.innerHTML = `${key}: ${p[key]}`
    e.onwheel = (e)=>{
      e.preventDefault()
      p[e.target.innerHTML.substr(0, e.target.innerHTML.indexOf(":"))] *= e.deltaY > 0 ? (1+delta) : 1/(1 + delta)
      e.target.innerHTML = e.target.innerHTML.substr(0, e.target.innerHTML.indexOf(":")) + ": " + p[e.target.innerHTML.substr(0, e.target.innerHTML.indexOf(":"))]
      updateFunc();
    }
    document.getElementById(divName).appendChild(e)
  }

}
var showPVM = 0
function makeFinal(gl, finalVert, finalFrag){
  const rtn = {}
  setupShader(gl, rtn, finalVert, finalFrag);
  rtn.locs = {
    u_pvmMat:gl.getUniformLocation(rtn.program, "u_pvmMat"),
    u_mMatInv:gl.getUniformLocation(rtn.program, "u_mMat_inv"),
    u_mMatCen:gl.getUniformLocation(rtn.program, "u_mMat_cen"),
    u_sampler:gl.getUniformLocation(rtn.program, "u_sampler"),
    u_sampler_norm:gl.getUniformLocation(rtn.program, "u_sampler_norm"),
    u_data:gl.getUniformLocation(rtn.program, "u_data"),
    u_color:gl.getUniformLocation(rtn.program, "u_color"),
    a_pos:gl.getAttribLocation(rtn.program, "a_pos"),
    a_norm:gl.getAttribLocation(rtn.program, "a_norm"),
  }
  rtn.use = (gl, _pvmMat, _mMatInv, _mMatCen, _obj, _texture, _data, _color)=>{
    gl.useProgram(rtn.program);

    gl.uniformMatrix4fv(rtn.locs.u_pvmMat, false, _pvmMat);
    gl.uniformMatrix4fv(rtn.locs.u_mMatInv, false, _mMatInv);
    gl.uniformMatrix4fv(rtn.locs.u_mMatCen, false, _mMatCen);
    gl.uniform3fv(rtn.locs.u_data, _data);
    gl.uniform4fv(rtn.locs.u_color, _color);

    gl.bindBuffer(gl.ARRAY_BUFFER, _obj.pos);
    gl.enableVertexAttribArray(rtn.locs.a_pos);
    gl.vertexAttribPointer(rtn.locs.a_pos, 4, gl.FLOAT, 0, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, _obj.norm);
    gl.enableVertexAttribArray(rtn.locs.a_norm);
    gl.vertexAttribPointer(rtn.locs.a_norm, 4, gl.FLOAT, 0, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, _obj.ind);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, _texture);
    gl.uniform1i(rtn.locs.u_sampler, 0);

    gl.drawElements(gl.TRIANGLES, _obj.indArr.length, gl.UNSIGNED_SHORT, 0);
  }
  return rtn;
}


function q(n){
  let s = n.toFixed(5).toString();
  while ("0.".indexOf(s[s.length-1]) != -1) s = s.substr(0, s.length -1)
  return -1 < s.indexOf(".") ? s : `${s}.0`
}
