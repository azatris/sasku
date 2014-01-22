(function (Game, Phaser) {
    "use strict";

    //Constructor
    var Background = function (game) {
        this.game = game;
    },

    //Private functions
        centerCanvas = function (game) {
            game.stage.scale.pageAlignHorizontally = true;
            game.stage.scale.pageAlignVeritcally = true;
            game.stage.scale.refresh();
        };

    //Public functions
    Background.prototype = {
        preload: function () {
            this.game.load.image('background', 'img/space_background.jpg');
            this.game.load.image('pixel', 'img/px.png');
        },
        create: function () {
            centerCanvas(this.game);
            var backgroundImage = this.game.add.tileSprite(0, 0, 1440, 900, 'background');
            //this.effect = new Game.ParticleEffect();
            //this.effect.addParticles(this);
            backgroundImage.inputEnabled = true;
        },
        update: function () {
            //this.effect.update();
        }
    };

    Game.Background = Background;

}(this.Game, this.Phaser));