var mainCanvas = document.getElementById("mainCanvas");
var hCanvas = document.getElementById("hCanvas");
var mainCtx = mainCanvas.getContext("2d");
var hCtx = hCanvas.getContext("2d");




var TD = {
	other:{
		count:-50,
	},
	func:function(){},
	screen:{
		H:0,
		W:0,
	},
	
	viewer:{
		yaw:Math.PI/2,
		pitch:Math.atan(-4/Math.sqrt(273)),
		angle_from_horizontal:Math.atan(-4/Math.sqrt(273)),
		distance_from_center:17,
		
		loc:[0,-Math.sqrt(273),4],
		gaze:[0,.8,-0.1],
		d:20,
		alpha:0.2,
		speed:0.01,
		w:0,
		h:0,
		
		rotate_up:function(delta){
			let previous_distance = Math.sqrt(Math.pow(TD.viewer.distance_from_center,2) - Math.pow(TD.viewer.loc[2],2));
			TD.viewer.angle_from_horizontal += delta;
			TD.viewer.angle_from_horizontal = Math.min(TD.viewer.angle_from_horizontal, 0.95*Math.PI/2);
			TD.viewer.angle_from_horizontal = Math.max(TD.viewer.angle_from_horizontal, -0.95*Math.PI/2);
			console.log(TD.viewer.angle_from_horizontal );
			TD.viewer.loc[2] = -TD.viewer.distance_from_center * Math.sin(TD.viewer.angle_from_horizontal);
			let remaining_distance = Math.sqrt(Math.pow(TD.viewer.distance_from_center,2) - Math.pow(TD.viewer.loc[2],2));
			TD.viewer.loc[0] *= remaining_distance/previous_distance;
			TD.viewer.loc[1] *= remaining_distance/previous_distance;
			
			TD.viewer.pitch = TD.viewer.angle_from_horizontal;
			TD.viewer.update_from_pitch_yaw();
			TD.draw();
		},
		
		change_pitch:function(delta){
			TD.viewer.pitch += delta;
			TD.viewer.pitch = Math.min( Math.PI/2,TD.viewer.pitch);
			TD.viewer.pitch = Math.max(-Math.PI/2,TD.viewer.pitch);
			TD.viewer.update_from_pitch_yaw();
		},
		
		change_yaw:function(delta){
			TD.viewer.yaw += delta;
			TD.viewer.update_from_pitch_yaw();
		},
		
		update_from_pitch_yaw:function(){
			TD.viewer.gaze[2] = Math.sin(TD.viewer.pitch);
			let xy_dist = Math.sqrt(1-Math.pow(TD.viewer.gaze[2],2));
			TD.viewer.gaze[0] = xy_dist*Math.cos(TD.viewer.yaw);
			TD.viewer.gaze[1] = xy_dist*Math.sin(TD.viewer.yaw);
			TD.viewer.normalize_gaze();
			TD.viewer.set_hw();
		},
		
		set_hw:function(){
			TD.viewer.h = Math.sqrt(1-Math.pow(TD.viewer.gaze[2],2))*TD.viewer.d*TD.viewer.alpha/2;
			if (TD.viewer.gaze[2] < 0){
				TD.viewer.w = Math.abs(TD.viewer.gaze[2]*TD.viewer.d*TD.viewer.alpha/2);
			}
			else{
				TD.viewer.w = -Math.abs(TD.viewer.gaze[2]*TD.viewer.d*TD.viewer.alpha/2);
			}
		},
		
		normalize_gaze:function(){
			let gaze_d = Math.sqrt(Math.pow(TD.viewer.gaze[0],2) + Math.pow(TD.viewer.gaze[1],2)+ Math.pow(TD.viewer.gaze[2],2));
			for(let i = 0; i < 3; ++i){
				TD.viewer.gaze[i] /= gaze_d;
			}
		},
		
		get_theta_from_center:function(){
			if((TD.viewer.loc[0] >= 0 ) && (TD.viewer.loc[1] >= 0 ) ){
				return Math.atan(TD.viewer.loc[1]/TD.viewer.loc[0]);
			}
			if(TD.viewer.loc[0] < 0){
				return Math.PI + Math.atan(TD.viewer.loc[1]/TD.viewer.loc[0]);
			}
			else{
				return 2*Math.PI + Math.atan(TD.viewer.loc[1]/TD.viewer.loc[0]);
			}
		},
		
		rotate:function(direction){
			let d = Math.sqrt(Math.pow(TD.viewer.loc[0],2) + Math.pow(TD.viewer.loc[1],2));
			let theta = TD.viewer.get_theta_from_center();
			theta += direction*TD.viewer.speed;
			TD.viewer.loc[0] = d*Math.cos(theta);
			TD.viewer.loc[1] = d*Math.sin(theta);
			TD.viewer.yaw = theta-Math.PI;
			TD.viewer.update_from_pitch_yaw();
			
			
		},
		
	},
	
	
	
	draw:function(){
		
		let grid = [];
		
		let step = 0.125
		let range = 1.4
		for (let i = -range; i<=range+0.05; i+=step ){
			temp = [];
			for(let j = -range; j<=range+0.05 ; j+= step){
				temp.push([i, j, TD.func(i, j)]);
			}
			grid.push(temp);
		}
		
		let hang_off = 1;
		for(let i = hang_off; i<grid.length-hang_off; ++i){
			draw_line(plot3d(grid[i]), 3, 'black');
		}
		for(let i = hang_off; i < grid[0].length-hang_off; ++i){
			let temp= [];
			for(let j = 0; j < grid.length; ++j){
				temp.push(grid[j][i]);
			}
			draw_line(plot3d(temp),3,'black');;
		}
		
		let data2d = plot3d(TD.learn.data);
		for(let i = 0; i < data2d.length; ++i){
			draw_circle(data2d[i],5,'black','black');
		}
		TD.update();
		
	},
	
	update:function(){
		mainCtx.clearRect(0,0,mainCanvas.width, mainCanvas.height);
		mainCtx.drawImage(hCanvas,0,0);
		hCtx.clearRect(0,0,hCanvas.width, mainCanvas.height);
	},
	
	learn:{
		set_data:function(dataLoc){
			let rows = 4;
			let adjuster = (rows-1)/2;
			for(let i = 0;i < Math.pow(rows,2); ++i){
				dataLoc.push([(i%rows-adjuster)/adjuster,(Math.floor(i/rows)-adjuster)/adjuster ,2*Math.random()-1]);
			}
		},
		
		
		predict:function(x,y){
			let rtn2 = 0;
			let rtn = 0 
			let temp = 0;
			for(let i = 0; i<TD.learn.theta_count; ++i){
				temp = TD.learn.theta[i];
				for(let j = 0; j < TD.learn.xy_pows[0][i]; ++j){
					temp *= x;
				}
				for(let j = 0; j < TD.learn.xy_pows[1][i]; ++j){
					temp *= y;
				}
				rtn2 += temp;
			}
			
			rtn += TD.learn.theta[0];
			rtn += TD.learn.theta[1]*x;
			rtn += TD.learn.theta[2]*y;
			rtn += TD.learn.theta[3]*x*x;
			rtn += TD.learn.theta[4]*y*y;
			rtn += TD.learn.theta[5]*x*y;
			rtn += TD.learn.theta[6]*x*x*x;
			rtn += TD.learn.theta[7]*x*x*y;
			rtn += TD.learn.theta[8]*x*y*y;
			rtn += TD.learn.theta[9]*y*y*y;
			
			return rtn;
		},
		
		
		de_dt:function(){
			let deltas = [];
			let temp = 0;
			let sm = 0;
			let x = 0;
			let y = 0;
			let z = 0;
			for(let t = 0; t < TD.learn.theta.length; ++t){
				sm = 0;
				for(let i = 0; i<TD.learn.data.length; ++i){
					x = TD.learn.data[i][0];
					y = TD.learn.data[i][1];
					z = TD.learn.data[i][2];
					temp = 2*(TD.learn.predict(x,y)-z);
					if(t == 1){
						temp *= x;
					}
					if(t == 2){
						temp *= y;
					}
					if(t == 3){
						temp *= x*x;
					}
					if(t == 4){
						temp *= y*y;
					}
					if(t == 5){
						temp *= x*y;
					}
					if(t == 6){
						temp *= x*x*x;
					}
					if(t == 7){
						temp *= x*x*y;
					}
					if(t == 8){
						temp *= x*y*y;
					}
					if(t == 9){
						temp *= y*y*y;
					}
					
					sm += temp;
				}
				deltas.push(sm*TD.learn.step_size / TD.learn.data.length);
			}
			return deltas;
		},
		inc:function(){
			let deltas = TD.learn.de_dt();
			for(let i = 0; i<TD.learn.theta.length; ++i){
				TD.learn.theta[i] -= deltas[i];
			}
		},
		step_size:0.005,
		data:[],
		newData:[],
		oldData:[],
		theta_count:10,
		theta:[],
		xy_pows:[[0,1,0,2,1,0,3,2,1,0,4,3,2,1,0,5,4,3,2,1,0,6,5,4,3,2,1,0],
				 [0,0,1,0,1,2,0,1,2,3,0,1,2,3,4,0,1,2,3,4,5,0,1,2,3,4,5,6]],
	},
	
	resetCounter:-50,
	startChangeAt:140,
	endChangeAt:200,
	repeat:function(){
		TD.draw();
		TD.other.count += 1;
		if(TD.other.count >= 0){
			for(let i = 0; i < Math.min(TD.other.count/10,15); ++i){
				TD.learn.inc();
			}
		}
		TD.viewer.rotate(1);
		TD.resetCounter += 1;
		if(TD.resetCounter > TD.endChangeAt){
			for(let i = 0; i < TD.learn.data.length; ++i){
				TD.learn.newData[i] = 2*Math.random()-1;
				TD.learn.oldData[i] = TD.learn.data[i][2];
			}
			TD.resetCounter = 0;
		} else if(TD.resetCounter > TD.startChangeAt){
			let ratio = (TD.resetCounter - TD.startChangeAt) / (TD.endChangeAt - TD.startChangeAt);
			for(let i = 0; i < TD.learn.data.length; ++i){
				TD.learn.data[i][2] = TD.learn.oldData[i] + (TD.learn.newData[i] - TD.learn.oldData[i])*ratio;
			}
		}
		
		
		setTimeout(function(){ TD.repeat(); }, 33);
	},
	
	init:function(){
		TD.screen.H = document.getElementById("hCanvas").height + 0;
		TD.screen.W = document.getElementById("hCanvas").width + 0;
		TD.viewer.update_from_pitch_yaw();
		for(let i = 0; i<TD.learn.theta_count; ++i){
			TD.learn.theta.push(0);
		}
		TD.learn.set_data(TD.learn.data);
		for(let i = 0; i < TD.learn.data.length; i++){
			TD.learn.newData.push(2*Math.random()-1);
			TD.learn.oldData.push(TD.learn.data[i][2]); 
		}
		TD.func = TD.learn.predict;
		TD.repeat();
	},
};

TD.init();

