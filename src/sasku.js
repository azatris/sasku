var game = new Phaser.Game(1440, 900, Phaser.AUTO, '', { preload: preload, create: create, update: update });


function preload() {
    game.load.image('background', 'bin/space_background.jpg');
    game.load.image('cardback', 'bin/Blue_Back.png');
    game.load.image('pixel', 'bin/px.png');
    game.load.image('roomListBox', 'bin/gamesbox.png');
    game.load.spritesheet('roomBox', 'bin/room.png', 602, 72);
    game.load.image('lock', 'bin/lock2.png');
    game.load.image('onePlayer', 'bin/room1.png');
    game.load.image('twoPlayers', 'bin/room2.png');
    game.load.image('threePlayers', 'bin/room3.png');
    game.load.image('fourPlayers', 'bin/room4.png');
    game.load.image('dust', 'bin/dust.png'); // added by Siim
    game.load.image('star', 'bin/star.png'); // added by Siim
    game.load.spritesheet('createRoom', 'bin/createroom.png', 202, 72);
}
 
// misc
var background;
var emitter;
var title;

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

    // other players' unrevealed card group
    otherCardGroup = game.add.group();
    otherCardGroup.createMultiple(24, 'otherCard');

    // the remaining revealed card group
    cardGroup = game.add.group();
    cardGroup.createMultiple(12, 'card'); // technically 11 is max

    //cardback = game.add.sprite(300, 500, 'cardback');

    // Siim: adds some dust particles floating around in the background
    for (var i = 0; i < 150; i++) {
        if (Math.random() > 0.5) {
            var type = 'dust';
            var scale = Math.random() + 0.15;
            var alpha = Math.random()/8;
        } else {
            var type = 'star';
            var scale = Math.random() + 0.02;
            var alpha = Math.random()/4 + 0.75;
        }
        var dustParticle = game.add.sprite(Math.random()*game.width, Math.random()*game.height, type);
        dustParticle.anchor.setTo(0.5, 0.5);
        dustParticle.scale.setTo(scale, scale);
        dustParticle.angle = Math.random()*360;
        dustParticle.alpha = alpha;
        var velocityAngle = Math.random()*2*Math.PI;
        var velocityMagnitude = Math.random()+5;
        dustParticle.body.velocity.setTo(velocityMagnitude*Math.cos(velocityAngle), velocityMagnitude*Math.sin(velocityAngle));
        
        dustParticle.inputEnabled = true;
        dustParticle.events.onOutOfBounds.add(wrapAround, this);
        dustParticle.events.onInputDown.add(particleClick, this);
    }   


    // a little particle effect on click
    emitter = game.add.emitter(0, 0, 200);
    emitter.makeParticles('pixel');
    emitter.gravity = 0;
    game.input.onDown.add(particleBurst, this);
    background.inputEnabled = true;
    //cardback.inputEnabled = true;


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
    emitter.forEachAlive(function(p){
        p.alpha= p.lifespan / emitter.lifespan;
    });
}

// Siim: resets the dust particle's position when it goes off screen
function wrapAround(particle) {
    if (particle.x < 0) {
        particle.x = game.width + particle.width;
    } else if (particle.x > game.width) {
        particle.x = -particle.width;
    } else if (particle.y < 0) {
        particle.y = game.height + particle.height;
    } else if (particle.y > game.height) {
        particle.y = -particle.height;
    }
}

// Siim: do stuff when the dust particle is clicked
function particleClick(particle) {
    particle.x = Math.random()*game.width;
    particle.y = Math.random()*game.height;

    emitter.x = particle.center.x;
    emitter.y = particle.center.y;
    emitter.start(true, 500, null, 10);
}

// function particleBurst() {
//     if (!(game.input.activePointer.targetObject instanceof Object)) {
//         emitter.x = game.input.x;
//         emitter.y = game.input.y;
//         emitter.start(true, 500, null, 10);
//     }
// }

function displayRoomSelection(roomList) {
    roomListBox = game.add.sprite(400, 90, 'roomListBox');
    var titleStyle = { font: "48px Helvetica", fill: '#E0E0E0', stroke: 'black', strokeThickness: 1 };
    title = game.add.text(roomListBox.position.x + 48 , roomListBox.position.y + 32, "Available games", titleStyle);
    roomBoxGroup = game.add.group();
    lockGroup = game.add.group();
    lockGroup.createMultiple(6, 'lock');
    playersInRoomGroup = game.add.group();
    roomTextGroup = game.add.group(); // for removing text later
    var createRoomButton = game.add.button(roomListBox.position.x + 420, roomListBox.position.y + 56, 'createRoom', createRoom, this, 1, 0, 2);



    for (var i = 0; i < roomList.length; i++) {
        // a box for the room
        var roomBox = new Phaser.Button(game, roomListBox.position.x + 20, roomListBox.position.y + 148 + i*92, 'roomBox', selectRoom.bind(undefined, i, roomList), this, 1, 0, 2);
        game.add.roomBox
        roomBoxGroup.add(roomBox);

        // name of the room
        var styleName = { font: "36px Helvetica", fill: '#E0E0E0' };
        var name = game.add.text(roomBox.position.x + 36 , roomBox.position.y + 17, roomList[i]['name'], styleName);
        roomTextGroup.add(name);

        // a graphical representation of the number of players in the room
        var playersInRoom;
        switch (roomList[i]['players']) {
            case 1:
                playersInRoom = game.add.sprite(roomBox.position.x + 460, roomBox.position.y + 1, 'onePlayer');
                break;
            case 2:
                playersInRoom = game.add.sprite(roomBox.position.x + 460, roomBox.position.y + 1, 'twoPlayers');
                break;
            case 3:
                playersInRoom = game.add.sprite(roomBox.position.x + 460, roomBox.position.y + 1, 'threePlayers');
                break;
            case 4:
                playersInRoom = game.add.sprite(roomBox.position.x + 460, roomBox.position.y + 1, 'fourPlayers');
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

function selectRoom(n, roomList) {
    // extract info from roomList[n] to prompt for password and/or start/deny a game
    if (roomList[n]['password']) {
        console.log("Prompts for password.");
    } else {
        console.log("Starts a game...");
        console.log("Send server following msg: " + "{command: \"NEW\", name: " + roomList[n]['name'] + ", password: \"\"}");
    }
}

function createRoom() {
    console.log("Room created.");
}