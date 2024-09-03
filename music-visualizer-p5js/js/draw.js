// Example adapted from https://p5js.org/reference/#/p5.FFT

let points = [];
let shapes = [];

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  background(0);
  frameRate(60);
}

function draw() {
    //draw previous shapes
    for (let i=0;i<shapes.length;i++){
        for(let shape of shapes){
            beginShape();
            for(let pt of shape){
                curveVertex(pt.x,pt.y);
            }
            endShape();
        } 
    }

    //draw active shape
    beginShape();
    stroke(255);
    fill(0,0,0,0);
    for (let i = 0; i < points.length; i++) {
      curveVertex(points[i].x, points[i].y);
    }
    endShape();
  
}

function mousePressed(){
    points = [];
    points.push(createVector(mouseX, mouseY));
}
    
function mouseDragged(){
    points.push(createVector(mouseX, mouseY));
}

function mouseReleased(){
    shapes.push([...points]);
}