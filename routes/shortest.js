module.exports = function getNodesInPath(nodes, fromId, toId) {
	var allNodes = JSON.parse(JSON.stringify(nodes));
	Object.values(allNodes).forEach(n => {
		n.dist = Infinity;
	});
	traversed = [];
	toTraverse = [];
	allNodes[fromId].dist = 0;
	toTraverse.push(fromId);

	while (toTraverse.length > 0){
		var id = toTraverse.shift();
		var currentDist = allNodes[id].dist;
		allNodes[id].neighbours.forEach(n => {
			if((currentDist + 1) < allNodes[n].dist){
				allNodes[n].dist = currentDist + 1;
				allNodes[n].prev = id;
			}
			if(traversed.indexOf(n) == -1) {
				toTraverse.push(n);
			};
			traversed.push(id);
		});
	}

	var cn = toId;
	var path = [];
	while(cn != fromId && cn) {
		if(allNodes[cn].dist == Infinity)return [];
		path.push(cn);
		cn = allNodes[cn].prev;
	}
	path.push(fromId);
	return path.reverse();
}