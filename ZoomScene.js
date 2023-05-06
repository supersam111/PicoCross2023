var SPEED = 5;

class ZoomScene extends Phaser.Scene {

    constructor() {
        super("ZoomScene");
    }

    init(data) {
        this.image = data.image;
    }

    create() {
        this.add.rectangle(config.width / 2, config.height / 2, config.width, config.height, 0x000000, 0.5);

        this.art = GameScene.zoomedArt;
        console.log("ZoomScene: Running");
        this.artwork = this.add.sprite(config.width / 2, config.height / 2, this.image.texture);
        this.artwork.setScale(config.height / this.artwork.height);
        this.artwork.setInteractive();
        this.input.on('pointerdown', () => this.enlarge(this.artwork));

        this.scaleWidth;
        this.scaleHeight;

        this.creditBox = this.add.rectangle(config.width / 2, 700, config.width, 100, 0x000000, 0.75);
        var iter = this.image.getData("artCount");

        //Account for bonus art
        switch (iter) {
            case 65: //z1z0
                iter = 63;
                break;
            case 66: //CaioAdriel2006
                iter = 6;
                break;
            case 67: // BaldIntegra
                iter = 2;
                break;
            case 68: //Schrekengast
                iter = 48;
                break;
            case 69: //Bozubrain
                iter = 5;
                break;
            case 70: //SloppyStinko
                iter = 51;
                break;
        }
        this.creditText1 = this.add.text(this.creditBox.x, this.creditBox.y - 20, artnames[this.image.getData("artCount")] + " by " + collaborators[iter]);
        //this.creditText2 = this.add.text(this.creditBox.x, this.creditBox.y + 20, "Click here to visit their Newgrounds page!");
        this.creditText1.x = this.creditBox.x - (this.creditText1.width / 2);
        //this.creditText2.x = this.creditBox.x - (this.creditText2.width / 2);
        this.creditBox.setInteractive();
        //this.artLink = "https://www." + collaborators[iter] + ".newgrounds.com";
        //this.creditBox.on('pointerdown', () => window.open(this.artLink));

        // Back button
        this.input.keyboard.on('keydown-ESC', () => this.toGame);

        // Initialize keys
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        //This button should return us to game
        this.returnBtn = this.add.sprite(75, 735, "returnSprite");
        this.returnBtn.setInteractive();
        this.returnBtn.on('pointerdown', () => { this.toGame(); this.sound.play("clickSFX"); });
        this.returnBtn.on('pointerover', () => this.returnBtn.setTexture("returnSprite", 1));
        this.returnBtn.on('pointerout', () => this.returnBtn.setTexture("returnSprite", 0));
    }

    update() {
        this.scaleWidth = this.artwork.width * this.artwork.scaleX;
        this.scaleHeight = this.artwork.height * this.artwork.scaleY;
        if (this.keyA.isDown && (this.artwork.x + this.scaleWidth / 2 - 20 > 0)) {
            this.artwork.x -= SPEED;
        }
        else if (this.keyD.isDown && (this.artwork.x < config.width + this.scaleWidth / 2 - 20)) {
            this.artwork.x += SPEED;
        }

        if (this.keyW.isDown && (this.artwork.y + this.scaleHeight / 2 - 20 > 0)) {
            this.artwork.y -= SPEED;
        }
        else if (this.keyS.isDown && (this.artwork.y < config.height + this.scaleHeight / 2 - 20)) {
            this.artwork.y += SPEED;;
        }

    }

    /**Go back to the game. */
    toGame() {
        console.log("Exiting zoom");
        this.scene.resume("GameScene");
        this.scene.stop();
    }

    enlarge(image) {
        if (image.scaleX == 1) {
            image.setScale(config.height / image.height);
        }
        else {
            image.setScale(1);
        }
        image.setPosition(config.width / 2, config.height / 2);
    }
}