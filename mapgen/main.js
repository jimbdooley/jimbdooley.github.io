var mgen_canvas = document.getElementById("mgen_canvas")
var mgen_ctx = mgen_canvas.getContext("2d")

const S = {
    scale: 20,
    state: "",
    _trimRequested: false,
    trimRequested: false,
    _justClicked: false,
    justClicked: false,
    _clickXY: [0, 0],
    clickXY: [0, 0],
    squareSelected: [],
    hexagonSelected: [],
    octagonSelected: [],
    triangleSelected: [],
    hesqSelected: [],
    circleSelected: [],
    squareSavedI: -1,
    hexagonSavedI: -1,
    octagonSavedI: -1,
    triangleSavedI: -1,
    hesqSavedI: -1,
    circleSavedI: -1,
}

function makeHesqMap() {
    S.state = "makeHesqMap"
    S.hesqMap = hesqs_generate_full()
    S.hesqSelected = []
}
function makeSquareMap() {
    S.state = "makeSquareMap"
    S.squareMap = squares_generate_full()
    S.squareSelected = []
}
function makeTriangleMap() {
    S.state = "makeTriangleMap"
    S.triangleMap = triangles_generate_full()
    S.triangleSelected = []
}
function makeOctagonMap() {
    S.state = "makeOctagonMap"
    S.octagonMap = octagons_generate_full()
    S.octagonSelected = []
}
function makeHexagonMap() {
    S.state = "makeHexagonMap"
    S.hexagonMap = hexagons_generate_full()
    S.hexagonSelected = []
}
function makeCircleMap() {
    S.state = "makeCircleMap"
    S.circleMap = circles_generate_full()
    S.circleSelected = []
}

function viewNextSavedSquare() {
    if (squaresSaved.length == 0) return
    S.squareSavedI = (S.squareSavedI + 1) % squaresSaved.length
    S.state = "makeSquareMap"
    S.squareMap = JSON.parse(squaresSaved[S.squareSavedI])
    S.squareSelected = []
}
function viewNextSavedHesq() {
    if (hesqsSaved.length == 0) return
    S.hesqSavedI = (S.hesqSavedI + 1) % hesqsSaved.length
    S.state = "makeHesqMap"
    S.hesqMap = JSON.parse(hesqsSaved[S.hesqSavedI])
    S.hesqSelected = []
}
function viewNextSavedHexagon() {
    if (hexagonsSaved.length == 0) return
    S.hexagonSavedI = (S.hexagonSavedI + 1) % hexagonsSaved.length
    S.state = "makeHexagonMap"
    S.hexagonMap = JSON.parse(hexagonsSaved[S.hexagonSavedI])
    S.hexagonSelected = []
}
function viewNextSavedOctagon() {
    if (octagonsSaved.length == 0) return
    S.octagonSavedI = (S.octagonSavedI + 1) % octagonsSaved.length
    S.state = "makeOctagonMap"
    S.octagonMap = JSON.parse(octagonsSaved[S.octagonSavedI])
    S.octagonSelected = []
}
function viewNextSavedTriangle() {
    if (trianglesSaved.length == 0) return
    S.triangleSavedI = (S.triangleSavedI + 1) % trianglesSaved.length
    S.state = "makeTriangleMap"
    S.triangleMap = JSON.parse(trianglesSaved[S.triangleSavedI])
    S.triangleSelected = []
}
function viewNextSavedCircle() {
    if (circlesSaved.length == 0) return
    S.circleSavedI = (S.circleSavedI + 1) % circlesSaved.length
    S.state = "makeCircleMap"
    S.circleMap = JSON.parse(circlesSaved[S.circleSavedI])
    S.circleSelected = []
}

let errorCount = 0
function loop() {
    errorCount += 1
    if (errorCount < 5) window.requestAnimationFrame(loop)
    mgen_ctx.clearRect(0, 0, mgen_canvas.width, mgen_canvas.height)
    S.justClicked = S._justClicked
    S.trimRequested = S._trimRequested
    S.saveRequested = S._saveRequested
    S._justClicked = false
    S._trimRequested = false
    S._saveRequested = false
    S.clickXY[0] = S._clickXY[0]
    S.clickXY[1] = S._clickXY[1]
    if (S.state == "makeHesqMap") {
        hesqs_draw(S.hesqMap, mgen_canvas, mgen_ctx, S.hesqSelected, S.scale)
        if (S.justClicked) {
            const clickI = hesqs_get_clicked(S.hesqMap, S.clickXY, mgen_canvas, S.scale)
            if (S.hesqSelected.indexOf(clickI) == -1 && clickI != -1) {
                S.hesqSelected.push(clickI)
            }
        }
        if (S.trimRequested) {
            S.hesqMap = hesqs_trim(S.hesqMap, S.hesqSelected)
            while (S.hesqSelected.length > 0) S.hesqSelected.pop()
        }
        if (S.saveRequested) {
            navigator.clipboard.writeText(JSON.stringify(S.hesqMap));
            console.log(JSON.stringify(S.hesqMap))
        }
    }
    if (S.state == "makeCircleMap") {
        circles_draw(S.circleMap, mgen_canvas, mgen_ctx, S.circleSelected, S.scale)
        if (S.justClicked) {
            const clickI = circles_get_clicked(S.circleMap, S.clickXY, mgen_canvas, S.scale)
            if (S.circleSelected.indexOf(clickI) == -1 && clickI != -1) {
                S.circleSelected.push(clickI)
            }
        }
        if (S.trimRequested) {
            S.circleMap = shapes_trim(S.circleMap, S.circleSelected)
            while (S.circleSelected.length > 0) S.circleSelected.pop()
        }
        if (S.saveRequested) {
            navigator.clipboard.writeText(JSON.stringify(S.circleMap));
            console.log(JSON.stringify(S.circleMap))
        }
    }
    if (S.state == "makeSquareMap") {
        squares_draw(S.squareMap, mgen_canvas, mgen_ctx, S.squareSelected, S.scale)
        if (S.justClicked) {
            const clickI = squares_get_clicked(S.squareMap, S.clickXY, mgen_canvas, S.scale)
            if (S.squareSelected.indexOf(clickI) == -1 && clickI != -1) {
                S.squareSelected.push(clickI)
            }
        }
        if (S.trimRequested) {
            S.squareMap = shapes_trim(S.squareMap, S.squareSelected)
            while (S.squareSelected.length > 0) S.squareSelected.pop()
        }
        if (S.saveRequested) {
            navigator.clipboard.writeText(JSON.stringify(S.squareMap));
            console.log(JSON.stringify(S.squareMap))
        }
    }
    if (S.state == "makeTriangleMap") {
        triangles_draw(S.triangleMap, mgen_canvas, mgen_ctx, S.triangleSelected, S.scale)
        if (S.justClicked) {
            const clickI = triangles_get_clicked(S.triangleMap, S.clickXY, mgen_canvas, S.scale)
            if (S.triangleSelected.indexOf(clickI) == -1 && clickI != -1) {
                S.triangleSelected.push(clickI)
            }
        }
        if (S.trimRequested) {
            S.triangleMap = triangles_trim(S.triangleMap, S.triangleSelected, 1)
            while (S.triangleSelected.length > 0) S.triangleSelected.pop()
        }
        if (S.saveRequested) {
            navigator.clipboard.writeText(JSON.stringify(S.triangleMap));
            console.log(JSON.stringify(S.triangeMap))
        }
    }
    if (S.state == "makeOctagonMap") {
        octagons_draw(S.octagonMap, mgen_canvas, mgen_ctx, S.octagonSelected, S.scale)
        if (S.justClicked) {
            const clickI = octagons_get_clicked(S.octagonMap, S.clickXY, mgen_canvas, S.scale)
            if (S.octagonSelected.indexOf(clickI) == -1 && clickI != -1) {
                S.octagonSelected.push(clickI)
            }
        }
        if (S.trimRequested) {
            S.octagonMap = shapes_trim(S.octagonMap, S.octagonSelected)
            while (S.octagonSelected.length > 0) S.octagonSelected.pop()
        }
        if (S.saveRequested) {
            navigator.clipboard.writeText(JSON.stringify(S.octagonMap));
            console.log(JSON.stringify(S.octagonMap))
        }
    }
    if (S.state == "makeHexagonMap") {
        hexagons_draw(S.hexagonMap, mgen_canvas, mgen_ctx, S.hexagonSelected, S.scale)
        if (S.justClicked) {
            const clickI = hexagons_get_clicked(S.hexagonMap, S.clickXY, mgen_canvas, S.scale)
            if (S.hexagonSelected.indexOf(clickI) == -1 && clickI != -1) {
                S.hexagonSelected.push(clickI)
            }
        }
        if (S.trimRequested) {
            S.hexagonMap = shapes_trim(S.hexagonMap, S.hexagonSelected)
            while (S.hexagonSelected.length > 0) S.hexagonSelected.pop()
        }
        if (S.saveRequested) {
            navigator.clipboard.writeText(JSON.stringify(S.hexagonMap));
            console.log(JSON.stringify(S.hexagonMap))
        }
    }
    S.trimRequested = false
    S.saveRequested = false
    S.justClicked = false
    errorCount -= 1
}
loop()

mgen_canvas.onclick = (e) => {
    if (S.justClicked || S._justClicked) return
    S._justClicked = true
    const rect = mgen_canvas.getBoundingClientRect()
    const borderWidth = parseInt(mgen_canvas.style.border)
    S._clickXY[0] = e.clientX - borderWidth - rect.x
    S._clickXY[1] = e.clientY - borderWidth - rect.y
    
}

