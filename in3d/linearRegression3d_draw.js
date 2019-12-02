
function draw_circle(center,diameter,border,inside){
    hCtx.strokeStyle = border;
	hCtx.beginPath();	
	hCtx.arc(center[0],center[1],diameter,0,2*Math.PI);
	hCtx.fillStyle = inside;
	hCtx.fill();
	hCtx.stroke();
	hCtx.strokeStyle = 'black';
	hCtx.fillStyle = 'black';
}

function draw_line(path, width, color){
	hCtx.lineWidth = width;
	hCtx.strokeStyle = color
	hCtx.beginPath();
	hCtx.moveTo(path[0][0], path[0][1]);
	for(let i = 1; i < path.length; ++i){
		hCtx.lineTo(path[i][0], path[i][1]);
	}
	hCtx.stroke();
	hCtx.lineWidth = 0.5;
	hCtx.strokeStyle = 'black'
}

function plot3d(points, data){
	let plane_point = [];
	for(let i = 0; i < 3; ++i){	
		plane_point.push(TD.viewer.loc[i] + TD.viewer.d*TD.viewer.gaze[i]);
	}
	let sin_pitch = Math.sin( Math.atan( -TD.viewer.gaze[2] / Math.sqrt(1-Math.pow(TD.viewer.gaze[2],2)) ) );
	let cos_pitch = Math.cos( Math.atan( -TD.viewer.gaze[2] / Math.sqrt(1-Math.pow(TD.viewer.gaze[2],2)) ) )
	max_z = plane_point[2] +sin_pitch*TD.viewer.d*TD.viewer.alpha;
	min_z = plane_point[2] -sin_pitch*TD.viewer.d*TD.viewer.alpha;
	points3d = [];
	for(let i = 0; i<points.length; ++i){
		points3d.push(linePlaneIntersect(TD.viewer.gaze, plane_point, TD.viewer.loc, points[i]));
	}
	
	
	points2d = [];
	for(let i = 0; i <  points3d.length; ++i){
		let temp = [];
		let wp_over_w = (points3d[i][2] - plane_point[2])/TD.viewer.h;
		let xy_distance = Math.sqrt(Math.pow(TD.viewer.gaze[0],2)+Math.pow(TD.viewer.gaze[1],2));
		let xy_gaze = [TD.viewer.gaze[0]/xy_distance, TD.viewer.gaze[1]/xy_distance];
		let lr_dist = TD.viewer.d*TD.viewer.alpha*TD.screen.W/(2*TD.screen.H);
		let right = [plane_point[0]+wp_over_w * TD.viewer.w * xy_gaze[0] + lr_dist*xy_gaze[1], plane_point[1]+wp_over_w * TD.viewer.w * xy_gaze[1] - lr_dist*xy_gaze[0]];
		let left =  [plane_point[0]+wp_over_w * TD.viewer.w * xy_gaze[0] - lr_dist*xy_gaze[1], plane_point[1]+wp_over_w * TD.viewer.w * xy_gaze[1] + lr_dist*xy_gaze[0]];
		let compare_index = 0;
		if( Math.abs(right[0]-left[0]) < Math.abs(right[1]-left[1]) ) compare_index = 1;
		let screen_x = TD.screen.W*(points3d[i][compare_index]-left[compare_index])/(right[compare_index]-left[compare_index]);
		let screen_y = TD.screen.H*(1-(points3d[i][2]-(plane_point[2]-TD.viewer.h))/(2*TD.viewer.h))
		points2d.push([screen_x, screen_y]);
	}
	return points2d;
}





