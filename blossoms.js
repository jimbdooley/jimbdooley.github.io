

var blossom = {
	main_size:0,
	invert:function(aug_path,G){
		for(let i = 0; i<aug_path.length/2; i++){
			G[aug_path[2*i]].partner = aug_path[2*i+1];
			G[aug_path[2*i+1]].partner = aug_path[2*i];
		}
	},
	
	add_match_to_tree:function(G,v,w,wp){
		G[w].mother = v;
		G[wp].mother = w;
		G[w].root = G[v].root;
		G[wp].root = G[v].root;
		G[w].distance = G[v].distance + 1;
		G[wp].distance = G[v].distance + 2;
	},
	
	contract_graph:function(G,v,w){
		var path_to_root_v = [v];
		var path_to_root_w = [w];
		while(G[v].mother !== -1){
			path_to_root_v.push(G[v].mother);
			v = G[v].mother;
		}
		while(G[w].mother !== -1){
			path_to_root_w.push(G[w].mother);
			w = G[w].mother;
		}
		var potential_stem_V;
		while((path_to_root_v.length>0)&&(path_to_root_w.length>0)){
			if (path_to_root_v[path_to_root_v.length-1] === path_to_root_w[path_to_root_w.length-1]){
				potential_stem_V = path_to_root_v[path_to_root_v.length-1];
				path_to_root_v.pop();
				path_to_root_w.pop();
			} else {
				break;
			}
		}
		var blossom = [potential_stem_V].concat(path_to_root_w.reverse());
		blossom = blossom.concat(path_to_root_v);
		blossom.push(potential_stem_V);
		var blossom_verteces = new Set(blossom);
		var G_size = G.length;
		var contracted_G = [];
		var blossom_vertex = {};
		blossom_vertex.adj = [];
		blossom_vertex.partner = -1;
		blossom_vertex.blossom = -1;
		blossom_vertex.cycle = blossom;
		for(let i = 0; i<G_size; i++){
			let vertex = {};
			if(G[i].blossom === -1){
				if(blossom_verteces.has(i)){
					vertex.blossom = G_size;
				} else {
					vertex.blossom = -1;
					if(blossom_verteces.has(G[i].partner)){
						vertex.partner = G_size;
						blossom_vertex.partner = i;
					} else {
						vertex.partner = G[i].partner;
					}
					vertex.adj = [];
					var points_to_blossom = false;
					for(let j = 0; j<G[i].adj.length; j++){
						if(blossom_verteces.has(G[i].adj[j])){
							points_to_blossom = true;
						} else {
							vertex.adj.push(G[i].adj[j]);
						}
					}
					if(points_to_blossom){
						vertex.adj.push(G_size);
						blossom_vertex.adj.push(i);
					}
				}
			} else {
				vertex.blossom = G[i].blossom;
			}
			contracted_G.push(vertex);
		}
		contracted_G.push(blossom_vertex);
		return contracted_G;
	},
	
	expand:function(G,G_prime,P_prime){
		if(!P_prime.includes(G.length)){
			return P_prime;
		}
		var cycle = G_prime[G.length].cycle;
		var pos = P_prime.indexOf(G.length);
		if (pos%2==0){ //looking for pos+1
			var non_stem_neighbor = P_prime[pos+1];
			if(G[non_stem_neighbor].adj.includes(cycle[0])){
				P_prime[pos] = cycle[0];
				return P_prime;
			} else {
				var first_half = P_prime.slice(0,pos);
				var second_half = P_prime.slice(pos+1,P_prime.length);
				var start;
				for(let i = 1; i<cycle.length-1; i++){
					if(G[cycle[i]].adj.includes(non_stem_neighbor)){
						start = i;
						break;
					}
				}
				var middle = [];
				if(G[cycle[start]].partner === cycle[start-1]){
					for(let i = start; i >= 0; i--){
						middle.push(cycle[i]);
					}
				} else {
					for(let i = start; i < cycle.length; i++){
						middle.push(cycle[i]);
					}
				}
				var P = first_half;
				middle.reverse();
				P = P.concat(middle);
				P = P.concat(second_half);
				return P;
			}
		} else {  //looking for pos-1
			var non_stem_neighbor = P_prime[pos-1];
			if(G[non_stem_neighbor].adj.includes(cycle[0])){
				P_prime[pos] = cycle[0];
				return P_prime;
			} else {
				var first_half = P_prime.slice(0,pos);
				var second_half = P_prime.slice(pos+1,P_prime.length);
				var start;
				for(let i = 1; i<cycle.length-1; i++){
					if(G[cycle[i]].adj.includes(non_stem_neighbor)){
						start = i;
						break;
					}
				}
				var middle = [];
				if(G[cycle[start]].partner === cycle[start-1]){
					for(let i = start; i >= 0; i--){
						middle.push(cycle[i]);
					}
				} else {
					for(let i = start; i < cycle.length; i++){
						middle.push(cycle[i]);
					}
				}
				var P = first_half;
				P = P.concat(middle);
				P = P.concat(second_half);
				return P;
			}
		}
		return [];
	},
	
	setup:function(G, forest){
		var G_size = G.length;
		for(let i = 0; i < G_size; i++){
			if(G[i].blossom === -1){
				G[i].mother = -1;
				if(G[i].partner === -1){
					forest.push(i)
					G[i].distance = 0;
					G[i].root = i;
				} else {
					G[i].root = -1;
					G[i].distance = 100000;
				}
			}
		}
	},
	
	bfs_check:function(G,root,queue){
		v = queue.shift();
		
		for(let j = 0; j < G[v].adj.length; j++){
			w = G[v].adj[j];
			if(G[w].partner === -1){
				var P = [v,w];
				while(G[v].mother !== -1){
					P.unshift(G[v].mother);
					v = G[v].mother;
				}
				while(G[w].mother !== -1){
					P.push(G[w].mother);
					w = G[w].mother;
				}
				return P;
			}
		}
		
		
		for(let j = 0; j < G[v].adj.length; j++){
			w = G[v].adj[j];
			//console.log("  w = " +  w); 
			if ( (G[w].partner !== -1) && (G[w].root === -1) ){
				blossom.add_match_to_tree(G,v,w,G[w].partner);
				queue.push(G[w].partner);
			} else if(G[w].distance%2 === 1){
				continue;
			} else if( (G[w].root === G[v].root)&&(G[w].distance%2 === 0) ){
				var G_prime = blossom.contract_graph(G,v,w);
				var P_prime = blossom.find_aug_path_main(G_prime);
				var P = blossom.expand(G,G_prime,P_prime);
				return P;
			} else {
				var P = [v,w];
				while(G[v].mother !== -1){
					P.unshift(G[v].mother);
					v = G[v].mother;
				}
				while(G[w].mother !== -1){
					P.push(G[w].mother);
					w = G[w].mother;
				}
				return P;
			}
		}
		return 'next';
	},
	
	bfs:function(G,root){
		var queue = [];
		queue.push(root);
		while(queue.length > 0){
			var aug_path = blossom.bfs_check(G,root,queue);
			if (aug_path !== 'next'){
				return aug_path;
			}
		}
		return [];
	},
	
	find_aug_path_main:function(G){
		var forest = [];
		blossom.setup(G,forest);
		rtn = [];
		for(let i = 0; i<forest.length; i++){
			let aug_path = blossom.bfs(G,forest[i]);
			if(aug_path.length !== 0){
				rtn = aug_path;
				break;
			}
		}
		for(key in G){
			delete G[key].root;
		}
		return rtn;
	},
	
}


function solve(adj){
	function find_path(){
		let aug_path = blossom.find_aug_path_main(G);
		if(aug_path.length !== 0){
			blossom.invert(aug_path,G);
			window.setTimeout(find_path,200);
			do_all(G);
		} else {
			var pairs = 0;
			for(let i = 0; i<G.length; i++){
				if(G[i].partner !== -1){
					pairs +=1;
				}
			}
			do_all(G);
			setTimeout(bc, 1500);
			return pairs/2;
		}
	}
	var G_size = adj.length;
	var G = [];
	for(let i = 0; i<G_size; i++){
		let vertex = {};
		vertex.partner = -1;
		vertex.blossom = -1;
		vertex.adj = [];
		for (let j = 0; j < adj[i].length; j++){
			vertex.adj.push(adj[i][j]);
		}
		G.push(vertex);
	}
	find_path();
}




