// start slingin' some d3 here.

var gameOptions = {
	height: 450,
	width: 700,
	nEnemies: 20,
	padding: 20,
	enemyRadius: 10,
	playerRadius: 10,
	colliding: false
}

// var scoreboardData = [0,0,0];

var gameBoard = d3.select('svg')
						.attr("width", gameOptions.width)
						.attr("height", gameOptions.height)
						.style("background-color", "blue");

var enemies = [];

for (var i = 0; i<gameOptions.nEnemies; i++) {
	enemies.push({index:i, 
								x:Math.random()*gameOptions.width,
							 	y:Math.random()*gameOptions.width,
							 	r:gameOptions.enemyRadius
							 });
}

var update = function() {
	gameBoard.selectAll('circle.enemy')
	         .transition()
	         .duration(1000)
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

        d.x = d3.event.x
        d.y = d3.event.y
        d.x = Math.min(gameOptions.width-10, d.x)
        d.y = Math.min(gameOptions.height-10, d.y)
        d.x = Math.max(10, d.x)
        d.y = Math.max(10, d.y)
        d3.select(this).attr("cx", d.x)
        .attr('cy', d.y);
    });



gameBoard.selectAll('circle.enemy').data(enemies)
					.enter()
					.append('circle')
					.attr('class', 'enemy')
					.attr("cx", function(d){return d.x;})
					.attr("cy", function(d){return d.y;})
					.attr("r", gameOptions.playerRadius)
         .style("fill", "transparent")       // this code works OK
         .style("stroke", "black")     // displays small black dot
         .style("stroke-width", 0)
         .style("fill", "url(#image)")
					//.append('image')
					//.attr('xlink:href', 'asteroid.png')


gameBoard.selectAll('circle.player').data([{x:100, y:100, r:gameOptions.playerRadius}])
						.enter()
						.append('circle')
						.attr('class', 'player')
						.attr("cx", function(d){return d.x;})
						.attr("cy", function(d){return d.y;})
						.attr("r", function(d){return d.r;})
						.attr("fill", "red")
						.call(drag);

var collision = function(c1, c2) {

	var dist = Math.sqrt( Math.pow( (c1.x - c2.x), 2) + Math.pow( (c1.y - c2.y), 2) );
	return dist < c1.r + c2.r;
}


setInterval(update, 1000);

d3.select('body').select('.scoreboard')
                 .style('position', 'relative')
                 .style('border-radius', '10px')
                 .style('background', 'grey')
                 .style('text-align', 'right')
                 .style('padding', '10px')
                 .style('margin','8px')
                 .style('display', 'block')
                 .style('float', 'right');

d3.select('.container').style('margin-top','40px')
                       .style('margin-bottom','40px')
                       .style('width','700px')
                       .style('position','relative')
                       .style('padding','40px');

d3.select('.high').data([{highscore:0}])
									//.attr('highscore', function(d) {return d.highscore;})
d3.select('.current').data([{ current: 0}])
d3.select('.collisions').data([{ collisions: 0}])

d3.timer(function(){
	//console.log('hi');
	var player = gameBoard.select('circle.player').data()[0];
	var enemies = gameBoard.selectAll("circle.enemy");

	var high = d3.select('.high').data()[0].highscore;
	d3.select('.high').select('span').text(Math.ceil(high));

	var current = d3.select('.current').data()[0].current;
	d3.select('.current').select('span').text(Math.ceil(current));

	var collisions = d3.select('.collisions').data()[0].collisions;
	d3.select('.collisions').select('span').text(collisions);

	d3.select('.current').attr('current', function(d){
		d.current = d.current + .1;
		return d.current;
	})
	d3.select('.high').attr('highscore', function(d){
			if (d.highscore < current){
				d.highscore = current;
			}
			return d.highscore;
	})

	var anyCollisions = false;

	enemies.each(function(){

		var enemy = d3.select(this);
		var enemyCircle = {
			x:parseFloat(enemy.attr('cx')),
			y:parseFloat(enemy.attr('cy')),
			r: gameOptions.enemyRadius
		}

		if (collision(player, enemyCircle)) {

			anyCollisions = true;

		}

	});

	if(anyCollisions  && !gameOptions.colliding) {
		gameOptions.colliding = true;
		d3.select('.current').attr('current', function(d) {
			d.current = 0;
		})
    
    d3.select('.collisions').attr('collisions', function(d) {
    	d.collisions ++;
    });
  } else if (!anyCollisions) {
  	gameOptions.colliding = false;
  }

	


});



