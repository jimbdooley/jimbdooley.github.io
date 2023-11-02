
const DrawerBall = {
    posLoc: -1,
    normLoc: -1,
    texLoc: -1,
    dataLoc: -1,
    samplerLoc: -1,
    lightDirLoc: -1,
    pvLoc: -1,
    mRotLoc: -1,
    mLoc: -1,
    mRot: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    mPos: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    data: [0, 0, 0, 0,],
    bmpInPlace: {
        //"hand_bgr": Bitmap.createBitmap([[255, 238, 118, 0)], 1, 1, Bitmap.Config.ARGB_8888),
        "gearMetal": Bitmap.createBitmap([[255, 100, 100, 112]], 1, 1, Bitmap.Config.ARGB_8888),
        "letter": Bitmap.createBitmap([
            [255, 55, 55, 55],
            [255, 255, 255, 0],
            [255, 0, 0, 0],
            [255, 255, 255, 0],
        ], 2, 2, Bitmap.Config.ARGB_8888),
        "ball": Bitmap.createBitmap([
            [255, 155, 155, 155],
            [255, 180, 180, 255],
            [255, 0, 0, 0],
            [255, 255, 230, 0],
        ], 2, 2, Bitmap.Config.ARGB_8888),
        "red": Bitmap.createBitmap([[255, 255, 0, 0]], 1, 1, Bitmap.Config.ARGB_8888),
        "green": Bitmap.createBitmap([[255, 0, 255, 0]], 1, 1, Bitmap.Config.ARGB_8888),
        "blue": Bitmap.createBitmap([[255, 0, 0, 255]], 1, 1, Bitmap.Config.ARGB_8888),
        "yellow": Bitmap.createBitmap([[255, 255, 255, 0]], 1, 1, Bitmap.Config.ARGB_8888),
        "counterfeit": Bitmap.createBitmap([[255, 194, 178, 128]], 1, 1, Bitmap.Config.ARGB_8888),
        "shade": Bitmap.createBitmap([[220, 0, 0, 0]], 1, 1, Bitmap.Config.ARGB_8888),
    },
    bmpDrawables: {
        "crate_hand": "crate_hand.png",
        "tmap": "tmap.png",
        "hand_bgr": "hand_bgr.jpg",
        "intro_3": "intro_3.png",
    },
    strToTexHandleI: {},
    strToLastLang: {},
    drawableStrToLoaded: {},
    texHandles: [],
    shader: null,

    setupBmp: function(bmp, handle) {
        ball_gl.bindTexture(ball_gl.TEXTURE_2D, handle)
        ball_gl.texImage2D(ball_gl.TEXTURE_2D, 0, ball_gl.RGBA, ball_gl.RGBA, ball_gl.UNSIGNED_BYTE, bmp)
        ball_gl.texParameteri(ball_gl.TEXTURE_2D, ball_gl.TEXTURE_MIN_FILTER, ball_gl.NEAREST)
        ball_gl.texParameteri(ball_gl.TEXTURE_2D, ball_gl.TEXTURE_MAG_FILTER, ball_gl.NEAREST)
        ball_gl.texParameteri(ball_gl.TEXTURE_2D, ball_gl.TEXTURE_WRAP_S, ball_gl.CLAMP_TO_EDGE)
        ball_gl.texParameteri(ball_gl.TEXTURE_2D, ball_gl.TEXTURE_WRAP_T, ball_gl.CLAMP_TO_EDGE)
    },
    langToScoreSize: {},
    langToLevelSize: {},

    setup: function(context) {
        while (this.drawableStrToLoaded.length > 0) this.drawableStrToLoaded.pop()
        const texHandlesMutable = []
        for (key in this.bmpDrawables) {
            this.strToTexHandleI[key] = texHandlesMutable.length
            texHandlesMutable.push(-1)
        }
        for (key in this.bmpInPlace) {
            this.strToTexHandleI[key] = texHandlesMutable.length
            texHandlesMutable.push(-1)
        }
        this.texHandles = texHandlesMutable
        for (let i = 0; i < this.texHandles.length; i++) {
            this.texHandles[i] = ball_gl.createTexture()
        }
        for (key in this.bmpInPlace) {
            this.setupBmp(this.bmpInPlace[key], this.texHandles[this.strToTexHandleI[key]])
        }
        this.shader = Shader(
`
precision mediump float;
attribute vec4 a_pos;
attribute vec4 a_norm;
attribute vec2 a_tex;
uniform vec4 u_data[1];
uniform mat4 u_pvMat;
uniform mat4 u_mRotMat;
uniform mat4 u_mMat;
varying vec3 v_norm;
varying vec2 v_tex;


void main() {
    vec4 rotated = u_mRotMat * a_pos;
    rotated.x *= u_data[0].y;
    rotated.y *= u_data[0].y;
    rotated.z *= u_data[0].x;
    rotated.x += u_mMat[3][0];
    rotated.y += u_mMat[3][1];
    rotated.z += u_mMat[3][2];
    gl_Position = u_pvMat * rotated;
    v_norm = normalize((u_mMat * a_norm).xyz);
    v_tex = a_tex;
}

`
        ,
            `
            precision mediump float;
uniform sampler2D u_sampler;
uniform vec3 u_light_dir[1];
varying vec3 v_norm;
varying vec2 v_tex;

float MIN_LIGHT = 0.3;

void main() {
    float pct = MIN_LIGHT + (1.0 - MIN_LIGHT)*dot(v_norm, u_light_dir[0]);
    vec4 img = texture2D(u_sampler, v_tex);
    gl_FragColor = vec4(pct * img.xyz, img.w);
}

            `)
        this.pvLoc = ball_gl.getUniformLocation(this.shader.full, "u_pvMat")
        this.mRotLoc = ball_gl.getUniformLocation(this.shader.full, "u_mRotMat")
        this.mLoc = ball_gl.getUniformLocation(this.shader.full, "u_mMat")
        this.posLoc = ball_gl.getAttribLocation(this.shader.full, "a_pos")
        this.normLoc = ball_gl.getAttribLocation(this.shader.full, "a_norm")
        this.texLoc = ball_gl.getAttribLocation(this.shader.full, "a_tex")
        this.samplerLoc = ball_gl.getUniformLocation(this.shader.full, "u_sampler")
        this.lightDirLoc = ball_gl.getUniformLocation(this.shader.full, "u_light_dir")
        this.dataLoc = ball_gl.getUniformLocation(this.shader.full, "u_data")
        console.log("ball frag", this.shader.fragCompileLog)
        console.log("ball", this.shader.vertCompileLog)
        console.log("Drawer Created", "Ball Drawer")
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
    draw: function(o, bmpName, bufs, ballM, preUpdated=false, lightArray=this.DIRECT_LIGHT){
        World.pvm.updateWithDisplayObjectBall(o)
        const m = World.pvm.m

        ball_gl.useProgram(this.shader.full)
        ball_gl.bindBuffer(ball_gl.ELEMENT_ARRAY_BUFFER, bufs.ind);
        
        ball_gl.bindBuffer(ball_gl.ARRAY_BUFFER, bufs.pos);
        ball_gl.enableVertexAttribArray(this.posLoc)
        ball_gl.vertexAttribPointer( this.posLoc, COORDS_PER_VERTEX, ball_gl.FLOAT, 0, 0, 0)

        ball_gl.bindBuffer(ball_gl.ARRAY_BUFFER, bufs.norm);
        ball_gl.enableVertexAttribArray(this.normLoc)
        ball_gl.vertexAttribPointer(this.normLoc, COORDS_PER_VERTEX, ball_gl.FLOAT, 0, 0, 0)

        ball_gl.bindBuffer(ball_gl.ARRAY_BUFFER, bufs.tex);
        ball_gl.enableVertexAttribArray(this.texLoc)
        ball_gl.vertexAttribPointer(this.texLoc, COORDS_PER_VERTEX, ball_gl.FLOAT, 0, 0, 0)


        ball_gl.uniformMatrix4fv(this.pvLoc, false, World.pvm.pv)
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (i < 3 && j < 3) {
                    this.mRot[i*4 + j] = m[i*4+j]
                } else {
                    this.mPos[i*4 + j] = m[i*4+j]
                }
            }
        }
        ball_gl.uniformMatrix4fv(this.mRotLoc, false, this.mRot)
        ball_gl.uniformMatrix4fv(this.mLoc, false, m)

        ball_gl.activeTexture(ball_gl.TEXTURE0)
        ball_gl.bindTexture(ball_gl.TEXTURE_2D, this.texHandles[this.strToTexHandleI[bmpName]])
        ball_gl.uniform1i(this.samplerLoc, 0)

        ball_gl.uniform3fv(this.lightDirLoc, lightArray)
        const dif = (1 - o.z) * 0.58
        let zz = 1 - dif
        if (zz > 1) {
            const over = zz - 1
            zz = 1 + Math.min(0.5, 0.05 * over) 
        }
        this.data[0] = zz
        this.data[1] = zz < 1 ? Math.pow(1 / zz, 0.5) : 1 / zz
        ball_gl.uniform4fv(this.dataLoc, this.data)

        ball_gl.drawElements(ball_gl.TRIANGLES, bufs.indArr.length, ball_gl.UNSIGNED_SHORT, 0)

        ball_gl.disableVertexAttribArray(this.posLoc)
        ball_gl.disableVertexAttribArray(this.normLoc)
        ball_gl.disableVertexAttribArray(this.texLoc)

    },


}