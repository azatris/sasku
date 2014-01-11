var game = new Phaser.Game(1440, 900, Phaser.AUTO, '', { preload: preload, create: create, update: update });


function preload() {
    game.load.image('background', 'bin/space_background2.jpg');
    game.load.image('cardback', 'bin/Blue_Back.png');
    game.load.image('pixel', 'bin/px.png');
    game.load.image('roomListBox', 'bin/gamesbox.png');
    game.load.image('roomBox', 'bin/room.png');
    game.load.image('lock', 'bin/lock.png');
    game.load.image('onePlayer', 'bin/room1.png');
    game.load.image('twoPlayers', 'bin/room2.png');
    game.load.image('threePlayers', 'bin/room3.png');
    game.load.image('fourPlayers', 'bin/room4.png');
}
 
// misc
var background;
var emitter;

// sprites
var roomListBox;

// for testing
var cardback;
var testRoomList;

// groups
var cardGroup;
var otherCardGroup;
var roomBoxGroup;
var playersInRoomGroup;
var lockGroup;
var roomTextGroup;


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
    roomListBox = game.add.sprite(400, 90, 'roomListBox');
    var text = "Available games";
    var style = { font: "48px Helvetica", fill: '#E0E0E0', stroke: 'black', strokeThickness: 1 };
    var t = game.add.text(roomListBox.position.x + 64 , roomListBox.position.y + 32, text, style);


    // other players' unrevealed card group
    otherCardGroup = game.add.group();
    otherCardGroup.createMultiple(24, 'otherCard');

    // the remaining revealed card group
    cardGroup = game.add.group();
    cardGroup.createMultiple(12, 'card'); // technically 11 is max

    //cardback = game.add.sprite(300, 500, 'cardback');


    // a little particle effect on click
    emitter = game.add.emitter(0, 0, 200);
    emitter.makeParticles('pixel');
    emitter.gravity = 0;
    game.input.onDown.add(particleBurst, this);
    background.inputEnabled = true;
    //cardback.inputEnabled = true;

    // for room selection screen
    roomBoxGroup = game.add.group();
    roomBoxGroup.createMultiple(6, 'roomBox');
    lockGroup = game.add.group();
    lockGroup.createMultiple(6, 'lock');
    playersInRoomGroup = game.add.group();
    roomTextGroup = game.add.group(); // for removing text later

    // for testing room selection screen
    testRoomList = [{name: "let's play", id: "001", players: 1, password: true},
        {name: "noobs only", id: "002", players: 2, password: false},
        {name: "silver's game", id: "003", players: 3, password: true},
        {name: "sasku", id: "004", players: 4, password: true},
        {name: "saskumees", id: "005", players: 2, password: false},
        {name: "schafkopf", id: "006", players: 3, password: true},]
    displayRoomSelection(testRoomList);

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

function displayRoomSelection(roomList) {
    for (var i = 0; i < roomList.length; i++) {
        // a box for the room
        var roomBox = roomBoxGroup.getFirstExists(false);
        roomBox.reset(roomListBox.position.x + 20, roomListBox.position.y + 108 + i*92);

        // name of the room
        var styleName = { font: "36px Helvetica", fill: '#E0E0E0' };
        var name = game.add.text(roomBox.position.x + 36 , roomBox.position.y + 17, roomList[i]['name'], styleName);
        roomTextGroup.add(name);

        // ID of the room
        var styleID = { font: "24px Helvetica", fill: '#E0E0E0' }
        var id = game.add.text(roomBox.position.x + 346 , roomBox.position.y + 23, "ID: " + roomList[i]['id'], styleID);
        roomTextGroup.add(id);

        // a graphical representation of the number of players in the room
        var playersInRoom;
        switch (roomList[i]['players']) {
            case 1:
                playersInRoom = game.add.sprite(roomBox.position.x + 460, roomBox.position.y, 'onePlayer');
                break;
            case 2:
                playersInRoom = game.add.sprite(roomBox.position.x + 460, roomBox.position.y, 'twoPlayers');
                break;
            case 3:
                playersInRoom = game.add.sprite(roomBox.position.x + 460, roomBox.position.y, 'threePlayers');
                break;
            case 4:
                playersInRoom = game.add.sprite(roomBox.position.x + 460, roomBox.position.y, 'fourPlayers');
                break;
            default:
                console.log("invalid number of players in room");
        }
        playersInRoomGroup.add(playersInRoom);

        // a numerical representation of the number of players in the room
        var stylePlayers = { font: "20px Helvetica", fill: '#E0E0E0' }
        var players = game.add.text(roomBox.position.x + 463, roomBox.position.y + 9, roomList[i]['players'] + "/4", stylePlayers);
        roomTextGroup.add(players);

        // a graphical representation of whether the room is password protected
        if (roomList[i]['password']) {
            var lock = lockGroup.getFirstExists(false);
            lock.reset(roomBox.position.x + 550, roomBox.position.y + 10);
        }
    }
}