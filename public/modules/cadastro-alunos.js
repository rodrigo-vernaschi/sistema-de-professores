import { createConfirmationModal } from "./modal.js"
import { verificarLoginOuRedirecionar } from "./auth.js"
import { exibirMensagem } from "./utils.js"

// Verifica se o usuário está logado
verificarLoginOuRedirecionar()

// Função para adicionar a classe de destaque a uma linha da tabela
async function destacarNovoAluno(alunoId) {
    const linhaNovoAluno = document.getElementById(alunoId)
    if (linhaNovoAluno) {
        linhaNovoAluno.classList.add("destaque")
    }
}

// Função assíncrona para carregar os últimos alunos cadastrados da API
async function carregarUltimosAlunos() {
    try {
        const response = await fetch("/api/alunos/recentes")
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`)
        }

        const alunos = await response.json()
        const tbody = document.querySelector("#tabela-ultimos-alunos tbody")
        tbody.innerHTML = ""

        alunos.forEach((aluno) => {
            const linha = document.createElement("tr")
            linha.id = aluno._id

            linha.innerHTML = `
                <td>${aluno.nome}</td>
                <td>${aluno.instrumentos ? aluno.instrumentos.join(", ") : "Não informado"}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="verPerfil('${aluno._id}')">Ver Perfil</button>
                    <button class="btn btn-sm btn-outline-danger ms-1" onclick="confirmarExclusao('${aluno._id}', '${aluno.nome}')">Excluir</button>
                </td>
            `

            tbody.appendChild(linha)
        })
    } catch (error) {
        console.error("Erro ao carregar últimos alunos:", error)
        exibirMensagem("mensagem", "Erro ao carregar últimos alunos", false)
    }
}

// Função para visualizar o perfil do aluno
window.verPerfil = function (id) {
    window.location.href = `perfil.html?id=${id}`
}

// Função para confirmar exclusão do aluno
window.confirmarExclusao = function (id, nome) {
    createConfirmationModal(`Tem certeza que deseja excluir o aluno "${nome}"? Esta ação não pode ser desfeita.`, () => excluirAluno(id))
}

// Função para excluir aluno
async function excluirAluno(id) {
    try {
        const response = await fetch(`/api/alunos/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })

        const result = await response.json()

        if (result.success) {
            exibirMensagem("mensagem", "Aluno excluído com sucesso!", true)
            await carregarUltimosAlunos()
        } else {
            exibirMensagem("mensagem", result.message || "Erro ao excluir aluno", false)
        }
    } catch (error) {
        console.error("Erro ao excluir aluno:", error)
        exibirMensagem("mensagem", "Erro ao excluir aluno", false)
    }
}

// Função para configurar o formulário de cadastro
function setupFormularioCadastro() {
    const form = document.getElementById("form-cadastro")
    if (!form) return

    form.addEventListener("submit", async (e) => {
        e.preventDefault()

        const formData = new FormData()

        // Obter dados do formulário
        const nome = document.getElementById("nome").value.trim()
        const fotoInput = document.getElementById("foto")
        const foto = fotoInput.files[0]

        // Obter instrumentos selecionados
        const instrumentosCheckboxes = document.querySelectorAll('input[name="instrumentos"]:checked')
        const instrumentos = Array.from(instrumentosCheckboxes).map((checkbox) => checkbox.value)

        // Validações
        if (!nome) {
            exibirMensagem("mensagem", "Por favor, preencha o nome do aluno", false)
            return
        }

        if (!foto) {
            exibirMensagem("mensagem", "Por favor, selecione uma foto de perfil", false)
            return
        }

        if (instrumentos.length === 0) {
            exibirMensagem("mensagem", "Por favor, selecione pelo menos um instrumento", false)
            return
        }

        // Montar FormData
        formData.append("nome", nome)
        formData.append("foto", foto)

        // Adicionar cada instrumento separadamente
        instrumentos.forEach((instrumento) => {
            formData.append("instrumentos", instrumento)
        })

        try {
            const response = await fetch("/cadastro-aluno", {
                method: "POST",
                body: formData,
            })

            const result = await response.json()

            if (result.success) {
                exibirMensagem("mensagem", "Aluno cadastrado com sucesso!", true)
                form.reset()
                await carregarUltimosAlunos()
            } else {
                exibirMensagem("mensagem", result.message || "Erro ao cadastrar aluno", false)
            }
        } catch (error) {
            console.error("Erro ao cadastrar aluno:", error)
            exibirMensagem("mensagem", "Erro ao cadastrar aluno", false)
        }
    })
}

// Inicialização quando o DOM carrega
document.addEventListener("DOMContentLoaded", () => {
    setupFormularioCadastro()
    carregarUltimosAlunos()
})
