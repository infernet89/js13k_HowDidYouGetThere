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
var tileSize=Math.min(canvasW/10,canvasH/10);
var isFree=[[true,false,true,false,true,false,true],[false,true,false,true,false,true,false],[true,false,true,false,true,false,true],[false,true,false,true,false,true,false],[true,false,true,false,true,false,true],[false,true,false,true,false,true,false],[true,false,true,false,true,false,true]];
var masterPiece=[];
masterPiece[0]={};
masterPiece[1]={};
levelUp();
var pieces=[];
pieces[0]=masterPiece;
var selected=-1;

function run()
{
	ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.fillStyle="#000000";
    ctx.fillRect(0,0,canvasW,canvasH);
    
    //disegna la scacchiera
    fromX=(canvasW-tileSize*7)/2;
    fromY=(canvasH-tileSize*7)/2;
    ctx.fillStyle = 'white';
    for(i=0;i<7;i++)
        for(k=0;k<7;k++)
            if((i+k)%2==0)
                ctx.fillRect(fromX+tileSize*i,fromY+tileSize*k,tileSize,tileSize);
    //il bordo
    ctx.fillStyle = 'red';
    ctx.fillRect(fromX+tileSize,fromY-10,tileSize*6,10);
    ctx.fillRect(fromX+tileSize*7,fromY-10,10,tileSize*7+10);
    ctx.fillRect(fromX,fromY+tileSize*7,tileSize*7+10,10);
    ctx.fillRect(fromX-10,fromY+tileSize,10,tileSize*6+10);

    //disegna il masterPiece
    ctx.fillStyle = 'green';
    drawCircle(fromX-tileSize/2+tileSize*masterPiece[0].x,fromY-tileSize/2+tileSize*masterPiece[0].y,tileSize/2-10);
    drawCircle(fromX-tileSize/2+tileSize*masterPiece[1].x,fromY-tileSize/2+tileSize*masterPiece[1].y,tileSize/2-10);
    ctx.beginPath();
    ctx.lineWidth=tileSize/2;
    ctx.strokeStyle="green"; // Green path
    ctx.moveTo(fromX-tileSize/2+tileSize*masterPiece[0].x,fromY-tileSize/2+tileSize*masterPiece[0].y);
    ctx.lineTo(fromX-tileSize/2+tileSize*masterPiece[1].x,fromY-tileSize/2+tileSize*masterPiece[1].y);
    ctx.stroke(); // Draw it

    //selezione e muove
    if(dragging)
    {
        if(selected==-1)
            selected=0;//TODO invece controllare le coordinate e decidere chi selezionare

        minx=canvasW;
        maxx=0;
        miny=canvasH;
        maxy=0;
        selectedPiece=pieces[selected];
        for(i=0;i<selectedPiece.length;i++)
        {
            if(minx>selectedPiece[i].x) minx=selectedPiece[i].x;
            if(maxx<selectedPiece[i].x) maxx=selectedPiece[i].x;
            if(miny>selectedPiece[i].y) miny=selectedPiece[i].y;
            if(maxy<selectedPiece[i].y) maxy=selectedPiece[i].y;
        }
        minx=fromX+(minx-1)*tileSize;
        miny=fromY+(miny-1)*tileSize;
        maxx=fromX+maxx*tileSize;
        maxy=fromY+maxy*tileSize;
        var moveTo;
        //movimento top-left
        if((mousex<minx && mousey<(miny+maxy)/2) || (mousex<(minx+maxx)/2 && mousey<miny))
        {
            moveTo="top-left";
        }
        else if((mousex>maxx && mousey<(miny+maxy)/2) || (mousex>(minx+maxx)/2 && mousey<miny))
        {
            moveTo="top-right";
        }
        else if((mousex>maxx && mousey>(miny+maxy)/2) || (mousex>(minx+maxx)/2 && mousey>maxy))
        {
            moveTo="bottom-right";
        }
        else if((mousex<minx && mousey>(miny+maxy)/2) || (mousex<(minx+maxx)/2 && mousey>maxy))
        {
            moveTo="bottom-left";
        }
        else moveTo="nowhere";
        
        /*/debug disegna lo square del pezzo
        document.title=minx+" "+miny+" - "+maxx+" "+maxy;
        minx=fromX+(minx-1)*tileSize;
        miny=fromY+(miny-1)*tileSize;
        maxx=fromX+maxx*tileSize;
        maxy=fromY+maxy*tileSize;
        ctx.fillStyle='red';
        ctx.globalAlpha=0.8;
        ctx.fillRect(minx,miny,maxx-minx,maxy-miny);
        ctx.globalAlpha=1;*/
       

    }
    else selected=-1;

    /*/debug disegna la matrice isFree
    ctx.fillStyle='green';
    for(i=0;i<7;i++)
        for(k=0;k<7;k++)
            if(isFree[i][k]) drawCircle(fromX+tileSize/2+tileSize*i, fromY+tileSize/2+tileSize*k, 35);
            else drawCircle(fromX+tileSize/2+tileSize*i, fromY+tileSize/2+tileSize*k, 5);
            */
}
function levelUp()
{
    level++;
    if(level==1)
    {
        masterPiece[0].x=2;
        masterPiece[0].y=4;
        masterPiece[1].x=3;
        masterPiece[1].y=5;
    }
}
/*#############
    Funzioni Utili
##############*/
function drawCircle(x,y,radius)
{
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    //ctx.fillStyle = 'green';
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
    var rect = canvas.getBoundingClientRect();
    mousex=(evt.clientX-rect.left)/(rect.right-rect.left)*canvasW;
    mousey=(evt.clientY-rect.top)/(rect.bottom-rect.top)*canvasH;
}
function rilasciatoMouse(evt)
{
    dragging=false;
}