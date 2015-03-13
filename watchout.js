// start slingin' some d3 here.

var gameOptions = {
	height: 450,
	width: 700,
	nEnemies: 30,
	padding: 20
}

var gameBoard = d3.select('body').append('svg:svg')
						.attr("width", gameOptions.width)
						.attr("height", gameOptions.height)
						.style("background-color", "blue");

var enemies = [];

for (var i = 0; i<gameOptions.nEnemies; i++) {
	var data = {cx: Math.random()*gameOptions.width,
							cy: Math.random()*gameOptions.height,
							index:i}
	enemies.push(data);
}

var moveEnemies = function() {

	for (var i = 0; i < enemies.length; i++) {
		enemies[i]['cx'] = Math.random()*gameOptions.width;
		enemies[i]['cy'] = Math.random()*gameOptions.height;
	};
	update(enemies);
}

var update = function(data) {
	gameBoard.selectAll('circle')
					 .data(data)
	         .transition()
	         .duration(1000)
					 .attr("cx", function(d){return d.cx;})
					 .attr("cy", function(d){return d.cy;});

}

gameBoard.selectAll('circle').data(enemies)
					.enter()
					.append('circle')
					.attr("cx", function(d){return d.cx;})
					.attr("cy", function(d){return d.cy;})
					.attr("r", 10);

setInterval(moveEnemies, 1000);
