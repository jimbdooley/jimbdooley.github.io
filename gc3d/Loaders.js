
function loadCSVAs2dList(context, fileName) {
    let fileStr = getTextFileString(context, fileName).replace("\r", "\n")
    while (fileStr.indexOf("\n\n") != -1) { fileStr = fileStr.replace("\n\n", "\n") }
    const lines = fileStr.split("\n")
    const linesSplit = []
    for (line in lines) {
        const temp = [""]
        let inQuotes = false
        for (char in line) {
            if (!inQuotes && char != ',' && char != '"') {
                temp[temp.length-1] = temp[temp.length-1] + char
            }
            if (!inQuotes && char == ',') {
                temp.push("")
            }
            if (!inQuotes && char == '"') {
                inQuotes = true
            } else if (inQuotes && char == '"') {
                inQuotes = false
            }
            if (inQuotes && char != '"') {
                temp[temp.length-1] = temp[temp.length-1] + char
            }
        }
        linesSplit.push(temp.toList())
    }
    return linesSplit.toList()
}

function getTextFileString(context, fileName) {
    return assets[fileName]
}

function objProperToPosNormIndTex(_fileStr) {
    let fileStr = _fileStr
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
            if (row[0] == "v") posOrig.push(parseFloat(row[i]))
            if (row[0] == "vn") normOrig.push(parseFloat(row[i]))
            if (row[0] == "vt" && i < 3) texOrig.push(parseFloat(row[i]))
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
                    pos[tri*4+j] = posOrig[(Math.floor(origI[0])-1)*4+j]
                    tex[tri*4+j] = texOrig[(Math.floor(origI[1])-1)*4+j]
                    norm[tri*4+j] = normOrig[(Math.floor(origI[2])-1)*4+j]
                }
            }
            triCount += 1
        }

    }
    return PosNormIndTex(pos, norm, inds, tex)

}

function objToPosNormIndTex(context, fileName) {
    let fileStr = getTextFileString(context, fileName).replace("\r", "\n")
    while (fileStr.indexOf("\n\n") != -1) { fileStr = fileStr.replace("\n\n", "\n") }
    const es = []
    for (el of fileStr.split("\n")) {
        const new_row = []
        for (el2 of el.split(" ")) {
            new_row.push(el2)
        }
        es.push(new_row)
    }

    const posMutableList = []
    const normMutableList = []
    const indMutableList = []
    const texMutableList = []
    for (const row of es) {
        if (row.length == 0) continue
        for (let i = 0; i < row.length; i++) {
            if (i == 0) continue
            if (row[0] == "v") posMutableList.push(row[i])
            if (row[0] == "vn") normMutableList.push(row[i])
            if (row[0] == "f") indMutableList.push((row[i] - 1))
            if (row[0] == "vt") texMutableList.push(row[i])
        }
        if (row[0] == "v" && row.length == 4) posMutableList.push(1)
        if (row[0] == "vn" && row.length == 4) normMutableList.push(0)
        if (row[0] == "vt" && row.length < 5) {
            texMutableList.push(0)
            texMutableList.push(0)
        }
    }

    return PosNormIndTex(
        posMutableList,
        normMutableList,
        indMutableList,
        texMutableList
    )
}

function objToPosNormInd(_fileStr) {
    let fileStr = _fileStr
    while (fileStr.indexOf("\n\n") != -1) { fileStr = fileStr.replace("\n\n", "\n") }
    const es = []
    for (el of fileStr.split("\n")) {
        const new_row = []
        for (el2 of el.split(" ")) {
            new_row.push(el2)
        }
        es.push(new_row)
    }

    const posMutableList = []
    const normMutableList = []
    const indMutableList = []
    for (const row of es) {
        if (row.length == 0) continue
        for (let i = 0; i < row.length; i++) {
            if (i == 0) continue
            if (row[0] == "v") posMutableList.push(parseFloat(row[i]))
            if (row[0] == "vn") normMutableList.push(parseFloat(row[i]))
            if (row[0] == "f") indMutableList.push(parseInt((row[i] - 1)))
        }
        if (row[0] == "v" && row.length == 4) posMutableList.push(1)
        if (row[0] == "vn" && row.length == 4) normMutableList.push(0)
    }
    return PosNormInd(
        posMutableList,
        normMutableList,
        indMutableList
    )
}


function plateObjToPosNormInd(context, _fileStr, gemShape) {
    //return PosNormIndTexs.g
    let fileStr = _fileStr
    while (fileStr.indexOf("\n\n") != -1) { fileStr = fileStr.replace("\n\n", "\n") }
    const es = []
    for (const line of fileStr.split("\n")) {
        const lineArr = []
        for (const e of line.split(" ")) lineArr.push(e)
        es.push(lineArr)
    }

    const posMutableList = []
    const normMutableList = []
    const indMutableList = []
    for (const row of es) {
        for (let i = 0; i < row.length; i++) {
            if (i == 0) continue
            if (row[0] == "v") posMutableList.push(parseFloat(row[i]))
            if (row[0] == "vn") normMutableList.push(parseFloat(row[i]))
            if (row[0] == "f") indMutableList.push((parseInt(row[i]) - 1))
        }
        if (row[0] == "v" && row.length == 4) posMutableList.push(1)
        if (row[0] == "vn" && row.length == 4) normMutableList.push(0)
    }
    
    if (gemShape == GemShape.HEART || gemShape == GemShape.MARQUISE) {
        const indCount = indMutableList.length
        const posCount = posMutableList.length
        const nextInd = 1 + indMutableList.reduce((a, c) => c > a ? c : a, -1)
        for (let i = 0; i < indCount; i += 3) {
            indMutableList.push(nextInd + indMutableList[i])
            indMutableList.push(nextInd + indMutableList[i+2])
            indMutableList.push(nextInd + indMutableList[i+1])
        }
        for (let i = 0; i < posCount; i += 4) {
            posMutableList.push(-posMutableList[i])
            posMutableList.push(posMutableList[i+1])
            posMutableList.push(posMutableList[i+2])
            posMutableList.push(posMutableList[i+3])
            normMutableList.push(-normMutableList[i])
            normMutableList.push(normMutableList[i+1])
            normMutableList.push(normMutableList[i+2])
            normMutableList.push(normMutableList[i+3])
        }
        for (let i = 0; i < 2*indCount; i += 3) {
            indMutableList.push(2*nextInd + indMutableList[i])
            indMutableList.push(2*nextInd + indMutableList[i+2])
            indMutableList.push(2*nextInd + indMutableList[i+1])
        }
        for (let i = 0; i < 2*posCount; i += 4) {
            posMutableList.push(posMutableList[i])
            posMutableList.push(posMutableList[i+1])
            posMutableList.push(-posMutableList[i+2])
            posMutableList.push(posMutableList[i+3])
            normMutableList.push(normMutableList[i])
            normMutableList.push(normMutableList[i+1])
            normMutableList.push(-normMutableList[i+2])
            normMutableList.push(normMutableList[i+3])
        }
        if (gemShape == GemShape.MARQUISE) {
            for (let i = 0; i < 4 * indCount; i += 3) {
                indMutableList.push(4*nextInd + indMutableList[i])
                indMutableList.push(4*nextInd + indMutableList[i+2])
                indMutableList.push(4*nextInd + indMutableList[i+1])
            }
            for (let i = 0; i < 4 * posCount; i += 4) {
                posMutableList.push(posMutableList[i])
                posMutableList.push(-posMutableList[i+1])
                posMutableList.push(posMutableList[i+2])
                posMutableList.push(posMutableList[i+3])
                normMutableList.push(normMutableList[i])
                normMutableList.push(-normMutableList[i+1])
                normMutableList.push(normMutableList[i+2])
                normMutableList.push(normMutableList[i+3])
            }
        }
    }
    
    if (gemShape == GemShape.BRIOLETTE ||
        gemShape == GemShape.RECTANGLE ||
        gemShape == GemShape.PRINCESS ||
        gemShape == GemShape.TRILLIANT ||
        gemShape == GemShape.ROSE ||
        gemShape == GemShape.DONUT ||
        gemShape == GemShape.ICO
    ) {
        const indCount = indMutableList.length
        const posCount = posMutableList.length
        const nextInd = 1 + indMutableList.reduce((a, c) => c > a ? c : a, -1)
        let rots = -1
        if (gemShape == GemShape.BRIOLETTE) {
            rots = 9
        } else if (gemShape == GemShape.RECTANGLE) {
            rots = 2
        } else if (gemShape == GemShape.PRINCESS) {
            rots = 4
        } else if (gemShape == GemShape.TRILLIANT || gemShape == GemShape.ROSE) {
            rots = 3
        } else if (gemShape == GemShape.DONUT) {
            rots = 7
        } else if (gemShape == GemShape.ICO) {
            rots = 5
        } else {
            rots = 1
        }
        for (let i = 1; i < rots; i++) {
            const cosTh = Math.cos(Math.PI * 2.0 * i / rots)
            const sinTh = Math.sin(Math.PI * 2.0 * i / rots)
            for (let j = 0; j < indCount; j++) {
                indMutableList.push((indMutableList[j] + nextInd*i))
            }
            for (let j = 0; j < posCount; j+= 4) {
                posMutableList.push((posMutableList[j]*cosTh - posMutableList[j+1]*sinTh))
                posMutableList.push((posMutableList[j]*sinTh + posMutableList[j+1]*cosTh))
                posMutableList.push(posMutableList[j+2])
                posMutableList.push(posMutableList[j+3])
                normMutableList.push((normMutableList[j]*cosTh - normMutableList[j+1]*sinTh))
                normMutableList.push((normMutableList[j]*sinTh + normMutableList[j+1]*cosTh))
                normMutableList.push(normMutableList[j+2])
                normMutableList.push(normMutableList[j+3])
            }
        }
    }
    
    if (gemShape == GemShape.ROSE || gemShape == GemShape.DONUT) {
        const indCount = indMutableList.length
        const posCount = posMutableList.length
        const nextInd = 1 + indMutableList.reduce((a, c) => c > a ? c : a, -1)
        for (let i = 0; i < indCount; i += 3) {
            indMutableList.push(nextInd + indMutableList[i])
            indMutableList.push(nextInd + indMutableList[i+2])
            indMutableList.push(nextInd + indMutableList[i+1])
        }
        for (let i = 0; i < posCount; i += 4) {
            posMutableList.push(posMutableList[i])
            posMutableList.push(posMutableList[i+1])
            posMutableList.push(-posMutableList[i+2])
            posMutableList.push(posMutableList[i+3])
            normMutableList.push(normMutableList[i])
            normMutableList.push(normMutableList[i+1])
            normMutableList.push(-normMutableList[i+2])
            normMutableList.push(normMutableList[i+3])
        }
    }
    if (gemShape == GemShape.ICO || gemShape == GemShape.MERKABA) {
        const indCount = indMutableList.length
        const posCount = posMutableList.length
        const nextInd = 1 + indMutableList.reduce((a, c) => c > a ? c : a, -1)
        for (let i = 0; i < indCount; i ++) {
            indMutableList.push(nextInd + indMutableList[i])
        }
        for (let i = 0; i < posCount; i += 4) {
            posMutableList.push(-posMutableList[i])
            posMutableList.push(posMutableList[i + 1])
            posMutableList.push(-posMutableList[i + 2])
            posMutableList.push(posMutableList[i + 3])
            normMutableList.push(-normMutableList[i])
            normMutableList.push(normMutableList[i + 1])
            normMutableList.push(-normMutableList[i + 2])
            normMutableList.push(normMutableList[i + 3])
        }
    }
    
    return PosNormIndTex(
        posMutableList,
        normMutableList,
        indMutableList
    )
}

