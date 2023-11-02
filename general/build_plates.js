
function add_sphere_to_plates(gl, plates, verts, i, scale, N, pop=0) {
    if (pop) plates.pop()
    plates.push(getSphere(gl, N, scale, [
        verts[4*i], verts[4*i+1], verts[4*i+2]
    ]))
}

function point_inside_mesh(pni, p) {
    const lp2 = [p[0], p[1], p[2] + 1]
    const intersects = []
    for (let i = 0; i < pni.indArr.length; i += 3) {
        const i0 = 4*pni.indArr[i]
        const i1 = 4*pni.indArr[i+1]
        const i2 = 4*pni.indArr[i+2]

        const tpA = [pni.posArr[i0], pni.posArr[i0+1], pni.posArr[i0+2]]
        const tpB = [pni.posArr[i1], pni.posArr[i1+1], pni.posArr[i1+2]]
        const tpC = [pni.posArr[i2], pni.posArr[i2+1], pni.posArr[i2+2]]

        const xyAP = [p[0] - pni.posArr[i0], p[1] - pni.posArr[i0+1], 0]
        const xyBP = [p[0] - pni.posArr[i1], p[1] - pni.posArr[i1+1], 0]
        const xyCP = [p[0] - pni.posArr[i2], p[1] - pni.posArr[i2+1], 0]

        const xyAB = [pni.posArr[i1] - pni.posArr[i0], pni.posArr[i1+1] - pni.posArr[i0+1], 0]
        const xyBC = [pni.posArr[i2] - pni.posArr[i1], pni.posArr[i2+1] - pni.posArr[i1+1], 0]
        const xyCA = [pni.posArr[i0] - pni.posArr[i2], pni.posArr[i0+1] - pni.posArr[i2+1], 0]
        const dotA = cross(xyAP, xyAB)[2]
        const dotB = cross(xyBP, xyBC)[2]
        const dotC = cross(xyCP, xyCA)[2]
        const does_intersect = (dotA >= 0 && dotB >= 0 && dotC >= 0) || (dotA <= 0 && dotB <= 0 && dotC <= 0)
        if (!does_intersect) continue;
        const v1 = [tpB[0] - tpA[0], tpB[1] - tpA[1], tpB[2] - tpA[2]]
        const v2 = [tpC[0] - tpA[0], tpC[1] - tpA[1], tpC[2] - tpA[2]]
        const n = cross(v1, v2)
        intersects.push( linePlaneIntersect(n, tpA, p, lp2) )
    }
    let intersectionAboveOrAt = 0
    for (const intersection of intersects) {
        intersectionAboveOrAt += intersection[2] >= p[2] ? 1 : 0
    }
    // returns 1 if inside, 0 if not inside
    return intersectionAboveOrAt % 2
}


function getMulMat(thZ, thTilt) {
    const thZRot = [1, 0, 0, 0, 1, 0, 0, 0, 1]
    thZRot[0] = Math.cos(thZ)
    thZRot[1] = -Math.sin(thZ)
    thZRot[3] = Math.sin(thZ)
    thZRot[4] = Math.cos(thZ)
    const thZTilt = [1, 0, 0, 0, 1, 0, 0, 0, 1]
    thZTilt[0] = Math.cos(thTilt)
    thZTilt[2] = -Math.sin(thTilt)
    thZTilt[6] = Math.sin(thTilt)
    thZTilt[8] = Math.cos(thTilt)
    return mul3x3(thZRot, thZTilt)
}

function add_tube_to_plates(gl, plates, verts, el, scale, tN, pop=0) {
    
    if (pop) plates.pop()
    const dx = verts[4*el[0]] - verts[4*el[1]]
    const dy = verts[4*el[0]+1] - verts[4*el[1]+1]
    const dxy = Math.sqrt(dx*dx + dy*dy)
    const dz = verts[4*el[0]+2] - verts[4*el[1]+2]
    const thZ = dx == 0 && dy == 0 ? 0 : Math.atan(dy / dx)
    const thTilt = -Math.atan(dxy / dz)
    const m = getMulMat(thZ, thTilt)

    const d = Math.sqrt(dx*dx + dy*dy + dz*dz)
    const x = 0.5*(verts[4*el[0]] + verts[4*el[1]])
    const y = 0.5*(verts[4*el[0]+1] + verts[4*el[1]+1])
    const z = 0.5*(verts[4*el[0]+2] + verts[4*el[1]+2])
    plates.push(getCyl(gl, tN, scale, scale, 0.5*d, [x, y, z], m))
}

function pointA_lineBC_dist(A, B, C) { 
    // A is the point, B and C are on the line
    const d = [C[0] - B[0], C[1] - B[1], C[2] - B[2]]
    const distCB = Math.sqrt(d[0]*d[0] + d[1]*d[1] + d[2]*d[2])
    for (let i = 0; i < 3; i++) d[i] /= distCB
    const v = [A[0] - B[0], A[1] - B[1], A[2] - B[2]]
    const t = dot(v, d)
    const P = [B[0] + t*d[0], B[1] + t*d[1], B[2] + t*d[2]]
    const PA = [P[0]-A[0], P[1]-A[1], P[2]-A[2]]
    return Math.sqrt(PA[0]*PA[0] + PA[1]*PA[1] + PA[2]*PA[2])
}

function point_between_cylinder_caps(c1p, c2p, p) {
    const norm = [c2p[0] - c1p[0], c2p[1] - c1p[1], c2p[2] - c1p[2]]
    const c1v = [p[0] - c1p[0], p[1] - c1p[1], p[2] - c1p[2]]
    const c2v = [p[0] - c2p[0], p[1] - c2p[1], p[2] - c2p[2]]
    return dot(norm, c1v) * dot(norm, c2v) < 0
}

function makeIndToVertMap(indArr, vertArr) {
    const rtn = {}
    for (const ind of indArr) {
        rtn[ind] = [vertArr[ind*4], vertArr[ind*4+1], vertArr[ind*4+2]]
    }
    return rtn
}

function findDifs(m1, m2, ind) {
    let err = 0
    for (const _key in m1) {
        const key = parseInt(_key)
        if (key == ind) continue
        const key2 = key > ind ? key - 1 : key
        if (!(key2 in m2)) continue
        if (m1[key][0] != m2[key2][0] || m1[key][1] != m2[key2][1] || m1[key][2] != m2[key2][2]) {
            err = 1
        }
    }
    return err
}

function removeVertFromPNI(indI, pni) {
    let match = false
    const m1 = makeIndToVertMap(pni.indArr, pni.posArr)
    const ind = pni.indArr[indI]
    for (let i = 0; i < pni.indArr.length; i++) {
        if (i == indI) continue
        if (pni.indArr[i] == ind) match = true
    }
    if (match) {
        for (let i = indI; i < pni.indArr.length - 1; i++) {
            pni.indArr[i] = pni.indArr[i+1]
        }
    } else {
        for (let i = indI; i < pni.indArr.length - 1; i++) {
            pni.indArr[i] = pni.indArr[i+1]
        }
        for (let i = 0; i < pni.indArr.length; i++) {
            if (pni.indArr[i] > ind) pni.indArr[i] -= 1
        }
        for (let i = ind*4; i < pni.posArr.length -4; i++) {
            pni.posArr[i] = pni.posArr[i+4]
            pni.normArr[i] = pni.normArr[i+4]
        }

        for (let i = 0; i < 4; i++) {
            pni.posArr.pop()
            pni.normArr.pop()
        }
    }
    pni.indArr.pop()
    const m2 = makeIndToVertMap(pni.indArr, pni.posArr)
    return findDifs(m1, m2, match ? 999999999 : ind)
}

function insideCyl(cylPA, cylPB, r, sphPNI, i0I) {
    const i0 = 4*sphPNI.indArr[i0I]
    const p0 = [sphPNI.posArr[i0], sphPNI.posArr[i0+1], sphPNI.posArr[i0+2]]
    let inside = point_between_cylinder_caps(cylPA, cylPB, p0)
    inside &= 0.99 * r > pointA_lineBC_dist(p0, cylPA, cylPB)
    return inside
}

function insideACylinder(gemPNI, tubeList, r, sphPNI, i0I) {
    let inside = false
    for (const t of tubeList) {
        const tPA = [gemPNI.posArr[4*t[0]], gemPNI.posArr[4*t[0]+1], gemPNI.posArr[4*t[0]+2]]
        const tPB = [gemPNI.posArr[4*t[1]], gemPNI.posArr[4*t[1]+1], gemPNI.posArr[4*t[1]+2]]
        inside |= insideCyl(tPA, tPB, r, sphPNI, i0I)
    }
    return inside
}



function maxDistanceInMesh(pni) {
    function dist(verts, iA, iB, iC) {
        const AB = [verts[iA]-verts[iB], verts[iA+1]-verts[iB+1], verts[iA+2]-verts[iB+2],]
        const AC = [verts[iA]-verts[iC], verts[iA+1]-verts[iC+1], verts[iA+2]-verts[iC+2],]
        const BC = [verts[iB]-verts[iC], verts[iB+1]-verts[iC+1], verts[iB+2]-verts[iC+2],]
        const dAB = Math.sqrt(AB[0]*AB[0] + AB[1]*AB[1] + AB[2]*AB[2])
        const dAC = Math.sqrt(AC[0]*AC[0] + AC[1]*AC[1] + AC[2]*AC[2])
        const dBC = Math.sqrt(BC[0]*BC[0] + BC[1]*BC[1] + BC[2]*BC[2])
        return Math.max(dAB, Math.max(dAC, dBC))
    }
    let maxDist = 0
    for (let i = 0; i < pni.indArr.length; i += 3) {
        maxDist = Math.max(maxDist, dist(
            pni.posArr, 
            4*pni.indArr[i],
            4*pni.indArr[i+1],
            4*pni.indArr[i+2],
        ))
    }
    return maxDist
}

exp_mode = 0

function getPlatesBriolette(gl, gemPNI) {
    const plates = []
    const GS = 0.037
    const sN = 4
    const tN = 4
    const list = [0, 1, 3, 39, 75, 111, 147, 183, 219, 255, 291]
    for (let i = 0; i < list.length - 0; i++) {
     add_sphere_to_plates(gl, plates, gemPNI.posArr, list[i], GS, sN)
    }
    const numSpheres = plates.length
    const tubes = [[1, 0], [3, 1], [39, 3], [39, 75], [75, 111], [111, 147], [147, 183], [183, 219], [255, 219], [291, 255]]
    for (const tube of tubes) {
      add_tube_to_plates(gl, plates, gemPNI.posArr, tube, GS, tN)
    }
    const coords_before = plates.reduce((a, c) => a + c.posArr.length, 0)
 

    for (let i = 0; i < plates.length; i++) {
        for (let j = plates[i].indArr.length - 3; j >= 0; j -= 3) {
            del_1 = [
                i < numSpheres ? insideACylinder(gemPNI, tubes, 0.995*GS, plates[i], j) : false,
                i < numSpheres ? insideACylinder(gemPNI, tubes, 0.995*GS, plates[i], j+1) : false,
                i < numSpheres ? insideACylinder(gemPNI, tubes, 0.995*GS, plates[i], j+2) : false,
            ]

            del_2 = [
                i < numSpheres ? insideACylinder(gemPNI, tubes, 0.995*GS, plates[i], j) : false,
                i < numSpheres ? insideACylinder(gemPNI, tubes, 0.995*GS, plates[i], j+1) : false,
                i < numSpheres ? insideACylinder(gemPNI, tubes, 0.995*GS, plates[i], j+2) : false,
            ]

            const p0 = [plates[i].posArr[4*plates[i].indArr[j]], plates[i].posArr[1+4*plates[i].indArr[j]], plates[i].posArr[2+4*plates[i].indArr[j]]]
            const p1 = [plates[i].posArr[4*plates[i].indArr[j+1]], plates[i].posArr[1+4*plates[i].indArr[j+1]], plates[i].posArr[2+4*plates[i].indArr[j+1]]]
            const p2 = [plates[i].posArr[4*plates[i].indArr[j+2]], plates[i].posArr[1+4*plates[i].indArr[j+2]], plates[i].posArr[2+4*plates[i].indArr[j+2]]]
            del_3 = [
                point_inside_mesh(gemPNI, p0),
                point_inside_mesh(gemPNI, p1),
                point_inside_mesh(gemPNI, p2),
            ]
            d3 = del_3[0] && del_3[1] && del_3[2]

            d1 = del_1[0] && del_1[1] && del_1[2]
            d2 = del_2[0] && del_2[1] && del_2[2]
            if (d1 || d2 || d3) {
                removeVertFromPNI(j+2, plates[i])
                removeVertFromPNI(j+1, plates[i])
                removeVertFromPNI(j, plates[i])
            }
            
            
        }
    }


    for (let i = 0; i < plates.length; i++) {
        plates[i] = PosNormInd(gl, plates[i].posArr, plates[i].normArr, plates[i].indArr)
    }
    
    const pos2 = []
    const norm2 = []
    const ind2 = []
    let nextInd = 0
    for (const plate of plates) {
        for (let i = 0; i < plate.posArr.length; i++) {
            pos2.push(plate.posArr[i])
            norm2.push(plate.normArr[i])
        }
        for (let i = 0; i < plate.indArr.length; i++) {
            ind2.push(plate.indArr[i] + nextInd)
        }
        nextInd += plate.posArr.length/4
    }

    for (let i = 0; i < pos2.length; i++) {
        pos2[i] = parseFloat(pos2[i].toFixed(5))
        norm2[i] = parseFloat(norm2[i].toFixed(4))
    }

    const pos2_length = pos2.length
    const ind2_length = ind2.length



    for (let i = 1; i < 9; i++) {
        continue
        const rot = [
            Math.cos(i*Math.PI * 2 / 9), -Math.sin(i*Math.PI * 2 / 9), 0, 
            Math.sin(i*Math.PI * 2 / 9), Math.cos(i*Math.PI * 2 / 9), 0, 
            0, 0, 1
        ]
        for (let j = 0; j < pos2_length; j += 4) {
            const curr = [pos2[j], pos2[j+1], pos2[j+2]]
            const currNorm = [norm2[j], norm2[j+1], norm2[j+2]]
            rotd = mul3x3vec(rot, curr)
            normRotd = mul3x3vec(rot, currNorm)
            pos2.push(rotd[0], rotd[1], rotd[2], pos2[j+3])
            norm2.push(normRotd[0], normRotd[1], normRotd[2], norm2[j+3])
        }



        for (let j = 0; j < ind2_length; j++) {
            ind2.push(i*nextInd + ind2[j])
        }
    }
    
    

    while (plates.length > 0) plates.pop()
    plates.push(PosNormInd(gl, pos2, norm2, ind2))

    return plates
}

function getPlates(gl, gemPNI, type) {
    if (type == "briolette") return getPlatesBriolette(gl, gemPNI)
}