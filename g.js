//costant
var TO_RADIANS = Math.PI/180; 

//global variables
var canvas;
var canvasW;
var canvasH;
var ctx;
var activeTask;
var level=0;//0 menu

//mobile controls
var mousex=-100;
var mousey=-100;
var mouse2x=-100;
var mouse2y=-100;
var mouse3x=-100;
var mouse3y=-100;
var dragging=false;

//setup
canvas = document.getElementById("g");
ctx = canvas.getContext("2d");
canvasW=canvas.width  = window.innerWidth;
canvasH=canvas.height = window.innerHeight;

if (window.navigator.pointerEnabled) {
    canvas.addEventListener("pointermove", mossoMouse, false);
    canvas.addEventListener("pointerup", rilasciatoTap, false);
}
else
{
    canvas.addEventListener("touchmove", mossoTap);
    canvas.addEventListener("touchstart", cliccatoTap);
    canvas.addEventListener("touchend", rilasciatoTap);
}
canvas.addEventListener("mousemove",mossoMouse);
canvas.addEventListener("mousedown",cliccatoMouse);
canvas.addEventListener("mouseup",rilasciatoMouse);

activeTask=setInterval(run, 33);
//Initialize
var currentBall={};
var ballsArray=[];
var ballsArea=0;
createBall(0,0);
var percent=0;
var gameRect={};
var urtoFactor=0.8;

function run()
{
	ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.fillStyle="#000000";
    ctx.fillRect(0,0,canvasW,canvasH);
    

    //############### prototype #####################
    ctx.fillStyle="#D86852";
    //ctx.fillRect(canvasW/2-200,canvasH/2-200,400,400);
    drawRect(600,500,"CENTER")
    gameRect.width=600;
    gameRect.height=500;
    gameRect.x=(canvasW-600)/2;
    gameRect.y=(canvasH-500)/2;

    //mouse interaction
    if(dragging)
    {
        if(currentBall.x==0 && currentBall.y==0)
            createBall(mousex,mousey);
        else
            currentBall.size++;
    }
    else
    {
        if(currentBall.x!=0 || currentBall.y!=0)
        {
            var tmpBall={};
            tmpBall.x=currentBall.x;
            tmpBall.y=currentBall.y;
            tmpBall.ax=0;
            tmpBall.ay=0;
            tmpBall.dx=0;
            tmpBall.dy=0;
            tmpBall.size=currentBall.size;
            tmpBall.ay=0.89;
            ballsArray.push(tmpBall);
            ballsArea+=(Math.PI*tmpBall.size*tmpBall.size);
            createBall(0,0);
        }
    }

    ctx.fillStyle="#000000";
    ctx.font = "20px Arial";
    //calcolo area
    percent=Math.round(((Math.PI*currentBall.size*currentBall.size+ballsArea)/(600*500))*1000)/10;
    ctx.fillText(percent+"%",canvasW/2,canvasH/2);

    moveBalls();
    drawBalls();
}
function moveBalls()
{
    var cosa;
    for(i=0;i<ballsArray.length;i++)
    {
        cosa=ballsArray[i];
        cosa.dx+=cosa.ax;
        cosa.dy+=cosa.ay;
        cosa.x+=cosa.dx;
        cosa.y+=cosa.dy;
        //collisioni
        if(cosa.y+cosa.size>gameRect.y+gameRect.height)
        {
            cosa.y=gameRect.y+gameRect.height-cosa.size;
            cosa.dy=cosa.dy*-urtoFactor;
        }
        if(cosa.y-cosa.size<gameRect.y)
        {
            cosa.y=gameRect.y+cosa.size;
            cosa.dy=cosa.dy*-urtoFactor;
        }

        if(cosa.x+cosa.size>gameRect.x+gameRect.width)
        {
            cosa.x=gameRect.x+gameRect.width-cosa.size;
            cosa.dx=cosa.dx*-urtoFactor;
        }
        if(cosa.x-cosa.size<gameRect.x)
        {
            cosa.x=gameRect.x+cosa.size;
            cosa.dx=cosa.dx*-urtoFactor;
        }
        //collisioni fra palle
        var dist;
        var altra;
        for(k=i+1;k<ballsArray.length;k++)
        {
            altra=ballsArray[k];
            dist=(altra.x-cosa.x)*(altra.x-cosa.x)+(altra.y-cosa.y)*(altra.y-cosa.y);
            if(dist<(altra.size+cosa.size)*(altra.size+cosa.size))
            {
                //better physics here.
                dist=Math.sqrt(dist);
                var qmotoCosa=(Math.abs(cosa.dx)+Math.abs(cosa.dy))*urtoFactor*cosa.size;
                var qmotoAltra=(Math.abs(altra.dx)+Math.abs(altra.dy))*urtoFactor*altra.size;

                cosa.dx=(qmotoAltra/cosa.size)*(cosa.x-altra.x)/dist;
                cosa.dy=(qmotoAltra/cosa.size)*(cosa.y-altra.y)/dist;

            
                altra.dx=(qmotoCosa/altra.size)*(altra.x-cosa.x)/dist;
                altra.dy=(qmotoCosa/altra.size)*(altra.y-cosa.y)/dist;

                //evitiamo compenetrazione?
                /*cosa.x+=cosa.dx;
                cosa.y+=cosa.dy;
                altra.x+=altra.dx;
                altra.y+=altra.dy;*/
            }
        }

    }
}
function drawBalls()
{
    ctx.save();
    ctx.globalAlpha=0.7;
    drawCircle(currentBall.x,currentBall.y,currentBall.size);
    for(i=0;i<ballsArray.length;i++)
        drawCircle(ballsArray[i].x,ballsArray[i].y,ballsArray[i].size);
    ctx.restore();
}
function createBall(x,y)
{
    currentBall.x=x;
    currentBall.y=y;
    currentBall.dx=0;
    currentBall.dy=0;
    currentBall.size=0;
}
/*#############
    Funzioni Utili
##############*/
function drawCircle(x,y,radius)
{
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.lineWidth = radius/10;
    ctx.strokeStyle = '#003300';
    ctx.stroke();
}
function drawRect(width,height,alignment)
{
    var x=0;
    var y=0;
    if(alignment.indexOf("CENTER")>-1)
    {
        x=(canvasW-width)/2;
        y=(canvasH-height)/2;
    }

    if(alignment.indexOf("TOP")>-1)
        y=0;
    else if(alignment.indexOf("BOTTOM")>-1)
        y=canvasH-height;
    else if(alignment.indexOf("LEFT")>-1)
        x=0;
    if(alignment.indexOf("RIGHT")>-1)
        X=canvasW-width;

    ctx.fillRect(x,y,width,height);

}
function rand(da, a)
{
    if(da>a) return rand(a,da);
    a=a+1;
    return Math.floor(Math.random()*(a-da)+da);
}

//controlli mobile
function mossoTap(evt)
{
    evt.preventDefault();
    dragging=true;
    var rect = canvas.getBoundingClientRect();
    mousex = evt.targetTouches[0].pageX,
    mousey = evt.targetTouches[0].pageY;
    if(evt.targetTouches.length<2) return;
    mouse2x = evt.targetTouches[1].pageX,
    mouse2y = evt.targetTouches[1].pageY;
    if(evt.targetTouches.length<3) return;
    mouse3x = evt.targetTouches[2].pageX,
    mouse3y = evt.targetTouches[2].pageY;
}
function cliccatoTap(evt)
{
    evt.preventDefault();
    var rect = canvas.getBoundingClientRect();
    mousex = evt.targetTouches[0].pageX,
    mousey = evt.targetTouches[0].pageY;
    if(evt.targetTouches.length<2) return;
    mouse2x = evt.targetTouches[1].pageX,
    mouse2y = evt.targetTouches[1].pageY;
    if(evt.targetTouches.length<3) return;
    mouse3x = evt.targetTouches[2].pageX,
    mouse3y = evt.targetTouches[2].pageY;
}
function rilasciatoTap(evt)
{
    evt.preventDefault();
    dragging=false;
    mousey=-100;
    mousex=-100;
    mouse2y=-100;
    mouse2x=-100;
    mouse3y=-100;
    mouse3x=-100;
}
//uindows
function cliccatoMouse(evt)
{
    dragging=true;
    var rect = canvas.getBoundingClientRect();
    mousex=(evt.clientX-rect.left)/(rect.right-rect.left)*canvasW;
    mousey=(evt.clientY-rect.top)/(rect.bottom-rect.top)*canvasH;
}
function mossoMouse(evt)
{
    /*var rect = canvas.getBoundingClientRect();
    mousex=(evt.clientX-rect.left)/(rect.right-rect.left)*canvasW;
    mousey=(evt.clientY-rect.top)/(rect.bottom-rect.top)*canvasH;*/
}
function rilasciatoMouse(evt)
{
    dragging=false;
}