class Base extends PIXI.Sprite {
    constructor(x = 0, y = 0){
        super(app.loader.resources["images/Base0.png"].texture);
        this.anchor.set(.5, .5);
        this.scale.set(1);
        this.x = x;
        this.y = y;
    }

    takeDamage(life){
        if(life == 100){
            this.texture = new PIXI.Texture(app.loader.resources["images/Base1.png"].texture);
        }
        else if(life == 75){
            this.texture = new PIXI.Texture(app.loader.resources["images/Base2.png"].texture);
        }
        else if(life == 50){
            this.texture = new PIXI.Texture(app.loader.resources["images/Base3.png"].texture);
        }
        else{
            return
        }
    }

    healDamage(life){
        if(life == 75){
            this.texture = new PIXI.Texture(app.loader.resources["images/Base0.png"].texture);
        }
        else if(life == 50){
            this.texture = new PIXI.Texture(app.loader.resources["images/Base1.png"].texture);
        }
        else if(life == 25){
            this.texture = new PIXI.Texture(app.loader.resources["images/Base2.png"].texture);
        }
        else{
            return
        }
    }

    reset(){
        this.texture = new PIXI.Texture(app.loader.resources["images/Base0.png"].texture);
    }
}

class Player extends PIXI.Sprite {
    constructor(x = 0, y = 0){
        super(app.loader.resources["images/Player.png"].texture);
        this.anchor.set(0, .5);
        this.scale.set(1);
        this.x = x;
        this.y = y;
    }
}

class Alien extends PIXI.Sprite{
    constructor(radius, color=0xFF0000, x=0, y=0){
        super(app.loader.resources["images/Alien.png"].texture);
        this.anchor.set(.5, .5);
        this.scale.set(.7);
        this.x = x;
        this.y = y;
        this.radius = radius;
        // variables
        this.directionX = 300 - this.x;
        this.directionY = 300 - this.y;
        this.speed = .2;
        this.isAlive = true;
    }

    move(dt=1/60){
        this.x += this.directionX * this.speed * dt;
        this.y += this.directionY * this.speed * dt;
    }

    reflectX(){
        this.directionX *= -1;
    }

    reflectY(){
        this.directionY *= -1;
    }
}

class Heart extends PIXI.Sprite{
    constructor(radius, color=0xFF0000, x=0, y=0){
        super(app.loader.resources["images/Heart.png"].texture);
        this.anchor.set(.5, .5);
        this.scale.set(.7);
        this.x = x;
        this.y = y;
        this.radius = radius;
        // variables
        this.directionX = 300 - this.x;
        this.directionY = 300 - this.y;
        this.speed = .2;
        this.isAlive = true;
    }

    move(dt=1/60){
        this.x += this.directionX * this.speed * dt;
        this.y += this.directionY * this.speed * dt;
    }

    reflectX(){
        this.directionX *= -1;
    }

    reflectY(){
        this.directionY *= -1;
    }
}