
function gc3d_loop() {
    requestAnimationFrame(gc3d_loop)
    MyGLRenderer.render()
}


async function gc3d_init() {
    await get_all_assets()
    MyGLRenderer.init()
    setTimeout(gc3d_loop, 15)
}


gc3d_canvas.width = 600
gc3d_canvas.height = 500
const CW = gc3d_canvas.width
const CH = gc3d_canvas.height
gc3d_canvas.width *= window.devicePixelRatio
gc3d_canvas.height *= window.devicePixelRatio
setTimeout(() => {
    gc3d_canvas.style.width = `${CW}px`
    gc3d_canvas.style.height = `${CH}px`
    gc3d_init()
}, 30)


