/*jslint vars: true */
(function (Game) {
    "use strict";

    var Particle = function (game) {
        this.game = game;
        if (Math.random() > 0.5) {
            this.type = 'dust';
            this.scale = Math.random() + 0.15;
            this.alpha = Math.random() / 8;
        } else {
            this.type = 'star';
            this.scale = Math.random() + 0.02;
            this.alpha = Math.random() / 4 + 0.75;
        }
        this.velocityAngle = Math.random() * 2 * Math.PI;
        this.velocityMagnitude = Math.random() + 5;
        var sprite = function () {
            var dustParticle = this.game.add.sprite(Math.random() * this.game.width, Math.random() * this.game.height, this.type);
            dustParticle.anchor.setTo(0.5, 0.5);
            dustParticle.scale.setTo(this.scale, this.scale);
            dustParticle.angle = Math.random() * 360;
            dustParticle.alpha = this.alpha;
            dustParticle.body.velocity.setTo(this.velocityMagnitude * Math.cos(this.velocityAngle), this.velocityMagnitude * Math.sin(this.velocityAngle));
            dustParticle.inputEnabled = true;
            return dustParticle;
        };
        this.dustParticle = sprite();
    };

    Particle.prototype = {
        onOutOfBounds: function (cb, context) {
            this.dustParticle.events.onOutOfBounds.add(cb, context);
        },
        onInputDown: function (cb, context) {
            this.dustParticle.events.onInputDown.add(cb, context);
        }
    };

    var ParticleEffect = function (game) {
            this.game = game;
        },

        wrapAround = function (game) {
            return function (particle) {
                if (particle.x < 0) {
                    particle.x = game.width + particle.width;
                } else if (particle.x > game.width) {
                    particle.x = -particle.width;
                } else if (particle.y < 0) {
                    particle.y = game.height + particle.height;
                } else if (particle.y > game.height) {
                    particle.y = -particle.height;
                }
            };
        },
        particleClick = function (game, object) {
            return function (particle) {
                particle.x = Math.random() * game.width;
                particle.y = Math.random() * game.height;

                object.emitter.x = object.center.x;
                object.emitter.y = object.center.y;
                object.emitter.start(true, 500, null, 10);
            };
        },
        addFloatingParticles = function (object, game) {
            var i, particle;
            for (i = 0; i < 150; i += 1) {
                particle = new Particle(game);
                particle.onOutOfBounds(wrapAround(game), object);
                particle.onInputDown(particleClick(game, object), object);
            }
        };

    ParticleEffect.prototype = {
        addParticles: function (object) {
            addFloatingParticles(object);
            this.emitter = this.game.add.emitter(0, 0, 200);
            this.emitter.makeParticles('pixel');
            this.emitter.gravity = 0;
        },
        update: function () {
            var that = this;
            that.emitter.forEachAlive(function (p) {
                p.alpha = p.lifespan / that.emitter.lifespan;
            });
        }
    };

    Game.ParticleEffect = ParticleEffect;

}(this.Game));