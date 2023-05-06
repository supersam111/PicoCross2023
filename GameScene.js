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
        this.sfxConfig = { volume: sfxVolume };
        //Menu music
        if (this.levelNum / 2 != Math.floor(this.levelNum / 2)) { this.gameBGM = this.sound.add("song1"); }
        else { this.gameBGM = this.sound.add("song2"); }
        this.gameBGM.play({ loop: true });
        this.gameBGM.volume = musicVolume;
        //this.events.on('shutdown', () => this.gameBGM.pause());
        //this.events.on('resume', () => this.gameBGM.resume());

        /**Delay for tile animations in ms.*/
        this.animDelay = 50;
        this.tileAnimDelay = 200;

        this.tileFill = 3;
        this.tileX = 2;
        this.tileBlank = 0;

        this.firstFlag = false;
        this.downIter = 0; // Tracks the first tile clicked by the mouse
        this.hasWon = false;

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
        this.xMove = [40, 40, 0, 40, 20];
        this.yMove = [40, 20, 60, 0, 20];
        this.boardX = 70 + this.xMove[this.levelNum - 1];
        this.boardY = 40 + this.yMove[this.levelNum - 1];

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

        //Used to track the current puzzle state
        this.gridState = [];
        this.gridState.length = this.gridSolution.length;


        this.gridState.fill(0);
        var gridTitle = "gridState" + this.level.levelNum;
        if (localStorage.getItem(gridTitle) == null) {
            this.gridState.fill(0);
        }
        else {
            var storedGrid = JSON.parse(localStorage.getItem(gridTitle));
            this.gridState = storedGrid;
        }

        //Create gameboard
        this.bg = this.add.sprite(0, 0, "bg").setOrigin(0, 0).setDepth(-10);
        this.notepad = this.add.sprite(829, 18, "notepad").setOrigin(0, 0);
        this.paper = this.add.sprite(23, 20, "paper").setOrigin(0, 0).setDepth(-10);
        this.polaroid = this.add.sprite(85, 2, "polaroid", this.levelNum - 1).setOrigin(0, 0);
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

        //Create rolodex
        this.rolodex = this.add.sprite(840, 602, "rolodex").setOrigin(0, 0);
        this.createRolodexAnims();
        this.settingsBtn = this.add.sprite(866, 600, "settingsBtn").setOrigin(0, 0).setDepth(-20);
        this.settingsBtn.on('pointerover', () => this.settingsBtn.setDepth(20));
        this.settingsBtn.on('pointerout', () => this.settingsBtn.setDepth(-20));
        this.settingsBtn.on('pointerup', () => { this.rolodexMenu(); this.sound.play("rolodexSFX", this.sfxConfig); });
        this.soundBtn = this.add.sprite(939, 600, "soundBtn").setOrigin(0, 0).setDepth(-20);
        this.soundBtn.setInteractive();
        this.soundBtn.on('pointerover', () => this.soundBtn.setDepth(20));
        this.soundBtn.on('pointerout', () => this.soundBtn.setDepth(-20));
        this.soundBtn.on('pointerup', () => { this.rolodexSound(); this.sound.play("rolodexSFX", this.sfxConfig); });

        //Rolodex sound buttons
        this.musicCheckBox = this.add.sprite(this.rolodex.x + 122, this.rolodex.y + 94, "checkbox").setOrigin(0, 0).setDepth(-20).setInteractive();
        this.sfxCheckBox = this.add.sprite(this.rolodex.x + 122, this.rolodex.y + 65, "checkbox").setOrigin(0, 0).setDepth(-20).setInteractive();
        if (musicVolume == 0) { this.musicCheckBox.setTexture("checkbox", 1); };
        if (sfxVolume == 0) { this.sfxCheckBox.setTexture("checkbox", 1); };
        this.musicCheckBox.on('pointerup', () => { this.musicToggle(); this.sound.play("clickSFX", this.sfxConfig); });
        this.sfxCheckBox.on('pointerup', () => { this.sfxToggle(); this.sound.play("clickSFX", this.sfxConfig); });

        //Rolodex back arrow
        this.backArrow = this.add.sprite(this.rolodex.x + 62, this.rolodex.y + 90, "backArrow").setOrigin(0, 0).setDepth(20).setInteractive();
        this.backArrow.on('pointerup', () => { this.backToMenu(); this.sound.play("clickSFX", this.sfxConfig); });
        this.backArrow.on('pointerover', () => this.backArrow.setTexture("backArrow", 1));
        this.backArrow.on('pointerout', () => this.backArrow.setTexture("backArrow", 0));
        this.backArrow.setInteractive();

        //Eraser
        this.eraser = this.add.sprite(this.notepad.x + 20, 500, "eraser").setOrigin(0, 0);
        this.eraser.setInteractive();
        this.eraser.on('pointerover', () => this.eraser.setTexture("eraser", 1));
        this.eraser.on('pointerout', () => this.eraser.setTexture("eraser", 0));
        this.eraser.on('pointerup', () => { this.resetGame(); this.sound.play("clickSFX", this.sfxConfig); });

        //Create artwork that will appear upon row/column completion
        this.artwork = this.add.group();
        var artCount = 0;
        for (var i = 0; i < this.pX; i++) {
            for (var j = 0; j < this.pY; j++) {
                var iter = i + (this.pX * j);
                if (this.gridSolution[iter] == 1) {
                    this.artwork[iter] = this.add.sprite(20, 20, collaborators[artCount]).setOrigin(0, 0);
                    this.artwork[iter].setData("art", true);
                    this.artwork[iter].setData("artCount", artCount);
                    artCount += 1;
                }
                else {
                    this.artwork[iter] = this.add.sprite(0, 0, "").setOrigin(0, 0);
                    this.artwork[iter].setData("art", false);
                }
                this.artwork[iter].texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
                this.artwork[iter].setScale(this.tileSize / this.artwork[iter].width);
                this.artwork[iter].setData("showing", false);
                this.artwork[iter].setData("index", iter);
                //this.artwork[iter].setInteractive();
                //this.artwork[iter].on('pointerdown', this.artZoom);
                //this.artwork[iter].on('pointerover', this.artEnlarge);
                //this.artwork[iter].on('pointerout', this.artEnsmall);
            }
        }

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
                this.tileAnimationUpdate(this.tiles[iter], 0);
                this.tiles[iter].setInteractive();
                var tile = this.tiles[iter];
                this.tiles[iter].on('pointerdown', this.artZoom);
                this.tiles[iter].on('pointerover', this.artEnlarge);
                this.tiles[iter].on('pointerout', this.artEnsmall);
            }
        }
        this.firstTile = this.tiles[0];

        //Move art to be under tiles
        for (var i = 0; i < this.pX; i++) {
            for (var j = 0; j < this.pY; j++) {
                var iter = i + (this.pX * j);
                this.artwork[iter].setPosition(this.tiles[iter].x, this.tiles[iter].y);
            }
        }

        //Preview Grid
        this.previewSize = [10, 10, 9, 9, 10];
        this.previewX = [33, 33, 30, 39, 28];
        this.previewY = [32, 27, 40, 26, 26];
        this.previewGrid = this.add.group();
        for (var i = 0; i < this.pX; i++) {
            for (var j = 0; j < this.pY; j++) {
                var iter = i + (this.pX * j);
                var prevX = this.previewX[this.levelNum - 1];
                var prevY = this.previewY[this.levelNum - 1];
                var prevS = this.previewSize[this.levelNum - 1];
                this.previewGrid[iter] = this.add.rectangle(this.polaroid.x + prevX + (prevS * i), this.polaroid.y + prevY + (prevS * j), prevS, prevS, 0x181B2E).setOrigin(0, 0);
            }
        }

        //Indicator
        this.indicatorAnimationCreate();
        this.indicatorEnd = this.add.sprite(0, 0, "indicator_end");
        this.indicatorEnd.play("indicateEnd", true);
        this.indicatorEnd.setVisible(false);
        this.indicatorMiddle = this.add.group();
        for (var i = 0; i < 13; i++) {
            this.indicatorMiddle[i] = this.add.sprite(0, 0, "indicator_middle");
            this.indicatorMiddle[i].setVisible(false);
            this.indicatorMiddle[i].play("indicateMiddle", true);

        }
        this.indicatorStart = this.add.sprite(0, 0, "indicator_start");
        this.indicatorStart.play("indicateStart", true);
        this.indicatorStart.setVisible(false);

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

        //Create stamps
        this.stampAnimationCreate();
        this.stamps = this.add.group();
        for (var i = 0; i < this.pX; i++) {
            for (var j = 0; j < this.pY; j++) {
                var iter = i + (this.pX * j);
                this.stamps[iter] = this.add.sprite(this.tiles[iter].x + 1, this.tiles[iter].y - 30, "fillStamp").setOrigin(0, 0);
            }
        }
        this.stampSilo = this.add.sprite(0, 0, "stampSilo");
        this.stampSilo.setVisible(false);

    }

    update() {
        this.saveGame(this);

        this.clickDrag();
        //this.printGridReadable();
        this.previewUpdate();
        this.findMouse()
        this.middleIndicator();
        this.checkWin();
    }

    /**Swaps tile state when tile is left clicked. */
    leftFlip(tile, delay) {
        this.sound.play("stampSFX", { delay: delay / 1000, volume: sfxVolume });
        if (tile.getData("state") < 3) {
            if (tile.getData("state") == 2) {
                tile.setData("state", 0);
            }
            else {
                tile.setData("state", 2);
            }
            this.tileAnimationUpdate(tile, delay + this.tileAnimDelay);
            this.stampAnimationUpdate(this.stamps[tile.getData("index")], "fill", delay);
            this.gridState[tile.getData("index")] = tile.getData("state");
        }
    }

    /**Swaps tile state when tile is right clicked. */
    rightFlip(tile, delay) {
        this.sound.play("stampSFX", { delay: delay / 1000, volume: sfxVolume })
        if (tile.getData("state") < 3) {
            if (tile.getData("state") != 1) {
                tile.setData("state", 1);
            }
            else {
                tile.setData("state", 0);
            }
            this.tileAnimationUpdate(tile, delay + this.tileAnimDelay);
            this.stampAnimationUpdate(this.stamps[tile.getData("index")], "ex", delay);
            this.gridState[tile.getData("index")] = tile.getData("state");
        }
    }

    /**Allows mouse input to affect multiple tiles at once*/
    clickDrag() {
        var intersections = Phaser.Geom.Intersects;
        var pointer = this.input.activePointer;
        var tileRect = Phaser.Geom.Rectangle;
        var lineDirection;

        //Checks if mouse was just released (API says this should work without mouseDown but idk man)
        if (pointer.leftButtonReleased() && this.mouseDown) {
            this.firstFind(pointer.downX, pointer.downY, "left");
            var mouseLineX1 = this.tiles[this.downIter].x + 5;
            var mouseLineX2 = this.indicatorEnd.x + 5;
            var mouseLineY1 = this.tiles[this.downIter].y + 5;
            var mouseLineY2 = this.indicatorEnd.y + 5;
            var mouseLine = new Phaser.Geom.Line(mouseLineX1, mouseLineY1, mouseLineX2, mouseLineY2);
            if (Math.abs(mouseLineX1 - mouseLineX2) > Math.abs(mouseLineY1 - mouseLineY2)) {
                if (mouseLineX1 > mouseLineX2) {
                    lineDirection = "left";
                }
                else {
                    lineDirection = "right";
                }
            }
            else {
                if (mouseLineY1 > mouseLineY2) {
                    lineDirection = "up";
                }
                else {
                    lineDirection = "down";
                }
            }
            switch (lineDirection) {
                case "up":
                    {
                        var delay = this.animDelay;
                        for (var i = 0; i < this.pX; i++) {
                            for (var j = this.pY; j > 0; j--) {
                                var iter = i + (this.pX * (j - 1));
                                tileRect = this.tiles[iter].getBounds();
                                if (intersections.LineToRectangle(mouseLine, tileRect)) {
                                    if (this.firstTile.getData("state") != this.tiles[iter].getData("state")) {
                                        this.leftFlip(this.tiles[iter], delay);
                                        delay += this.animDelay;
                                    }
                                }
                            }
                        }
                        break;
                    }
                case "down":
                    {
                        var delay = this.animDelay;
                        for (var i = 0; i < this.pX; i++) {
                            for (var j = 0; j < this.pY; j++) {
                                var iter = i + (this.pX * j);
                                tileRect = this.tiles[iter].getBounds();
                                if (intersections.LineToRectangle(mouseLine, tileRect)) {
                                    if (this.firstTile.getData("state") != this.tiles[iter].getData("state")) {
                                        this.leftFlip(this.tiles[iter], delay);
                                        delay += this.animDelay;

                                    }
                                }
                            }
                        }
                        break;
                    }
                case "right":
                    {
                        var delay = this.animDelay;
                        for (var i = 0; i < this.pX; i++) {
                            for (var j = 0; j < this.pY; j++) {
                                var iter = i + (this.pX * j);
                                tileRect = this.tiles[iter].getBounds();
                                if (intersections.LineToRectangle(mouseLine, tileRect)) {
                                    if (this.firstTile.getData("state") != this.tiles[iter].getData("state")) {
                                        this.leftFlip(this.tiles[iter], delay);
                                        delay += this.animDelay;
                                    }
                                }
                            }
                        }
                        break;
                    }
                case "left":
                    {
                        var delay = this.animDelay;
                        for (var i = this.pX - 1; i > -1; i--) {
                            for (var j = 0; j < this.pY; j++) {
                                var iter = i + (this.pX * j);
                                tileRect = this.tiles[iter].getBounds();
                                if (intersections.LineToRectangle(mouseLine, tileRect)) {
                                    if (this.firstTile.getData("state") != this.tiles[iter].getData("state")) {
                                        this.leftFlip(this.tiles[iter], delay);
                                        delay += this.animDelay;
                                    }
                                }
                            }
                        }
                        break;
                    }
            }

            this.checkGrid();
        }

        //Check if right click and then mark clicked tiles "X"
        if (pointer.rightButtonReleased() && this.mouseDown) {
            this.firstFind(this.clickX, this.clickY, "right");
            var mouseLineX1 = this.tiles[this.downIter].x + 5;
            var mouseLineX2 = this.indicatorEnd.x + 5;
            var mouseLineY1 = this.tiles[this.downIter].y + 5;
            var mouseLineY2 = this.indicatorEnd.y + 5;
            var mouseLine = new Phaser.Geom.Line(mouseLineX1, mouseLineY1, mouseLineX2, mouseLineY2);
            if (Math.abs(mouseLineX1 - mouseLineX2) > Math.abs(mouseLineY1 - mouseLineY2)) {
                if (mouseLineX1 > mouseLineX2) {
                    lineDirection = "left"
                }
                else {
                    lineDirection = "right";
                }
            }
            else {
                if (mouseLineY2 > mouseLineY1) {
                    lineDirection = "down"
                }
                else {
                    lineDirection = "up";
                }
            }
            switch (lineDirection) {
                case "up":
                    {
                        var delay = this.animDelay;
                        for (var i = 0; i < this.pX; i++) {
                            for (var j = this.pY; j > 0; j--) {
                                var iter = i + (this.pX * (j - 1));
                                tileRect = this.tiles[iter].getBounds();
                                if (intersections.LineToRectangle(mouseLine, tileRect)) {
                                    if (this.firstTile.getData("state") != this.tiles[iter].getData("state")) {
                                        this.rightFlip(this.tiles[iter], delay);
                                        delay += this.animDelay;
                                    }
                                }
                            }
                        }
                        break;
                    }
                case "down":
                    {
                        var delay = this.animDelay;
                        for (var i = 0; i < this.pX; i++) {
                            for (var j = 0; j < this.pY; j++) {
                                var iter = i + (this.pX * j);
                                tileRect = this.tiles[iter].getBounds();
                                if (intersections.LineToRectangle(mouseLine, tileRect)) {
                                    if (this.firstTile.getData("state") != this.tiles[iter].getData("state")) {
                                        this.rightFlip(this.tiles[iter], delay);
                                        delay += this.animDelay;
                                    }
                                }
                            }
                        }
                        break;
                    }
                case "left":
                    {
                        var delay = this.animDelay;
                        for (var i = this.pX - 1; i > -1; i--) {
                            for (var j = 0; j < this.pY; j++) {
                                var iter = i + (this.pX * j);
                                tileRect = this.tiles[iter].getBounds();
                                if (intersections.LineToRectangle(mouseLine, tileRect)) {
                                    if (this.firstTile.getData("state") != this.tiles[iter].getData("state")) {
                                        this.rightFlip(this.tiles[iter], delay);
                                        delay += this.animDelay;
                                    }
                                }
                            }
                        }
                        break;
                    }
                case "right":
                    {
                        var delay = this.animDelay;
                        for (var i = 0; i < this.pX; i++) {
                            for (var j = 0; j < this.pY; j++) {
                                var iter = i + (this.pX * j);
                                tileRect = this.tiles[iter].getBounds();
                                if (intersections.LineToRectangle(mouseLine, tileRect)) {
                                    if (this.firstTile.getData("state") != this.tiles[iter].getData("state")) {
                                        this.rightFlip(this.tiles[iter], delay);
                                        delay += this.animDelay;
                                    }
                                }
                            }
                        }
                        break;
                    }
            }
            this.checkGrid();
        }

        this.checkMouse();
    }

    /**Used to track state of mouse button from last frame for clickDrag().*/
    checkMouse() {
        var pointer = this.input.activePointer;
        this.mouseDown = !pointer.noButtonDown();
        if (!this.mouseDown) {
            this.clickX = pointer.x;
            this.clickY = pointer.y;
        }
    }

    tileAnimationCreate() {
        if (!this.anims.exists("tileFrame")) {
            this.anims.create({
                key: "tileOff",
                frames: this.anims.generateFrameNumbers("tile", { start: 0, end: 0 }),
                repeat: 0
            });
            this.anims.create({
                key: "tileX",
                frames: this.anims.generateFrameNumbers("tile", { start: 1, end: 1 }),
                repeat: 0
            });
            this.anims.create({
                key: "tileOn",
                frames: this.anims.generateFrameNumbers("tile", { start: 2, end: 2 }),
                repeat: 0
            });
            this.anims.create({
                key: "tileFrame",
                frames: this.anims.generateFrameNumbers("tile", { start: 3, end: 3 }),
                repeat: 0
            });
            this.anims.create({
                key: "tileLightX",
                frames: this.anims.generateFrameNumbers("tile", { start: 4, end: 4 }),
                repeat: 0
            });
        }
    }

    /**Swaps tile animations based on tile "state" data. */
    tileAnimationUpdate(tile, delay) {
        switch (tile.getData("state")) {
            case 0:
                tile.playAfterDelay("tileOff", delay);
                break;
            case 1:
                tile.playAfterDelay("tileX", delay);
                break;
            case 2:
                tile.playAfterDelay("tileOn", delay);
                break;
            case 3:
                tile.playAfterDelay("tileFrame", delay);
                break;
            case 4:
                tile.playAfterDelay("tileLightX", delay);
                break;
            default:
                console.log("GameScene: No tile animation");
                break;
        }
    }

    backToMenu() {
        this.scene.launch("TransitionScene", { nextScene: "MenuScene" });
    }

    resetGame() {
        for (var i = 0; i < this.gridState.length; i++) {
            this.gridState[i] = 0;
            this.tiles[i].setData("state", 0);
            this.tileAnimationUpdate(this.tiles[i], 0);
            this.artwork[i].setData("showing", false);
        }
    }

    /**Makes buttons, thank you Snowbillr for your blogpost. */
    makeButton(x, y, sprite, buttonName, buttonFunction, functParam) {
        if (!this.anims.exists(sprite + "default")) {
            this.anims.create({
                key: sprite + "default",
                frames: this.anims.generateFrameNumbers(sprite, { start: 0, end: 0 })
            });
            this.anims.create({
                key: sprite + "hover",
                frames: this.anims.generateFrameNumbers(sprite, { start: 1, end: 1 })
            });
            this.anims.create({
                key: sprite + "click",
                frames: this.anims.generateFrameNumbers(sprite, { start: 2, end: 2 })
            });
        }
        var button = this.add.sprite(x, y, sprite).setOrigin(0, 0);
        this.add.text(x, y, buttonName, this.fontStyle).setOrigin(0, 0);
        button.setInteractive();
        button.on('pointerout', () => { button.play(sprite + "default"); });
        button.on('pointerover', () => { button.play(sprite + "hover"); });
        button.on('pointerdown', () => { button.play(sprite + "click"); });
        button.on('pointerup', () => { buttonFunction(functParam); button.scene.sound.play("clickSFX", this.sfxConfig); });
        return button;
    }

    /**Checks rows to see if they are complete. */
    checkColumn() {
        for (var i = 0; i < this.pX; i++) {
            var rowVar = 0;
            for (var j = 0; j < this.pY; j++) {
                var iter = i + (this.pX * j);
                if ((this.gridSolution[iter] == 1) && (this.gridState[iter] > 1)) {
                    rowVar += 1;
                }
                if ((this.gridSolution[iter] == 0) && (this.gridState[iter] != 2)) {
                    rowVar += 1;
                }
            }

            if (rowVar == this.pY) {
                var delay = this.animDelay;
                for (var j = 0; j < this.pY; j++) {
                    var iter = i + (this.pX * j);
                    this.setGold(this.tiles[iter], delay);
                    delay += this.animDelay;
                    this.gridState[iter] = this.tiles[iter].getData("state");
                    this.artwork[iter].setVisible(true);
                    this.artwork[iter].setData("showing", true);
                }
            }
        }
    }

    /**Checks columns to see if they are complete. */
    checkRow() {
        for (var j = 0; j < this.pY; j++) {
            var rowVar = 0;
            for (var i = 0; i < this.pX; i++) {
                var iter = i + (this.pX * j);
                if ((this.gridSolution[iter] == 1) && (this.gridState[iter] > 1)) {
                    rowVar += 1;
                }
                if ((this.gridSolution[iter] == 0) && (this.gridState[iter] != 2)) {
                    rowVar += 1;
                }
            }
            if (rowVar == this.pX) {
                var delay = this.animDelay;
                for (var i = 0; i < this.pX; i++) {
                    var iter = i + (this.pX * j);
                    this.setGold(this.tiles[iter], delay);
                    delay += this.animDelay;
                    this.gridState[iter] = this.tiles[iter].getData("state");
                    this.artwork[iter].setData("showing", true);

                }
            }
        }
    }

    /**Sets a tile to completed. */
    setGold(tile, delay) {
        if (tile.getData("state") == 2) {
            tile.setData("state", 4);
            this.gridState[tile.getData("index")] = tile.getData("state");
        }
        else if (tile.getData("state") < 3) {
            tile.setData("state", 3);
            this.gridState[tile.getData("index")] = tile.getData("state");
        }
        this.tileAnimationUpdate(tile, delay);
    }

    checkGrid() {
        this.checkRow();
        this.checkColumn();
    }

    /**Displays the number of each tile on the tile itself for debugging. */
    printGridReadable() {
        for (var i = 0; i < this.gridState.length; i++) {
            this.debugNumbers[i].text = this.gridState[i];
        }
    }

    /**Swaps scenes to zoom in on clicked art*/
    artZoom() {
        var ind = this.getData("index");
        if (this.scene.artwork[ind].getData("showing") && this.scene.artwork[ind].getData("art")) {
            this.scene.scene.pause();
            this.scene.scene.launch("ZoomScene", { image: this.scene.artwork[ind] });
            console.log("GameScene: Launching ZoomScene");
        }
    }

    /**Finds the first square clicked, so we can only set tiles to whatever the first tile is currently */
    firstFind(downX, downY, flip) {
        var tileRect = Phaser.Geom.Rectangle;
        var intersections = Phaser.Geom.Intersects;
        for (var i = 0; i < this.pX; i++) {
            for (var j = 0; j < this.pY; j++) {
                var iter = i + (this.pX * j);
                var collideCircle = new Phaser.Geom.Line(downX, downY, downX, downY);
                tileRect = this.tiles[iter].getBounds();
                if (intersections.LineToRectangle(collideCircle, tileRect)) {
                    this.firstTile = this.tiles[iter];
                    console.log("GameScene: Found first");
                    //Need to flip tile here for rest of logic to work
                    if (flip == "right") {
                        this.rightFlip(this.tiles[iter], 0);
                    }
                    else {
                        this.leftFlip(this.tiles[iter], 0);
                    }
                }
            }
        }
    }

    /**Creates stamp animations.*/
    stampAnimationCreate() {
        if (!this.anims.exists("xAnim")) {
            this.anims.create({
                key: "xAnim",
                frames: this.anims.generateFrameNumbers("xStamp"),
                repeat: 0,
                frameRate: 15
            });
            this.anims.create({
                key: "fillAnim",
                frames: this.anims.generateFrameNumbers("fillStamp"),
                repeat: 0,
                frameRate: 15
            });
        }
    }

    /**Makes the stamp animations play */
    stampAnimationUpdate(stamp, action, delay) {
        switch (action) {
            case "fill": {
                stamp.setTexture("fillStamp");
                stamp.playAfterDelay("fillAnim", delay);
                break;
            }
            case "ex": {
                stamp.setTexture("xStamp");
                stamp.playAfterDelay("xAnim", delay);
                break;
            }
            default: {
                console.log("GameScene: No stamp animation");
                break;
            }
        }
    }

    /**Updates the upper-left preview box to match the grid state. */
    previewUpdate() {
        for (var i = 0; i < this.pX; i++) {
            for (var j = 0; j < this.pY; j++) {
                var iter = i + (this.pX * j);
                if ((this.gridState[iter] > 1) && (this.gridState[iter] != 3)) {
                    this.previewGrid[iter].setFillStyle(0x181B2E);
                }
                else {
                    this.previewGrid[iter].setFillStyle(0xE0E6E6);
                }
            }
        }
    }

    /**Makes animations for the indicator (the arrow that shows what tiles are selected). */
    indicatorAnimationCreate() {
        if (!this.anims.exists("indicateEnd")) {
            var speed = 8;
            this.anims.create({
                key: "indicateEnd",
                frames: this.anims.generateFrameNumbers("indicator_end"),
                repeat: -1,
                frameRate: speed
            });
            this.anims.create({
                key: "indicateStart",
                frames: this.anims.generateFrameNumbers("indicator_start"),
                repeat: -1,
                frameRate: speed
            });
            this.anims.create({
                key: "indicateMiddle",
                frames: this.anims.generateFrameNumbers("indicator_middle"),
                repeat: -1,
                frameRate: speed
            });
        }
    }

    /**Finds the mouse relative to the tile it is on, if it is on a tile. Also used for indicator line*/
    findMouse() {
        var onBoard = false;
        var pointer = this.input.activePointer;
        for (var i = 0; i < this.pX; i++) {
            for (var j = 0; j < this.pY; j++) {
                var iter = i + (this.pX * j);
                var xDist = pointer.x - this.tiles[iter].x;
                var yDist = pointer.y - this.tiles[iter].y;
                if ((xDist > 0) && (xDist < this.tileSize)) {
                    if ((yDist > 0) && (yDist < this.tileSize)) {
                        this.indicatorMove(pointer, iter);
                        onBoard = true;
                    }
                }
            }
        }
        if (!onBoard) {
            this.hideStuff();
        }
    }

    /**Controls indicator logic. */
    indicatorMove(pointer, iter) {
        var onSquare = false;

        //Move stamp silhouette
        this.stampSilo.setVisible(true);
        this.stampSilo.setPosition(this.tiles[iter].x, this.tiles[iter].y - 25).setOrigin(0, 0);

        if (this.mouseDown) {
            if (!this.firstFlag) {
                this.firstFlag = true;
                this.downIter = iter;
                this.indicatorStart.setPosition(this.tiles[iter].x + (this.tileSize / 2), this.tiles[iter].y + (this.tileSize / 2));
                this.indicatorEnd.setPosition(this.tiles[iter].x + (this.tileSize / 2), this.tiles[iter].y + (this.tileSize / 2));
            }
        }
        else {
            this.firstFlag = false;
        }
        if (iter == this.downIter) {
            onSquare = true;
        }
        if (this.mouseDown && !onSquare) {
            this.indicatorStart.setVisible(true);
            this.indicatorEnd.setVisible(true);
            this.indicatorMiddle.setVisible(true);
            if (Math.abs(pointer.x - this.clickX) > Math.abs(pointer.y - this.clickY)) {
                if (pointer.x > this.clickX) {
                    this.indicatorEnd.setAngle(0);
                    this.indicatorStart.setAngle(0);
                    this.indicatorEnd.setPosition(this.tiles[iter].x + (this.tileSize / 2), this.tiles[this.downIter].y + (this.tileSize / 2));
                }
                else {
                    this.indicatorEnd.setAngle(180);
                    this.indicatorStart.setAngle(180);
                    this.indicatorEnd.setPosition(this.tiles[iter].x + (this.tileSize / 2), this.tiles[this.downIter].y + (this.tileSize / 2));
                }
            }
            else {
                if (pointer.y > this.clickY) {
                    this.indicatorEnd.setAngle(90);
                    this.indicatorStart.setAngle(90);
                    this.indicatorEnd.setPosition(this.tiles[this.downIter].x + (this.tileSize / 2), this.tiles[iter].y + (this.tileSize / 2));
                }
                else {
                    this.indicatorEnd.setAngle(270);
                    this.indicatorStart.setAngle(270);
                    this.indicatorEnd.setPosition(this.tiles[this.downIter].x + (this.tileSize / 2), this.tiles[iter].y + (this.tileSize / 2));
                }
            }
        }
        else {
            this.indicatorEnd.setVisible(false);
            this.indicatorStart.setVisible(false);
        }
    }

    saveGame(that) {
        var gridTitle = "gridState" + that.level.levelNum;
        localStorage.setItem(gridTitle, JSON.stringify(that.gridState));
    }

    checkWin() {
        var winning = true;
        for (var i = 0; i < this.gridState.length; i++) {
            if (this.gridState[i] < 3) {
                winning = false;
            }
        }
        if (winning && !this.hasWon) {
            this.hasWon = true;
            if (JSON.parse(localStorage.getItem("lastComplete")) < this.level.levelNum) {
                lastComplete = this.level.levelNum;
                lastVideo = this.level.levelNum;
                localStorage.setItem("lastComplete", JSON.stringify(lastComplete));
                localStorage.setItem("lastVideo", JSON.stringify(lastVideo));
                console.log("GameScene: lastComplete is " + lastComplete);
                console.log("GameScene: latVideo is " + lastVideo);
            }
            console.log("GameScene: You win!");
            this.sound.play("winSFX", this.sfxConfig);
            NGIO.unlockMedal(73671); //Medal for beating a level
            if (this.levelNum == 5) {
                NGIO.unlockMedal(73742); //Medal for beating all the levels
            }
            this.scene.pause();
            this.scene.launch("WinScene", { levelNum: this.level.levelNum });
            console.log("GameScene: Launching WinScene");
        }
    }

    /**Make art larger when moused over. */
    artEnlarge() {
        var ind = this.getData("index");
        var art = this.scene.artwork[ind];
        if (art.getData("showing") && art.getData("art")) {
            art.scene.artwork[ind].setScale(art.scale * 2.2);
            art.setDepth(1);
            console.log("GameScene: Image was at " + art.x + " " + art.y);
            art.setPosition(art.x - (art.scale * art.width / 4), art.y - (art.scale * art.height / 4));
            console.log("GameScene: Image is at " + art.x + " " + art.y);
        }
    }

    /**Make art smaller when not moused over. */
    artEnsmall() {
        var ind = this.getData("index");
        var art = this.scene.artwork[ind];
        if (art.getData("showing") && art.getData("art")) {
            art.setPosition(art.scene.tiles[art.getData("index")].x, art.scene.tiles[art.getData("index")].y);
            art.setScale(art.scene.tileSize / art.width);
            art.setDepth(-1);
        }
    }

    /**Places middle indicator position. */
    middleIndicator() {
        var indNum = 0;
        for (var j = 0; j < 13; j++) {
            this.indicatorMiddle[j].setVisible(false);
        }
        if (this.indicatorEnd.visible) {
            for (var i = 0; i < this.gridState.length; i++) {
                var xPos = this.tiles[i].x + this.tileSize / 2;
                var yPos = this.tiles[i].y + this.tileSize / 2;
                if (this.indicatorEnd.y == this.indicatorStart.y) {
                    this.indicatorMiddle[indNum].setAngle(0);
                    if (this.indicatorEnd.y == yPos) { //See if we're in the same row
                        if (this.indicatorEnd.x > this.indicatorStart.x) { //Right
                            if (xPos < this.indicatorEnd.x) { // See if we're to the left of the end
                                if (xPos > this.indicatorStart.x) { // See if we're to the right of the start
                                    console.log("GameScene: indicatorMiddle 'right' " + indNum);
                                    this.indicatorMiddle[indNum].setPosition(xPos, this.indicatorEnd.y);
                                    this.indicatorMiddle[indNum].setVisible(true);
                                    indNum += 1;
                                }
                            }
                        }
                        else { //Left
                            if (xPos > this.indicatorEnd.x) { //See if we're to the right of the end
                                if (xPos < this.indicatorStart.x) { //See if we're to the left of the start
                                    this.indicatorMiddle[indNum].setPosition(xPos, this.indicatorEnd.y);
                                    this.indicatorMiddle[indNum].setVisible(true);
                                    indNum += 1;
                                }
                            }
                        }
                    }
                }
                else {
                    this.indicatorMiddle[indNum].setAngle(90);
                    if (this.indicatorEnd.x == xPos) { //See if we're in the same column
                        if (this.indicatorEnd.y > this.indicatorStart.y) { //Down
                            if (yPos < this.indicatorEnd.y) {
                                if (yPos > this.indicatorStart.y) {
                                    this.indicatorMiddle[indNum].setPosition(this.indicatorEnd.x, yPos);
                                    this.indicatorMiddle[indNum].setVisible(true);
                                    indNum += 1;
                                }
                            }
                        }
                        else { //Up
                            if (yPos > this.indicatorEnd.y) {
                                if (yPos < this.indicatorStart.y) {
                                    this.indicatorMiddle[indNum].setPosition(this.indicatorEnd.x, yPos);
                                    this.indicatorMiddle[indNum].setVisible(true);
                                    indNum += 1;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    hideStuff() {
        if (!this.mouseDown) {
            this.indicatorEnd.setVisible(false);
            this.indicatorStart.setVisible(false);
            for (var j = 0; j < 13; j++) {
                this.indicatorMiddle.setVisible(false);
            }
        }
        this.stampSilo.setVisible(false);
    }

    createRolodexAnims() {
        var speed = 10;
        if (!this.anims.exists("roloToMenu")) {
            this.anims.create({
                key: "roloToMenu",
                frames: this.anims.generateFrameNumbers("rolodex", { start: 1, end: 6 }),
                repeat: 0,
                frameRate: speed
            });
            this.anims.create({
                key: "roloToSound",
                frames: this.anims.generateFrameNumbers("rolodex", { start: 8, end: 14 }),
                repeat: 0,
                frameRate: speed
            });
        }
    }

    rolodexMenu() {
        console.log("GameScene: In rolodexMenu");
        this.rolodex.play("roloToSound");
        this.rolodex.off('animationcomplete');
        this.settingsBtn.disableInteractive();
        this.soundBtn.disableInteractive();
        this.sfxCheckBox.disableInteractive();
        this.musicCheckBox.disableInteractive();
        this.settingsBtn.setDepth(-20);
        this.soundBtn.setDepth(-20);
        this.sfxCheckBox.setDepth(-20);
        this.musicCheckBox.setDepth(-20);
        this.rolodex.on('animationcomplete', () => {
            this.soundBtn.setInteractive();
            this.backArrow.setInteractive();
            this.backArrow.setDepth(20);
            console.log("GameScene: Arrow Initiated");
        });
    }
    rolodexSound() {
        console.log("GameScene: In rolodexSound");
        this.rolodex.play("roloToMenu");
        this.rolodex.off('animationcomplete');
        this.settingsBtn.disableInteractive();
        this.soundBtn.disableInteractive();
        this.backArrow.disableInteractive();
        this.soundBtn.setDepth(-20);
        this.settingsBtn.setDepth(-20);
        this.backArrow.setDepth(-20);
        this.rolodex.on('animationcomplete', () => {
            this.settingsBtn.setInteractive();
            this.sfxCheckBox.setDepth(20);
            this.musicCheckBox.setDepth(20);
            this.sfxCheckBox.setInteractive();
            this.musicCheckBox.setInteractive();
        });
    }
    sfxToggle() {
        if (sfxVolume == 1) {
            sfxVolume = 0;
            this.sfxCheckBox.setTexture("checkbox", 1);
        }
        else {
            sfxVolume = 1;
            this.sfxCheckBox.setTexture("checkbox", 0);
        }
        this.sfxConfig = { volume: sfxVolume };
    }
    musicToggle() {
        if (musicVolume == 1) {
            musicVolume = 0;
            this.musicCheckBox.setTexture("checkbox", 1);

        }
        else {
            musicVolume = 1;
            this.musicCheckBox.setTexture("checkbox", 0);
        }
        this.gameBGM.volume = musicVolume;
    }
}