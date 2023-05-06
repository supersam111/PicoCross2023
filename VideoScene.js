class VideoScene extends Phaser.Scene {

    init(data) {
        this.videoNum = data.levelNum;
    }

    constructor() {
        super("VideoScene");
    }
    create() {
        if (this.videoNum == 5) {
            this.video = this.add.video(0, 0, 'outro').setOrigin(0, 0);
        }
        else {
            this.video = this.add.video(0, 0, 'intro').setOrigin(0, 0);

            //This button should return us to menu (or not lol)
            this.returnBtn = this.add.sprite(950, 735, "arrowSprite").setFlip(true);
            this.returnBtn.setInteractive();
            this.returnBtn.on('pointerup', () => {
                this.video.stop();
                if (this.videoNum == -1) { this.scene.launch("StartScene"); }
                else { this.scene.launch("TransitionScene", { nextScene: "MenuScene" }); }
            });
            this.returnBtn.on('pointerover', () => this.returnBtn.setTexture("arrowSprite", 1));
            this.returnBtn.on('pointerout', () => this.returnBtn.setTexture("arrowSprite", 0));
        }

        this.video.play(false);

    }

    update() {
        NGIO.keepSessionAlive();

        if (this.video.getDuration() <= this.video.getCurrentTime()) {
            if (this.videoNum == 5) { this.scene.launch("TransitionScene", { nextScene: "CreditScene" }) }
            else if (this.videoNum == -1) { this.scene.launch("TransitionScene", { nextScene: "StartScene" }) }
            else { this.scene.launch("TransitionScene", { nextScene: "MenuScene" }); }
        }
    }
}