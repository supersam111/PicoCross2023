class MenuScene extends Phaser.Scene {

    constructor() {
        super("MenuScene");
    }

    create() {
        //Menu music
        this.menuBGM = this.sound.add("menuSong");
        this.menuBGM.play({ loop: true });
        //this.events.on('pause', () => this.menuBGM.pause());
        //this.events.on('resume', () => this.menuBGM.resume());

        //Load level data
        console.log("MenuScene: lastComplete is " + lastComplete);
        console.log("MenuScene: lastVideo is " + lastVideo);
        if (localStorage.getItem("lastComplete") != null) {
            lastComplete = JSON.parse(localStorage.getItem("lastComplete"));
        }
        else {
            console.log("MenuScene: lastComplete not loaded, setting to 0");
            lastComplete = 0;
        }
        if (localStorage.getItem("lastVideo") != null) {
            lastComplete = JSON.parse(localStorage.getItem("lastVideo"));
        }
        else {
            console.log("MenuScene: lastVideo not loaded, setting to 0");
            lastVideo = 0;
        }

        //Make level
        this.bg = this.add.sprite(0, 0, "menuBG").setOrigin(0, 0);

        //Make level buttons
        if (lastComplete >= 0) {
            this.lvl1Button = this.makeButton(200, 200, "envelope1", "", this.lvl1, this, true);
            this.lvl1Button.setData("shake", false);
        }
        if (lastComplete >= 1) {
            this.lvl2Button = this.makeButton(300, 500, "envelope2", "", this.lvl2, this, true);
            this.lvl2Button.setData("shake", false);
            this.lvl1Button.setTexture("envelope1check");
        }
        if (lastComplete >= 2) {
            this.lvl3Button = this.makeButton(450, 300, "envelope3", "", this.lvl3, this, true);
            this.lvl3Button.setData("shake", false);
            this.lvl2Button.setTexture("envelope2check");
        }
        if (lastComplete >= 3) {
            this.lvl4Button = this.makeButton(650, 525, "envelope4", "", this.lvl4, this, true);
            this.lvl4Button.setData("shake", false);
            this.lvl3Button.setTexture("envelope3check");
        }
        if (lastComplete >= 4) {
            this.lvl5Button = this.makeButton(750, 250, "envelope5", "", this.lvl5, this, true);
            this.lvl5Button.setData("shake", false);
            this.lvl4Button.setTexture("envelope4check");
        }
        if (lastComplete >= 5) {
            this.lvl5Button.setTexture("envelope5check");
        }

        //Make video buttons
        if (lastComplete >= 0) {
            this.introthumb = this.add.sprite(200, 350, "intro_thumb");
            this.vid0Button = this.makeButton(this.introthumb.x, this.introthumb.y, "videoButton", "", this.video0, this);
        }
        if (lastComplete >= 1) { this.vid1Button = this.makeButton(315, 325, "case1", "", this.video1, this); }
        if (lastComplete >= 2) { this.vid2Button = this.makeButton(420, 550, "case2", "", this.video2, this); }
        if (lastComplete >= 3) { this.vid3Button = this.makeButton(575, 350, "case3", "", this.video3, this); }
        if (lastComplete >= 4) { this.vid4Button = this.makeButton(775, 550, "case4", "", this.video4, this); }
        if (lastComplete >= 5) {
            this.vid5Button = this.makeButton(630, 175, "case5", "", this.video5, this);
            this.outrothumb = this.add.sprite(850, 400, "outro_thumb");
            this.vid6Button = this.makeButton(this.outrothumb.x, this.outrothumb.y, "videoButton", "", this.video6, this);
        }
    }

    update() {
        if (lastComplete >= 0) { this.envelopeShake(this.lvl1Button, 1); }
        if (lastComplete >= 1) { this.envelopeShake(this.lvl2Button, 2); }
        if (lastComplete >= 2) { this.envelopeShake(this.lvl3Button, 3); }
        if (lastComplete >= 3) { this.envelopeShake(this.lvl4Button, 4); }
        if (lastComplete >= 4) { this.envelopeShake(this.lvl5Button, 5); }
    }

    //All the button functions
    lvl1(that) { that.scene.launch("TransitionScene", { nextScene: "EnvelopeScene", levelNum: 1 }) }
    lvl2(that) { that.scene.launch("TransitionScene", { nextScene: "EnvelopeScene", levelNum: 2 }) }
    lvl3(that) { that.scene.launch("TransitionScene", { nextScene: "EnvelopeScene", levelNum: 3 }) }
    lvl4(that) { that.scene.launch("TransitionScene", { nextScene: "EnvelopeScene", levelNum: 4 }) }
    lvl5(that) { that.scene.launch("TransitionScene", { nextScene: "EnvelopeScene", levelNum: 5 }) }
    video0(that) { that.scene.launch("TransitionScene", { nextScene: "VideoScene", levelNum: 0 }) }
    video1(that) { that.scene.launch("TransitionScene", { nextScene: "CaseScene", levelNum: 1 }) }
    video2(that) { that.scene.launch("TransitionScene", { nextScene: "CaseScene", levelNum: 2 }) }
    video3(that) { that.scene.launch("TransitionScene", { nextScene: "CaseScene", levelNum: 3 }) }
    video4(that) { that.scene.launch("TransitionScene", { nextScene: "CaseScene", levelNum: 4 }) }
    video5(that) { that.scene.launch("TransitionScene", { nextScene: "CaseScene", levelNum: 5 }) }
    video6(that) { that.scene.launch("TransitionScene", { nextScene: "VideoScene", levelNum: 5 }) }

    /**Makes buttons, thank you Snowbillr for your blogpost. */
    makeButton(x, y, sprite, buttonName, buttonFunction, functParam, shakable) {
        var button = this.add.sprite(x, y, sprite);
        this.add.text(button.x + button.width / 2, button.y + button.height / 2, buttonName, this.fontStyle).setOrigin(1, 1);
        button.setInteractive();
        button.on('pointerout', () => {
            button.setTexture(button.texture, 0).setDepth(0);
            if (shakable) {
                this.stopShake(button);
            }
        });
        button.on('pointerover', () => {
            button.setTexture(button.texture, 1).setDepth(1);
            if (shakable) { this.startShake(button); }
        });
        button.on('pointerdown', () => { button.setTexture(button.texture, 1).setDepth(1); });
        button.on('pointerup', () => { buttonFunction(functParam); button.scene.sound.play("envelopeSFX"); });
        return button;
    }

    /**Starts shaking envelopes */
    startShake(btn) {
        btn.setScale(1.1);
        btn.setData("shake", true);
        btn.setData("rotation", 0);
    }

    /**Stops envelope shake */
    stopShake(btn) {
        btn.setAngle(0);
        btn.setScale(1);
        btn.setData("shake", false);
    }

    /**Shakes envelopes */
    envelopeShake(btn, btnNum) {
        if (btn.getData("shake")) {
            var xRot = btn.getData("rotation");
            if (xRot >= 2 * Math.PI) { xRot = 0; }
            else { xRot += 0.06; }
            btn.setRotation(Math.sin(xRot) / 6);
            btn.setData("rotation", xRot);
        }
    }
}