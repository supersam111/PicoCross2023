class TransitionScene extends Phaser.Scene {

    init(data) {
        this.nextScene = data.nextScene;
        this.levelNum = data.levelNum;
    }

    constructor() {
        super("TransitionScene");
    }

    create() {
        this.scene.bringToTop();
        this.sound.play("inSFX");
        this.sceneList = ["MenuScene", "StartScene", "VideoScene", "CaseScene", "GameScene", "WinScene"]
        for (var i = 0; i < this.sceneList.length; i++) {
            this.scene.pause(this.sceneList[i]);
        }
        this.fadeOut = this.add.sprite(0, 0, "transitionOut").setOrigin(0, 0);
        this.fadeIn = this.add.sprite(0, 0, "transitionIn").setOrigin(0, 0);
        if (!this.anims.exists("fadeOutAnim")) {
            this.anims.create({
                key: "fadeOutAnim",
                frames: this.anims.generateFrameNumbers("transitionOut", { start: 0, end: 58 }),
                frameRate: 36,
                repeat: 0
            });
            this.anims.create({
                key: "fadeInAnim",
                frames: this.anims.generateFrameNumbers("transitionIn", { start: 0, end: 58 }),
                frameRate: 36,
                repeat: 0
            });
        }

        this.fadeIn.setVisible(false);
        this.fadeOut.play("fadeOutAnim");
        this.fadeOut.on('animationcomplete', this.fadeBack);
        console.log("TransitionScene: Fading out");
    }

    fadeBack() {
        this.scene.sound.play("outSFX");
        this.scene.game.sound.stopAll();
        for (var i = 0; i < this.scene.sceneList.length; i++) {
            if (this.scene.nextScene != this.scene.sceneList[i]) {
                this.scene.scene.stop(this.scene.sceneList[i]);
            }
        }
        this.setVisible(false);
        this.scene.fadeIn.setVisible(true);
        this.scene.fadeIn.play("fadeInAnim");
        console.log("TransitionScene: Fading in");
        this.scene.scene.launch(this.scene.nextScene, { levelNum: this.scene.levelNum });
        this.scene.scene.bringToTop();
        this.scene.scene.pause(this.scene.nextScene);
        this.scene.fadeIn.on('animationcomplete', this.scene.fadeDone);
        if (this.scene.nextScene == "EnvelopeScene") {
            this.scene.scene.resume(this.scene.nextScene);
            this.scene.scene.stop();
        }
    }

    fadeDone() {
        console.log("TransitionScene: going to " + this.scene.nextScene);
        this.scene.scene.resume(this.scene.nextScene);
        this.scene.scene.stop();
    }
}