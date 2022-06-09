let width = 150;
let height = 150;

const margin = 0;
const numBoids = 100;
var numFood = 250;
const numRedBoids =4;
const visualRange =75;

var boids = [];
var foods = [];
var redBoids = [];


function initBoids(){
    for (var counter =0; counter < numBoids; counter +=1){
        boids[boids.length] = {
            x: Math.random() * width,
            y: Math.random() * height,
            dx: Math.random() * 10 -5,
            dy: Math.random() * 10 -5,
            history: [],
            numberOfFoodAte: 0,
            numberOfTrunsLastAte: 0,
        };
    }
}

function initFood(){
    for (var counter =0; counter < numFood; counter +=1){
        foods[foods.length] = {
            x: Math.random() * (width),
            y: Math.random() * (height)
        };
    }
}

function initRedBoids(){
    for (var counter =0; counter < numRedBoids; counter +=1){
        redBoids[redBoids.length] = {
            x: Math.random() * width,
            y: Math.random() * height,
            dx: Math.random() * 10 -5,
            dy: Math.random() * 10 -5,
            history: [],
            numberOfFoodAte: 0,
            numberOfTrunsLastAte: 0,
        }
    }

}

function distance(boid1, boid2) {
  return Math.sqrt(
    (boid1.x - boid2.x) * (boid1.x - boid2.x) +
      (boid1.y - boid2.y) * (boid1.y - boid2.y),
  );
}

function distanceBetweenRedBoid(boid, redBoid){
    return Math.sqrt(
        (boid.x - redBoid.x) * (boid.x - redBoid.x) +
           (boid.y - redBoid.y) * (boid.y - redBoid.y),
    );

}

function nClosestBoids(boid, n){
    const sorted = boids.slice();
    sorted.sort((a,b) =>  distance(boid,a) - distance(boid,b));
    return sorted.slice(1, n+1);
}

// Called initially and whenever the window resizes to update the canvas
// size and width/height variables.
function sizeCanvas() {
  const canvas = document.getElementById("boids");
  width = window.innerWidth-margin;
  height = window.innerHeight-margin;
  canvas.width = width;
  canvas.height = height;
}

function keepWithinBounds(boid) {
  const turnFactor = 1;

    if (boid.x < margin) {
        boid.dx += turnFactor;
    }
    if (boid.x > width) {
        boid.dx -= turnFactor
    }
    if (boid.y < margin) {
        boid.dy += turnFactor;
    }
    if (boid.y > height
    ) {
        boid.dy -= turnFactor;
    }
}

function keepRedBoidWithinBounds(boid) {
    const turnFactor = 1;

    if (boid.x < margin) {
        boid.dx += turnFactor;
    }
    if (boid.x > width - margin) {
        boid.dx -= turnFactor
    }
    if (boid.y < margin) {
        boid.dy += turnFactor;
    }
    if (boid.y > height - margin) {
        boid.dy -= turnFactor;
    }
}

function flyTowardsCenter(boid){
    const centeringFactor = 0.05;

  let centerX = 0;
  let centerY = 0;
  let numberOfNeighbors = 0;

    for (let otherBoid of boids){
        if (distance(boid, otherBoid) < visualRange){
            centerX += otherBoid.x;
            centerY += otherBoid.y;
            numberOfNeighbors +=1;
        }
    }

    if (numberOfNeighbors>0){
        centerX /= numberOfNeighbors;
        centerY /= numberOfNeighbors;
        boid.dx += (centerX - boid.x) * centeringFactor;
        boid.dy += (centerY - boid.y) * centeringFactor;
    }
}

function flyTowardsCenterOfRedBoid(boid){
    const centeringFactor = 0.05;

    let centerX = 0;
    let centerY = 0;
    let numberOfNeighbors = 0;

    for (let otherBoid of redBoids){
        if (distance(boid, otherBoid) < visualRange){
            centerX += otherBoid.x;
            centerY += otherBoid.y;
            numberOfNeighbors +=1;
        }
    }

    if (numberOfNeighbors>0){
        centerX /= numberOfNeighbors;
        centerY /= numberOfNeighbors;
        boid.dx += (centerX - boid.x) * centeringFactor;
        boid.dy += (centerY - boid.y) * centeringFactor;
    }
}

function avoidOthers(boid) {
    const minDistance = 20;
    const avoidFactor = 0.1;

    let moveX =0;
    let moveY =0;
    for (let otherBoid of boids){
        if (otherBoid !== boid ) {
            if (distance(boid, otherBoid) < minDistance) {
                moveX += boid.x - otherBoid.x;
                moveY += boid.y - otherBoid.y;
            }
        }
    }

    boid.dx += moveX * avoidFactor;
    boid.dy += moveY * avoidFactor;

}

function avoidRedBoidOthers(boid) {
    const minDistance = 50;
    const avoidFactor = 0.2;

    let moveX =0;
    let moveY =0;
    for (let otherBoid of redBoids){
        if (otherBoid !== boid ) {
            if (distance(boid, otherBoid) < minDistance) {
                moveX += boid.x - otherBoid.x;
                moveY += boid.y - otherBoid.y;
            }
        }
    }

    boid.dx += moveX * avoidFactor;
    boid.dy += moveY * avoidFactor;

}

function avoidRedBoids(boid) {
    const minDistance = 20;
    const avoidFactor = 0.7;

    let moveX =0;
    let moveY =0;
    for (let redBoid of redBoids){
        if (distanceBetweenRedBoid(boid, redBoid) < minDistance) {

            moveX += boid.x - redBoid.x;
            moveY += boid.y - redBoid.y;
        }
    }

    boid.dx += moveX * avoidFactor;
    boid.dy += moveY * avoidFactor;

}

function matchVelocity(boid) {
    const matchingFactor = 0.05;

    let avgDX =0;
    let avgDY =0;
    let numberOfNeighbors =0;

    for (let otherBoids of boids){
        if (distance(boid, otherBoids) < visualRange){
            avgDX += otherBoids.dx;
            avgDY += otherBoids.dy;
            numberOfNeighbors +=1;
        }
    }

    if (numberOfNeighbors>0){
        avgDX /= numberOfNeighbors;
        avgDY /= numberOfNeighbors;
        boid.dx += (avgDX - boid.dx) * matchingFactor;
        boid.dy += (avgDY - boid.dy) * matchingFactor;
    }
}

function matchRedBoidVelocity(boid) {
    const matchingFactor = 0.05;

    let avgDX =0;
    let avgDY =0;
    let numberOfNeighbors =0;

    for (let otherBoids of redBoids){
        if (distance(boid, otherBoids) < visualRange){
            avgDX += otherBoids.dx;
            avgDY += otherBoids.dy;
            numberOfNeighbors +=1;
        }
    }

    if (numberOfNeighbors>0){
        avgDX /= numberOfNeighbors;
        avgDY /= numberOfNeighbors;
        boid.dx += (avgDX - boid.dx) * matchingFactor;
        boid.dy += (avgDY - boid.dy) * matchingFactor;
    }
}

function limitSpeed(boid) {
    const speedLimit = 15;

    const speed = Math.sqrt(boid.dx * boid.dx + boid.dy *boid.dy);
    if (speed > speedLimit){
        boid.dx = (boid.dx / speed) * speedLimit;
        boid.dy = (boid.dy / speed) * speedLimit;
    }
}

function limitRedBoidSpeed(boid) {
    const speedLimit = 10;

    const speed = Math.sqrt(boid.dx * boid.dx + boid.dy *boid.dy);
    if (speed > speedLimit){
        boid.dx = (boid.dx / speed) * speedLimit;
        boid.dy = (boid.dy / speed) * speedLimit;
    }
}

function boidAndFoodCollision(boid, food){
    if (distance(boid, food) < 5){
        boid.numberOfTrunsLastAte = 0;
        boid.numberOfFoodAte += 1;
        for (var counter =0; counter < foods.length; counter++){
            if (foods[counter] === food){
                foods.splice(counter, 1);
            }
        }
    }
}

function boidAndRedBoidCollision(boid, redBoid){
    if (distance(boid, redBoid) < 5){
        redBoid.numberOfTrunsLastAte = 0;
        redBoid.numberOfFoodAte += 1;
        for (var counter =0; counter < boids.length; counter++){
            if (boids[counter] === boid){
                boids.splice(counter, 1);
            }
        }

    }
}

const DRAW_TRAIL = false;

function drawBoid(ctx, boid) {
    const angle = Math.atan2(boid.dy, boid.dx);
    ctx.translate(boid.x, boid.y);
    ctx.rotate(angle);
    ctx.translate(-boid.x, -boid.y);
    ctx.fillStyle ="#558cf4";
    ctx.beginPath();
    ctx.moveTo(boid.x, boid.y);
    ctx.lineTo(boid.x - 15, boid.y + 5);
    ctx.lineTo(boid.x - 15, boid.y - 5);
    ctx.lineTo(boid.x, boid.y);
    ctx.fill();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    if (DRAW_TRAIL){
        ctx.strokeStyle = "#558cf466";
        ctx.beginPath();
        ctx.moveTo(boid.history[0][0], boid.history[0][1]);
        for (const point of boid.history) {
            ctx.lineTo(point[0], point[1]);
        }
        ctx.stroke();
    }
}

function drawFood(ctx, food) {
    ctx.beginPath();
    ctx.arc(food.x, food.y, 5, 0, 2 * Math.PI);
    ctx.fillStyle ="#005500";
    ctx.strokeStyle = "#005500";
    ctx.fill();
    ctx.stroke();
}

function drawRedBoid(ctx, redBoid) {
    const angle = Math.atan2(redBoid.dy, redBoid.dx);
    ctx.translate(redBoid.x, redBoid.y);
    ctx.rotate(angle);
    ctx.translate(-redBoid.x, -redBoid.y);
    ctx.fillStyle ="#9f0202";
    ctx.beginPath();
    ctx.moveTo(redBoid.x, redBoid.y);
    ctx.lineTo(redBoid.x - 15, redBoid.y + 5);
    ctx.lineTo(redBoid.x - 15, redBoid.y - 5);
    ctx.lineTo(redBoid.x, redBoid.y);
    ctx.fill();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    if (DRAW_TRAIL){
        ctx.strokeStyle = "#550000";
        ctx.beginPath();
        ctx.moveTo(redBoid.history[0][0], redBoid.history[0][1]);
        for (const point of redBoid.history) {
            ctx.lineTo(point[0], point[1]);
        }
        ctx.stroke();
    }
}

function animationLoop() {
    temp=true;
    for (let boid of boids){
        flyTowardsCenter(boid);
        avoidOthers(boid);
        matchVelocity(boid);
        limitSpeed(boid);
        keepWithinBounds(boid);
        avoidRedBoids(boid);

        boid.x += boid.dx;
        boid.y += boid.dy;
        boid.history.push([boid.x, boid.y]);
        boid.history = boid.history.slice(-50);
    }

    for (let boid of redBoids){
        limitRedBoidSpeed(boid);
        keepRedBoidWithinBounds(boid);
        avoidRedBoidOthers(boid);
        matchRedBoidVelocity(boid);
        flyTowardsCenterOfRedBoid(boid);

        boid.x += boid.dx;
        boid.y += boid.dy;
        boid.history.push([boid.x, boid.y]);
        boid.history = boid.history.slice(-50);
    }


    const ctx = document.getElementById("boids").getContext("2d");
    ctx.clearRect(0, 0, width, height);
    for (let boid of boids){
        drawBoid(ctx, boid);
    }
    for (let food of foods){
        drawFood(ctx, food);
    }
    for (let redBoid of redBoids){
        drawRedBoid(ctx, redBoid);
    }


    if (foods.length <= numFood/10){
        numFood = Math.round(500);
        initFood();
    }

    for (let redBoid of redBoids){
        redBoid.numberOfTrunsLastAte+= 1;
    }

    for (let boid of boids){
        boid.numberOfTrunsLastAte+= 1;
    }

    for (let boid of boids){
        for (let food of foods){
            boidAndFoodCollision(boid,food);
        }
        for (let redBoid of redBoids){
            boidAndRedBoidCollision(boid,redBoid);

        }
    }

    window.requestAnimationFrame(animationLoop);
}

function liveBoids(){
    for (let boid of boids){
        if (boid.numberOfTrunsLastAte > 25){
            for (var counter =0; counter < boids.length; counter++){
                if (boids[counter] === boid){
                    boids.splice(counter, 1);
                }
            }
        }
        if (boid.numberOfFoodAte>0){
            for (var counter =0; counter < boid.numberOfFoodAte/5; counter++) {
                boids.push({
                    x: boid.x + 1,
                    y: boid.y + 1,
                    dx: boid.dx,
                    dy: boid.dy,
                    history: [],
                    numberOfFoodAte: 0,
                    numberOfTrunsLastAte: 0,
                });
            }
            boid.numberOfFoodAte=0;
        }
    }
    for (let redBoid of redBoids){
        if (redBoid.numberOfTrunsLastAte > 10){
            for (var counter =0; counter < redBoids.length; counter++){
                if (redBoids[counter] === redBoid){
                    redBoids.splice(counter, 1);
                }
            }
        }
        if (redBoid.numberOfFoodAte>0 && redBoids.length<50){
            for (var counter =0; counter < redBoid.numberOfFoodAte/10; counter++) {
                redBoids.push({
                    x: redBoid.x + 1,
                    y: redBoid.y + 1,
                    dx: redBoid.dx,
                    dy: redBoid.dy,
                    history: [],
                    numberOfFoodAte: 0,
                    numberOfTrunsLastAte: 0,
                });
            }
            redBoid.numberOfFoodAte=0;
        }
    }
    console.log("boids: "+boids.length);
    console.log("redBoids: "+redBoids.length);
    window.setTimeout(liveBoids, 10000);
}

window.onload = () => {
    window.addEventListener("resize", sizeCanvas, false);
    sizeCanvas();

    initBoids();
    initRedBoids();
    initFood();

    window.requestAnimationFrame(animationLoop);
};

window.setTimeout(liveBoids, 10000);
liveBoids();
liveBoids();