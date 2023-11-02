function makeFinalShift(gl, finalVert, finalFrag){
    const rtn = {}
    setupShader(gl, rtn, finalVert, finalFrag);
    rtn.locs = {
      u_pvMat:gl.getUniformLocation(rtn.program, "u_pvMat"),
      u_mMat_trans:gl.getUniformLocation(rtn.program, "u_mMat_trans"),
      u_mMatInv:gl.getUniformLocation(rtn.program, "u_mMat_inv"),
      u_mMatCen:gl.getUniformLocation(rtn.program, "u_mMat_cen"),
      u_sampler:gl.getUniformLocation(rtn.program, "u_sampler"),
      u_sampler_norm:gl.getUniformLocation(rtn.program, "u_sampler_norm"),
      u_data:gl.getUniformLocation(rtn.program, "u_data"),
      u_color:gl.getUniformLocation(rtn.program, "u_color"),
      u_shift_data:gl.getUniformLocation(rtn.program, "u_shift_data"),
      a_pos:gl.getAttribLocation(rtn.program, "a_pos"),
      a_norm:gl.getAttribLocation(rtn.program, "a_norm"),
      a_ave:gl.getAttribLocation(rtn.program, "a_ave"),
    }
    rtn.use = (_pvMat, _mMatTrans, _mMatInv, _mMatCen, _obj, _texture, _data, _color, _shifting_data)=>{
      gl.useProgram(rtn.program);
  
      gl.uniformMatrix4fv(rtn.locs.u_pvMat, false, _pvMat);
      gl.uniformMatrix4fv(rtn.locs.u_mMat_trans, false, _mMatTrans);
      gl.uniformMatrix4fv(rtn.locs.u_mMatInv, false, _mMatInv);
      gl.uniformMatrix4fv(rtn.locs.u_mMatCen, false, _mMatCen);
      gl.uniform3fv(rtn.locs.u_data, _data);
      gl.uniform4fv(rtn.locs.u_color, _color);
      gl.uniform4fv(rtn.locs.u_shift_data, _shifting_data);
      
  
      gl.bindBuffer(gl.ARRAY_BUFFER, _obj.pos);
      gl.enableVertexAttribArray(rtn.locs.a_pos);
      gl.vertexAttribPointer(rtn.locs.a_pos, 4, gl.FLOAT, 0, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, _obj.norm);
      gl.enableVertexAttribArray(rtn.locs.a_norm);
      gl.vertexAttribPointer(rtn.locs.a_norm, 4, gl.FLOAT, 0, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, _obj.ave);
      gl.enableVertexAttribArray(rtn.locs.a_ave);
      gl.vertexAttribPointer(rtn.locs.a_ave, 4, gl.FLOAT, 0, 0, 0);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, _obj.ind);
  
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, _texture);
      gl.uniform1i(rtn.locs.u_sampler, 0);
  
      gl.drawElements(gl.TRIANGLES, _obj.indArr.length, gl.UNSIGNED_SHORT, 0);
    }
    return rtn;
  }