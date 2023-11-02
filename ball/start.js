const ball_canvas = document.getElementById("ball_canvas");
const ball_gl = ball_canvas.getContext('webgl') || ball_canvas.getContext('experimental-webgl');
const PI = Math.PI
const Bitmap = {
    createBitmap(argbArr, rows, cols) {
        const pixels = new Uint8ClampedArray(rows*cols*4)
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                pixels[4*(cols*i + j) + 0] = argbArr[i*cols + j][1]
                pixels[4*(cols*i + j) + 1] = argbArr[i*cols + j][2]
                pixels[4*(cols*i + j) + 2] = argbArr[i*cols + j][3]
                pixels[4*(cols*i + j) + 3] = argbArr[i*cols + j][0]
            }
        }
        return new ImageData(pixels, rows, cols)
    },
    Config: {ARGB: -1},
}
