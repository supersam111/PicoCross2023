class LoadScene extends Phaser.Scene {
    constructor() {
        super("LoadScene");
    }

    preload() {
        //Load the loading screen
        this.loadBar = this.add.sprite(200, 740, "loading");
        this.anims.create({
            key: "loadAnim",
            frames: this.anims.generateFrameNumbers("loading"),
            frameRate: 15,
            repeat: -1
        });
        this.loadBar.play("loadAnim");

        //Loading screen code from gamedevacademy.org
        this.progressBar = this.add.graphics();
        this.progressBox = this.add.graphics();
        this.progressBox.fillStyle(0x222222, 0.8);
        this.progressBox.fillRect(500, 715, 320, 50);

        this.load.on('progress', function (value) {
            this.scene.progressBar.clear();
            this.scene.progressBar.fillStyle(0xffffff, 1);
            this.scene.progressBar.fillRect(510, 725, 300 * value, 30);
        });
        this.load.on('fileprogress', function (file) {
            console.log("LoadScene: Loading " + file.src);
        });
        this.load.on('complete', function () {
            console.log("LoadScene: Loading complete");
        });

        //MenuScene sprites
        this.load.spritesheet("envelope1", "assets/images/menu/envelope_1_uncheck.png", { frameWidth: 138, frameHeight: 232 });
        this.load.spritesheet("envelope2", "assets/images/menu/envelope_2_uncheck.png", { frameWidth: 138, frameHeight: 232 });
        this.load.spritesheet("envelope3", "assets/images/menu/envelope_3_uncheck.png", { frameWidth: 138, frameHeight: 232 });
        this.load.spritesheet("envelope4", "assets/images/menu/envelope_4_uncheck.png", { frameWidth: 138, frameHeight: 232 });
        this.load.spritesheet("envelope5", "assets/images/menu/envelope_5_uncheck.png", { frameWidth: 138, frameHeight: 232 });
        this.load.spritesheet("envelope1check", "assets/images/menu/envelope_1_check.png", { frameWidth: 138, frameHeight: 232 });
        this.load.spritesheet("envelope2check", "assets/images/menu/envelope_2_check.png", { frameWidth: 138, frameHeight: 232 });
        this.load.spritesheet("envelope3check", "assets/images/menu/envelope_3_check.png", { frameWidth: 138, frameHeight: 232 });
        this.load.spritesheet("envelope4check", "assets/images/menu/envelope_4_check.png", { frameWidth: 138, frameHeight: 232 });
        this.load.spritesheet("envelope5check", "assets/images/menu/envelope_5_check.png", { frameWidth: 138, frameHeight: 232 });
        this.load.image("menuBG", "assets/images/level_select_flat.png");
        this.load.spritesheet("videoButton", "assets/images/thumbnail.png", { frameWidth: 98, frameHeight: 78 });
        this.load.image("intro_thumb", "assets/images/intro_thumbnail.png");
        this.load.image("outro_thumb", "assets/images/outro_thumbnail.png");
        this.load.spritesheet("case1", "assets/images/menu/int_v2_1.png", { frameWidth: 118, frameHeight: 140 });
        this.load.spritesheet("case2", "assets/images/menu/int_v2_2.png", { frameWidth: 118, frameHeight: 140 });
        this.load.spritesheet("case3", "assets/images/menu/int_v2_3.png", { frameWidth: 118, frameHeight: 140 });
        this.load.spritesheet("case4", "assets/images/menu/int_v2_4.png", { frameWidth: 118, frameHeight: 140 });
        this.load.spritesheet("case5", "assets/images/menu/int_v2_5.png", { frameWidth: 118, frameHeight: 140 });


        //Envelope transition sprite
        this.load.spritesheet("envelope_anim", "assets/images/envelopeanim3.png", { frameWidth: 1040, frameHeight: 780 });

        //Letters
        this.load.spritesheet("letters", "assets/images/letters.png", { frameWidth: 15, frameHeight: 16 });

        //Transition sprites
        this.load.spritesheet("transitionIn", "assets/images/transition_in.png", { frameWidth: 1040, frameHeight: 780 });
        this.load.spritesheet("transitionOut", "assets/images/transition_out.png", { frameWidth: 1040, frameHeight: 780 });

        //Gameboard sprites
        this.load.image("bg", "assets/puzzle_bits/bg.png");
        this.load.image("paper", "assets/puzzle_bits/paper.png");
        this.load.image("notepad", "assets/puzzle_bits/notepad.png");
        this.load.spritesheet("polaroid", "assets/puzzle_bits/polaroid.png", { frameWidth: 173, frameHeight: 196 });
        this.load.image("bottom_border", "assets/puzzle_bits/bottom_border.png");
        this.load.image("corner_border", "assets/puzzle_bits/corner_border.png");
        this.load.image("right_border", "assets/puzzle_bits/right_border.png");
        this.load.image("clue_corner", "assets/puzzle_bits/clue_corner.png");
        this.load.image("clue_side_end", "assets/puzzle_bits/clue_side_end.png");
        this.load.image("clue_side_middle", "assets/puzzle_bits/clue_side_middle.png");
        this.load.image("clue_top_end", "assets/puzzle_bits/clue_top_end.png");
        this.load.image("clue_top_middle", "assets/puzzle_bits/clue_top_middle.png");
        this.load.spritesheet("tile", "assets/puzzle_bits/tile.png", { frameWidth: 40, frameHeight: 40 });
        this.load.spritesheet("sus_nums", "assets/puzzle_bits/sus_nums.png", { frameWidth: 153, frameHeight: 16 });

        //Clue numbers
        this.load.spritesheet("clue_numbers", "assets/puzzle_bits/numbers.png", { frameWidth: 26, frameHeight: 26 });

        //Button sprites
        this.load.spritesheet("backBtn", "assets/images/backBtn.png", { frameWidth: 30, frameHeight: 30 });
        this.load.spritesheet("rolodex", "assets/images/rolodex_main.png", { frameWidth: 200, frameHeight: 178 });
        this.load.image("settingsBtn", "assets/images/settingsButton.png");
        this.load.image("soundBtn", "assets/images/soundButton.png");
        this.load.spritesheet("checkbox", "assets/images/sound_checkbox.png", { frameWidth: 27, frameHeight: 27 });
        this.load.spritesheet("backArrow", "assets/images/backArrow.png", { frameWidth: 74, frameHeight: 36 });
        this.load.spritesheet("genBack", "/assets/images/generalBack.png", { frameWidth: 134, frameHeight: 66 });
        this.load.spritesheet("eraser", "assets/images/clear_puzzle.png", { frameWidth: 151, frameHeight: 75 });
        this.load.spritesheet("arrowSprite", "assets/images/arrow.png", { frameWidth: 134, frameHeight: 66 });
        this.load.spritesheet("returnSprite", "assets/images/return.png", { frameWidth: 134, frameHeight: 66 });

        //Stamp sprites
        this.load.spritesheet("xStamp", "assets/images/stamp_x.png", { frameWidth: 38, frameHeight: 70 });
        this.load.spritesheet("fillStamp", "assets/images/stamp_fill.png", { frameWidth: 38, frameHeight: 70 });
        this.load.image("stampSilo", "assets/images/stamp_silo.png");

        //Indicator sprites
        this.load.spritesheet("indicator_end", "assets/indicator/indicator_end.png", { frameWidth: 40, frameHeight: 40 });
        this.load.spritesheet("indicator_middle", "assets/indicator/indicator_middle.png", { frameWidth: 40, frameHeight: 40 });
        this.load.spritesheet("indicator_start", "assets/indicator/indicator_start.png", { frameWidth: 40, frameHeight: 40 });
        this.load.spritesheet("indicator_end2", "assets/indicator/indicator_v2_end.png", { frameWidth: 40, frameHeight: 40 });
        this.load.spritesheet("indicator_middle2", "assets/indicator/indicator_v2_middle.png", { frameWidth: 40, frameHeight: 40 });
        this.load.spritesheet("indicator_start2", "assets/indicator/indicator_v2_start.png", { frameWidth: 40, frameHeight: 40 });

        //Music
        this.load.audio("menuSong", "assets/music/menu.mp3");
        this.load.audio("song1", "assets/music/song1.mp3");
        this.load.audio("song2", "assets/music/song2.mp3");
        this.load.audio("creditSong", "assets/music/credits.mp3");

        //Video
        this.load.video('intro', 'assets/videos/intro.mp4');
        this.load.video('outro', 'assets/videos/outro.mp4');

        //sfx
        this.load.audio("stampSFX", "assets/sfx/stamp.wav", { instances: 13 });
        this.load.audio("rowSFX", "assets/sfx/rowComplete.wav");
        this.load.audio("colSFX", "assets/sfx/colComplete.wav");
        this.load.audio("rolodexSFX", "assets/sfx/rolodexSound.wav");
        this.load.audio("clickSFX", "assets/sfx/Click.wav");
        this.load.audio("winSFX", "assets/sfx/puzzleComplete.wav");
        this.load.audio("inSFX", "assets/sfx/whooshIn.wav");
        this.load.audio("outSFX", "assets/sfx/whooshOut.wav");
        this.load.audio("envelopeSFX", "assets/sfx/envelopeClick.wav");

        //Skits
        this.load.audio("skit1", "assets/skits/skit1.mp3");
        this.load.audio("skit2", "assets/skits/skit2.mp3");
        this.load.audio("skit3", "assets/skits/skit3.mp3");
        this.load.audio("skit4", "assets/skits/skit4.mp3");
        this.load.audio("skit5", "assets/skits/skit5.mp3");

        //Recorder
        this.load.spritesheet("recorder", "assets/images/recorder.png", { frameWidth: 213, frameHeight: 94 });
        this.load.image("recorderHighlight", "assets/images/recorder_highlight.png");

        //Winscene stuff
        this.load.spritesheet("interrogateBtn", "assets/images/Interrogate.png", { frameWidth: 440, frameHeight: 125 });
        this.load.spritesheet("winScreen", "assets/images/beeg_polaroid.png", { frameWidth: 537, frameHeight: 588 });
        this.load.spritesheet("winScreenColor", "assets/images/beeg_polaroid_color.png", { frameWidth: 537, frameHeight: 588 });

        this.load.spritesheet("evidence", "assets/images/evidence_found.png", { frameWidth: 497, frameHeight: 88 });

        //Start Screen stuff
        this.load.image("title", "assets/images/startScreen/title.png");
        this.load.spritesheet("clearDataBtn", "assets/images/startScreen/clear_save_data_button.png", { frameWidth: 295, frameHeight: 54 });
        this.load.spritesheet("startBtn", "assets/images/startScreen/start_button.png", { frameWidth: 119, frameHeight: 54 });
        this.load.spritesheet("startBG", "assets/images/startScreen/start_bg.png", { frameWidth: 1040, frameHeight: 780 });

        //JSON File loading
        this.load.json("artwork", "assets/data/artwork.json");
        this.load.json("levels", "assets/data/gameBoards.json");

        //Suspects
        this.load.image("suspect1", "assets/images/suspects/suspect1.png");
        this.load.image("suspect2", "assets/images/suspects/suspect2.png");
        this.load.image("suspect3", "assets/images/suspects/suspect3.png");
        this.load.image("suspect4", "assets/images/suspects/suspect4.png");
        this.load.image("suspect5", "assets/images/suspects/suspect5.png");



        //Submissions
        for (var i = 0; i < collaborators.length; i++) {
            this.load.image(collaborators[i], "assets/submissions/" + collaborators[i] + ".png");
        }
    }

    //Create happens after everything is loaded
    create() {


        if (localStorage.getItem("lastComplete") != null) {
            lastComplete = JSON.parse(localStorage.getItem("lastComplete"));
        }
        console.log("NGIO: Loaded medals: " + NGIO.medals);
        console.log("NGIO: initialization is " + NGIO.isInitialized);
        this.startTimer = new Date();
        this.flag = false;
        this.flag2 = true;
    }

    update() {
        var endTimer = new Date();
        if ((((endTimer - this.startTimer) / 1000 > 5) && !this.flag) && !NGIO.isReady) {
            this.flag = true;
            console.log("Timed out");
            this.flag2 = false;
        }
        if (!this.flag2) {
            this.flag2 = true;
            this.loadBar.destroy();
            this.progressBar.destroy();
            this.progressBox.destroy();
            this.startText = this.add.text(config.width / 2, config.height / 2, "Click to Start");
            this.startText.x = config.width / 2 - this.startText.width / 2;
            this.input.on('pointerup', () => this.goToMenu(this));
        }
        NGIO.getConnectionStatus(function (status) {

            // You could hide any login/preload UI elements here (we'll show what we need later).

            // This is a generic check to see if we're waiting for something...
            if (NGIO.isWaitingStatus) {
                // We're either waiting for the server to respond, or the user to sign in on Newgrounds.
                // Show a "please wait" message and/or a spinner so the player knows something is happening
                console.log("NGIO: waiting");

            }

            // check the actual connection status
            switch (status) {

                // we have version and license info
                case NGIO.STATUS_LOCAL_VERSION_CHECKED:

                    if (NGIO.isDeprecated) {
                        // this copy of the game is out of date
                        // (or you forgot to update the version number in your init() call)

                        // Show a 'new version available' button that calls
                        // NGIO.loadOfficialUrl();
                    }

                    if (!NGIO.legalHost) {
                        // the site hosting this copy has been blocked

                        // show the player a message ("This site is illegally hosting this game") , and add a button that calls
                        // NGIO.loadOfficialUrl();
                    }

                    break;

                // user needs to log in
                case NGIO.STATUS_LOGIN_REQUIRED:
                    console.log("NGIO: login required");
                    NGIO.openLoginPage();
                    // present the user with a message ("This game uses features that require a Newgrounds account")
                    // along with 2 buttons:

                    // A "Log In" button that calls NGIO.openLoginPage();
                    // A "No Thanks: button that calls NGIO.skipLogin();

                    break;

                // We are waiting for the user to log in (they should have a login page in a new browser tab)
                case NGIO.STATUS_WAITING_FOR_USER:
                    console.log("NGIO: waiting for user");
                    // It's possible the user may close the login page without signing in.
                    // Show a "Cancel Login" button that calls NGIO.cancelLogin();

                    break;

                // user needs to log in
                case NGIO.STATUS_READY:
                    console.log("NGIO: ready");

                    // Everything should be loaded.

                    // If NGIO.hasUser is false, the user opted not to sign in, so you may
                    // need to do some special handling in your game.

                    break;
            }

        });
        NGIO.keepSessionAlive();
    }

    goToMenu(that) {
        that.scene.launch("VideoScene", { levelNum: -1 }); //Goes to "StartScene"
        that.scene.setVisible(false);
        console.log("LoadScene: Going to VideoScene");
        that.input.off('pointerup'); //Need this because we keep loadscene open for ng loading and other purposes
    }
}

function makeStartText() {
    this.add.text(config.width / 2, config.height / 2, "Click to Start");
    this.input.on('pointerup', () => this.goToMenu(this));
}