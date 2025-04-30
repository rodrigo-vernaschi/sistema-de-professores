import { exibirMensagem, enviarRequisicao } from "./utils.js"
import { carregarTabelaEmails } from "./tabela.js"

export function setupFormularioCadastro() {
    const form = document.getElementById("formCadastro")
    if (!form) return

    form.addEventListener("submit", async (e) => {
        e.preventDefault()

        const emailInput = document.getElementById("email")
        const email = emailInput?.value?.trim()

        if (!email) {
            exibirMensagem("mensagem", "Email inválido", false)
            return
        }

        try {
            // Enviar a requisição para o backend
            const { success, message } = await enviarRequisicao("/novo-professor", "POST", { email })

            // Exibir a mensagem com base na resposta da requisição
            exibirMensagem("mensagem", message, success)

            if (success) {
                // Limpar o campo de email e atualizar a tabela de emails
                emailInput.value = ""
                await carregarTabelaEmails()
            }
        } catch (error) {
            // Exibir mensagem de erro se algo der errado
            exibirMensagem("mensagem", "Erro ao cadastrar professor", false)
        }
    })
}
