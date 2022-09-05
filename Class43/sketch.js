var canvas;
var backgroundImage;
var bgImg;
var database;
var form, player;
var playerCount;
var gameState;
var allPlayers, car1, car2, cars, car1_img, car2_img;
//variáveis para recompensas
var fuelImage, powerCoinImage, fuels, powerCoins;
var fuels, powerCoins;

function preload() {
  backgroundImage = loadImage("./assets/background.png");
  car1_img = loadImage("./assets/car1.png");
  car2_img = loadImage("./assets/car2.png");
  track = loadImage("./assets/track.jpg");
  //adicionar imagens das recompensas
  fuelImage = loadImage("./assets/fuel.png")
  powerCoinImage = loadImage("./assets/goldCoin.png")
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();
  bgImg = backgroundImage;
}


function draw() {
  background(bgImg);

  //verifica o número de jogadores conectados
  if(playerCount === 2) {
    game.update(1);
  }

  //verifica o estado do jogo para começar a partida
  if(gameState === 1) {
    game.play();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
