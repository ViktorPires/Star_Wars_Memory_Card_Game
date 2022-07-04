document.addEventListener('DOMContentLoaded', () => {
  const tabuleiro = document.querySelector("#tabuleiro");
  const cartas = [
    "kenoby.svg",
    "bb8.svg",
    "r2d2.svg",
    "baby-yoda.svg",
    "BobaFett.svg",
    "NewRepublic.svg",
    "darth-vader.svg",
    "SithEmpire.svg"
  ];

  let cartasStarWars = "";

  (function iniciarJogo() {
    cartas.forEach(carta => {
      cartasStarWars += `<div class="memory-card" data-card="${carta}">
        <img class="front-face" src="assets/${carta}">
        <img class="back-face hide" src="assets/star-wars.svg">;
      </div>`;
      }); 

      setTimeout(() => {
        embaralhar();
      }, 500);

      setTimeout(() => {
        let backFaces = document.querySelectorAll('.back-face');
        backFaces.forEach(backFace => {
          backFace.classList.remove('hide');
        });
        jogoIniciado = true;
      }, 3500);
    })();

  const usuario = localStorage.getItem('player');
  const jogador = document.querySelector("#jogador")
  jogador.innerHTML = usuario;

  tabuleiro.innerHTML = cartasStarWars + cartasStarWars;

  const cards = document.querySelectorAll(".memory-card");
  let primeiraCarta; 
  let segundaCarta;
  let trancarTabuleiro = false;
  let cartasBloqueadas = false;
  let score = 0;
  let minutos = 0;
  let segundos = 0;
  let jogoIniciado = false;
  const tempo = new timer('#timer');
  tempo.start();

  function timer(e) {
    this.time = 0;
    this.controle = null;
    this.elemento = e;
    this.start = () => {
      this.controle = setInterval( () => {
        this.time++;
        minutos = Math.trunc(this.time/60);
        segundos = this.time % 60;
        document.querySelector(this.elemento).innerHTML = 
        (minutos < 10 ? '0':'') + minutos + ':' + 
        (segundos < 10 ? '0':'') + segundos;
      }, 1000);
    };
    this.stop = () => {
      clearInterval(this.controle);
    };
  }

  function virarCarta() {
    if(jogoIniciado === true) {
      if(trancarTabuleiro) {
        return
      } if(this === primeiraCarta) {
        return
      }
      this.classList.add("flip");
      if (!primeiraCarta) {
        primeiraCarta = this;
        return false;
      }
      primeiraCarta.addEventListener('click', verificarClickCarta);
      segundaCarta = this;
      segundaCarta.addEventListener('click', verificarClickCarta);
      cartasBloqueadas = false;
      checarCombinacao();
    }
  }
  function checarCombinacao() {
    let Match = primeiraCarta.dataset.card === segundaCarta.dataset.card;
    if(Match) {
      score++;
    } if(score == 8) {
      fimDeJogo();
    } 
    !Match ? desvirarCartas() : resetarCartas(Match);
  }

  function verificarClickCarta() {
    let cartaClicada = false;
    if (cartaClicada = true) {
      window.alert('Esta carta já foi virada!');
    }
    cartaClicada = true;
  };

  function desvirarCartas() {
    trancarTabuleiro = true;
    setTimeout(() => {
      primeiraCarta.classList.remove("flip");
      segundaCarta.classList.remove("flip");
      primeiraCarta.removeEventListener('click', verificarClickCarta);
      segundaCarta.removeEventListener('click', verificarClickCarta);

      resetarCartas();
    }, 1500);
  }

  function resetarCartas(isMatch = false) {
    if (isMatch) {
      primeiraCarta.removeEventListener("click", virarCarta);
      segundaCarta.removeEventListener("click", virarCarta);
    }
    [primeiraCarta, segundaCarta, trancarTabuleiro] = [null, null, false];
  }

  function embaralhar() {
    cards.forEach(carta => {
      let posicaoRandomica = Math.floor(Math.random() * 16);
      carta.style.order = posicaoRandomica;
    });
  };

  function resetarJogo() {
    const reset = document.querySelector('#reset');
      reset.addEventListener("click", () => {
        let resetar = window.prompt('Deseja Resetar o Jogo? S/N');
        if(resetar.toUpperCase() == "S" || resetar.toUpperCase() == "SIM") {
          let trocarJogador = window.prompt('Deseja Trocar de Jogador? S/N');
          if(trocarJogador.toUpperCase() == "S" || trocarJogador.toUpperCase() == "SIM") {
            window.location = 'index.html';
          } else {
            window.location.reload();
          }
        }
      })
    } window.onload = resetarJogo();

  function fimDeJogo() {
    let tempoDeJogo = `${minutos}` + `${segundos}`;
    tempo.stop();
    window.alert(`Parabéns, ${usuario}! Você salvou a galáxia! Seu tempo de jogo é ${minutos}:${segundos}`);
    let tempoRecorde = 0;

    if (localStorage.getItem("tempoRecorde") !== null) {
      tempoRecorde = Number(localStorage.getItem("tempoRecorde"));
    } if(tempoDeJogo < tempoRecorde || !window.localStorage.getItem('tempoRecorde')) {
      localStorage.setItem('playerRecorde', usuario);
      localStorage.setItem('tempoRecorde', tempoDeJogo);
      let tempoRecordeDisplay = `${minutos}` + `:` + `${segundos}`;
      localStorage.setItem('tempoRecordeDisplay', tempoRecordeDisplay);
      window.alert(`Parabéns, ${usuario}! Você possui o novo tempo recorde!`);
    } 

    let jogarNovamente = window.prompt('Deseja jogar novamente? S/N')
    if(jogarNovamente.toUpperCase() == "S" || jogarNovamente.toUpperCase() == "SIM") {
      window.location.reload();
    } else {
      window.location = 'index.html';
    }
  }

  function highscore() {
    const recorde = document.querySelector("#recorde");
      recorde.addEventListener("click", () => {
        if(localStorage.getItem('playerRecorde') == null) {
          return window.alert(`Não há recorde registrado!`);
        } else {
          return window.alert(`Jogador: ${localStorage.getItem('playerRecorde')} ` + `-` + ` Tempo: ${localStorage.getItem('tempoRecordeDisplay')}`);
        }
      })
  }  window.onload = highscore();

  cards.forEach(card => card.addEventListener("click", virarCarta));
})