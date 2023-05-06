class StartScene extends Phaser.Scene {
    constructor() {
        super("StartScene");
    }

    create() {
        this.bg = this.add.sprite(0, 0, "startBG").setOrigin(0, 0);
        this.title = this.add.sprite(config.width / 2, 150, "title");
        this.startBtn = this.add.sprite(config.width / 2, 575, "startBtn");
        this.clearBtn = this.add.sprite(config.width / 2, 675, "clearDataBtn");
        if (!this.anims.exists("startBGAnim")) {
            this.anims.create({
                key: "startBGAnim",
                frames: this.anims.generateFrameNumbers("startBG"),
                frameRate: 10,
                repeat: -1
            })
        }
        this.bg.play("startBGAnim");

        this.startBtn.on('pointerover', () => this.startBtn.setTexture("startBtn", 1));
        this.startBtn.on('pointerout', () => this.startBtn.setTexture("startBtn", 0));
        this.startBtn.on('pointerup', () => {
            this.scene.launch("TransitionScene", { nextScene: "MenuScene" });
            this.sound.play("clickSFX");
        });
        this.startBtn.setInteractive();

        this.clearBtn.on('pointerover', () => this.clearBtn.setTexture("clearDataBtn", 1));
        this.clearBtn.on('pointerout', () => this.clearBtn.setTexture("clearDataBtn", 0));
        this.clearBtn.on('pointerup', () => { localStorage.clear(); this.sound.play("clickSFX") });
        this.clearBtn.setInteractive();
    }
    update() {
    }
}