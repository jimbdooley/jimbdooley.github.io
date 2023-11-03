

function check_for_drawables_after_delay(delay=100) {
  return new Promise(function(resolve, reject) {
    setTimeout(() => {
      let allDone = true
      for (key in drawable) {
        allDone &= drawable[key].complete && drawable[key].naturalWidth !== 0
      }
      resolve(allDone)
    }, delay)
  })
}

async function get_all_assets() {
  
    let drawable_files = DFn
    for (let i = 0; i < drawable_files.length; i++) {
        const im = new Image()
        drawableArrs[drawable_files[i]] = null
        im.onload = () => {
          const name = drawable_files[i]
          drawableArrs[name] = im
        }
        im.src = DFs[i]
        drawable[drawable_files[i]] = im
    }
    
    let drawables_done = false
    do {
      drawables_done = await check_for_drawables_after_delay(40)
    } while (!drawables_done)
    //document.getElementById("backDiv").appendChild(drawableArrs["back_arrow_icon.png"])
    //document.getElementById("backDiv").onclick = backToGame
}