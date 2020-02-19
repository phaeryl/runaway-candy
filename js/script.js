var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 600
      },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var game = new Phaser.Game(config);
var isPressed = false;
var isRed = true;
var isBlue = false;
var isYellow = false;

function preload() {

  // chargement des images background "sky" + 3 blocs
  this.load.image('sky', 'assets/sky.png');
  this.load.image('ground', 'assets/stone.png');
  this.load.image('stoneCenter', 'assets/stoneCenter.png');
  this.load.image('stoneHill_right', 'assets/stoneHill_right.png');

  // chargement du sprite du personnage
  this.load.spritesheet('dude',
    'assets/dude.png', {
      frameWidth: 32,
      frameHeight: 48
    }
  );
  // Ajout d'un event listener sur la touche A  
  this.input.keyboard.on('keydown_A', function (event) {
    isPressed = true;
    if (isPressed && isRed == true && isBlue == false && isYellow == false) {
      isRed = false;
      isBlue = true;
      console.log('Couleur bleue activée !')
      isPressed = false;
    }
    if (isPressed && isRed == false && isBlue == true && isYellow == false) {
      isBlue = false;
      isYellow = true;
      console.log('Couleur jaune activée !');
      isPressed = false;
    }
    if (isPressed && isRed == false && isBlue == false && isYellow == true) {
      isYellow = false;
      isRed = true;
      console.log('Couleur rouge activée !');
      isPressed = false;
    }

  });

}

// declaration de la variable platforms afin de lui assigner la generation du niveau dans la méthode create()
var platforms;

function create() {

  // ajout du background
  this.add.image(400, 300, 'sky');

  // on designe platforms comme des tiles static
  platforms = this.physics.add.staticGroup();

  // --------------------------------------------------- generation de bloc, un par un en attendant de boucler sur un json pour generer la map -------------------
  platforms.create(784, 521, 'ground');
  platforms.create(720, 521, 'ground');
  platforms.create(656, 521, 'ground');
  platforms.create(592, 521, 'ground');

  platforms.create(592, 585, 'stoneCenter').setScale(0.5).refreshBody();
  platforms.create(656, 585, 'stoneCenter').setScale(0.5).refreshBody();
  platforms.create(720, 585, 'stoneCenter').setScale(0.5).refreshBody();
  platforms.create(784, 585, 'stoneCenter').setScale(0.5).refreshBody();

  platforms.create(528, 521, 'ground');
  platforms.create(464, 521, 'ground');

  platforms.create(528, 585, 'stoneCenter').setScale(0.5).refreshBody();
  platforms.create(464, 585, 'stoneCenter').setScale(0.5).refreshBody();
  platforms.create(400, 585, 'stoneCenter').setScale(0.5).refreshBody();

  platforms.create(400, 521, 'stoneHill_right').setScale(0.5).refreshBody();

  platforms.create(336, 585, 'ground');
  platforms.create(272, 585, 'ground');
  platforms.create(208, 585, 'ground');
  platforms.create(144, 585, 'ground');
  platforms.create(80, 585, 'ground');
  platforms.create(16, 585, 'ground');

  // ----------------------------------------------------------------------------------------------------------------------------------------------------------

  // Ajout du personnage
  player = this.physics.add.sprite(100, 450, 'dude');

  // Gestion du rebondissement du personnage
  player.setBounce(0.1);

  //
  player.setCollideWorldBounds(true);

  // declaration de la collision entre player, platforms
  this.physics.add.collider(player, platforms);

  //
  cursors = this.input.keyboard.createCursorKeys();

  // assignation des frames par rapport aux mouvement + assignation touche
  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', {
      start: 0,
      end: 3
    }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'turn',
    frames: [{
      key: 'dude',
      frame: 4
    }],
    frameRate: 20
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', {
      start: 5,
      end: 8
    }),
    frameRate: 10,
    repeat: -1
  });

}




function update() {

  // reglage de la vitesse du personnage

  if (cursors.left.isDown) {
    player.setVelocityX(-280);

    player.anims.play('left', true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(280);

    player.anims.play('right', true);
  } else {
    player.setVelocityX(0);

    player.anims.play('turn');
  }

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-360);
  }

}