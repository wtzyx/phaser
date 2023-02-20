export default class GameScene extends Phaser.Scene {
    platforms;
    player;
    cursors;
    stars;
    score = 0;
    level = 1;
    scoreText;
    bombs;
    gameOver = false;
    gameOverText;

    boostPowerUp
    jumpPowerUp

    constructor() {
        super('GameScene');
    }

    preload() {
        this.load.image("sky", "assets/sky_new.png");
        this.load.image("ground", "assets/platform_new.png");
        this.load.image("star", "assets/star.png");
        this.load.image("bomb", "assets/bomb.png");
        this.load.image("boost", "assets/rocket_icon.png");
        this.load.image("jump", "assets/jump_icon.png");
        this.load.spritesheet("dude", "assets/dude.png", {frameWidth:32, frameHeight: 48});
    }

    create() {
        this.gameOver = false
        this.add.image(640, 360, "sky");
    
        this.boostPowerUp = this.add.image(80, 624, "boost").setScale(2).setInteractive();
        this.boostPowerUp.cooldown = false;
        this.boostPowerUp.onUse = () => {
            if (this.boostPowerUp.cooldown) {
                return
            }
            if (this.player.body.velocity.x > 0) {
                this.player.setVelocityX(this.player.body.velocity.x + 300)
            }
            else {
                this.player.setVelocityX(this.player.body.velocity.x - 300)
            }
            this.boostPowerUp.cooldown = true
            this.boostPowerUp.alpha = 0.3
            this.time.delayedCall(3000, this.finishCooldown, [this.boostPowerUp])
        }
        this.boostPowerUp.on("pointerdown", this.boostPowerUp.onUse)

        this.jumpPowerUp = this.add.image(1200, 624, "jump").setScale(2).setInteractive();
        this.jumpPowerUp.cooldown = false
        this.jumpPowerUp.onUse = () => {
            if (this.jumpPowerUp.cooldown) {
                return
            }
            this.player.setVelocityY(-500);
            this.jumpPowerUp.cooldown = true
            this.jumpPowerUp.alpha = 0.3
            this.time.delayedCall(3000, this.finishCooldown, [this.jumpPowerUp])
        }
        this.jumpPowerUp.on("pointerdown", this.jumpPowerUp.onUse);




        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(640, 720, "ground").setScale(2).refreshBody(); //bottom
        this.platforms.create(640, -16, "ground").setScale(2).refreshBody(); //top
        //platforms.create(-31, 300, "side").setScale(2).refreshBody();
        //platforms.create(831, 300, "side").setScale(2).refreshBody();
        this.platforms.create(640, 550, "ground").setScale(0.5).refreshBody(); //lower center
        this.platforms.create(180, 250, "ground"); //upper left
        this.platforms.create(1000, 375, "ground"); //upper right



        this.player = this.physics.add.sprite(100, 450, "dude");
        this.player.setBounce(1);
        this.player.setCollideWorldBounds(true);

        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("dude", {start: 0, end: 3}),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: "turn",
            frames: [{key: "dude", frame: 4}],
            frameRate: 20,
        });
        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("dude", {start: 5, end: 8}),
            frameRate: 10,
            repeat: -1,
        });

        this.stars = this.physics.add.group({
            key: "star",
            repeat: 11,
            setXY: {x: 12, y: 0, stepX: (this.scale.gameSize.width - 10) / 12},
        });

        this.stars.children.iterate(function(child){
            child.setBounce(1);
        });

        this.bombs = this.physics.add.group();
        this.scoreText = this.add.text(20, 20, "score: 0", {fontSize: "32px", fill: "#000"});
        this.gameOverText = this.add.text(200, 200, "GAME OVER!\nPress Something\nto continue.", {fontSize: "128px", fill: "#ff0000"});
        this.gameOverText.x = 640 - (this.gameOverText.width / 2)
        this.gameOverText.y = 360 - (this.gameOverText.height / 2)
        this.gameOverText.setAlign("center")
        this.gameOverText.setVisible(false);

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
        this.physics.add.collider(this.bombs, this.platforms);
        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.input.keyboard.on("keydown-SPACE", this.jumpPowerUp.onUse)
        this.input.keyboard.on("keydown-SHIFT", this.boostPowerUp.onUse)
        this.input.on("pointerdown", () => {
            if (this.gameOver) {
                this.scene.start("TitleScene")
            }
        })
        this.input.keyboard.on("keydown", () => {
            if (this.gameOver) {
                this.scene.start("TitleScene")
            }
        })

    }

    update() {
        this.pointer = this.input.activePointer;
        if (this.pointer.isDown) {
            if (this.pointer.worldX > this.player.body.x) {
                if (this.player.body.velocity.x < 300) {
                    this.player.setVelocityX(this.player.body.velocity.x + 15)
                }
                this.player.anims.play("right", true);
            }
            else if (this.pointer.worldX < this.player.body.x) {
                    if (this.player.body.velocity.x > -300) {
                        this.player.setVelocityX(this.player.body.velocity.x - 15)
                    }
                this.player.anims.play("left", true);
            }
            else {
                this.player.anims.play("turn");
            }
        }
        else {
            if (this.cursors.left.isDown) {
                    if (this.player.body.velocity.x > -300) {
                        this.player.setVelocityX(this.player.body.velocity.x - 15)
                    }
                this.player.anims.play("left", true);
            }
            else if (this.cursors.right.isDown) {
                    if (this.player.body.velocity.x < 300) {
                        this.player.setVelocityX(this.player.body.velocity.x + 15)
                    }
                this.player.anims.play("right", true);
            }
            else {
                //player.setVelocityX(0);
                this.player.anims.play("turn");
            }
        }
        if (this.player.body.blocked.down) {
            this.player.setVelocityY(-350);
        }
        if (this.player.body.blocked.up) {
            this.player.setVelocityY(350);
        }
        if (this.player.body.blocked.right) {
            this.player.setVelocityX(-350);
        }
        if (this.player.body.blocked.left) {
            this.player.setVelocityX(350);
        }
    }
    
    collectStar(player, star) {
        star.disableBody(true, true);
        let maxwidth = this.scale.gameSize.width
        this.score += 10;
        this.scoreText.setText("Score: " + this.score);

        if (this.stars.countActive(true) === 0) {
            if (this.level < 10) {
                this.level += 1;
            }
            this.stars.children.iterate(function(child) {
                child.x = Phaser.Math.Between(child.x -10, child.x + 10);
                if (child.x < 10) {
                    child.x = 10;
                }
                if (child.x > (maxwidth - 10)) {
                    child.x = maxwidth - 10;
                }
                child.enableBody(true, child.x, 0, true, true);
                child.setBounce(1);
                child.setCollideWorldBounds(true);
                child.setVelocity(Phaser.Math.Between(-20 * Phaser.Math.Between(1,10), Phaser.Math.Between(1,10) * 20), Phaser.Math.Between(1,10)* 5);
            });

            var x = (player.x < 640) ? Phaser.Math.Between(640, 1280) : Phaser.Math.Between(0, 640);

            let bomb = this.bombs.create(x, 16, "bomb");
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(15, 25+ this.level));
        }
    }

    hitBomb(player, bomb) {
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play("turn");

        this.gameOver = true;
        this.gameOverText.setVisible(true);
    }

    finishCooldown(power) {
        power.cooldown = false
        power.alpha = 1
    }
}