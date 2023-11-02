
function squares_generate_full(stop=100) {
    const map = []
    const sideLen = Math.ceil(Math.sqrt(stop))
    for (let row = 0; row < sideLen; row++) {
        for (let col = 0; col < sideLen; col++) {
            const curr = row * sideLen + col
            map.push([
                row < sideLen - 1 ? curr + sideLen : -1,
                col < sideLen - 1 ? curr + 1 : -1,
                row > 0 ? curr - sideLen : -1,
                col > 0 ? curr - 1 : -1,
            ])
        }
    }

    return map
}

function squares_getInfoXY(map) {
    const visited = {0: 1}
    const xys = {0: [0, 0]}
    const queue = [0]
    const maxXY = [0, 0]
    const minXY = [0, 0]
    while (queue.length > 0) {
        const currI = queue.shift()
        const currXY = xys[currI]
        maxXY[0] = Math.max(maxXY[0], currXY[0])
        maxXY[1] = Math.max(maxXY[1], currXY[1])
        minXY[0] = Math.min(minXY[0], currXY[0])
        minXY[1] = Math.min(minXY[1], currXY[1])
        for (let i = 0; i < map[currI].length; i++) {
            if (map[currI][i] == -1) continue
            if (map[currI][i] in visited) continue
            queue.push(map[currI][i])
            visited[map[currI][i]] = 1
            const nextXY = [0, 0]
            if (i % 2 == 0) {
                nextXY[0] = currXY[0]
                nextXY[1] = currXY[1] + (i == 0 ? 1 : -1)
            } else {
                nextXY[0] = currXY[0] + (i == 1 ? 1 : -1)
                nextXY[1] = currXY[1]
            }
            xys[map[currI][i]] = nextXY
        }
    }
    return [minXY, maxXY, xys]
}



function squares_links(map, canvas, ctx, scale=18) {
    const infoXY = squares_getInfoXY(map)
    const minXY = infoXY[0]
    const maxXY = infoXY[1]
    const xys = infoXY[2]
    const bots = []
    const lefts = []
    for (let i = 0; i < map.length; i++) {
        if (map[i][0] != -1 && map[i][2] == -1) {
            bots.push(i)
        }
        if (map[i][1] != -1 && map[i][3] == -1) {
            lefts.push(i)
        }
    }
    ctx.lineWidth = 4
    ctx.strokeStyle = "green"
    for (let i = 0; i < bots.length; i++) {
        let curr = bots[i]
        while (map[curr][0] != -1) {
            const next = map[curr][0]
            const currXY = shapes_getXY_fromMinMax(xys[curr], minXY, maxXY, canvas, scale)
            const nextXY = shapes_getXY_fromMinMax(xys[next], minXY, maxXY, canvas, scale)
            ctx.beginPath()
            ctx.moveTo(currXY[0], currXY[1])
            ctx.lineTo(nextXY[0], nextXY[1])
            ctx.stroke()
            curr = next
        }
    }
    ctx.strokeStyle = "red"
    for (let i = 0; i < lefts.length; i++) {
        let curr = lefts[i]
        while (map[curr][1] != -1) {
            const next = map[curr][1]
            const currXY = shapes_getXY_fromMinMax(xys[curr], minXY, maxXY, canvas, scale)
            const nextXY = shapes_getXY_fromMinMax(xys[next], minXY, maxXY, canvas, scale)
            ctx.beginPath()
            ctx.moveTo(currXY[0], currXY[1])
            ctx.lineTo(nextXY[0], nextXY[1])
            ctx.stroke()
            curr = next
        }
    }
}

function squares_get_clicked(map, clickXY, canvas, scale) {
    const infoXY = squares_getInfoXY(map)
    const minXY = infoXY[0]
    const maxXY = infoXY[1]
    const xyIs = infoXY[2]
    let rtn = -1
    for (let i = 0; i < map.length; i++) {
        const xy = shapes_getXY_fromMinMax(xyIs[i], minXY, maxXY, canvas, scale)
        if (scale > Math.abs(clickXY[0]-xy[0]) && scale > Math.abs(clickXY[1]-xy[1])) {
            rtn = i
        }
    }
    return rtn
}

function squares_draw(map, canvas, ctx, highlighted=null, scale=18) {
    const infoXY = squares_getInfoXY(map)
    const minXY = infoXY[0]
    const maxXY = infoXY[1]
    const xys = infoXY[2]
    ctx.lineWidth = 1
    ctx.strokeStyle = "black"
    for (let i = 0; i < map.length; i++) {
        ctx.fillStyle = (highlighted && highlighted.indexOf(i) != -1) ? "#555555" : "#cccccc" 
        const xy = shapes_getXY_fromMinMax(xys[i], minXY, maxXY, canvas, scale)
        ctx.fillRect(xy[0]-scale, xy[1]-scale, 2*scale, 2*scale)
        ctx.beginPath()
        ctx.rect(xy[0]-scale, xy[1]-scale, 2*scale, 2*scale)
        ctx.stroke()
    }
    squares_links(map, canvas, ctx, scale)
}