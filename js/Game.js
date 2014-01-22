(function (Game, Phaser) {
    "use strict";

    var connection = new Game.Connection(),
        background,
        fpsMeter,
        lobby,
        game,

        preload = function (game) {
            background = new Game.Background(game);
            background.preload();
            fpsMeter = new Game.FPSMeter(game);
            fpsMeter.preload();
            lobby = new Game.Lobby(game, connection);
            lobby.preload();
            connection.addHandler(new Game.ListHandler(game, lobby));
            connection.sendEvent({request: 'LIST'});
        },

        create = function () {
            background.create();
            fpsMeter.create();
            lobby.create();
        },

        update = function () {
            background.update();
            fpsMeter.update();
            lobby.update();
        };

    game = new Phaser.Game(1440, 900, Phaser.AUTO, '', { preload: preload, create: create, update: update });

}(this.Game, this.Phaser));