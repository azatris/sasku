/*jslint vars: true */
(function (console, Game, Phaser) {
    "use strict";

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
            var titleStyle = { font: "40px Helvetica", fill: '#E0E0E0', stroke: 'black', strokeThickness: 1 },
                createRoomButton;
            this.title = this.game.add.text(this.roomListBox.position.x + 48, this.roomListBox.position.y + 48, "Available rooms: 0", titleStyle);
            createRoomButton = this.game.add.button(this.roomListBox.position.x + 420, this.roomListBox.position.y + 56, 'createRoom', this.createCreateRoomPrompt, this, 1, 0, 2);

            // Creates groups for objects for easy removal.
            this.roomBoxGroup = this.game.add.group();
            this.playersInRoomGroup = this.game.add.group();
            this.lockGroup = this.game.add.group();
            this.lockGroup.createMultiple(6, 'lock');
            this.roomTextGroup = this.game.add.group();

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
            roomList.forEach(function (elem, i) {
                // a box for the room
                var roomBox = new Phaser.Button(this.game, this.roomListBox.position.x + 20, this.roomListBox.position.y + 148 + i * 92, 'roomBox', this.selectRoom.bind(undefined, i, roomList), this, 1, 0, 2);
                this.roomBoxGroup.add(roomBox);

                // name of the room
                var styleName = { font: "36px Helvetica", fill: '#E0E0E0' };
                var name = this.game.add.text(roomBox.position.x + 36, roomBox.position.y + 17, elem.name, styleName);
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
                var stylePlayers = { font: "20px Helvetica", fill: '#E0E0E0' },
                    players = this.game.add.text(roomBox.position.x + 463, roomBox.position.y + 9, elem.players + "/4", stylePlayers);
                this.roomTextGroup.add(players);

                // a graphical representation of whether the room is password protected
                if (roomList[i].password) {
                    var lock = this.lockGroup.getFirstExists(false);
                    lock.reset(roomBox.position.x + 550, roomBox.position.y + 10);
                }
            });
        }
    };

    Game.Lobby = Lobby;
}(this.console, this.Game, this.Phaser));