(function (window, Handler) {
    "use strict";
    
    var ListHandler = function (game, lobby) {
        Handler.call('LIST');
        this.game = game;
        this.lobby = lobby;
    };
    
    ListHandler.prototype = Object.create(Handler.prototype);
    
    ListHandler.prototype.handle = function (message) {
        if (message.status === 'success') {
            this.lobby.availableRoomsCount = message.games.length;
            this.lobby.displayRoomSelection(message.games);
        }
    };
    
    window.ListHandler = ListHandler;
    
}(this, this.Handler));