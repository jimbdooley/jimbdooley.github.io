
function hexagons_generate_full(stop=100) {
    const map = []
    const sideLen = Math.ceil(Math.sqrt(stop))
    for (let row = 0; row < sideLen; row++) {
        for (let col = 0; col < sideLen; col++) {
            const curr = row * sideLen + col
            const sticksOutRight = row % 2 == 1 && col == sideLen - 1
            const sticksOutLeft = row % 2 == 0 && col == 0
            map.push([
                row < sideLen - 1 && !sticksOutRight ? curr + sideLen + row % 2: -1,
                col < sideLen - 1 ? curr + 1 : -1,
                row > 0 && !sticksOutRight ? (curr - sideLen + row % 2) : -1,
                row > 0 && !sticksOutLeft ? (curr - sideLen - (1 - row%2)) : -1,
                col > 0 ? curr - 1 : -1,
                row < sideLen - 1 && !sticksOutLeft ? (curr + sideLen - (1 - row%2)) : -1,
            ])
        }
    }

    return map
}


function hexagons_getInfoXY(map) {
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
        for (let i = 0; i < 6; i++) {
            if (map[currI][i] == -1) continue
            if (map[currI][i] in visited) continue
            queue.push(map[currI][i])
            visited[map[currI][i]] = 1
            const nextXY = [0, 0]
            if (i == 0) {
                nextXY[0] = currXY[0] + Math.sqrt(3) / 4
                nextXY[1] = currXY[1] + 3 / 4
            } else if (i == 1) {
                nextXY[0] = currXY[0] + Math.sqrt(3)/2
                nextXY[1] = currXY[1] + 0
            } else if (i == 2) {
                nextXY[0] = currXY[0] + Math.sqrt(3) / 4
                nextXY[1] = currXY[1] - 3 / 4
            } else if (i == 3) {
                nextXY[0] = currXY[0] - Math.sqrt(3) / 4
                nextXY[1] = currXY[1] - 3 / 4
            } else if (i == 4) {
                nextXY[0] = currXY[0] - Math.sqrt(3)/2
                nextXY[1] = currXY[1] + 0
            } else if (i == 5) {
                nextXY[0] = currXY[0] - Math.sqrt(3) / 4
                nextXY[1] = currXY[1] + 3 / 4
            }
            xys[map[currI][i]] = nextXY
        }
    }
    return [minXY, maxXY, xys]
}

function hexagons_links(map, canvas, ctx, scale=18) {
    const infoXY = hexagons_getInfoXY(map)
    const minXY = infoXY[0]
    const maxXY = infoXY[1]
    const xys = infoXY[2]
    const bots = []
    const lefts = []
    const tops = []
    for (let i = 0; i < map.length; i++) {
        if (map[i][0] != -1 && map[i][3] == -1) {
            tops.push(i)
        }
        if (map[i][1] != -1 && map[i][4] == -1) {
            lefts.push(i)
        }
        if (map[i][2] != -1 && map[i][5] == -1) {
            bots.push(i)
        }
    }
    ctx.lineWidth = 4
    const arrs = [tops, lefts, bots]
    const colors = ["green", "purple", "red"]
    for (let i = 0; i < 3; i++) {
        ctx.strokeStyle = colors[i]
        const arr = arrs[i]
        for (let j = 0; j < arr.length; j++) {
            let curr = arr[j]
            while (map[curr][i] != -1) {
                const next = map[curr][i]
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
    return
}


function hexagons_get_clicked(map, clickXY, canvas, scale) {
    const infoXY = hexagons_getInfoXY(map)
    const minXY = infoXY[0]
    const maxXY = infoXY[1]
    const xyIs = infoXY[2]
    let rtn = -1
    for (let i = 0; i < map.length; i++) {
        const xy = shapes_getXY_fromMinMax(xyIs[i], minXY, maxXY, canvas, scale)
        const dx = clickXY[0]-xy[0]
        const dy = clickXY[1]-xy[1]
        if (dx*dx + dy*dy < (scale*scale)*0.5) {
            rtn = i
        }
    }
    return rtn
}

function hexagons_draw(map, canvas, ctx, highlighted=null, scale=18) {
    const infoXY = hexagons_getInfoXY(map)
    const minXY = infoXY[0]
    const maxXY = infoXY[1]
    const xys = infoXY[2]
    ctx.lineWidth = 1
    ctx.strokeStyle = "black"
    for (let i = 0; i < map.length; i++) {
        const xy = shapes_getXY_fromMinMax(xys[i], minXY, maxXY, canvas, scale)
        ctx.beginPath()
        ctx.moveTo(xy[0], xy[1] + scale)
        ctx.lineTo(xy[0] + scale*Math.sqrt(3)/2, xy[1] + scale*0.5)
        ctx.lineTo(xy[0] + scale*Math.sqrt(3)/2, xy[1]-scale*0.5)
        ctx.lineTo(xy[0], xy[1] - scale)
        ctx.lineTo(xy[0] - scale*Math.sqrt(3)/2, xy[1]-scale*0.5)
        ctx.lineTo(xy[0] - scale*Math.sqrt(3)/2, xy[1]+scale*0.5)
        ctx.lineTo(xy[0], xy[1] + scale)
        //ctx.arc(xy[0], xy[1], scale, 0, 2*Math.PI)
        ctx.fillStyle = (highlighted && highlighted.indexOf(i) != -1) ? "#555555" : "#cccccc" 
        ctx.fill()
        ctx.stroke()
    }
    hexagons_links(map, canvas, ctx, scale)
}