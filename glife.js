
const glife_cl = (() => {
	var c= document.getElementById("glife_canvas");
	var ctx = c.getContext("2d");

	var imgData = ctx.getImageData(0, 0, c.width, c.height);
	var box_width = 3;
	var gh = c.height/box_width;
	var gw = c.width/box_width;


	const games = [[],[]]
	const prob = 0;
	const p0 = [Math.floor(c.width/(2*box_width)),Math.floor(c.height/(2*box_width)),4,[-1, 0, 1, 1, 1, 0, -1, -1],[-1, -1, -1, 0, 1, 1, 1, 0]];
	const turn_prob = 0.1;
	const ps = [];
	for(let i = 0; i < 3; i++){
		ps.push([0,0]);
	}

	var r;
	for(let i = 0; i < c.height; i++){
		temp0 = [];
		temp1 = [];
		for(let j = 0; j < c.width; j++){
			r = Math.random();
			if(r < prob){
				temp0.push(1);
			} else {
				temp0.push(0);
			}
			temp1.push(0);
		}
		games[0].push(temp0);
		games[1].push(temp1);
	}
	p0[2]=1
	var env=0;
	return function() {
		window.requestAnimationFrame(glife_cl);
        if (!ENABLES.doodles) return;
		for(let row = 0; row < gh; row++){
			for(let col = 0; col < gw; col++){
				env = 0;
				env += games[0][(row+gh-1)%gh][(col+gw-1)%gw];
				env += games[0][(row+gh-1)%gh][col];
				env += games[0][(row+gh-1)%gh][(col+1)%gw];
				env += games[0][row][(col+gw-1)%gw];
				env += games[0][row][(col+1)%gw];
				env += games[0][(row+1)%gh][(col+gw-1)%gw];
				env += games[0][(row+1)%gh][col];
				env += games[0][(row+1)%gh][(col+1)%gw];
				if(games[0][row][col] == 1){
					if((env == 2) || (env == 3)){
						games[1][row][col] = 1;
					}
				} else {
					if(env == 3){
						games[1][row][col] = 1;
					}
				}
				
			}
		}
		const temp = games[1];
		games[1] = games[0];
		games[0] = temp;
		
		if(Math.random() < turn_prob) {
			p0[2] = ((p0[2] + (Math.random() > 0.5 ? -1 : 1) + 8 - 1) % 8 + 1) % 8;
		}
		p0[0] = ((p0[0] + p0[3][p0[2]] + gh - 1) % gh + 1) % gh; 
		p0[1] = ((p0[1] + p0[4][p0[2]] + gw - 1) % gw + 1) % gw;
		for(let i = ps.length-1; i > 0; i--){
			ps[i] = ps[i-1];
		}
		ps[0] = [p0[0],p0[1]];
		games[0][p0[0]][p0[1]] = 1;
		for(let i = 0; i < ps.length; i++){
			games[0][ps[i][0]][ps[i][1]] = 1;
		}
		
		for(let i = 0; i < games[1].length; i++){
			for(let j = 0; j < games[1][i].length; j++){
				games[1][i][j] = 0;
			}
		}
		
		
		let state = 0;
		for (let i = 0; i < imgData.data.length; i += 4) {
			row = Math.floor(i / (4*box_width*c.height));
			col = Math.floor((i % (4*c.height))/(4*box_width));
		  imgData.data[i] = 255*games[0][row][col];
		  imgData.data[i+1] = 255*games[0][row][col];
		  imgData.data[i+2] = 255*games[0][row][col];
		  imgData.data[i + 3] = 255;
		}
	
		ctx.putImageData(imgData, 0, 0); 
	}
})();
glife_cl();
