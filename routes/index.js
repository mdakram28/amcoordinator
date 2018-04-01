var express = require('express');
var shortest = require("./shortest");
var router = express.Router();

var state = {};
var nodes = {};

var transactionLogs = [];

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', { title: 'Express' });
});

router.get("/register", function (req, res) {
	var config = JSON.parse(req.query.config);
	var nodeId = parseInt(config.id);
	var nodeState = JSON.parse(req.query.state);
	state[nodeId] = nodeState;
	nodes[nodeId] = config;
	res.sendStatus(200);
});

router.get('/sync', function (req, res) {
	res.json(state);
});

router.get('/setState', function (req, res) {
	var nodeId = parseInt(req.query.id);
	var nodeState = JSON.parse(req.query.state);
	var prevState = state[nodeId];
	state[nodeId] = nodeState;
	makeLog(nodeId, prevState, nodeState);
	res.sendStatus(200);
});

function makeLog(nodeId, prevState, nextState) {
	if(prevState.selling != nextState.selling) {
		transactionLogs.push(`Node ${nodeId} ${nextState.sell}`);
	}
}

function reroute() {
	console.log("Rerouting : " + JSON.stringify(nodes));
	var nodeIds = Object.keys(nodes);
	var buyers = nodeIds.filter(nodeId => state[nodeId].buying);
	var sellers = nodeIds.filter(nodeId => state[nodeId].selling);
	console.log(`BUYERS = ${buyers} SELLERS = ${sellers}`);

	var participants = {};
	sellers.forEach(buyerId => {
		buyers.forEach(sellerId => {
			var path = shortest(nodes, sellerId, buyerId);
			console.log(`Path from ${sellerId} -> ${buyerId} : ${path}`);
			path.forEach(n => {
				participants[n] = true;
			});
		});
	});

	Object.values(nodes).forEach(node => {
		state[node.id].forwarding = node.neighbours.filter(n => n != 0 && participants[node.id] && participants[n]);
	});
}

setInterval(reroute, 2000);

module.exports = router;
