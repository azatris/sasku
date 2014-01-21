// TODO - all Objects need a kill function
(function (Phaser, Connection) {
    "use strict";
    
    //Background
    var Background = function (game) {
        this.game = game;
    };
    
    Background.prototype = {
        preload: function () {
            this.game.load.image('background', 'img/space_background.jpg');
            this.game.load.image('pixel', 'img/px.png');
        },
        create: function () {
            function centreCanvas(game) {
                game.stage.scale.pageAlignHorizontally = true;
                game.stage.scale.pageAlignVeritcally = true;
                game.stage.scale.refresh();
            }
            function addFloatingParticles(background, game) {
                var type,
                    scale,
                    alpha,
                    i;
    
                function chooseParticle() {
                    if (Math.random() > 0.5) {
                        type = 'dust';
                        scale = Math.random() + 0.15;
                        alpha = Math.random() / 8;
                    } else {
                        type = 'star';
                        scale = Math.random() + 0.02;
                        alpha = Math.random() / 4 + 0.75;
                    }
                }
    
                function addParticle(background, game) {
                    var dustParticle = game.add.sprite(Math.random() * game.width, Math.random() * game.height, type);
                    dustParticle.anchor.setTo(0.5, 0.5);
                    dustParticle.scale.setTo(scale, scale);
                    dustParticle.angle = Math.random() * 360;
                    dustParticle.alpha = alpha;
                    var velocityAngle = Math.random() * 2 * Math.PI,
                        velocityMagnitude = Math.random() + 5;
                    dustParticle.body.velocity.setTo(velocityMagnitude * Math.cos(velocityAngle), velocityMagnitude * Math.sin(velocityAngle));
                    dustParticle.inputEnabled = true;
    
                    function particleClick(particle) {
                        particle.x = Math.random() * game.width;
                        particle.y = Math.random() * game.height;
    
                        background.emitter.x = particle.center.x;
                        background.emitter.y = particle.center.y;
                        background.emitter.start(true, 500, null, 10);
                    }
    
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
                    
                    dustParticle.events.onOutOfBounds.add(wrapAround, background);
                    dustParticle.events.onInputDown.add(particleClick, background);
                }
                
                for (i = 0; i < 150; i += 1) {
                    chooseParticle();
                    addParticle(background, game);
                }
            }
            centreCanvas(this.game);
            var backgroundImage = this.game.add.tileSprite(0, 0, 1440, 900, 'background');
            addFloatingParticles(this, this.game);
            this.emitter = this.game.add.emitter(0, 0, 200);
            this.emitter.makeParticles('pixel');
            this.emitter.gravity = 0;
            backgroundImage.inputEnabled = true;
        },
        update: function () {
            this.emitter.forEachAlive(function (p) {
                p.alpha = p.lifespan / this.emitter.lifespan;
            });
        }
    };
    
    //FPSMeter
    var FPSMeter = function (game) {
        this.game = game;
    };
    
    FPSMeter.prototype = {
        create: function () {
            var fpsStyle = { font: "11px Helvetica", fill: '#E0E0E0'};
            this.fps = this.game.add.text(this.game.width - 15, this.game.height - 10, this.game.time.fps, fpsStyle);
        },
        update: function () {
            this.fps.setText(this.game.time.fps);
        }
    };
    
    //Lobby
    var Lobby = function (game, connection) {
        this.game = game;
        this.connection = connection;
    };
    
    Lobby.prototype = {
        preload: function () {
            this.game.load.image('cardback', 'img/Blue_Back.png');
            this.game.load.image('roomListBox', 'img/gamesbox.png');
            this.game.load.spritesheet('roomBox', 'img/room.png', 602, 72);
            this.game.load.image('lock', 'img/lock2.png');
            this.game.load.image('onePlayer', 'img/room1.png');
            this.game.load.image('twoPlayers', 'img/room2.png');
            this.game.load.image('threePlayers', 'img/room3.png');
            this.game.load.image('fourPlayers', 'img/room4.png');
            this.game.load.image('dust', 'img/dust.png'); // added by Siim
            this.game.load.image('star', 'img/star.png'); // added by Siim
            this.game.load.spritesheet('createRoom', 'img/createroom.png', 202, 72);
            this.game.load.spritesheet('createButton', 'img/createbutton.png', 152, 54);
            this.game.load.spritesheet('cancelButton', 'img/cancelbutton.png', 152, 54);
        },
        create: function () {
            this.availableRoomsCount = 0;
            
            // Creates the whole lobby window.
            this.roomListBox = this.game.add.sprite(400, 90, 'roomListBox');
        
            // Adds a title to the lobby window.
            var titleStyle = { font: "40px Helvetica", fill: '#E0E0E0', stroke: 'black', strokeThickness: 1 };
            this.title = this.game.add.text(this.roomListBox.position.x + 48, this.roomListBox.position.y + 48, "Available rooms: 0", titleStyle);
        
            // Creates groups for objects for easy removal.
            this.roomBoxGroup = this.game.add.group();
            this.playersInRoomGroup = this.game.add.group();
            this.lockGroup = this.game.add.group();
            this.lockGroup.createMultiple(6, 'lock');
            this.roomTextGroup = this.game.add.group();
            
            var createRoomButton = this.game.add.button(this.roomListBox.position.x + 420, this.roomListBox.position.y + 56, 'createRoom', this.createCreateRoomPrompt, this, 1, 0, 2);
        },
        update: function () {
            this.title.setText("Available rooms: " + this.availableRoomsCount.toString());
        },
        selectRoom: function (n, roomList) {
            if (roomList[n].password) {
                console.log("Prompts for password.");
            } else {
                console.log("Starts a game...");
                console.log("Send server following msg: " + "{command: \"NEW\", name: " + roomList[n].name + ", password: \"\"}");
            }
        },
        displayRoomSelection: function (roomList) {
            var i;
            for (i = 0; i < roomList.length; i += 1) {
                // a box for the room
                var roomBox = new Phaser.Button(this.game, this.roomListBox.position.x + 20, this.roomListBox.position.y + 148 + i * 92, 'roomBox', this.selectRoom.bind(undefined, i, roomList), this, 1, 0, 2);
                this.roomBoxGroup.add(roomBox);
    
                // name of the room
                var styleName = { font: "36px Helvetica", fill: '#E0E0E0' };
                var name = this.game.add.text(roomBox.position.x + 36, roomBox.position.y + 17, roomList[i].name, styleName);
                this.roomTextGroup.add(name);
    
                // a graphical representation of the number of players in the room
                var playersInRoom;
                switch (roomList[i].players) {
                case 1:
                    playersInRoom = this.game.add.sprite(roomBox.position.x + 460, roomBox.position.y + 1, 'onePlayer');
                    break;
                case 2:
                    playersInRoom = this.game.add.sprite(roomBox.position.x + 460, roomBox.position.y + 1, 'twoPlayers');
                    break;
                case 3:
                    playersInRoom = this.game.add.sprite(roomBox.position.x + 460, roomBox.position.y + 1, 'threePlayers');
                    break;
                case 4:
                    playersInRoom = this.game.add.sprite(roomBox.position.x + 460, roomBox.position.y + 1, 'fourPlayers');
                    break;
                default:
                    console.log("invalid number of players in room");
                }
                this.playersInRoomGroup.add(playersInRoom);
    
                // a numerical representation of the number of players in the room
                var stylePlayers = { font: "20px Helvetica", fill: '#E0E0E0' };
                var players = this.game.add.text(roomBox.position.x + 463, roomBox.position.y + 9, roomList[i].players + "/4", stylePlayers);
                this.roomTextGroup.add(players);
    
                // a graphical representation of whether the room is password protected
                if (roomList[i].password) {
                    var lock = this.lockGroup.getFirstExists(false);
                    lock.reset(roomBox.position.x + 550, roomBox.position.y + 10);
                }
            }
        }
    };
    
    //Main
    var game = new Phaser.Game(1440, 900, Phaser.AUTO, '', { preload: preload, create: create, update: update }),
        connection = new Connection(),
        
        background,
        fpsMeter,
        lobby,
    
        preload = function () {
            background = new Background(game);
            background.preload();
            fpsMeter = new FPSMeter(game);
            fpsMeter.preload();
            lobby = new Lobby(game, connection);
            lobby.preload();
            connection.addHandler(new ListHandler(game, lobby));
            connection.sendEvent({request: 'LIST'});
        };
    
    function create() {
        background.create();
        fpsMeter.create();
        lobby.create();
    }
    
    function update() {
        background.update();
        fpsMeter.update();
        lobby.update();
    }
    
}(this.Phaser, this.Connection));