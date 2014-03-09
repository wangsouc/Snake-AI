var period = 60;

$(document).ready(function() {

    $('#btn-start').click(function() {
	init();
    });
    $('#btn-clear').click(function() {
	$('#ai').val('');
    });
    $('#watch-mode').click(function() {
	period ^= 60;
    });

    codeExample = [
	'function createThink() {\n    var a, b, c;\n    return function(game) {\n	return keyboardDirection;\n    };\n}'
	,'function createThink() {\n    var minMap;\n    var nextFood;\n\n    function clearMap() {\n	for(var x in minMap) {\n	    for(var y in minMap[x]) {\n		minMap[x][y] = 99999999;\n	    }\n	}\n    }\n\n    function legal(x, y, game) {\n	if(x >= game.width || x <= -1 || y >= game.height || y <= -1) {\n	    return false;\n	} else {\n	    return true;\n	}\n    }\n\n    function bfs(loc, dist, game) {\n	if(legal(loc.x, loc.y, game) == false) {\n	    return -1;\n	}\n	if(checkCollision(loc.x, loc.y, game.snake)) {\n	    return -1; \n	}\n	if(minMap[loc.x][loc.y] != 99999999) {\n	    return minMap[loc.x][loc.y];\n	}\n	minMap[loc.x][loc.y] = dist + 1;\n	bfs({\n	    x: loc.x\n	    ,y: loc.y - 1\n	}, dist + 1,  game);\n	bfs({\n	    x: loc.x\n	    ,y: loc.y + 1\n	}, dist + 1,  game);\n	bfs({\n	    x: loc.x - 1\n	    ,y: loc.y\n	}, dist + 1,  game);\n	bfs({\n	    x: loc.x + 1\n	    ,y: loc.y\n	}, dist + 1,  game);\n    }\n\n    return function(game) {\n	head = game.snake[0];\n	if(nextFood == undefined) {\n	    nextFood = game.food;\n	}\n	if(minMap == undefined) {\n	    minMap = [];\n	    for(var x = 0; x < game.width; x ++ ) {\n		minMap[x] = [];\n		for(var y = 0; y < game.height; y ++ ) {\n		    minMap[x][y] = 99999999;\n		}\n	    }\n	    bfs(game.food, 0, game);\n	}\n	if(game.food.x != nextFood.x && game.food.y != nextFood.y) {\n	    clearMap();\n	    bfs(game.food, 0, game);\n	    nextFood = game.food;\n	}\n	var minDirect = "right";\n	var minDist = 99999999;\n	if(legal(head.x + 1, head.y, game)) {\n	    if(checkCollision(head.x + 1, head.y, game.snake) == false) {\n		if(minDist >  minMap[head.x + 1][head.y]) {\n		    minDirect = "right";\n		    minDist = minMap[head.x + 1][head.y];\n		}\n	    }\n	}\n	if(legal(head.x - 1, head.y, game)) {\n	    if(checkCollision(head.x - 1, head.y, game.snake) == false) {\n		if(minDist >  minMap[head.x - 1][head.y]) {\n		    minDirect = "left";\n		    minDist = minMap[head.x - 1][head.y];\n		}\n	    }\n	}\n	if(legal(head.x, head.y + 1, game)) {\n	    if(checkCollision(head.x, head.y + 1, game.snake) == false) {\n		if(minDist >  minMap[head.x][head.y + 1]) {\n		    minDirect = "down";\n		    minDist = minMap[head.x][head.y + 1];\n		}\n	    }\n	}\n	if(legal(head.x, head.y - 1, game)) {\n	    if(checkCollision(head.x, head.y - 1, game.snake) == false) {\n		if(minDist >  minMap[head.x][head.y - 1]) {\n		    minDirect = "up";\n		    minDist = minMap[head.x][head.y - 1];\n		}\n	    }\n	}\n	return minDirect;\n    };\n}\n	'
	,''
	,''
    ];

    $('#ai-examples').change(function() {
	$('#ai').val(codeExample[$('#ai-examples').get(0).selectedIndex]);
    });
    $('#ai-examples').change();

});
