(function (window, io) {
    "use strict";
    
    var Handler = function (event, handler) {
        this.event = event;
        this.handler = handler;
    },
    
        Connection = function () {
            this.socket = io.connect('http://sasku.kaara.info');
    
            var addLogHandlers = function (connection) {
                this.socket.on('connecting', function () {window.console.log('Connecting...'); });
                this.socket.on('connect', function () {window.console.log('Connected!'); });
                this.socket.on('connect_failed', function () {window.console.log('Connection failed!'); });
                this.socket.on('info', function (data) {window.console.log(data); });
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
    
    window.Handler = Handler;
    window.Connection = Connection;
    
}(this, this.io));