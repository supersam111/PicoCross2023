class WinScene extends Phaser.Scene {

    init(data) {
        this.levelNum = data.levelNum;
    }

    constructor() {
        super("WinScene");
    }

    create() {
        this.add.rectangle(config.width / 2, config.height / 2, config.width, config.height, 0x000000, 0.5);

        this.polaroid = this.add.image(config.width + 100, config.height / 2, "winScreen", this.levelNum - 1);
        this.coloroid = this.add.image(config.width + 100, config.height / 2, "winScreenColor", this.levelNum - 1);
        this.coloroid.setAlpha(0);

        //Interrogate button, should go to interrogation
        this.interrogateBtn = this.add.sprite(config.width / 2 - 5, 740, "interrogateBtn");
        this.interrogateBtn.setInteractive();
        this.interrogateBtn.on('pointerup', () => { this.interrogate(); this.sound.play("clickSFX"); });
        this.interrogateBtn.on('pointerover', () => { this.interrogateBtn.setTexture("interrogateBtn", 7) });
        this.interrogateBtn.on('pointerout', () => { this.interrogateBtn.setTexture("interrogateBtn", 6) });

        this.evidence = this.add.sprite(config.width / 2, 40, "evidence");

        //This button should return us to game
        this.returnBtn = this.add.sprite(150, 735, "returnSprite");
        this.returnBtn.setInteractive();
        this.returnBtn.on('pointerup', () => { this.toGame(); this.sound.play("clickSFX"); });
        this.returnBtn.on('pointerover', () => this.returnBtn.setTexture("returnSprite", 1));
        this.returnBtn.on('pointerout', () => this.returnBtn.setTexture("returnSprite", 0));

        this.createAnims();
        this.interrogateBtn.play("interrogateAnim");
        this.evidence.play("evidenceAnim");
    }

    update() {

        if (Math.abs(this.polaroid.x - (config.width / 2)) > 30) {
            this.polaroid.x -= 20;
        }
        else {
            this.coloroid.x = this.polaroid.x;
            this.coloroid.setAlpha(this.coloroid.alpha + 0.01);
        }
    }

    interrogate() {
        this.scene.launch("TransitionScene", { nextScene: "CaseScene", levelNum: this.levelNum });
    }

    toGame() {
        this.scene.resume("GameScene");
        this.scene.stop();
    }
    createAnims() {
        if (!this.anims.exists("interrogateAnim")) {
            this.anims.create({
                key: "interrogateAnim",
                frames: this.anims.generateFrameNumbers("interrogateBtn", { start: 0, end: 6 }),
                repeat: 0,
                frameRate: 10
            });
            this.anims.create({
                key: "evidenceAnim",
                frames: this.anims.generateFrameNumbers("evidence"),
                repeat: 0,
                frameRate: 10
            });
        }
    }

}