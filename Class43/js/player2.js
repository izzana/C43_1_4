class Player {
  constructor() {
   this.name = null; //para salvar o nome do jogador
   this.index = null; //para dar um id único para cada jogador
   this.positionX = 0; //para armazenar posição x de cada jogador
   this.positionY = 0; //para armazenar posição y de cada jogador
  }

  //método para adicionar jogador
  addPlayer() {
    var playerIndex = "players/player" + this.index;//cria hierarquia players/player1 no bd

    if(this.index === 1) { //para dar posição x para ambos os jogadores,  
      this.positionX = width / 2 - 100;//jogador na esquerda do centro
    } else {
      this.positionX = width / 2 + 100;//jogador na direita
    }

    database.ref(playerIndex).set({//atualizando campo no bd
      name: this.name,
      positionX: this.positionX,
      positionY: this.positionY,
    });
  }

  getDistance() {
    var playerDistanceRef = database.ref("players/player" + this.index);//lendo os dados no BD
    playerDistanceRef.on("value", data => {//passando os dados lidos
      var data = data.val();//extraindo o conteúdo como um objeto
      this.positionX = data.positionX;//atribuindo ao valor do bd
      this.positionY = data.positionY;
    })
  }

  //método para obter o playerCount e updateCount() epara atualizar o playerCount no bd
  getCount() {
    //ler os dados e armazenar dentro da função
    var playerCountRef = database.ref("playerCount");//referenciando ao bd
    playerCountRef.on("value", (data) => {
      playerCount = data.val();
    })
  }
  
  //método para atualizar o playerCount no bd
  updateCount(count) {
    database.ref("/").update({
      playerCount: count
    });
  }

  update() {//método para atualizar as posições no bd
    var playerIndex = "players/player" + this.index;
    database.ref(playerIndex).update({
      name: this.name,
      positionX: this.positionX,
      positionY: this.positionY,
     });
  }

  static getPlayersInfo() {//obtendo todas as informações dos jogadores
    var playerInfoRef = database.ref("players");
    playerInfoRef.on("value", data => {
      allPlayers = data.val();
    });
  }
}
