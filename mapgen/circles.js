
function circles_generate_full(stop=64) {
    const map = []
    const sideLen = Math.ceil(Math.sqrt(stop))
    for (let row = 0; row < sideLen; row++) {
        for (let col = 0; col < sideLen; col++) {
            const curr = row * sideLen + col
            const top = row == sideLen - 1
            const right = col == sideLen - 1
            const bot = row == 0
            const left = col == 0
            map.push([
                top ? -1 : curr + sideLen, 
                top || right ? -1 : curr + sideLen + 1,
                right ? -1 : curr + 1,
                right || bot ? -1 : curr - sideLen + 1,
                bot ? -1 : curr - sideLen,
                bot || left ? -1 : curr - sideLen - 1,
                left ? -1 : curr - 1,
                left || top ? -1 : curr + sideLen - 1,
            ])
        }
    }

    return map
}
const CR = 0.4
function circles_getInfoXY(map) {
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
            const d = i % 2 ? Math.sqrt(2) : 1
            nextXY[0] = currXY[0] + d*Math.cos(Math.PI*2*i/8)
            nextXY[1] = currXY[1] + d*Math.sin(Math.PI*2*i/8)
            xys[map[currI][i]] = nextXY
        }
    }
    return [minXY, maxXY, xys]
}

function circles_get_clicked(map, clickXY, canvas, scale) {
    const infoXY = circles_getInfoXY(map)
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

function circles_links(map, canvas, ctx, scale=18) {
    const infoXY = circles_getInfoXY(map)
    const minXY = infoXY[0]
    const maxXY = infoXY[1]
    const xys = infoXY[2]
    const bots = []
    const botCorners = []
    const lefts = []
    const topCorners = []
    for (let i = 0; i < map.length; i++) {
        if (map[i].length == 8) {
            if (map[i][4] == -1 && map[i][0] != -1) {
                bots.push(i)
            }
            if (map[i][6] == -1 && map[i][2] != -1) {
                lefts.push(i)
            }
            if (map[i][5] == -1 && map[i][1] != -1) {
                botCorners.push(i)
            }
            if (map[i][7] == -1 && map[i][3] != -1) {
                topCorners.push(i)
            }
        } else {
            if (map[i][2] == -1 && map[i][0] != -1) {
                botCorners.push(i)
            } 
            if (map[i][3] == -1 && map[i][1] != -1) {
                topCorners.push(i)
            }
        }
    }
    ctx.lineWidth = 4
    const arrs = [bots, botCorners, lefts, topCorners]
    const colors = ["green", "purple", "red", "blue"]
    function getNextI(map, i, curr) {
        if (map[curr].length == 8) {
            return i
        }
        return i == 1 ? 0 : 1
    }
    for (let i = 0; i < 4; i++) {
        ctx.strokeStyle = colors[i]
        const arr = arrs[i]
        for (let j = 0; j < arr.length; j++) {
            let curr = arr[j]
            let nextI = getNextI(map, i, curr)
            while (map[curr][nextI] != -1) {
                const next = map[curr][nextI]
                const currXY = shapes_getXY_fromMinMax(xys[curr], minXY, maxXY, canvas, scale)
                const nextXY = shapes_getXY_fromMinMax(xys[next], minXY, maxXY, canvas, scale)
                ctx.beginPath()
                ctx.moveTo(currXY[0], currXY[1])
                ctx.lineTo(nextXY[0], nextXY[1])
                ctx.stroke()
                curr = next
                nextI = getNextI(map, i, curr)
            }
        }
    }
    return
}

function circles_draw(map, canvas, ctx, highlighted=null, scale=18) {
    const infoXY = circles_getInfoXY(map)
    const minXY = infoXY[0]
    const maxXY = infoXY[1]
    const xys = infoXY[2]
    ctx.lineWidth = 1
    ctx.strokeStyle = "black"
    for (let i = 0; i < map.length; i++) {
        const xy = shapes_getXY_fromMinMax(xys[i], minXY, maxXY, canvas, scale)
        ctx.beginPath()
        ctx.arc(xy[0], xy[1], scale, 0, 2*Math.PI)
        //ctx.arc(xy[0], xy[1], scale, 0, 2*Math.PI)
        ctx.fillStyle = (highlighted && highlighted.indexOf(i) != -1) ? "#555555" : "#cccccc" 
        ctx.fill()
        ctx.stroke()
    }
    circles_links(map, canvas, ctx, scale)
}