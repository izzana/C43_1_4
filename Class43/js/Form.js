class Form {
  constructor() {//estrutura do formulário
    //exibirá uma caixa vazia com o texto fornecido no placeholder
    this.input = createInput("").attribute("placeholder", "Digite seu nome");
    //botão para iniciar o jogo
    this.playButton = createButton("Play");
    //irá exibir a imagem de boas vindas ao jogador
    this.titleImg = createImg("./assets/title.png", "título do jogo");
    //criando um título que será exibido para dar boas vindas ao jogador
    this.greeting = createElement("h2");
  }

  setElementPosition() {
    this.titleImg.position(120, 50);
    this.input.position(width/2 - 100, height/2 - 80);
    this.playButton.position(width/2 - 90, height/2 - 20);
    this.greeting.position(width/2 - 300, height/2 - 100);
  }

  hide() {//esconder alguns elementos depois que o botão for clicado
    this.input.hide();
    this.playButton.hide();
    this.greeting.hide();
  }

  setElementsStyle() {
    this.titleImg.class("gameTitle");
    this.input.class("customInput");
    this.playButton.class("customButton");
    this.greeting.class("greeting");
  }

  handleMousePressed() {
    this.playButton.mousePressed(() => {//arrow function, assim vai pegar o valor utilizando o this
      this.input.hide();
      this.playButton.hide();
       //o símbolo usado para escrever a mensagem é a crase
       var message = `Olá, ${this.input.value()}
       </br> espere outro jogador entrar...`;
      this.greeting.html(message);
      //usando o .value para pegar o nome que o usuário digitar no input
      playerCount += 1;
      player.name = this.input.value();     
      player.index = playerCount; 
      player.addPlayer();
      player.updateCount(playerCount);
      player.getDistance();
    });
  }

  display() {
    this.setElementPosition();
    this.handleMousePressed();
    this.setElementsStyle()
  }
}
