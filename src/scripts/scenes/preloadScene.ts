export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    this.load.image("background", "assets/background.png");
    
    this.load.spritesheet("ship", "assets/spritesheets/ship.png", {
      frameWidth: 16,
      frameHeight: 16
    });
    
    this.load.spritesheet("ship2", "assets/spritesheets/ship2.png", {
      frameWidth: 16,
      frameHeight: 16
    });

    this.load.spritesheet("ship3", "assets/spritesheets/ship3.png", {
      frameWidth: 16,
      frameHeight: 16
    });

    this.load.spritesheet("explosion", "assets/spritesheets/explosion.png", {
      frameWidth: 16,
      frameHeight: 16
    });

    this.load.spritesheet("power-up", "assets/spritesheets/power-up.png", {
      frameWidth: 16,
      frameHeight: 16
    });

    this.load.spritesheet("player", "assets/spritesheets/player.png", {
      frameWidth: 16,
      frameHeight: 24
    });

    this.load.spritesheet("beam", "assets/spritesheets/beam.png", {
      frameWidth: 16,
      frameHeight: 16
    });

    this.load.bitmapFont("pixelFont", "assets/font/font.png", "assets/font/font.xml");
  }

  create() {
    this.scene.start('MainScene');

  }
}
