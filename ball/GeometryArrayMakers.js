function objProperToPosNormIndTex(fileStr) {
    while (fileStr.indexOf("\n\n") != -1) { fileStr = fileStr.replace("\n\n", "\n") }
    const es = []
    for (el of fileStr.split("\n")) {
        const new_row = []
        for (el2 of el.split(" ")) {
            new_row.push(el2)
        }
        es.push(new_row)
    }
    const posOrig = []
    const texOrig = []
    const normOrig = []
    let triCount = 0
    for (const row of es) {
        if (row.length == 0) continue
        for (let i = 1; i < row.length; i++) {
            if (row[0] == "v") posOrig.push(row[i])
            if (row[0] == "vn") normOrig.push(row[i])
            if (row[0] == "vt" && i < 3) texOrig.push(row[i])
        }
        if (row[0] == "v") posOrig.push(1)
        if (row[0] == "vn") normOrig.push(0)
        if (row[0] == "vt") { for (let j = 0; j < 2; j++) texOrig.push(0) }
        if (row[0] == "f") triCount += row.length - 3
    }
    const pos = []
    const norm = []
    const tex = []
    const inds = []
    for (let i = 0; i < triCount * 12; i++) {
        pos.push(1)
        norm.push(0)
        tex.push(0)
    }
    for (let i = 0; i < triCount * 3; i++) {
        inds.push(0)
    }
    triCount = 0
    for (const row of es) {
        if (row.length == 0) continue
        if (row[0] != "f") continue
        for (let i = 0; i < row.length - 3; i++) {
            for (let tri = 3*triCount; tri < 3*triCount + 3; tri++) {
                inds[tri] = tri
                const objRow = 1 + (tri == 3*triCount ?  0 : i + tri - 3*triCount)
                const origI = row[objRow].split("/")
                for (let j = 0; j < 3; j++) {
                    pos[tri*4+j] = posOrig[(origI[0]-1)*4+j]
                    tex[tri*4+j] = texOrig[(origI[1]-1)*4+j]
                    norm[tri*4+j] = normOrig[(origI[2]-1)*4+j]
                }
            }
            triCount += 1
        }

    }
    return PosNormIndTex(pos, norm, inds, tex)

}

function xform1(x, y, z, th, dstArr) {
    const y2 = y*Math.cos(th) - z * Math.sin(th)
    const z2 = y*Math.sin(th) + z*Math.cos(th)
    dstArr.push(x, y2, z2, 1)
}
function xform2(x, y, z, th, dstArr) {
    const x2 = x*Math.cos(th) - z * Math.sin(th)
    const z2 = x*Math.sin(th) + z*Math.cos(th)
    dstArr.push(x2, y, z2, 1)
}

function trackPNIT2(n = 20) {
    const pos = []
    const norm  = []
    const ind = []
    const tex = []
    function getRandomZ(i, j, n) {
        if (i == 0 || i == n - 1) return 0
        if (j-0.1 <= n * 0.5 + 2 && j+0.1 >= n * 0.5 - 2) return 0
        return Math.random()
    }
    
    for (let i = 0; i <= n; i++) {
        for (let j = 0; j <= n; j++) {
            pos.push(-1 + 2 * j / n, -1 + 2 * i / n, 0, 1)
            norm.push(0, 0, 1, 0)
            tex.push(
                j % 2, 
                i % 2, 
                getRandomZ(i, j, n), 
                getRandomZ(i, j, n), 
            )
            if (i < n && j < n) {
                ind.push(
                    (1+n)*i + j + 0, 
                    (1+n)*i + j + 1, 
                    (1+n)*(i+1) + j + 0, 
                    (1+n)*(i+1) + j + 0, 
                    (1+n)*i + j + 1, 
                    (1+n)*(i+1) + j + 1
                )
            }
        }
    }
    return PosNormIndTex(pos, norm, ind, tex)

}


function trackPNIT(y_to_x) {
    const segs = 8
    const n = segs * y_to_x
    const pos = []
    const norm  = []
    const ind = []
    const tex = []
    
    let indI = 0
    for (let i = 0; i <= n; i++) {
        if (i % segs == 0 && i != 0) {
            pos.push(-1, -1 + 2 * i / n, 0, 1)
            pos.push(1, -1 + 2 * i / n, 0, 1)
            norm.push(0, 0, 1, 0, 0, 0, 1, 0)
            tex.push(0, 0, 0, 0)
            tex.push(1, 0, 0, 0)
            indI += 1
        }
        pos.push(-1, -1 + 2 * i / n, 0, 1)
        pos.push(1, -1 + 2 * i / n, 0, 1)
        norm.push(0, 0, 1, 0, 0, 0, 1, 0)
        tex.push(0, 1 - ((i/segs) % 1), 0, 0)
        tex.push(1, 1 - ((i/segs) % 1), 0, 0)
        if (i < n) {
            ind.push(
                2*indI + 0, 
                2*indI + 1, 
                2*indI + 2, 
                2*indI + 2, 
                2*indI + 1, 
                2*indI + 3)
        }
        indI += 1
    }
    return PosNormIndTex(pos, norm, ind, tex)

}

function cubeCirclePNIT(N=4, keepAsCube=false) {
    const pos = []
    const norm = []
    const ind = []
    const tex  = []
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            pos.push(-1 + (2/N)*i, -1 + (2/N)*j, 1, 1)
            tex.push(i/N, 1 - j/N, 0, 0)
            pos.push(-1 + (2/N)*(i+1), -1 + (2/N)*j, 1, 1)
            tex.push((i+1)/N, 1 - j/N, 0, 0)
            pos.push(-1 + (2/N)*i, -1 + (2/N)*(j+1), 1, 1)
            tex.push(i/N, 1 - (j+1)/N, 0, 0)
            pos.push(-1 + (2/N)*i, -1 + (2/N)*(j+1), 1, 1)
            tex.push(i/N, 1 - (j+1)/N, 0, 0)
            pos.push(-1 + (2/N)*(i+1), -1 + (2/N)*j, 1, 1)
            tex.push((i+1)/N, 1 - j/N, 0, 0)
            pos.push(-1 + (2/N)*(i+1), -1 + (2/N)*(j+1), 1, 1)
            tex.push((i+1)/N, 1 - (j+1)/N, 0, 0)
            for (let k = 0; k < 6; k++) norm.push(0, 0, 1, 0)
        }
    }
    if (!keepAsCube) {
        for (let i = 0; i < pos.length; i += 4) {
            const vl = Math.sqrt(pos[i]*pos[i] + pos[i+1]*pos[i+1] + pos[i+2]*pos[i+2])
            pos[i] /= vl
            pos[i+1] /= vl
            pos[i+2] /= vl
        }
    }
    const posLen = pos.length
    for (let h = 1; h < 4; h++) {
        for (let i = 0; i < posLen; i += 4) {
            xform1(pos[i], pos[i+1], pos[i+2], h*0.5*Math.PI, pos)
            tex.push(tex[i], tex[i+1], 0, 0)
            norm.push(0, 0, 1, 0)
        }
    }
    for (let h = 1; h < 4; h += 2) {
        for (let i = 0; i < posLen; i += 4) {
            xform2(pos[i], pos[i+1], pos[i+2], h*0.5*Math.PI, pos)
            tex.push(tex[i], tex[i+1], 0, 0)
            norm.push(0, 0, 1, 0)
        }
    }
    for (let i = 0; i < pos.length / 4; i++) ind.push(i)
    for (let i = 0; i < ind.length; i+=3) setNaturalNormals(pos, norm, ind, i)
    return PosNormIndTex(pos, norm, ind, tex)
}