var game = new Phaser.Game(1440, 900, Phaser.AUTO, '', { preload: preload, create: create, update: update });


function preload() {
    game.load.image('background', 'bin/space_background2.jpg');
    game.load.image('cardback', 'bin/Blue_Back.png');
    game.load.image('pixel', 'bin/px.png');
}
 
var cardback;
var otherCards;
var cards;
var emitter;
var star;
var background;

// kings, queens, jacks, aces, 10s, 9s, 8s, 7s
var ck, cq, cj, ca, c0, c9, c8, c7; // clubs
var sk, sq, sj, sa, s0, s9, s8, s7; // spades
var hk, hq, hj, ha, h0, h9, h8, h7; // hearts
var dk, dq, dj, da, d0, d9, d8, d7; // diamonds



function create() {
    // aligning canvas to the centre
    this.game.stage.scale.pageAlignHorizontally = true;
    this.game.stage.scale.pageAlignVeritcally = true;
    this.game.stage.scale.refresh();

    background = game.add.tileSprite(0, 0, 1440, 900, 'background');

    // other players' unrevealed card group
    otherCards = game.add.group();
    otherCards.createMultiple(24, 'otherCard');

    // the remaining revealed card group
    cards = game.add.group();
    cards.createMultiple(12, 'card'); // technically 11 is max

    cardback = game.add.sprite(300, 500, 'cardback');


    // a little particle effect on click
    emitter = game.add.emitter(0, 0, 200);
    emitter.makeParticles('pixel');
    emitter.gravity = 0;
    game.input.onDown.add(particleBurst, this);
    background.inputEnabled = true;
    cardback.inputEnabled = true;

}
 
function update() {
}

function particleBurst() {
    if (!(game.input.activePointer.targetObject instanceof Object)) {
        emitter.x = game.input.x;
        emitter.y = game.input.y;
        emitter.start(true, 500, null, 10);
    }
}