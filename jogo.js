import prompt from 'prompt-sync'

const input = prompt()

console.clear()

let mapa = [['*', '*', '*', '*', '*', '*', '*', '*'], ['*', '*', '*', '*', '*', '*', '*', '*'], ['*', '*', '*', '*', '*', '*', '*', '*'], ['*', '*', '*', '*', '*', '*', '*', '*'], ['*', '*', '*', '*', '*', '*', '*', '*'], ['*', '*', '*', '*', '*', '*', '*', '*'], ['*', '*', '*', '*', '*', '*', '*', '*'], ['*', '*', '*', '*', '*', '*', '*', '*']]

const tesouro = gerarTesouro()

imprime(mapa)

let casa = [10, 10]

if (casa[0] === tesouro[0] && casa[1] === tesouro[1]) {
    console.log("Parabens");
}

while (casa[0] !== tesouro[0] && casa[1] !== tesouro[1]) {
    let opcao = input("Digite a casa: ")
    let casa = converter(opcao)

    if (verificar(opcao)) {

        console.clear()
        if (mapa[casa[0]][casa[1]] == "X") {
            console.log("Casa já escolhida, Digite outra.");
        } else if (casa[0] < tesouro[0] && casa[1] < tesouro[1]) {
            console.log("Você Errou");
            console.log("Mais para baixo e para a direita");
        } else if (casa[0] > tesouro[0] && casa[1] < tesouro[1]) {
            console.log("Você Errou");
            console.log("Mais para cima e para a direita");
        } else if (casa[0] > tesouro[0] && casa[1] > tesouro[1]) {
            console.log("Você Errou");
            console.log("Mais para cima e para a esquerda");
        } else if (casa[0] < tesouro[0] && casa[1] > tesouro[1]) {
            console.log("Você Errou");
            console.log("Mais para baixo e para a esquerda");
        } else if (casa[0] == tesouro[0] && casa[1] < tesouro[1]) {
            console.log("Você Errou");
            console.log("Mais para a direita");
        } else if (casa[0] == tesouro[0] && casa[1] > tesouro[1]) {
            console.log("Você Errou");
            console.log("Mais para a esquerda");
        } else if (casa[0] < tesouro[0] && casa[1] == tesouro[1]) {
            console.log("Você Errou");
            console.log("Mais para a baixo");
        } else if (casa[0] > tesouro[0] && casa[1] == tesouro[1]) {
            console.log("Você Errou");
            console.log("Mais para a cima");
        } else {
            console.log("Parabéns você acertou!");
            break
        }
        mapa[casa[0]][casa[1]] = 'X'
        console.log();
        imprime(mapa)

    } else {
        console.log('Digite uma casa válida!')
    }

}


function gerarNumero() {
    const numero = Math.floor(Math.random() * 8)

    return numero
}

function gerarTesouro() {
    const x = gerarNumero()
    const y = gerarNumero()

    return [x, y]
}

function converter(opcao) {
    const casas = [['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8'], ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8'], ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8'], ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8'], ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8'], ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8'], ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8'], ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8']]

    let x = 0
    let y = 0

    for (let i = 0; i < casas.length; i++) {
        for (let k = 0; k < casas[i].length; k++) {
            if (casas[i][k].toLowerCase() === opcao.toLowerCase()) {
                x = i
                y = k
            }
        }
    }

    return [x, y]
}

function verificar(opcao) {
    const casas = [['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8'], ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8'], ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8'], ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8'], ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8'], ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8'], ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8'], ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8']]

    for (let i = 0; i < casas.length; i++) {
        for (let k = 0; k < casas[i].length; k++) {
            if (casas[i][k].toLowerCase() === opcao.toLowerCase()) {
                return true
            }
        }
    }

    return false
}

function imprime() {
    const letras = ["B", 'C', 'D', 'E', 'F', 'G', 'H']
    console.log("  1 2 3 4 5 6 7 8")
    let imprime = "A"

    for (let i = 0; i < mapa.length; i++) {
        for (let k = 0; k < mapa[i].length; k++) {
            imprime += ` ${mapa[i][k]}`
        }
        if (i < 7) {
            imprime += `\n${letras[i]}`
        }
    }

    console.log(imprime)
}
