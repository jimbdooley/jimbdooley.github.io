const borderTolerance = 0.000000001;

booger = false;
sumsegs= [];
function dotInShape(ID,coords,tick,borderID){
	switch(game.borders[borderID].type){
		case 'polygon':
			var testSeg = new segment(game.chars[ID].x,game.chars[ID].y,10000000,game.chars[ID].y);
			var count = 0;
			for(let i = 0; i<coords.length; i++){
				if(i==coords.length-1){
					j = 0;
				} else {
					j = i+1;
				}
				var coordSeg = new segment(coords[i][0],coords[i][1],coords[j][0],coords[j][1]);
				if((ID==5)&&(booger==true)){
				console.log(testSeg);
				console.log(coordSeg);
				sumsegs.push(testSeg);
				sumsegs.push(coordSeg);
				}
				if(intersectSegSeg(testSeg,coordSeg)[0]){
					count+=1;
				}
			}	
			if(count%2 == 1){
				game.chars[ID].lastCollision = borderID;
				game.chars[ID].direction = game.borders[borderID].normal+randomDirection()/2;
				game.chars[ID].yComp = Math.sin(game.chars[ID].direction);
				game.chars[ID].xComp = Math.cos(game.chars[ID].direction);
				pushNode(ID,tick);
				game.chars[ID].distance = randomDistance();
			}
			break;
		case 'circle':
			if(!game.borders[borderID].external){
				xDistance = game.chars[ID].x - game.borders[borderID].x;
				yDistance = game.chars[ID].y - game.borders[borderID].y;
				sDistance = Math.pow(xDistance,2)+Math.pow(yDistance,2);
				rDistance = Math.pow(game.borders[borderID].radius,2);
				if(sDistance <= rDistance){
					game.chars[ID].lastCollision = borderID;
					let tempNormal = game.borders[borderID].normal(game.chars[ID].x,game.chars[ID].y);
					game.chars[ID].direction = tempNormal + randomDirection();
					game.chars[ID].yComp = Math.sin(game.chars[ID].direction);
					game.chars[ID].xComp = Math.cos(game.chars[ID].direction);
					pushNode(ID,tick);
					game.chars[ID].distance = randomDistance();
				}
			}
			if(game.borders[borderID].external){
				xDistance = game.chars[ID].x - game.borders[borderID].x;
				yDistance = game.chars[ID].y - game.borders[borderID].y;
				sDistance = Math.pow(xDistance,2)+Math.pow(yDistance,2);
				rDistance = Math.pow(game.borders[borderID].radius,2);
				if(sDistance >= rDistance){
					game.chars[ID].lastCollision = borderID;
					let tempNormal = game.borders[borderID].normal(game.chars[ID].x,game.chars[ID].y);
					game.chars[ID].direction = tempNormal + randomDirection()/2;
					game.chars[ID].yComp = Math.sin(game.chars[ID].direction);
					game.chars[ID].xComp = Math.cos(game.chars[ID].direction);
					pushNode(ID,tick);
					game.chars[ID].distance = randomDistance();
				}
			}
			break;
	}
}



//returns a, b & c for a line of the form:  ax + by + c = 0
function lineFromSeg(seg){
	
	//if the segment is just a point, then this will also be a point
	if(seg.shape === 'point') {
		return seg;
	}
	
	this.seg = seg;
	this.shape = 'line';
	this.a = seg.y2 - seg.y1;
	this.b = seg.x1 - seg.x2;
	this.c = - this.a*seg.x1 - this.b*seg.y1;
	return this;
}



//defines a circle
function circle(x,y,radius){
	this.shape = 'circle';
	this.x = x;
	this.y = y;
	this.radius = radius;
	return this;
}


//defines a segment from the 2 endpoints.
function segment(x1,y1,x2,y2){
	this.shape = ((x1===x2)&&(y1===y2)) ? 'point' : 'segment';
	
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
	
	this.getY = function(x){
		if(this.x1===this.x2) return null;
		switch(x){
			case this.x1:
				return this.y1;
				break;
			case this.x2:
				return this.y2;
				break;
		}
	}
	this.getX = function(y){
		if(this.y1===this.y2) return null;
		switch(y){
			case this.y1:
				return x1;
				break;
			case this.y2:
				return x2;
				break;
		}
	}
	
	return this;
}


//like a segment but the order matters
function vector(x1,y1,x2,y2){
	this.shape = ((x1===x2)&&(y1===y2)) ? 'point' : 'vector';
	let slope = (y2-y1)/(x2-x1);
	this.angle = x1>x2 ? Math.PI+Math.atan(slope) : Math.atan(slope);
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
	return this;
}



function intersectSegSeg( seg1 , seg2 ){
	if( seg1.shape === 'point' || seg2.shape === 'point' ) return [false];
	var line1 = new lineFromSeg(seg1);
	var line2 = new lineFromSeg(seg2);
	
	
	var lineIntersection = intersectLineLine( line1 , line2 );
	if(lineIntersection[0]===false) {
		return [false];
	}
	
	var x = lineIntersection[1][0];
	var y = lineIntersection[1][1];
	
	if(x <= Math.max( seg1.x1 , seg1.x2 )+borderTolerance){
	 if(x <= Math.max( seg2.x1 , seg2.x2 )+borderTolerance){
	  if(x >= Math.min( seg1.x1 , seg1.x2 )-borderTolerance){
	   if(x >= Math.min( seg2.x1 , seg2.x2 )-borderTolerance){
		if(y <= Math.max( seg1.y1 , seg1.y2 )+borderTolerance){
		 if(y <= Math.max( seg2.y1 , seg2.y2 )+borderTolerance){
		  if(y >= Math.min( seg1.y1 , seg1.y2 )-borderTolerance){
		   if(y >= Math.min( seg2.y1 , seg2.y2 )-borderTolerance){
			return [ true , lineIntersection[1] ];
		   }
		  }
		 }
		}
	   }
	  }
	 }
	}
	return [false];	
}



//returns [true, point of intersection] if it exists
//returns [false, 'info'] in other cases
function intersectLineLine( line1 , line2 ){
	
	let determinant = line1.a*line2.b - line2.a*line1.b;
	
	if (determinant === 0) { 
		if( (line1.a/line1.b)===(line2.a/line2.b) ){
			if( (line1.c/line1.b)===(line2.c/line2.b) ){
				return [false,"identical"];
			}
		}
		if((line1.seg.x1===line1.seg.x2)&&(line1.seg.x2===line2.seg.x1)&&(line2.seg.x1===line2.seg.x2)){
			return [false,"identical"];
		}
		if((line1.seg.y1===line1.seg.y2)&&(line1.seg.y2===line2.seg.y1)&&(line2.seg.y1===line2.seg.y2)){
			return [false,"identical"];
		}
		return [false,"parallel"]; 
	}
	
	x = (line1.b*line2.c - line2.b*line1.c)/determinant;
	y = (line2.a*line1.c - line1.a*line2.c)/determinant;
	return [true,[x,y]];
}








