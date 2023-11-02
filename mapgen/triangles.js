
function triangles_generate_full(stop=100) {
    const map = []
    let sideLen = Math.ceil(Math.sqrt(stop))
    sideLen += sideLen % 2
    for (let row = 0; row < sideLen; row++) {
        for (let col = 0; col < sideLen; col++) {
            const curr = row * sideLen + col
            if ((row + col) % 2 == 0) {
                map.push([
                    col < sideLen -1 ? curr + 1 : -1,
                    row > 0 ? curr - sideLen : -1,
                    col > 0 ? curr - 1 : -1,
                    0,
                ])
            } else {
                map.push([
                    row < sideLen - 1 ? curr + sideLen : -1,
                    col < sideLen - 1 ? curr + 1 : -1,
                    col > 0 ? curr -  1 : -1,
                    1,
                ])
            }
        }
    }

    return map
}

function triangles_links(map, canvas, ctx, scale=18) {
    const infoXY = triangles_getInfoXY(map)
    const minXY = infoXY[0]
    const maxXY = infoXY[1]
    const xys = infoXY[2]
    const tops = []
    const lefts = []
    const bots = []
    for (let i = 0; i < map.length; i++) {
        if (map[i][3] == 0) {
            if (map[i][2] == -1 && map[i][1] != -1 && map[map[i][1]][1] != -1) {
                tops.push(i)
            }
            if (map[i][2] == -1 && map[i][0] != -1 && map[map[i][0]][1] != -1) {
                lefts.push(i)
            }
            if (map[i][1] == -1 && map[i][0] != -1 && map[map[i][0]][0] != -1) {
                bots.push(i)
            }
        } else {
            if (map[i][0] == -1 && map[i][1] != -1 && map[map[i][1]][1] != -1) {
                tops.push(i)
            }
            if (map[i][2] == -1 && map[i][1] != -1 && map[map[i][1]][0] != -1) {
                lefts.push(i)
            }
            if (map[i][2] == -1 && map[i][0] != -1 && map[map[i][0]][0] != -1) {
                bots.push(i)
            }
        }
    }
    ctx.lineWidth = 4
    ctx.strokeStyle = "#ff9999"
    for (let i = 0; i < tops.length; i++) {
        let curr = tops[i]
        let currXY = shapes_getXY_fromMinMax(xys[curr], minXY, maxXY, canvas, scale)
        ctx.beginPath()
        ctx.moveTo(currXY[0]+2, currXY[1]+2)
        while (map[curr][1] != -1) {
            const next = map[curr][1]
            const nextXY = shapes_getXY_fromMinMax(xys[next], minXY, maxXY, canvas, scale)
            ctx.lineTo(nextXY[0]+2, nextXY[1]+2)
            curr = next
        }
        ctx.stroke()
    }
    ctx.strokeStyle = "#9999ff"
    for (let i = 0; i < bots.length; i++) {
        let curr = bots[i]
        let currXY = shapes_getXY_fromMinMax(xys[curr], minXY, maxXY, canvas, scale)
        ctx.beginPath()
        ctx.moveTo(currXY[0]-2, currXY[1]-2)
        while (map[curr][0] != -1) {
            const next = map[curr][0]
            const nextXY = shapes_getXY_fromMinMax(xys[next], minXY, maxXY, canvas, scale)
            ctx.lineTo(nextXY[0]-2, nextXY[1]-2)
            curr = next
        }
        ctx.stroke()
    }
    ctx.lineWidth = 2
    ctx.strokeStyle = "green"
    for (let i = 0; i < lefts.length; i++) {
        let curr = lefts[i]
        let currXY = shapes_getXY_fromMinMax(xys[curr], minXY, maxXY, canvas, scale)
        ctx.beginPath()
        ctx.moveTo(currXY[0], currXY[1])
        while (
            (map[curr][3] == 0 && map[curr][0] != -1) || 
            (map[curr][3] == 1 && map[curr][1] != -1)
        ) {
            const next = map[curr][3] == 0 ? map[curr][0] : map[curr][1]
            const nextXY = shapes_getXY_fromMinMax(xys[next], minXY, maxXY, canvas, scale)
            ctx.lineTo(nextXY[0], nextXY[1])
            curr = next
        }
        ctx.stroke()
    }
}

function triangles_trim(map, list) {
    sortBubble(list)
    console.log(list)
    for (const el of list) {
        console.log(`checking ${JSON.stringify(map[el])}`)
        for (let i = 0; i < map[el].length - 1; i++) {
            if (list.indexOf(map[el][i]) != -1) continue
            map[el][i] = -1
        }
        console.log(`done ${JSON.stringify(map[el])}`)
    }
    const newMap = []
    for (const el of list) {
        newMap.push(map[el])
    }
    console.log(JSON.stringify(newMap))
    for (const el of newMap) {
        for (let i = 0; i < el.length-1; i++) {
            if (el[i] == -1) continue
            el[i] = list.indexOf(el[i])
        }
    }
    console.log(newMap)
    return newMap
}

function triangles_getInfoXY(map) {
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
        for (let i = 0; i < 3; i++) {
            if (map[currI][i] == -1) continue
            if (map[currI][i] in visited) continue
            queue.push(map[currI][i])
            visited[map[currI][i]] = 1
            const nextXY = [0, 0]
            if (map[currI][3] == 0) {
                if (i == 0) {
                    nextXY[0] = currXY[0] + 0.5
                    nextXY[1] = currXY[1]
                } else if (i == 1) {
                    nextXY[0] = currXY[0]
                    nextXY[1] = currXY[1] + Math.sqrt(3) / 2
                } else if (i == 2) {
                    nextXY[0] = currXY[0] - 0.5
                    nextXY[1] = currXY[1]
                }
            } else {
                if (i == 0) {
                    nextXY[0] = currXY[0] 
                    nextXY[1] = currXY[1] + Math.sqrt(3) / 2
                } else if (i == 1) {
                    nextXY[0] = currXY[0] + 0.5
                    nextXY[1] = currXY[1]
                } else if (i == 2) {
                    nextXY[0] = currXY[0] - 0.5
                    nextXY[1] = currXY[1]
                }
            }
            xys[map[currI][i]] = nextXY
        }
    }
    return [minXY, maxXY, xys]
}

function triangles_draw(map, canvas, ctx, highlighted=null, scale=18) {
    const infoXY = triangles_getInfoXY(map)
    const minXY = infoXY[0]
    const maxXY = infoXY[1]
    const xys = infoXY[2]
    ctx.lineWidth = 1
    ctx.strokeStyle = "black"
    ctx.fillStyle = "#777777"
    for (let i = 0; i < map.length; i++) {
        const xy = shapes_getXY_fromMinMax(xys[i], minXY, maxXY, canvas, scale)
        ctx.beginPath()
        if (map[i][3] == 1) {
            ctx.moveTo(xy[0] - scale, xy[1] - Math.sqrt(3) * scale/2)
            ctx.lineTo(xy[0], xy[1] + Math.sqrt(3) * scale/2)
            ctx.lineTo(xy[0] + scale, xy[1] - Math.sqrt(3) * scale/2)
            ctx.lineTo(xy[0] - scale, xy[1] - Math.sqrt(3) * scale/2)

        } else {
            ctx.moveTo(xy[0] - scale, xy[1] + Math.sqrt(3) * scale/2)
            ctx.lineTo(xy[0], xy[1] - Math.sqrt(3) * scale/2)
            ctx.lineTo(xy[0] + scale, xy[1] + Math.sqrt(3) * scale/2)
            ctx.lineTo(xy[0] - scale, xy[1] + Math.sqrt(3) * scale/2)
        }
        ctx.fillStyle = (highlighted && highlighted.indexOf(i) != -1) ? "#555555" : "#cccccc" 
        ctx.fill()
        ctx.stroke()
    }
    triangles_links(map, canvas, ctx, scale)
}

function triangles_get_clicked(map, clickXY, canvas, scale) {
    const infoXY = triangles_getInfoXY(map)
    const minXY = infoXY[0]
    const maxXY = infoXY[1]
    const xyIs = infoXY[2]
    let rtn = -1
    var closestDist = 10000;
    for (let i = 0; i < map.length; i++) {
        const xy = shapes_getXY_fromMinMax(xyIs[i], minXY, maxXY, canvas, scale)
        const dx = clickXY[0] - xy[0]
        const dy = clickXY[1] - xy[1]
        const dist = Math.sqrt(dx*dx + dy*dy)
        if (dist > 1.5*scale) continue
        if (dist < closestDist) {
            closestDist = dist
            rtn = i
        }
    }
    return rtn
}