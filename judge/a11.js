/*team 5     我们是初级组的。。。。
Auther:litao
2014.04.24
*/
function createThink(w,h) {
    var previousDirection = 'down';
    var hang = 0;
    var out = false;
    var minMap = [];
    var nextFood;
    var bfsqueue;
    for(var x = 0; x < w; x ++ ) {
        minMap[x] = [];
        for(var y = 0; y < h; y ++ ) {
            minMap[x][y] = 99999999;
        }
    }

    function clearMap() {
    for(var x in minMap) {
        for(var y in minMap[x]) {
        minMap[x][y] = 99999999;
        }
    }
    }

    function legal(x, y, game) {
    if(x >= w || x <= -1 || y >= h || y <= -1) {
        return false;
    } else {
        return true;
    }
    }
    function checkCollision(x, y, s) {
        for(var p in s) {
            if(x === s[p].x && y === s[p].y) {
                return true;
            }
        }
        return false;
    }
    
    function bfs(loc, game) {
        bfsqueue = [];
        bfsqueue.push({
            x: loc.x
            ,y: loc.y
            ,dist: 0
        });
        while(bfsqueue.length > 0) {
            loc = bfsqueue.shift();
            if(legal(loc.x, loc.y, game) == false) {
                continue;
            }
            if(checkCollision(loc.x, loc.y, game.snake)) {
                minMap[loc.x][loc.y] = -1;
                continue;
            }
            if(minMap[loc.x][loc.y] != 99999999) {
                continue;
            }
            minMap[loc.x][loc.y] = loc.dist;
            bfsqueue.push({
                x: loc.x
                ,y: loc.y - 1
                ,dist: loc.dist + 1
            });
            bfsqueue.push({
                x: loc.x
                ,y: loc.y + 1
                ,dist: loc.dist + 1
            });
            bfsqueue.push({
                x: loc.x - 1
                ,y: loc.y
                ,dist: loc.dist + 1
            });
            bfsqueue.push({
                x: loc.x + 1
                ,y: loc.y
                ,dist: loc.dist + 1
            });
        }
    }
    
    return function(game) {

        if(game.snake.length < 40){               //吃的食物在35个以内用宽度优先搜索
        head = game.snake[0];
        if(nextFood == undefined) {
            nextFood = game.food[0];
        }
        if(minMap == undefined) {
            minMap = [];
            for(var x = 0; x < game.width; x ++ ) {
                minMap[x] = [];
                for(var y = 0; y < game.height; y ++ ) {
                    minMap[x][y] = 99999999;
                }
            }
            bfs(game.food[0], game);
        }
        if(game.food[0].x != nextFood.x || game.food[0].y != nextFood.y) {
            clearMap();
            bfs(game.food[0], game);
            nextFood = game.food[0];
        }
        var minDirect = "up";
        var minDist = 99999999;
        if(legal(head.x + 1, head.y, game)) {
            if(checkCollision(head.x + 1, head.y, game.snake) == false) {
                if(minDist > minMap[head.x + 1][head.y] && minMap[head.x + 1][head.y] != -1) {
                    minDirect = "right";
                    minDist = minMap[head.x + 1][head.y];
                }
            }
        }
        if(legal(head.x - 1, head.y, game)) {
            if(checkCollision(head.x - 1, head.y, game.snake) == false) {
                if(minDist > minMap[head.x - 1][head.y] && minMap[head.x - 1][head.y] != -1) {
                    minDirect = "left";
                    minDist = minMap[head.x - 1][head.y];
                }
            }
        }
        if(legal(head.x, head.y + 1, game)) {
            if(checkCollision(head.x, head.y + 1, game.snake) == false) {
                if(minDist > minMap[head.x][head.y + 1] && minMap[head.x][head.y + 1] != -1) {
                    minDirect = "down";
                    minDist = minMap[head.x][head.y + 1];
                }
            }
        }
        if(legal(head.x, head.y - 1, game)) {
            if(checkCollision(head.x, head.y - 1, game.snake) == false) {
                if(minDist > minMap[head.x][head.y - 1] && minMap[head.x][head.y - 1] != -1) {
                    minDirect = "up";
                    minDist = minMap[head.x][head.y - 1];
                }
            }
        }
        return minDirect;}else {                                    //吃的食物在35个以外用追尾吧方法。
            if(game.snake.length > 55){
            hang = Math.floor((game.snake.length - 29) / 26);
        }
        else hang = 0;
        if(out) {
       
            if (game.food[0].x < game.snake[0].x && game.food[0].x != 0) {
                previousDirection = 'left';
                return previousDirection;
            };
            if(game.food[0].x === game.snake[0].x && game.food[0].y != 0 ){
                if(previousDirection === 'up' && game.snake[0].y > game.food[0].y ) {
                    return previousDirection;
                }else if(previousDirection === 'left' && game.snake[0].y > game.food[0].y){
                    previousDirection = 'up';
                    return previousDirection;
                }else if(game.snake[0].y < game.food[0].y && game.food[0].x != 0){
                    previousDirection = 'down';
                    return previousDirection;
                }
            }
            if(game.snake[0].x === 0){
                out = false;
                previousDirection = 'up';
                return previousDirection;
            }
            previousDirection = 'left';
            return previousDirection;
        } else {
            if(game.snake[0].x === 0 && game.snake[0].y === 0) {
                previousDirection = 'right';
                return previousDirection;
            }

            if(hang > 0 && game.snake[0].x != 0 && previousDirection == 'up' && game.snake[0].y === 1){
                previousDirection = 'left';
                return previousDirection;
            }
            if(hang > 0 && previousDirection == 'left' && game.snake[0].y === 1){
                previousDirection = 'down';
                return previousDirection;
            }
            

            if(previousDirection == 'down' && game.snake[0].x != 0 && game.snake[0].y === h - 1) {
                previousDirection = 'left';
                return previousDirection;
            }

            if(game.snake[0].x === w - 1 && game.snake[0].y === 0) {
                previousDirection = 'down';
                return previousDirection;
            }
            if(game.snake[0].x === 0 && game.snake[0].y === h - 1) {
                previousDirection = 'up';
                return previousDirection;
            }


            if( hang > 0 && game.snake[0].x === w - 2 && game.snake[0].y === h - 1){
                previousDirection = 'up';
                return previousDirection;
            }
            if( hang > 1 && game.snake[0].x === w - 4 && game.snake[0].y === h - 1){
                previousDirection = 'up';
                return previousDirection;
            }
            if( hang > 2 && game.snake[0].x === w - 6 && game.snake[0].y === h - 1){
                previousDirection = 'up';
                return previousDirection;
            }
            if( hang > 3 && game.snake[0].x === w - 8 && game.snake[0].y === h - 1){
                previousDirection = 'up';
                return previousDirection;
            }
            if( hang > 4 && game.snake[0].x === w - 10 && game.snake[0].y === h - 1){
                previousDirection = 'up';
                return previousDirection;
            }
            else if(game.food[0].y != 0 && game.snake[0].x === game.food[0].x && game.snake[0].y === h - 1) {
                out = true;
                previousDirection = 'up';
                return previousDirection;
            }

            return previousDirection;
        }
        }
    };//return game 函数的
}

