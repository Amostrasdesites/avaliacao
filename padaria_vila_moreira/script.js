// ==========================================================
// PADARIA VILA MOREIRA — Arquivo de Funcionalidades
// ==========================================================

// DADOS DE CONFIGURAÇÃO — Altere aqui conforme necessário
const CONFIG = {
    CHAVE_DADOS_USUARIO: 'padaria_vila_moreira_usuario',
    NUMERO_WHATSAPP: '5511999999' // DDD + número, só dígitos
};

// ==========================================================
// CONTROLE DE ENTRADA — SEM ALTERAÇÃO DEPOIS DE SALVO
// ==========================================================

function gerarIdentificador() {
    return Math.floor(Math.random() * 9000 + 1000); // 4 dígitos: 1000 a 9999
}

function getDadosUsuario() {
    const dados = localStorage.getItem(CONFIG.CHAVE_DADOS_USUARIO);
    return dados ? JSON.parse(dados) : null;
}

function validarNomeCompleto(nome) {
    const limpo = nome.trim();
    if (limpo.length < 5 || !limpo.includes(' ')) return false;
    const regex = /^[A-Za-zÀ-ÿ\s]+$/;
    return regex.test(limpo);
}

function salvarUsuario(nomeCompleto) {
    const dados = {
        nome: nomeCompleto.trim(),
        id: gerarIdentificador()
    };
    localStorage.setItem(CONFIG.CHAVE_DADOS_USUARIO, JSON.stringify(dados));
    return dados;
}

function getNomeExibicao() {
    const usuario = getDadosUsuario();
    if (!usuario) return '';
    return `${usuario.nome} #${usuario.id}`;
}

function getSaudacao() {
    const usuario = getDadosUsuario();
    if (!usuario) return 'Olá! ';
    return `Olá! Eu sou ${usuario.nome} (ID: ${usuario.id}). `;
}

function liberarSite() {
    const usuario = getDadosUsuario();
    if (!usuario) return;

    document.getElementById('telaEntrada').classList.add('oculta');
    document.getElementById('conteudoSite').classList.add('visivel');

    document.getElementById('saudacaoUsuario').innerHTML = 
        `👋 Olá, ${usuario.nome}! <span class="identificador-usuario">#${usuario.id}</span>`;

    document.getElementById('nomeUsuarioExibicao').textContent = getNomeExibicao();
}

// ==========================================================
// INICIALIZAÇÃO
// ==========================================================
document.addEventListener('DOMContentLoaded', () => {
    // Se já tem dados salvos → entra direto
    if (getDadosUsuario()) {
        liberarSite();
    }

    // Botão Entrar
    document.getElementById('botaoEntrar').addEventListener('click', () => {
        const campo = document.getElementById('campoNomeCompleto');
        const nomeDigitado = campo.value;

        if (validarNomeCompleto(nomeDigitado)) {
            salvarUsuario(nomeDigitado);
            liberarSite();
        } else {
            campo.classList.add('invalido');
            document.getElementById('avisoErroEntrada').classList.add('mostrar');
            campo.focus();
        }
    });

    // Tecla Enter no campo de nome
    document.getElementById('campoNomeCompleto').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('botaoEntrar').click();
        }
    });

    // Limpa erro ao digitar
    document.getElementById('campoNomeCompleto').addEventListener('input', () => {
        document.getElementById('campoNomeCompleto').classList.remove('invalido');
        document.getElementById('avisoErroEntrada').classList.remove('mostrar');
    });
});

// ==========================================================
// NAVEGAÇÃO ENTRE PÁGINAS
// ==========================================================
function irParaPagina(id) {
    event.preventDefault();
    document.querySelectorAll('.pagina').forEach(pag => pag.classList.remove('ativa'));
    setTimeout(() => {
        const alvo = document.getElementById(`pagina-${id}`);
        if (alvo) alvo.classList.add('ativa');
    }, 60);
    document.getElementById('menuPrincipal').classList.remove('aberto');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function alternarMenu() {
    document.getElementById('menuPrincipal').classList.toggle('aberto');
}

// ==========================================================
// FILTRO DE PRODUTOS
// ==========================================================
function filtrarCategoria(categoria, botao) {
    document.querySelectorAll('.categoria-botao').forEach(btn => btn.classList.remove('ativa'));
    botao.classList.add('ativa');
    document.querySelectorAll('.produto-card').forEach(card => {
        const pertence = card.dataset.categoria === categoria || categoria === 'todos';
        card.classList.toggle('escondido', !pertence);
    });
}

// ==========================================================
// WHATSAPP — MENSAGENS PRONTAS
// ==========================================================
function interessado(nomeProduto, precoProduto) {
    const mensagem = `${getSaudacao()}vi o produto ${nomeProduto} — ${precoProduto}. Gostaria de saber mais informações ou fazer o pedido.`;
    window.open(`https://wa.me/${CONFIG.NUMERO_WHATSAPP}?text=${encodeURIComponent(mensagem)}`, '_blank');
}

function abrirWhatsContato() {
    const mensagem = `${getSaudacao()}conheci o site da Padaria Vila Moreira e gostaria de fazer um pedido ou tirar uma dúvida.`;
    window.open(`https://wa.me/${CONFIG.NUMERO_WHATSAPP}?text=${encodeURIComponent(mensagem)}`, '_blank');
}