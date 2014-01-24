(function (Game, Phaser) {
    "use strict";

    var FPSMeter = function (game) {
        this.game = game;
    };

    FPSMeter.prototype = {
        preload: function () {
        },
        create: function () {
            var fpsStyle = { font: "11px Helvetica", fill: '#E0E0E0'};
            this.fps = this.game.add.text(this.game.width - 15, this.game.height - 10, this.game.time.fps, fpsStyle);
        },
        update: function () {
            this.fps.setText(this.game.time.fps);
        }
    };

    Game.FPSMeter = FPSMeter;

}(this.Game, this.Phaser));