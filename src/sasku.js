var game = new Phaser.Game(1440, 900, Phaser.AUTO, '', { preload: preload, create: create, update: update });


function preload() {
    game.load.image('background', 'bin/space_background2.jpg');
    game.load.image('cardback', 'bin/Blue_Back.png');
    game.load.image('pixel', 'bin/px.png');
    game.load.image('gamesbox', 'bin/gamesbox.png');
    game.load.image('room', 'bin/room.png');
    game.load.image('lock', 'bin/lock.png');
    game.load.image('room1', 'bin/room1.png');
    game.load.image('room2', 'bin/room2.png');
    game.load.image('room3', 'bin/room3.png');
    game.load.image('room4', 'bin/room4.png');
}
 
var cardback;
var otherCards;
var cards;
var emitter;
var star;
var background;
var gamesbox;
var gamesList1;
var games;
var gamesText;
var locks;
var lock;
var aroom;
var room;
var rooms;

// kings, queens, jacks, aces, 10s, 9s, 8s, 7s
var ck, cq, cj, ca, c0, c9, c8, c7; // clubs
var sk, sq, sj, sa, s0, s9, s8, s7; // spades
var hk, hq, hj, ha, h0, h9, h8, h7; // hearts
var dk, dq, dj, da, d0, d9, d8, d7; // diamonds



function create() {
    // aligning canvas to the centre
    this.game.stage.scale.pageAlignHorizontally = true;
    this.game.stage.scale.pageAlignVeritcally = true;
    this.game.stage.scale.refresh();

    background = game.add.tileSprite(0, 0, 1440, 900, 'background');

    // games selection screen
    gamesbox = game.add.sprite(400, 90, 'gamesbox');
    var text = "Available games";
    var style = { font: "48px Helvetica", fill: '#E0E0E0', stroke: 'black', strokeThickness: 1 };
    var t = game.add.text(gamesbox.position.x + 64 , gamesbox.position.y + 32, text, style);
    // the following will be created as games appear
    // var room = game.add.sprite(gamesbox.position.x + 20, gamesbox.position.y + 108, 'room'); // for the sake of testing
    // game.add.sprite(gamesbox.position.x + 20, gamesbox.position.y + 200, 'room'); // for the sake of testing
    // game.add.sprite(gamesbox.position.x + 20, gamesbox.position.y + 292, 'room'); // for the sake of testing
    // game.add.sprite(gamesbox.position.x + 20, gamesbox.position.y + 384, 'room'); // for the sake of testing
    // game.add.sprite(gamesbox.position.x + 20, gamesbox.position.y + 476, 'room'); // for the sake of testing
    // game.add.sprite(gamesbox.position.x + 20, gamesbox.position.y + 568, 'room'); // for the sake of testing


    // other players' unrevealed card group
    otherCards = game.add.group();
    otherCards.createMultiple(24, 'otherCard');

    // the remaining revealed card group
    cards = game.add.group();
    cards.createMultiple(12, 'card'); // technically 11 is max

    //cardback = game.add.sprite(300, 500, 'cardback');


    // a little particle effect on click
    emitter = game.add.emitter(0, 0, 200);
    emitter.makeParticles('pixel');
    emitter.gravity = 0;
    game.input.onDown.add(particleBurst, this);
    background.inputEnabled = true;
    //cardback.inputEnabled = true;

    // for testing
    gamesList1 = [{name: "let's play", id: "001", players: 1, password: true},
        {name: "noobs only", id: "002", players: 2, password: false},
        {name: "silver's game", id: "003", players: 3, password: true},
        {name: "sasku", id: "004", players: 4, password: true},
        {name: "saskumees", id: "005", players: 2, password: false},
        {name: "schafkopf", id: "006", players: 3, password: true},]

    games = game.add.group();
    games.createMultiple(6, 'room');
    gamesText = game.add.group(); // for removing them later
    locks = game.add.group();
    locks.createMultiple(6, 'lock');
    rooms = game.add.group();
    displayGames(gamesList1);

}
 
function update() {
}

function particleBurst() {
    if (!(game.input.activePointer.targetObject instanceof Object)) {
        emitter.x = game.input.x;
        emitter.y = game.input.y;
        emitter.start(true, 500, null, 10);
    }
}

function displayGames(gamesList) {
    var styleName = { font: "36px Helvetica", fill: '#E0E0E0' };
    var styleID = { font: "24px Helvetica", fill: '#E0E0E0' }
    var stylePlayers = { font: "20px Helvetica", fill: '#E0E0E0' }
    for (var i = 0; i < gamesList.length; i++) {
        room = games.getFirstExists(false);
        room.reset(gamesbox.position.x + 20, gamesbox.position.y + 108 + i*92);
        var name = game.add.text(room.position.x + 36 , room.position.y + 17, gamesList[i]['name'], styleName);
        gamesText.add(name);
        var id = game.add.text(room.position.x + 346 , room.position.y + 23, "ID: " + gamesList[i]['id'], styleID);
        gamesText.add(id);
        switch (gamesList[i]['players']) {
            case 1:
                aroom = game.add.sprite(gamesbox.position.x + 480, room.position.y, 'room1');
                break;
            case 2:
                aroom = game.add.sprite(gamesbox.position.x + 480, room.position.y, 'room2');
                break;
            case 3:
                aroom = game.add.sprite(gamesbox.position.x + 480, room.position.y, 'room3');
                break;
            case 4:
                aroom = game.add.sprite(gamesbox.position.x + 480, room.position.y, 'room4');
                break;
            default:
                console.log("invalid number of players in room");
        }
        rooms.add(aroom);
        var players = game.add.text(gamesbox.position.x + 483, room.position.y + 9, gamesList[i]['players'] + "/4", stylePlayers);
        gamesText.add(players);
        if (gamesList[i]['password']) {
            lock = locks.getFirstExists(false);
            lock.reset(room.position.x + 550, room.position.y + 10);
        }
    }
}