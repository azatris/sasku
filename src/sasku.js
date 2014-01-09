var game = new Phaser.Game(1440, 900, Phaser.AUTO, '', { preload: preload, create: create, update: update });


function preload() {
    game.load.image('background', 'bin/space_background2.jpg');
    game.load.image('cardback', 'bin/Blue_Back.png');
}
 
var cardback;
var otherCards;
var cards;

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

    game.add.tileSprite(0, 0, 1440, 900, 'background');

    // other players' unrevealed card group
    otherCards = game.add.group();
    otherCards.createMultiple(24, 'otherCard');

    // the remaining revealed card group
    cards = game.add.group();
    cards.createMultiple(12, 'card'); // technically 11 is max

    cardback = game.add.sprite(300, 300, 'cardback');
    cardback.scale.x = 1;
    cardback.scale.y = 1;

    

}
 
function update() {
}