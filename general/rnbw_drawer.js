function makeFinalRnbw(gl, finalVert, finalFrag){
    const rtn = {}
    setupShader(gl, rtn, finalVert, finalFrag);
    rtn.locs = {
      u_pvmMat:gl.getUniformLocation(rtn.program, "u_pvmMat"),
      u_mMatInv:gl.getUniformLocation(rtn.program, "u_mMat_inv"),
      u_mMatCen:gl.getUniformLocation(rtn.program, "u_mMat_cen"),
      u_sampler:gl.getUniformLocation(rtn.program, "u_sampler"),
      u_sampler_norm:gl.getUniformLocation(rtn.program, "u_sampler_norm"),
      u_data:gl.getUniformLocation(rtn.program, "u_data"),
      a_pos:gl.getAttribLocation(rtn.program, "a_pos"),
      a_norm:gl.getAttribLocation(rtn.program, "a_norm"),
      u_rnbwData: gl.getUniformLocation(rtn.program, "u_rnbw_data")
    }
    rtn.use = (gl, _pvmMat, _mMatInv, _mMatCen, _obj, _texture, _data, _rnbw_data)=>{
      gl.useProgram(rtn.program);
  
      gl.uniformMatrix4fv(rtn.locs.u_pvmMat, false, _pvmMat);
      gl.uniformMatrix4fv(rtn.locs.u_mMatInv, false, _mMatInv);
      gl.uniformMatrix4fv(rtn.locs.u_mMatCen, false, _mMatCen);
      gl.uniform3fv(rtn.locs.u_data, _data);
      gl.uniform4fv(rtn.locs.u_rnbwData, _rnbw_data);
  
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