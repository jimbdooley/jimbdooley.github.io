
function getTextFileString(context, fileName) {
    return assets[fileName]
}


function objToPosNormInd(fileStr) {
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
    return PosNormInd_gc(
        posMutableList,
        normMutableList,
        indMutableList
    )
}
