// We will use `strict mode`, which helps us by having the browser catch many common JS mistakes
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
"use strict";
const app = new PIXI.Application({
    width: 600,
    height: 600
});
document.body.appendChild(app.view);

// constants
const sceneWidth = app.view.width;
const sceneHeight = app.view.height;

// pre-load the images
app.loader.
    add([
        "images/Base0.png",
        "images/Base1.png",
        "images/Base2.png",
        "images/Base3.png",
        "images/Alien.png",
        "images/Player.png",
        "images/Heart.png",
    ]);
app.loader.onProgress.add(e => { console.log(`progress=${e.progress}`) });
app.loader.onComplete.add(setup);
app.loader.load();

// aliases
let stage;

// game variables
let startScene;
let gameScene, base, scoreLabel, lifeLabel, player, hitSound;
let instructionScene;
let gameOverScene;

let aliens = [];
let hearts = [];
let spawnCounter = 0;
let score = 0;
let life = 100;
let levelNum = 1;
let paused = true;

let gameOverScoreLabel;

function setup() {
    stage = app.stage;

    startScene = new PIXI.Container();
    stage.addChild(startScene);

    gameScene = new PIXI.Container();
    gameScene.visible = false;
    stage.addChild(gameScene);

    instructionScene = new PIXI.Container();
    instructionScene.visible = false;
    stage.addChild(instructionScene);

    gameOverScene = new PIXI.Container();
    gameOverScene.visible = false;
    stage.addChild(gameOverScene);


    createLabelsAndButtons();

    player = new Player();
    gameScene.addChild(player);

    base = new Base();
    gameScene.addChild(base);

    

    hitSound = new Howl({
        src: ['sounds/hit.mp3']
    });


    app.ticker.add(gameLoop);

}

function createLabelsAndButtons() {
    let buttonStyle = new PIXI.TextStyle({
        fill: 0x39FF14,
        fontSize: 48,
        fontFamily: "Futura"
    });

    let startLabel1 = new PIXI.Text("INVASION");
    startLabel1.style = new PIXI.TextStyle({
        fill: 0x39FF14,
        fontSize: 100,
        fontFamily: "Futura",
        stroke: 0x2ECC10,
        strokeThickness: 6
    });
    startLabel1.x = 59;
    startLabel1.y = 120;
    startScene.addChild(startLabel1);

    let startLabel2 = new PIXI.Text("You Are The Last Line Of Defense");
    startLabel2.style = new PIXI.TextStyle({
        fill: 0x39FF14,
        fontSize: 32,
        fontFamily: "Futura",
        strokeThickness: 6
    });
    startLabel2.x = 68;
    startLabel2.y = 300;
    startScene.addChild(startLabel2);

    let startButton = new PIXI.Text("Start");
    startButton.style = buttonStyle;
    startButton.x = 245;
    startButton.y = sceneHeight - 100;
    startButton.interactive = true;
    startButton.buttonMode = true;
    startButton.on("pointerup", loadInstructions);
    startButton.on('pointerover', e => e.target.alpha = 0.7);
    startButton.on('pointerout', e => e.currentTarget.alpha = 1.0);
    startScene.addChild(startButton);


    let instructionTitle = new PIXI.Text("INSTRUCTIONS");
    instructionTitle.style = new PIXI.TextStyle({
        fill: 0x39FF14,
        fontSize: 70,
        fontFamily: "Futura",
        stroke: 0x2ECC10,
        strokeThickness: 6
    });
    instructionTitle.x = 40;
    instructionTitle.y = 70;
    instructionScene.addChild(instructionTitle);

    let instructionStyle = new PIXI.TextStyle({
        fill: 0x39FF14,
        fontSize: 32,
        fontFamily: "Futura"
    });

    let instructions1 = new PIXI.Text("Use the mouse to angle the shield");
    instructions1.style = instructionStyle;
    instructions1.x = 69;
    instructions1.y = 200;
    instructionScene.addChild(instructions1);

    let instructions2 = new PIXI.Text("Hit as many aliens as you can");
    instructions2.style  = instructionStyle;
    instructions2.x = 87;
    instructions2.y = 300;
    instructionScene.addChild(instructions2);

    let instructions3 = new PIXI.Text("Let any heart powerups get into the city");
    instructions3.style  = instructionStyle;
    instructions3.x = 49;
    instructions3.y = 400;
    instructionScene.addChild(instructions3);

    let startButton2 = new PIXI.Text("Start");
    startButton2.style = buttonStyle;
    startButton2.x = 245;
    startButton2.y = sceneHeight - 100;
    startButton2.interactive = true;
    startButton2.buttonMode = true;
    startButton2.on("pointerup", startGame);
    startButton2.on('pointerover', e => e.target.alpha = 0.7);
    startButton2.on('pointerout', e => e.currentTarget.alpha = 1.0);
    instructionScene.addChild(startButton2);

    let textStyle = new PIXI.TextStyle({
        fill: 0x39FF14,
        fontSize: 18,
        fontFamily: "Futura",
        strokeThickness: 4
    });



    scoreLabel = new PIXI.Text();
    scoreLabel.style = textStyle;
    scoreLabel.x = 5;
    scoreLabel.y = 5;
    gameScene.addChild(scoreLabel);
    increaseScoreBy(0);


    lifeLabel = new PIXI.Text();
    lifeLabel.style = textStyle;
    lifeLabel.x = 5;
    lifeLabel.y = 26;
    gameScene.addChild(lifeLabel);
    decreaseLifeBy(0);


    let gameOverText = new PIXI.Text("Game Over!");
    textStyle = new PIXI.TextStyle({
        fill: 0x39FF14,
        fontSize: 64,
        fontFamily: "Futura",
        stroke: 0x2ECC10,
        strokeThickness: 6
    });
    gameOverText.style = textStyle;
    gameOverText.x = 110;
    gameOverText.y = sceneHeight / 2 - 160;
    gameOverScene.addChild(gameOverText);


    let playAgainButton = new PIXI.Text("Play Again?");
    playAgainButton.style = buttonStyle;
    playAgainButton.x = 150;
    playAgainButton.y = sceneHeight - 100;
    playAgainButton.interactive = true;
    playAgainButton.buttonMode = true;
    playAgainButton.on("pointerup", startGame);
    playAgainButton.on('pointerover', e => e.target.alpha = 0.7);
    playAgainButton.on('pointerout', e => e.currentTarget.alpha = 1.0);
    gameOverScene.addChild(playAgainButton);

    gameOverScoreLabel = new PIXI.Text();
    textStyle = new PIXI.TextStyle({
        fill: 0x39FF14,
        fontSize: 48,
        fontFamily: "Futura",
        strokeThickness: 6
    });
    gameOverScoreLabel.style = textStyle;
    gameOverScoreLabel.x = 100;
    gameOverScoreLabel.y = sceneHeight / 2 + 20;
    gameOverScene.addChild(gameOverScoreLabel);

}

function loadInstructions(){
    startScene.visible = false;
    gameOverScene.visible = false;
    instructionScene.visible = true;
    gameScene.visible = false;
}

function startGame() {
    startScene.visible = false;
    gameOverScene.visible = false;
    instructionScene.visible = false;
    gameScene.visible = true;
    levelNum = 1;
    score = 0;
    life = 100;
    increaseScoreBy(0);
    decreaseLifeBy(0);
    player.x = 300;
    player.y = 300;
    base.x = 300;
    base.y = 300;
    paused = false;
}

function increaseScoreBy(value) {
    score += value;
    //console.log(score);
    scoreLabel.text = `Score    ${score}`;
}

function decreaseLifeBy(value) {
    life -= value;
    life = parseInt(life);
    lifeLabel.text = `Life      ${life}%`;
}

function gameLoop() {
    if (paused) return;


    let dt = 1 / app.ticker.FPS;
    if (dt > 1 / 12) dt = 1 / 12;


    //This lets you aim the player
    let mousePosition = app.renderer.plugins.interaction.mouse.global;
    let mouseSlope;
    //Without this the player would not be able to get to the left side of the base.
    if(mousePosition.x < player.x){
        mouseSlope = (mousePosition.y - player.y)/(-mousePosition.x + player.x);
        mouseSlope = mouseSlope * -1;
    }else{
        mouseSlope = (mousePosition.y - player.y)/(mousePosition.x - player.x);
    }
    let angle = Math.atan(mouseSlope) * 180 / Math.PI;
    //Without this the player would not be able to get to the left side of the base.
    if(mousePosition.x < player.x){
        angle = angle + 180;
    }
    player.angle = angle;

    //player.angle += 1;


    //Aliens
    for (let a of aliens) {
        a.move(dt);
        /*if (a.x <= a.radius || a.x >= sceneWidth - a.radius) {
            a.reflectX();
            a.move(dt);
        }

        if (a.y <= a.radius || a.y >= sceneHeight - a.radius) {
            a.reflectY();
            a.move(dt);
        }*/
    }

    //Collisions
    for (let a of aliens) {
        if (a.isAlive && rectsIntersect(a, base)) {
            hitSound.play();
            base.takeDamage(life);
            gameScene.removeChild(a);
            a.isAlive = false;
            decreaseLifeBy(25);
        }

        if (a.isAlive && rectsIntersect(a, player)) {
            gameScene.removeChild(a);
            a.isAlive = false;
            increaseScoreBy(1);
        }
    }

    aliens = aliens.filter(a => a.isAlive);


    //Hearts
    for (let h of hearts) {
        h.move(dt);
    }

    //Collisions
    for (let h of hearts) {
        if (h.isAlive && rectsIntersect(h, base)) {
            base.healDamage(life);
            gameScene.removeChild(h);
            h.isAlive = false;
            decreaseLifeBy(-25);
        }

        if (h.isAlive && rectsIntersect(h, player)) {
            gameScene.removeChild(h);
            h.isAlive = false;
        }
    }


    hearts = hearts.filter(h => h.isAlive);



    if (life <= 0) {
        end();
        return;
    }

    //Spawns aliens
    if(aliens.length <= score/3){
        if(spawnCounter == 0){
            createAlien();
            spawnCounter ++;
        }else if(spawnCounter < 25){
            spawnCounter ++;            
        }else{
            spawnCounter = 0;
        }
    }

    //Spawns hearts
    if(score % 25 == 24 && hearts.length == 0){
        createHeart();
    }

}

function createAlien() {
    let a = new Alien(10, 0xFFFF00);

    switch(aliens.length % 4){
        case 0:
            //console.log(0);
            a.x = 10;
            a.y = Math.random() * (sceneHeight - 20) + 10;
            break;
        case 1:
            //console.log(1);
            a.x = sceneWidth - 10;
            a.y = Math.random() * (sceneHeight - 20) + 10;
            break;
        case 2:
            //console.log(2);
            a.x = Math.random() * (sceneWidth - 20) + 10;
            a.y = 10;
            break;
        case 3:
            //console.log(3);
            a.x = Math.random() * (sceneWidth - 20) + 10;
            a.y = sceneHeight - 10;
            break;
    }

    if(score > 10){
        a.speed = Math.random() * .2 + .07;
    }

    a.directionX = 300 - a.x;
    a.directionY = 300 - a.y;

    //This will make it spawn in a corner - Will update before final
    //a.x = (sceneWidth - 20) * (Math.floor(Math.random() * 2)) + 10;
    //console.log(a.x);
    //a.y = (sceneHeight - 20) * (Math.floor(Math.random() * 2)) + 10;
    //console.log(a.y);

    aliens.push(a);
    gameScene.addChild(a);
}

function createHeart() {
    let h = new Heart(10, 0xFFFF00);

    switch(aliens.length % 4){
        case 0:
            //console.log(0);
            h.x = 10;
            h.y = Math.random() * (sceneHeight - 20) + 10;
            break;
        case 1:
            //console.log(1);
            h.x = sceneWidth - 10;
            h.y = Math.random() * (sceneHeight - 20) + 10;
            break;
        case 2:
            //console.log(2);
            h.x = Math.random() * (sceneWidth - 20) + 10;
            h.y = 10;
            break;
        case 3:
            //console.log(3);
            h.x = Math.random() * (sceneWidth - 20) + 10;
            h.y = sceneHeight - 10;
            break;
    }

    h.speed = Math.random() * .2 + .07;

    h.directionX = 300 - h.x;
    h.directionY = 300 - h.y;

    //This will make it spawn in a corner - Will update before final
    //a.x = (sceneWidth - 20) * (Math.floor(Math.random() * 2)) + 10;
    //console.log(a.x);
    //a.y = (sceneHeight - 20) * (Math.floor(Math.random() * 2)) + 10;
    //console.log(a.y);

    hearts.push(h);
    gameScene.addChild(h);
}


function end() {
    paused = true;
    // clear out level
    aliens.forEach(c => gameScene.removeChild(c));
    aliens = [];

    base.reset();

    gameOverScene.visible = true;
    gameOverScoreLabel.text = `Your final score: ${score}`;
    gameScene.visible = false;
}