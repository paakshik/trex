var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var x;
var obstacle1;
var dinosaur = [];
let clouder = {
  cloud1: [],
}
var gameState = "PLAY"
var speed = 4;
var brail = true;
var score = 0;
var invi_trex;

var soundState = "NO_PLAYING";
function preload() {
  trex_running = loadAnimation("trex1.png", "trex2.png", "trex3.png");
  trex_collided = loadImage("trex_collided.png");
  clouder.cloud1 = loadImage("cloud.png");
  groundImage = loadImage("ground2.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  dinosaur = loadImage("kisspng-pterodactyl-pteranodon-pterosaurs-creative-cute-cartoon-dinosaur-5b23807f440ce6.3579039315290533112788.png")
  restart = loadImage("gameOver.png");
  gameOver = loadImage("restart.png");
  collide = loadAnimation("trex_collided.png");
  die = loadSound("die.mp3");
  checkPoint = loadSound("checkPoint.mp3");
  jump = loadSound("jump.mp3");
}

function setup() {
pixelDensity(0.7)
  createCanvas(600, 200);
  resizeCanvas(windowWidth,windowHeight);
  obstacleG = new Group();
  cloudG = new Group();
  //create a trex sprite

  trex = createSprite(50, height- 40, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", collide);
  trex.scale = 0.5;
  trex.depth = 4;

  
  invi_trex = createSprite(140,height - 40,20,50);
  invi_trex.depth = 4;
  invi_trex.visible = false;

  //create a ground sprite
  ground = createSprite(200, height - 20, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;
  ground.velocityX = -speed;


  //creating invisible ground
  invisibleGround = createSprite(200, height - 10, 400, 10);
  invisibleGround.visible = false;

  button = createSprite(width /2, height / 2);
  button.addImage(restart);
  button.visible = 0;

  button1 = createSprite(width / 2, (height / 2)+ 50);
  button1.addImage(gameOver);
  button1.scale = 0.5;
  button1.visible = 0;
  //generate random numbers
if (!localStorage["high"]){
  localStorage["high"] = 0;
  console.log(localStorage["high"]);
}
}

function draw() {
  background(225);
  fill("blue");
  trex.collide(invisibleGround);
  if (gameState === "PLAY") {
    score = score + floor(getFrameRate() / 30);

    print(score);
    obstacles();

    //set background color
    text("Score: " + score, width - 40, 20)
text("Highest Score: "+ localStorage["high"],width - 80,20);
    // jump when the space key is pressed
    if ((touches.length > 0) || (keyDown("space") && trex.y >= height - 100) ){
      trex.velocityY = -7;
      touches = [];
      if (soundState = "NO_PLAYING"){
        jump.play();
        soundState = "PLAYING";
      }
    }
    if (keyDown("a")&&keyDown("p")){
      if (invi_trex.isTouching(obstacleG)){
        trex.velocityY = -7;
      }
    }
    if (keyWentUp("space")){
      soundState = "NO_PLAYING";
    }
    trex.velocityY = trex.velocityY + 0.8

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }
    
    //Spawn Clouds
    spawnClouds()
  }
  
  if (gameState === "END") {
    ground.velocityX = 0;
    obstacleG.setVelocityEach(0, 0)
    trex.velocityY = 0;
    trex.changeAnimation("collided")
    cloudG.setVelocityEach(0, 0);
    button1.visible = 1;
    button.visible = 1;
    cloudG.setLifetimeEach(-300);
    obstacleG.setLifetimeEach(-300);
if (localStorage["high"] < score){
    localStorage["high"] = score;
}
    if (mousePressedOver(button1)||(touches.lenght > 0)) {
      reset();

    }
  }
  drawSprites();

}

//function to spawn the clouds

function spawnClouds() {
  // write your code here 

  x = 600;
  y = Math.round(random(50, height - 100));


  if (World.frameCount % 100 === 0) { 
    var cloud = createSprite(x, y, 50, 50);
    cloud.velocityX = -speed;
    cloud.addImage(clouder.cloud1)
    cloud.tint = "lightblue";
    cloud.depth = 1;
    cloud.visible = brail;
    cloud.lifetime = 300;
    cloudG.add(cloud)
  }
  if (World.frameCount % 200 === 0){
    speed += 2;
    checkPoint.play();
  }
}

function obstacles() {
  ob = Math.round(random(1, 10));

  if (World.frameCount % 100 === 0) {
    obstacle = createSprite(300, height - 40);
        obstacle.velocityX = -speed;
        obstacle.lifetime = 300;
        obstacle.scale = 0.5;
        obstacleG.add(obstacle);
        


    switch (ob) {
      case 1:
        obstacle.addImage(obstacle1);
        
        break;
      case 2:
       
        obstacle.addImage(obstacle2);
        
        break;
      case 3:
        
        obstacle.addImage(obstacle3);
        
        break;
      case 4:
        
        obstacle.addImage(obstacle4);
       
        break;
      case 5:
        
        obstacle.addImage(obstacle5);
        
        break;
      case 6:
        
        obstacle.addImage(obstacle6);
        
        break;



      default:
        
        obstacle.addImage(dinosaur);
        obstacle.scale = 0.05;
        
        
        
    }
  }
  if (score === 1000) {
    brail = false;
    gameState = "WIN"
  }

  trex.setCollider("circle", 0, 20, 20)
  if (obstacleG.isTouching(trex)) {
    gameState = "END";
    die.play();


  }
}

function reset() {
  gameState = "PLAY";
  ground.velocityX = -4;
  obstacleG.setLifetimeEach(0);

  trex.changeAnimation("running")
  cloudG.setVelocityEach(-4, 0);
  button1.visible = 0;
  button.visible = 0;
  cloudG.setLifetimeEach(300);
  score = 0;
}
