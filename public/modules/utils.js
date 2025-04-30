// Função para exibir uma mensagem na tela (sucesso ou erro)
export function exibirMensagem(elementId, mensagem, sucesso = true) {
    const elemento = document.getElementById(elementId)
    if (!elemento) return

    elemento.textContent = mensagem
    elemento.className = sucesso ? "text-success" : "text-danger"
}

// Função para fazer uma requisição HTTP e tratar resposta JSON
export async function enviarRequisicao(url, metodo, corpo = null) {
    const config = {
        method: metodo,
        headers: {
            "Content-Type": "application/json",
        },
    }

    if (corpo) {
        config.body = JSON.stringify(corpo)
    }

    try {
        const response = await fetch(url, config)

        // Verificando se a resposta da API é bem-sucedida
        if (!response.ok) {
            const erroData = await response.json()
            return { success: false, message: erroData.message || "Erro desconhecido" }
        }

        const data = await response.json()

        // Retornando a resposta no formato correto (success e message)
        return {
            success: data.success !== undefined ? data.success : true, // Se não tiver success, assumimos que é um sucesso
            message: data.message || "Operação realizada com sucesso",
        }
    } catch (error) {
        console.error("Erro ao enviar requisição:", error)
        return { success: false, message: "Erro ao processar a requisição" }
    }
}

// Função para verificar se o usuário está autenticado (com base no JWT no localStorage)
export function verificarAutenticacao() {
    const token = localStorage.getItem("authToken")

    if (!token) {
        window.location.href = "index.html" // redireciona para o login se não houver token
    }

    return token
}

// Função para configurar o cabeçalho de uma requisição com token
export function obterCabecalhoAutenticacao() {
    const token = verificarAutenticacao()
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    }
}
