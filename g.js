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
masterPiece.color = 'green';
masterPiece[0]={};
masterPiece[1]={};
levelUp();
var pieces=[];
pieces[0]=masterPiece;
var selectedPiece=-1;
var selected=-1;
var moving=false;
var moveFactorX=0;
var moveFactorY=0;
var progressMovimento=0;

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

    //disegna i pezzi
    //console.debug(pieces.length);
    for(drawi=0;drawi<pieces.length;drawi++)
        drawPiece(pieces[drawi]);

    //disegna la selezione eventuale
    if(selected!=-1)
    {
        console.debug(selected);
        //disegna una linea gialla per far capire che è selezionato
        ctx.strokeStyle="yellow"; // Green path
        ctx.beginPath();
        ctx.lineWidth=tileSize/10;
        ctx.moveTo(fromX+tileSize/2+tileSize*selectedPiece[0].x,fromY+tileSize/2+tileSize*selectedPiece[0].y)
        for(i=1;i<selectedPiece.length;i++)
            ctx.lineTo(fromX+tileSize/2+tileSize*selectedPiece[i].x,fromY+tileSize/2+tileSize*selectedPiece[i].y)
        ctx.stroke();
    }

    if(moving)
    {
        //movimento in corso
        selectedPiece=pieces[selected];
        for(i=0;i<selectedPiece.length;i++) 
        {
            selectedPiece[i].x+=moveFactorX/10;
            selectedPiece[i].y+=moveFactorY/10;
        }
        if(++progressMovimento>=10)
        {
            for(i=0;i<selectedPiece.length;i++) 
            {
                selectedPiece[i].x=Math.round(selectedPiece[i].x);
                selectedPiece[i].y=Math.round(selectedPiece[i].y);
            }
            progressMovimento=0;
            moving=false;
        }
    }
    else
    {
        //selezione e muove
        if(dragging)
        {
            if(selected==-1)
            {
                mx=Math.floor((mousex-fromX)/tileSize);
                my=Math.floor((mousey-fromY)/tileSize);
                //console.debug(mx+" "+my);
                if(isFree[mx][my])
                {
                    //TODO gestire la connessione tra pezzi
                }
                else
                {
                    for(i=0;i<pieces.length;i++)
                    {
                        temp=pieces[i];
                        for(k=0;k<temp.length;k++)
                            if(temp[k].x==mx && temp[k].y==my)
                            {
                                selected=i;
                                selectedPiece=pieces[i];
                            }
                    }
                }
                //selected=0;//TODO invece controllare le coordinate e decidere chi selezionare
                //selectedPiece=pieces[selected];
            }
            else
            {
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
                minx=fromX+(minx)*tileSize;
                miny=fromY+(miny)*tileSize;
                maxx=fromX+(maxx+1)*tileSize;
                maxy=fromY+(maxy+1)*tileSize;
                var moveTo;
                //movimento
                if((mousex<minx && mousey<(miny+maxy)/2) || (mousex<(minx+maxx)/2 && mousey<miny))
                {
                    moveTo="top-left";
                    if(tryMove(-1,-1))
                    {
                        moving=true;
                        moveFactorX=-1;
                        moveFactorY=-1;
                    }
                }
                else if((mousex>maxx && mousey<(miny+maxy)/2) || (mousex>(minx+maxx)/2 && mousey<miny))
                {
                    moveTo="top-right";
                    if(tryMove(+1,-1))
                    {
                        moving=true;
                        moveFactorX=+1;
                        moveFactorY=-1;
                    }
                }
                else if((mousex>maxx && mousey>(miny+maxy)/2) || (mousex>(minx+maxx)/2 && mousey>maxy))
                {
                    moveTo="bottom-right";
                    if(tryMove(+1,+1))
                    {
                        moving=true;
                        moveFactorX=+1;
                        moveFactorY=+1;
                    }
                }
                else if((mousex<minx && mousey>(miny+maxy)/2) || (mousex<(minx+maxx)/2 && mousey>maxy))
                {
                    if(tryMove(-1,+1))
                    {
                        moving=true;
                        moveFactorX=-1;
                        moveFactorY=+1;
                    }
                    moveTo="bottom-left";
                }
                else moveTo="nowhere";
                /*/debug disegna lo square del pezzo
                document.title=minx+" "+miny+" - "+maxx+" "+maxy;
                ctx.fillStyle='red';
                ctx.globalAlpha=0.8;
                ctx.fillRect(minx,miny,maxx-minx,maxy-miny);
                ctx.globalAlpha=1;*/
            }
        }
        else selected=-1;
    }

    //se masterPiece[0] è a -1, levelUp
    if(masterPiece[0].x==-1 && masterPiece[0].y==-1)
        levelUp();
    /*/debug disegna la matrice isFree
    ctx.fillStyle='green';
    for(i=0;i<7;i++)
        for(k=0;k<7;k++)
            if(isFree[i][k]) drawCircle(fromX+tileSize/2+tileSize*i, fromY+tileSize/2+tileSize*k, 35);
            else drawCircle(fromX+tileSize/2+tileSize*i, fromY+tileSize/2+tileSize*k, 5);*/
            
}
function drawPiece(piece)
{
    ctx.fillStyle = piece.color;
    //console.log(piece.color);
    for(i=0;i<piece.length;i++)
        drawCircle(fromX+tileSize/2+tileSize*piece[i].x,fromY+tileSize/2+tileSize*piece[i].y,tileSize/2-10);
    ctx.beginPath();
    ctx.lineWidth=tileSize/3;
    ctx.strokeStyle=piece.color;
    ctx.moveTo(fromX+tileSize/2+tileSize*piece[0].x,fromY+tileSize/2+tileSize*piece[0].y);
    for(i=1;i<piece.length;i++)
        ctx.lineTo(fromX+tileSize/2+tileSize*piece[i].x,fromY+tileSize/2+tileSize*piece[i].y);
    ctx.stroke(); // Draw it
}
function tryMove(xfactor, yfactor)
{
    if(selected==-1) return false;
    var ris=true;
    selectedPiece=pieces[selected];
    //libero gli spazi attuali
    for(i=0;i<selectedPiece.length;i++)
        if(selectedPiece[i].x!=-1 && selectedPiece[i].y!=-1)
            isFree[selectedPiece[i].x][selectedPiece[i].y]=true;

    //controllo se si può spostare
    for(i=0;i<selectedPiece.length && ris;i++)
        if(selectedPiece[i].x+xfactor<0 || selectedPiece[i].x+xfactor>6 || selectedPiece[i].y+yfactor<0 || selectedPiece[i].y+yfactor>6)
        {
            if(selectedPiece[i].x+xfactor!=-1 || selectedPiece[i].y+yfactor!=-1) ris=false;
        }
        else if(!isFree[selectedPiece[i].x+xfactor][selectedPiece[i].y+yfactor])
            ris=false;

    //occupo gli spazi
    if(ris)
    {//i prossimi
        for(i=0;i<selectedPiece.length;i++)
            if(selectedPiece[i].x+xfactor!=-1 && selectedPiece[i].y+yfactor!=-1)
                isFree[selectedPiece[i].x+xfactor][selectedPiece[i].y+yfactor]=false;
    }
    else
    {//di nuovo gli attuali
        for(i=0;i<selectedPiece.length;i++)
            if(selectedPiece[i].x!=-1 && selectedPiece[i].y!=-1)
                isFree[selectedPiece[i].x][selectedPiece[i].y]=false;
    }
    return ris;
}
function levelUp()
{
    //reset stuff
    for(i=0;i<7;i++)
        for(k=0;k<7;k++)
            if((i+k)%2==0) isFree[i][k]=true;
    pieces=[];
    pieces[0]=masterPiece;

    level++;
    if(level==1)
    {
        masterPiece[0].x=2;
        masterPiece[0].y=4;
        masterPiece[1].x=3;
        masterPiece[1].y=5;
        isFree[2][4]=false;
        isFree[3][5]=false;
    }
    else if(level==2)
    {
        masterPiece[0].x=5;
        masterPiece[0].y=5;
        isFree[5][5]=false;
        masterPiece[1].x=6;
        masterPiece[1].y=6;
        isFree[6][6]=false;

        var tmp=[];
        tmp.color='blue';
        tmp[0]={};
        tmp[0].x=0;
        tmp[0].y=0;
        isFree[0][0]=false;
        tmp[1]={};
        tmp[1].x=1;
        tmp[1].y=1;
        isFree[1][1]=false;
        tmp[2]={};
        tmp[2].x=1;
        tmp[2].y=3;
        isFree[1][3]=false;
        pieces.push(tmp);

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