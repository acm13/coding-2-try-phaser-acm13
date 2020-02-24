import ExampleObject from '../objects/exampleObject';
import {Beam} from '../scenes/beam';
import {Explosion} from '../scenes/explosion';

export default class MainScene extends Phaser.Scene {
  private exampleObject: ExampleObject;
  private background;
  private ship1;
  private ship2;
  private ship3;
  private powerUps;
  private player;
  private cursorKeys;
  private spacebar;
  private projectiles;
  private enemies;
  private scoreLabel;
  private score;

  constructor() {
    super({ key: 'MainScene' });
  }

  create() {
    this.background = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, "background");
    this.background.setOrigin(0,0);

    var graphics = this.add.graphics();
    graphics.fillStyle(0x000000, 1);
    graphics.beginPath();
    graphics.moveTo(0, 0);
    graphics.lineTo(this.scale.width, 0);
    graphics.lineTo(this.scale.width, 20);
    graphics.lineTo(0, 20);
    graphics.lineTo(0, 0);
    graphics.closePath();
    graphics.fillPath();

    this.score = 0;

    this.scoreLabel = this.add.bitmapText(10, 5, "pixelFont", "SCORE ", 16);

    this.ship1 = this.add.sprite(this.scale.width/2 - 50, this.scale.height/2, "ship");
    this.ship2 = this.add.sprite(this.scale.width/2, this.scale.height/2, "ship2");
    this.ship3 = this.add.sprite(this.scale.width/2 + 50, this.scale.height/2, "ship3");

    this.enemies = this.physics.add.group();
    this.enemies.add(this.ship1);
    this.enemies.add(this.ship2);
    this.enemies.add(this.ship3);

    this.anims.create({
      key: "ship1_anim",
      frames: this.anims.generateFrameNumbers("ship", {}),
      frameRate: 20,
      repeat: -1
    });
    this.anims.create({
      key: "ship2_anim",
      frames: this.anims.generateFrameNumbers("ship2", {}),
      frameRate: 20,
      repeat: -1
    });
    this.anims.create({
      key: "ship3_anim",
      frames: this.anims.generateFrameNumbers("ship3", {}),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: "explode",
      frames: this.anims.generateFrameNumbers("explosion", {}),
      frameRate: 20,
      repeat: 0,
      hideOnComplete: true
    });

    this.anims.create({
      key: "red",
      frames: this.anims.generateFrameNumbers("power-up", {
        start: 0,
        end: 1
      }),
      frameRate: 20,
      repeat: -1
    });
    this.anims.create({
      key: "gray",
      frames: this.anims.generateFrameNumbers("power-up", {
        start: 2,
        end: 3
      }),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: "thrust",
      frames: this.anims.generateFrameNumbers("player", {}),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: "beam-anim",
      frames: this.anims.generateFrameNumbers("beam", {}),
      frameRate: 20,
      repeat: -1
    });

    this.powerUps = this.physics.add.group();
    
    var maxObjects = 4;
    for (var i = 0; i <= maxObjects; i++){
      var powerUp = this.physics.add.sprite(16, 16, "power-up");
      this.powerUps.add(powerUp);
      powerUp.setRandomPosition(0, 0, this.scale.width, this.scale.height);

      if (Math.random() > 0.5) {
        powerUp.play("red");
      }
      else{
        powerUp.play("gray");
      }

      powerUp.setVelocity(100,100);
      powerUp.setCollideWorldBounds(true);
      powerUp.setBounce(1);
    }

    this.ship1.play("ship1_anim");
    this.ship2.play("ship2_anim");
    this.ship3.play("ship3_anim");

    this.ship1.setInteractive();
    this.ship2.setInteractive();
    this.ship3.setInteractive();

    this.input.on('gameobjectdown', this.destroyShip, this);

    this.player = this.physics.add.sprite(this.scale.width/2 - 8, this.scale.height-64, "player");
    this.player.play("thrust");
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.player.setCollideWorldBounds(true);

    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.projectiles = this.add.group();

    this.physics.add.collider(this.projectiles, this.powerUps, function(projectile, powerUp) {
      projectile.destroy();
    });

    this.physics.add.overlap(this.player, this.powerUps, this.pickPowerUp, undefined, this);
    this.physics.add.overlap(this.player, this.enemies, this.hurtPlayer, undefined, this);
    this.physics.add.overlap(this.projectiles, this.enemies, this.hitEnemy, undefined, this);
  }

  hitEnemy(projectile, enemy){
    var explosion = new Explosion(this, enemy.x, enemy.y);
    projectile.destroy();
    this.resetShipPos(enemy);
    this.score += 15;
    var scoreFormated = this.zeroPad(this.score, 6);
    this.scoreLabel.text = "SCORE " + scoreFormated;
  }

  hurtPlayer(player, enemy){
    this.resetShipPos(enemy);
    if(this.player.alpha < 1){
      return;
    }
    var explosion = new Explosion(this, player.x, player.y);
    player.disableBody(true, true);
    this.time.addEvent({
      delay: 1000,
      callback: this.resetPlayer,
      callbackScope: this,
      loop: false
    });
  }

  resetPlayer(){
    var x = this.scale.width/2 - 8;
    var y = this.scale.height + 64;
    this.player.enableBody(true, x, y, true, true);

    this.player.alpha = 0.5;   
  }

  pickPowerUp(player, powerUp){
    powerUp.disableBody(true, true);
  }

  moveShip(ship, speed){
    ship.y += speed;
    if (ship.y > this.scale.height){
      this.resetShipPos(ship);
    }
  }

  resetShipPos(ship){
    ship.y = 0;
    var randomX = Phaser.Math.Between(0, this.scale.width);
    ship.x = randomX;
  }

  destroyShip(pointer, gameObject){
    gameObject.setTexture("explosion");
    gameObject.play("explode");
  }

  movePlayerManager(){
    if(this.cursorKeys.left.isDown){
      this.player.setVelocityX(-200);
    }
    else if(this.cursorKeys.right.isDown){
      this.player.setVelocityX(200);
    }
    else{
      this.player.setVelocityX(0);
    }

    if(this.cursorKeys.up.isDown){
      this.player.setVelocityY(-200);
    }
    else if(this.cursorKeys.down.isDown){
      this.player.setVelocityY(200);
    }
    else{
      this.player.setVelocityY(0);
    }
  }

  shootBeam(){
    var beam = new Beam(this);
    //var beam = this.physics.add.sprite(this.player.x, this.player.y, "beam");
  }

  zeroPad(number, size){
    var stringNumber = String(number);
    while(stringNumber.length < (size || 2)){
      stringNumber = "0" + stringNumber;
    }
    return stringNumber;
  }
  

  update() {
    this.moveShip(this.ship1, 1);
    this.moveShip(this.ship2, 2);
    this.moveShip(this.ship3, 3);

    this.background.tilePositionY -= 0.5;

    this.movePlayerManager();

    if (Phaser.Input.Keyboard.JustDown(this.spacebar)){
      if(this.player.active){
        this.shootBeam();
      }
    }

    for(var i = 0; i < this.projectiles.getChildren().length; i++){
      var beam = this.projectiles.getChildren()[i];
      beam.update();
    }
    
  }
}
