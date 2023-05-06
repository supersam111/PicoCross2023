class EnvelopeScene extends Phaser.Scene {

    init(data) {
        this.levelNum = data.levelNum;
    }

    constructor() {
        super("EnvelopeScene");
    }

    create() {
        this.envelope = this.add.sprite(0, 0, "envelope_anim").setOrigin(0, 0);
        if (!this.anims.exists("envelopeAnim")) {
            this.anims.create({
                key: "envelopeAnim",
                frames: this.anims.generateFrameNumbers("envelope_anim"),
                frameRate: 16
            });
        }
        this.envelope.play("envelopeAnim");
        console.log("EnvelopeScene: Playing envelope animation");
        this.envelope.on('animationcomplete', this.startGame);
    }

    update() {
    }

    startGame() {
        console.log("EnvelopeScene: Going to GameScene");
        this.scene.scene.start("GameScene", { levelNum: this.scene.levelNum });
    }
}