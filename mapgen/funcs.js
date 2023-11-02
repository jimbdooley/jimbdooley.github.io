
function downloadAllShapes() {
    const arrs = [circlesSaved, hesqsSaved, hexagonsSaved, octagonsSaved, squaresSaved, trianglesSaved]
    const keys = ["circles", "hesqs", "hexagons", "octagons", "squares", "triangles"]
    const rtn = {}
    for (let i = 0; i < arrs.length; i++) {
        rtn[keys[i]] = []
        for (const s of arrs[i]) {
            rtn[keys[i]].push(JSON.parse(s))
        }
    }
    navigator.clipboard.writeText(JSON.stringify(rtn));
}

function sortBubble(list) {
    for (let i = list.length - 1; i > 0; i--) {
        for (let j = 0; j < i; j++) {
            if (list[j] <= list[j+1]) continue
            const temp = list[j]
            list[j] = list[j+1]
            list[j+1] = temp
        }
    }
}

function testSortBubble() {
    const t = []
    for (let i = 0; i < 10; i++) {
        t.push(Math.floor(10*Math.random()))
    }
    console.log(t)
    sortBubble(t)
    console.log(t)
}

function shapes_trim(map, list) {
    sortBubble(list)
    for (const el of list) {
        for (let i = 0; i < map[el].length; i++) {
            if (list.indexOf(map[el][i]) != -1) continue
            map[el][i] = -1
        }
    }
    const newMap = []
    for (const el of list) {
        newMap.push(map[el])
    }
    for (const el of newMap) {
        for (let i = 0; i < el.length; i++) {
            if (el[i] == -1) continue
            el[i] = list.indexOf(el[i])
        }
    }
    return newMap
}

function shapes_getXY_fromMinMax(xyI, minXY, maxXY, canvas, scale) {
    const w = (maxXY[0] + 1 - minXY[0]) * 2 * scale
    const h = (maxXY[1] + 1 - minXY[1]) * 2 * scale
    const xr = (xyI[0] - minXY[0] + 0.5) / (maxXY[0] + 1 - minXY[0])
    const yr = (xyI[1] - minXY[1] + 0.5) / (maxXY[1] + 1 - minXY[1])
    const left = canvas.width / 2 - w / 2
    const bot = canvas.height / 2 - h / 2
    const x = left + xr * w
    const y = bot + yr * h
    return [x, canvas.height - y]
}