(function (Game) {
    "use strict";

    var ListHandler = function (game, lobby) {
        Game.Handler.call('LIST');
        this.game = game;
        this.lobby = lobby;
    };

    ListHandler.prototype = Object.create(Game.Handler.prototype);

    ListHandler.prototype.handle = function (message) {
        if (message.status === 'success') {
            this.lobby.availableRoomsCount = message.games.length;
            this.lobby.displayRoomSelection(message.games);
        }
    };

    Game.ListHandler = ListHandler;

}(this.Game));