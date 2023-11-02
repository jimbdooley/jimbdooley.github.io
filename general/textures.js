
function getCubeMapFromUrl(url="diamond_texture0.png"){
  function finalize(texture, imgData){
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imgData);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imgData);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imgData);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imgData);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imgData);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imgData);
    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    return texture;
  }

  const tempPixels = new Uint8ClampedArray([255, 0, 0, 255]);
  const tempImgData = new ImageData(tempPixels, 1, 1);
  const tempTexture = gl.createTexture();

  let img = new Image();
  img.onload = ()=>{
    const sideLen = 256;
    let tempCanvas = document.createElement("canvas");
    tempCanvas.width = sideLen;
    tempCanvas.height = sideLen;
    let tempCtx = tempCanvas.getContext("2d");
    tempCtx.drawImage(img, 0, 0, Math.min(img.width, img.height), Math.min(img.width, img.height), 0, 0, sideLen, sideLen);
    const newImgData = tempCtx.getImageData(0, 0, sideLen, sideLen);
    finalize(tempTexture, newImgData);
  }
  img.src = url;

  return finalize(tempTexture, tempImgData);
}

function getTestBitmap(gl){
  const w = 8;
  const ppu = 1;
  const pixelsArr = [
    new Uint8ClampedArray(w*w*ppu*ppu*4),
    new Uint8ClampedArray(w*w*ppu*ppu*4),
    new Uint8ClampedArray(w*w*ppu*ppu*4),
    new Uint8ClampedArray(w*w*ppu*ppu*4),
    new Uint8ClampedArray(w*w*ppu*ppu*4),
    new Uint8ClampedArray(w*w*ppu*ppu*4),
  ];
  for(let side = 0; side < 6; side++){
    pixels = pixelsArr[side];
    for(let i = 0; i < w; i++){
      for(let j = 0; j < w; j++){
        /*
        if( (i < xLim) && (j < yLim) ){
          pixels[i*4*w + j*4 + 0] = 255;
          pixels[i*4*w + j*4 + 1] = 255;
          pixels[i*4*w + j*4 + 2] = 255;
        }
        if( (i >= xLim) && (j < yLim) ){
          pixels[i*4*w + j*4 + 0] = 150;
          pixels[i*4*w + j*4 + 1] = 150;
          pixels[i*4*w + j*4 + 2] = 150;
        }
        if( (i < xLim) && (j >= yLim) ){
          pixels[i*4*w + j*4 + 0] = 200;
          pixels[i*4*w + j*4 + 1] = 200;
          pixels[i*4*w + j*4 + 2] = 200;
        }
        if( (i >= xLim) && (j >= yLim) ){
          pixels[i*4*w + j*4 + 0] = 0;
          pixels[i*4*w + j*4 + 1] = 0;
          pixels[i*4*w + j*4 + 2] = 0;
        }*/
        darkness = Math.floor(Math.sqrt(Math.random())*256);
        for(let di = 0; di < ppu; di++){
          for(let dj = 0; dj < ppu; dj++){
            pixels[(i*ppu+di)*4*w*ppu + (j*ppu+dj)*4 + 0] = darkness;
            pixels[(i*ppu+di)*4*w*ppu + (j*ppu+dj)*4 + 1] = darkness;
            pixels[(i*ppu+di)*4*w*ppu + (j*ppu+dj)*4 + 2] = darkness;
            pixels[(i*ppu+di)*4*w*ppu + (j*ppu+dj)*4 + 3] = 255;
          }
        }
      }
    }
  }
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
  gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, new ImageData(pixelsArr[0], w*ppu, w*ppu));
  gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, new ImageData(pixelsArr[1], w*ppu, w*ppu));
  gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, new ImageData(pixelsArr[2], w*ppu, w*ppu));
  gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, new ImageData(pixelsArr[3], w*ppu, w*ppu));
  gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, new ImageData(pixelsArr[4], w*ppu, w*ppu));
  gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, new ImageData(pixelsArr[5], w*ppu, w*ppu));
  gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  return texture;
}
