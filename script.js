/* ============================================================
   JOGO DE CIÊNCIAS — VERDADEIRO OU FALSO
   6º ANO DO ENSINO FUNDAMENTAL
   ============================================================ */

// ---------- CONFIGURAÇÕES ----------
const TOTAL_PERGUNTAS = 10;
const TEMPO_POR_PERGUNTA = 15; // segundos
const PONTOS_POR_ACERTO = 100;
const BONUS_POR_SEGUNDO = 5; // pontos extras por segundo restante

// ---------- BANCO DE PERGUNTAS ----------
// Todas adequadas ao 6º ano — Ciências
const BANCO_PERGUNTAS = [
    {
        afirmacao: "As plantas produzem seu próprio alimento por meio da fotossíntese.",
        resposta: true,
        explicacao: "Isso mesmo! Na fotossíntese, as plantas usam luz do Sol, água e gás carbônico para produzir seu alimento (glicose) e liberar oxigênio."
    },
    {
        afirmacao: "O coração é o órgão responsável por bombear o sangue para todo o corpo.",
        resposta: true,
        explicacao: "Correto! O coração bombeia o sangue que leva oxigênio e nutrientes para todas as células do corpo."
    },
    {
        afirmacao: "Os fungos são plantas que realizam fotossíntese como as árvores.",
        resposta: false,
        explicacao: "Falso! Os fungos NÃO são plantas e NÃO fazem fotossíntese. Eles se alimentam de matéria orgânica em decomposição."
    },
    {
        afirmacao: "A água ferve a 100 °C ao nível do mar.",
        resposta: true,
        explicacao: "Verdade! Ao nível do mar, a água passa do estado líquido para o gasoso a 100 °C."
    },
    {
        afirmacao: "A Terra é o único planeta do Sistema Solar que possui vida.",
        resposta: true,
        explicacao: "Até hoje, sim! A Terra é o único planeta conhecido com condições para a vida: água líquida, atmosfera e temperatura adequada."
    },
    {
        afirmacao: "Os animais herbívoros se alimentam exclusivamente de carne.",
        resposta: false,
        explicacao: "Falso! Herbívoros comem plantas e vegetais. Quem come carne são os carnívoros, e os onívoros comem de tudo."
    },
    {
        afirmacao: "O oxigênio é o gás que nós precisamos respirar para viver.",
        resposta: true,
        explicacao: "Exato! Nosso corpo precisa de oxigênio para realizar a respiração celular e produzir energia."
    },
    {
        afirmacao: "A Lua é uma estrela que brilha com luz própria.",
        resposta: false,
        explicacao: "Falso! A Lua é um satélite natural e NÃO tem luz própria. Ela reflete a luz do Sol."
    },
    {
        afirmacao: "As bactérias são seres vivos microscópicos formados por uma única célula.",
        resposta: true,
        explicacao: "Verdade! As bactérias são unicelulares (uma só célula) e só podem ser vistas com microscópio."
    },
    {
        afirmacao: "O esqueleto humano é formado por ossos que protegem órgãos como o cérebro e o coração.",
        resposta: true,
        explicacao: "Correto! O crânio protege o cérebro e a caixa torácica (costelas) protege o coração e os pulmões."
    },
    {
        afirmacao: "O Sol é um planeta que gira em torno da Terra.",
        resposta: false,
        explicacao: "Falso! O Sol é uma estrela e é a Terra que gira em torno dele, junto com os outros planetas."
    },
    {
        afirmacao: "A cadeia alimentar mostra a transferência de energia entre os seres vivos.",
        resposta: true,
        explicacao: "Isso! Na cadeia alimentar, a energia passa dos produtores para os consumidores e depois para os decompositores."
    },
    {
        afirmacao: "O ar que respiramos é composto apenas de oxigênio.",
        resposta: false,
        explicacao: "Falso! O ar é uma mistura: cerca de 78% de nitrogênio, 21% de oxigênio e outros gases em pequena quantidade."
    },
    {
        afirmacao: "As células são as menores unidades vivas do nosso corpo.",
        resposta: true,
        explicacao: "Verdade! Todos os seres vivos são formados por células, que são a menor unidade da vida."
    },
    {
        afirmacao: "A poluição do ar pode causar problemas respiratórios nas pessoas.",
        resposta: true,
        explicacao: "Sim! A poluição do ar prejudica os pulmões e pode causar asma, bronquite e outras doenças respiratórias."
    }
];

// ---------- ESTADO DO JOGO ----------
let perguntasSorteadas = [];
let indiceAtual = 0;
let pontos = 0;
let acertos = 0;
let erros = 0;
let tempoRestante = TEMPO_POR_PERGUNTA;
let intervaloTimer = null;
let respondeu = false;

// ---------- REFERÊNCIAS DO DOM ----------
const telaInicio = document.getElementById("tela-inicio");
const telaJogo = document.getElementById("tela-jogo");
const telaFinal = document.getElementById("tela-final");

const btnComecar = document.getElementById("btn-comecar");
const btnReiniciar = document.getElementById("btn-reiniciar");
const btnVerdadeiro = document.getElementById("btn-verdadeiro");
const btnFalso = document.getElementById("btn-falso");
const btnProxima = document.getElementById("btn-proxima");

const contadorPergunta = document.getElementById("contador-pergunta");
const placar = document.getElementById("placar");
const acertosEl = document.getElementById("acertos");
const tempoTexto = document.getElementById("tempo-texto");
const timerBarra = document.getElementById("timer-barra");
const textoPergunta = document.getElementById("texto-pergunta");

const feedback = document.getElementById("feedback");
const feedbackCaixa = document.getElementById("feedback-caixa");
const feedbackIcone = document.getElementById("feedback-icone");
const feedbackTitulo = document.getElementById("feedback-titulo");
const feedbackTexto = document.getElementById("feedback-texto");
const feedbackPontos = document.getElementById("feedback-pontos");

const finalEmoji = document.getElementById("final-emoji");
const finalTitulo = document.getElementById("final-titulo");
const finalMensagem = document.getElementById("final-mensagem");
const finalPontos = document.getElementById("final-pontos");
const finalAcertos = document.getElementById("final-acertos");
const finalErros = document.getElementById("final-erros");
const finalAproveitamento = document.getElementById("final-aproveitamento");

// ---------- FUNÇÕES AUXILIARES ----------
function mostrarTela(tela) {
    document.querySelectorAll(".tela").forEach(t => t.classList.remove("ativa"));
    tela.classList.add("ativa");
}

function embaralhar(array) {
    const copia = [...array];
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
}

function atualizarStatus() {
    contadorPergunta.textContent = `${indiceAtual + 1}/${TOTAL_PERGUNTAS}`;
    placar.textContent = pontos;
    acertosEl.textContent = acertos;
}

// ---------- TIMER ----------
function iniciarTimer() {
    pararTimer();
    tempoRestante = TEMPO_POR_PERGUNTA;
    atualizarTimerVisual();

    intervaloTimer = setInterval(() => {
        tempoRestante--;
        atualizarTimerVisual();

        if (tempoRestante <= 0) {
            pararTimer();
            if (!respondeu) {
                responder(null); // tempo esgotado = resposta nula
            }
        }
    }, 1000);
}

function pararTimer() {
    if (intervaloTimer) {
        clearInterval(intervaloTimer);
        intervaloTimer = null;
    }
}

function atualizarTimerVisual() {
    tempoTexto.textContent = `${tempoRestante}s`;
    const porcentagem = (tempoRestante / TEMPO_POR_PERGUNTA) * 100;
    timerBarra.style.width = `${porcentagem}%`;

    if (tempoRestante <= 5) {
        timerBarra.classList.add("perigo");
    } else {
        timerBarra.classList.remove("perigo");
    }
}

// ---------- FLUXO DO JOGO ----------
function iniciarJogo() {
    // Sorteia perguntas
    perguntasSorteadas = embaralhar(BANCO_PERGUNTAS).slice(0, TOTAL_PERGUNTAS);
    indiceAtual = 0;
    pontos = 0;
    acertos = 0;
    erros = 0;
    respondeu = false;

    atualizarStatus();
    mostrarTela(telaJogo);
    carregarPergunta();
}

function carregarPergunta() {
    respondeu = false;
    const perguntaAtual = perguntasSorteadas[indiceAtual];

    textoPergunta.textContent = perguntaAtual.afirmacao;

    btnVerdadeiro.disabled = false;
    btnFalso.disabled = false;

    atualizarStatus();
    iniciarTimer();
}

function responder(respostaUsuario) {
    if (respondeu) return;
    respondeu = true;

    pararTimer();
    btnVerdadeiro.disabled = true;
    btnFalso.disabled = true;

    const perguntaAtual = perguntasSorteadas[indiceAtual];
    const acertou = respostaUsuario === perguntaAtual.resposta;

    if (acertou) {
        // Pontos base + bônus por tempo
        const bonus = tempoRestante * BONUS_POR_SEGUNDO;
        const pontosGanhos = PONTOS_POR_ACERTO + bonus;
        pontos += pontosGanhos;
        acertos++;
        mostrarFeedback(true, perguntaAtual.explicacao, pontosGanhos);
    } else {
        erros++;
        if (respostaUsuario === null) {
            mostrarFeedback(false, `⏰ Tempo esgotado! ${perguntaAtual.explicacao}`, 0, true);
        } else {
            mostrarFeedback(false, perguntaAtual.explicacao, 0);
        }
    }

    atualizarStatus();
}

function mostrarFeedback(acertou, explicacao, pontosGanhos, tempoEsgotado = false) {
    feedbackCaixa.classList.remove("acerto", "erro");

    if (acertou) {
        feedbackCaixa.classList.add("acerto");
        feedbackIcone.textContent = "✅";
        feedbackTitulo.textContent = "Muito bem!";
        feedbackPontos.textContent = `+${pontosGanhos} pontos! 🎉`;
    } else {
        feedbackCaixa.classList.add("erro");
        feedbackIcone.textContent = tempoEsgotado ? "⏰" : "❌";
        feedbackTitulo.textContent = tempoEsgotado ? "Tempo esgotado!" : "Ops, não foi dessa vez!";
        feedbackPontos.textContent = "0 pontos";
    }

    feedbackTexto.textContent = explicacao;

    // Texto do botão muda se for a última pergunta
    if (indiceAtual === TOTAL_PERGUNTAS - 1) {
        btnProxima.textContent = "Ver resultado 🏁";
    } else {
        btnProxima.textContent = "Continuar ▶";
    }

    feedback.classList.remove("escondido");
}

function proximaPergunta() {
    feedback.classList.add("escondido");
    indiceAtual++;

    if (indiceAtual >= TOTAL_PERGUNTAS) {
        finalizarJogo();
    } else {
        carregarPergunta();
    }
}

function finalizarJogo() {
    pararTimer();
    mostrarTela(telaFinal);

    const aproveitamento = Math.round((acertos / TOTAL_PERGUNTAS) * 100);

    finalPontos.textContent = pontos;
    finalAcertos.textContent = acertos;
    finalErros.textContent = erros;
    finalAproveitamento.textContent = `${aproveitamento}%`;

    // Mensagem personalizada
    if (aproveitamento === 100) {
        finalEmoji.textContent = "🏆";
        finalTitulo.textContent = "Perfeito! Você é um cientista!";
        finalMensagem.textContent = "Acertou todas as perguntas! Incrível!";
    } else if (aproveitamento >= 70) {
        finalEmoji.textContent = "🌟";
        finalTitulo.textContent = "Muito bem!";
        finalMensagem.textContent = "Você conhece bastante sobre Ciências! Continue assim!";
    } else if (aproveitamento >= 50) {
        finalEmoji.textContent = "👍";
        finalTitulo.textContent = "Bom trabalho!";
        finalMensagem.textContent = "Você está no caminho certo. Estude mais um pouquinho e você vai arrasar!";
    } else {
        finalEmoji.textContent = "📚";
        finalTitulo.textContent = "Continue estudando!";
        finalMensagem.textContent = "Não desanime! Revise o conteúdo e tente novamente. Você consegue!";
    }
}

// ---------- EVENTOS ----------
btnComecar.addEventListener("click", iniciarJogo);
btnReiniciar.addEventListener("click", () => {
    mostrarTela(telaInicio);
});
btnVerdadeiro.addEventListener("click", () => responder(true));
btnFalso.addEventListener("click", () => responder(false));
btnProxima.addEventListener("click", proximaPergunta);

// Atalhos de teclado (V = verdadeiro, F = falso)
document.addEventListener("keydown", (e) => {
    if (!telaJogo.classList.contains("ativa")) return;
    if (respondeu) return;

    const tecla = e.key.toLowerCase();
    if (tecla === "v" || tecla === "1") {
        responder(true);
    } else if (tecla === "f" || tecla === "2") {
        responder(false);
    }
});