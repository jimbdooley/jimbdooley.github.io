
var canvas;
var ctx;
var hCanvas;
var hCtx;

const FPS = 60;
const FPSSample = 10;
const TIME_LIMIT = 60; 

var state = {
	angle:3.14159,
	prev_v:0
};

function do_all(G){
		prep_circle(G,500,300,250,state.angle);
		draw_edge(G);
		draw_graph(G);
		update();
}

function update(){
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.drawImage(hCanvas,0,0);
	hCtx.clearRect(0,0,canvas.width,canvas.height);
}

function draw_vertex(x,y,diameter,border,inside){
    hCtx.strokeStyle = border;
	hCtx.beginPath();	
	hCtx.arc(x,y,diameter,0,2*Math.PI);
	hCtx.fillStyle = inside;
	hCtx.fill();
	hCtx.stroke();
	hCtx.strokeStyle = 'black';
	hCtx.fillStyle = 'black';
}


function prep_circle(G,cx,cy,diameter,angle){
	var order = [];
	for (let i = 0; i<G.length; i++){
		order.push(i);
	}
	/*
	for(let i = 0; i<G.length; i++){
		let x = Math.floor((G.length - i)*Math.random());
		let temp = order[i];
		order[i] = order[x];
		order[x] = temp;
	}
	*/
    for(let i = 0; i<G.length;i++){
		let k = order[i]
		G[i].x = cx + diameter*Math.cos((k/G.length)*2*Math.PI+angle);
		G[i].y = cy + diameter*Math.sin((k/G.length)*2*Math.PI+angle);
	}
}

function draw_graph(G){
	for(let i = 0; i<G.length; i++){
		let inside = 'red';
		let outside = 'black'
		let diameter = 10;
		if (G[i].partner !== -1){
			inside = 'blue';
			outside = 'blue'
			diameter = 8;
		}
		draw_vertex(G[i].x,G[i].y,diameter,outside,inside);
	}
}

function highlight_path(path,G){
	prep_circle(G,500,300,250,3.14159)
	hCtx.lineWidth = 50;
	hCtx.strokeStyle = 'red'
	for(let i = 0; i<path.length-1;i++){
		hCtx.beginPath();
		hCtx.moveTo(G[path[i]].x,G[path[i]].y);
		hCtx.moveTo(G[path[i+1]].x,G[path[i+1]].y);
		hCtx.stroke();
	}
	hCtx.lineWidth = 0.5;
	hCtx.strokeStyle = 'black'
	console.log("here");
	do_all(G);
}

function draw_edge(G){
	for(let i = 0; i<G.length; i++){
		for(let j = 0; j<G[i].adj.length; j++){
			if(i < G[i].adj[j]){
				if((G[i].root === G[G[i].adj[j]].root)&&('root' in G[i])){
				//if(false){
					hCtx.lineWidth = 5;
					hCtx.strokeStyle = 'red'
					hCtx.beginPath();
					hCtx.moveTo(G[i].x,G[i].y);
					hCtx.lineTo(G[G[i].adj[j]].x,G[G[i].adj[j]].y);
					hCtx.stroke();
					hCtx.lineWidth = 0.5;
					hCtx.strokeStyle = 'black'
				}
				if(G[i].partner === G[i].adj[j]){
					hCtx.lineWidth = 3;
					hCtx.strokeStyle = 'blue'
				}				
				hCtx.beginPath();
				hCtx.moveTo(G[i].x,G[i].y);
				hCtx.lineTo(G[G[i].adj[j]].x,G[G[i].adj[j]].y);
				hCtx.stroke();
				hCtx.lineWidth = 0.5;
				hCtx.strokeStyle = 'black'
			}
		}
	}
}

function even_spread_rect(ints,crd){
	let xDif = Math.abs(crd[1][0] - crd[0][0]);
	let yDif = Math.abs(crd[1][1] - crd[0][1]);
	let rows = Math.ceil(Math.sqrt((yDif*ints.length)/xDif));
	let cols = Math.ceil(Math.sqrt((xDif*ints.length)/yDif));
	let width = xDif/cols;
	let height = yDif/rows;
	console.log("width = " + width);
	console.log("height = " + height);
	let count = 0;
	let breaking = false
	for(let i = 0; i<rows; i++){
		for(let j = 0; j<cols; j++){
			let x = crd[0][0] + (0.5*(i%2)+0.5)*width + j*width + 0.25*width*(0.5-Math.random());
			let y = crd[0][1] + 0.5*height + i*height + 0.25*height*(0.5-Math.random());
			draw_vertex(x,y,Math.min(width,height)/4,'black','red');
			count +=1;
			if (count > 10000) {
				breaking = true;
				break;
			}
		}
		if(breaking){
			breaking = false;
			break;
		}
	}
	
	console.log("rows = " + rows);
	console.log("cols = " + cols);
	update();
}


