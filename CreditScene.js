class CreditScene extends Phaser.Scene {

    init(data) {
        this.levelNum = data.levelNum;
    }

    constructor() {
        super("CreditScene");
    }

    create() {
        this.creditBGM = this.sound.add("creditSong");
        this.creditBGM.play({ loop: true });
        //Creators
        this.creators = ["KarlestonChew", "Supersam111", "ConnorGrail", "MrSchmoods"];
        this.creatorRoles = ["Art", "Programming", "Music", "Story"];
        this.voices = ["ConnorGrail", "MrSchmoods", "VoicesByCorey", "ninjamuffin99", "Jumbs", "MrSchoods", "homunc"];
        this.characters = ["Branberry", "Goose", "Bob Velseb", "P-Bot", "Elon Nasa", "Hank J. Wimbleton", "Peter the Ant"];

        this.printNames(config.width / 2, config.height, ["Brought to you by"]);
        this.printNames(config.width / 4, config.height + 50, this.creators);
        this.printNames(3 * config.width / 4, config.height + 50, this.creatorRoles);

        this.printNames(config.width / 2, config.height + 200, ["Voice Actors"]);
        this.printNames(config.width / 4, config.height + 250, this.voices);
        this.printNames(3 * config.width / 4, config.height + 250, this.characters);

        this.printNames(config.width / 2, config.height + 500, ["Collaborators"]);
        this.printNames(config.width / 2, config.height + 550, collaborators);

        this.waiting = false;
    }

    update() {
        if (this.waiting) { this.cameras.main.scrollY += 1; }
        this.waiting = !this.waiting;
        if (this.cameras.main.scrollY > 3000) {
            NGIO.unlockMedal(73744); //Medal for completing the story
            this.scene.start("TransitionScene", { nextScene: "MenuScene" });
        }
    }

    /**Nifty function to convert letters to the spritesheet */
    numberConverter(charNum) {
        charNum = charNum.charCodeAt(0);
        if ((charNum > 96) && (charNum < 123)) { charNum -= 97; } // Lowercase letters
        else if ((charNum > 64) && (charNum < 91)) { charNum -= 65; } // Uppercase letters
        else if (charNum == 32) { charNum = 36 } // Space 
        else if ((charNum > 47) && (charNum < 58)) { charNum -= 22 } //Numbers
        else if ((charNum == 45)) { charNum = 37; } // Dash
        else if ((charNum == 95)) { charNum = 38; } // Underscore
        return charNum;
    }

    printNames(nameX, nameY, names) {
        for (var i = 0; i < names.length; i++) {
            if (i < 65) { // Collaborators has the bonus images
                var letters = names[i];
                for (var j = 0; j < letters.length; j++) {
                    var charNum = this.numberConverter(letters[j]);
                    this.add.sprite(nameX + 18 * (-letters.length / 2 + j), nameY + 20 * i, "letters", charNum);
                }
            }
        }
    }
}