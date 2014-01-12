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
var fps;
var socket
var availableRoomsCount = 0;
var createRoomButton;

// sprites
var roomListBox;

// for testing
var cardback;
var testRoomList;

// groups
var roomBoxGroup;
var playersInRoomGroup;
var lockGroup;
var roomTextGroup;

function create() {
    centreCanvas();

    createBackground();
    createFPSMeter();
    createLobby();

    setupConnection();
}

function centreCanvas() {
    this.game.stage.scale.pageAlignHorizontally = true;
    this.game.stage.scale.pageAlignVeritcally = true;
    this.game.stage.scale.refresh();
}

function createBackground() {
    background = game.add.tileSprite(0, 0, 1440, 900, 'background');
    addFloatingParticles();
    createParticleEmitter();
    background.inputEnabled = true;
}

// Siim: adds some dust particles floating around in the background
function addFloatingParticles() {
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
}

function createParticleEmitter() {
    emitter = game.add.emitter(0, 0, 200);
    emitter.makeParticles('pixel');
    emitter.gravity = 0;
}

function createFPSMeter() {
    var fpsStyle = { font: "11px Helvetica", fill: '#E0E0E0'};
    fps = game.add.text(game.width - 15, game.height - 10, game.time.fps, fpsStyle);
}
 
function createLobby() {
    // Creates the whole lobby window.
    roomListBox = game.add.sprite(400, 90, 'roomListBox');

    // Adds a title to the lobby window.
    var titleStyle = { font: "40px Helvetica", fill: '#E0E0E0', stroke: 'black', strokeThickness: 1 };
    title = game.add.text(roomListBox.position.x + 48 , roomListBox.position.y + 48, "Available rooms: 0", titleStyle);

    // Creates groups for objects for easy removal.
    roomBoxGroup = game.add.group();
    playersInRoomGroup = game.add.group();
    lockGroup = game.add.group();
    lockGroup.createMultiple(6, 'lock');
    roomTextGroup = game.add.group();

    // Creates a button for creating a new room.
    createRoomButton = game.add.button(roomListBox.position.x + 420, roomListBox.position.y + 56, 'createRoom', createRoom, this, 1, 0, 2);
}

function update() {
    emitter.forEachAlive(function(p){
        p.alpha= p.lifespan / emitter.lifespan;
    });
    title.setText("Available rooms: " + availableRoomsCount.toString());
    fps.setText(game.time.fps);

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

function displayRoomSelection(roomList) {
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

function setupConnection() {
    socket = io.connect('http://sasku.kaara.info');

    addSocketEventListeners();

    socket.emit("{ request: \"LIST\" ");
}

function addSocketEventListeners() {
    socket.on('connecting', function() { console.log("Connecting..."); });
    socket.on('connect', function() { console.log("Connected!"); });
    socket.on('connect_failed', function() { console.log("Connect failed!"); });
    socket.on('info', function(data) { console.log(data); });
    socket.on('message', function(message) { parseMessage(message); });
}

function parseMessage(message) {
        switch (message['message']) {
            case "LIST":
                if (message['status'] == "success") {
                    availableRoomsCount = message['games'].length;
                    displayRoomSelection(message['games']);
                }
                break;
        }
}