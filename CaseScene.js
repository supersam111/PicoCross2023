class CaseScene extends Phaser.Scene {
    constructor() {
        super("CaseScene");
    }
    init(data) {
        this.levelNum = data.levelNum;
    }

    create() {
        this.bg = this.add.sprite(0, 0, "bg").setOrigin(0, 0);

        this.skitConfig = {
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: false,
            delay: 0,
        };
        this.skit = this.sound.add("skit" + this.levelNum, this.skitConfig);
        this.skit.play();

        this.caseFile = this.add.sprite(config.width / 2, config.height / 2, "suspect" + this.levelNum);
        this.caseFile.setScale(config.height / this.caseFile.height);

        //This button should return us to menu
        this.returnBtn = this.add.sprite(950, 735, "returnSprite").setFlip(true);
        this.returnBtn.setInteractive();
        this.returnBtn.on('pointerup', () => {
            if (this.levelNum == 5) {
                this.scene.launch("TransitionScene", { nextScene: "VideoScene", levelNum: this.levelNum });
            }
            else { this.scene.launch("TransitionScene", { nextScene: "MenuScene" }); }
            this.skit.stop();
        });
        this.returnBtn.on('pointerover', () => this.returnBtn.setTexture("returnSprite", 1));
        this.returnBtn.on('pointerout', () => this.returnBtn.setTexture("returnSprite", 0));

        this.recorder = this.add.sprite(0, 686, "recorder").setOrigin(0, 0);
        this.recorderAnims();

        this.playHighlight = this.add.sprite(this.recorder.x + 108, this.recorder.y - 3, "recorderHighlight").setOrigin(0, 0).setVisible(false);
        this.pauseHighlight = this.add.sprite(this.recorder.x + 20, this.recorder.y - 3, "recorderHighlight").setOrigin(0, 0).setVisible(false);

        this.playBtn = this.add.rectangle(this.playHighlight.x, this.playHighlight.y, 72, 56, 0x000000, 0).setOrigin(0, 0);
        this.playBtn.on('pointerover', () => { this.playHighlight.setVisible(true); });
        this.playBtn.on('pointerout', () => { this.playHighlight.setVisible(false); });
        this.playBtn.on('pointerup', () => { this.playRecorder(); this.sound.play("clickSFX"); });

        this.pauseBtn = this.add.rectangle(this.pauseHighlight.x, this.pauseHighlight.y, 72, 56, 0x000000, 0).setOrigin(0, 0);
        this.pauseBtn.setInteractive();
        this.pauseBtn.on('pointerover', () => { this.pauseHighlight.setVisible(true); });
        this.pauseBtn.on('pointerout', () => { this.pauseHighlight.setVisible(false); });
        this.pauseBtn.on('pointerup', () => { this.pauseRecorder(); this.sound.play("clickSFX"); });

        // Initialize keys
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        this.scaleWidth = this.caseFile.width * this.caseFile.scaleX;
        this.scaleHeight = this.caseFile.height * this.caseFile.scaleY;
        if (this.keyA.isDown && (this.caseFile.x + this.scaleWidth / 2 - 20 > 0)) {
            this.caseFile.x -= SPEED;
        }
        else if (this.keyD.isDown && (this.caseFile.x < config.width + this.scaleWidth / 2 - 20)) {
            this.caseFile.x += SPEED;
        }

        if (this.keyW.isDown && (this.caseFile.y + this.scaleHeight / 2 - 20 > 0)) {
            this.caseFile.y -= SPEED;
        }
        else if (this.keyS.isDown && (this.caseFile.y < config.height + this.scaleHeight / 2 - 20)) {
            this.caseFile.y += SPEED;
        }
    }
    pauseRecorder() {
        console.log("CaseScene: Pause button clicked");
        this.pauseBtn.disableInteractive();
        this.playHighlight.setVisible(false);
        this.pauseHighlight.setVisible(false);
        this.recorder.play("recorderPauseAnim");
        this.recorder.off('animationcomplete');
        this.recorder.on('animationcomplete', () => { this.playBtn.setInteractive(); this.skit.pause(); });
    }

    playRecorder() {
        console.log("CaseScene: Play button clicked");
        this.playBtn.disableInteractive();
        this.playHighlight.setVisible(false);
        this.pauseHighlight.setVisible(false);
        this.recorder.play("recorderPlayAnim");
        this.recorder.off('animationcomplete');
        this.recorder.on('animationcomplete', () => { this.pauseBtn.setInteractive(); this.skit.resume(); });
    }

    recorderAnims() {
        if (!this.anims.exists("recorderPauseAnim")) {
            this.anims.create({
                key: "recorderPauseAnim",
                frames: this.anims.generateFrameNumbers("recorder", { start: 0, end: 4 }),
                frameRate: 10,
                repeat: 0
            });
            this.anims.create({
                key: "recorderPlayAnim",
                frames: this.anims.generateFrameNumbers("recorder", { start: 5, end: 9 }),
                frameRate: 10,
                repeat: 0
            });
        }
    }
}