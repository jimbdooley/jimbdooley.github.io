
const DrawerFloor2 = {
    posLoc: -1,
    normLoc: -1,
    texLoc: -1,
    lightDirLoc: -1,
    dataLoc: -1,
    pvLoc: -1,
    mLoc: -1,
    data: [0, 0, 0, 0],
    shader: null,

    langToScoreSize: {},
    langToLevelSize: {},

    setup: function(context) {
        this.shader = Shader(`
        precision mediump float;
attribute vec4 a_pos;
attribute vec4 a_norm;
attribute vec4 a_tex;
uniform mat4 u_pvMat;
uniform mat4 u_mMat;
varying vec3 v_norm;
varying vec2 v_tex;



void main() {
    vec4 md = u_mMat * a_pos;
    float yp = (0.05 * md.y);
    float oldX = md.x;
    mat4 m2;
    m2[0] = u_mMat[0];
    m2[1] = u_mMat[1];
    m2[2] = u_mMat[2];
    m2[3] = u_mMat[3];
    //m2[3][0] -= -0.9 + 2.0 * yp * yp;
    m2[3][2] += -0.65 * yp * yp + 7.0 * a_tex.z;
    gl_Position = u_pvMat * m2 * a_pos;
    v_norm = normalize((u_mMat * a_norm).xyz);
    v_tex = a_tex.xy;
}

        `,
        `
            precision mediump float;
            uniform vec3 u_light_dir[1];
            uniform vec4 u_data[1];
            varying vec3 v_norm;
            varying vec2 v_tex;
            
            float MIN_LIGHT = 0.3;
            
            float W = 0.0295;
            
            void main() {
                
                float edge0_a = float(v_tex.x < W);
                float edge0_b = float(v_tex.x > 1.0-W);
                float edge0 = edge0_a + edge0_b - edge0_a * edge0_b;
                float edge1_a = float(v_tex.y < W);
                float edge1_b = float(v_tex.y > 1.0-W);
                float edge1 = edge1_a + edge1_b - edge1_a * edge1_b;
                float edge = edge0 + edge1 - edge0 * edge1;
                float y = v_tex[1];
                float g = max(v_tex[0]*v_tex[0], y * y);
                gl_FragColor = vec4(edge*vec3(1.0, 0.2, 0.7) + (1.0 - edge)*vec3(0.0, 0.0, 0.31), 1.0);
            }
                 
        `, "huh")
        this.pvLoc = ball_gl.getUniformLocation(this.shader.full, "u_pvMat")
        this.mLoc = ball_gl.getUniformLocation(this.shader.full, "u_mMat")
        this.posLoc = ball_gl.getAttribLocation(this.shader.full, "a_pos")
        this.normLoc = ball_gl.getAttribLocation(this.shader.full, "a_norm")
        this.texLoc = ball_gl.getAttribLocation(this.shader.full, "a_tex")
        this.lightDirLoc = ball_gl.getUniformLocation(this.shader.full, "u_light_dir")
        this.dataLoc = ball_gl.getUniformLocation(this.shader.full, "u_data")
        console.log("vanilla frag", this.shader.fragCompileLog)
        console.log("vanilla vert", this.shader.vertCompileLog)
        console.log("Drawer Created", "Vanilla Drawer")
    },

    DIRECT_LIGHT: [0, 0, 1],
    LIGHT_30_85: [
        0.3,
        0.85 * Math.sqrt(1 - 0.3 * 0.3),
        Math.sqrt(1 - 0.85 * 0.85) * Math.sqrt(1 - 0.3*0.3)
    ],
    LIGHT_RIGHT: [Math.sqrt(2)/2, 0, Math.sqrt(2)/2],
    BTN_NOT_PRESSED: [0.1, 0.3, Math.sqrt(0.9)],
    BTN_PRESSED: [0.65*0.1, 0.65*0.3, 0.65*Math.sqrt(0.9), ],
    draw: function(o, bmpName, bufs, lightArray=this.DIRECT_LIGHT){
        World.pvm.updateWithDisplayObject(o)

        
        ball_gl.useProgram(this.shader.full)
        ball_gl.bindBuffer(ball_gl.ELEMENT_ARRAY_BUFFER, bufs.ind);
        
        ball_gl.bindBuffer(ball_gl.ARRAY_BUFFER, bufs.pos);
        ball_gl.enableVertexAttribArray(this.posLoc)
        ball_gl.vertexAttribPointer( this.posLoc, COORDS_PER_VERTEX, ball_gl.FLOAT, 0, 0, 0)

        //ball_gl.bindBuffer(ball_gl.ARRAY_BUFFER, bufs.norm);
        //ball_gl.enableVertexAttribArray(this.normLoc)
        //ball_gl.vertexAttribPointer(this.normLoc, COORDS_PER_VERTEX, ball_gl.FLOAT, 0, 0, 0)

        ball_gl.bindBuffer(ball_gl.ARRAY_BUFFER, bufs.tex);
        ball_gl.enableVertexAttribArray(this.texLoc)
        ball_gl.vertexAttribPointer(this.texLoc, COORDS_PER_VERTEX, ball_gl.FLOAT, 0, 0, 0)


        ball_gl.uniformMatrix4fv(this.pvLoc, false, World.pvm.pv)
        ball_gl.uniformMatrix4fv(this.mLoc, false, World.pvm.m)

        ball_gl.uniform3fv(this.lightDirLoc, lightArray)
        this.data[0] =  (5*(this.data[0] - 0.025 * S.dt * S.speed / (2*o.sy))) % 1
        ball_gl.uniform4fv(this.dataLoc, this.data)

        ball_gl.drawElements(ball_gl.TRIANGLES, bufs.indArr.length, ball_gl.UNSIGNED_SHORT, 0)


    },


}