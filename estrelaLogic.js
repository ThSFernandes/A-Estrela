import constantes from 'constantes.js';
import gerarCaminho from 'encontrarCaminho.js';
export default desenharNodes;

const EnumEstadosCampo = {
    espaco: 'espaco',
    parede: 'parede',
    caminho: 'caminho',
    fechado: 'fechado',
    aberto: 'aberto'
};

const estadosCampo = Object.values(EnumEstadosCampo);

const grade = document.getElementById('grid');
const botaoGerarCampo = document.getElementById('botaoGerarCampo');
const botaoGerarCaminho = document.getElementById('botaoGerarCaminho');

let campoAtual;


botaoGerarCampo.onclick = () => {

    botaoGerarCaminho.style.display = 'inline-block';

    campoAtual = criarCampoPadrao();
    //campoAtual = criarCampoAleatorio();

    desenhar(campoAtual);
}

botaoGerarCaminho.onclick = () => {
    gerarCaminho(campoAtual);
}

function desenharNodes(matriz) {
    grade.innerHTML = '';
    const gridContainer = document.getElementById('grid');

    for (let i = 0; i < matriz.length; i++) {
        for (let j = 0; j < matriz[i].length; j++) {
            const celula = document.createElement('div');
            celula.className = `grid-item ${matriz[i][j].estado}`;
            celula.style.fontSize = '10px';

            if(matriz[i][j].f !== 0) {
                const f = matriz[i][j].f;
                const g = matriz[i][j].g;
                const h = matriz[i][j].h;
                const seta = constantes.direcoes.get(-matriz[i][j].deltaX + ', ' + matriz[i][j].deltaY);
    
                celula.innerHTML = `F: ${f}<br>G: ${g} ${seta}<br>H: ${h}`;
            }

            gridContainer.appendChild(celula);
        }
    }
}

function desenhar(matriz) {
    grade.innerHTML = '';
    const gridContainer = document.getElementById('grid');

    for (let i = 0; i < matriz.length; i++) {
        for (let j = 0; j < matriz[i].length; j++) {
            const celula = document.createElement('div');
            celula.className = `grid-item ${matriz[i][j]}`;
            gridContainer.appendChild(celula);
        }
    }
}

function criarCampoAleatorio() {
    const matriz = [];
    for (let i = 0; i < 20; i++) {
        matriz[i] = [];
        for (let j = 0; j < 20; j++) {
            const indiceAleatorio = getNumeroAleatorio(2);
            const estadoAleatorio = estadosCampo[indiceAleatorio];
            matriz[i][j] = estadoAleatorio;
        }
    }
    return matriz;
}

function getNumeroAleatorio(max) {
    return Math.floor(Math.random() * max);
}


function criarCampoPadrao() {
    
    const campo = [];

    const linhas = constantes.padraoString.split("n");

    for (let i = 0; i < linhas.length; i++) {
        const linha = linhas[i];
        campo[i] = [];

        for (let j = 0; j < linha.length; j++) {
            const caractere = linha.charAt(j);
            campo[i][j] = estadosCampo[parseInt(caractere)];
        }
    }

    return campo;
}

function iniciarCampo() {
    campoAtual = Array(20).fill().map(() => Array(20).fill(EnumEstadosCampo.espaco));
    desenhar(campoAtual);
}

iniciarCampo();