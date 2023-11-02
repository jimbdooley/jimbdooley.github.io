
function hesqs_generate_full(stop=36) {
    const map = []
    const sideLen = Math.ceil(Math.sqrt(stop))
    for (let row = 0; row < sideLen; row++) {
        for (let col = 0; col < sideLen; col++) {
            const curr = 4 * (row * sideLen + col)
            map.push([
                curr + 1, curr + 2, curr + 3,
                row > 0 ? curr - 4 * sideLen + 1 : -1,
                col > 0 ? curr - 4 + 2 : -1,
                row < sideLen - 1 && col > 0 ? curr + 4 * (sideLen-1) + 3 : -1,
                0
            ])
            map.push([row < sideLen - 1 ? curr + 4*sideLen : -1, curr, 1])
            map.push([col < sideLen - 1 ? curr + 4 : -1, curr, 2])
            map.push([row > 0 && col < sideLen - 1 ? curr - 4*(sideLen-1) : -1, curr, 3])
        }
    }
    
    return map
}

function hesqs_trim(map, list) {
    sortBubble(list)
    for (const el of list) {
        for (let i = 0; i < map[el].length-1; i++) {
            if (list.indexOf(map[el][i]) != -1) continue
            map[el][i] = -1
        }
    }
    const newMap = []
    for (const el of list) {
        newMap.push(map[el])
    }
    for (const el of newMap) {
        for (let i = 0; i < el.length-1; i++) {
            if (el[i] == -1) continue
            el[i] = list.indexOf(el[i])
        }
    }
    return newMap
}

function hesqs_getInfoXY(map) {
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
        for (let i = 0; i < map[currI].length - 1; i++) {
            if (map[currI][i] == -1) continue
            if (map[currI][i] in visited) continue
            queue.push(map[currI][i])
            visited[map[currI][i]] = 1
            const nextXY = [0, 0]
            if (map[currI][map[currI].length-1] == 0) {
                const th = (1-i)*Math.PI/3
                nextXY[0] = currXY[0] + (Math.sqrt(3)+1)*Math.cos(th)/4
                nextXY[1] = currXY[1] + (Math.sqrt(3)+1)*Math.sin(th)/4
            } else if (map[currI][map[currI].length-1] == 1) {
                const th = Math.PI/3 - i*Math.PI
                nextXY[0] = currXY[0] + (Math.sqrt(3)+1)*Math.cos(th)/4
                nextXY[1] = currXY[1] + (Math.sqrt(3)+1)*Math.sin(th)/4
            } else if (map[currI][map[currI].length-1] == 2) {
                const th = - i*Math.PI
                nextXY[0] = currXY[0] + (Math.sqrt(3)+1)*Math.cos(th)/4
                nextXY[1] = currXY[1] + (Math.sqrt(3)+1)*Math.sin(th)/4
            } else if (map[currI][map[currI].length-1] == 3) {
                const th = -Math.PI/3  - i*Math.PI
                nextXY[0] = currXY[0] + (Math.sqrt(3)+1)*Math.cos(th)/4
                nextXY[1] = currXY[1] + (Math.sqrt(3)+1)*Math.sin(th)/4
            }
            xys[map[currI][i]] = nextXY
        }
    }
    return [minXY, maxXY, xys]
}


function hesqs_links(map, canvas, ctx, scale=18) {
    const infoXY = hesqs_getInfoXY(map)
    const minXY = infoXY[0]
    const maxXY = infoXY[1]
    const xys = infoXY[2]
    const bots = []
    const lefts = []
    const tops = []
    for (let i = 0; i < map.length; i++) {
        const j = map[i][map[i].length - 1]
        if (j == 0) {
            if (map[i][3] == -1 && map[i][0] != -1) {
                bots.push(i)
            }
            if (map[i][4] == -1 && map[i][1] != -1) {
                lefts.push(i)
            }
            if (map[i][5] == -1 && map[i][2] != -1) {
                tops.push(i)
            }
        } else if (j == 1) {
            if (map[i][1] == -1 && map[i][0] != -1) {
                bots.push(i)
            }
        } else if (j == 2) {
            if (map[i][1] == -1 && map[i][0] != -1) {
                lefts.push(i)
            }
        } else if (j == 3) {
            if (map[i][1] == -1 && map[i][0] != -1) {
                tops.push(i)
            }
        }
    }
    ctx.lineWidth = 4
    const strokeStyles = ["green", "red", "blue"]
    const arrs = [bots, lefts, tops]
    for (let h = 0; h < 3; h++) {
        ctx.strokeStyle = strokeStyles[h]
        for (let i = 0; i < arrs[h].length; i++) {
            let curr = arrs[h][i]
            let nextI = map[curr][map[curr].length - 1] == 0 ? h : 0
            while (map[curr][nextI] != -1) {
                const next = map[curr][nextI]
                const currXY = shapes_getXY_fromMinMax(xys[curr], minXY, maxXY, canvas, scale)
                const nextXY = shapes_getXY_fromMinMax(xys[next], minXY, maxXY, canvas, scale)
                ctx.beginPath()
                ctx.moveTo(currXY[0], currXY[1])
                ctx.lineTo(nextXY[0], nextXY[1])
                ctx.stroke()
                curr = next
                nextI = map[curr][map[curr].length - 1] == 0 ? h : 0
            }
        }
    }
}

function hesqs_get_clicked(map, clickXY, canvas, scale) {
    const infoXY = hesqs_getInfoXY(map)
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

function hesqs_draw(map, canvas, ctx, highlighted=null, scale=18) {
    const infoXY = hesqs_getInfoXY(map)
    const minXY = infoXY[0]
    const maxXY = infoXY[1]
    const xys = infoXY[2]
    ctx.lineWidth = 1
    ctx.strokeStyle = "black"
    for (let i = 0; i < map.length; i++) {
        ctx.fillStyle = (highlighted && highlighted.indexOf(i) != -1) ? "#555555" : "#cccccc" 
        const xy = shapes_getXY_fromMinMax(xys[i], minXY, maxXY, canvas, scale)
        ctx.beginPath() 
        if (map[i][map[i].length-1] == 0) {
             ctx.moveTo(xy[0], xy[1] + scale)
             ctx.lineTo(xy[0] + scale*Math.sqrt(3)/2, xy[1] + scale / 2)
             ctx.lineTo(xy[0] + scale*Math.sqrt(3)/2, xy[1] - scale / 2)
             ctx.lineTo(xy[0], xy[1] - scale)
             ctx.lineTo(xy[0] - scale*Math.sqrt(3)/2, xy[1] - scale / 2)
             ctx.lineTo(xy[0] - scale*Math.sqrt(3)/2, xy[1] + scale / 2)
             ctx.lineTo(xy[0], xy[1] + scale)
        } else {
            const j = map[i][map[i].length-1]
            const d = (scale/2) * Math.sqrt(2)
            const th0 = Math.PI/4 - (2-j)*Math.PI/3
            ctx.beginPath()
            ctx.moveTo(xy[0]+d*Math.cos(th0), xy[1]+d*Math.sin(th0))
            ctx.lineTo(xy[0]+d*Math.cos(th0+0.5*Math.PI), xy[1]+d*Math.sin(th0+0.5*Math.PI))
            ctx.lineTo(xy[0]+d*Math.cos(th0+1.0*Math.PI), xy[1]+d*Math.sin(th0+1.0*Math.PI))
            ctx.lineTo(xy[0]+d*Math.cos(th0+1.5*Math.PI), xy[1]+d*Math.sin(th0+1.5*Math.PI))
            ctx.lineTo(xy[0]+d*Math.cos(th0+0.0*Math.PI), xy[1]+d*Math.sin(th0+0.0*Math.PI))
        }
        ctx.fill()
        ctx.stroke()
    }
    hesqs_links(map, canvas, ctx, scale)
}