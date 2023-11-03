
const Scene = {
    intro: {i: 0},
    underwater_rocks: {i: 1},
    desert_plateus: {i: 2},
    forest_blue_sky: {i: 3},
    fairy_tale_stick_villiage: {i: 4},
    fairy_tale_blue_swamp: {i: 5},
}
const Scene_values = [Scene.intro, Scene.underwater_rocks, Scene.desert_plateus, Scene.forest_blue_sky, Scene.fairy_tale_stick_villiage, Scene.fairy_tale_blue_swamp]
Scene.values = function() { return Scene_values }

const sceneToDrawables = [
    [
        "intro_1",
        "intro_2",
        "intro_3",
        "intro_4",
        "intro_5",
        "intro_6",
        "intro_7", 
    ],
    [
        "underwater_rocks_1",
        "underwater_rocks_2",
        "underwater_rocks_3",
        "underwater_rocks_4",
        "underwater_rocks_5",
        "underwater_rocks_6", 
    ],
    [
        "desert_plateus_1",
        "desert_plateus_2",
        "desert_plateus_3",
        "desert_plateus_4",
        "desert_plateus_5",
    ],
    [
        "forest_blue_sky_1",
        "forest_blue_sky_2",
        "forest_blue_sky_3",
        "forest_blue_sky_4",
        "forest_blue_sky_5", 
    ],
    [
        "fairy_tale_stick_village_1",
        "fairy_tale_stick_village_2",
        "fairy_tale_stick_village_3",
        "fairy_tale_stick_village_4",
        "fairy_tale_stick_village_5",
        "fairy_tale_stick_village_6",
    ],
    [
        "fairy_tale_blue_swamp_1",
        "fairy_tale_blue_swamp_2",
        "fairy_tale_blue_swamp_3",
        "fairy_tale_blue_swamp_4",
        "fairy_tale_blue_swamp_5",
    ],
]

const DrawerScene = {
    displayObject: DisplayObject(),
    posLoc: -1,
    texLoc: -1,
    samplerLocs: [-1, -1, -1, -1, -1, -1, -1, -1],
    pvmLoc: -1,
    dataLoc: -1,
    shader: null,
    clearBMP: Bitmap.createBitmap([0, 0, 0, 0], 1, 1),
    sceneToTexHandleOffset: {},
    texHandles: [0, 0, 0, 0, 0, 0, 0, 0],
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    prevT: 0,
    lastLoadedScene: null,
    activeTextureList: [
        gc3d_gl.TEXTURE0,
        gc3d_gl.TEXTURE1,
        gc3d_gl.TEXTURE2,
        gc3d_gl.TEXTURE3,
        gc3d_gl.TEXTURE4,
        gc3d_gl.TEXTURE5,
        gc3d_gl.TEXTURE6,
        gc3d_gl.TEXTURE7,
    ],
    setupShader() {
        this.shader = Shader(assets["shaders/scene.vert"], assets["shaders/scene.frag"])
        for (let i = 0; i < this.texHandles.length; i++) {
            this.texHandles[i] = gc3d_gl.createTexture()
        }
        this.pvmLoc = gc3d_gl.getUniformLocation(this.shader.full, "u_pvmMat")
        this.dataLoc = gc3d_gl.getUniformLocation(this.shader.full, "u_data")
        this.posLoc = gc3d_gl.getAttribLocation(this.shader.full, "a_pos")
        this.texLoc = gc3d_gl.getAttribLocation(this.shader.full, "a_tex")
        for (let i = 0; i < 8; i++) {
            this.samplerLocs[i] = gc3d_gl.getUniformLocation(this.shader.full, `u_sampler${i}`)
        }
    },
    setup() {
        this.lastLoadedScene = null
        this.setupShader()
    },
    bmpDrawableInts: [],
    bmp_w: 1,
    bmp_h: 1,
    loadScene(scene) {
        this.bmpDrawableInts=[]
        for (const d of sceneToDrawables[scene.i]) {
            if (drawableArrs[d + ".png"] == null) return 0
            this.bmpDrawableInts.push(0)
        }
        for (let i = 0; i < 8; i++) {
            const arr = sceneToDrawables[scene.i]
            const bmp = i < arr.length ? drawableArrs[arr[i] + ".png"] : this.clearBMP
            if (i == 0) {
                this.bmp_w = bmp.width
                this.bmp_h = bmp.height
            }
            gc3d_gl.bindTexture(gc3d_gl.TEXTURE_2D, this.texHandles[i])
            //gc3d_gl.texImage2D(gc3d_gl.TEXTURE_2D, 0, gc3d_gl.RGBA, 1, 1, 0, gc3d_gl.RGBA, gc3d_gl.UNSIGNED_BYTE,
            //    new Uint8Array([0, 0, 255, 255]));
            gc3d_gl.texImage2D(gc3d_gl.TEXTURE_2D, 0, gc3d_gl.RGBA, gc3d_gl.RGBA, gc3d_gl.UNSIGNED_BYTE, bmp)
            gc3d_gl.texParameteri(gc3d_gl.TEXTURE_2D, gc3d_gl.TEXTURE_MIN_FILTER, gc3d_gl.NEAREST)
            gc3d_gl.texParameteri(gc3d_gl.TEXTURE_2D, gc3d_gl.TEXTURE_MAG_FILTER, gc3d_gl.NEAREST)
            gc3d_gl.texParameteri(gc3d_gl.TEXTURE_2D, gc3d_gl.TEXTURE_WRAP_S, gc3d_gl.CLAMP_TO_EDGE)
            gc3d_gl.texParameteri(gc3d_gl.TEXTURE_2D, gc3d_gl.TEXTURE_WRAP_T, gc3d_gl.CLAMP_TO_EDGE)
        }
        this.lastLoadedScene = scene
        return 1
    },
    scrollR: 0,
    xyz: [0, 0, 0],
    draw(region, scroll, scene) {
        if (scene != this.lastLoadedScene) {
            if (this.loadScene(scene) == 0) return 0
        }
        const yDist = yDistFromZAndDeviceRegion(SCENE_0, region)
        const xDist = xDistFromZAndDeviceRegion(SCENE_0, region)
        setWorldXYZFromDeviceXY(this.xyz, region[0]+0.5*region[2], region[1]+0.5*region[3], SCENE_0)
        const texX_over_bmpWs = region[2] * this.bmp_h / (region[3] * this.bmp_w)
        this.displayObject.x = this.xyz[0]
        this.displayObject.y = this.xyz[1]
        this.displayObject.z = this.xyz[2]
        this.displayObject.sx = 0.5 * xDist
        this.displayObject.sy = 0.5 * yDist
        World_gc.pvm.updateWithDisplayObject(this.displayObject)
        
        gc3d_gl.useProgram(this.shader.full)
        gc3d_gl.bindBuffer(gc3d_gl.ELEMENT_ARRAY_BUFFER, PosNormIndTexs.square.ind);
        
    
        gc3d_gl.bindBuffer(gc3d_gl.ARRAY_BUFFER, PosNormIndTexs.square.pos);
        gc3d_gl.enableVertexAttribArray(this.posLoc)
        gc3d_gl.vertexAttribPointer( this.posLoc, COORDS_PER_VERTEX, gc3d_gl.FLOAT, 0, 0, 0)


        gc3d_gl.bindBuffer(gc3d_gl.ARRAY_BUFFER, PosNormIndTexs.square.tex);
        gc3d_gl.enableVertexAttribArray(this.texLoc)
        gc3d_gl.vertexAttribPointer(this.texLoc, COORDS_PER_VERTEX, gc3d_gl.FLOAT, 0, 0, 0)

        gc3d_gl.uniformMatrix4fv(this.pvmLoc, false, World_gc.pvm.pvm)
        
        const rate0 = 0.003
        const dRate = 0.018
        const maxRate = World_gc.viewWidth <= World_gc.viewHeight ? 0.4 : 0.7
        this.data[0] = texX_over_bmpWs
        const dT = this.prevT == 0 ? 0 : World_gc.t_s-this.prevT
        this.scrollR = scroll ? maxRate : Math.max(0, this.scrollR - 0.01)
        for (let i = 0; i < this.bmpDrawableInts.length; i++) {
            const r = i / this.bmpDrawableInts.length
            this.data[i + 4] = (this.data[i + 4] + this.scrollR*dT*(rate0 + 8*r*r*dRate)) % 1
        }
        gc3d_gl.uniform4fv(this.dataLoc, this.data)

        const texHandleOffset = 8 * this.sceneToTexHandleOffset[scene.i]
        for (let i = 0; i < 8; i++) {
            gc3d_gl.activeTexture(this.activeTextureList[i])
            gc3d_gl.bindTexture(gc3d_gl.TEXTURE_2D, this.texHandles[i])
            gc3d_gl.uniform1i(this.samplerLocs[i], i)
        }
        gc3d_gl.drawElements(gc3d_gl.TRIANGLES, PosNormIndTexs.square.indArr.length, gc3d_gl.UNSIGNED_SHORT,0);
        this.prevT  = World_gc.t_s
        return 1
    },
}
