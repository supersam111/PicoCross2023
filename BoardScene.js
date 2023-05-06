class GameScene extends Phaser.Scene {
    l
    constructor() {
        super("GameScene");
        key: "gameScene";

    }

    init(data) {
        this.levelNum = data.levelNum;
    }

    create() {

        this.tileFill = 3;
        this.tileX = 2;
        this.tileBlank = 0;

        // Figure out which level we need to load
        let levels = this.cache.json.get("levels");
        switch (this.levelNum) {
            case 1:
                this.level = levels.level1;
                break;
            case 2:
                this.level = levels.level2;
                break;
            case 3:
                this.level = levels.level3;
                break;
            case 4:
                this.level = levels.level4;
                break;
            case 5:
                this.level = levels.level5;
                break;
        }

        //Board variables used to shift the board around in space
        this.boardX = 780;
        this.boardY = 40;

        // How many tiles the current level uses
        this.pX = this.level.xSize;
        this.pY = this.level.ySize;

        this.input.mouse.disableContextMenu();

        this.tileSize = 40;


        this.wonGame = 0;

        this.mouseDown = false;
        this.clickX = 0;
        this.clickY = 0;

        this.fontStyle = {
            font: "16px bold",
            src: "assets/data/NG_Font.otf",
            fill: "black"
        };

        //The puzzle's solution
        this.solutionText = this.level.solution.split(",");
        this.gridSolution = [];
        this.gridSolution.length = this.pX * this.pY;
        for (var i = 0; i < this.gridSolution.length; i++) {
            this.gridSolution[i] = parseInt(this.solutionText[i]);
        }

        //Create gameboard
        this.bg = this.add.sprite(0, 0, "bg").setOrigin(0, 0).setDepth(-10);
        this.notepad = this.add.sprite(829, 18, "notepad").setOrigin(0, 0);

        //Things that move
        this.paper = this.add.sprite(23, 20, "paper").setOrigin(0, 0).setDepth(-10);
        this.polaroid = this.add.sprite(85, 2, "polaroid").setOrigin(0, 0);
        this.suspectNumber = this.add.sprite(84, 210, "sus_nums").setOrigin(0, 0);
        this.suspectNumber.setTexture("sus_nums", this.level.levelNum - 1);
        this.clueCorner = this.add.sprite(this.boardX, this.boardY, "clue_corner").setOrigin(0, 0);
        this.clueSideMiddle = this.add.group();
        for (var i = 0; i < this.pY - 1; i++) {
            this.clueSideMiddle[i] = this.add.sprite(this.boardX, this.boardY + this.tileSize * i + 200, "clue_side_middle").setOrigin(0, 0);
        }
        this.clueSideEnd = this.add.sprite(this.boardX, this.clueSideMiddle[this.pY - 2].y + this.tileSize, "clue_side_end").setOrigin(0, 0);
        this.clueTopMiddle = this.add.group();
        for (var i = 0; i < this.pX - 1; i++) {
            this.clueTopMiddle[i] = this.add.sprite(this.boardX + this.tileSize * i + 200, this.boardY, "clue_top_middle").setOrigin(0, 0);
        }
        this.clueTopEnd = this.add.sprite(this.clueTopMiddle[this.pX - 2].x + this.tileSize, this.boardY, "clue_top_end").setOrigin(0, 0);
        this.borderBottom = this.add.group();
        this.borderSide = this.add.group();
        for (var i = 0; i < this.pX - 1; i++) {
            this.borderBottom[i] = this.add.sprite(this.clueSideEnd.x + this.clueSideEnd.width + (this.tileSize * i), this.clueSideEnd.y + this.clueSideEnd.height - 2, "bottom_border").setOrigin(0, 0);
        }
        for (var i = 0; i < this.pY - 1; i++) {
            this.borderSide[i] = this.add.sprite(this.clueTopEnd.x + this.clueTopEnd.width - 2, this.clueTopEnd.y + this.clueTopEnd.height + (this.tileSize * i), "right_border").setOrigin(0, 0);
        }
        this.borderCorner = this.add.sprite(this.clueTopEnd.x, this.clueSideEnd.y, "corner_border").setOrigin(0, 0);

        //Create gameboard tiles
        this.tileAnimationCreate();
        this.tiles = this.add.group();
        for (var i = 0; i < this.pX; i++) {
            for (var j = 0; j < this.pY; j++) {
                var iter = i + (this.pX * j);
                this.tiles[iter] = this.add.sprite((i * this.tileSize) + 200 + this.boardX, (j * this.tileSize) + 200 + this.boardY, "tile").setOrigin(0, 0);
                this.tiles[iter].setData("state", this.gridState[iter]); // Used to track if tile has been selected or not
                this.tiles[iter].setData("index", iter); // Used to track tile position on board
                this.tiles[iter].setData("final", false); // Used to determine if the tile is finalized for image purposes
                //this.tiles[iter].setInteractive();
            }
        }

        //Top clue numbers, need to make matrix for more clues to be pulled
        this.clueArrayTop = this.level.topClues.split(",");

        //Left clue numbers, need to make matrix for more clues to be pulled
        this.clueArrayLeft = this.level.leftClues.split(",");

        // Make top clues
        var clueSize = this.level.topSize; // How many rows of clue
        this.topClueSprites = this.add.group();
        for (var i = 0; i < this.pX; i++) {
            for (var j = 0; j < clueSize; j++) {
                var iter = i + (this.pX * j);
                this.topClueSprites[iter] = this.add.sprite(0, 0, "clue_numbers", this.clueArrayTop[iter]).setOrigin(0, 0);
                var clueX = this.boardX + this.clueCorner.width + this.tileSize * i - (1.25 * this.topClueSprites[iter].width) - 1;
                var clueY = this.boardY + (this.clueTopEnd.height - 10) + ((this.topClueSprites[iter].height + 1) * j) - (clueSize * this.topClueSprites[iter].height);
                this.topClueSprites[iter].setPosition(clueX, clueY); //Need to do this to space clues 1px apart on the y and get the proper height from the bottom
            }
        }

        var clueSize = this.level.leftSize; // How many columns of clue
        this.leftClueSprites = this.add.group();
        for (var i = 0; i < clueSize; i++) {
            for (var j = 0; j < this.pY; j++) {
                var iter = i + (clueSize * j);
                this.leftClueSprites[iter] = this.add.sprite(0, 0, "clue_numbers", this.clueArrayLeft[iter]).setOrigin(0, 0);
                var clueX = this.boardX + (this.clueCorner.width - 50) + ((this.leftClueSprites[iter].width + 1) * i) - (clueSize * this.leftClueSprites[iter].width);
                var clueY = this.boardY + (this.clueCorner.height + 7) + (this.tileSize * j) - this.tileSize;
                this.leftClueSprites[iter].setPosition(clueX, clueY); //Need to do this to space clues 1px apart on the y and get the proper height from the bottom
            }
        }
    }

    update() {

    }
}