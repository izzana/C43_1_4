class Game {
  constructor() {
    //crinado título que terá texto de reiniciar usando elementod do p5.Dom
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");//botão de reinicio

    //criar elementos
    this.leaderboardTitle = createElement("h2");
    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
  }

  getState() {//método que irá ler o gameState do banco de dados
      var gameStateRef = database.ref("gameState");//me referindo a chave gameState criada no bd
      //criando um ouvinte que fica acompanhando a mudança no valor da variável gameState no bd.
      gameStateRef.on("value", function(data) {        
        gameState = data.val();
    });
  }

  update(state) {//método que irá atualizar o gameState no bd para um valor passado para ele como parâmetro
    database.ref("/").update({//se refere ao banco de dados principal dentro do qual gameState é criado
      gameState: state
    });
  }

  start() {//método para obter o gameState e então iniciar o jogo
    //instância de um novo jogador
    player = new Player();
    //inciando a variável playerCount
    playerCount = player.getCount();

    form = new Form();
    form.display();

    //criar sprites dos jogadores
    car1 = createSprite(width/2 -50, height - 100);
    car1.addImage("car1", car1_img);
    car1.scale = 0.07;

    car2 = createSprite(width/2 + 100, height - 100);
    car2.addImage("car2", car2_img);
    car2.scale = 0.07;

    //atribuindo os objetos ao vetor cars
    cars = [car1, car2];

    //criar grupos para adicionar sprites de recompensas
    fuels = new Group();
    powerCoins = new Group();

    //adicionando sprite de combustível ao jogo
    this.addSprites(fuels, 4, fuelImage, 0.02);

    //adicionando sprite de moeda ao jogo
    this.addSprites(powerCoins, 18, powerCoinImage, 0.09);
  }

  //método para criar as moedas e os tanques de combustível aleatoriamente
  addSprites(spriteGroup, numberOfSprites, spriteImage, scale) {
    for(var i = 0; i < numberOfSprites; i++) {
      var x, y;
      x = random(width / 2 + 150, width / 2 - 150);//posição para os dois sprites
      y = random(-height * 4.5, height - 400);//posição para os dois sprites

      var sprite = createSprite(x, y);
      sprite.addImage("sprite", spriteImage);

      sprite.scale = scale;
      spriteGroup.add(sprite);
    }
  }
  
  handleElements(){
    form.hide();
    form.titleImg.position(40,50);
    form.titleImg.class("gameTitleAfterEffects");

    //texto, posição e classe de estilo do CSS para o texto de reinicio
    this.resetTitle.html("Reiniciar o jogo");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width / 2 + 200, 40);

    //class para colocar a imagem usando css e posição do botão
    this.resetButton.class("resetButton");
    this.resetButton.position(width / 2 + 230, 100);

    //atribuindo posição e texto
    this.leaderboardTitle.html("Placar");
    this.leaderboardTitle.class("resetText");//estilo para texto
    this.leaderboardTitle.position(width / 3 - 60, 40);

    //atribuindo posição e texto para jogadores
    this.leader1.class("leadersText");
    this.leader1.position(width / 3 - 50, 80);

    this.leader2.class("leadersText");
    this.leader2.position(width / 3 - 50, 130);
  }

  play() {
    //função para esconder os elementos
    this.handleElements();
    //função para reiniciar dados no bd e recarregar o jogo
    this.handleResetButton();
    Player.getPlayersInfo();
    if(allPlayers !== undefined){
      image(track, 0, - height * 5, width, height * 6);
      //método para mostrar rank
      this.showLeaderboard();
      var index = 0;
      for(var plr in allPlayers) {//FOR PARA ANDAR NA MATRIZ CARS :)))))))))))))))))))))))))))))))))))))))))))
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY
        index = index +  1;
        cars[index -1].position.x = x;
        cars[index -1].position.y = y;

        if(index === player.index) {//condicional para identificar o jogador atual
          stroke(10);
          fill("red");
          ellipse(x, y, 60, 60);
          //chamar métodos de checar sobreposição
          this.handleFuel(index);
          this.handlePowerCoins(index);

          //alterar a posição da câmera para os dois jogadores na direção y
          camera.position.x = cars[index - 1].position.x;
          camera.position.y = cars[index - 1].position.y;
        }
      }
      if (keyIsDown(UP_ARROW)){
        player.positionY +=10;
        player.update();
      }
      //chamando a função de movimentação dos carros
      this.handlePlayerControls();
      //desenhar os sprites
      drawSprites();
    } 
  }

  handleFuel(index) {//função para checar se tocamos no combustível
    // Adicione o combustível
    cars[index - 1].overlap(fuels, function(collector, collected) {
      player.fuel = 185;
      //collected (coletado) é o sprite no grupo de colecionáveis que desencadeia
      //o evento
      collected.remove();
    });
  }

  handlePowerCoins(index) {//função para checar se tocamos na moeda
    cars[index - 1].overlap(powerCoins, function(collector, collected) {
      player.score += 21;
      player.update();
      //collected (coletado) é o sprite no grupo de colecionáveis que desencadeia
      //o evento
      collected.remove();
    });
  }

  //método paratodos os campos do bd e recarregar o jogo
  handleResetButton() {
    this.resetButton.mousePressed(() => {//botão ligado a um evento de clique
      database.ref("/").set({
        playerCount: 0,
        gameState: 0,
        players: {},
        carsAtEnd: 0
      });
      window.location.reload();//para recarregar o jogo
    });
  }

  //método para mostrar a tabela
  showLeaderboard() {
    var leader1, leader2;
    //método que retorna uma array de valores de propriedades enumeradas do próprio objeto
    var players = Object.values(allPlayers);//para obter informacões dos jogadores do bd

    //condição para verificar se o primeiro jogador tem classificação 1
    if(
      (players[0].rank === 0 && players[1].rank === 0) || 
      players[0].rank === 1) {
      //&emsp; -> tag usada para exibir 4 espaços
      leader1 =
        players[0].rank + 
        "&emsp;" + 
        players[0].name +
        "&emsp;" + 
        players[0].score;

      leader2 =
        players[1].rank + 
        "&emsp;" + 
        players[1].name +
        "&emsp;" + 
        players[1].score;
    }

    //condição para verificar se o segundo jogador tem classificação 1
    if (players[1].rank === 1) {
      leader1 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;

      leader2 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;
    }
    //passar como elemento html para mostrar na tela
    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }

  //controles para movimentar o jogador
  handlePlayerControls() {
    if (keyIsDown(UP_ARROW)){
      player.positionY +=10;
      player.update();
    }

    if (keyIsDown(LEFT_ARROW) && player.positionX > width / 3 - 50){
      player.positionX -= 5;
      player.update();
    }

    if (keyIsDown(RIGHT_ARROW) && player.positionX < width / 2 + 300){
      player.positionX +=5;
      player.update();
    }
  }

  
}

