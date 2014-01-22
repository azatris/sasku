(function (console, Game, io) {
    "use strict";

    var Handler = function (event, handler) {
        this.event = event;
        this.handler = handler;
    },

        Connection = function () {
            this.socket = io.connect('http://sasku.kaara.info');

            var addLogHandlers = function (connection) {
                connection.socket.on('connecting', function () {console.log('Connecting...'); });
                connection.socket.on('connect', function () {console.log('Connected!'); });
                connection.socket.on('connect_failed', function () {console.log('Connection failed!'); });
                connection.socket.on('info', function (data) {console.log(data); });
            };
            addLogHandlers(this);
        };

    Connection.prototype = {
        addHandler: function (eventHandler) {
            this.socket.on('message', function (message) {
                if (message.request === eventHandler.event) {
                    eventHandler.handle(message);
                }
            });
        },
        sendEvent: function (event) {
            this.socket.emit(JSON.stringify(event));
        }
    };

    Game.Handler = Handler;
    Game.Connection = Connection;

}(this.console, this.Game, this.io));