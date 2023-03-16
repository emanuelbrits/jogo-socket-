import * as net from "net";
const fs = require('fs')

interface Jogador {
  nome: string;
  pontos: number;
  socket: net.Socket;
}

const jogadores: Jogador[] = [];
let contadorRodadas = 0;
let rodada = 0
const maxRodadas = 5;
const TAMANHO_MAPA = 10;
const i = [gerarNumero(), gerarNumero(), gerarNumero(), gerarNumero(), gerarNumero()]
const j = [gerarNumero(), gerarNumero(), gerarNumero(), gerarNumero(), gerarNumero()]

function gerarNumero() {
  let numero = Math.floor(Math.random() * TAMANHO_MAPA);

  return numero
}

let mapaatual = 
[['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O']];

let imprime = ''

function gerarMapa(i: number[], j: number[], mp: string[][], p?: number, o?: number) {

  if(p && o) {
    mp[p][o] = 'X'
  }

  console.log(`Tesouro: [${i[rodada]}][${j[rodada]}]`)

  imprime = '0 1 2 3 4 5 6 7 8 9\n'
  for(let y = 0; y < 10; y++) {
    for (let u = 0; u < 10; u++) {
      if(u == 0) {
        imprime += `${mp[y][u]}`
      } else {
        imprime += ` ${mp[y][u]}`
      }
    }

    imprime += ` ${y}\n`
  }

  console.log("Mapa atual:");
  console.log(imprime);
}

const server = net.createServer((socket: net.Socket) => {
  console.log("Novo jogador conectado!");

  let jogadorAtual: Jogador;

  socket.on("data", (data: Buffer) => {
    const jogada = data.toString().trim();

    if (!jogadorAtual) {
      jogadorAtual = { nome: jogada, pontos: 0, socket };
      jogadores.push(jogadorAtual);
      console.log(`O jogador ${jogadorAtual.nome} se registrou.`);

      jogadorAtual.socket.write("Bem-vindo ao jogo de caça ao tesouro!\n");
      jogadorAtual.socket.write(`Você está registrado como ${jogadorAtual.nome}\n`);

      if (jogadores.length >= 2) {
        iniciaPartida();
      } else {
        jogadorAtual.socket.write("Ainda não há jogadores suficientes. Aguarde...\n");
      }
    } else {
      console.log(`O jogador ${jogadorAtual.nome} jogou: ${jogada}`);
      processaJogada(jogada, i, j);
    }
  });

  socket.on("end", () => {
    if (jogadorAtual) {
      console.log(`O jogador ${jogadorAtual.nome} desconectou.`);
      removeJogador(jogadorAtual);
      if (jogadores.length < 2) {
        encerraPartida();
      }
    }
  });

function iniciaPartida() {
  console.log("Iniciando nova partida...");
  contadorRodadas = 0;
  enviaMensagem("A partida começou! Boa sorte a todos os jogadores!");
  proximaRodada(i, j);
}

function encerraPartida() { 
  let txt = "";
  if (jogadores[0] && jogadores[1]) {
    txt = `\n${jogadores[0].nome} ${jogadores[0].pontos} - ${jogadores[1].pontos} ${jogadores[1].nome}`
  }

  fs.appendFile('historico.txt', txt, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  })

  const conteudoArquivo = fs.readFileSync('historico.txt', 'utf8')

  console.log("Encerrando partida...");
  let vencedor: Jogador | null = null;
  for (let jogador of jogadores) {
    if (!vencedor || jogador.pontos > vencedor.pontos) {
      vencedor = jogador;
    }
  }

  if (vencedor) {
    enviaMensagem(`\n\nParabéns, ${vencedor.nome}! Você venceu a partida com ${vencedor.pontos} pontos.\n\nHistórico de jogos: \n${conteudoArquivo}\n${jogadores[0].nome} ${jogadores[0].pontos} - ${jogadores[1].pontos} ${jogadores[1].nome}`);
  } else {
    enviaMensagem("A partida terminou em empate.");
  }
  jogadores.forEach((jogador) => {
    jogador.socket.end();
  });

  jogadores.length = 0;
}

function proximaRodada(i: number[], j: number[]) {
  contadorRodadas++;
  if (contadorRodadas > maxRodadas) {
    encerraPartida();
  } else {
    gerarMapa(i, j, mapaatual);
    enviaMapa();
    enviaMensagem(`Começando a rodada ${contadorRodadas}...`);
    enviaPlacar();
  }
}

function enviaMapa() {
  jogadores.forEach((jogador) => {
    jogador.socket.write("Mapa:\n");
    jogador.socket.write(imprime);
  });
}

function processaJogada(jogada: string, i: number[], j: number[]) {
  const jogadaCoords = jogada.split(" "); 
  const x = Number(jogadaCoords[0]);
  const y = Number(jogadaCoords[1]);

  if (x >= 0 && x < 10 && y >= 0 && y < 10) {
      if (x === i[rodada] && y === j[rodada]) {
        jogadorAtual.pontos++;
        rodada++
        mapaatual = 
        [['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
        ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
        ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
        ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
        ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O']];
        enviaMensagem(`${jogadorAtual.nome} acertou o tesouro e ganhou um ponto!`);
        enviaPlacar()
        proximaRodada(i, j)
      } else {
        gerarMapa(i, j, mapaatual, x, y)
        enviaMapa()
        enviaMensagem(`\n${jogadorAtual.nome} errou... Próximo jogador`);
      }
  }
  else {
    enviaMensagem(`${jogadorAtual.nome}, jogada inválida. Tente novamente.`);
  }
}

function enviaMensagem(mensagem: string) {
jogadores.forEach((jogador) => {
jogador.socket.write(`${mensagem}\n`);
});
}
    
function enviaPlacar() {
jogadores.forEach((jogador) => {
jogador.socket.write(`Pontuação: ${jogador.pontos}\n`);
});
}
    
function removeJogador(jogador: Jogador) {
const index = jogadores.indexOf(jogador);
if (index !== -1) {
jogadores.splice(index, 1);
}
}
});
    
const PORT = 3000;
const HOST = "127.0.0.1";
    
server.listen(PORT, HOST, () => {
console.log(`Servidor rodando em ${HOST}:${PORT}`);
});