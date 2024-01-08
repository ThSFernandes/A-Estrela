import desenharNodes from 'estrelaLogic.js';
export default gerarCaminho;

const EnumEstadosCampo = {
    espaco: 'espaco',
    parede: 'parede',
    caminho: 'caminho',
    fechado: 'fechado',
    aberto: 'aberto'
};

function Node(f, g, h, deltaX, deltaY, estado) {
    this.f = f;
    this.g = g;
    this.h = h;
    this.estado = estado;
    this.deltaX = deltaX;
    this.deltaY = deltaY;
}

function Posicao(x, y) {
    this.x = x;
    this.y = y;
}

const UNIDADE_PASSO_RETO = 10;
const UNIDADE_PASSO_DIAGONAL = Math.floor(UNIDADE_PASSO_RETO * Math.sqrt(2));

let xInicial, yInicial;
let destinoX, destinoY;

let nodesAbertos = [];
let nodesFechados = [];
let campoAtual;

let continuar = true;


async function gerarCaminho(campo) {
    
    campoAtual = campo;

    xInicial = 0, yInicial = 18;
    destinoX = 19, destinoY = 1;


    let posicaoAtual = new Posicao(xInicial, yInicial);
    nodesAbertos.push(posicaoAtual);

    let g = 0;
    let h = calcularH(posicaoAtual);
    let f = g + h;

    let indiceMenorF;
    
    let campoAnalise = inicializarCampoAnalise();
    campoAnalise[posicaoAtual.y][posicaoAtual.x] = new Node(f, g, h, 0, 0, EnumEstadosCampo.aberto);


    while (posicaoAtual.x !== destinoX || posicaoAtual.y !== destinoY) {
        indiceMenorF = getIndiceMenorF(campoAnalise);
        posicaoAtual = nodesAbertos[indiceMenorF];

        abrir(campoAnalise, indiceMenorF, posicaoAtual);
        desenharNodes(campoAnalise);
        //desenharCaminho(campoAnalise);

        await esperarClique();
        continuar = false;
    }

    desenharCaminho(campoAnalise);
    campoAnalise = [];
}

function abrir(campoAnalise, indiceMenorF, posCentral) {
    let nodeCentral = campoAnalise[posCentral.y][posCentral.x];
    let gCentral = nodeCentral.g;

    for(let i = -1; i<=1; i++) {
        for(let j = -1; j<=1; j++) {
            if(i === 0 && j === 0) {
                fecharNodeCentral(nodeCentral, posCentral, indiceMenorF)
            }
            else {
                const posAtual = new Posicao(posCentral.x + j, posCentral.y + i);
                tentarAbrirNode(campoAnalise, gCentral, posAtual, i, j);
            }
        }
    }
}

function fecharNodeCentral(nodeCentral, posCentral, indiceMenorF) {
    nodeCentral.estado = EnumEstadosCampo.fechado;
    nodesFechados.push(posCentral);
    nodesAbertos.splice(indiceMenorF, 1);
}

function tentarAbrirNode(campoAnalise, gCentral, posAtual, i, j) {

    if(!indiceValido(posAtual) || !campoValido(campoAnalise, posAtual)) {
        return;
    }
    
    let g = calcularG(gCentral, j, i);
    let h = calcularH(posAtual);
    let f = g + h;

    const indiceNoAberto = nodesAbertos.findIndex(p => p.x === posAtual.x && p.y === posAtual.y);
    
    if (indiceNoAberto >= 0) {
        if (f < nodesAbertos[indiceNoAberto].f) {
            campoAnalise[posAtual.y][posAtual.x] = new Node(f, g, h, j, i, EnumEstadosCampo.aberto);
        }
    } else {
        campoAnalise[posAtual.y][posAtual.x] = new Node(f, g, h, j, i, EnumEstadosCampo.aberto);
        nodesAbertos.push(new Posicao(posAtual.x, posAtual.y));
    }
}

function getIndiceMenorF(campoAnalise){
    let posicao = nodesAbertos[0];
    let menorF = campoAnalise[posicao.y][posicao.x].f;
    let indiceMenorF = 0;

    for(let i=1; i<nodesAbertos.length; i++) {
        posicao = nodesAbertos[i];
        if(campoAnalise[posicao.y][posicao.x].f < menorF) {
            menorF = campoAnalise[posicao.y][posicao.x].f;
            indiceMenorF = i;
        }
    }

    return indiceMenorF;
}

function indiceValido(posicao) {
    return (posicao.x >= 0 && posicao.x < campoAtual.length && posicao.y >= 0 && posicao.y <campoAtual[0].length);
}

function campoValido(campoAnalise, posicao) {
    return campoAnalise[posicao.y][posicao.x].estado === EnumEstadosCampo.aberto || campoAnalise[posicao.y][posicao.x].estado === EnumEstadosCampo.espaco;
}

function calcularG(g, deltaX, deltaY) {
    return g + ((deltaX !== 0 && deltaY !== 0) ? UNIDADE_PASSO_DIAGONAL : UNIDADE_PASSO_RETO);
}

function calcularH(posicao) {
    const deltaX = Math.abs(destinoX - posicao.x);
    const deltaY = Math.abs(destinoY - posicao.y);
    const passosDiagonais = Math.min(deltaX, deltaY);
    const passosRetos = Math.abs(deltaX - deltaY);
    return Math.floor(passosDiagonais * UNIDADE_PASSO_DIAGONAL + passosRetos * UNIDADE_PASSO_RETO);
}

function inicializarCampoAnalise() {
    let campoAnalise = Array.from(Array(campoAtual.length), () => []);

    for (let i=0; i<campoAtual.length; i++) {
        for(let j=0; j<campoAtual[i].length; j++) {
            campoAnalise[i][j] = new Node(0, 0, 0, 0, 0, campoAtual[i][j]);
        }
    }

    return campoAnalise;
}

function desenharCaminho(campoAnalise) {
    let novoCampo = inicializarCampoAnalise();
    let posicao = nodesFechados[nodesFechados.length - 1];

    novoCampo[yInicial][xInicial] = campoAnalise[yInicial][xInicial];
    novoCampo[yInicial][xInicial].estado = EnumEstadosCampo.caminho;

    while(posicao.x !== xInicial && posicao.y !== yInicial) {
        novoCampo[posicao.y][posicao.x] = campoAnalise[posicao.y][posicao.x];
        novoCampo[posicao.y][posicao.x].estado = EnumEstadosCampo.caminho;
        posicao = new Posicao(posicao.x - campoAnalise[posicao.y][posicao.x].deltaX, posicao.y - campoAnalise[posicao.y][posicao.x].deltaY);
    }
    
    desenharNodes(novoCampo);
}

document.getElementById('botaoContinuar').onclick = () => {
    continuar = true;
}

function esperarClique() {
    return new Promise(resolve => {
        const interval = setInterval(() => {
            if (continuar) {
                clearInterval(interval);
                resolve();
            }
        }, 50);
    });
}

function esperarTempo(milisegundos) {
    return new Promise(resolve => setTimeout(resolve, milisegundos));
}