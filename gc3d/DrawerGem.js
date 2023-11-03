const DrawerGem = {
    posLocs : [],
    normLocs : [],
    pvmLocs : [],
    mInvLocs : [],
    mCenLocs : [],
    samplerLocs : [],
    lightsLocs : [],
    colorLocs : [],
    envDLocs: [],
    envDArr: [0, 0, 0, 0],
    shaders : [],
    texHandle : [-1],
    shaderverts : [], // TODO: Delete
    shaderfrags : [], // TODO: Delete

    setup : function() {
        const consts_regular = getTextFileString(null, "gem_shaders/consts_regular.glsl")
        const other_funcs = getTextFileString(null, "gem_shaders/other_funcs.glsl")
        const set_color_regular = getTextFileString(null, "gem_shaders/set_color_regular.glsl")
        const main_func = getTextFileString(null, "gem_shaders/main_func.glsl")

        this.texHandle[0] = gc3d_gl.createTexture()
        initCubeTexture(this.texHandle[0], BLOCKY_BITMAP)
        for (gemShape of GemShape.values()) {
            if (gemShape == GemShape.ROSE || gemShape == GemShape.TRILLIANT || gemShape == GemShape.PRINCESS) {
                this.shaders.push(null)
                this.shaderverts.push(null)
                this.posLocs.push(null)
                this.normLocs.push(null)
                this.pvmLocs.push(null)
                this.mInvLocs.push(null)
                this.mCenLocs.push(null)
                this.samplerLocs.push(null)
                this.lightsLocs.push(null)
                this.colorLocs.push(null)
                this.envDLocs.push(null)
                continue
            }
            this.shaderverts.push(getTextFileString(null, "gem_shaders/gem.vert"))
            if (gemShape.shaderI < 0) continue
            const get_normal = getTextFileString(null, `gem_shaders/get_normal_${gemShape.name}.glsl`)
            //this.shaderfrags.push(consts_regular + get_normal + other_funcs + set_color_regular + main_func)
            this.shaders.push(Shader(getTextFileString(null, "gem_shaders/gem.vert"),
                 consts_regular + get_normal + other_funcs + set_color_regular + main_func,
                 gemShape.name))
            //this.shaders.push(Shader(vcode, fcode, "drawergemtest"))
            this.posLocs.push(gc3d_gl.getAttribLocation(this.shaders[gemShape.shaderI].full, "a_pos"))
            this.normLocs.push(gc3d_gl.getAttribLocation(this.shaders[gemShape.shaderI].full, "a_norm"))
            this.pvmLocs.push(gc3d_gl.getUniformLocation(this.shaders[gemShape.shaderI].full, "u_pvmMat"))
            this.mInvLocs.push(gc3d_gl.getUniformLocation(this.shaders[gemShape.shaderI].full, "u_mMat_inv"))
            this.mCenLocs.push(gc3d_gl.getUniformLocation(this.shaders[gemShape.shaderI].full, "u_mMat_cen"))
            this.samplerLocs.push(gc3d_gl.getUniformLocation(this.shaders[gemShape.shaderI].full, "u_sampler"))
            this.lightsLocs.push(gc3d_gl.getUniformLocation(this.shaders[gemShape.shaderI].full, "u_lights"))
            this.colorLocs.push(gc3d_gl.getUniformLocation(this.shaders[gemShape.shaderI].full, "u_color"))
            this.envDLocs.push(gc3d_gl.getUniformLocation(this.shaders[gemShape.shaderI].full, "u_env_d_mx"))
        }
    },
    draw : function(o, gemShape, gemColor, lights) {

        const bufs = GEM_PNIs[gemShape.i]

        World_gc.pvm.updateWithDisplayObject(o)

        World_gc.pvm.updateCenters()
        const shaderShape = shaderShapeFromGemShape(gemShape)
        gc3d_gl.useProgram(this.shaders[shaderShape.shaderI].full);
        /*

uniform samplerCube u_sampler;
attribute vec4 a_pos;
attribute vec4 a_norm;
uniform mat4 u_pvmMat;
uniform mat4 u_mMat_inv;
uniform mat4 u_mMat_cen;

uniform vec4 u_color[1];
uniform vec3 u_lights[3];
        */
        
        gc3d_gl.bindBuffer(gc3d_gl.ELEMENT_ARRAY_BUFFER, bufs.ind);
        
        gc3d_gl.bindBuffer(gc3d_gl.ARRAY_BUFFER, bufs.pos);
        gc3d_gl.enableVertexAttribArray(this.posLocs[shaderShape.shaderI]);
        gc3d_gl.vertexAttribPointer(this.posLocs[shaderShape.shaderI], 4, gc3d_gl.FLOAT, 0, 0, 0);
        
        gc3d_gl.bindBuffer(gc3d_gl.ARRAY_BUFFER, bufs.norm);
        gc3d_gl.enableVertexAttribArray(this.normLocs[shaderShape.shaderI]);
        gc3d_gl.vertexAttribPointer(this.normLocs[shaderShape.shaderI], 4, gc3d_gl.FLOAT, 0, 0, 0);
        
        //gc3d_gl.bindBuffer(gc3d_gl.ARRAY_BUFFER, bufs.tex);
        //gc3d_gl.enableVertexAttribArray(this.test_shader_locs.a_uv);
        //gc3d_gl.vertexAttribPointer(this.test_shader_locs.a_uv, 4, gc3d_gl.FLOAT, 0, 0, 0);
        
        gc3d_gl.uniformMatrix4fv(this.pvmLocs[shaderShape.shaderI], false, World_gc.pvm.pvm);
        gc3d_gl.uniformMatrix4fv(this.mInvLocs[shaderShape.shaderI], false, World_gc.pvm.mCenInv);
        gc3d_gl.uniformMatrix4fv(this.mCenLocs[shaderShape.shaderI], false, World_gc.pvm.mCen);

        gc3d_gl.uniform4fv(this.colorLocs[shaderShape.shaderI], colorArrFromGemColor[gemColor.i])
        this.envDArr[0] = envDMxFromScale(o.scale)
        gc3d_gl.uniform4fv(this.envDLocs[shaderShape.shaderI], this.envDArr)
        gc3d_gl.uniform3fv(this.lightsLocs[shaderShape.shaderI], lights)

        gc3d_gl.activeTexture(gc3d_gl.TEXTURE0);
        gc3d_gl.bindTexture(gc3d_gl.TEXTURE_CUBE_MAP, this.texHandle[0]);
        gc3d_gl.uniform1i(this.samplerLocs[shaderShape.shaderI], 0);

        gc3d_gl.drawElements(gc3d_gl.TRIANGLES, bufs.indArr.length, gc3d_gl.UNSIGNED_SHORT,0);
    },

}