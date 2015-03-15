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

gameStats = {
  colliding: false,
  currentScore: 0,
  highScore: 0,
  collisions: 0
}

// var scoreboardData = [0,0,0];

var gameBoard = d3.select('svg')
						.attr("width", gameOptions.width)
						.attr("height", gameOptions.height)
						.style("background-color", "blue");

var enemies = d3.range(gameOptions.nEnemies);

gameBoard.selectAll('circle.enemy').data(enemies)
					.enter()
					.append('circle')
					.attr('class', 'enemy')
					.attr("cx", function(d){return d.x;})
					.attr("cy", function(d){return d.y;})
					.attr("r", gameOptions.playerRadius)
         .style("fill", "transparent")         
         .style("stroke-width", 0)
         .style("fill", "url(#image)")



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

gameBoard.selectAll('circle.player').data([{x:100, y:100, r:gameOptions.playerRadius}])
						.enter()
						.append('circle')
						.attr('class', 'player')
						.attr("cx", function(d){return d.x;})
						.attr("cy", function(d){return d.y;})
						.attr("r", function(d){return d.r;})
						.attr("fill", "green")
						.call(drag);


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

var enemiesList = gameBoard.selectAll('circle.enemy');

d3.select('.high').data([{highscore:0}])
                  //.attr('highscore', function(d) {return d.highscore;})
d3.select('.current').data([{ current: 0}])
d3.select('.collisions').data([{ collisions: 0}])



d3.timer(function(){
  var player = gameBoard.select('circle.player').data()[0];
  var enemies = gameBoard.selectAll("circle.enemy");

  d3.select('.high').select('span').text(Math.ceil(gameStats.highScore));
  d3.select('.current').select('span').text(Math.ceil(gameStats.currentScore));
  d3.select('.collisions').select('span').text(gameStats.collisions);

  gameStats.currentScore += .1;


  if (gameStats.highScore < gameStats.currentScore){
    gameStats.highScore = gameStats.currentScore;
  }

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

  if(anyCollisions  && !gameStats.colliding) {
    gameStats.colliding = true;
    gameStats.currentScore = 0;
  
    
    d3.select('.collisions').attr('collisions', function(d) {
      gameStats.collisions++;
      gameBoard.style("background-color","red");
    });
  } else if (!anyCollisions) {
    gameStats.colliding = false;
    gameBoard.style("background-color", "blue");
  }

});

var collision = function(c1, c2) {
  var dist = Math.sqrt( Math.pow( (c1.x - c2.x), 2) + Math.pow( (c1.y - c2.y), 2) );
  return dist < c1.r + c2.r;
}

var update = function(pieces) {
            pieces
           .transition()
           .duration(1000)
           .attr("cx", function(d){
            var x = Math.random()*gameOptions.width;
            d.x = x;
            return x;})
           .attr("cy", function(d){
            var y = Math.random()*gameOptions.height;
            d.y = y;
            return y;})
           .each('end', function() {
                    update(d3.select(this));
           })
           

}

update(enemiesList);


