var scale = 1;

var rules = {};
rules.compression = 8;
rules.offset = 32768;
rules.releaseSpeed = 14;
rules.baseVelocity = 25;
rules.ticksPerSecond = 60;

var level = {};
level.numberOfAnts =150;
level.antHillX = -0;
level.antHillY = 0;
level.timeLimit = 60;
level.border = [];
level.otherChars = [];



let polygon;

polygon = {};
polygon.normal = 0;
polygon.type = 'polygon';
polygon.external = false;
polygon.coords = [[-245,-145],[-240,-140],[-240,140],[-245,145]];
level.border.push(polygon);

polygon = {};
polygon.normal = 3.1416;
polygon.type = 'polygon';
polygon.external = false;
polygon.coords = [[245,-145],[240,-140],[240,140],[245,145]];
level.border.push(polygon);

polygon = {};
polygon.normal = 1.5708;
polygon.type = 'polygon';
polygon.external = false;
polygon.coords = [[-245,-145],[245,-145],[240,-140],[-240,-140]];
level.border.push(polygon);

polygon = {};
polygon.normal = 4.7163;
polygon.type = 'polygon';
polygon.external = false;
polygon.coords = [[-245,145],[245,145],[240,140],[-240,140]];
level.border.push(polygon);



let circ = {};
circ.x = 0;
circ.y = -120;
circ.radius = 50;
circ.external=false;
circ.normal = function(x,y){
	let xDif = x-this.x;
	let yDif = y-this.y;
	if(xDif<=0){
		return Math.PI+Math.atan(yDif/xDif);
	} else {
		return Math.atan(yDif/xDif);
	}
}
circ.type = 'circle';
level.border.push(circ);

circ = {};
circ.direction = Math.PI;
circ.x = 150;
circ.y = -00;
circ.radius = 50;
circ.external=false;
circ.path = [];
circ.normal = function(x,y){
	let xDif = x-this.x;
	let yDif = y-this.y;
	if(xDif<=0){
		return Math.PI+Math.atan(yDif/xDif);
	} else {
		return Math.atan(yDif/xDif);
	}
}
circ.type = 'circle';
circ.lastCollision = -1;
circ.yComp = Math.sin(circ.direction);
circ.xComp = Math.cos(circ.direction);
circ.velocity = 10;
circ.distance = otherCharDistance();
level.otherChars.push(circ);

var game = {};
game.chars = [];
game.borders = [];
game.otherChars = [];

//var antCounter;

let calculated = 0
function calculateGame(){
	if (calculated++ > 0) return
	console.log("version 1.3.1");
	let tickLimit = level.timeLimit*rules.ticksPerSecond;
	var antCounter = level.numberOfAnts;
	var releaseCounter = Math.round(rules.ticksPerSecond / rules.releaseSpeed);
	
	for(let i = 0; i<level.border.length;i++){
		switch(level.border[i].type){
			case 'polygon':
				let bord = {};
				bord.type = 'polygon';
				bord.normal = level.border[i].normal;
				let b = [];
				for(let j = 0;j<level.border[i].coords.length;j++){
					let a = [];
					a.push(level.border[i].coords[j][0]+rules.offset);
					a.push(level.border[i].coords[j][1]+rules.offset);
					b.push(a);
				}
				bord.coords = b;
				game.borders.push(bord);
				break;
			case 'circle':
				let cord = {};
				cord.x = level.border[i].x+rules.offset;
				cord.y = level.border[i].y+rules.offset;
				cord.external = level.border[i].external;
				cord.type = 'circle';
				cord.normal = level.border[i].normal;
				cord.radius = level.border[i].radius;
				if(level.border[i].movement!==undefined){
					cord.movement = {};
					cord.movement.velocity = level.border[i].movement.velocity;
				}
				game.borders.push(cord);
				break;
		}
	}
	
	game.otherChars = JSON.parse(JSON.stringify(level.otherChars));
	//////////////////////////////////////////////////////////////////////////
	var t0 = performance.now();
	for(let tick = 0; tick<tickLimit; tick++){
		for(let i = 0; i<game.chars.length;i++){
			if(game.chars[i].alive){
				let tickVelocity = game.chars[i].velocity/rules.ticksPerSecond;
				game.chars[i].x+=tickVelocity*game.chars[i].xComp;
				game.chars[i].y+=tickVelocity*game.chars[i].yComp;
				for(let j = 0; j<game.borders.length;j++){
					if (game.chars[i].lastCollision !== j){
						dotInShape(i,game.borders[j].coords,tick,j);
					}
				}
				game.chars[i].distance -= tickVelocity;
				if(game.chars[i].distance <=0){
					game.chars[i].direction += randomDirection();
					game.chars[i].lastCollision = -1;
					pushNode(i,tick);
					game.chars[i].yComp = Math.sin(game.chars[i].direction);
					game.chars[i].xComp = Math.cos(game.chars[i].direction);
					game.chars[i].distance = randomDistance();
				}
			}
		}
		
		for(let i = 0; i<game.otherChars.length; i++){
			
		}
		
		releaseCounter -= 1;
		if((antCounter!==0)&&(releaseCounter<=0)){
			releaseCounter = Math.round(rules.ticksPerSecond / rules.releaseSpeed);
			antCounter -= 1;
			newAnt(tick);
		}
	}
	var maxLength = 0;
	for(let i = 0; i<game.chars.length;i++){
		if(game.chars[i].path.length>maxLength){
			maxLength = game.chars[i].path.length;
		}
		pushNode(i,tickLimit);
	}
	console.log("the longest path is: "+maxLength);
	compressPaths();
	var t1 = performance.now();
	console.log("calculating the game took " + (t1 - t0) + " milliseconds.");
	/////////////////////////////////////////////////////////////////////////////
}




function compressPaths(){
	compPaths = [];
	for(let i = 0; i<game.chars.length;i++){
		let path = "";
		for(let j = 0; j<game.chars[i].path.length;j++){
			let str = "";
			str += invertNumToString(game.chars[i].path[j].x,2);
			str += invertNumToString(game.chars[i].path[j].y,2);
			str += invertNumToString(game.chars[i].path[j].s,2);
			str += invertNumToString(game.chars[i].path[j].d,1);
			str += invertNumToString(game.chars[i].path[j].f,1);
			path += str;
		}
		compPaths.push(JSON.stringify(path));
	}
}


function invertNumToString(number,size){
	switch(size){
		case 1:
			return String.fromCharCode(255-Math.floor(number))
			break;
		case 2:
			let str = "";
			str += String.fromCharCode(255-Math.floor(number/256));
			str += String.fromCharCode(255-Math.floor(number%256));
			return str;
			break;
	}
	
}


function pushNode(i,tick){
	if(game.chars[i].alive){
		let node = {};
		node.x = Math.round(game.chars[i].x);
		node.y = Math.round(game.chars[i].y);
		node.s = tick;
		node.d = Math.round(128*game.chars[i].direction/Math.PI);
		node.f = game.chars[i].path[game.chars[i].path.length-1].f
		game.chars[i].path.push(node);
	}
}

function pushOtherNode(){
	let node = {};
	node.x = Math.round(game.otherChars[i].x);
	node.y = Math.round(game.otherChars[i].y);
	node.s = tick;
	node.d = Math.round(128*game.otherChars[i].direction/Math.PI);
	node.f = game.otherChars[i].path[game.otherChars[i].path.length-1].f
	game.otherChars[i].path.push(node);
}

function newAnt(tick){
	let newAnt = {};
	newAnt.path=[];
	newAnt.x = rules.offset + level.antHillX;
	newAnt.y = rules.offset + level.antHillY;
	//newAnt.x = rules.offset + 50*(0.5-Math.random());
	//newAnt.y = rules.offset +  -320;
	newAnt.direction = Math.random()*Math.PI*2;
	//newAnt.direction = 0.5*Math.PI;
	newAnt.alive = true;
	newAnt.lastCollision = -1;
	newAnt.yComp = Math.sin(newAnt.direction);
	newAnt.xComp = Math.cos(newAnt.direction);
	newAnt.velocity = rules.baseVelocity;
	newAnt.distance = randomDistance();
	newAnt.path = [];
	let node = {};
	node.x = newAnt.x;
	node.y = newAnt.y;
	node.s = tick;
	node.f = 0;
	node.d = Math.round(128*newAnt.direction/Math.PI);
	newAnt.path.push(node);
	game.chars.push(newAnt);
}


function randomDirection(){
	return 3*(0.5-Math.random());
}


function randomDistance(){
	return 10+20*Math.random();
}

function otherCharDirection(){
	return 3*(0.5-Math.random());
}

function otherCharDistance(){
	return 10+20*Math.random();
}



