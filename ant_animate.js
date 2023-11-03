var aStats = {};
aStats.offset = 32768;
aStats.visualX = 600;
aStats.visualY = 360;
aStats.TPS = 60; //ticks per second (game actions per second)
aStats.FPS = 60; //frames per second
aStats.COMPRESSION = 8;
aStats.antSize = 1;


var canvas = document.getElementById("main");
var ctx = canvas.getContext("2d");
var hCanvas = document.getElementById("hidden");
var hCtx = hCanvas.getContext("2d");
var interval;
var animatePaths=[];
var scene;
var dScene = aStats.TPS/aStats.FPS;
var inited=false;
var t0; 




function animateInit(){
	if(!inited){
		canvas.width = aStats.visualX;
		canvas.height = aStats.visualY;
		hCanvas.width = aStats.visualX;
		hCanvas.height = aStats.visualY;
		expandPaths(compPaths);
		inited = true;
	} else {
		clearInterval(interval);
	}
	
	scene = 0;
	t0 = performance.now();
	interval = setInterval(animate,1000/aStats.FPS);
}

 



function animate(){
	scene += dScene;
	hCtx.clearRect(0,0,canvas.width,canvas.height);
	for(let i = 0; i<animatePaths.length; i++){
		if(scene>=animatePaths[i][0].s){
			var max;
			var min;
			for(let j = 0; j<animatePaths[i].length-1; j++ ){
				if(scene < animatePaths[i][j+1].s){
					let totalSceneDif = animatePaths[i][j+1].s - animatePaths[i][j].s;
					let sceneDif = scene - animatePaths[i][j].s;
					let sceneChangeRatio = sceneDif/totalSceneDif;
					let xDif = animatePaths[i][j+1].x - animatePaths[i][j].x;
					let yDif = animatePaths[i][j+1].y - animatePaths[i][j].y;
					let newX = animatePaths[i][j].x + xDif*sceneChangeRatio;
					let newY = animatePaths[i][j].y + yDif*sceneChangeRatio;
					let yComponent = Math.sin(animatePaths[i][j].d);
					let xComponent = Math.cos(animatePaths[i][j].d);
					drawCharacter(animatePaths[i][j].f,newX,newY,i,xComponent,yComponent);	
					break;
				}
			}
		}
	}
	//hCtx.drawImage(background,0,0,1000,600);
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.drawImage(hCanvas,0,0);
	ctx.beginPath();
	var o = rules.offset;
	for(let i = 0; i<game.borders.length;i++){	
		switch(game.borders[i].type){
			case 'polygon':
				ctx.moveTo(canvas.width/2+(game.borders[i].coords[0][0]-o),canvas.height/2+(game.borders[i].coords[0][1]-o));
				for(let j = game.borders[i].coords.length-1;j>=0;j--){
					ctx.lineTo(canvas.width/2+(game.borders[i].coords[j][0]-o),canvas.height/2+(game.borders[i].coords[j][1]-o));
				}
				ctx.stroke();
				break;
			case 'circle':
				ctx.beginPath();
				ctx.lineWidth = 3;
				ctx.arc(canvas.width/2+game.borders[i].x-o,canvas.height/2+game.borders[i].y-o,game.borders[i].radius,0,2*Math.PI)
				ctx.stroke();
				break;
		}
	}
	
	

	if(scene>=3600) {
		clearInterval(interval);
		animateInit()
	}
}


function drawCharacter(shape,newX,newY,i,xComponent,yComponent){
	
	switch(shape){
		case 'circle':
			hCtx.beginPath();
			hCtx.lineWidth = 3;
			hCtx.arc(5*newX,5*newY,game.chars[i].radius*5,0,2*Math.PI);
			hCtx.stroke();
			break;
		case 0:
			hCtx.beginPath();
			hCtx.lineWidth = aStats.antSize*3;
			hCtx.moveTo( newX+3*aStats.antSize*xComponent , newY+3*aStats.antSize*yComponent );
			hCtx.lineTo( newX-5*aStats.antSize*xComponent , newY-5*aStats.antSize*yComponent );
			hCtx.stroke();
			break;
	}
}



function expandPaths(array){
	animatePaths = [];
	for(let i = 0; i<array.length;i++){
		array[i] = JSON.parse(array[i]);
		var path = [];
		var c = aStats.COMPRESSION;
		for(let j = 0; j<(compPaths[i].length/c);j++){
			let node = {};
			node.x = 256*(255-array[i].charCodeAt(0+c*j)) + 255-array[i].charCodeAt(1+c*j);
			node.x = node.x - aStats.offset//+aStats.visualX/2;;
			node.x = node.x+aStats.visualX/2;
			node.y = 256*(255-array[i].charCodeAt(2+c*j)) + 255-array[i].charCodeAt(3+c*j);
			node.y = node.y - aStats.offset//+aStats.visualY/2;;
			node.y = node.y+aStats.visualY/2;
			node.s = 256*(255-array[i].charCodeAt(4+c*j)) + 255-array[i].charCodeAt(5+c*j);
			node.d = (Math.PI/128)*(255-array[i].charCodeAt(6+c*j));
			node.f = 255-array[i].charCodeAt(7+c*j);
			path.push(node);
		}
		animatePaths.push(path);
	}
}