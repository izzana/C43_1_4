class Game {
  constructor() {}

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
  }

  play() {
    //função para esconder os elementos
    this.handleElements();
    //pegar informação dos players
    Player.getPlayersInfo();
    //condicional que vai checar se os jogadores entraram no jogo e exibir a pista
    if(allPlayers !== undefined) {
      image(track, 0, - height * 5, width, height * 6);//criará parte da pista fora de tela, pois não queremos mostrar tudo de uma vez
      
      var index = 0;
      for(var plr in allPlayers) {//plr vai atravessar o objeto allPlayers para pegar s valores da posição
       
        var x = allPlayers[plr].positionX;//acessano os dados do objeto
        var y = height - allPlayers[plr].positionY;//subtraindo pos quero manter o carro na parte inferior da tela
        //adicione 1 ao índice de cada loop
        index = index + 1;
        
        cars[index-1].position.x = x;
        cars[index-1].position.y = y;
        //cars[index].position.x = x;
        //cars[index].position.y = y;
        if(index === player.index) {//condicional para identificar o jogador atual
          stroke(10);
          fill("red");
          ellipse(x, y, 60, 60);
          //chamar métodos de checar sobreposição
          this.handleFuel(index);
          this.handlePowerCoins(index);
        }
      }

      if (keyIsDown(UP_ARROW)) {
        player.positionY += 10;
        player.update();//criaremos o método no Player.js
      }
    }
    //desenhar os sprites
    drawSprites();
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
}

