var defaultSourceList = [
    'test0.js'
    ,'test1.js'
    ,'test2.js'
    ,'test3.js'
    ,'test4.js'
    ,'test5.js'
];

var srcA = [
    'a2.js'
    ,'a4.js'
    ,'a8.js'
    ,'a11.js'
    ,'a14.js'
    ,'a15.js'
    ,'a17.js'
    ,'a24.js'
    ,'a26.js'
    ,'a28.js'
    ,'a34.js'
];

var srcB = [
    'b3.js'
    ,'b6.js'
    ,'b7.js'
    ,'b8.js'
    ,'b11.js'
    ,'b12.js'
    ,'b14.js'
    ,'b16.js'
    ,'b17.js'
    ,'b18.js'
    ,'b21.js'
    ,'b29.js'
    ,'b32.js'
];

var sourceList = [];

var nextTest = function() {};

var delay = 0;

var worker;
var time;
var running = false;
var countup;
var lastScore = 0;

var totTime = 420 * 1000; 

var __log = '';

var nanobar = new Nanobar();

var snake = new Snake();

function deepClone(obj) {
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

function initGame(snake) {
    running = false;
    snake.kill();
    refreshDisplay();
    clearTimeout(time);
    snake.init('game');
}

function finishGame(snake) {
    running = false;
    snake.kill();
    refreshDisplay();
    clearTimeout(time);
    _log(snake.totScore);
    snake.init('game');
    nextTest();
}

function refreshDisplay() {
    if(lastScore !== snake.totScore) {
        countup.stop();
        countup = new countUp("score", lastScore, snake.totScore, 0, 2.5, {
            useEasing : true
            ,useGrouping : true
            ,separator : ','
            ,decimal : '.'
        });
        lastScore = snake.totScore;
        countup.start();
    }
}

function loop() {
    if(running) {
        if(snake.tick <= 10000) { 
            setTimeout(function() {
                var state = {
                    snake: snake.snake
                    ,food: snake.food
                };
                worker.postMessage({
                    type: 'game state'
                    ,data: deepClone(state)
                });
            }, delay);
        } else {
            finishGame(snake);
            worker.terminate();
        }
    }
}

function paint() {
    var cw = width / 20;
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#333';
    ctx.font = height + 'px Impact, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(snake.score.toString(), width / 2, height * .9);
    for(var p in snake.snake) {
        var x = snake.snake[p].x;
        var y = snake.snake[p].y;
        ctx.fillStyle = "rgba(225, 220, 0, " + (1 - 0.7 * (p / snake.snake.length)).toString() + ")";
        ctx.fillRect(x * cw, y * cw, cw, cw);
        ctx.strokeStyle = 'white';
        ctx.strokeRect(x * cw, y * cw, cw, cw);
    }
    for(var p in snake.food) {
        var x = snake.food[p].x;
        var y = snake.food[p].y;
        ctx.fillStyle = '#0074D9';
        ctx.fillRect(x * cw, y * cw, cw, cw);
        ctx.strokeStyle = 'white';
        ctx.strokeRect(x * cw, y * cw, cw, cw);
    }
}

function loadGame(code) {
    initGame(snake);
    var src = 'data:text/javascript;base64,' + Base64.encode(code);
    worker.terminate();
    worker = new Worker('./../js/worker.js');
    worker.postMessage({
        type: 'url'
        ,data: src
    });
    worker.onmessage = function(sdata) {
        var data = sdata.data;
        if(data.type === 'result') {
            snake.loop(data.data);
            refreshDisplay();
            paint();
            loop();
        }
    }
    //worker.onerror = function(e){
        //console.log(e.message);
        //console.log(e.lineno);
        //console.log(e.filename);
    //};
}

function startGame() {
    initGame(snake);
    countup = new countUp("score", 0, snake.totScore, 0, 0.5, {
        useEasing : true
        ,useGrouping : true
        ,separator : ','
        ,decimal : '.'
    });
    lastScore = 0;
    running = true;
    worker.postMessage({
        type: 'init'
        ,data: {
            w: 20
            ,h: 15
        }
    });
    snake.init('game');
    time = setTimeout(function() {
        finishGame(snake);
        worker.terminate();
        _log('Time out. ');
    }, totTime);
    loop();
}

$(document).ready(function() {
    canvas = $('#playground')[0];
    ctx = canvas.getContext("2d");
    width = $('#playground').width();
    height = $('#playground').height();
    worker = new Worker('./../js/worker.js');

    $('#btn-reset').click(function() {
        finish(snake);
        worker.terminate();
    });
    $('#btn-mode').click(function() {
        delay ^= 90;
    });
    paint();
    setInterval(function() {
        nanobar.go(snake.tick * 100 / 10000);
        $('#result-log').html(__log);
    }, 300);
});


function startTest(sl) {
    sourceList = sl;
    var index = 0;
    var runGame = function() {
        var cb = function(result) {
            loadGame(result);
            startGame();
            _log('<br>' + sourceList[index] + ':');
            index ++ ;
            nextTest = runGame;
        };
        if(sourceList[index] === undefined) {
            _log('<br>Done. ');
            window.open("/fest/springfestival/");
            return;
        }
        $.get(sourceList[index], cb, 'text');
    }
    runGame();
}

window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
    _log(' Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber + ' Column: ' + column + ' StackTrace: ' +  errorObj);
}

function _log(s) {
    __log = __log.concat('&nbsp;&nbsp;&nbsp;&nbsp;' + s);
}
