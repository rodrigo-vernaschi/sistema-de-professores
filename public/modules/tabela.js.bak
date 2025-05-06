import { enviarRequisicao, exibirMensagem } from "./utils.js"
import { createConfirmationModal } from "./modal.js" // Importando o modal genérico

// Função para carregar a tabela de emails
export async function carregarTabelaEmails() {
    try {
        const res = await fetch("/emails-autorizados")
        const emails = await res.json()

        const tabela = document.getElementById("tabelaEmails")
        const semEmails = document.getElementById("semEmails")

        tabela.innerHTML = ""

        if (emails.length === 0) {
            semEmails.style.display = "block"
        } else {
            semEmails.style.display = "none"
            emails.forEach((emailObj) => {
                const { _id, email } = emailObj // Desestrutura o objeto corretamente

                const linha = document.createElement("tr")
                linha.innerHTML = `
                    <td>${email}</td>
                    <td>
                        <button class="btn btn-sm btn-danger" data-id="${_id}" data-email="${email}">Excluir</button>
                    </td>
                `

                // Adiciona evento ao botão de exclusão
                linha.querySelector("button").addEventListener("click", async (event) => {
                    const id = event.target.getAttribute("data-id")
                    const email = event.target.getAttribute("data-email")

                    // Exibe o modal de confirmação
                    createConfirmationModal(`Você tem certeza que deseja excluir o email: ${email}?`, async () => {
                        // Envia requisição para deletar o email
                        const { success, message } = await enviarRequisicao(`/email/${id}`, "DELETE")

                        // Log para verificar a resposta
                        console.log("Resposta da exclusão:", success, message)

                        // Exibe a mensagem de sucesso ou erro
                        exibirMensagem("mensagem", message, success)

                        if (success) {
                            // Atualiza a tabela sem recarregar a página
                            await carregarTabelaEmails() // Atualiza a tabela
                        }
                    })
                })

                tabela.appendChild(linha)
            })
        }
    } catch (err) {
        console.log("Erro ao carregar emails: ", err)
    }
}
