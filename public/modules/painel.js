// Variáveis globais de paginação
let currentPage = 1 // Página atual, utilizada para controlar a paginação dos resultados.
const limit = 10 // Limite de alunos por página, define quantos alunos são exibidos por vez.
let totalAlunos = 0 // Total de alunos cadastrados, obtido do servidor para calcular a paginação.
let alunosCache = [] // Cache para armazenar os alunos (removido na versão atualizada).
let typingTimeout // Timeout para controlar o delay na busca ao digitar.
const buscaTimeout = 3000 // Tempo de delay para a busca (em milissegundos).

// Função para formatar a data no padrão brasileiro (dd/mm/aaaa)
function formatarData(dataISOString) {
    if (!dataISOString) {
        return "Não informado" // Retorna esta string se a data for nula ou indefinida.
    }
    try {
        const data = new Date(dataISOString) // Converte a string ISO para um objeto Date.
        const dia = String(data.getUTCDate()).padStart(2, "0") // Obtém o dia do mês em UTC.
        const mes = String(data.getUTCMonth() + 1).padStart(2, "0") // Obtém o mês em UTC (0-indexado).
        const ano = data.getUTCFullYear() // Obtém o ano em UTC.
        return `${dia}/${mes}/${ano}` // Retorna a data formatada.
    } catch (error) {
        console.error("Erro ao formatar data:", error)
        return "Data inválida" // Retorna esta string em caso de erro na formatação.
    }
}

// // Função para carregar a tabela de emails
// async function carregarTabelaEmails() {
//     try {
//         const res = await fetch("/emails-autorizados") // Faz uma requisição GET para obter a lista de emails autorizados.
//         const emails = await res.json() // Converte a resposta para JSON.

//         const tabela = document.getElementById("tabelaEmails") // Obtém o elemento da tabela de emails no HTML.
//         const semEmails = document.getElementById("semEmails") // Obtém o elemento de mensagem para quando não há emails.

//         tabela.innerHTML = "" // Limpa o conteúdo da tabela.

//         if (emails.length === 0) {
//             semEmails.style.display = "block" // Exibe a mensagem de que não há emails.
//         } else {
//             semEmails.style.display = "none" // Oculta a mensagem.
//             emails.forEach((emailObj) => {
//                 const { _id, email } = emailObj // Desestrutura o objeto email para obter id e email.

//                 const linha = document.createElement("tr") // Cria uma nova linha na tabela.
//                 linha.innerHTML = `
//                         <td>${email}</td>
//                         <td style="text-align: right;">
//                             <button class="btn btn-sm btn-danger" data-id="${_id}" data-email="${email}">Excluir</button>
//                         </td>
//                     ` // Define o conteúdo da linha com o email e o botão de excluir.

//                 // Adiciona evento ao botão de exclusão
//                 linha.querySelector("button").addEventListener("click", async (event) => {
//                     const id = event.target.getAttribute("data-id") // Obtém o id do email a ser excluído.
//                     const email = event.target.getAttribute("data-email") // Obtém o email a ser excluído.

//                     createConfirmationModal(
//                         // Exibe o modal de confirmação (assumindo que createConfirmationModal está definido globalmente ou importado).
//                         `Você tem certeza que deseja excluir o email: ${email}?`,
//                         async () => {
//                             const { success, message } = await enviarRequisicao(`/email/${id}`, "DELETE") // Envia requisição para deletar o email.

//                             console.log("Resposta da exclusão:", success, message) // Log para verificar a resposta.

//                             exibirMensagem("mensagem", message, success) // Exibe a mensagem de sucesso ou erro (assumindo que exibirMensagem está definido globalmente ou importado).

//                             if (success) {
//                                 await carregarTabelaEmails() // Atualiza a tabela sem recarregar a página.
//                             }
//                         }
//                     )
//                 })

//                 tabela.appendChild(linha) // Adiciona a linha à tabela.
//             })
//         }
//     } catch (err) {
//         console.log("Erro ao carregar emails: ", err) // Registra erros no console.
//     }
// }

/**
 * Carrega os alunos do servidor, aplicando paginação.
 */
function carregarAlunos(page = 1) {
    if (typeof page !== "number") page = 1
    currentPage = page // Atualiza a página atual.
    fetch(`/api/alunos?page=${currentPage}&limit=${limit}`) // Busca os alunos da página atual, limitado pelo valor de 'limit'.
        .then((response) => response.json()) // Converte a resposta para JSON.
        .then((data) => {
            totalAlunos = data.totalAlunos // Obtém o total de alunos da resposta.
            const alunos = data.alunos // Obtém o array de alunos da resposta.
            exibirAlunos(alunos) // Exibe os alunos na tabela.
            atualizarBotoesPaginacao() // Atualiza os botões de paginação.
        })
        .catch((error) => {
            console.error("Erro ao carregar os alunos:", error) // Trata erros na requisição.
        })
}

/**
 * Exibe os alunos na tabela.
 * @param {Array} alunos - Lista de alunos a serem exibidos.
 */
function exibirAlunos(alunos) {
    const tbody = document.querySelector("#tabela-alunos tbody") // Seleciona o corpo da tabela no HTML.
    tbody.innerHTML = "" // Limpa o conteúdo da tabela.

    if (alunos.length === 0) {
        const mensagem = document.createElement("tr") // Cria uma nova linha para a mensagem.
        mensagem.innerHTML = "<td colspan='2' class='text-center'>Nenhum aluno cadastrado.</td>" // Define o conteúdo da linha. Alterado para colspan 2
        tbody.appendChild(mensagem) // Adiciona a linha com a mensagem à tabela.
    } else {
        alunos.forEach((aluno) => {
            const linha = document.createElement("tr") // Cria uma linha para cada aluno.

            linha.addEventListener("click", function () {
                window.location.href = `/perfil.html?id=${aluno._id}` // Define o link para a página de perfil do aluno
            })

            linha.innerHTML = `
                <td>${aluno.nome}</td>
                <td style="text-align: center;">
                    ${aluno.instrumentos}
                </td>
                <td style="text-align: center;">
                    <button class="btn btn-info btn-sm">Detalhes</button>
                    <button class="btn btn-danger btn-sm">Excluir</button>
                </td>
            ` // Preenche a linha com os dados do aluno, mostrando apenas nome e ações.
            tbody.appendChild(linha) // Adiciona a linha preenchida à tabela.
        })
    }
}

// Função para mudar a página da tabela de alunos
function mudarPagina(direction) {
    const maxPage = Math.ceil(totalAlunos / limit) // Calcula o número máximo de páginas.
    if (direction === "prev" && currentPage > 1) {
        currentPage-- // Decrementa a página atual se não estiver na primeira página.
        carregarAlunos(currentPage) // Carrega os alunos da página anterior.
    } else if (direction === "next" && currentPage < maxPage) {
        currentPage++ // Incrementa a página atual se não estiver na última página.
        carregarAlunos(currentPage) // Carrega os alunos da próxima página.
    }
    atualizarBotoesPaginacao() // Atualiza os botões de paginação após mudar de página.
}

// Função para atualizar o estado dos botões de paginação
function atualizarBotoesPaginacao() {
    const maxPage = Math.ceil(totalAlunos / limit) // Recalcula o número máximo de páginas.
    document.getElementById("prev-btn").disabled = currentPage === 1 // Desabilita o botão "Anterior" se estiver na primeira página.
    document.getElementById("next-btn").disabled = currentPage === maxPage || maxPage === 0 // Desabilita o botão "Próximo" se estiver na última página ou não houver páginas.
}

/**
 * Filtra os alunos exibidos na tabela com base no texto de pesquisa.
 */
function filtrarAlunos() {
    const input = document.getElementById("search-alunos") // Obtém o elemento de input da busca.
    const filtro = input.value.toUpperCase() // Obtém o valor do input e converte para maiúsculo.
    const tabela = document.getElementById("tabela-alunos") // Obtém o elemento da tabela.
    const tbody = tabela.querySelector("tbody") // Obtém o corpo da tabela.

    tbody.innerHTML = filtro ? "<tr><td colspan='2' class='text-center'>Buscando...</td></tr>" : "" // Exibe "Buscando..." se o filtro não estiver vazio. Alterado para colspan 2

    clearTimeout(typingTimeout) // Limpa o timeout anterior, se existir.

    if (filtro) {
        // Verifica se o filtro não está vazio.
        typingTimeout = setTimeout(() => {
            // Envia a pesquisa para o servidor
            fetch(`/api/alunos/search?nome=${filtro}&page=${1}&limit=${limit}`) // Busca na primeira página
                .then((response) => response.json())
                .then((data) => {
                    totalAlunos = data.totalAlunos // Atualiza o total de alunos.
                    exibirAlunos(data.alunos) // Exibe os alunos encontrados.
                    atualizarBotoesPaginacao() // Atualiza a paginação.
                })
                .catch((error) => {
                    console.error("Erro ao buscar alunos:", error)
                    tbody.innerHTML = "<tr><td colspan='2' class='text-center'>Erro ao buscar alunos.</td></tr>" // Exibe mensagem de erro na tabela. Alterado para colspan 2
                })
        }, buscaTimeout) // Timeout de 300ms.
    } else {
        // Se o filtro estiver vazio, recarrega a primeira página
        carregarAlunos(1)
    }
}

// Expondo a função para o escopo global para que o atributo onclick no HTML possa usá-la
window.mudarPagina = mudarPagina
window.filtrarAlunos = filtrarAlunos

// Chama a função para carregar os alunos quando o DOM estiver completamente carregado
document.addEventListener("DOMContentLoaded", () => carregarAlunos(1))
