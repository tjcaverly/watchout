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
	enemies.push(i);
}

var update = function() {
	gameBoard.selectAll('circle.enemy')
	         .transition()
	         .duration(1000)
					 .attr("cx", function(d){return Math.random()*gameOptions.width;})
					 .attr("cy", function(d){return Math.random()*gameOptions.height;});

}
var drag = d3.behavior.drag()
    .on("drag", function(d,i) {

        d.x += d3.event.dx
        d.y += d3.event.dy
        d3.select(this).attr("cx", function(d,i){
            return d.x
        })
        .attr('cy', function(d,i){return d.y});
    });

gameBoard.selectAll('circle.enemy').data(enemies)
					.enter()
					.append('circle')
					.attr('class', 'enemy')
					.attr("cx", function(d){return Math.random()*gameOptions.width;})
					.attr("cy", function(d){return Math.random()*gameOptions.height;})
					.attr("r", 10);

gameBoard.selectAll('circle.player').data([{x:100, y:100, r:10}])
						.enter()
						.append('circle')
						.attr('class', 'player')
						.attr("cx", function(d){return d.x;})
						.attr("cy", function(d){return d.y;})
						.attr("r", function(d){return d.r;})
						.attr("fill", "red")
						.call(drag);


setInterval(update, 1000);

