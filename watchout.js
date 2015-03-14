// start slingin' some d3 here.

var gameOptions = {
	height: 450,
	width: 700,
	nEnemies: 1,
	padding: 20
}

var gameBoard = d3.select('body').append('svg:svg')
						.attr("width", gameOptions.width)
						.attr("height", gameOptions.height)
						.style("background-color", "blue");

var enemies = [];

for (var i = 0; i<gameOptions.nEnemies; i++) {
	enemies.push({index:i, 
								x:Math.random()*gameOptions.width,
							 	y:Math.random()*gameOptions.width,
							 	r:50
							 });
}

var update = function() {
	gameBoard.selectAll('circle.enemy')
	         .transition()
	         .duration(5000)
					 .attr("cx", function(d){
					 	var x = Math.random()*gameOptions.width;
					 	d.x = x;
					 	return x;})
					 .attr("cy", function(d){
					 	var y = Math.random()*gameOptions.height;
					 	d.y = y;
					 	return y;});

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
					.attr("cx", function(d){return d.x;})
					.attr("cy", function(d){return d.y;})
					.attr("r", 50);

gameBoard.selectAll('circle.player').data([{x:100, y:100, r:50}])
						.enter()
						.append('circle')
						.attr('class', 'player')
						.attr("cx", function(d){return d.x;})
						.attr("cy", function(d){return d.y;})
						.attr("r", function(d){return d.r;})
						.attr("fill", "red")
						.call(drag);

d3.timer(function(){
	//console.log('hi');
	var player = gameBoard.select('circle.player').data()[0];
	var enemies = gameBoard.selectAll("circle.enemy")
	enemies.each(function(){
		var enemy = d3.select(this);
		var enemyCircle = {
			x:parseFloat(enemy.attr('cx')),
			y:parseFloat(enemy.attr('cy')),
			r: 50
		}
		collision(player, enemyCircle)
	});


});



var collision = function(c1, c2) {

	var dist = Math.sqrt( Math.pow( (c1.x - c2.x), 2) + Math.pow( (c1.y - c2.y), 2) );
	return dist < c1.r + c2.r;
}


setInterval(update, 5000);

