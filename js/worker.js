onmessage = function(sdata) {
    var data = sdata.data;
    if(data.type === 'url') {
        importScripts(data.data);
    } else if(data.type === 'init') {
        think = createThink(data.data.w, data.data.h);
        w = data.data.w;
        h = data.data.h;
    } else if(data.type === 'game state') {
        var result = think(data.data);
        postMessage({
            type: 'result'
            ,data: result
        });
    }
}

var check = function(loc, game) {
    var self = game;
    if(loc.x < 0 || loc.y < 0 || loc.x >= w || loc.y >= h) {
        return false;
    }
    for(var l in self.snake) {
        if(loc.x == self.snake[l].x && loc.y == self.snake[l].y) {
            return false;
        }
    }
    return true;
}

var deepClone = function(obj) {
    var buffer;
    if(obj instanceof Array) {
        buffer = [];
        var i = obj.length;
        while(i--) {
            buffer[i] = deepClone(obj[i]);
        }
        return buffer;
    } else if (obj instanceof Object) {
        buffer = {};
        for(var k in obj) {
            buffer[k] = deepClone(obj[k]);
        }
        return buffer;
    } else {
        return obj;
    }
}
