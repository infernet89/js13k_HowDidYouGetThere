var DEBUG=0;
//costant
var TO_RADIANS = Math.PI/180; 

//global variables
var canvas;
var canvasW;
var canvasH;
var ctx;
var activeTask;
var level=0;//0 menu TODO

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
var pieces=[];
pieces[0]=masterPiece;
var selectedPiece=-1;
var selected=-1;
var moving=false;
var moveFactorX=0;
var moveFactorY=0;
var progressMovimento=0;
var cursor;
var testoSopra="LEVEL N";
var testoSotto="Random fun fact";

//pictures
var nope=new Image();
nope.src="pics/nope.png";
nope.onload=function() {
    this.height=tileSize/2;
    this.width=tileSize/2;
}
var topleft=new Image();
topleft.src="pics/topleft.png";
topleft.onload=function() {
    this.height=tileSize/2;
    this.width=tileSize/2;
}
var topright=new Image();
topright.src="pics/topright.png";
topright.onload=function() {
    this.height=tileSize/2;
    this.width=tileSize/2;
}
var botright=new Image();
botright.src="pics/botright.png";
botright.onload=function() {
    this.height=tileSize/2;
    this.width=tileSize/2;
}
var botleft=new Image();
botleft.src="pics/botleft.png";
botleft.onload=function() {
    this.height=tileSize/2;
    this.width=tileSize/2;
}
//levelUp();//TODO

function run()
{
	ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.fillStyle="#000000";
    ctx.fillRect(0,0,canvasW,canvasH);
    if(level==0)
    {
        //TODO disegna il menu
        return;
    }
    
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
        //console.debug(selected);
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

        if(cursor!=-1)
        {
            document.body.style.cursor = "none";
            ctx.drawImage(cursor,mousex-cursor.width/2,mousey-cursor.height/2,cursor.width,cursor.height);
        }
        else document.body.style.cursor = "default";
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
                    var horizontalP1=-1;
                    var horizontalP2=-2;
                    var verticalP1=-3;
                    var verticalP2=-4;
                    for(i=0;i<pieces.length;i++)
                    {
                        temp=pieces[i];
                        for(k=0;k<temp.length;k++)
                        {
                            if(temp[k].x==mx-1 && temp[k].y==my)
                                horizontalP1=i;
                            else if(temp[k].x==mx+1 && temp[k].y==my)
                                horizontalP2=i;
                            if(temp[k].x==mx && temp[k].y==my-1)
                                verticalP1=i;
                            else if(temp[k].x==mx && temp[k].y==my+1)
                                verticalP2=i;
                        }
                    }
                    //console.debug(horizontalP1+"=="+horizontalP2+"  "+verticalP1+"="+verticalP2);
                    if(horizontalP1==horizontalP2)
                    {
                        selected=horizontalP1;
                        selectedPiece=pieces[selected];
                    }
                    else if(verticalP1==verticalP2)
                    {
                        selected=verticalP2;
                        selectedPiece=pieces[selected];
                    }
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
            }
            else
            {
                cursor=-1;
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
                        cursor=topleft;
                    }
                    else cursor=nope;
                }
                else if((mousex>maxx && mousey<(miny+maxy)/2) || (mousex>(minx+maxx)/2 && mousey<miny))
                {
                    moveTo="top-right";
                    if(tryMove(+1,-1))
                    {
                        moving=true;
                        moveFactorX=+1;
                        moveFactorY=-1;
                        cursor=topright;
                    }
                    else cursor=nope;
                }
                else if((mousex>maxx && mousey>(miny+maxy)/2) || (mousex>(minx+maxx)/2 && mousey>maxy))
                {
                    moveTo="bottom-right";
                    if(tryMove(+1,+1))
                    {
                        moving=true;
                        moveFactorX=+1;
                        moveFactorY=+1;
                        cursor=botright;
                    }
                    else cursor=nope;
                }
                else if((mousex<minx && mousey>(miny+maxy)/2) || (mousex<(minx+maxx)/2 && mousey>maxy))
                {
                    moveTo="bottom-left";
                    if(tryMove(-1,+1))
                    {
                        moving=true;
                        moveFactorX=-1;
                        moveFactorY=+1;
                        cursor=botleft;
                    }
                    else cursor=nope; 
                }
                else moveTo="nowhere";

                if(cursor!=-1)
                {
                    document.body.style.cursor = "none";
                    ctx.drawImage(cursor,mousex-cursor.width/2,mousey-cursor.height/2,cursor.width,cursor.height);
                }
                else document.body.style.cursor = "default";
                /*/debug disegna lo square del pezzo
                document.title=minx+" "+miny+" - "+maxx+" "+maxy;
                ctx.fillStyle='red';
                ctx.globalAlpha=0.8;
                ctx.fillRect(minx,miny,maxx-minx,maxy-miny);
                ctx.globalAlpha=1;*/
            }
        }
        else
        {
            selected=-1;
            document.body.style.cursor = "default";
        }
    }

    //se masterPiece[0] è a -1, levelUp
    if(masterPiece[0].x==-1 && masterPiece[0].y==-1)
        levelUp();

    //testo sopra e sotto
    ctx.font = "20px Arial";
    ctx.fillStyle="white";
    ctx.fillText(testoSopra,canvasW/2-40,20);
    ctx.fillText(testoSotto,canvasW/2-(testoSotto.length*5),canvasH-10);
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
            else isFree[i][k]=true;
    pieces=[]; 
    selectedPiece=-1;
    selected=-1;
    dragging=false;

    level++;
    if(level==1)
    {
        masterPiece[0].x=2;
        masterPiece[0].y=4;
        isFree[2][4]=false;
        masterPiece[1].x=3;
        masterPiece[1].y=5;
        isFree[3][5]=false;
        pieces.push(masterPiece);

        testoSopra="LEVEL 1";
        testoSotto="Drag the green object outside";
    }
    else if(level==2)
    {
        masterPiece[0].x=5;
        masterPiece[0].y=5;
        isFree[5][5]=false;
        masterPiece[1].x=6;
        masterPiece[1].y=6;
        isFree[6][6]=false;
        pieces.push(masterPiece);

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

        testoSopra="LEVEL 2";
        testoSotto="Sometimes, you need to move obstacles to reach your goal";

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