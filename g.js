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
var smile=new Image();
smile.src="pics/smile.png";
smile.onload=function() {
    this.height=tileSize;
    this.width=tileSize;
}
var sad=new Image();
sad.src="pics/sad.png";
sad.onload=function() {
    this.height=tileSize;
    this.width=tileSize;
}
//levelUp();//TODO

function run()
{
	ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.fillStyle="#000000";
    ctx.fillRect(0,0,canvasW,canvasH);
    //scacchiera di sfondo?
    ctx.fillStyle='#0F0F0F';
     for(i=0;i<canvasW/(tileSize/5);i++)
        for(k=0;k<canvasH/(tileSize/5);k++)
            if((i+k)%2==0)
                ctx.fillRect((tileSize/5)*i,(tileSize/5)*k,tileSize/5,tileSize/5);

    //il menu
    if(level==0)
    {
        r=rand(1,10);
        ctx.font = "40px Courier";
        ctx.fillStyle="#FFFFFF";
        ctx.fillText("How the ",canvasW/2-390,150);
        ctx.fillStyle="#FFBBBB";
        if(r%2==0)
            ctx.fillText("hell",canvasW/2-205,150);
        else if(r%3==0)
            ctx.fillText("damn",canvasW/2-205,150);
        else if(r%3==0)
            ctx.fillText("heck",canvasW/2-205,150);
        else
            ctx.fillText("fuck",canvasW/2-205,150);
        ctx.fillStyle="#FFFFFF";
        ctx.fillText("did you get there?",canvasW/2-95,150);
        ctx.fillRect(canvasW/2-390,160,700,1);
        
        //disegna il tutorial
        ctx.globalAlpha=0.8;
        ctx.fillStyle='#EEEEEE';
        ctx.fillRect(tileSize-11,canvasH/2-tileSize*2-1,702,232);
        ctx.fillStyle='#0A0A0A';
        ctx.fillRect(tileSize-10,canvasH/2-tileSize*2,700,230);
        ctx.globalAlpha=1;
        ctx.fillStyle = 'green';
        drawCircle(50+tileSize,canvasH/2-tileSize-10,tileSize/2-10);
        drawCircle(50+2*tileSize,canvasH/2-10,tileSize/2-10);
        ctx.beginPath();
        ctx.lineWidth=tileSize/3;
        ctx.strokeStyle='green';
        ctx.moveTo(50+tileSize,canvasH/2-tileSize-10);
        ctx.lineTo(50+2*tileSize,canvasH/2-10,tileSize/2-10);
        ctx.stroke();
        ctx.drawImage(smile,50-tileSize/2+5+tileSize,canvasH/2-tileSize-10-tileSize/2+5,tileSize-10,tileSize-10);
        ctx.drawImage(sad,50+tileSize/2+5+tileSize,canvasH/2-10-tileSize/2+5,tileSize-10,tileSize-10);

        ctx.font= '20px Courier';
        ctx.fillStyle='white';
        ctx.fillText("This is ",30+tileSize*3,canvasH/2-tileSize-30);
        ctx.fillText("He likes to stuck himself.",30+tileSize*3,canvasH/2-tileSize);
        ctx.fillText("Help him reach freedom. ",30+tileSize*3,canvasH/2-tileSize+20);

        ctx.fillText("    moves on a chessboard. ",30+tileSize*3,canvasH/2-tileSize+60);
        ctx.fillText("Like his friends, only on white tiles. ",30+tileSize*3,canvasH/2-tileSize+80);
        ctx.fillText("Drag them diagonally. ",30+tileSize*3,canvasH/2-tileSize+110);
        ctx.fillStyle='green';
        ctx.fillText("Tim",125+tileSize*3,canvasH/2-tileSize-30);
        ctx.fillText("Tim",30+tileSize*3,canvasH/2-tileSize+60);
        //FINE TUTORIAL

        ctx.font = "40px Courier";
        ctx.fillStyle="#666666";
        ctx.fillRect(canvasW/2-60,canvasH-150,120,80);
        ctx.fillStyle="#0000FF";
        ctx.fillText("PLAY",canvasW/2-50,canvasH-100);
        ctx.fillRect(canvasW/2-50,canvasH-90,90,1);

        //credits
        ctx.fillStyle='white';
        ctx.font = "12px Arial";
        ctx.fillText("Made by Infernet89",canvasW-120,canvasH-10);
        if(dragging && mousex>canvasW/2-60 && mousex<canvasW/2+60 && mousey>canvasH-150 && mousey<canvasH-70)
        {
            levelUp();
        }
        return;
    }
    if(level==7)
    {
        ctx.font = "40px Courier";
        ctx.fillStyle="#FFFFFF";
        ctx.fillText("No more levels!",canvasW/2-150,tileSize);
        ctx.font = "80px Courier";
        ctx.fillText("YOU ARE NOW FREE.",canvasW/2-320,tileSize*4);
        ctx.font = "10px Courier";
        ctx.fillText("to play something else...",canvasW/2-320,tileSize*4+10);
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
    ctx.fillStyle = 'black';
    for(i=0;i<7;i++)
        for(k=0;k<7;k++)
            if((i+k)%2!=0)
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
        //disegna una linea per far capire che è selezionato
        ctx.globalAlpha=0.5;
        ctx.strokeStyle="white";
        ctx.beginPath();
        ctx.lineWidth=tileSize/10;
        ctx.moveTo(fromX+tileSize/2+tileSize*selectedPiece[0].x,fromY+tileSize/2+tileSize*selectedPiece[0].y)
        for(i=1;i<selectedPiece.length;i++)
            ctx.lineTo(fromX+tileSize/2+tileSize*selectedPiece[i].x,fromY+tileSize/2+tileSize*selectedPiece[i].y)
        ctx.stroke();
        ctx.globalAlpha=1;
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
                    if(cursor==nope)
                    {
                        if(moveTo=='top-left')
                            ctx.drawImage(topleft,mousex-cursor.width/2,mousey-cursor.height/2,cursor.width,cursor.height);        
                        else if(moveTo=='top-right')
                            ctx.drawImage(topright,mousex-cursor.width/2,mousey-cursor.height/2,cursor.width,cursor.height);        
                        else if(moveTo=='bottom-right')
                            ctx.drawImage(botright,mousex-cursor.width/2,mousey-cursor.height/2,cursor.width,cursor.height);        
                        else if(moveTo=='bottom-left')
                            ctx.drawImage(botleft,mousex-cursor.width/2,mousey-cursor.height/2,cursor.width,cursor.height);        
                    }
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
    ctx.fillText(testoSopra,canvasW/2-40,50);
    ctx.fillText(testoSotto,canvasW/2-(testoSotto.length*5),canvasH-40);
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

    //disegno faccine
    if(piece==masterPiece)
    {
        ctx.drawImage(smile,fromX+tileSize/2+tileSize*piece[0].x-tileSize/2+5,fromY+tileSize/2+tileSize*piece[0].y-tileSize/2+5,tileSize-10,tileSize-10);
        ctx.drawImage(sad,fromX+tileSize/2+tileSize*piece[1].x-tileSize/2+5,fromY+tileSize/2+tileSize*piece[1].y-tileSize/2+5,tileSize-10,tileSize-10);
    }
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
    else if(level==3)
    {
        masterPiece[0].x=2;
        masterPiece[0].y=4;
        isFree[2][4]=false;
        masterPiece[1].x=3;
        masterPiece[1].y=5;
        isFree[3][5]=false;
        pieces.push(masterPiece);

        var tmp=[];
        tmp.color='blue';
        tmp[0]={};
        tmp[0].x=2;
        tmp[0].y=0;
        isFree[2][0]=false;
        tmp[1]={};
        tmp[1].x=1;
        tmp[1].y=1;
        isFree[1][1]=false;
        pieces.push(tmp);

        var tmp=[];
        tmp.color='yellow';
        tmp[0]={};
        tmp[0].x=0;
        tmp[0].y=2;
        isFree[0][2]=false;
        tmp[1]={};
        tmp[1].x=2;
        tmp[1].y=2;
        isFree[2][2]=false;
        tmp[2]={};
        tmp[2].x=3;
        tmp[2].y=1;
        isFree[3][1]=false;
        pieces.push(tmp);

        testoSopra="LEVEL 3";
        testoSotto="Everybody want to reach freedom";
    }
    else if(level==4)
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
        tmp[0].x=3;
        tmp[0].y=5;
        isFree[3][5]=false;
        tmp[1]={};
        tmp[1].x=3;
        tmp[1].y=3;
        isFree[3][3]=false;
        tmp[2]={};
        tmp[2].x=5;
        tmp[2].y=3;
        isFree[5][3]=false;
        pieces.push(tmp);

        var tmp=[];
        tmp.color='yellow';
        tmp[0]={};
        tmp[0].x=6;
        tmp[0].y=0;
        isFree[6][0]=false;
        tmp[1]={};
        tmp[1].x=6;
        tmp[1].y=2;
        isFree[6][2]=false;
        tmp[2]={};
        tmp[2].x=6;
        tmp[2].y=4;
        isFree[6][4]=false;
        pieces.push(tmp);

        var tmp=[];
        tmp.color='purple';
        tmp[0]={};
        tmp[0].x=0;
        tmp[0].y=2;
        isFree[0][2]=false;
        tmp[1]={};
        tmp[1].x=2;
        tmp[1].y=2;
        isFree[2][2]=false;
        tmp[2]={};
        tmp[2].x=4;
        tmp[2].y=2;
        isFree[4][2]=false;
        pieces.push(tmp);

        testoSopra="LEVEL 4";
        testoSotto="Have so many close friends is not always good";
    }
    else if(level==5)
    {
        masterPiece[0].x=5;
        masterPiece[0].y=1;
        isFree[5][1]=false;
        masterPiece[1].x=6;
        masterPiece[1].y=2;
        isFree[6][2]=false;
        pieces.push(masterPiece);

        var tmp=[];
        tmp.color='blue';
        tmp[0]={};
        tmp[0].x=0;
        tmp[0].y=2;
        isFree[0][2]=false;
        tmp[1]={};
        tmp[1].x=1;
        tmp[1].y=3;
        isFree[1][3]=false;
        tmp[2]={};
        tmp[2].x=1;
        tmp[2].y=5;
        isFree[1][5]=false;
        pieces.push(tmp);

        var tmp=[];
        tmp.color='red';
        tmp[0]={};
        tmp[0].x=2;
        tmp[0].y=0;
        isFree[2][0]=false;
        tmp[1]={};
        tmp[1].x=2;
        tmp[1].y=2;
        isFree[2][2]=false;
        pieces.push(tmp);

        var tmp=[];
        tmp.color='yellow';
        tmp[0]={};
        tmp[0].x=2;
        tmp[0].y=4;
        isFree[2][4]=false;
        tmp[1]={};
        tmp[1].x=3;
        tmp[1].y=3;
        isFree[3][3]=false;
        tmp[2]={};
        tmp[2].x=5;
        tmp[2].y=3;
        isFree[5][3]=false;
        pieces.push(tmp);

        testoSopra="LEVEL 5";
        testoSotto="Are you afraid of crowd?";
    }
    else if(level==6)
    {
        masterPiece[0].x=3;
        masterPiece[0].y=3;
        isFree[3][3]=false;
        masterPiece[1].x=4;
        masterPiece[1].y=4;
        isFree[4][4]=false;
        pieces.push(masterPiece);

        var tmp=[];
        tmp.color='yellow';
        tmp[0]={};
        tmp[0].x=1;
        tmp[0].y=1;
        isFree[1][1]=false;
        tmp[1]={};
        tmp[1].x=2;
        tmp[1].y=0;
        isFree[2][0]=false;
        tmp[2]={};
        tmp[2].x=4;
        tmp[2].y=0;
        isFree[4][0]=false;
        pieces.push(tmp);

        var tmp=[];
        tmp.color='purple';
        tmp[0]={};
        tmp[0].x=0;
        tmp[0].y=2;
        isFree[0][2]=false;
        tmp[1]={};
        tmp[1].x=0;
        tmp[1].y=4;
        isFree[0][4]=false;
        pieces.push(tmp);

        var tmp=[];
        tmp.color='red';
        tmp[0]={};
        tmp[0].x=4;
        tmp[0].y=2;
        isFree[4][2]=false;
        tmp[1]={};
        tmp[1].x=5;
        tmp[1].y=1;
        isFree[5][1]=false;;
        pieces.push(tmp);

        var tmp=[];
        tmp.color='blue';
        tmp[0]={};
        tmp[0].x=6;
        tmp[0].y=2;
        isFree[6][2]=false;
        tmp[1]={};
        tmp[1].x=6;
        tmp[1].y=4;
        isFree[6][4]=false;
        tmp[2]={};
        tmp[2].x=5;
        tmp[2].y=5;
        isFree[5][5]=false;
        pieces.push(tmp);

        var tmp=[];
        tmp.color='cyan';
        tmp[0]={};
        tmp[0].x=1;
        tmp[0].y=3;
        isFree[1][3]=false;
        tmp[1]={};
        tmp[1].x=1;
        tmp[1].y=5;
        isFree[1][5]=false;
        tmp[2]={};
        tmp[2].x=3;
        tmp[2].y=5;
        isFree[3][5]=false;
        pieces.push(tmp);

        testoSopra="LEVEL 6";
        testoSotto="The next test is impossible";
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