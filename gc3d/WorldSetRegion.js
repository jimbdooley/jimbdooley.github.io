

function World_gcSetRegions() {
    const bw = 0.025 * (World_gc.viewWidth > World_gc.viewHeight ? World_gc.viewHeight : World_gc.viewWidth)
    const menuBufferR = 0.1
    const skinnier = World_gc.viewWidth <= World_gc.viewHeight
    if (!isVerticalMode()) {
        World_gc.regionIntroIcon[0] = 0.25 * World_gc.viewWidth
        World_gc.regionIntroIcon[1] = bw
        World_gc.regionIntroIcon[2] = World_gc.viewWidth - 2 * World_gc.regionIntroIcon[0]
        World_gc.regionIntroIcon[3] = 0.68 * World_gc.viewHeight - 2 * bw
        World_gc.regionIntroGem[0] = bw
        World_gc.regionIntroGem[1] = bw
        World_gc.regionIntroGem[2] = World_gc.regionIntroIcon[0] - 2*bw
        World_gc.regionIntroGem[3] = World_gc.viewHeight - 2 * bw
        World_gc.regionIntroMenu[0] = World_gc.regionIntroIcon[0]
        World_gc.regionIntroMenu[1] = World_gc.regionIntroIcon[1] + World_gc.regionIntroIcon[3]
        World_gc.regionIntroMenu[2] = World_gc.regionIntroIcon[2]
        World_gc.regionIntroMenu[3] = World_gc.viewHeight - World_gc.regionIntroMenu[1] - bw
        World_gc.regionMenu[0] = World_gc.regionMap[2] + bw
        World_gc.regionMenu[1] = bw
        World_gc.regionMenu[2] = World_gc.viewWidth - 2 * bw - World_gc.regionMap[2]
        const targetMenuH = 0.09 * World_gc.viewWidth
        World_gc.regionMenu[3] = Math.min(targetMenuH, 0.15 * World_gc.regionMenu[2])
        const scoreH = Math.min(0.1 * (World_gc.regionMap[2] - 3*bw), 0.8*targetMenuH) + bw
        const preBufferHandX = World_gc.regionMenu[0] + World_gc.regionMenu[2] + bw
        const preBufferHandDx = World_gc.viewWidth - preBufferHandX - bw
        World_gc.regionScore[0] = World_gc.regionMenu[0]
        World_gc.regionScore[1] = World_gc.regionMenu[1] + World_gc.regionMenu[3]
        World_gc.regionScore[3] = scoreH
        World_gc.regionScore[2] = World_gc.regionMenu[2] - bw - World_gc.regionScore[3]
        World_gc.regionHand[0] = World_gc.regionMap[0] + World_gc.regionMap[2]
        World_gc.regionHand[1] = bw + World_gc.regionMenu[3] + World_gc.regionScore[3]
        World_gc.regionHand[2] = World_gc.regionMenu[2] + bw
        World_gc.regionHand[3] = World_gc.viewHeight - World_gc.regionHand[1]
        World_gc.regionMap[0] = 0
        World_gc.regionMap[1] = 0
        World_gc.regionMap[2] = 0.53 * World_gc.viewWidth
        World_gc.regionMap[3] = World_gc.viewHeight
        if (World_gc.viewHeight > World_gc.viewWidth - (World_gc.regionMap[0] + World_gc.regionMap[2])) {
            World_gc.regionBrickBot[1] = 0
            World_gc.regionBrickBot[3] = World_gc.viewHeight
            const cx = 0.5 * (World_gc.regionMap[0] + World_gc.regionMap[2] + World_gc.viewWidth)
            World_gc.regionBrickBot[0] = cx - 0.5 * World_gc.regionBrickBot[3]
            World_gc.regionBrickBot[2] = World_gc.regionBrickBot[3]
        } else {
            World_gc.regionBrickBot[0] = World_gc.regionMap[0] + World_gc.regionMap[2]
            World_gc.regionBrickBot[2] = World_gc.viewWidth - World_gc.regionBrickBot[0]
            World_gc.regionBrickBot[1] = 0.5 * World_gc.viewHeight - 0.5 * World_gc.regionBrickBot[2]
            World_gc.regionBrickBot[3] = World_gc.regionBrickBot[2]
        }
        World_gc.regionBrickTop[2] = 0
        World_gc.regionBrickTop[3] = 0
        setXYZSXSYFromRegionAndZ(World_gc.dobBrickTop, World_gc.regionBrickTop, BRICK_Z)

        setXYZSXSYFromRegionAndZ(World_gc.dobDisplayShade, World_gc.regionMap, SHADE_Z)
        const displayMenuShadeRegion = [World_gc.regionHand[0], 0, World_gc.viewWidth - World_gc.regionHand[0], World_gc.viewHeight]
        setXYZSXSYFromRegionAndZ(World_gc.dobDisplayMenuShade, displayMenuShadeRegion, SHADE_Z)
    }
    if (isVerticalMode()) {
        World_gc.regionIntroGem[0] = bw
        World_gc.regionIntroGem[1] = bw
        World_gc.regionIntroGem[2] = World_gc.viewWidth - 2 * bw
        World_gc.regionIntroGem[3] = 0.17 * World_gc.viewHeight
        World_gc.regionIntroIcon[0] = bw
        World_gc.regionIntroIcon[1] = World_gc.regionIntroGem[3] + 2 * bw
        World_gc.regionIntroIcon[2] = World_gc.viewWidth - 2 * bw
        World_gc.regionIntroIcon[3] = 0.36 * World_gc.viewHeight
        World_gc.regionIntroMenu[0] = bw
        World_gc.regionIntroMenu[1] = World_gc.regionIntroIcon[1] + World_gc.regionIntroIcon[3]
        World_gc.regionIntroMenu[2] = World_gc.viewWidth - 2 * bw
        World_gc.regionIntroMenu[3] = World_gc.viewHeight - 4*bw - 2*World_gc.regionIntroGem[3] - World_gc.regionIntroIcon[3]
        World_gc.regionIntroMenu[3] *= 0.85
        World_gc.regionMenu[0] = bw
        World_gc.regionMenu[1] = bw
        World_gc.regionMenu[2] = 1.0 * World_gc.viewWidth - 2.0 * bw
        const targetMenuH = 0.09 * World_gc.viewHeight
        World_gc.regionMenu[3] = Math.min(targetMenuH, 0.15 * World_gc.regionMenu[2])
        World_gc.regionScore[0] = bw
        World_gc.regionScore[1] = World_gc.regionMenu[3] + bw
        const targetScoreH = 0.8 * targetMenuH
        World_gc.regionScore[3] = Math.min(0.1 * World_gc.viewWidth, targetScoreH) + bw
        World_gc.regionScore[2] = World_gc.viewWidth - 2 * bw - targetScoreH
        World_gc.regionMap[0] = 0
        World_gc.regionMap[1] = World_gc.regionScore[1] + World_gc.regionScore[3]
        World_gc.regionMap[2] = 1.0 * World_gc.viewWidth
        World_gc.regionMap[3] = 0.5 * World_gc.viewHeight - 0.3 * World_gc.regionMenu[3]
        if (World_gc.viewHeight - (World_gc.regionMap[1] + World_gc.regionMap[3]) > World_gc.viewWidth) {
            World_gc.regionBrickBot[1] = World_gc.regionMap[1] + World_gc.regionMap[3]
            World_gc.regionBrickBot[3] = World_gc.viewHeight - World_gc.regionBrickBot[1]
            World_gc.regionBrickBot[0] = 0.5 * World_gc.viewWidth - 0.5 * World_gc.regionBrickBot[3]
            World_gc.regionBrickBot[2] = World_gc.regionMap[3]
        } else {
            World_gc.regionBrickBot[0] = 0
            World_gc.regionBrickBot[2] = World_gc.viewWidth
            const cy = 0.5 * (World_gc.viewHeight + World_gc.regionMap[1] + World_gc.regionMap[3])
            World_gc.regionBrickBot[1] = cy - 0.5 * World_gc.regionBrickBot[2]
            World_gc.regionBrickBot[3] = World_gc.regionBrickBot[2]
        }
        World_gc.regionBrickTop[2] = World_gc.viewWidth
        World_gc.regionBrickTop[1] = 0.5 * World_gc.regionMap[1] - 0.5 * World_gc.regionBrickTop[2]
        World_gc.regionBrickTop[3] = World_gc.regionBrickTop[2]
        const overhang = World_gc.regionBrickTop[1] + World_gc.regionBrickTop[3] - (World_gc.regionMap[1] + World_gc.regionMap[3])
        if (overhang > 0) World_gc.regionBrickTop[1] -= (3 + overhang)
        setXYZSXSYFromRegionAndZ(World_gc.dobBrickTop, World_gc.regionBrickTop, BRICK_Z + 0.1)
        World_gc.regionHand[0] = 0
        World_gc.regionHand[1] = World_gc.regionMap[1] + World_gc.regionMap[3]
        World_gc.regionHand[2] = World_gc.viewWidth
        World_gc.regionHand[3] = World_gc.viewHeight - World_gc.regionHand[1] - bw
        //val displayShadeRegion = floatArrayOf(0f, World_gc.regionScore[1], World_gc.viewWidth, World_gc.regionScore[3] + World_gc.regionMap[3])
        const displayShadeRegion = [0, 0, World_gc.viewWidth, World_gc.regionScore[1] + World_gc.regionScore[3] + World_gc.regionMap[3]]
        setXYZSXSYFromRegionAndZ(World_gc.dobDisplayShade, displayShadeRegion, SHADE_Z)
        const displayMenuShadeRegion = [0, World_gc.regionHand[1], World_gc.viewWidth, World_gc.viewHeight - World_gc.regionHand[1]]
        setXYZSXSYFromRegionAndZ(World_gc.dobDisplayMenuShade, displayMenuShadeRegion, SHADE_Z)
    }
    World_gc.regionSettings[0] = World_gc.regionMenu[0] + World_gc.regionMenu[2] - World_gc.regionMenu[3]
    World_gc.regionSettings[1] = World_gc.regionMenu[1]
    World_gc.regionSettings[2] = World_gc.regionMenu[3]
    World_gc.regionSettings[3] = World_gc.regionMenu[3]
    World_gc.regionHome[0] = World_gc.regionMenu[0]
    World_gc.regionHome[1] = World_gc.regionMenu[1]
    World_gc.regionHome[2] = World_gc.regionMenu[3]
    World_gc.regionHome[3] = World_gc.regionMenu[3]
    setXYZSXSYFromRegionAndZ(World_gc.dobGlobe, World_gc.regionHome, WIDGET_Z)
    setXYZSXSYFromRegionAndZ(World_gc.dobBrickBot, World_gc.regionBrickBot, BRICK_Z)
    World_gc.regionTutMap[0] = World_gc.regionMap[0]
    World_gc.regionTutMap[1] = World_gc.regionMap[1] + 0.33 * World_gc.regionMap[3]
    World_gc.regionTutMap[2] = World_gc.regionMap[2]
    World_gc.regionTutMap[3] = World_gc.regionMap[3] * 0.67
    World_gc.regionFlag[0] = World_gc.regionMenu[0] + World_gc.regionMenu[3] * (1 + menuBufferR)
    World_gc.regionFlag[1] = World_gc.regionMenu[1]
    World_gc.regionFlag[2] = World_gc.regionMenu[3]
    World_gc.regionFlag[3] = World_gc.regionMenu[3]


    World_gc.regionPickaxeInstruction[0] = World_gc.regionHand[0] + 0.05 * World_gc.regionHand[2]
    World_gc.regionPickaxeInstruction[1] = World_gc.regionHand[1] + 0.15 * World_gc.regionHand[3]
    World_gc.regionPickaxeInstruction[2] = World_gc.regionHand[2] * 0.9
    World_gc.regionPickaxeInstruction[3] = 0.3 * World_gc.regionHand[3]


    World_gc.regionBranding[0] = World_gc.regionPickaxeInstruction[0] + 0.1 * World_gc.regionPickaxeInstruction[3]
    World_gc.regionBranding[1] = World_gc.regionPickaxeInstruction[1] + 0.1 * World_gc.regionPickaxeInstruction[3]
    World_gc.regionBranding[2] = World_gc.regionPickaxeInstruction[3] * 0.8
    World_gc.regionBranding[3] = World_gc.regionPickaxeInstruction[3] * 0.8
    
    const starDummyXYZ = [0, 0, 0]
    const mapCenterX = World_gc.regionMap[0] + 0.5 * World_gc.regionMap[2]
    const mapCenterY = World_gc.regionMap[1] + 0.5 * World_gc.regionMap[3]
    const starRR = 0.15 * Math.min(World_gc.regionMap[2], World_gc.regionMap[3])
    const starDisplayAreaR = 0.45 * Math.min(World_gc.regionMap[2], World_gc.regionMap[3]) - starRR
    const ths = [0.5 * Math.PI, 0.1 * Math.PI, 0.9*Math.PI, 1.7 * Math.PI, 1.3 * Math.PI]
    for (let i = 0; i < 5; i++) {
        setWorldXYZFromDeviceXY(starDummyXYZ, mapCenterX + starDisplayAreaR*Math.cos(ths[i]), mapCenterY - starDisplayAreaR*Math.sin(ths[i]), SHADE_Z + 0.1)
        World_gc.dobsStarShadow[i].x = starDummyXYZ[0]
        World_gc.dobsStarShadow[i].y = starDummyXYZ[1]
        World_gc.dobsStarShadow[i].z = starDummyXYZ[2]
        World_gc.dobsStarShadow[i].scale = distFromZAndScreenDist(SHADE_Z + 0.1, starRR)
        setWorldXYZFromDeviceXY(starDummyXYZ, mapCenterX + starDisplayAreaR*Math.cos(ths[i]), mapCenterY - starDisplayAreaR*Math.sin(ths[i]), SHADE_Z + 1.1)
        World_gc.dobsStar[i].x = starDummyXYZ[0]
        World_gc.dobsStar[i].y = starDummyXYZ[1]
        World_gc.dobsStar[i].z = starDummyXYZ[2]
    }
    World_gc.dobsStarScaleOrig  = 1.1 * distFromZAndScreenDist(SHADE_Z + 1.1, starRR)

    setWorldXYZFromDeviceXY(World_gc.offscreenXYZ,
        World_gc.regionHand[0] + World_gc.regionHand[2],
        World_gc.regionHand[1] + 0.5 * World_gc.regionHand[3],
        GEM_Z)
    World_gc.offscreenXYZ[0] += 2

    while (World_gc.dobsBorder.length > 0) World_gc.dobsBorder.pop()
    if (!isVerticalMode()) {
        const d = 0.5 * (World_gc.viewWidth - World_gc.regionHand[0] - World_gc.regionHand[2])
        World_gc.regionHand[0] += d
        const regionBB = [World_gc.regionMap[0] + World_gc.regionMap[2], 0, d, World_gc.viewHeight]
        World_gc.dobsBorder.push(DisplayObject())
        setXYZSXSYFromRegionAndZ(World_gc.dobsBorder[0], regionBB, SCENE_0 + 0.1)
    } else {
        const d = 0.5 * (World_gc.viewHeight - World_gc.regionHand[1] - World_gc.regionHand[3])
        World_gc.regionHand[1] += d
        World_gc.dobsBorder.push(DisplayObject())
        const regionBB = [0, World_gc.regionMap[1] + World_gc.regionMap[3], World_gc.viewWidth, d]
        setXYZSXSYFromRegionAndZ(World_gc.dobsBorder[0], regionBB, SCENE_0 + 0.1)
        World_gc.dobsBorder.push(DisplayObject())
        const regionBB2 = [0, World_gc.regionMap[1] - d, World_gc.viewWidth, d]
        setXYZSXSYFromRegionAndZ(World_gc.dobsBorder[1], regionBB2, SCENE_0 + 0.1)
    }

    if (World_gc.viewWidth > World_gc.viewHeight) World_gc.regionScore[3] *= 0.85
    World_gc.regionIntroIcon[3] += World_gc.regionIntroMenu[3]
}
