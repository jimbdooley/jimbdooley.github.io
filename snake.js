var mainCanvas = document.getElementById("mainCanvas");
var mainCtx = mainCanvas.getContext("2d");

block_size = 40;
var Q = {
	blockLength:1,
	
	update:function(){
		mainCtx.drawImage(hiddenCanvas,0,0);
		hiddenCtx.clearRect(0,0,hiddenCanvas.width, mainCanvas.height);
	},
	pressedKeys:{
		up:false,
		down:false,
		left:false,
		right:false
	},
	block_size:block_size,
	game_dim:[Math.floor(mainCanvas.width/block_size), Math.floor(mainCanvas.height/block_size)],
	snake:{
		body:[[0,0],[1,0],[2,0],[3,0],[4,0]],
		direction:[1,0],
		next_direction:[1, 0],
		just_eaten:false
	},
	reset() {
		Q.snake = {
			body:[[0,0],[1,0],[2,0],[3,0],[4,0]],
			direction:[1,0],
			next_direction:[1, 0],
			just_eaten:false
		}
	},
	food:[3,3],
	
	draw:function(){
		mainCtx.clearRect(0,0,mainCanvas.width, mainCanvas.height);
		
		
		if(Q.snake.just_eaten==0){
			temp = []
			for(let i = 1; i < Q.snake.body.length; i++){
				temp.push(Q.snake.body[i]);
			}
			Q.snake.body = temp;
		}
		last = Q.snake.body[Q.snake.body.length-1]
		Q.snake.direction = Q.snake.next_direction;
		Q.snake.body.push([(last[0] + Q.snake.direction[0] >= 0) ? (last[0] + Q.snake.direction[0]) % Q.game_dim[0] : last[0] + Q.snake.direction[0] + Q.game_dim[0], (last[1] + Q.snake.direction[1]) >= 0 ? (last[1] + Q.snake.direction[1]) % Q.game_dim[1] : last[1] + Q.snake.direction[1] + Q.game_dim[1]]);
		
		
		
		
		let color = "0123456789abcdef";
		let fs = ""
		for(let i = 0; i < Q.snake.body.length; i++){
			fs = color[Math.min(13, Math.floor((i*7)/16))] + color[(i*7)%16]
			mainCtx.fillStyle = "#" + fs + fs + fs
			mainCtx.beginPath();
			mainCtx.fillRect(Q.block_size*Q.snake.body[Q.snake.body.length - 1 - i][0], Q.block_size*Q.snake.body[Q.snake.body.length - 1 - i][1], Q.block_size, Q.block_size);
			mainCtx.stroke();
		}
		mainCtx.fillStyle = "black";
		mainCtx.fillStyle = "red";
		mainCtx.beginPath();
		mainCtx.fillRect(Q.block_size*Q.food[0], Q.block_size*Q.food[1], Q.block_size, Q.block_size);
		mainCtx.stroke();
		
		
		last = Q.snake.body[Q.snake.body.length-1]
		if((last[0] == Q.food[0]) && (last[1] == Q.food[1])){
			Q.snake.just_eaten = 2;
			Q.food = [Math.floor(Math.random() * Q.game_dim[0]),Math.floor(Math.random() * Q.game_dim[1])]
		} else {
			Q.snake.just_eaten =Math.max(0, Q.snake.just_eaten-1);
		}

		let lose = false
		for (let i = 0; i < Q.snake.body.length - 1; i ++) {
			for (let j = i + 1; j < Q.snake.body.length; j++) {
				if (Q.snake.body[i][0] == Q.snake.body[j][0] && Q.snake.body[i][1] == Q.snake.body[j][1]) {
					lose = true
				}
			}
		}
		if (lose) Q.reset()
		
		//let cont=true;
		//last = Q.snake.body[Q.snake.body.length-1]
		//for(let i = 0; i < Q.snake.body.length-1; i++){
		//	if((last[0] == Q.snake.body[i][0]) && (last[1] == Q.snake.body[i][1])){
		//		//Q.snake.body = [[Q.snake.body[Q.snake.body.length-2][0],Q.snake.body[Q.snake.body.length-2][1]],[last[0],last[1]]];
		//		cont = false;
		//		break;
		//	}
		//}
		setTimeout(Q.draw,120000/1000);
		
	},
	init:function(){
		window.addEventListener("keydown",function(e){
			if(e.key == "ArrowUp" || e.key == "w" || e.key == "W") {
				Q.pressedKeys.up = true;
				if(Q.snake.direction[1] != 1) Q.snake.next_direction = [0,-1];
			}
			if(e.key == "ArrowDown" || e.key == "s" || e.key == "S") {
				Q.pressedKeys.down = true;
				if(Q.snake.direction[1] != -1) Q.snake.next_direction = [0,1];
			}
			if(e.key == "ArrowLeft" || e.key == "a" || e.key == "A") {
				Q.pressedKeys.left = true;
				if(Q.snake.direction[0] != 1) Q.snake.next_direction = [-1,0];
			}
			if(e.key == "ArrowRight" || e.key == "d" || e.key == "D") {
				Q.pressedKeys.right = true;
				if(Q.snake.direction[0] != -1) Q.snake.next_direction = [1,0];
			}
		});
		window.addEventListener("keyup",function(e){
			if(e.keyCode == 38) Q.pressedKeys.up = false;
			if(e.keyCode == 40) Q.pressedKeys.down = false;
			if(e.keyCode == 37) Q.pressedKeys.left = false;
			if(e.keyCode == 39) Q.pressedKeys.right = false;
		});
		document.getElementById("mainCanvas").focus();
		setTimeout(Q.draw,80000/1000);
		
	},
};



Q.init();
