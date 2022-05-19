var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var enemy , enemyA
var bullet, bulletIMG 
var playerBullet, playerBulletIMG

var shield , shieldIMG
var shieldLife = 10 ;

var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var enemyKill

var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");

  enemyA = loadImage("Enemy.png");
  
  groundImage = loadImage("ground2.png");

 bulletIMG = loadImage("bulletShoot.png")
 playerBulletIMG = loadImage("bulletShoot.png")
 shieldIMG = loadImage("shield.png");

  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 200);

  var message = "This is a message";
 console.log(message)
  
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);

  enemy = createSprite(550,150,20,50);
  enemy.addImage( enemyA );
  enemy.scale = 0.5;

  bulletgroup = new Group() ; 
  playerBulletgroup = new Group();
  

  shield = createSprite(100,180,20,50)
  shield.addImage( shieldIMG )
  shield.scale = 0.2;
  shield.visible = false ; 
  
  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  

  
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  trex.debug = true;


  
  score = 0;
  
}

function draw() {
  
  background(180);
  //displaying score
  text("Score: "+ score, 500,50);

  enemy.y = trex.y
  shield.y = trex.y
  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 100) {
        trex.velocityY = -12;
        jumpSound.play();
    }
    if (keyDown("A")){
      shield.visible = true;
      shield.y = trex.y ;

      if(bulletgroup.isTouching(shield)){

        jumpSound.play();
        bulletgroup.destroyEach();
        shieldLife -= 1 ;
        if(shieldLife <= 0){
        shield.destroy();

        };
      }

    }

    if(keyWentUp("A")){
      shield.visible = false;
      shield.y = trex.y;
    }

    if(keyDown("Q")){
    spawnPlayerBullet()
    };;

    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
      
    
    if(obstaclesGroup.isTouching(trex)){
     //   trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
    if(bulletgroup.isTouching(trex)){

      jumpSound.play();
      gameState = END;
      dieSound.play()
    }
    


  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the trex animation
      trex.changeAnimation("collided", trex_collided);
    
     
     
      ground.velocityX = 0;
      trex.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    bulletgroup.setLifetimeEach(-1);
    bulletgroup.setVelocityXEach(0);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    

     if(mousePressedOver(restart)) {   
      reset();
    }


   }

   //enemy shooting
  if(frameCount % 50 === 0) {


    spawnBullet();
    

  }
  
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  



  drawSprites();
}

function reset(){

  gameState = PLAY;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  bulletgroup.destroyEach()
  trex.changeAnimation("running" ,trex_running);
  score = 0 ;

}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,165,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

function spawnBullet(){

  bullet = createSprite(550,Math.round(random(10,190)) , 60, 10);
  bullet.addImage( bulletIMG )
  bullet.x = enemy.x;
  bullet.velocityX = -10-(6 + score/100);
  bullet.lifetime = 300;
  bullet.scale = 0.1;

  bullet.depth = enemy.depth;
  bullet.depth = bullet.depth + 1;
  bulletgroup.add(bullet);
   }

  function spawnPlayerBullet(){

    playerBullet = createSprite(trex.x, trex.y);
    playerBullet.addImage(playerBulletIMG);
    playerBullet.velocityX = +10+(6 + score/100);
    playerBullet.lifetime = 300;
    playerBullet.scale = 0.1;

    playerBullet.depth = trex.depth;
  playerBullet.depth = bullet.depth + 1;
  playerBulletgroup.add(playerBullet);

  }


