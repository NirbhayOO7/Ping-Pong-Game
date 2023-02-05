const canvas = document.getElementById("Canvas");

const context = canvas.getContext("2d");

// function for creating user and com paddle and canvas

function drawRect(x, y, w, h, color){

    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}

// drawRect(0, 0, canvas.width, canvas.height, "black");

// function for ball

function drawCircle(x, y, r, color){
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI*2, false);
    context.closePath();
    context.fill();
}

// function to draw score board

function drawText(Text, x, y, color){
    context.fillStyle = color;
    context.font = "45px fantasy";
    context.fillText(Text, x, y);
}

// fucntion to draw the net

function drawNet(){
    for(let i=0; i<canvas.height; i+=15)
    {
        drawRect(net.x, net.y+i, net.width, net.height, net.color);
    }
}

// user paddle

const user={
    x: 0,
    y : (canvas.height/2) - 100/2,
    width : 10,
    height : 100,
    color : "white", 
    score : 0
}

// computer paddle

const com ={
    x : canvas.width - 10,
    y : (canvas.height/2) - 100/2,
    width : 10,
    height: 100,
    color: "white",
    score : 0
}

// ball 

const ball={
    x: canvas.width/2,
    y : canvas.height/2,
    radius : 10,
    color : "white",
    speed : 5,
    velocityX : 5,
    velocityY : 5
}

// net

const net={
    x : (canvas.width/2) - 2/2,
    y : 0,
    width : 2,
    height : 10,
    color : "white"
}

// render function to render the game each 50 ms

function render(){
    drawRect(0, 0, canvas.width, canvas.height, "black");
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(com.x, com.y, com.width, com.height, com.color);
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
    drawNet();
    drawText(user.score, canvas.width/4, canvas.height/5, "white");
    drawText(com.score, 3*canvas.width/4, canvas.height/5, "white");
}

function game(){
    update();
    render();
}

const framePerSecond = 50;
setInterval(game, 1000/framePerSecond);

// function to detect collision, movement, score update and etc

// fucntion to detect collision

function collision(ball , player){
    player.top = player.y;
    player.bottom = player.y + player.height;
    player.left = player.x;
    player.right = player.x + player.width;
    
    ball.top = ball.y - ball.radius;
    ball.bottom = ball.y + ball.radius;
    ball.left = ball.x - ball.radius;
    ball.right = ball.x + ball.radius;

    if(ball.bottom > player.top && ball.right > player.left && ball.top < player.bottom && ball.left < player.right)
    {
        return true;
    }

    return false;
} 

function update(){

    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    if((ball.y - ball.radius)< 0 || (ball.y + ball.radius)>canvas.height)
    {
        ball.velocityY = -ball.velocityY;
    }
    
    let player = ball.x < (canvas.width/2)? user : com;

    if(collision(ball , player))
    {   
        let collidePoint = ball.y - (player.y + (player.height/2));

        collidePoint /= (player.height/2);

        let angelRad = (Math.PI/4)*collidePoint;
        
        let direction = (ball.x < canvas.width/2) ? 1:-1;

        ball.velocityX = direction*ball.speed*Math.cos(angelRad);
        ball.velocityY = ball.speed*Math.sin(angelRad);

        ball.speed += 1;
    }

    moveComPaddle();

    if(ball.x - ball.radius < 0)
    {
        com.score++;
        resetBall();
    }
    else if(ball.x + ball.radius > canvas.width)
    {
        user.score++;
        resetBall();
    }
}

 // function to reset the ball once player loses
 function resetBall()
 {
     ball.x = canvas.width/2;
     ball.y = canvas.height/2;
     ball.speed = 5;
     ball.velocityX = -ball.velocityX; 
 }

//  fuction to move the user paddle as per mouse movement

canvas.addEventListener("mousemove", moveUserPaddle);

function moveUserPaddle(event){
    let canvasRect = canvas.getBoundingClientRect();
    user.y = event.clientY - canvasRect.top - (user.height/2);
}

// function to move computer paddle by AI 

function moveComPaddle(){  
    let computerLevel = 0.1;
    com.y += (ball.y - (com.y + (com.height/2)))*computerLevel;
}
