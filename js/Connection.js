(function (console, Game, io) {
    "use strict";

    var Handler = function (event, handler) {
        this.event = event;
        this.handler = handler;
    },

        Connection = function () {
            this.socket = io.connect('http://sasku.kaara.info:80');

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
                var json = JSON.parse(message);
                console.log(eventHandler.event);
                if (json.message === eventHandler.event) {
                    eventHandler.handle(json);
                }
            });
        },
        sendEvent: function (event) {
            this.socket.send(JSON.stringify(event));
        }
    };

    Game.Handler = Handler;
    Game.Connection = Connection;

}(this.console, this.Game, this.io));