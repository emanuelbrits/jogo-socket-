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

function gerarMapa(i: number[], j: number[]) {
  const mapa: string[][] = [];

  for (let k = 0; k < TAMANHO_MAPA; k++) {
    mapa[k] = [];
    for (let l = 0; l < TAMANHO_MAPA; l++) {
      mapa[k][l] = "O";
    }
  }

  console.log(`Tesouro: [${i[rodada]}][${j[rodada]}]`)

  console.log("Mapa atual:");
  for (let m = 0; m < TAMANHO_MAPA; m++) {
    console.log(mapa[m].join(" "));
  }

  return mapa;
}

let mapa: string[][] | null = null;

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
    enviaMensagem(`\n\nParabéns, ${vencedor.nome}! Você venceu a partida com ${vencedor.pontos} pontos.\n\nHistórico de jogos: \n${conteudoArquivo}`);
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
    mapa = gerarMapa(i, j);
    enviaMapa();
    enviaMensagem(`Começando a rodada ${contadorRodadas}...`);
    enviaPlacar();
  }
}

function enviaMapa() {
  jogadores.forEach((jogador) => {
    jogador.socket.write("Mapa:\n");
    for (let linha of mapa!) {
      jogador.socket.write(linha.join(" ") + "\n");
    }
  });
}

function processaJogada(jogada: string, i: number[], j: number[]) {
  const jogadaCoords = jogada.split(" "); 
  const x = Number(jogadaCoords[0]);
  const y = Number(jogadaCoords[1]);

  if (x >= 0 && x < mapa!.length && y >= 0 && y < mapa![0].length) {
      if (x === i[rodada] && y === j[rodada]) {
        jogadorAtual.pontos++;
        rodada++
        enviaMensagem(`${jogadorAtual.nome} acertou o tesouro e ganhou um ponto!`);
        enviaPlacar()
        proximaRodada(i, j)
      } else {
        enviaMensagem(`${jogadorAtual.nome} errou... Próximo jogador`);
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