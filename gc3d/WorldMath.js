const mouseClickXYZ = [0, 0, 0]
function clickWithinRadius(mx, my, dob, r){
    setWorldXYZFromDeviceXY(mouseClickXYZ, mx, my, dob.z)
    const dx = mouseClickXYZ[0] - dob.x
    const dy = mouseClickXYZ[1] - dob.y
    return Math.sqrt(dx*dx+dy*dy) < r
}


const worldMouseXY = [0, 0, 0]
function clickWithinMapSpot(mx, my, corners, l=false) {
    setWorldXYZFromDeviceXY(worldMouseXY, mx, my, BOARD_Z)
    var lt0 = 0
    var gt0 = 0
    for (let i = 0; i < corners.length; i++) {
        const j = (i + 1) % corners.length
        const v0x = corners[i][0] - worldMouseXY[0]
        const v0y = corners[i][1] - worldMouseXY[1]
        const v1x = corners[i][0] - corners[j][0]
        const v1y = corners[i][1] - corners[j][1]
        lt0 += 0 < v0x*v1y - v1x*v0y ? 1 : 0
        gt0 += 0 < v0x*v1y - v1x*v0y ? 0 : 1
    }
    return lt0 == corners.size || gt0 == corners.length
}

function fitMap(map, region) {
    const mapW = (map.minXYMaxXY[2] - map.minXYMaxXY[0]) / map.mmScale
    const mapH = (map.minXYMaxXY[3] - map.minXYMaxXY[1]) / map.mmScale
    let maxScale = null
    if (isTablet) {
        maxScale = World_gc.viewWidth > World_gc.viewHeight ? 0.7 * map.mapType.maxScale : 0.95
    } else {
        maxScale = map.mapType.maxScale
    }
    const mapScale = mapW/mapH < region[2]/region[3]
        ? Math.min(maxScale, yDistFromZAndDeviceRegion(BOARD_Z, region) / mapH)
        : Math.min(maxScale, xDistFromZAndDeviceRegion(BOARD_Z, region) / mapW)
    const gemMapW = (map.gemMinXYMaxXY[2] - map.gemMinXYMaxXY[0]) / map.gmmScale
    const gemMapH = (map.gemMinXYMaxXY[3] - map.gemMinXYMaxXY[1]) / map.gmmScale
    const gemMapScale = gemMapW/gemMapH < region[2]/region[3]
        ? Math.min(maxScale, yDistFromZAndDeviceRegion(GEM_Z, region) / gemMapH)
        : Math.min(maxScale, xDistFromZAndDeviceRegion(GEM_Z, region) / gemMapW)
    map.loadMap(mapScale, gemMapScale)
    const centerRegion = [0, 0, 0]
    setWorldXYZFromDeviceXY(centerRegion,
        region[0] + 0.5 * region[2],
        region[1] + 0.5 * region[3],
        BOARD_Z
    )
    const dx = centerRegion[0] - 0.5*(map.minXYMaxXY[0] + map.minXYMaxXY[2])
    const dy = centerRegion[1] - 0.5*(map.minXYMaxXY[1] + map.minXYMaxXY[3])
    for (const spot of map.spots) {
        spot.x += dx
        spot.y += dy
        spot.z = BOARD_Z
    }
    setWorldXYZFromDeviceXY(centerRegion,
        region[0] + 0.5 * region[2],
        region[1] + 0.5 * region[3],
        GEM_Z
    )
    const dxGem = centerRegion[0] - 0.5*(map.gemMinXYMaxXY[0] + map.gemMinXYMaxXY[2])
    const dyGem = centerRegion[1] - 0.5*(map.gemMinXYMaxXY[1] + map.gemMinXYMaxXY[3])
    for (const gemSpot of map.gemSpots) {
        gemSpot[0] += dxGem
        gemSpot[1] += dyGem
        gemSpot[2] = GEM_Z
    }
    for (const corners of map.corners) {
        for (const corner of corners) {
            corner[0] += dx
            corner[1] += dy
        }
    }
    map.minXYMaxXY[0] += dx
    map.minXYMaxXY[1] += dy
    map.minXYMaxXY[2] += dx
    map.minXYMaxXY[3] += dy
}

function _mouseInRegion(mx, my, x, y, dx, dy) {
    return (x <= mx) && (mx <= x + dx) && (y <= my) && (my <= y + dy)
}

function mouseInRegion(mx, my, region) {
    return _mouseInRegion(mx, my, region[0], region[1], region[2], region[3])
}

function setWorldXYZFromDeviceXY(target, devX, devY, worldZ) {
    const pct_dxy = (CAM_Z_GC - worldZ) / CAM_Z_GC
    const _dy = pct_dxy * World_gc.dy
    const _dx = pct_dxy * World_gc.dx
    target[0] = -_dx + 2.0 * _dx * devX / World_gc.viewWidth
    target[1] = _dy - 2.0 * _dy * devY / World_gc.viewHeight
    target[2] = worldZ
}

function setXYZSXSYFromRegionAndZ(o, region, z) {
    const pct_dxy = (CAM_Z_GC - z) / CAM_Z_GC
    const _dy = pct_dxy * World_gc.dy
    const _dx = pct_dxy * World_gc.dx
    const leftX = -_dx + 2.0 * _dx * region[0] / World_gc.viewWidth
    const rightX = -_dx + 2.0 * _dx * (region[0]+region[2]) / World_gc.viewWidth
    const topY = _dy - 2.0 * _dy * region[1] / World_gc.viewHeight
    const botY = _dy - 2.0 * _dy * (region[1]+region[3]) / World_gc.viewHeight
    o.x = 0.5 * (leftX + rightX)
    o.y = 0.5 * (topY + botY)
    o.z = z
    o.sx = 0.5 * (rightX - leftX)
    o.sy = 0.5 * (topY - botY)
}

function xDistFromZAndDeviceRegion(z, deviceRegion) {
    setWorldXYZFromDeviceXY(World_gc.dummyXYZ, deviceRegion[0], deviceRegion[1], z)
    const left = World_gc.dummyXYZ[0]
    setWorldXYZFromDeviceXY(World_gc.dummyXYZ, deviceRegion[0] + deviceRegion[2], deviceRegion[1], z)
    const right = World_gc.dummyXYZ[0]
    return right - left
}

function yDistFromZAndDeviceRegion(z, deviceRegion) {
    setWorldXYZFromDeviceXY(World_gc.dummyXYZ, deviceRegion[0], deviceRegion[1], z)
    const top = World_gc.dummyXYZ[1]
    setWorldXYZFromDeviceXY(World_gc.dummyXYZ, deviceRegion[0], deviceRegion[1] + deviceRegion[3], z)
    const bot = World_gc.dummyXYZ[1]
    return top - bot
}

const dummyRegionDistFromZAndScreenDist = [0, 0, 0, 0]
function distFromZAndScreenDist(z, screenDist) {
    dummyRegionDistFromZAndScreenDist[2] = screenDist
    return xDistFromZAndDeviceRegion(z, dummyRegionDistFromZAndScreenDist)
}