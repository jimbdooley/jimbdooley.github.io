
function getOneTri() {
    const p = []
    const sz = 400
    const bw = 18
    for (let i = 0; i < sz; i++) {
        for (let j = 0; j < sz; j++) {
            let bdr = i < bw || j < bw || i >= sz - bw || j >= sz - bw || Math.abs(i - j) < Math.floor(bw * 0.7)
            if (bdr){
                p.push([255, 255, 255, 255])
            } else {
                p.push([255, 0, 0, 255])
            }
        }
    }
    return Bitmap.createBitmap(p, sz, sz, Bitmap.Config.ARGB_8888)
}
