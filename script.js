window.onload = function()
{
    var canvasWeidth = 900;
    var canvasHeight = 600;
    var blockSize = 30;
    var ctx;
    var delay = 300;
    var snakee;
    var applee;
    var widthInBlocks = canvasWeidth/blockSize;
    var heightInBlocks = canvasHeight/blockSize;
    var score;
    
    init();
    
    function init(){
        var canvas = document.createElement('canvas');
        canvas.width = canvasWeidth;
        canvas.height = canvasHeight;
        canvas.style.border = "30px solid gray";
        canvas.style.margin = "50px auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#ddd";
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        snakee = new snak([[6,4], [5,4], [4,4]],"right");
        applee = new Apple([10, 10]);
        score = 0;
        refreshCanvas();
    }
    function refreshCanvas(){
        snakee.advence();
        if(snakee.checkCollision()){
            //GAME OVER
            gameOver();
        }
        else{
            if(snakee.isEatingApple(applee)){
                //le serpent a manger la pomme
                score++;
                snakee.eatApple = true;
                do{
                    applee.setNewPosition();
                }while(applee.isOnSnake(snakee))
            }
            ctx.clearRect(0, 0, canvasWeidth, canvasHeight);
            drawScore();
            applee.draw();
            snakee.draw();
            setTimeout(refreshCanvas, delay);
        }
    }
    function gameOver(){
        ctx.save();
        ctx.font = "bold 70px sans-serif";
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
        var centrex = canvasWeidth/2;
        var centrey = canvasHeight/2;
        ctx.strokeText("Game Over", centrex, centrey-180);
        ctx.fillText("Game Over", centrex, centrey-180);
        ctx.font = "bold 30px sans-serif";
        ctx.strokeText("apuyez sur Espace pour rejouer!", centrex, centrey-120);
        ctx.fillText("apuyez sur Espace pour rejouer!", centrex, centrey-120);
        ctx.restore();
    }
    function restart(){
        snakee = new snak([[6,4], [5,4], [4,4]],"right");
        applee = new Apple([10, 10]);
        score =0;
        refreshCanvas();
    }
    function drawScore(){
        ctx.save();
        ctx.font = "bold 200px sans-serif";
        ctx.fillStyle = "gray";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        var centrex = canvasWeidth/2;
        var centrey = canvasHeight/2;
        ctx.fillText(score.toString(), centrex, centrey);
        ctx.restore(); 
    }
    function drawBlock(ctx, position){
        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        ctx.fillRect(x, y, blockSize, blockSize);
    }
    function snak(body, direction){
        this.body = body;
        this.direction = direction;
        this.eatApple = false;
        this.draw = function(){
            ctx.save();
            ctx.fillStyle = '#ff0000';
            for(var i=0; i<this.body.length; i++){
                drawBlock(ctx, this.body[i]);
                
            }
            ctx.restore();
        };
        this.advence = function(){
            var nextPosition = this.body[0].slice();
            switch(this.direction){
                case "left":
                    nextPosition[0] -= 1;
                    break;
                case "right":
                    nextPosition[0] += 1;
                    break;
                case "down":
                    nextPosition[1] += 1;
                    break;
                case "up":
                    nextPosition[1] -= 1;
                    break;
                default:
                    throw("invalid Direction");
            }
            this.body.unshift(nextPosition);
            if(!this.eatApple)
                this.body.pop();
            else
                this.eatApple = false;
        };
        this.setDirection = function(newDirection){
            var allowedDirection;
            switch(this.direction){
                case "left":
                case "right":
                    allowedDirection = ["up", "down"];
                    break;
                case "down":
                case "up":
                    allowedDirection = ["left", "right"];
                    break;
                default:
                    throw("invalid Direction");
            }
            if(allowedDirection.indexOf(newDirection) > -1){
                
                this.direction = newDirection;
            }
            
        };
        this.checkCollision = function(){
            var wallCollision = false;
            var snakeCollision = false;
            var head = this.body[0];
            var rest = this.body.slice(1);
            var snakex = head[0];
            var snakey = head[1];
            var minx = 0;
            var miny = 0;
            var maxx = widthInBlocks - 1;
            var maxy = heightInBlocks - 1;
            var isNotBetweenHorizontalWalls = snakex < minx || snakex > maxx;
            var isNotBetweenVrticalWalls = snakey < miny || snakey > maxy;
            if(isNotBetweenHorizontalWalls || isNotBetweenVrticalWalls){
                wallCollision = true;
            }
            for(var i=0; i< rest.length; i++){
                if(snakex === rest[i][0] && snakey === rest[i][1]){
                    snakeCollision = true;
                }
            }
            return wallCollision || snakeCollision;
        };
        this.isEatingApple = function(appleToEat){
            var head = this.body[0];
            if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]){
                return true;
            }
            else
                return false;
        };
        
    }
    function Apple(position){
        this.position = position;
        this.draw = function(){
            ctx.save();
            ctx.fillStyle = "#33cc33";
            ctx.beginPath();
            var radius = blockSize/2;
            var x = this.position[0]*blockSize+radius;
            var y = this.position[1]*blockSize+radius;
            ctx.arc(x, y, radius, 0, Math.PI*2, true);
            ctx.fill();
            ctx.restore();
        };
        this.setNewPosition = function(){
            var newx = Math.round(Math.random() * (widthInBlocks-1));
            var newy = Math.round(Math.random() * (heightInBlocks-1));
            this.position = [newx, newy];
        };
        this.isOnSnake = function(snakeTocheck){
            var isOnSnake = false;
            for(var i=0; i < snakeTocheck.body.length; i++){
                if(this.position[0] === snakeTocheck.body[i][0] && this.position[1] === snakeTocheck.body[i][1]){
                    isOnSnake = true;
                }
            }
            return isOnSnake;
        };
    }
    
    document.onkeydown = function handlekeyDown(e){
        var key = e.keyCode;
        var newDirection;
        switch(key){
            case 37:
                newDirection = "left";
                break;
            case 38:
                newDirection = "up";
                break;
            case 39:
                newDirection = "right";
                break;
            case 40:
                newDirection = "down";
                break;
            case 32:
                restart();
                return;
            default:
                return;
        }
        snakee.setDirection(newDirection);
    }
}













