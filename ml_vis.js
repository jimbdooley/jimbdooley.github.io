

function invert(func, func_inv){
	let max_row = 0;
	for(let i = 0; i<func.length; ++i){
		max_row = Math.max(max_row, func[i].length);
	}
	for(let i = 0; i<max_row; ++i){
		for(let j = 0; j < func.length;++j){
			func_inv[i][j] = 0
		}
	}
	for(let i= 0; i<func.length; ++i){
		for(let j = 0; j<func[i].length; ++j){
			func_inv[j][i] = func[i][j];
		}
	}
}

const find_roots = (() => {
    const derivatives = []
    return function(zeros, one_d_func,min,max,error){
        while (zeros.length > 0) zeros.pop()
        let flats = [];
        if (one_d_func.length < 2) return
        if(one_d_func.length == 2){
            let z = -one_d_func[0]/one_d_func[1];
            if ((z<=max)&&(z>=min)){
                zeros.push(z);
                return;
            }
            else{
                return;
            }
        }
        else{
            for (let i = derivatives.length; i < one_d_func.length-1; i++) {
                const temp = []
                for (let j = 0; j <= i; j++) {
                    temp.push(0)
                }
                derivatives.push(temp)
            }
            derivative(one_d_func, derivatives[one_d_func.length-2])
            find_roots(flats,derivatives[one_d_func.length-2],min,max,error);
        }
        flats.unshift(min);
        flats.push(max);
        for(let i = 0; i<flats.length-1; ++i){
            if(evaluate(one_d_func,flats[i])*evaluate(one_d_func,flats[i+1]) < 0){
                zeros.push(intersect(one_d_func,flats[i],flats[i+1],error));
            }
        }
    }
})();



function intersect(func,min,max, error){
	let min_val = evaluate(func, min);
	let max_val = evaluate(func, max);
	if( min_val*max_val > 0 ) return;
	if (( min_val > -error )&&( min_val < error )) return min;
	if (( max_val > -error )&&( max_val < error )) return max;
	let mid_val = 0;
	let mid= 0;
	while(true){
		mid = min + (max-min)*Math.abs(min_val)/Math.abs(max_val-min_val);
		mid_val = evaluate(func,mid);
		if ((mid_val >= -error)&&(mid_val <= error)){
			return mid;
		}			
		if (mid_val < -error){
			if (min_val < 0){
				min = mid;
				min_val = mid_val;
			}
			if (max_val < 0){
				max = mid;
				max_val = mid_val;
			}
		}
		if (mid_val > error){
			if (min_val < 0){
				max = mid;
				max_val = mid_val;
			}
			if (max_val < 0){
				min = mid;
				min_val = mid_val;
			}
		}
	} 
}


function evaluate(one_d_func,x){
	let rtn = 0;
	for(let i = 0; i<one_d_func.length; ++i){
		rtn  += one_d_func[i]*Math.pow(x,i);
	}
	return rtn;
}


function derivative(func, res){
	for(let i = 0; i < func.length-1; ++i){
		res[i] = func[i+1]*(i+1);
	}
}


function plug_in_x(func, x_val, one_d_func){
	let highest_y = 0;
	for(let i = 0; i<func.length; ++i){
		highest_y = Math.max(func[i].length-1,highest_y);
	}
	while (one_d_func.length > 0) one_d_func.pop()
	for(let i = 0; i <= highest_y; ++i){
		one_d_func.push(0);
	}
	for(let x = 0; x < func.length; ++x){
		for(let y = 0; y<func[x].length; ++y){
			one_d_func[y] += func[x][y]*Math.pow(x_val,x)
		}
	}
	while(one_d_func[one_d_func.length-1]==0){
		one_d_func.pop();
	}
	for(let i = 0; i<one_d_func.length-1; ++i){
		one_d_func[i] /= one_d_func[one_d_func.length-1];
	}
	
	one_d_func[one_d_func.length-1] = 1;
}


function show(func){
	var s = ""
	let first = true;
	for(let x = 0; x<func.length; ++x){
		for(let y = 0; y < func[x].length; ++y){
			if(func[x][y] != 0){
				if(!first){
					if(func[x][y] >= 0){
						s = s.concat("+")
					}
				}
				first = false;
				s = s.concat((func[x][y]).toFixed(2))
				if(x ==1){
					s = s.concat("x")
				}
				if(x > 1){
					s = s.concat("(x^" + x.toString() + ")")
				}
				if(y ==1){
					s = s.concat("y")
				}
				if(y > 1){
					s = s.concat("(y^" + y.toString() + ")")
				}
			}
		}
	}
	console.log(s);
}

var logisticCanvas = document.getElementById("logisticCanvas");
var logisticCtx = logisticCanvas.getContext("2d");
var ERROR = 0.00000001;

var RL = {
	
	data:{
		more() {
			for (const arr of [RL.data.p, RL.data.n]) {
				toAdd = []
				for (const datum of arr) {
					for (let i = 0; i < 5; i++) {
						toAdd.push([datum[0] + 0.92 * Math.random(), datum[1] + 0.92 * Math.random()])
					}
 				}
				for (const datum of toAdd) {
					arr.push(datum)
				}
			}
		},
		circleData() {
			for (let i = 0; i < 20; i++) {
				const thP = 2*Math.PI*Math.random()
				const rP = Math.random()
				RL.data.p.push([rP * Math.cos(thP), rP * Math.sin(thP)])
				const thN = 2*Math.PI*Math.random()
				const rN = 2 + Math.random()
				RL.data.n.push([rN * Math.cos(thN), rN * Math.sin(thN)])
			}
		},
		randomData() {
			for(let i = 0; i<8; ++i){
				if(Math.random()<0.5){
					RL.data.p.push([5*(1-2*Math.random()),3*(1-2*Math.random())]);
				}
				else{
					RL.data.n.push([5*(1-2*Math.random()),3*(1-2*Math.random())]);
				}
			}
			RL.data.more()
		},
		nextI: Math.floor(2*Math.random()),
		set:function(){
			RL.data.p = []
			RL.data.n = []
			const funcs = [
				RL.data.circleData,
				RL.data.randomData,
			]
			RL.data.nextI = (RL.data.nextI + 1) % funcs.length
			funcs[RL.data.nextI]()
		},
		show:function(){
			let oldWidth = logisticCtx.lineWidth;
			logisticCtx.lineWidth = 1.5;
			
			logisticCtx.strokeStyle = "green";
			for(let i = 0; i<RL.data.p.length; ++i){
				let x = RL.screen.W*(RL.data.p[i][0]-RL.screen.limits[0][0])/(RL.screen.limits[1][0]-RL.screen.limits[0][0]);
				let y = RL.screen.H*(1-(RL.data.p[i][1]-RL.screen.limits[0][1])/(RL.screen.limits[1][1]-RL.screen.limits[0][1]));
				logisticCtx.beginPath();
				logisticCtx.arc(x, y, 4, 0, 2 * Math.PI);
				logisticCtx.stroke();
			}
			
			let X_size = 5;
			logisticCtx.strokeStyle = "red";
			for(let i = 0; i<RL.data.n.length; ++i){
				let x = RL.screen.W*(RL.data.n[i][0]-RL.screen.limits[0][0])/(RL.screen.limits[1][0]-RL.screen.limits[0][0]);
				let y = RL.screen.H*(1-(RL.data.n[i][1]-RL.screen.limits[0][1])/(RL.screen.limits[1][1]-RL.screen.limits[0][1]));
				logisticCtx.beginPath();
				logisticCtx.moveTo(x+X_size, y+X_size);
				logisticCtx.lineTo(x-X_size, y-X_size);
				logisticCtx.stroke();
				logisticCtx.beginPath();
				logisticCtx.moveTo(x+X_size, y-X_size);
				logisticCtx.lineTo(x-X_size, y+X_size);
				logisticCtx.stroke();
			}
			logisticCtx.strokeStyle = "black";
			logisticCtx.lineWidth = oldWidth;
		},
		p:[],
		n:[],
	},
	
	learn:{
		order:3,
		rate: 0.03,
		func:[],
        func_inv:[],
		derivative: [],
		get_step:function() {
			const m = RL.data.p.length + RL.data.n.length
			for (let i = 0; i < RL.learn.func.length; i++) {
				for (let j = 0; j < RL.learn.func[i].length; j++) {
					RL.learn.derivative[i][j] = 0
				}
			}
			for (const datum of RL.data.p) {
				for (let i = 0; i < RL.learn.func.length; i++) {
					for (let j = 0; j < RL.learn.func[i].length; j++) {
						RL.learn.derivative[i][j] -= 1*RL.learn.rate * RL.costDerivative(i, j, datum[0], datum[1], m, 1)
					}
				}
			}
			for (const datum of RL.data.n) {
				for (let i = 0; i < RL.learn.func.length; i++) {
					for (let j = 0; j < RL.learn.func[i].length; j++) {
						RL.learn.derivative[i][j] -= 1*RL.learn.rate * RL.costDerivative(i, j, datum[0], datum[1], m, 0)
					}
				}
			}
		},
		
		descend:function(){
			RL.learn.get_step();
			const delta = RL.learn.derivative
			for(let i = 0; i<RL.learn.func.length; ++i){
				for(let j = 0; j<RL.learn.func[i].length; ++j){
					RL.learn.func[i][j] += delta[i][j];
				}
			}
		},

		evaluate(x, y) {
			let rtn = 0
			for(let i = 0; i<RL.learn.func.length; ++i){
				for(let j = 0; j<RL.learn.func[i].length; ++j){
					rtn += RL.learn.func[i][j] * Math.pow(x, i) * Math.pow(y, j) 
				}
			}
			const rtn2 = 1 / (1 + Math.pow(2.718281828, -rtn))
			return rtn2
		},
		
		init:function(){
			RL.learn.rate = 0.03
			RL.learn.func = []
            RL.learn.func_inv = []
			RL.learn.derivative = []
			for(let i =0; i <= RL.learn.order; ++i){
				let temp = [];
				let dTemp = [];
				for(let j = 0; j <= RL.learn.order-i; ++j){
					temp.push(Math.random());
					dTemp.push(0)
				}
				RL.learn.derivative.push(dTemp)
				RL.learn.func.push(temp);
                let temp_inv = []
                for (let j = 0; j <= RL.learn.order; ++j) {
                    temp_inv.push(0)
                }
                RL.learn.func_inv.push(temp_inv)
			}
		},
	},
	
	screen:{
		W:0,
		H:0,
		limits:[[-6,-4],[6,4]],
	},

	costDerivative(thI, thJ, x, y, m, Y) {
		
		const evaled = this.learn.evaluate(x, y)

		return Math.pow(x, thI) * Math.pow(y, thJ) * (evaled - Y)/ m

	},

	cost() {
		let rtn = 0
		const m = this.data.p.length + this.data.n.length
		for (const datum of this.data.p) {
			rtn -= Math.log(this.learn.evaluate(datum[0], datum[1]))
		}
		for (const datum of this.data.n) {
			const evalRes =this.learn.evaluate(datum[0], datum[1])
			const t = Math.log(1 - evalRes)
			rtn -= t
		}
		rtn /= m
		if (rtn == Infinity) {
			console.log("INFINITY")
			rtn = 9999
		}
		if (rtn == -Infinity) {
			console.log("NEGATIVE  INFINITY")
			rtn = -9999
		}
		return rtn
	},
    plotZeros: [],
    one_d_func: [],
    one_d_func_inv: [],
	plot:function(func, func_inv){
	
		logisticCtx.clearRect(0,0,logisticCanvas.width, logisticCanvas.height);
		
		for(let i = RL.screen.limits[0][0]; i <= RL.screen.limits[1][0]; i += 0.06){
			plug_in_x(func,i, this.one_d_func);
			find_roots(this.plotZeros, this.one_d_func,RL.screen.limits[0][1],RL.screen.limits[1][1],ERROR);
            for(let j = 0; j< this.plotZeros.length; ++j){
				RL.draw_dot(i,this.plotZeros[j]);
			}
		}
        
		invert(func, func_inv);
		
		for(let i = RL.screen.limits[0][1]; i<= RL.screen.limits[1][1]; i+= 0.04){
			plug_in_x(func_inv,i, this.one_d_func_inv);
			find_roots(this.plotZeros, this.one_d_func_inv,RL.screen.limits[0][0],RL.screen.limits[1][0],ERROR);
			for(let j = 0; j< this.plotZeros.length; ++j){
				RL.draw_dot(this.plotZeros[j],i);
			}
		}
	},
	
	draw_dot:function(x,y){
		let x2 = RL.screen.W*(x-RL.screen.limits[0][0])/(RL.screen.limits[1][0]-RL.screen.limits[0][0]);
		let y2 = RL.screen.H*(1-(y-RL.screen.limits[0][1])/(RL.screen.limits[1][1]-RL.screen.limits[0][1]));
		logisticCtx.fillRect(x2-0.5,y2-0.5,2,2);
	},
	
	init:function(){
		RL.screen.H = logisticCanvas.height;
		RL.screen.W = logisticCanvas.width;
		RL.data.set();
		RL.learn.init();
	},
	
}


function RL_loop() {
	setTimeout(RL_loop, 50)
    if (!ENABLES.ml_anims) return
	RL.learn.descend()
	RL.plot(RL.learn.func, RL.learn.func_inv)
	RL.data.show()
	RL.learn.rate = Math.max(0.0015, RL.learn.rate*0.9995)
	document.getElementById("logistic_regression_cost").innerHTML = `cost: ${RL.cost().toFixed(6)}`
	document.getElementById("logistic_regression_learn_rate").innerHTML = `learn_rate: ${RL.learn.rate.toFixed(6)}`
}
RL.init();
RL_loop()

var D = {
	
	stats:{
		buffer:0.2,
		framesPerSec:50,
		itersPerFrame:100
	},
	
	screen:{
		H:0,
		W:0
	},
	
	draw_line:function(path, width, color){
		lr2Ctx.lineWidth = width;
		lr2Ctx.strokeStyle = color
		lr2Ctx.beginPath();
		lr2Ctx.moveTo(path[0][0], path[0][1]);
		for(let i = 1; i < path.length; ++i){
			lr2Ctx.lineTo(path[i][0], path[i][1]);
		}
		lr2Ctx.stroke();
		lr2Ctx.lineWidth = 0.5;
		lr2Ctx.strokeStyle = 'black'
	},

	set_limits:function(points){
		minX = points[0][0];
		maxX = points[0][0];
		minY = points[0][1];
		maxY = points[0][1];
		for (let i= 1; i<points.length; ++i){
			minX = Math.min(minX, points[i][0]);
			maxX = Math.max(maxX, points[i][0]);
			minY = Math.min(minY, points[i][1]);
			maxY = Math.max(maxY, points[i][1]);
		}
		xDif = maxX-minX;
		yDif = maxY-minY;
		return [ [minX - D.stats.buffer * xDif, minY - D.stats.buffer * yDif ],
				 [maxX + D.stats.buffer * xDif, maxY + D.stats.buffer * yDif ]];
		
	},

	draw_circle:function(center,diameter,border,inside){
		lr2Ctx.strokeStyle = border;
		lr2Ctx.beginPath();	
		lr2Ctx.arc(center[0],center[1],diameter,0,2*Math.PI);
		lr2Ctx.fillStyle = inside;
		lr2Ctx.fill();
		lr2Ctx.stroke();
		lr2Ctx.strokeStyle = 'black';
		lr2Ctx.fillStyle = 'black';
	},
	
	set_virtual_point:function(pointToSet, real_point, limits){
		pointToSet[0] = D.screen.W*(0+((real_point[0]-limits[0][0]) / (limits[1][0]-limits[0][0])));
		pointToSet[1] = D.screen.H*(1-((real_point[1]-limits[0][1]) / (limits[1][1]-limits[0][1])));
	},

	graph:function(myFunc, limits){
		let gap = 3;
		let offsetX = limits[0][0];
		let offsetY = limits[0][1];
		let scaleX = (limits[1][0]-limits[0][0])/D.screen.W;
		let scaleY = (limits[1][1]-limits[0][1])/D.screen.H;
		let step = (limits[1][0] - limits[0][0])*gap/D.screen.W;
		lr2Ctx.lineWidth = 3;
		lr2Ctx.strokeStyle = 'black'
		lr2Ctx.beginPath();
		lr2Ctx.moveTo(0,D.screen.H-(myFunc(0+offsetX)-offsetY)/scaleY);
		for(let x = step; x < D.screen.W+step; x+=step){
			lr2Ctx.lineTo(x, D.screen.H-(myFunc(x*scaleX+offsetX)-offsetY)/scaleY);
		}
		lr2Ctx.stroke();
	},

    plotNewPoints: [],
	plot:function(points, myFunc){
		limits = D.set_limits(points);
        while (this.plotNewPoints.length > points.length) this.plotNewPoints.pop()
        while (this.plotNewPoints.length < points.length) this.plotNewPoints.push([0, 0])
		for(let i = 0; i < points.length; ++i){
            D.set_virtual_point(this.plotNewPoints[i], points[i], limits)
		}
		for(let i = 0; i<this.plotNewPoints.length; ++i){
			D.draw_circle(this.plotNewPoints[i], Math.min(5,Math.max(1,100/points.length)), 'red','red')
		}
		D.graph(myFunc, limits);
		
	},
	
	init:function(){
		D.screen.H = document.getElementById("lr2Canvas").height + 0;
		D.screen.W = document.getElementById("lr2Canvas").width + 0;
	}
}


var L = {
	
	data:{
		starting_step_size:0.005,
		step_size:0,
		order:5,
		thetas:[],
		func:function(){},
		t0_error:[],
		m:0,
		raw:[],
		normalized:[],
		X:[],
		Y:[],
		meanX:0,
		meanY:0,
		stdevX:0,
		stdevY:0
	},
	
	//extract data here
	//must return an array of 2d points; e.g. [ [5.0, 2.1], [2.5, -1], [6.2, 6.3], [8.2, 8.1] ]
	getData:function(){
		return get_some_data()
	},
	
	
	//transforms the data so the average=0 and stdev=1 for all dimensions
	//the new data is placed in: L.data.normalized	
	normalizeData:function(){
		L.data.meanX = 0;
		L.data.meanY = 0;
		for(let i = 0; i<L.data.m;++i){
			L.data.meanX += L.data.raw[i][0]/L.data.m;
			L.data.meanY += L.data.raw[i][1]/L.data.m;
		}
		
		let sumX = 0;
		let sumY = 0;
		for(let i = 0; i<L.data.m;++i){
			sumX += Math.pow(L.data.raw[i][0] - L.data.meanX,2);
			sumY += Math.pow(L.data.raw[i][1] - L.data.meanY,2);
		}
		sumX /= L.data.m;
		sumY /= L.data.m;
		L.data.stdevX = Math.sqrt(sumX);
		L.data.stdevY = Math.sqrt(sumY);
		for(let i = 0; i<L.data.m;++i){
			L.data.normalized.push([(L.data.raw[i][0] - L.data.meanX)/L.data.stdevX, 
									 (L.data.raw[i][1] - L.data.meanY)/L.data.stdevY]);
		}
		for(let i = 0; i<L.data.normalized.length; ++i){
			temp = [];
			for(let j = 0; j <= L.data.order; ++j){
				temp.push(Math.pow( L.data.normalized[i][0] , j));
			}
			L.data.X.push(temp);
			L.data.Y.push(L.data.normalized[i][1]);
		}
	},
	
	//returns the quadratic equation (from thetas) as a function
	makeFunc:function(){
		return function(x){
			let sm=0;
			for (let i = 0; i< L.data.order+1; ++i){
				sm += L.data.thetas[i]*Math.pow(x, i);
			}
			return sm;
		}
	},
	
	
	//calculates the partial derivative of error
	dedt:function(denom){
		let dedt_sum = 0;
		for(let i = 0; i < L.data.m; ++i){
			tempsum = 0;
			for(let j = 0; j <= L.data.order; ++j){
				tempsum += L.data.X[i][j]*L.data.thetas[j];
			}
			tempsum -= L.data.Y[i];
			tempsum *= 2;
			tempsum *= Math.pow(L.data.normalized[i][0], denom);
			dedt_sum += tempsum;
		}
		return dedt_sum / L.data.m;
	},
	
	
	
	init:function(){
		L.data.X = []
		L.data.normalized = []
		L.data.Y = []
		L.data.raw = L.getData();
		L.data.m = L.data.raw.length;
		L.normalizeData();
		L.data.thetas = []
		for(let j = 0; j<L.data.order+1; ++j){
			L.data.thetas.push(2*Math.random()-1);
		}
		L.data.func=L.makeFunc();
		L.data.step_size = L.data.starting_step_size;
		
	},
};

var lr2Canvas = document.getElementById("lr2Canvas");
var lr2Ctx = lr2Canvas.getContext("2d");

function get_some_data(){
	let rtn = [];
	for(let i = 0 ;i<6; ++i){
		let x = 0.5 - Math.random();
		rtn.push([i,Math.random()])
	}
	//rtn.push([10,1.8])
	return rtn;
}


var controller = {
	
	oneFrame:function(){
		setTimeout(controller.oneFrame, 1000/D.stats.framesPerSec);
        if (!ENABLES.ml_anims) return
		
		lr2Ctx.clearRect(0,0,lr2Canvas.width, lr2Canvas.height);
		
		for(let i = 0; i < D.stats.itersPerFrame; ++i){
			for(let j = 0; j <= L.data.order; ++j){
                L.data.thetas[j] -= L.data.step_size*L.dedt(j)
			}
		}
		
		D.plot(L.data.normalized,L.data.func);
		
	},
	
	init:function(){
		L.init()
		D.init();
	}
}


controller.init();
controller.oneFrame();

const linePlaneIntersect = (() => {
    const lineVector = [0, 0, 0]
    const difference = [0, 0, 0]
    return function(intersection, planeNormal, planePoint, linePointOne, linePointTwo){
        //solve for d = ( (planePoint - linePointOne) dot planeNormal ) / (vector_in_direction_of_line dot planeNormal) 
        //from https://en.wikipedia.org/wiki/Line%E2%80%93plane_intersection
        for(let i = 0; i<linePointOne.length; i++){
            lineVector[i] = (linePointTwo[i] - linePointOne[i]);
        }
        let denom = dotProduct(lineVector, planeNormal);
        if (denom === 0) return [10000,10000,10000]; //line/plane are parallel, return a value guaranteed to be off-screen
        for(let i = 0; i<linePointOne.length; i++){
            difference[i] = (planePoint[i] - linePointTwo[i]);
        }
        let numerator = dotProduct(difference, planeNormal);
        if (numerator === 0) return [10000,10000,10000]; //I think this means the line is in the plane, should also be off screen?
        let d = numerator/denom;
        for(let i = 0; i<linePointOne.length; i++){
            intersection[i] = (d*lineVector[i] + linePointTwo[i]);
        }
    }
})();

function dotProduct(v1, v2){
	if(v1.length !== v2.length) console.log("different size vectors");
	let sum = 0;
	for(let i = 0; i<v1.length; ++i){
		sum += v1[i]*v2[i];
	}
	return sum;
}


function draw_circle(center,diameter,border,inside){
    h_lr3dCtx.strokeStyle = border;
	h_lr3dCtx.beginPath();	
	h_lr3dCtx.arc(center[0],center[1],diameter,0,2*Math.PI);
	h_lr3dCtx.fillStyle = inside;
	h_lr3dCtx.fill();
	h_lr3dCtx.stroke();
	h_lr3dCtx.strokeStyle = 'black';
	h_lr3dCtx.fillStyle = 'black';
}

function draw_line(path, width, color){
	h_lr3dCtx.lineWidth = width;
	h_lr3dCtx.strokeStyle = color
	h_lr3dCtx.beginPath();
	h_lr3dCtx.moveTo(path[0][0], path[0][1]);
	for(let i = 1; i < path.length; ++i){
		h_lr3dCtx.lineTo(path[i][0], path[i][1]);
	}
	h_lr3dCtx.stroke();
	h_lr3dCtx.lineWidth = 0.5;
	h_lr3dCtx.strokeStyle = 'black'
}

const plot3d = (() => {
    const points3d = []
    const plane_point = [0, 0, 0]
    return function(points2d, points, data){
        for(let i = 0; i < 3; ++i){	
            plane_point[i] = (TD.viewer.loc[i] + TD.viewer.d*TD.viewer.gaze[i]);
        }
        let sin_pitch = Math.sin( Math.atan( -TD.viewer.gaze[2] / Math.sqrt(1-Math.pow(TD.viewer.gaze[2],2)) ) );
        let cos_pitch = Math.cos( Math.atan( -TD.viewer.gaze[2] / Math.sqrt(1-Math.pow(TD.viewer.gaze[2],2)) ) )
        max_z = plane_point[2] +sin_pitch*TD.viewer.d*TD.viewer.alpha;
        min_z = plane_point[2] -sin_pitch*TD.viewer.d*TD.viewer.alpha;
        while (points3d.length < points.length) points3d.push([0, 0, 0])
        for(let i = 0; i<points.length; ++i){
            linePlaneIntersect(points3d[i], TD.viewer.gaze, plane_point, TD.viewer.loc, points[i])
        }
        
        
        while (points2d.length < points.length) points2d.push([0, 0])
        for(let i = 0; i <  points.length; ++i){
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
            points2d[i][0] = screen_x
            points2d[i][1] = screen_y
        }
    }
})();



var lr3dCanvas = document.getElementById("lr3dCanvas");
var h_lr3dCanvas = document.getElementById("h_lr3dCanvas");
var lr3dCtx = lr3dCanvas.getContext("2d");
var h_lr3dCtx = h_lr3dCanvas.getContext("2d");




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
	
	
	lineToDrawA: [],
	lineToDrawB: [],
    data2d: [],
    grid: [],
	draw:function(){
		
		
		let step = 0.125
		let range = 1.4
        let rowCount = 0
		for (let i = -range; i<=range+0.05; i+=step ){
            if (this.grid.length <= rowCount) this.grid.push([])
            let colCount = 0
			for(let j = -range; j<=range+0.05 ; j+= step){
                if (this.grid[rowCount].length <= colCount) this.grid[rowCount].push([0, 0, 0])
                this.grid[rowCount][colCount][0] = i
                this.grid[rowCount][colCount][1] = j
                this.grid[rowCount][colCount][2] = TD.func(i, j)

                colCount++
			}
            rowCount ++
		}
		
		let hang_off = 1;
		for(let i = hang_off; i<this.grid.length-hang_off; ++i){
            plot3d(this.lineToDrawA, this.grid[i])
			draw_line(this.lineToDrawA, 3, 'black');
		}
		for(let i = hang_off; i < this.grid[0].length-hang_off; ++i){
			let temp= [];
			for(let j = 0; j < this.grid.length; ++j){
				temp.push(this.grid[j][i]);
			}
            plot3d(this.lineToDrawB, temp)
			draw_line(this.lineToDrawB,3,'black');;
		}
		
        
		plot3d(this.data2d, TD.learn.data);
		for(let i = 0; i < this.data2d.length; ++i){
			draw_circle(this.data2d[i],5,'black','black');
		}
		TD.update();
		
	},
	
	update:function(){
		lr3dCtx.clearRect(0,0,lr3dCanvas.width, lr3dCanvas.height);
		lr3dCtx.drawImage(h_lr3dCanvas,0,0);
		h_lr3dCtx.clearRect(0,0,h_lr3dCanvas.width, lr3dCanvas.height);
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
		setTimeout(function(){ TD.repeat(); }, 33);
        if (!ENABLES.ml_anims) return
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
		
		
	},
	
	init:function(){
		TD.screen.H = document.getElementById("h_lr3dCanvas").height + 0;
		TD.screen.W = document.getElementById("h_lr3dCanvas").width + 0;
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

