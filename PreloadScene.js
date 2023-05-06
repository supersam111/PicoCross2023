class PreloadScene extends Phaser.Scene {
    constructor() {
        super("PreloadScene");
    }

    preload() {
        this.load.spritesheet("loading", "assets/images/loading.png", { frameWidth: 362, frameHeight: 56 });

    }
    create() {
        //Make newgrounds work, maybe
        var NGoptions = {
            version: "1.0.0",
            preloadMedals: true,
        };

        var appID = "56239:Ig786Yt0";
        var aesKey = "ie6zyFmVlkcDHIDQmLRcdA==";

        NGIO.init(appID, aesKey, NGoptions);
        console.log("NGIO Session: " + NGIO.hasSession);

        this.scene.launch("LoadScene");
    }
}