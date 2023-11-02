


document.onkeydown = function (e) {
    if (e.key == "ArrowUp" || e.key == "w") {
        Ball.jump()
    }
    if (e.key == "ArrowDown" || e.key == "s") {
        Ball.down()
    }
    if (e.key == "ArrowLeft" || e.key == "a") {
        Ball.left()
    }

    if (e.key == "ArrowRight" || e.key == "d") {
        Ball.right()
    }
}
