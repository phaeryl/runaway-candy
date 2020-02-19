var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var stars;
var platforms;
var cursors;
var score = 0;
var scoreText;
var isPressed = false;
var isRed = true;
var isBlue = false;
var isYellow = false;
var rouge;
var bleu;
var jaune;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('sky', 'assets/PrototypeAssets/sky.png');
    this.load.image('ground', 'assets/PrototypeAssets/platform.png');
    this.load.image('star', 'assets/PrototypeAssets/star.png');
    this.load.image('bomb', 'assets/PrototypeAssets/bomb.png');
    this.load.image('rouge', 'assets/PrototypeAssets/rouge.png');
    this.load.image('bleu', 'assets/PrototypeAssets/bleu.png');
    this.load.image('jaune', 'assets/PrototypeAssets/jaune.png');

    this.load.spritesheet('dude', 'assets/PrototypeAssets/dude.png', { frameWidth: 32, frameHeight: 48 });

    this.input.keyboard.on('keydown_SPACE', function (event) {
        isPressed = true;
        if (isPressed && isRed == true && isBlue == false && isYellow == false) {
          isRed = false;
          isBlue = true;
          console.log('Couleur bleue activée !')
          console.log(`rouge : ${isRed}, bleu: ${isBlue}, jaune: ${isYellow}`);

          isPressed = false;
        }
        if (isPressed && isRed == false && isBlue == true && isYellow == false) {
          isBlue = false;
          isYellow = true;
          console.log('Couleur jaune activée !');
          console.log(`rouge : ${isRed}, bleu: ${isBlue}, jaune: ${isYellow}`);
          isPressed = false;
        }
        if (isPressed && isRed == false && isBlue == false && isYellow == true) {
          isYellow = false;
          isRed = true;
          console.log('Couleur rouge activée !');
          console.log(`rouge : ${isRed}, bleu: ${isBlue}, jaune: ${isYellow}`);

          isPressed = false;
        }
    
      });
}

function create ()
{
    this.add.image(400, 300, 'sky');

    platforms = this.physics.add.staticGroup();
    rouge = this.physics.add.staticGroup();
    bleu = this.physics.add.staticGroup();
    jaune = this.physics.add.staticGroup();

    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    rouge.create(600, 400, 'rouge');
    bleu.create(250, 250, 'bleu');
    jaune.create(750, 220, 'jaune');

    player = this.physics.add.sprite(100, 450, 'dude');

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    cursors = this.input.keyboard.createCursorKeys();

    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    stars.children.iterate(function (child) {

        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });

    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);

    this.physics.add.overlap(player, stars, collectStar, null, this);
    if (isRed) {
        this.physics.add.collider(player,rouge);
    }
    if (isBlue) {
        this.physics.add.collider(player,bleu);    }
}

function update ()
{
    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);

        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-330);
    }

    if (isRed) {
        this.physics.add.collider(player,rouge);
    }
    if (isBlue) {
        this.physics.add.collider(player,bleu);
        
    }
}   

function collectStar (player, star)
{
    star.disableBody(true, true);

    score += 10;
    scoreText.setText('Score: ' + score);
}