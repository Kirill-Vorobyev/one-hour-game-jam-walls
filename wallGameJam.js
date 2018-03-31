//One hour game jam on March 31st 2018 (Theme: walls)

var canvas = document.getElementById('my-canvas');
var ctx = canvas.getContext("2d");
ctx.fillStyle = '#AAAAAA';
ctx.clearRect(0,0,800,600);


class Wall {
    constructor(x,y,broken) {
        this.x = x;
        this.y = y;
        this.width = 200;
        this.height = 100;
        this.broken = broken;
        if(this.broken){
            const r = Math.round(Math.random()*145)+55;
            const g = Math.round(Math.random()*145)+55;
            const b = Math.round(Math.random()*145)+55;
            this.RGBcolor = `rgb(${r},${g},${b})`;
        }else{
            this.RGBcolor = `rgb(0,0,0)`;
        }
    }
    update() {

    }
    getPositionData(){
        const myBlock = {
            x: this.x,
            y: this.y,
            size: this.size,
        };
        return myBlock;
    }

    fix(){
        this.RGBcolor = `rgb(0,0,0)`;
        this.broken = false;
    }
};

class Level {
    constructor(level,brokenNum){
        this.counter = 0;
        this.waitLimit = 30;
        this.level = level;
        this.brokenNum = brokenNum;
        this.wall = [];
        this.levelComplete = false;
        this.timeStart = performance.now();
        this.timeEnd;
        this.levelTime;
    }

    getWall(){
        return this.wall;
    }

    makeWall() {
        let numBroken = 0;
        let newWall = [];
        for(let i=0;i<4;i++){
            for(let j=0;j<7;j++){
                let random = Math.random();
                if(random<=0.4 && numBroken<this.brokenNum){
                    newWall = newWall.concat(new Wall(i*200 + 10*i,j*100 + 10*j + 20,true));
                    numBroken++;
                }else{
                    newWall = newWall.concat(new Wall(i*200 + 10*i,j*100 + 10*j + 20,false));
                }
            }
        }
        this.wall = newWall;
    }

    checkComplete() {
        let complete = true;
        this.wall.forEach(e => {
            if (e.broken){
                complete = false;
            }
        });
        if(complete){
            this.levelComplete = true;
            this.timeEnd = performance.now();
            this.levelTime =  this.timeEnd - this.timeStart;
        }
    }
    
}

const FPS = 10;
const FRAME_TIME = 1000/FPS;
const CANVAS_W = 800;
const CANVAS_H = 800;
let clickX = 0;
let clickY = 0;

myLevel = new Level(1,3);
myLevel.makeWall();

let lastLevelTime = 0;

function updateObjects() {
    if(!myLevel.levelComplete){
        myLevel.checkComplete();
    }else{
        lastLevelTime = myLevel.levelTime;
        myLevel.counter++
        if(myLevel.counter >= myLevel.waitLimit){
            const newLevel = new Level(myLevel.level+1,myLevel.brokenNum + 1);
            newLevel.makeWall();
            myLevel = newLevel;
        }
    }
    renderWall = myLevel.wall;
    ctx.fillStyle = '#AAAAAA';
    ctx.clearRect(0,0,800,800);
    if(renderWall.length > 0){
        for(var i=0;i<renderWall.length;i++){
            ctx.fillStyle = renderWall[i].RGBcolor;
            ctx.fillRect(renderWall[i].x,renderWall[i].y,renderWall[i].width,renderWall[i].height);
        }
    }
    if(myLevel.levelComplete){
        ctx.fillStyle = 'green';
        ctx.font = "100px Arial";
        ctx.fillText("Complete",200,300);
        ctx.font = "60px Arial";
        ctx.fillText(lastLevelTime.toFixed(0)/1000 + " seconds",220,420);
    }
    document.getElementById('info').innerHTML = "Level: " + myLevel.level +" | Max Walls To Fix: "+myLevel.brokenNum;
    window.requestAnimationFrame(updateObjects);
}

window.requestAnimationFrame(updateObjects);

var elem = document.getElementById('my-canvas'),
    elemLeft = elem.offsetLeft,
    elemTop = elem.offsetTop,
    context = elem.getContext('2d');

elem.addEventListener('click', function(event) {
    var x = event.pageX - elemLeft,
        y = event.pageY - elemTop;

    myLevel.wall.forEach(function(element) {
        if (y > element.y && y < element.y + element.height 
            && x > element.x && x < element.x + element.width) {
                if(element.broken){
                    element.fix();
                }
        }
    });

}, false);
